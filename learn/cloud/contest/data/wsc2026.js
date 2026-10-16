/* =====================================================================
   全真模拟卷 · WSC2026 上海世赛 · 云计算（Skill 53）全真模考
   命题依据（均为官方公开文件，本仓库已收录原文）：
   - WSOS 2026 职业标准（权重：问题解决20/网络安全20/可靠性15/工作组织10/
     性能10/运营10/可持续10/沟通5）
   - TD53 技术描述：四天赛程，两天整日排障 + 两天仅下午排障；评分类型含
     全对全错 / 扣分制 / 加分制 / 消息处理量 / 资源效率；平台 AWS。
   本卷为原创模考命题（非泄题），结构与权重严格对齐官方文件。
   ===================================================================== */
(function(){
window.KC_PAPERS=window.KC_PAPERS||{};
window.KC_PAPERS['wsc2026']={
 id:'wsc2026',
 name:'WSC2026 上海世赛 · 云计算 · 四日全真模考',
 tag:'世赛线 · 官方标准命题',
 order:9,
 desc:'按官方 TD53 结构复刻的四日赛程：日1 上午基础架构 · 日2 全日排障 · 日3 上午安全与自动化 · 日4 上午迁移优化与运维。评分含世赛特有的「消息处理量」「资源效率」两类。AWS 平台。',
 source:'原创模考命题，严格依据 WSC2026-TD53 技术描述 + WSOS2026 职业标准权重（两份官方原文均已入库）；任务细节原创，非官方赛题',
 env:'AWS：真实账号 / AWS Academy Learner Lab。全部资源限定单区域 ap-northeast-1（东京），除非任务另行说明',
 rules:'<b>世赛规则要点（TD53）</b>：① 单人赛项，25 岁以下 ② 基础设施设计实施部署手段不限，<b>禁止反编译或修改提供的应用程序</b> ③ 评分类型：全对全错 / 扣分制 / 加分制 / 消息处理量 / 资源效率 ④ 成本约束：基础设施须经济有效，浪费资源会被「资源效率」项扣分 ⑤ 四天中排障贯穿大半——每天下午都可能收到故障注入。',
 modules:[
 {
  name:'日 1 · 基础设施与部署（4.5 小时）',
  minutes:270,
  brief:'<p><b>业务场景</b>：公司 「AuroraShop」 要上线一套电子商务后端：Web 层（容器化）、API 层、MySQL 兼容数据库、对象存储静态资源。评分覆盖：工作组织与管理（10%）、可靠性/可扩展/弹性（15%）、部分性能（10%）。</p>',
  tasks:[
  {title:'T1 · 网络（高可用是底线）',
   brief:'<p>创建 VPC shop-vpc 10.42.0.0/16：两个公有子网（10.42.0.0/24, 10.42.1.0/24，不同 AZ）、两个私有子网（10.42.10.0/24, 10.42.11.0/24）、两个数据子网（10.42.20.0/24, 10.42.21.0/24）。私网出网走 NAT。所有资源打标签 Project=AuroraShop（评分读取 Tag）。</p>',
   checks:[
    {d:'VPC 与 6 个子网按 CIDR/AZ 就位，Tag Project=AuroraShop 全部命中',p:4},
    {d:'IGW + 公有路由表 + 私有路由表（NAT 出网）',p:3},
    {d:'NAT Gateway 存在于公有子网且私有路由指向它（双 AZ 可计分）',p:3}
   ],
   refs:['aws ec2 create-vpc / create-subnet --availability-zone ap-northeast-1a --tag-specifications …Project=AuroraShop','aws ec2 create-nat-gateway --subnet-id … --allocation-id eipalloc-…'],
   sol:'按 CIDR 建 → IGW/路由 → 双 NAT（高分项：双 AZ NAT 体现弹性）→ 全部资源统一打 Project Tag。'},
  {title:'T2 · 数据库与存储',
   brief:'<p>建 RDS MySQL 8.0 实例 shop-db（db.t4g.micro，多 AZ 部署，存储加密，自动备份保留 14 天，端口 3306）。建 S3 桶 shop-static-<账号后4位>：开启静态网站托管、公有读、版本控制。</p>',
   checks:[
    {d:'RDS 多 AZ 实例 shop-db（加密 + 备份保留 14 天）',p:4},
    {d:'S3 桶：静态托管开启、版本控制开启、桶策略仅放行 GetObject',p:4}
   ],
   refs:['aws rds create-db-instance --multi-az --storage-encrypted --backup-retention-period 14 …','aws s3 website s3://…/ --index-document index.html'],
   sol:'RDS 用 create-db-instance 一次带 --multi-az --storage-encrypted；S3 注意 PublicAccessBlock 关闭仅限本桶 + 桶策略 Principal=* Action=s3:GetObject。'},
  {title:'T3 · 容器化 Web 层（ECR+ECS Fargate）',
   brief:'<p>资料包 app/ 提供一个 Node.js 应用（端口 3000，/health 健康检查）。构建镜像上传 ECR 仓库 shop-web（scan on push），创建 ECS 集群 shop-cluster（Fargate），服务 shop-web-svc：desired=2、跨两个私有子网、挂 ALB、滚动部署最小健康 100%。</p>',
   checks:[
    {d:'ECR 仓库 shop-web + 镜像 latest 推送成功 + 扫描无 HIGH 漏洞',p:4},
    {d:'集群/任务定义/服务就位，2 任务跨 AZ 运行在私有子网',p:5},
    {d:'任务定义含容器健康检查配置（/health）',p:2}
   ],
   refs:['docker build -t shop-web . && aws ecr get-login-password | docker login …','aws ecs create-service --deployment-configuration minimumHealthyPercent=100'],
   sol:'标准 Fargate 全流程；executionRole 挂 ECR 拉取与 Secrets 读权限。'},
  {title:'T4 · 入口与弹性',
   brief:'<p>创建 ALB shop-alb（internet-facing，HTTP 80，健康检查 /health），目标组指向 ECS 服务。配置 Target Tracking 自动扩缩（CPU 60%，min2/max6）。用压测脚本验证：扩容发生且服务不中断。</p>',
   checks:[
    {d:'ALB+TG+监听就位，公网可访问应用',p:4},
    {d:'自动扩缩策略（Target Tracking CPU60% min2 max6）',p:3},
    {d:'压测期间无 5xx（可靠性验收）',p:2},
    {d:'【加分制】主动压出扩容记录（Scaling Activity 有触发记录）',p:2}
   ],
   refs:['aws elbv2 create-target-group --health-check-path /health …','aws application-autoscaling put-scaling-policy --policy-type TargetTrackingScaling …'],
   sol:'ALB 挂 ECS → put-scaling-policy（predefined CPU60）→ ab/wrk 压测 3 分钟看 activity。'}
  ]
 },
 {
  name:'日 2 · 全日排障（6 小时 · TD53 两大排障日之一）',
  minutes:360,
  brief:'<p><b>监考注记</b>：赛项经理会在你已完成的日 1 环境注入故障（自查清单亦可用于对练：请同伴/脚本按清单造故障）。每个故障 = 现象 + 定位 + 修复 + 验证，按「全对全错」或「扣分制」计分。本模块与 TD53 的 fault-finding 节奏对齐——赛场约四分之三时间在排障。</p><p><b>对练用法</b>：先让队友照「造障脚本」破坏环境再交给你修；或在真机用 <code>docs/cloudlab/fault/make_fault_l1.sh</code> 同类思路自造。</p>',
  tasks:[
  {title:'F1 · 服务不可达类（3 项）',
   brief:'<p>现象：公网访问 ALB 全部 504/502。可能故障点（考场只给现象）：① ECS 任务健康检查路径被改 ② 安全组关了 ALB→任务网段 ③ TG 取消了注册。逐个排查修复。</p>',
   checks:[
    {d:'定位并修复健康检查路径（恢复 /health）',p:3},
    {d:'定位并修复安全组规则（放行 ALB SG → 3000）',p:3},
    {d:'定位并重新注册 Target（TG 关联恢复）',p:3},
    {d:'修复后 /health 200 且应用可访问（验证环节得分）',p:3}
   ],
   refs:['aws elbv2 describe-target-health --target-group-arn …','aws ec2 describe-security-groups --group-ids …','curl -v http://<alb>/health'],
   sol:'排障分层：链路（DNS/IP/端口）→ 安全组/NACL → 目标健康 → 应用日志。TG 健康描述 Target Health 字段会直接告诉你原因。'},
  {title:'F2 · 数据与存储类（2 项）',
   brief:'<p>现象：应用报数据库连接失败 + 上传图片报 AccessDenied。① shop-db 安全组被收紧 ② S3 桶策略被替换为 Deny。修复并验证。</p>',
   checks:[
    {d:'DB 安全组恢复（ECS 任务网段 → 3306），应用恢复写入',p:4},
    {d:'S3 桶策略恢复 GetObject（上传路径可用），显式 Deny 被移除',p:4}
   ],
   refs:['aws rds describe-db-instances …VpcSecurityGroups','aws s3api get-bucket-policy --bucket … | jq .'],
   sol:'先看应用报错原文 → DB 连不上查 SG 链（任务SG→DB SG）→ S3 拒绝看策略里有没有 Deny + PublicAccessBlock。'},
  {title:'F3 · 配置漂移类（2 项）',
   brief:'<p>现象：扩容没反应 + 新任务起不来。① 自动扩缩策略被删除 ② 任务定义的 ECR 镜像标签被改成不存在版本。修复并验证。</p>',
   checks:[
    {d:'Target Tracking 策略恢复（describe-scaling-policies 可见）',p:4},
    {d:'任务定义镜像引用恢复为 shop-web:latest（或有效 digest），新任务 Running',p:4}
   ],
   refs:['aws application-autoscaling describe-scaling-policies --service-namespace ecs','aws ecs describe-task-definition --task-definition shop-web'],
   sol:'配置漂移排查用 describe 系列 API 对照预期清单；修 taskdef 时 register 新修订版并 update-service。'},
  {title:'F4 · 成本与资源效率（运营项）',
   brief:'<p>排障结束后监考按「资源效率」计分：检查你环境里的浪费（多余 NAT/未挂载 EBS/空跑的 EC2/重复的 EIP）。</p>',
   checks:[
    {d:'无未使用的 EIP/NAT（或已说明必要双 AZ 理由）',p:2},
    {d:'无空跑实例/未挂载卷；ECR 无多余仓库',p:2},
    {d:'【加分制】给出成本优化清单（写在 runbook 文档）',p:2}
   ],
   refs:['aws ec2 describe-addresses --filters Name=public-ip,Values=* （association-id 为空即闲置）'],
   sol:'逐项 describe → 释放闲置资源；文档里写明双 AZ NAT 的必要性即可避免误删。'}
  ]
 },
 {
  name:'日 3 上午 · 安全与自动化（4 小时）',
  minutes:240,
  brief:'<p>评分覆盖：网络安全（20%，全赛最高权重之一）+ 自动化能力。TD53 要求「用脚本或基础设施模板自动化基础设施的创建与修改」——本模块一半分在自动化交付上。</p>',
  tasks:[
  {title:'S1 · IAM 最小权限体系',
   brief:'<p>建三个角色：shop-ecs-task（仅 ECR 拉取 + CloudWatch Logs + 读 shop/secret）、shop-db-admin（RDS describe 专属）、shop-audit（只读全部资源）。禁止使用 * 权限；提交策略 JSON 到 /home/runbook/iam/。</p>',
   checks:[
    {d:'三个角色存在且策略均为最小权限（无 Action:"*"）',p:5},
    {d:'shop-ecs-task 能拉镜像、写日志、读指定 Secret（实测验证）',p:4},
    {d:'策略 JSON 归档在 runbook 目录',p:2}
   ],
   refs:['aws iam create-role --assume-role-policy-document file://ecs-trust.json','aws iam put-role-policy --policy-name ecr-pull --policy-document file://ecr.json'],
   sol:'写最小化策略文档 → 建角色挂策略 → 用 ecs exec 或 curl 验证权限边界。'},
  {title:'S2 · 加密与传输安全',
   brief:'<p>① 为 ALB 挂 HTTPS：ACM 申请/导入证书（测试可用自签导入），ALB 增加 443 监听并强制 HTTP→HTTPS 跳转。② KMS 建 CMK shop-cmk 并把 S3 桶默认加密切到该 CMK。③ DB 强制 TLS 连接（参数组 require_secure_transport=ON）。</p>',
   checks:[
    {d:'ALB 443 监听 + 80→443 重定向规则',p:4},
    {d:'CMK shop-cmk 存在；S3 默认加密使用该 CMK',p:3},
    {d:'DB 参数组 require_secure_transport=ON 且生效',p:3}
   ],
   refs:['aws acm import-certificate … / openssl req -x509 …','aws s3api put-bucket-encryption --server-side-encryption-configuration …KMS…'],
   sol:'自签证书走 ACM import；S3 用 put-bucket-encryption；参数组建好改参数再 modify-db-instance 应用。'},
  {title:'S3 · 自动化交付（脚本或 IaC 二选一）',
   brief:'<p>把日 1 的 T1-T4 全部改写为可重复交付：Bash 脚本（幂等）或 Terraform/CloudFormation。验收方式：<b>在全新区域/全新 VPC 网段重放一次成功</b>。这就是 TD53「自动化基础设施创建与修改」的直接体现。</p>',
   checks:[
    {d:'交付脚本/模板完整覆盖网络/DB/S3/容器/ALB 五层',p:5},
    {d:'重复执行幂等（二次运行不报错不重复建）',p:4},
    {d:'换参数（新 CIDR）重放成功',p:4}
   ],
   refs:['#!/bin/bash set -euo pipefail … aws cloudformation create-stack --template-body file://shop.yaml --parameters ParameterKey=Cidr,ParameterValue=10.43.0.0/16'],
   sol:'推荐 CloudFormation/Terraform 参数化 CIDR；Bash 方案用 exists-then-skip 幂等。'},
  {title:'S4 · 安全基线自查（扣分制）',
   brief:'<p>监考按基线扣分：任何 0.0.0.0/0 的 SSH 入站、公网 DB、关闭的日志、明文 Secret（任务定义 env 里写死密码）都会被扣。</p>',
   checks:[
    {d:'无 0.0.0.0/0 SSH；DB 无公网可达',p:3},
    {d:'任务定义无明文密码（全部走 Secrets Manager 引用）',p:3},
    {d:'VPC Flow Logs / ALB 日志 / RDS 日志至少开启一项',p:2}
   ],
   refs:['aws ec2 describe-security-groups --query "SecurityGroups[?IpPermissions[?IpRanges[?CidrIp==\'0.0.0.0/0\'] && FromPort==`22`]]"'],
   sol:'用 describe 全查一遍自查；敏感值统一 secrets valueFrom 引用。'}
  ]
 },
 {
  name:'日 4 上午 · 迁移、优化与运维（4 小时）',
  minutes:240,
  brief:'<p>评分覆盖：性能与优化（10%）+ 运营考虑（10%）+ 可持续性（10%）+ 沟通（5%）。TD53 说「将工作负载迁移到云」与「优化云成本」是核心职责——本模块就是这两件事。</p>',
  tasks:[
  {title:'M1 · 迁移：本地应用到云',
   brief:'<p>资料包 legacy/ 是一个 PHP+SQLite 的老站（自带说明）。要求：迁移到云上运行（EC2 或容器均可），数据必须完整迁移，迁移后域名路径 /legacy 由现有 ALB 承载，并在 runbook 写出迁移步骤与回滚方案。</p>',
   checks:[
    {d:'应用在云上运行且历史数据可访问',p:5},
    {d:'ALB /legacy 路径路由打通（不破坏现有 / 服务）',p:4},
    {d:'迁移文档：步骤+验证方法+回滚方案三要素齐全',p:4}
   ],
   refs:['sqlite3 legacy.db .dump | mysql … 或容器内直接挂载 sqlite 文件','ALB listener rule: path-pattern /legacy/* → TG legacy-tg'],
   sol:'容器化最稳（php:apache + 卷挂数据）→ 新 TG → ALB path 规则 → 文档写清 dump/校验/回滚三段。'},
  {title:'M2 · 性能优化（消息处理量计分）',
   brief:'<p>监考用压测机对 /hot 接口打 5 分钟流量，按<b>成功处理消息数</b>计分（TD53 的 Processed messages 类型）。你可通过：加缓存（ElastiCache 或应用内存缓存）、调容量、开 HTTP 缓存来提升吞吐。</p>',
   checks:[
    {d:'压测期间错误率 <1%',p:4},
    {d:'处理消息量达到基准线（考场公布，模考自定 3000 req/5min）',p:4},
    {d:'【加分制】有缓存层且命中（日志可证）',p:3}
   ],
   refs:['wrk -t8 -c200 -d5m http://<alb>/hot','aws cloudwatch get-metric-statistics … Namespace=AWS/ApplicationELB MetricName=RequestCount'],
   sol:'先测基线 → 找瓶颈（CPU/连接数）→ 缓存或扩容 → 复测对比数据截图留档。'},
  {title:'M3 · 成本优化与可持续',
   brief:'<p>按 TD53「可持续性」权重出题：为环境写出并实施三项成本/可持续优化（如：ALB 日志生命周期、EBS gp3 降级、实例按时段停止的自动化、S3 生命周期转 IA）。</p>',
   checks:[
    {d:'至少 3 项优化已实施且有验证证据',p:5},
    {d:'写出预计月度节省（Cost Explorer 数据支撑）',p:3},
    {d:'优化不破坏可用性（复测 /health 通过）',p:3}
   ],
   refs:['aws ce get-cost-and-usage --time-period … --granularity MONTHLY --metrics UnblendedCost','aws s3api put-bucket-lifecycle-configuration … Transitions Days=30 StorageClass=STANDARD_IA'],
   sol:'先取基线成本 → 挑 3 项低风险优化实施 → 复测可用性 → 文档记录前后对比。'},
  {title:'M4 · 交付文档（沟通 5% · 世赛明确给分项）',
   brief:'<p>写《交付运行手册》：架构图（文字版拓扑可）、资源清单、常用运维操作手册（重启/扩容/备份恢复）、故障联系与升级路径。世赛沟通分就看这个。</p>',
   checks:[
    {d:'四要素齐全（架构/清单/操作手册/升级路径）',p:5},
    {d:'命令可直接复制执行（可验证性）',p:3}
   ],
   refs:['# runbook.md 放在 /home/runbook/ 并在 AWS Systems Manager 存一份'],
   sol:'四段式结构写全；每条运维操作给「命令+预期输出」。'}
  ]
 }
 ]
};
})();
