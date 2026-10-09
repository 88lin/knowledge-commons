#!/usr/bin/env bash
#===============================================================
# 云计算世赛实战 · L1 Linux 基础 · 自动评分脚本 v1.0
# 评分逻辑与世赛一致：逐项验证、做对得分、做错不得分
# 用法（在你的 Linux 练习机上）：
#   sudo bash grade_l1.sh        # 本机评分
#   sudo bash grade_l1.sh -v     # 显示每项检查命令（复盘用）
# 满分 100 · 60 及格 · 85 优秀 · 兼容 Rocky/CentOS 与 Ubuntu/Debian
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
code(){ curl -s -m 5 -o /dev/null -w '%{http_code}' "$1" 2>/dev/null; }

echo "================================================"
echo " L1 · Linux 基础 · 评分开始  $(date '+%F %T')"
echo " 主机: $(hostname 2>/dev/null)  内核: $(uname -r 2>/dev/null)"
echo "================================================"

chk  5 "主机名为 cloudlab"                 '[ "$(hostname)" = "cloudlab" ]'
chk  5 "时区为 Asia/Shanghai"              '[ "$(timedatectl show -p Timezone --value 2>/dev/null)" = "Asia/Shanghai" ]'
chk  5 "用户 deployer 已创建"              'id deployer'
chk  5 "deployer 具备 sudo 权限"           'id -nG deployer 2>/dev/null | grep -Eqw "sudo|wheel"'
chk  5 "deployer 已配 SSH 密钥且权限 600"  '[ -f ~deployer/.ssh/authorized_keys ] && [ "$(stat -c %a ~deployer/.ssh/authorized_keys 2>/dev/null)" = "600" ]'
chk  5 "sshd 运行中且监听 22"              'svc sshd || svc ssh; port 22'
if systemctl is-active firewalld >/dev/null 2>&1; then
  chk  5 "防火墙已放行 http 服务"          'firewall-cmd --query-service=http >/dev/null'
elif command -v ufw >/dev/null 2>&1; then
  chk  5 "防火墙已放行 http(80/tcp)"       'ufw status 2>/dev/null | grep -q "80/tcp"'
else
  no 5 "防火墙已放行 http（未检测到 firewalld/ufw）" "安装并启用 firewalld 或 ufw"
fi
chk 10 "nginx 服务运行中"                  'svc nginx'
chk 10 "本机 80 端口返回 200"              '[ "$(code http://127.0.0.1/)" = "200" ]'
chk  5 "首页含 CloudLab 标识"              'curl -s -m 5 http://127.0.0.1/ 2>/dev/null | grep -q CloudLab'
chk 10 "自定义 systemd 服务 app 运行中"    'svc app'
chk  5 "备份脚本 /opt/backup.sh 存在可执行" '[ -x /opt/backup.sh ]'
chk  5 "备份已产出今日 tar.gz"             'ls /var/backups/*.tar.gz 2>/dev/null | grep -q "$(date +%Y%m%d)\|$(date +%F)"'
chk 10 "root 计划任务已配置备份"           'crontab -l -u root 2>/dev/null | grep -q backup.sh'
chk 10 "磁盘挂载点 /data 已生效"           'mountpoint -q /data'
chk  5 "sysinfo 脚本输出含内核版本"        '[ -x /opt/sysinfo.sh ] && /opt/sysinfo.sh 2>/dev/null | grep -q "$(uname -r)"'

echo "------------------------------------------------"
printf " 通过 \033[32m%d\033[0m 项 · 未过 \033[31m%d\033[0m 项\n" "$PASS" "$FAIL"
printf " 得分: \033[1m%d / %d\033[0m  （60 及格 · 85 优秀 · 100 满分）\n" "$SCORE" "$TOTAL"
[ "$SCORE" -ge 85 ] && echo " 评级: 优秀 —— 进入下一关 L2 网络服务" && exit 0
[ "$SCORE" -ge 60 ] && echo " 评级: 及格 —— 补齐 FAIL 项后再冲优秀" && exit 0
echo " 评级: 未及格 —— 按 FAIL 逐项修复后重新评分（世赛规则：改对即得分）"
exit 1
