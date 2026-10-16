/* =====================================================================
   全真模拟卷 · 全国职业院校技能大赛 云计算赛项（GZ033）· 国赛全真卷
   结构依据：2023 国赛 B 卷公开分值结构（私有云30+容器云30+公有云40，
   本站 30 天冲刺手册已收录该解剖）；任务面按赛项三年未变的模块骨架命题。
   环境为赛项典型双机架构。当届赛卷以官方为准。
   ===================================================================== */
(function(){
window.KC_PAPERS=window.KC_PAPERS||{};
window.KC_PAPERS['nation']={
 id:'nation',
 name:'全国职业院校技能大赛 · 云计算赛项（GZ075）· 国赛全真卷',
 tag:'国赛线 · 全真结构',
 order:8,
 desc:'两大场次三模块：第一场私有云30分+容器云30分（约 3 小时），第二场公有云40分（约 2 小时）。私有云 OpenStack 全链搭建、容器云 kubeadm 集群与 CI/CD、公有云控制台路径题——赛项三年未变的骨架，这里全真计时全真评分。',
 source:'模块/分值结构依据 2023 国赛 B 卷公开解剖（本站冲刺手册收录）；具体任务为同构原创命题，当届以官方赛卷为准',
 env:'双机虚拟机或真机：controller(控制节点) + compute(计算节点)，CentOS 7.9 / openEuler 22.03，OpenStack Train/Victoria，Kubernetes 1.2x；公有云模块可用华为云/阿里云免费额度替代演练',
 rules:'<b>赛项纪律</b>：① 搭建链用竞赛提供的 ISO/Yum 源，断网环境 ② IP 规划表发卷即给，改 IP 前先快照 ③ 结果评分为主：脚本逐项验证，做对得分 ④ 先交易得分项：搭建类是"模板送分"，先拿满再攻运维。',
 modules:[
 {
  name:'第一场 · 模块一 私有云（30 分 · 建议 150 分钟）',
  minutes:150,
  brief:'<p><b>IP 规划（赛卷典型）</b>：controller 192.168.100.10（外网 eth0）/ compute 192.168.100.20；内部管理网 192.168.200.0/24。OpenStack 组件安装链：基础环境 → MariaDB/RabbitMQ → Keystone → Glance → Nova → Neutron → Dashboard → Swift/Cinder。</p>',
  tasks:[
  {title:'任务1 · 私有云服务搭建（5 分 · 13 小题）',
   brief:'<p>模板送分链，闭卷标准流程。逐小题验收：</p>',
   checks:[
    {d:'Yum 源配置完成（本地 ISO 源 + 环境文件 /etc/profile 生效）',p:0.25},
    {d:'免密 SSH：controller↔compute 双向 ssh-copy-id 免密互通',p:0.5},
    {d:'MariaDB 安装调优：字符集 utf8、max_connections 调优参数生效',p:0.5},
    {d:'RabbitMQ：服务运行，创建 openstack 用户并授权',p:0.5},
    {d:'Keystone：创建域/项目/用户，admin-openrc 环境脚本可用',p:0.5},
    {d:'Glance：服务运行；上传 cirros 镜像并设置磁盘格式与启动参数（cpu_mode 等按要求）',p:0.5},
    {d:'Nova：controller+compute 双端安装，服务列表全部 up；nova-compute 注册成功',p:0.5},
    {d:'Neutron：provider 网络就绪，创建网络/子网/路由，外网网关正确',p:0.5},
    {d:'Dashboard：http://controller/dashboard 可登录',p:0.25},
    {d:'Swift：环生成成功，对象可上传下载',p:0.25},
    {d:'Cinder：卷服务正常，可创建/挂载卷到实例',p:0.25},
    {d:'创建云主机成功且能 ping 通/SSH 登录（全链验证）',p:0.5}
   ],
   refs:['openstack service list；openstack compute service list','source admin-openrc && openstack image create cirros --file cirros-0.6.1-x86_64-disk.qcow2 --disk-format qcow2 --public','openstack network create extnet --external --provider-physical-network provider --provider-network-type flat'],
   sol:'链路顺序：base → db/mq → keystone → glance → nova → neutron → horizon → swift/cinder → 起实例。每步用 verify 命令确认再做下一步，错误不隔夜。'},
  {title:'任务2 · 私有云服务运维（15 分）',
   brief:'<p>运维 8 件套典型面：Heat 编排、KVM 调优、NFS 对接 Glance、Redis 主从、系统调优、Neutron/Cinder 排错。同构命题如下：</p>',
   checks:[
    {d:'Heat：编写 stack 模板创建 1 台云主机+浮动 IP，stack 建立成功',p:3},
    {d:'KVM 调优：修改 compute 节点 CPU 模式为 host-passthrough 并重启服务生效',p:2},
    {d:'NFS：compute 节点导出 /nfs目录，Glance 后端对接 NFS 存储（镜像落 NFS）',p:2},
    {d:'Redis 主从：controller 主 compute 从，info 主从状态正常',p:2},
    {d:'系统调优：按要求修改内核参数（vm.swappiness / 文件句柄数）并持久化',p:2},
    {d:'排错① Neutron：修复人为断点（如配置文件被改），网络服务恢复',p:2},
    {d:'排错② Cinder：卷创建失败（日志定位到原因并修复）',p:2}
   ],
   refs:['heat_template_version: 2018-08-31 …（OS::Nova::Server + OS::Neutron::FloatingIP）','redis-cli -h 192.168.100.20 info replication','tail -f /var/log/cinder/scheduler.log /var/log/cinder/volume.log'],
   sol:'排错思路链固定：先 status → 再日志 → 再配置 diff → 回滚/修复 → 验证。Heat 模板先 yaml 语法校验再 stack-create。'},
  {title:'任务3 · 私有云运维开发（10 分）',
   brief:'<p>Shell 一键脚本 + Ansible 批量 + OpenStack SDK 开发三类：</p>',
   checks:[
    {d:'Shell：编写 iaas-install.sh 一键完成某组件安装（幂等可重跑）',p:3},
    {d:'Ansible：inventory 双机分组，playbook 部署 ELK 或 Kafka 任一',p:3},
    {d:'Python：使用 openstack SDK/客户端完成「列出所有实例并输出 CSV」脚本',p:2},
    {d:'Python：查询 MariaDB 中 nova 库 instance 信息并统计',p:2}
   ],
   refs:['ansible all -m ping -i hosts','python3 -c "import openstack;conn=openstack.connect();[print(s.name) for s in conn.compute.servers()]"'],
   sol:'Shell 用 systemd 判重保证幂等；Ansible 先 ping 通再上 playbook；SDK 用 service auth，注意 os-client-config 环境变量。'}
  ]
 },
 {
  name:'第一场 · 模块二 容器云（30 分 · 建议 120 分钟）',
  minutes:120,
  brief:'<p>kubeadm 三节点（1 master 2 node，容器运行时 containerd），网络 flannel/calico 均可。比赛常给离线包/私有仓库。</p>',
  tasks:[
  {title:'任务4 · 容器云服务搭建（5 分）',
   brief:'<p>闭卷 40 分钟内出活集群：</p>',
   checks:[
    {d:'kubeadm init 成功，master 就绪（NotReady→Ready 装好 CNI）',p:2},
    {d:'两个 node join 成功，get nodes 全 Ready',p:2},
    {d:'私有镜像仓库（registry/harbor 任一）可用且集群可拉取',p:1}
   ],
   refs:['kubeadm init --kubernetes-version=v1.2x.x --pod-network-cidr=10.244.0.0/16 --image-repository <私有仓库>','kubectl apply -f kube-flannel.yml'],
   sol:'swap off / selinux off / containerd pause 镜像指向私有仓库 → init → CNI → join。必背：三处 CRI 配置。'},
  {title:'任务5 · 容器云服务运维（15 分）',
   brief:'<p>YAML 填空题风格，8 连部署全有固定写法：</p>',
   checks:[
    {d:'容器化部署 MariaDB（PV/PVC 持久化 + Secret 传密码）可连接',p:2},
    {d:'容器化部署 Redis（Deployment+Service）',p:1.5},
    {d:'容器化部署 Nginx（NodePort 30080 外部可访问）',p:1.5},
    {d:'容器化部署 ERP 类应用（多容器 Pod 或 Compose 转 K8s）',p:2},
    {d:'GitLab + Runner 部署：注册 runner 成功',p:3},
    {d:'CI/CD：.gitlab-ci.yml 实现 build→push→deploy 到集群（Runner 用 k8s executor 或 shell）',p:3},
    {d:'审计日志开启（apiserver audit policy 配置生效）',p:2}
   ],
   refs:['kubectl create secret generic mysql-pass --from-literal=password=…','gitlab-runner register --url … --token … --executor kubernetes','kubectl apply -f audit-policy.yaml（apiserver --audit-policy-file）'],
   sol:'每类资源都有模板：Deployment+Service+PVC 三件套默写；GitLab CI 三段式 stages；审计策略 yml 背一条通用 policy。'},
  {title:'任务6 · 容器云运维开发（10 分）',
   brief:'<p>脚本与编排开发：</p>',
   checks:[
    {d:'Shell：批量清理 Evicted/Completed Pod 的脚本（可执行可复用）',p:3},
    {d:'编排：用 Job/CronJob 完成定时任务（数据库备份任务示例）',p:3},
    {d:'Python/K8s API：脚本列出集群全部 Pod 并输出 CSV（client-python 或 kubectl json 组合）',p:2},
    {d:'Helm：把任务5的 Nginx 改写成 chart 并部署（values 可配副本数）',p:2}
   ],
   refs:['kubectl get pods --field-selector=status.phase=Failed -o name | xargs kubectl delete','helm create nginx && helm install my-nginx ./nginx --set replicaCount=3'],
   sol:'field-selector + xargs 是固定套路；Helm 用 create 后改 templates 两文件。'}
  ]
 },
 {
  name:'第二场 · 模块三 公有云（40 分 · 建议 120 分钟）',
  minutes:120,
  brief:'<p>控制台路径题 + 云边协同。以华为云/阿里云任一可练平台完成同构任务（赛卷指定平台为准）。核心：按步骤拿路径分，不在界面上「探索」。</p>',
  tasks:[
  {title:'任务7 · 公有云资源交付（控制台路径分）',
   brief:'<p>按需求交付：VPC+子网、安全组、ECS 双机、OBS 桶、RDS 实例、弹性公网。每小项都按控制台操作路径给分：</p>',
   checks:[
    {d:'VPC（192.168.0.0/16）+ 2 子网 + 安全组（仅开放 80/443/22）',p:3},
    {d:'ECS ×2：1 台 Web（装 Nginx）+1 台 Redis（内网互通）',p:4},
    {d:'OBS 桶：上传静态页 + 桶策略公开读',p:3},
    {d:'RDS MySQL：规格按题、白名单仅限 ECS 网段',p:4},
    {d:'EIP 绑定 Web 机 + 域名解析（可用 hosts 模拟）',p:3},
    {d:'云监控：CPU 告警规则（>80% 触发通知）',p:3}
   ],
   refs:['控制台路径：网络控制台 → VPC → 创建；ECS → 购买 → 安全组配置；OBS → 桶策略；RDS → 白名单'],
   sol:'路径题的秘诀是「背路径」：本站教程第 12 章 AWS 实战与云厂商免费额度实操可直接映射。'},
  {title:'任务8 · KubeEdge 云边协同',
   brief:'<p>云端 K8s 集群 + 边缘节点 keadm 接入，边缘运行应用并上报数据：</p>',
   checks:[
    {d:'keadm init 云端就绪 + keadm join 边缘节点接入（edge node Ready）',p:4},
    {d:'边缘部署 Nginx（nodeSelector 指向边缘节点）外网可访问',p:4},
    {d:'边缘数据上报：云端可见 edge 应用日志/指标',p:4}
   ],
   refs:['keadm init --advertise-address=<云端IP> --kubeedge-version=1.1x.x','keadm join --cloudcore-ipport=<IP>:10000 --token=…'],
   sol:'keadm 两命令就出活；注意云端 10000/10002 端口放行，边缘离线包提前备好。'},
  {title:'任务9 · 平台运维开发（脚本分）',
   brief:'<p>用云厂商 CLI/SDK 完成开发题：</p>',
   checks:[
    {d:'CLI：脚本批量创建/释放 N 台 ECS（参数化）',p:3},
    {d:'SDK：脚本列出所有资源并输出成本报表 CSV',p:3},
    {d:'自动化：OOS/ROS 类编排模板一键建环境（或等价 Terraform）',p:2}
   ],
   refs:['aliyun ecs RunInstances … / huaweicloud ecs create…（SDK pip install aliyun-python-sdk-ecs）'],
   sol:'CLI 路径题背 3 条核心命令；SDK 题用官方 quickstart 模板改参数。'}
  ]
 }
 ]
};
})();
