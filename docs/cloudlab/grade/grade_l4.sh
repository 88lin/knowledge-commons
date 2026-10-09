#!/usr/bin/env bash
#===============================================================
# 云计算世赛实战 · L4 Kubernetes · 自动评分脚本 v1.0
# 集群 · 工作负载 · 服务暴露 · 存储配置 —— 世赛评分点逻辑
# 用法：sudo bash grade_l4.sh   （满分 100 · 60 及格 · 85 优秀）
# 兼容 kubeadm / minikube（自动探测 kubectl）
#===============================================================
set -u
VERBOSE=0; [ "${1:-}" = "-v" ] && VERBOSE=1
PASS=0; FAIL=0; SCORE=0; TOTAL=0
KC=""
for c in kubectl "minikube kubectl --"; do
  if $c version --client >/dev/null 2>&1 || $c version >/dev/null 2>&1; then KC="$c"; break; fi
done
ok(){ printf "  \033[32mPASS\033[0m %3d分  %s\n" "$1" "$2"; PASS=$((PASS+1)); SCORE=$((SCORE+$1)); TOTAL=$((TOTAL+$1)); }
no(){ printf "  \033[31mFAIL\033[0m %3d分  %s\n" "$1" "$2"; FAIL=$((FAIL+1)); TOTAL=$((TOTAL+$1));
      [ $VERBOSE -eq 1 ] && [ -n "${3:-}" ] && printf "        └ 检查: %s\n" "$3"; return 0; }
chk(){ local pts="$1" desc="$2" cmd="$3"
  if [ -n "$KC" ] && eval "$KC $cmd" >/dev/null 2>&1; then ok "$pts" "$desc"; else no "$pts" "$desc" "kubectl $cmd"; fi; }

echo "================================================"
echo " L4 · Kubernetes · 评分开始  $(date '+%F %T')"
echo " kubectl: ${KC:-未找到}   上下文: $($KC config current-context 2>/dev/null || echo 无)"
echo "================================================"

chk 10 "kubectl 可用"                      'version'
chk 15 "集群就绪且节点 Ready"              'get nodes --no-headers 2>/dev/null | grep -q " Ready"'
chk  5 "命名空间 lab 已创建"               'get namespace lab'
chk 10 "deployment web 存在于 lab"         'get deployment web -n lab'
chk 10 "web 就绪副本数 >= 2"               'get deployment web -n lab -o jsonpath="{.status.readyReplicas}" | grep -Eq "^([2-9]|[1-9][0-9])$"'
chk 10 "Service 已暴露 web"                'get service web -n lab'
np_ok(){ np=$($KC get service web -n lab -o jsonpath="{.spec.ports[0].nodePort}" 2>/dev/null); [ -n "$np" ] && curl -s -m 5 -o /dev/null "http://127.0.0.1:$np" ; }
ing_ok(){ $KC get ingress web -n lab >/dev/null 2>&1; }
chk 15 "集群外可达(NodePort 通 或 有 Ingress)" 'np_ok || ing_ok'
chk 10 "PVC 已 Bound"                      'get pvc -n lab --no-headers 2>/dev/null | grep -q Bound'
chk  5 "使用了 ConfigMap"                  'get configmap -n lab --no-headers 2>/dev/null | grep -qv NAME'
chk  5 "使用了 Secret"                     'get secret -n lab --no-headers 2>/dev/null | grep -vqE "NAME|default-token|default-token-|sh.helm"'
chk  5 "可弹性伸缩(扩到 3 副本成功)"       'scale deployment web --replicas=3 -n lab'

echo "------------------------------------------------"
printf " 通过 \033[32m%d\033[0m 项 · 未过 \033[31m%d\033[0m 项\n" "$PASS" "$FAIL"
printf " 得分: \033[1m%d / %d\033[0m  （60 及格 · 85 优秀 · 100 满分）\n" "$SCORE" "$TOTAL"
[ "$SCORE" -ge 85 ] && echo " 评级: 优秀 —— 进入故障注入排错与真题轮" && exit 0
[ "$SCORE" -ge 60 ] && echo " 评级: 及格 —— 补齐 FAIL 项后再冲优秀" && exit 0
echo " 评级: 未及格 —— 按 FAIL 逐项修复（第 11 章与排错三件套是答案库）"
exit 1
