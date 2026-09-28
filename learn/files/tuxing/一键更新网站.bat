@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo   图推真题库 - 一键更新到线上网站
echo ============================================
echo.

git add -A
git commit -m "更新网站内容 %date% %time%"
if errorlevel 1 (
  echo.
  echo 没有检测到文件改动，无需更新。
  pause
  exit /b 0
)

echo.
echo 正在推送到 GitHub，推送成功后约 1 分钟线上自动更新...
git push
if errorlevel 1 (
  echo.
  echo [失败] 推送没成功，多半是网络问题，重新双击本文件再试一次即可。
  pause
  exit /b 1
)

echo.
echo ============================================
echo   更新完成！约 1 分钟后刷新网址查看：
echo   https://cha551.github.io/gk-tuxing/
echo   若浏览器显示旧内容，按 Ctrl+F5 强制刷新
echo ============================================
pause
