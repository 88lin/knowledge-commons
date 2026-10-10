#!/usr/bin/env bash
#===============================================================
# 云计算世赛实战 · L3 容器化 Docker · 自动评分脚本 v1.0
# 镜像 · 容器 · 数据卷 · Compose · 私有仓库 —— 世赛评分点逻辑
# 用法：sudo bash grade_l3.sh   （满分 100 · 60 及格 · 85 优秀）
#===============================================================
set -u
VERBOSE=0; [ "${1:-}" = "-v" ] && VERBOSE=1
PASS=0; FAIL=0; SCORE=0; TOTAL=0
ok(){ printf "  \033[32mPASS\033[0m %3d分  %s\n" "$1" "$2"; PASS=$((PASS+1)); SCORE=$((SCORE+$1)); TOTAL=$((TOTAL+$1)); }
no(){ printf "  \033[31mFAIL\033[0m %3d分  %s\n" "$1" "$2"; FAIL=$((FAIL+1)); TOTAL=$((TOTAL+$1));
      [ $VERBOSE -eq 1 ] && [ -n "${3:-}" ] && printf "        └ 检查: %s\n" "$3"; return 0; }
chk(){ local pts="$1" desc="$2" cmd="$3"
  if eval "$cmd" >/dev/null 2>&1; then ok "$pts" "$desc"; else no "$pts" "$desc" "$cmd"; fi; }
dk(){ docker "$@" >/dev/null 2>&1; }

echo "================================================"
echo " L3 · 容器化 Docker · 评分开始  $(date '+%F %T')"
echo "================================================"

chk 10 "Docker 已安装"                     'command -v docker'
chk 10 "Docker 守护进程运行中"             'docker info'
chk 10 "自建镜像 cloudlab-web 存在"        'docker image inspect cloudlab-web'
chk 10 "容器 web1 运行中"                  'docker ps --format "{{.Names}}" | grep -qx web1'
chk 10 "web1 端口映射 8081 可访问"         'curl -s -m 5 -o /dev/null -w "%{http_code}" http://127.0.0.1:8081/ | grep -q 200'
chk 10 "web1 挂载了数据卷或绑定目录"       'docker inspect web1 --format "{{json .Mounts}}" | grep -vq "\[\]"'
chk  5 "Compose 文件存在(/opt/cloudlab)"   'ls /opt/cloudlab/docker-compose.y*ml /opt/cloudlab/compose.y*ml 2>/dev/null | grep -q .'
chk  5 "Compose 服务已运行"                'cd /opt/cloudlab 2>/dev/null && docker compose ps --status running 2>/dev/null | grep -q . || docker-compose ps 2>/dev/null | grep -q Up'
chk 10 "私有仓库 registry 运行在 5000"     'docker ps | grep -q registry && curl -s -m 5 http://127.0.0.1:5000/v2/_catalog >/dev/null'
chk 10 "镜像已推送进私有仓库"              'curl -s -m 5 http://127.0.0.1:5000/v2/_catalog | grep -q cloudlab-web'
chk 10 "web1 使用自定义网络 cloudnet"      'docker inspect web1 --format "{{range \$k,\$v := .NetworkSettings.Networks}}{{\$k}} {{end}}" | grep -qw cloudnet'

echo "------------------------------------------------"
printf " 通过 \033[32m%d\033[0m 项 · 未过 \033[31m%d\033[0m 项\n" "$PASS" "$FAIL"
printf " 得分: \033[1m%d / %d\033[0m  （60 及格 · 85 优秀 · 100 满分）\n" "$SCORE" "$TOTAL"
[ "$SCORE" -ge 85 ] && echo " 评级: 优秀 —— 进入下一关 L4 Kubernetes" && exit 0
[ "$SCORE" -ge 60 ] && echo " 评级: 及格 —— 补齐 FAIL 项后再冲优秀" && exit 0
echo " 评级: 未及格 —— 按 FAIL 逐项修复（第 10 章是答案库）"
exit 1
