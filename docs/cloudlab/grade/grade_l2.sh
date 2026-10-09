#!/usr/bin/env bash
#===============================================================
# 云计算世赛实战 · L2 网络服务 · 自动评分脚本 v1.0
# DNS · HTTPS · 负载均衡与健康检查 —— 世赛评分点逻辑
# 用法：sudo bash grade_l2.sh   （满分 100 · 60 及格 · 85 优秀）
#===============================================================
set -u
VERBOSE=0; [ "${1:-}" = "-v" ] && VERBOSE=1
PASS=0; FAIL=0; SCORE=0; TOTAL=0
ok(){ printf "  \033[32mPASS\033[0m %3d分  %s\n" "$1" "$2"; PASS=$((PASS+1)); SCORE=$((SCORE+$1)); TOTAL=$((TOTAL+$1)); }
no(){ printf "  \033[31mFAIL\033[0m %3d分  %s\n" "$1" "$2"; FAIL=$((FAIL+1)); TOTAL=$((TOTAL+$1));
      [ $VERBOSE -eq 1 ] && [ -n "${3:-}" ] && printf "        └ 检查: %s\n" "$3"; return 0; }
chk(){ local pts="$1" desc="$2" cmd="$3"
  if eval "$cmd" >/dev/null 2>&1; then ok "$pts" "$desc"; else no "$pts" "$desc" "$cmd"; fi; }
svc(){ systemctl is-active "$1" >/dev/null 2>&1; }
port(){ ss -ltn 2>/dev/null | grep -q ":$1 "; }

echo "================================================"
echo " L2 · 网络服务 · 评分开始  $(date '+%F %T')"
echo "================================================"

# --- DNS（dnsmasq 或 bind9 任一）---
if command -v dnsmasq >/dev/null 2>&1 || command -v named >/dev/null 2>&1; then
  ok 10 "DNS 服务器已安装（dnsmasq/bind9）"
else
  no 10 "DNS 服务器已安装（dnsmasq/bind9）" "dnf install dnsmasq 或 apt install dnsmasq"
fi
chk  5 "DNS 服务运行中"                    'svc dnsmasq || svc named || svc bind9 || svc named9'
chk 10 "dig lab.local 解析到 127.0.0.1"    'dig +short @127.0.0.1 lab.local 2>/dev/null | grep -q "127.0.0.1"'

# --- HTTPS ---
chk 10 "nginx 监听 443"                    'port 443'
chk 10 "443 返回有效 TLS 证书"             'echo | openssl s_client -connect 127.0.0.1:443 2>/dev/null | openssl x509 -noout -subject >/dev/null'
chk 10 "证书主体/CN 含 lab.local"          'echo | openssl s_client -connect 127.0.0.1:443 2>/dev/null | openssl x509 -noout -subject 2>/dev/null | grep -qi "lab.local"'
chk 10 "http 80 自动跳转 https(301/308)"   'curl -s -m 5 -o /dev/null -w "%{http_code}" -L --max-redirs 0 http://lab.local/ 2>/dev/null | grep -Eq "301|308" || curl -s -m 5 -o /dev/null -w "%{http_code}" --max-redirs 0 -H "Host: lab.local" http://127.0.0.1/ 2>/dev/null | grep -Eq "301|308"'

# --- 负载均衡 ---
chk 10 "HAProxy 已安装且运行"              'command -v haproxy >/dev/null && svc haproxy'
lb_two(){ for i in 1 2 3 4; do curl -s -m 5 http://127.0.0.1/ 2>/dev/null; done | grep -qi "web1" && for i in 1 2 3 4; do curl -s -m 5 http://127.0.0.1/ 2>/dev/null; done | grep -qi "web2"; }
chk 15 "前端 80 轮询分发到 web1/web2"      'lb_two'
chk  5 "后端配置了健康检查(check)"         'grep -Eiq "check" /etc/haproxy/haproxy.cfg 2>/dev/null'
chk  5 "HAProxy 统计页可访问(8404/8080)"   'c=$(curl -s -m 5 -o /dev/null -w "%{http_code}" http://127.0.0.1:8404/ 2>/dev/null); [ "$c" = "200" ] || [ "$(curl -s -m 5 -o /dev/null -w "%{http_code}" http://127.0.0.1:8080/ 2>/dev/null)" = "200" ]'

echo "------------------------------------------------"
printf " 通过 \033[32m%d\033[0m 项 · 未过 \033[31m%d\033[0m 项\n" "$PASS" "$FAIL"
printf " 得分: \033[1m%d / %d\033[0m  （60 及格 · 85 优秀 · 100 满分）\n" "$SCORE" "$TOTAL"
[ "$SCORE" -ge 85 ] && echo " 评级: 优秀 —— 进入下一关 L3 容器化" && exit 0
[ "$SCORE" -ge 60 ] && echo " 评级: 及格 —— 补齐 FAIL 项后再冲优秀" && exit 0
echo " 评级: 未及格 —— 按 FAIL 逐项修复（第 2/4/5/6 章是答案库）"
exit 1
