# L4 · Kubernetes · 任务书（满分 100）

> 环境：≥2C4G 虚拟机（推荐 4C8G）。方案二选一：
> ① minikube（最快出集群，本关完全够用） ② kubeadm 单控制面（更接近赛场）
> 建议限时：180 分钟 · 及格 60 · 优秀 85
> 评分：`sudo bash grade_l4.sh`（自动探测 kubectl / minikube）· 对应教程第 11 章

## 背景

容器化完成，现在把业务搬上 Kubernetes：部署、暴露、持久化、配置、弹性一个不少。

## 任务清单（11 个评分点）

| # | 分值 | 评分点 | 提示 |
|---|-----|--------|------|
| 1 | 10 | kubectl 可用 | minikube：`minikube kubectl --`；脚本已自动探测 |
| 2 | 15 | 节点 Ready | `kubectl get nodes`；NotReady 多为 CNI 没装（装 flannel/calico） |
| 3 | 5 | 命名空间 `lab` | `kubectl create ns lab` |
| 4 | 10 | deployment `web` 在 lab | 用 cloudlab-web 镜像或 nginx，`kubectl create deployment web --image=... -n lab` |
| 5 | 10 | web 就绪副本 ≥2 | `kubectl scale deployment web --replicas=2 -n lab` |
| 6 | 10 | Service `web` 已建 | `kubectl expose deployment web --port=80 -n lab` |
| 7 | 15 | 集群外可达：NodePort 通 或 有 Ingress | `--type=NodePort` 后 `curl http://节点IP:nodePort`；minikube 可 `minikube service web` |
| 8 | 10 | PVC 已 Bound | 建 hostPath/local PV + PVC，pod 挂载做数据落盘 |
| 9 | 5 | 使用了 ConfigMap | 建一个 configmap 并以环境变量或文件挂进 web |
| 10 | 5 | 使用了 Secret | 建一个 secret 同样挂进去（别打明文进 yaml） |
| 11 | 5 | 可弹性伸缩到 3 副本 | 评分脚本会自动 `scale --replicas=3` 验证 |

## 验收与世赛提示

```bash
sudo bash grade_l4.sh
```

- 经典坑：镜像拉不下来 → ImagePullBackOff，先 `kubectl describe pod` 看事件再对症（国内配镜像加速或用 registry 里自己的镜像）
- 经典坑：PVC 一直 Pending → 没有可用 PV 或 StorageClass，先建 PV
- 排错三件套：`get pods` → `describe pod` → `logs`——L4 的 15 分第 7 条几乎全卡在这
- 完成 → 快照。下一站：真题轮（备战中心「真题地图」）+ 第 16 章黄金四步训练法
