# CloudStudy · Windows 本机 iOS IPA 签名（zsign，免 macOS）
# ------------------------------------------------------------
# 用法：
#   .\sign.ps1 -Ipa .\zhishi-gongshe-v3.0-ios-full-unsigned.ipa `
#              -P12 .\cert.p12 -P12Pass '密码' -Prov .\app.mobileprovision
#
# 说明：
#   · 首次运行自动从 GitHub 下载 zsign 官方 Windows 版（v1.1.2）到本地缓存
#   · 需要你自己的 .p12 证书 + .mobileprovision 描述文件（Apple 开发者账号
#     在 developer.apple.com 导出；Bundle ID 需为 com.cloudstudy.app，
#     或用 -BundleId 参数把 IPA 改成你描述文件匹配的 ID）
#   · 签名后的 IPA 可用 Sideloadly / AltStore / 爱思 / TrollStore 等安装
#   · 免证书（Apple ID 7 天免费侧载）不需要本脚本，直接用 Sideloadly 装 unsigned IPA
param(
    [Parameter(Mandatory = $true)][string]$Ipa,
    [Parameter(Mandatory = $true)][string]$P12,
    [Parameter(Mandatory = $true)][string]$Prov,
    [string]$P12Pass = '',
    [string]$Out = '',
    [string]$BundleId = '',
    [string]$ZsignVer = 'v1.1.2',
    [switch]$ForceDownload
)
$ErrorActionPreference = 'Stop'

function Abs([string]$p) {
    if ([string]::IsNullOrWhiteSpace($p)) { return $p }
    return (Resolve-Path -LiteralPath $p).Path
}

$Ipa = Abs $Ipa; $P12 = Abs $P12; $Prov = Abs $Prov
if (-not $Out) {
    $Out = [IO.Path]::Combine(
        (Split-Path -Parent $Ipa),
        ((Split-Path -LeafBase $Ipa) + '-signed.ipa'))
}
$Out = [IO.Path]::GetFullPath($Out)

# ---- 定位 / 下载 zsign ----
$cache = Join-Path $env:LOCALAPPDATA 'knowledge-commons\zsign'
$exe = $null
if (-not $ForceDownload) {
    $exe = Get-ChildItem -Path $cache -Recurse -Filter 'zsign.exe' -ErrorAction SilentlyContinue |
        Select-Object -First 1 -ExpandProperty FullName
}
if (-not $exe) {
    New-Item -ItemType Directory -Force -Path $cache | Out-Null
    $url = "https://github.com/zhlynn/zsign/releases/download/$ZsignVer/zsign-windows-x64.zip"
    $zip = Join-Path $cache 'zsign-windows-x64.zip'
    Write-Host "下载 zsign $ZsignVer ..."
    Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
    Expand-Archive -Path $zip -DestinationPath $cache -Force
    $exe = Get-ChildItem -Path $cache -Recurse -Filter 'zsign.exe' |
        Select-Object -First 1 -ExpandProperty FullName
    if (-not $exe) { throw "解压后未找到 zsign.exe（$cache）" }
}
Write-Host "zsign: $exe"

# ---- 执行签名 ----
$zargs = @('-k', $P12, '-m', $Prov, '-o', $Out)
if ($P12Pass) { $zargs = @('-p', $P12Pass) + $zargs }
if ($BundleId) { $zargs += @('-b', $BundleId) }
$zargs += $Ipa

Write-Host "签名: $Ipa"
& $exe @zargs
if ($LASTEXITCODE -ne 0) { throw "zsign 退出码 $LASTEXITCODE，签名失败" }
if (-not (Test-Path $Out)) { throw "未生成输出文件: $Out" }

Write-Host ""
Write-Host "签名完成: $Out" -ForegroundColor Green
Write-Host "安装方式：Sideloadly / AltStore 拖入安装，或手机端签名工具；"
Write-Host "设备需在 设置→通用→VPN与设备管理 中信任对应证书。"
