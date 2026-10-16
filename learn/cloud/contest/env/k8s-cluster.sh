#!/usr/bin/env bash
# =====================================================================
# k8s-cluster.sh · Kubernetes 集群一键脚本（容器云赛道标准考场）
# 拓扑：1 master + N node（默认 2），containerd 运行时，flannel CNI
# 兼容：CentOS 7.9+/openEuler 22.03+/Ubuntu 20.04+（自动探测）
# 用法：
#   master 侧：bash k8s-cluster.sh master [v1.28.2]
#   node   侧：bash k8s-cluster.sh node <join命令，master 输出末行会给出>
# 幂等：已完成步骤自动跳过。日志：/var/log/k8s-install.log
# =====================================================================
set -euo pipefail
LOG=/var/log/k8s-install.log
exec> >(tee -a "$LOG") 2>&1

ROLE=${1:-}
K8S_VER=${2:-v1.28.2}
POD_CIDR=${POD_CIDR:-10.244.0.0/16}
REG=${REG:-registry.aliyuncs.com/google_containers}   # 国内镜像仓库（离线环境换私有仓库）
FLANNEL_URL=${FLANNEL_URL:-https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml}

say(){ echo -e "\n\033[1;34m[K8S]\033[0m $*"; }
run(){ if eval "$*"; then say "OK: $*"; else echo "[K8S][FAIL] $*"; exit 1; fi; }
skip_ok(){ say "SKIP(已做): $*"; }

[ -z "$ROLE" ] && { echo "用法: $0 master [版本] | node <join命令>"; exit 1; }

# ---------- 0. 系统预检 ----------
if ! grep -qi 'ubuntu\|debian' /etc/os-release 2>/dev/null; then PKG=yum; else PKG=apt; fi
say "包管理: $PKG / 角色: $ROLE / 版本: $K8S_VER"

# swap / selinux / firewalld
if swapon --show 2>/dev/null | grep -q .; then run "swapoff -a"; sed -ri 's/^\s*(\/dev\S*\s+none\s+swap.*)/#\1/' /etc/fstab; else skip_ok "swap off"; fi
run "setenforce 0 2>/dev/null || true"
grep -q '^SELINUX=permissive\|^SELINUX=disabled' /etc/selinux/config 2>/dev/null || sed -ri 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config 2>/dev/null || true
run "systemctl disable --now firewalld 2>/dev/null || ufw disable 2>/dev/null || true"

# 内核模块与 sysctl
if ! lsmod | grep -q br_netfilter; then
  run "modprobe overlay && modprobe br_netfilter"
  cat >/etc/modules-load.d/k8s.conf <<EOF
overlay
br_netfilter
EOF
else skip_ok "kernel modules"; fi
if [ ! -f /etc/sysctl.d/k8s.conf ]; then
  cat >/etc/sysctl.d/k8s.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
  run "sysctl --system"
else skip_ok "sysctl"; fi

# ---------- 1. containerd ----------
if ! command -v containerd >/dev/null 2>&1; then
  if [ "$PKG" = yum ]; then
    run "$PKG install -y yum-utils && yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo || true"
    run "$PKG install -y containerd.io 2>/dev/null || $PKG install -y containerd"
  else
    run "apt-get update && apt-get install -y containerd"
  fi
else skip_ok "containerd 安装"; fi

if [ ! -f /etc/containerd/config.toml ]; then
  run "containerd config default > /etc/containerd/config.toml"
  # pause 镜像 + SystemdCgroup（两处必改，考纲重点）
  run "sed -i 's#registry.k8s.io/pause:3.[0-9]*#${REG}/pause:3.9#' /etc/containerd/config.toml"
  run "sed -i 's#SystemdCgroup = false#SystemdCgroup = true#' /etc/containerd/config.toml"
  if [ "$REG" != "registry.k8s.io" ]; then
    # 离线/国内源：sandbox_image 已改，kubeadm 用 --image-repository 即可
    say "containerd pause 镜像已指向 ${REG}"
  fi
  run "systemctl restart containerd && systemctl enable containerd"
else skip_ok "containerd 配置"; fi
run "systemctl disable --now nm-cloud-setup 2>/dev/null || true"

# ---------- 2. kubeadm/kubelet/kubectl ----------
if ! command -v kubeadm >/dev/null 2>&1; then
  if [ "$PKG" = yum ]; then
    cat >/etc/yum.repos.d/kubernetes.repo <<EOF
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=0
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
    run "$PKG install -y kubelet-${K8S_VER#v} kubeadm-${K8S_VER#v} kubectl-${K8S_VER#v} --disableexcludes=kubernetes 2>/dev/null || $PKG install -y kubelet kubeadm kubectl --disableexcludes=kubernetes"
  else
    run "apt-get update && apt-get install -y apt-transport-https ca-certificates curl gpg"
    run "curl -fsSL https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.28/deb/Release.key | gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg 2>/dev/null || true"
    run "echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.28/deb/ /' > /etc/apt/sources.list.d/kubernetes.list 2>/dev/null || true"
    run "apt-get update && apt-get install -y kubelet kubeadm kubectl"
  fi
  run "systemctl enable --now kubelet"
else skip_ok "kubeadm 安装"; fi

# ---------- 3. 角色 ----------
if [ "$ROLE" = master ]; then
  if [ ! -f /etc/kubernetes/admin.conf ]; then
    run "kubeadm init --kubernetes-version ${K8S_VER} --pod-network-cidr ${POD_CIDR} --image-repository ${REG} --apiserver-advertise-address $(hostname -I | awk '{print $1}')"
    run "mkdir -p /root/.kube && cp -f /etc/kubernetes/admin.conf /root/.kube/config"
    say "=========== JOIN 命令（在 node 上执行）==========="
    kubeadm token create --print-join-command
    say "=================================================="
  else skip_ok "kubeadm init"; fi

  # CNI（flannel）
  if ! kubectl get pods -n kube-system 2>/dev/null | grep -q flannel; then
    run "kubectl apply -f ${FLANNEL_URL} || { say 'flannel 在线拉取失败——离线环境请提前下载 kube-flannel.yml'; }"
  else skip_ok "flannel"; fi

  say "等待节点 Ready（约 30-90 秒）…"
  sleep 60
  kubectl get nodes -o wide || true
  kubectl get pods -n kube-system || true

  # metrics-server（HPA 必备，金砖/省赛运维题用）
  if ! kubectl get deployment metrics-server -n kube-system 2>/dev/null | grep -q metrics-server; then
    say "提示：metrics-server 未装。离线环境安装：kubectl apply -f metrics-server.yaml（赛场离线包内备好）"
  fi
  say "master 完成。node 侧执行上面输出的 join 命令。"
else
  # node：expects join command as $2
  JOIN=${2:-}
  [ -z "$JOIN" ] && { echo "node 侧需传入 join 命令"; exit 1; }
  if ! grep -q 'kubernetes' /etc/kubernetes/kubelet.conf 2>/dev/null; then
    run "$JOIN"
  else skip_ok "join"; fi
  say "node 完成。回 master 执行 kubectl get nodes 确认 Ready。"
fi
