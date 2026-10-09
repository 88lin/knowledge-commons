#!/usr/bin/env bash
#===============================================================
# 云计算世赛实战 · L1 故障注入脚本 v1.0
# 作用：向练习机注入 6 个真实故障（对应评分脚本会掉分）
# 玩法：注入 → 用第 7 章「六步破案法」限时排障 → 重跑 grade_l1.sh 恢复满分
# 用法：sudo bash make_fault.sh     （需确认才会执行）
#===============================================================
set -u
echo "==============================================="
echo " ⚠  即向本机注入 6 个故障（仅供排错训练）"
echo " 影响：nginx / app 服务 / 备份脚本 / 计划任务 / /data / 首页"
read -r -p " 确认注入？输入 YES 继续：" a
[ "$a" = "YES" ] || { echo "已取消"; exit 1; }
stamp=$(date +%s)

systemctl stop nginx >/dev/null 2>&1
echo "[1/6] nginx 已停止"

systemctl stop app >/dev/null 2>&1
echo "[2/6] 自定义服务 app 已停止"

if [ -f /opt/backup.sh ]; then mv /opt/backup.sh "/opt/backup.sh.broken.$stamp"; echo "[3/6] 备份脚本已移走"; fi
(crontab -l -u root 2>/dev/null | grep -v backup.sh) | crontab -u root - 2>/dev/null
echo "[4/6] root 计划任务中 backup 行已移除"

mountpoint -q /data && umount /data && echo "[5/6] /data 已卸载" || echo "[5/6] /data 未挂载（跳过）"

if [ -f /var/www/html/index.html ]; then
  cp /var/www/html/index.html "/var/www/html/index.html.bak.$stamp"
  echo "<h1>502 Bad Gateway</h1>" > /var/www/html/index.html
  echo "[6/6] 首页内容已破坏（备份为 index.html.bak.$stamp）"
fi

echo "-----------------------------------------------"
echo " 注入完成。现在：限时 30 分钟排障 → sudo bash grade_l1.sh 验收"
echo " 排障口诀（第 7 章）：链路 → 系统 → 服务 → 应用，先看 systemctl status 和日志"
