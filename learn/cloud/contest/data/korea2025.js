/* =====================================================================
   全真模拟卷 · 2025 韩国全国技能大赛 云计算（世赛同源 · AWS）
   依据：本仓库 exam/korea-zh/2025 原始任务书中译全文（第1/第2课题）
   分值为备考估计（原卷评分表未公开），验收点忠实原文。
   ===================================================================== */
(function(){
window.KC_PAPERS=window.KC_PAPERS||{};
window.KC_PAPERS['korea2025']={
 id:'korea2025',
 name:'2025 全国技能大赛（韩国）· 云计算 · 全真卷',
 tag:'世赛线 · 真题原文',
 order:10,
 desc:'世赛体系下的国家级选拔真题：第 1 任务「解决方案架构」（ECS+Aurora+三级负载均衡+CD 流水线）、第 2 任务「Small Challenge」（NoSQL 全局表+Edge DRM+监控看板+WAF）。每任务 4 小时。',
 source:'韩国技能大赛 2025 云计算职业原始任务书中译全文（本仓库 exam/korea-zh 收录）；分值为备考估计，原卷评分表未公开',
 env:'AWS 公有云：真实账号 / AWS Academy Learner Lab / 新 Free Tier 均可。主区域 ap-northeast-2（首尔），按题切换区域',
 rules:'<b>考场纪律（原文要求）</b>：① 开始前删除所有默认服务 ② 所有资源名称、标签、变量<b>区分大小写</b> ③ Security Group 出方向 80/443 放行 ④ Bastion 用于评分，重启 IP 不得变更 ⑤ 创建不必要资源可能成为<b>扣分因素</b>（例：额外创建 VPC）⑥ 任务结束前停止正在运行的测试与负载。',
 modules:[
 {
  name:'第 1 任务 · 解决方案架构（4 小时）',
  minutes:240,
  brief:'<p>你负责利用云解决方案构建可使应用程序运行的 IT 基础设施。必须综合考虑拓扑与需求，以及云设计原则——<b>高可用、可扩展、成本、安全</b>。技术栈：VPC / EC2 / ELB / ECS / Fargate / ECR / S3 / Secrets Manager / RDS(Aurora) / IAM / KMS / CloudWatch；应用为 Golang/Gin 构建的 Green、Red 双应用（各含 v1.0.0、v1.0.1 两个版本 Binary，资料包提供，绑定 TCP/8080，含 /health 健康检查端点）。</p>'+
        '<p><b>网络蓝图（Ref01）</b>：ws25-hub-vpc 172.28.0.0/16（子网 ws25-hub-pub-a 172.28.0.0/20、ws25-hub-pub-c 172.28.16.0/20）；ws25-app-vpc 10.200.0.0/16（pub a/b/c 10.200.10-12.0/24、pri a/b/c 10.200.20-22.0/24、db a/c 10.200.30-31.0/24）。两 VPC 需 Peering；内部流量日志分别落 /ws25/flow/hub 与 /ws25/flow/app。</p>',
  tasks:[
  {title:'§3 网络配置 · 双 VPC 与互联',
   brief:'<p>按 Ref01 表创建两个 VPC 及全部子网；镜像下载必须走 VPC Endpoint（仅内网）；两个 VPC 的网络流量日志分别保存到 CloudWatch 日志组；两 VPC 建立 Peering；Bastion 所在公有子网需能访问 DB。</p>',
   checks:[
    {d:'ws25-hub-vpc（172.28.0.0/16）与 ws25-app-vpc（10.200.0.0/16）按表创建',p:4},
    {d:'9 个子网全部按 Name/CIDR 就位（hub-pub a/c、app-pub a/b/c、app-pri a/b/c、app-db a/c）',p:6},
    {d:'VPC Endpoint 就位：应用子网镜像下载仅走内网（ECR API/ECR Docker S3 Endpoint）',p:5},
    {d:'Flow Logs：ws25-hub-vpc → /ws25/flow/hub、ws25-app-vpc → /ws25/flow/app',p:5},
    {d:'Peering 连接 ws25-peering 建立且两 VPC 路由互通',p:4},
    {d:'app-db 子网入放仅允许来自 Bastion 子网（app-pub）的访问',p:3}
   ],
   refs:['aws ec2 create-vpc --cidr-block 172.28.0.0/16 --tag-specifications \'ResourceType=vpc,Tags=[{Key=Name,Value=ws25-hub-vpc}]\'','aws ec2 create-vpc-peering-connection --vpc-id vpc-hub --peer-vpc-id vpc-app …（两端 accept）','aws ec2 create-flow-logs --resource-ids vpc-xxx --resource-type VPC --traffic-type ALL --log-destination-type cloud-watch-logs --log-group-name /ws25/flow/hub','aws ec2 create-vpc-endpoint --vpc-id … --service-name com.amazonaws.ap-northeast-2.ecr.api --vpc-endpoint-type Interface'],
   sol:'先建 VPC/子网/路由表 → Peering + 两条路由 → Interface Gateway（ecr.api、ecr.dkr）+ S3 Gateway Endpoint（ECR 镜像层走 S3）→ Flow Logs 绑定 IAM 角色与日志组 → 安全组按层放行。数据库子网只对 app-pri 与 Bastion 网段放行 10101。'},
  {title:'§4 Bastion 跳板机',
   brief:'<p>用 EC2 创建 Bastion。用于评分：重启 IP 不变；root 权限下 AWS CLI 拥有全部权限；SSH 端口改为 10100 并单独建安全组；实例开启「终止保护」。</p>',
   checks:[
    {d:'实例 ws25-ec2-bastion（Amazon Linux 2023 · t3.small · 子网 ws25-hub-pub-c）',p:4},
    {d:'固定公网 IP：使用 Elastic IP（重启不变）',p:3},
    {d:'IAM 角色：root 下 AWS CLI 全权限（AdministratorAccess 附到实例角色）',p:3},
    {d:'SSH 端口 10100：独立安全组仅放行该端口的入站规则',p:3},
    {d:'终止保护已开启（disable-api-termination）',p:2},
    {d:'软件包就位：AWS CLI v2、cURL、jq',p:2}
   ],
   refs:['aws ec2 enable-instance-termination-protection --instance-id i-xxx','aws ec2 allocate-address && aws ec2 associate-address','aws iam create-role …（trust ec2.amazonaws.com）+ attach AdministratorAccess + instance-profile'],
   sol:'先建 IAM 角色+实例配置文件 → 起机（AL2023, t3.small, hub-pub-c）→ EIP 绑定 → 改 sshd Port 10100 并开独立 SG → 终止保护 → 安装 jq/curl，aws cli v2 用官方 unzip 安装包。'},
  {title:'§5 关系数据库 · Aurora 高可用集群',
   brief:'<p>为 Green/Red 应用配置 Aurora (MySQL 兼容)。高可用：跨 AZ 副本+读取器；端口非 3306；存储 KMS 加密（密钥 ws25-kms，90 天自动轮换）；可监控 DB 实例负载且监控仅用 CMK 加密；审计/错误/常规/实例日志导出 CloudWatch；可回滚 3 小时前（PITR）+ 备份保留 34 天；仅 Bastion 可访问；导入提供的 day1_table_v1.sql 建表。</p>',
   checks:[
    {d:'KMS 密钥 ws25-kms：90 天自动轮换开启',p:4},
    {d:'Aurora 集群 ws25-rdb-cluster（MySQL 8.0 兼容 · db.t4g.medium · 端口 10101）',p:5},
    {d:'存储加密使用 CMK ws25-kms（非 AWS 托管密钥）',p:3},
    {d:'Reader/副本节点在不同 AZ（共 2 节点跨 AZ）',p:4},
    {d:'Performance Schema 开启（可监控 DB 内部负载）且性能详情仅用 CMK 加密',p:3},
    {d:'audit/error/general/instance 四类日志全部导出 CloudWatch',p:3},
    {d:'备份保留期 34 天（PITR 随之可用，满足回滚 3 小时）',p:3},
    {d:'安全组：仅 Bastion 可达 10101；day1 库中已导入 day1_table_v1.sql',p:4}
   ],
   refs:['aws kms create-key --description ws25-kms && aws kms enable-key-rotation --key-id …（rotation-period-in-days 90）','aws rds create-db-cluster --engine aurora-mysql --engine-version 8.0.mysql_aurora.3.xx --port 10101 --kms-key-id … --storage-encrypted --backup-retention-period 34 --enable-cloudwatch-logs-exports audit error general instance --performance-schema-enabled …','aws rds create-db-instance --db-instance-class db.t4g.medium --engine aurora-mysql --availability-zone ap-northeast-2a/c'],
   sol:'建 CMK（开轮换）→ 建子网组（db-a/db-c）→ 建 Cluster（加密+CMK、端口 10101、备份 34 天、日志四导出、Performance Schema）→ 两个实例跨 AZ → 疗安全组仅放 Bastion → mysql 客户端从 Bastion 导入 SQL。'},
  {title:'§6-7 应用程序与 Secret 管理',
   brief:'<p>应用资料包已给（Green/Red × v1.0.0/v1.0.1）。本节不做资源，但第 8-11 节全部依赖它：确认 Binary 可运行（-h 查看帮助）、理解 DB 环境变量读取方式；所有 DB 环境变量必须经 Secrets Manager（密钥 ws25/secret/key，用 ws25-kms 加密）管理，不得明文写进任务定义。</p>',
   checks:[
    {d:'资料包中 4 个 Binary 在本地/EC2 可运行并查看 -h 帮助（理解 API 行为）',p:2},
    {d:'Secrets Manager 密钥 ws25/secret/key 存在且以 KMS ws25-kms 加密',p:4},
    {d:'Secret 内容覆盖 DB 连接所需全部环境变量；任务定义中无明文环境变量',p:3}
   ],
   refs:['aws secretsmanager create-secret --name ws25/secret/key --kms-key-id <ws25-kms> --secret-string file://secret.json','./app -h'],
   sol:'在 Bastion 解压资料包，试跑 binary；把 DB host/port/user/pass/dbname 整理成 JSON 存入 Secrets Manager（指定 CMK）。ECS 任务定义稍后引用 valueFromFromSecret。'},
  {title:'§8 容器镜像仓库 · ECR',
   brief:'<p>把 4 个 Binary 构建为镜像并上传 ECR：green、red 两个仓库；镜像名用应用名（小写），标签用版本名；推送时自动扫描；扫描不得出现 Low 级别以上漏洞；red 仓库使用 ws25-kms CMK 加密；除日志仓库外不得有多余仓库。</p>',
   checks:[
    {d:'仓库 green 与 red 存在（仅 2 个业务仓库+可选日志仓库）',p:3},
    {d:'镜像上传：green:v1.0.0 / green:v1.0.1 / red:v1.0.0 / red:v1.0.1（无其他标签）',p:5},
    {d:'仓库开启 Scan on push（推送时自动扫描）',p:2},
    {d:'扫描结果无 LOW 及以上漏洞',p:3},
    {d:'red 仓库加密使用 CMK ws25-kms',p:2}
   ],
   refs:['aws ecr create-repository --repository-name green --image-scanning-configuration scanOnPush=true --encryption-configuration encryptionType=KMS,kmsKey=<…>','docker build -t green:v1.0.0 . && docker tag … && docker push …'],
   sol:'写 Dockerfile（from amazonlinux/alpine + binary + EXPOSE 8080 + HEALTHCHECK curl /health）→ build 4 个 tag → 登录 ECR 推送。red 仓库指定 KMS 加密。基础镜像选轻量且无 CVE 的，避免扫描超阈值。'},
  {title:'§9 容器编排 · ECS 双服务',
   brief:'<p>Green、Red 用 ECS 服务管理；集群托管存储用 ws25-kms 加密；同时使用 Fargate 与 EC2 两种计算类型；任务部署在 ws25-app-pri 子网、任务数始终等于该子网 AZ 数、跨 AZ 均衡；新版本部署不中断；容器健康检查；不配置服务 Auto Scaling。</p>',
   checks:[
    {d:'集群 ws25-ecs-cluster（ECS 基础设施加密选择 CMK ws25-kms）',p:3},
    {d:'Green：EC2 计算（容器实例 ws25-ecs-container-green · t3.medium），任务定义 ws25-ecs-green-taskdef（1vCPU/1GB）',p:4},
    {d:'Red：Fargate 计算，任务定义 ws25-ecs-red-taskdef（0.5vCPU/1GB）',p:4},
    {d:'服务 ws25-ecs-green / ws25-ecs-red 运行中；desired count = app-pri 子网覆盖的 AZ 数',p:4},
    {d:'任务分布跨全部 AZ；滚动/Blue-Green 部署不中断服务',p:3},
    {d:'容器健康检查可用（healthCheck 配置）；未配置任何 Auto Scaling 策略',p:3}
   ],
   refs:['aws ecs create-cluster --cluster-name ws25-ecs-cluster --configuration executeCommandConfiguration=… --settings …','aws ecs register-task-definition --family ws25-ecs-green-taskdef --cpu 1024 --memory 1024 --requires-attributes …（secrets valueFrom=arn:…:secret:ws25/secret/key）','aws ecs create-service --cluster ws25-ecs-cluster --launch-type FARGATE --network-configuration awsvpcConfiguration=subnets=app-pri-*,assignPublicIp=DISABLED …'],
   sol:'先做 EC2 容器实例（t3.medium, app-pri, ECS 优化 AMI, 集群 CMK）→ 注册两个 taskdef（secret 用 valueFrom 引 Secrets Manager；端口 8080；healthCheck）→ 建 2 个服务（部署-deployment-controller 后续接 CodeDeploy Blue/Green；这一步可先 EC2/Fargate launch-type + rolling）。'},
  {title:'§10 日志记录 · FireLens',
   brief:'<p>把 Green/Red 应用日志收集到 CloudWatch：用 Fluentd/Fluent Bit 作为 FireLens 日志路由容器；不收集对 /health 的请求日志。日志组：/ws25/logs/green 与 /ws25/logs/red；流名 Green-&lt;ECS Task ID&gt; / Red-&lt;ECS Task ID&gt;。</p>',
   checks:[
    {d:'FireLens（Fluent Bit）日志路由容器配置在两个任务定义中',p:3},
    {d:'日志组 /ws25/logs/green、/ws25/logs/red 存在且有日志流入',p:4},
    {d:'流名格式 Green-<TaskId> / Red-<TaskId>',p:2},
    {d:'/health 请求日志被过滤，不进入日志组',p:3}
   ],
   refs:['fluent-bit.conf: [FILTER] Name grep Exclude *_uri ^/health$ ；[OUTPUT] name cloudwatch_logs log_group_name /ws25/logs/green log_stream_prefix Green- region ap-northeast-2'],
   sol:'任务定义加 firelensConfiguration（fluentbit）+ sidecar 容器挂配置（S3 或文件）；配置 Exclude /health；输出插件 cloudwatch_logs 用 log_stream_prefix 与 task id 元变量。'},
  {title:'§11 负载均衡 · 三层 NLB/ALB 链',
   brief:'<p>外部 → ws25-hub-vpc 的 NLB（internet-facing）→ 仅经 IP 直连 ws25-app-vpc 的内部 NLB → 内部 ALB。全部 80 端口监听且高可用；/green 转发 Green、/red 转发 Red；/health 用于 app NLB 健康检查（HTTP）；GET /error 返回 500；不存在路径返回 404（页面内容按原文）。Hub NLB 与 App NLB 之间仅以 IP 直连（禁 VPC Endpoint/Lattice）。</p>',
   checks:[
    {d:'ws25-hub-nlb（internet-facing · TCP 80 · TG ws25-hub-nlb-tg · IP 类型）',p:4},
    {d:'ws25-app-nlb（internal · TCP 80 · TG ws25-app-nlb-tg）',p:3},
    {d:'ws25-app-alb（internal · HTTP 80）+ /green、/red 路径路由到对应服务',p:5},
    {d:'/health 作为 app-nlb 健康检查路径（HTTP 协议）',p:2},
    {d:'跨 NLB 仅以指定 IP 直连注册（Target Group type: ip / 实例 IP 注册）',p:4},
    {d:'/error 返回 500 与规定页面；未知路径返回 404 与规定页面',p:3},
    {d:'全链路公网可达：curl http://<hub-nlb-dns>/green 与 /red 正常返回',p:4}
   ],
   refs:['aws elbv2 create-load-balancer --name ws25-hub-nlb --scheme internet-facing --type network …','aws elbv2 create-target-group --name ws25-app-nlb-tg --protocol TCP --port 80 --target-type ip --vpc-id …','aws elbv2 create-rule --listener-arn … --priority 1 --conditions Field=path-pattern,Values=/green/* --actions ForwardComponent=…'],
   sol:'ALB 先建（internal, HTTP80, 基于 path 的 listener 规则）→ app-nlb TG(type=ip) 注册 ALB 的 IP（在 app-vpc 内解析 ALB DNS 拿 IP 再注册，注意 ALB IP 变化——考试期内稳定）→ hub-nlb TG(type=ip) 注册 app-nlb 的 IP（同法）。ALB 上配置 fixed-response 500/404 规则。'},
  {title:'§12 监控 · Dashboard 与告警',
   brief:'<p>用 CloudWatch 建 Dashboard（ws25-metrics）：两个 VPC 的 Flow Log 接受流量、/green 与 /red 的 GET/POST 计数、Container Insights（增强可观测性，1 分钟粒度）、ALB 自身 4xx/5xx。配置告警：1 分钟内 ws25-app-alb 出现 ≥10 个 4xx 或 ≥5 个 5xx 触发。</p>',
   checks:[
    {d:'Dashboard ws25-metrics 存在且包含 Flow Log 流量 Widget',p:2},
    {d:'包含 /green、/red 的 GET/POST 请求计数 Widget（来自 §10 日志度量）',p:3},
    {d:'ECS 集群启用 Container Insights（1 分钟粒度）并「添加到仪表板」',p:3},
    {d:'包含 ALB 4xx/5xx 计数 Widget',p:2},
    {d:'两个告警：ALB 4xx≥10/分钟、5xx≥5/分钟',p:3}
   ],
   refs:['aws ecs update-cluster --cluster ws25-ecs-cluster --setting name=containerInsights,value=enhanced','aws cloudwatch put-metric-alarm --alarm-name alb-4xx --metric-name HTTPCode_Target_4XX_Count --namespace AWS/ApplicationELB --period 60 --statistic Sum --threshold 10 --comparison-operator GreaterThanOrEqualToThreshold'],
   sol:'集群开 enhanced insights → 日志度量过滤器（green/red 的 GET/POST 按 uri+method 计数）→ 建 dashboard 逐个加 widget → 两条 put-metric-alarm。'},
  {title:'§13-14 持续交付 · CodeDeploy + Pipeline',
   brief:'<p>用 CodeDeploy 把 v1.0.1 镜像部署到 ECS 服务（Blue/Green、等待最短、3 分钟内完成）；S3+CodeDeploy 顺序流水线，由 EC2 脚本启动；artifact 目录与 green.sh/red.sh 在规定路径；S3 Source 触发自动启动；评分前两个 Bucket 必须为空；评分时服务运行 v1.0.0。</p>',
   checks:[
    {d:'CodeDeploy 应用与部署组：ws25-cd-green-app/ws25-cd-green-dg、ws25-cd-red-app/ws25-cd-red-dg（Blue/Green）',p:4},
    {d:'Bastion /home/ec2-user/pipeline/ 下有 green.sh 与 red.sh；artifact/<应用名>/ 目录就位',p:3},
    {d:'脚本执行后打包 artifact 为 artifact.zip 上传 S3（文件位于 zip 顶层）',p:3},
    {d:'两条 Pipeline：Source=S3（ws25-cd-green-artifact-xxx / ws25-cd-red-artifact-xxx，上传自动触发）→ Deploy=CodeDeploy',p:4},
    {d:'Blue/Green 部署 3 分钟内完成（CodeDeploy 等待时间最小化）',p:2},
    {d:'评分前 Bucket 清空且生产服务运行 v1.0.0',p:2}
   ],
   refs:['appspec.yaml: version 0.0 / Resources: TargetService Type AWS::ECS::Service / TaskDefinition <arn> / LoadBalancerInfo …','aws deploy create-application --application-name ws25-cd-green-app --compute-platform ECS','aws codepipeline create-pipeline --pipeline "{…S3→CodeDeploy…}"'],
   sol:'Bastion 写脚本（cd artifact && zip -j artifact.zip * && aws s3 cp …）→ 建 CodeDeploy ECS 应用/部署组（Blue/Green, 生产监听器指向 ALB）→ CodePipeline S3 source（事件触发）+ CodeDeploy deploy → 全链路试跑一次后清空 bucket、回滚到 v1.0.0。'}
  ]
 },
 {
  name:'第 2 任务 · Small Challenge（4 小时）',
  minutes:240,
  brief:'<p>四个独立模块（多区域）：NoSQL（ap-northeast-2）· Edge DRM（us-east-1）· Monitoring（ap-southeast-1）· WAF（us-west-1）。每模块约 1 小时，按题切换区域。注意原文通用纪律：Bastion 自建用于评分、Tag/大小写、赛前清默认服务。</p>',
  tasks:[
  {title:'模块 2 · NoSQL：DynamoDB 全球实时账户系统',
   brief:'<p>用 DynamoDB + Lambda 构建实时全球交易账户系统。表 account-table（PK account_id）配置 Global Table，ap-northeast-2 与 eu-central-1 实时同步。Flask 应用（TCP 8080）部署到 EC2 account-app-ec2（t3.micro）提供 /create_account 与 /transfer；汇款用 TransactWriteItems 条件更新（balance>=amount 否则失败报错）；同步冲突由 Lambda account-conflict-resolver 自动恢复；开启 PITR。</p>',
   checks:[
    {d:'DynamoDB 表 account-table（PK: account_id）创建于 ap-northeast-2',p:3},
    {d:'Global Table 覆盖 ap-northeast-2 + eu-central-1（副本表存在且 ACTIVE）',p:5},
    {d:'EC2 account-app-ec2（t3.micro）运行 Flask 应用（8080），/create_account、/transfer 可用',p:5},
    {d:'汇款使用 TransactWriteItems：条件失败（余额不足）返回错误且不产生部分写入',p:5},
    {d:'Lambda account-conflict-resolver 部署：冲突事件自动恢复最新数据',p:4},
    {d:'表开启 PITR（point-in-time recovery）',p:3}
   ],
   refs:['aws dynamodb create-table --table-name account-table --attribute-definitions AttributeName=account_id,AttributeType=S --key-schema AttributeName=account_id,KeyType=HASH --billing-mode PAY_PER_REQUEST','aws dynamodb create-global-table --global-table-name account-table --replication-group Region=ap-northeast-2 Region=eu-central-1','pip3 install flask boto3; nohup python3 app.py &'],
   sol:'建表+开全局表（两区域）→ EC2 装 python/flask/boto3 跑 app.py → 应用里 transact_write_items 用 ConditionExpression balance>=amount → 冲突处理 Lambda 订阅 DynamoDB 流（错误/冲突时读取最新版本回写）→ 开 PITR。'},
  {title:'模块 6 · Edge DRM：CloudFront 视频令牌防护',
   brief:'<p>在 us-east-1 实现 Edge DRM：S3 桶 web-drm-bucket-&lt;任意3位数字&gt;，media/ 下放 *.mp4。CloudFront（web-cdn）分发；Viewer Request 阶段用 CloudFront Function（cloudfront-js-2.0，web-cdn-function）从 Query String 提取 DRM Token 并写入 X-DRM-Token 头；Origin Request 阶段用 Lambda@Edge（web-drm-function，Python 3.13 运行时）校验，无效返回 403；Token 必须进 Cache Key，TTL 60 秒；token=drm-cloud；文件不存在返回 404。</p>',
   checks:[
    {d:'S3 桶 web-drm-bucket-<3位> 存在且 media/ 下有 *.mp4',p:2},
    {d:'CloudFront web-cdn 分发建立，Origin 指向该桶',p:3},
    {d:'CloudFront Function web-cdn-function（cloudfront-js-2.0）挂在 Viewer Request：Token → X-DRM-Token 头',p:5},
    {d:'Lambda@Edge web-drm-function（Python3.13）挂在 Origin Request：校验失败返回 403',p:5},
    {d:'Cache Policy：Token 计入 Cache Key，默认 TTL 60 秒（缓存不串用户）',p:4},
    {d:'带 token=drm-cloud 可取视频；无/错 Token 403；不存在文件 404',p:4}
   ],
   refs:['// CloudFront Function: function handler(event){var q=event.request.querystring; var t=(q.token&&q.token.value)||""; event.request.headers["x-drm-token"]={value:t}; return event.request;}','# Lambda@Edge origin-request: 校验 headers["x-drm-token"] == "drm-cloud" else return 403 response'],
   sol:'桶传媒体 → 建 CloudFront（OAC）→ 写 CF Function 插头 → Lambda@Edge（必须 us-east-1 发布，numbered 版本才能挂）→ Cache Policy 单独建（header include X-DRM-Token, min/default/max=60）→ 三类请求各 curl 一遍验证。'},
  {title:'模块 11 · Monitoring：ECS 应用监控看板',
   brief:'<p>在 ap-southeast-1 用 ECS+CloudWatch 建监控。Flask 应用（5000 端口，/hello、/healthcheck、/test_latency、/latency_stats）跑在 Fargate 私有子网；ALB external 作端点；VPC wsi-vpc 10.0.0.0/16 按表建 4 子网；CloudWatch Dashboard（wsi-dashboard）四个 Widget：wsi-success、wsi-fail、wsi-sli（Gauge 成功率）、wsi-p90-p95-p99（Line），全部基于 Logs Insights 查询（wsi-query）。</p>',
   checks:[
    {d:'VPC wsi-vpc + pub-a/pub-c + priv-a/priv-c 子网与路由按表就位',p:3},
    {d:'ECS 集群 wsi-app-cluster（Fargate）+ 任务定义 wsi-app-fargate-task + 服务 wsi-app-service（容器名 wsi-app-cnt，私网运行）',p:5},
    {d:'ALB（internet-facing）作为应用端点，健康检查 /healthcheck 通过',p:4},
    {d:'应用日志落 CloudWatch 且可用 Logs Insights 查询（wsi-query）',p:3},
    {d:'Dashboard wsi-dashboard 四个 Widget：success/fail 计数、SLI Gauge、p90/p95/p99 Line',p:5}
   ],
   refs:['logs insights: filter status=200 | stats count as success ；stats pct(latency,90) as p90, pct(latency,95) as p95, pct(latency,99) as p99','aws ecs create-service --launch-type FARGATE --network-configuration awsvpcConfiguration=subnets=wsi-priv-*,assignPublicIp=DISABLED'],
   sol:'建 VPC/子网/IGW/路由 → 集群+taskdef（容器 5000）+服务（挂 ALB TG，健康检查 /healthcheck）→ awslogs 输出 → Logs Insights 写四条查询 → Dashboard 按 Widget 类型添加。'},
  {title:'模块 13 · WAF：XXE 攻击防御',
   brief:'<p>在 us-west-1 用 WAF 防御 XXE。EC2 xxe-server（t3.micro，Default VPC）运行给定应用（/ GET、/parse POST xml=…），ALB xxe-alb（internet-facing）作端点。WAF xxe-waf 防御 XXE：攻击进入时返回 403 并输出消息「403 Forbidden error」；考虑成本只建一条规则。攻击面：file:// 本地文件读取、外部实体 SSRF（元数据服务）、Billion Laughs 实体膨胀 DoS。</p>',
   checks:[
    {d:'EC2 xxe-server（t3.micro）运行应用；ALB xxe-alb 外网可达',p:4},
    {d:'Web ACL xxe-waf 关联到 xxe-alb',p:3},
    {d:'仅一条自定义规则实现 XXE 拦截（覆盖 SYSTEM 实体/外部实体/file:// 等 XXE 特征）',p:5},
    {d:'拦截时返回 403 且自定义响应消息为 403 Forbidden error',p:4},
    {d:'正常 /parse（无实体 XML）不受影响',p:2}
   ],
   refs:['aws wafv2 create-web-acl --name xxe-waf --region us-west-1 --rules \'[{Name:xxe-block,Priority:0,Statement:{ByteMatchStatement:{…search xx 特征串…}},Action:{Block:{CustomResponse:{ResponseCode:403,CustomResponseBodyKey:msg}}}}]\'','curl -X POST -d "xml=<?xml version=\"1.0\"?><!DOCTYPE r [<!ENTITY x SYSTEM \"file:///etc/passwd\">]><r>&x;</r>" http://<alb>/parse'],
   sol:'ALB+EC2 跑应用 → 用 WAFv2 自定义 ByteMatch/RegexMatch 规则匹配 XXE 特征（DOCTYPE/SYSTEM/file:// 等，Body 或 URI）→ Custom Response Body 设 403 Forbidden error → 正常样本与三类攻击样本各打一遍。'}
  ]
 }
 ]
};
})();
