/* =====================================================================
   全真模拟卷 · 2023 全国职业院校技能大赛（高职组）"云计算应用"赛项 赛卷1
   依据：公开赛卷原文（CSDN wangchuan_yyd 三篇连载，CC-BY-SA；调研题库
   ZT-02 全文收录，见 cloud-competition/research/zhenti-bank.md）。
   任务结构忠实原文：私有云30（搭建5/运维15/开发10）+ 容器云30（同）+
   公有云40（搭建5/运维10/开发10/边缘运维10/边缘开发5）。
   "只公布考试范围"的调优排错题按原文以范围题呈现。
   ===================================================================== */
(function(){
window.KC_PAPERS=window.KC_PAPERS||{};
window.KC_PAPERS['nation2023']={
 id:'nation2023',
 name:'2023 国赛真题全真卷 · 云计算应用赛项 赛卷1',
 tag:'国赛线 · 真题原文',
 order:11,
 desc:'2023 新赛制代表真题（★★★★★）：私有云含 Manila/SkyWalking/JumpServer/Redis 集群，容器云含 Prometheus 全家桶/Istio 网关/KubeVirt/CI-CD，公有云含 CCE/Helm/KubeEdge 边缘计算。双人团体赛制，本卷按单人全真执行。',
 source:'公开赛卷原文摘录（CSDN wangchuan_yyd：《2023 国赛赛卷1》三篇，题库 ZT-02）；图片占位以文字说明还原',
 env:'竞赛集群模式：私有云平台登录后创建云主机答题。自练环境：双机 OpenStack（controller/compute）+ 1 台 K8s master + 2 node + 华为云/任一公有云账号；IP 规划按原文 172.129.x.0/24（x=赛位号）',
 rules:'<b>原文赛制</b>：① 集群模式，每队独立租户与用户，2 名选手账号密码相同 ② 第二块网卡地址按题意自行创建 ③ 考试所需账号资源/竞赛资源包/附件在考位信息表与设备确认单中给出 ④ 比赛过程中请自行修改服务器密码 ⑤ 调优/排错题只公布考试范围不公布赛题——按范围自备检查单。',
 modules:[
 {
  name:'模块一 私有云（30 分）',
  minutes:150,
  brief:'<p><b>原文背景</b>：企业数字化转型，采用开源 OpenStack 搭建私有云平台，聚焦"DevOps 开发运维一体化"与"数据驱动产品开发"。工程师 A/B 分工协助完成云平台服务部署、云应用开发、云系统运维。</p><p><b>IP 规划（原文表1）</b>：controller eth0 172.129.x.0/24（x=赛位号）、eth1 自定义；compute 同网段；PC 172.24.16.0/24。</p>',
  tasks:[
  {title:'任务1 · 私有云服务搭建（5 分 · 13 小题）',
   brief:'<p>原文 1.1.1–1.1.13：</p>',
   checks:[
    {d:'1.1.1 基础环境：controller/compute 主机名 + hosts 映射',p:0.4},
    {d:'1.1.2 yum 源：双节点 http.repo 指向提供的 http 服务地址',p:0.4},
    {d:'1.1.3 无秘钥 SSH：controller 免密访问 compute',p:0.4},
    {d:'1.1.4 双节点安装 openstack-iaas 软件包',p:0.4},
    {d:'1.1.5 MariaDB/RabbitMQ 安装与调优',p:0.4},
    {d:'1.1.6 Keystone 安装并创建用户',p:0.4},
    {d:'1.1.7 Glance 安装；上传镜像并设置启动要求参数',p:0.4},
    {d:'1.1.8 Nova 双端安装并完成相关配置',p:0.4},
    {d:'1.1.9 Neutron 双端正确安装',p:0.4},
    {d:'1.1.10 Dashboard 安装；Django 数据改为文件存储（session 引擎）',p:0.4},
    {d:'1.1.11 Swift 双端安装；cirros 镜像分片存储（swift upload -S 分片）',p:0.4},
    {d:'1.1.12 Cinder 双端安装；计算节点对块存储扩容',p:0.3},
    {d:'1.1.13 Manila 服务安装与使用（共享文件系统）',p:0.3}
   ],
   refs:['openstack-share（manila）：openstack share create NFS 1 --name demo','swift upload cirros cirros.img -S 10485760（10MB 分片）','Dashboard session 文件化：local_settings.py SESSION_ENGINE = "django.contrib.sessions.backends.file"'],
   sol:'搭建链与 2022 卷同源，新增点：Manila（shared file systems）、Dashboard session 文件化、Swift 分片上传。'},
  {title:'任务2 · 私有云服务运维（15 分）',
   brief:'<p>原文 1.2.1–1.2.10：</p>',
   checks:[
    {d:'1.2.1 镜像权限：glance-cirros 共享给 demo 项目（member 角色绑定）',p:1.5},
    {d:'1.2.2 SkyWalking：云主机装 Elasticsearch+SkyWalking，另一台搭 gpmall 商城并被监控',p:2},
    {d:'1.2.3 镜像压缩：CentOS7.5-compress.qcow2 压缩（qemu-img convert -c / virt-sparsify）',p:1.5},
    {d:'1.2.4 Glance 对接 Cinder 后端存储（glance-api cinder store 配置生效）',p:2},
    {d:'1.2.5 Heat 模板：/root 下 yaml 创建名为 heat-swift 的容器',p:2},
    {d:'1.2.6 Nova 清除缓存（nova-manage 或指定宿主缓存清理）',p:1},
    {d:'1.2.7 Redis 集群部署（3 主 3 从 cluster）',p:2},
    {d:'1.2.8 Redis AOF 调优（appendonly/追写策略参数）',p:1},
    {d:'1.2.9 JumpServer 堡垒机部署并可登录管理',p:1.5},
    {d:'1.2.10 平台调优或排错（考试范围题：按检查单自证）',p:0.5}
   ],
   refs:['openstack image set --project demo（共享）或 image add-project','qemu-img convert -O qcow2 -c in.qcow2 out.qcow2','redis-cli --cluster create 127.0.0.1:7001 … 7006 --cluster-replicas 1','docker run -d --name jms_all …（JumpServer all-in-one）'],
   sol:'运维题全部有"验收动作"：镜像共享后用 demo 用户可见才算过；Heat 建 swift 容器后 openstack container list 要能看到 heat-swift。'},
  {title:'任务3 · 私有云运维开发（10 分）',
   brief:'<p>原文 1.3.1/1.3.4：</p>',
   checks:[
    {d:'1.3.1 Shell 一键部署脚本（按提供的 iaas 模块顺序，幂等可重跑）',p:5},
    {d:'1.3.4 OpenStack 平台自动化运维工具（范围题：巡检/报表/告警脚本任选实现并演示）',p:5}
   ],
   refs:['iaas-install-swift.sh && iaas-install-cinder.sh …','python3 openstack 巡检脚本（servers/nets/volumes 全导出 CSV）'],
   sol:'脚本开发题评分看「能跑+覆盖范围+输出规范」，写完必须当场上演示。'}
  ]
 },
 {
  name:'模块二 容器云（30 分）',
  minutes:120,
  brief:'<p>原文模块二：kubeadm 容器云平台 + 监控体系 + CI/CD + 服务网格 + 虚拟机化。</p>',
  tasks:[
  {title:'任务1 · 容器云服务搭建（5 分）',
   brief:'<p>原文 2.1.1：部署容器云平台（kubeadm 集群）。</p>',
   checks:[
    {d:'kubeadm 集群就绪（节点 Ready、CNI 正常）',p:4},
    {d:'私有镜像仓库可用（集群可拉取）',p:1}
   ],
   refs:['kubeadm init --image-repository … --pod-network-cidr …'],
   sol:'闭卷 40 分钟内出活集群——离线包 + 两处 containerd 配置必改。'},
  {title:'任务2 · 容器云服务运维（15 分）',
   brief:'<p>原文 2.2.1–2.2.12：</p>',
   checks:[
    {d:'2.2.1-4 容器化部署 Node-Exporter / Alertmanager / Grafana / Prometheus（四件套各自 Deployment+Service）',p:4},
    {d:'2.2.5 编排部署监控系统（kube-prometheus 或 compose 转 k8s，数据贯通）',p:2},
    {d:'2.2.6 安装 Jenkins',p:1},
    {d:'2.2.7 安装 GitLab',p:1},
    {d:'2.2.8 配置 Jenkins 连接 GitLab（webhook/凭据打通）',p:1.5},
    {d:'2.2.9 构建 CI/CD（提交代码→构建→部署到集群）',p:2},
    {d:'2.2.10 Istio：创建 Ingress Gateway（网格流量入口可用）',p:1.5},
    {d:'2.2.11 KubeVirt 运维：创建 VM（VirtualMachine 实例 Running）',p:1.5},
    {d:'2.2.12 容器云平台调优或排错（范围题）',p:0.5}
   ],
   refs:['kubectl apply -f kube-prometheus/…','istioctl install && kubectl apply -f gateway.yaml','kubectl apply -f vmi.yaml（KubeVirt + virt-launcher）'],
   sol:'监控四件套按依赖顺序：exporter → prometheus → alertmanager → grafana；KubeVirt 要先装 operator 再建 VM。'},
  {title:'任务3 · 容器云运维开发（10 分）',
   brief:'<p>原文 2.3.1–2.3.3：</p>',
   checks:[
    {d:'2.3.1 管理 Job 服务（创建/查看/清理完成的 Job）',p:3},
    {d:'2.3.2 自定义调度器（pod.spec.schedulerName 指定并验证调度）',p:4},
    {d:'2.3.3 K8s 平台自动化运维工具（范围题）',p:3}
   ],
   refs:['apiVersion: batch/v1 kind: Job …','schedulerName: my-scheduler（自部署第二调度器 + NodeName 绑定逻辑）'],
   sol:'自定义调度器最低可行实现：起一个调度器 Deployment + 指定 schedulerName 的测试 Pod 验证调度行为。'}
  ]
 },
 {
  name:'模块三 公有云（40 分）',
  minutes:120,
  brief:'<p>原文模块三：公有云资源交付 + 云容器引擎 + 运维开发 + KubeEdge 边缘计算。</p>',
  tasks:[
  {title:'任务1 · 公有云服务搭建（5 分）',
   brief:'<p>原文 3.1.1–3.1.11：</p>',
   checks:[
    {d:'3.1.1 私有网络管理（VPC/子网按题创建）',p:0.5},
    {d:'3.1.2 云实例管理（规格/镜像/按需计费）',p:0.5},
    {d:'3.1.3 管理数据库（RDS 创建）',p:0.5},
    {d:'3.1.4 主从数据库（主从关系建立）',p:0.5},
    {d:'3.1.5 node 环境管理（Node.js 环境安装配置）',p:0.5},
    {d:'3.1.6 安全组管理（按题放行端口）',p:0.5},
    {d:'3.1.7 RocketChat 上云（部署并可注册登录）',p:0.5},
    {d:'3.1.8 NAT 网关（私网出网）',p:0.5},
    {d:'3.1.10 负载均衡器（多实例分流验证）',p:0.5},
    {d:'3.1.11 弹性伸缩管理（AS 组+策略）',p:0.5}
   ],
   refs:['华为云控制台路径题：网络→VPC；计算→ECS；数据库→RDS；CCE…'],
   sol:'每小项 0.5 分——「做完且验过」各半，验证命令/页面截图留证。'},
  {title:'任务2 · 公有云服务运维（10 分）',
   brief:'<p>原文 3.2.1–3.2.6：</p>',
   checks:[
    {d:'3.2.1 云容器引擎 CCE 集群创建',p:2},
    {d:'3.2.2 云容器管理（工作负载部署）',p:1.5},
    {d:'3.2.3 kubectl 操作集群（kubeconfig 配置成功）',p:1.5},
    {d:'3.2.4 安装 Helm',p:1.5},
    {d:'3.2.5 chart 包 mariadb-7.3.14.tgz 部署并 NodePort 访问',p:2},
    {d:'3.2.6 mariadb 命名空间 + chart 配置修改（NodePort）',p:1.5}
   ],
   refs:['helm install maria ./mariadb -n mariadb --set service.type=NodePort','kubectl get svc -n mariadb'],
   sol:'Helm 三板斧：现有 tgz → values 修改 → install -n 指定命名空间。'},
  {title:'任务3 · 公有云运维开发（10 分）',
   brief:'<p>原文 3.3.1–3.3.5：</p>',
   checks:[
    {d:'3.3.1 开发环境搭建（SDK/CLI/IDE 就绪）',p:2},
    {d:'3.3.2 安全组管理（SDK 创建安全组）',p:2},
    {d:'3.3.3 安全组规则管理（规则增删查）',p:2},
    {d:'3.3.4 云主机管理（创建/查询/释放脚本化）',p:2},
    {d:'3.3.5 公有云自动化运维程序开发（范围题）',p:2}
   ],
   refs:['pip install huaweicloudsdkvpc / huaweicloudsdkecs …','vpc.createSecurityGroup(...)'],
   sol:'SDK 题按官方 quickstart 改参数；每个操作打日志。'},
  {title:'任务4 · 边缘计算系统运维（10 分）',
   brief:'<p>原文 3.4.1–3.4.3：</p>',
   checks:[
    {d:'3.4.1 云端部署（cloudcore 就绪）',p:3},
    {d:'3.4.2 边端部署（edgecore 接入，边缘节点 Ready）',p:4},
    {d:'3.4.3 边缘应用部署（应用调度到边缘并可访问）',p:3}
   ],
   refs:['keadm init --advertise-address=<云端IP>','keadm join --cloudcore-ipport=<IP>:10000 --token=…'],
   sol:'KubeEdge 云边两命令 + 端口放行（10000/10002）+ 边缘应用 nodeSelector。'},
  {title:'任务5 · 边缘计算云应用开发（5 分）',
   brief:'<p>原文 3.5：面向边缘场景的云应用开发（消息上云/边缘规则）。</p>',
   checks:[
    {d:'边缘数据采集应用部署并上报云端可见',p:3},
    {d:'云端下发控制/规则生效（端到端验证）',p:2}
   ],
   refs:['edge mesh / MQTT broker + 云端 rule（KubeEdge 场景）'],
   sol:'最小闭环：边端传感器模拟脚本 → MQTT/HTTP 上报 → 云端 Grafana/接口可见。'}
  ]
 }
 ]
};
})();
