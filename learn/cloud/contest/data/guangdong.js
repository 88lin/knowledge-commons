/* =====================================================================
   全真模拟卷 · 2024 广东省职业院校技能大赛（高职组）"云计算应用"赛项 样题①
   依据：公开赛卷原文（CSDN 2401_86394104 发布样题①正文；调研题库 ZT-07
   全文收录，见 cloud-competition/research/zhenti-bank.md）。
   任务结构忠实原文：模块一 私有云 50 分 = 搭建10 + 运维25 + 开发15；
   模块二 容器云 50 分 = 搭建10 + 运维25 + 开发15。
   ===================================================================== */
(function(){
window.KC_PAPERS=window.KC_PAPERS||{};
window.KC_PAPERS['guangdong']={
 id:'guangdong',
 name:'2024 广东省赛真题全真卷 · 云计算应用 样题①',
 tag:'省赛线 · 真题原文',
 order:10,
 desc:'2024 广东省样题①真题结构：私有云 50 分（含 Manila 前身的 13 小题搭建链、Ceph 三对接、Heat/KVM/Redis 运维面、ELK+Kafka 开发面）+ 容器云 50 分（ERP 编排、GitLab 全家桶 CI/CD、Istio VirtualService、KubeVirt VMI）。省赛同构卷的标杆。',
 source:'公开赛卷原文摘录（CSDN 2401_86394104《2024 广东省样题①》，题库 ZT-07）；另有样题②-⑤同系列可轮换练习（见题库 ZT-08~ZT-11）',
 env:'双机虚拟机：controller + compute（CentOS 7.9/openEuler，OpenStack Train 离线包）+ K8s 三节点离线包；IP 按赛卷规划表',
 rules:'<b>省赛要诀</b>：① 照题面参数原样落，不自由发挥 ② 搭建 10 分是送分链，目标 40 分钟 ③ 运维 25 分每题含「做出来+验出来」两层 ④ 调优排错题只给范围——平时积累检查单。',
 modules:[
 {
  name:'模块一 私有云（50 分 · 建议 120 分钟）',
  minutes:120,
  brief:'<p><b>原文企业背景</b>：某企业实施数字化转型，规划数字化平台，聚焦"DevOps 开发运维一体化"和"数据驱动产品开发"，采用开源 OpenStack 搭建企业内部私有云平台。</p>',
  tasks:[
  {title:'任务1 · 私有云服务搭建（10 分 · 13 小题）',
   brief:'<p>原文 1.1.1–1.1.13（在国赛链基础上省赛略有增删）：</p>',
   checks:[
    {d:'1.1.1 基础环境：双机主机名 + hosts 映射',p:1},
    {d:'1.1.3 无秘钥 SSH：controller 免密 compute',p:0.5},
    {d:'1.1.4 双机安装 openstack-iaas 包',p:0.5},
    {d:'1.1.5 MariaDB/RabbitMQ 安装与调优',p:1.5},
    {d:'1.1.6 Keystone 安装并创建用户',p:1},
    {d:'1.1.7 Glance 安装；上传镜像并设置启动参数',p:1},
    {d:'1.1.8 Nova 双端安装与配置',p:1},
    {d:'1.1.9 Neutron 双端安装',p:1},
    {d:'1.1.10 Dashboard 安装',p:0.5},
    {d:'1.1.11 Swift 双端安装',p:0.5},
    {d:'1.1.12 Cinder 双端安装；计算节点块存储扩容',p:0.5},
    {d:'1.1.13 配置主机禁 ping（内核参数 net.ipv4.icmp_echo_ignore_all=1）',p:0.5},
    {d:'全链验证：可创建云主机并可访问',p:0.5}
   ],
   refs:['iaas 系列脚本顺序：base→db/mq→keystone→glance→nova→neutron→dashboard→swift→cinder','sysctl -w net.ipv4.icmp_echo_ignore_all=1（持久化写 /etc/sysctl.conf）'],
   sol:'禁 ping 是省赛特色小题：sysctl 内核参数题记得持久化，别只 echo 到运行时。'},
  {title:'任务2 · 私有云服务运维（25 分）',
   brief:'<p>原文 1.2.1–1.2.11：运维大题含 Ceph 全家桶三对接——这是省赛卷的分水岭：</p>',
   checks:[
    {d:'1.2.1 Heat 模板创建用户（OS::Keystone::User 模板执行成功）',p:2.5},
    {d:'1.2.2 KVM 优化（CPU/内存/IO 按题调优并重启服务生效）',p:2.5},
    {d:'1.2.3 NFS 对接 Glance 后端存储（镜像落 NFS）',p:2.5},
    {d:'1.2.4 Redis 主从（主从复制状态验证）',p:2},
    {d:'1.2.5 Linux 系统调优——脏数据回写（vm.dirty_ratio 等参数）',p:2},
    {d:'1.2.6 Glance 调优（缓存/进程参数按题）',p:2},
    {d:'1.2.7 Ceph 部署（monitor/osd 全部 up）',p:3.5},
    {d:'1.2.8 Glance 对接 Ceph 存储',p:2},
    {d:'1.2.9 Cinder 对接 Ceph 存储',p:2},
    {d:'1.2.10 Nova 对接 Ceph 存储（临时盘/配置走 RBD）',p:2},
    {d:'1.2.11 平台调优或排错（范围题：按检查单自证）',p:2}
   ],
   refs:['ceph-deploy new controller compute && ceph-deploy mon create-initial && ceph-deploy osd create …','glance-api.conf: stores = rbd,default_store = rbd + rbd_store_* 参数','cinder.conf volume_driver = cinder.volume.drivers.rbd.RBDDriver','nova.conf images_type = rbd'],
   sol:'Ceph 三对接是本卷最难也最稳的 9 分：部署好 Ceph 后三个组件的对接配置是模板化的，背熟。'},
  {title:'任务3 · 私有云运维开发（15 分）',
   brief:'<p>原文 1.3.1–1.3.4：</p>',
   checks:[
    {d:'1.3.1 Shell 一键部署脚本（幂等可重跑）',p:4},
    {d:'1.3.2 Ansible 部署 ELK 服务（Playbook 结构完整、部署成功）',p:4},
    {d:'1.3.3 Ansible 部署 Kafka 服务',p:4},
    {d:'1.3.4 OpenStack 平台自动化运维工具（范围题）',p:3}
   ],
   refs:['ansible-playbook -i hosts elk.yml（es/logstash/kibana 三角色）','kafka 依赖 zookeeper：先 zk 后 broker'],
   sol:'Ansible 两题占 8 分：roles 目录结构 + idempotency 是评分眼。'}
  ]
 },
 {
  name:'模块二 容器云（50 分 · 建议 120 分钟）',
  minutes:120,
  brief:'<p>原文模块二：容器云平台 + ERP 编排 + GitLab 全家桶 + 服务网格 + KubeVirt。</p>',
  tasks:[
  {title:'任务1 · 容器云服务搭建（10 分）',
   brief:'<p>原文 2.1.1：部署容器云平台。</p>',
   checks:[
    {d:'kubeadm 集群就绪（节点 Ready、CNI、CoreDNS 正常）',p:6},
    {d:'私有镜像仓库可用且集群可拉取',p:2},
    {d:'metrics-server/ Dashboard 等按题面要求的组件就位',p:2}
   ],
   refs:['kubeadm init --kubernetes-version … --image-repository … --pod-network-cidr …'],
   sol:'搭建 10 分要 40 分钟内拿下：离线包三处配置（swap/selinux/containerd）一次到位。'},
  {title:'任务2 · 容器云服务运维（25 分）',
   brief:'<p>原文 2.2.1–2.2.12：四连部署 + 编排 + CI/CD + 网格 + 虚拟机：</p>',
   checks:[
    {d:'2.2.1 容器化部署 MariaDB（PVC 持久化 + Secret 传密）',p:2.5},
    {d:'2.2.2 容器化部署 Redis',p:2},
    {d:'2.2.3 容器化部署 Nginx',p:2},
    {d:'2.2.4 容器化部署 ERP',p:2},
    {d:'2.2.5 编排部署 ERP 管理系统（多资源清单联动，可访问）',p:2.5},
    {d:'2.2.6 部署 GitLab',p:2},
    {d:'2.2.7 部署 GitLab Runner',p:2},
    {d:'2.2.8 部署 GitLab Agent（集群与 GitLab 连接）',p:2},
    {d:'2.2.9 构建 CI/CD（提交→构建→部署全流程）',p:3},
    {d:'2.2.10 Istio：创建 VirtualService（流量规则生效）',p:2.5},
    {d:'2.2.11 KubeVirt 运维：创建 VMI（VirtualMachineInstance Running）',p:2},
    {d:'2.2.12 容器云平台调优或排错（范围题）',p:0.5}
   ],
   refs:['kubectl apply -f erp-{deploy,svc,pvc}.yaml','gitlab-runner register --executor kubernetes …','kubectl apply -f virtualservice.yaml（hosts/route 配置）','KubeVirt：kubectl apply -f kubevirt-operator.yaml + kubevirt-cr.yaml，然后 VMI 清单'],
   sol:'ERP 编排题注意资源依赖顺序（PVC→Secret→Deployment→Service）；VirtualService 需先有 Gateway/DestinationRule 铺垫。'},
  {title:'任务3 · 容器云运维开发（15 分）',
   brief:'<p>原文 2.3.1–2.3.3：</p>',
   checks:[
    {d:'2.3.1 管理 Service 资源（创建/修改/排错验证）',p:5},
    {d:'2.3.2 管理 Pod 服务（生命周期操作+字段配置验证）',p:5},
    {d:'2.3.3 Kubernetes 平台自动化运维工具（范围题）',p:5}
   ],
   refs:['kubectl expose / edit / patch …','client-python 或 kubectl json 输出 CSV 巡检'],
   sol:'开发题都允许用「脚本+kubectl 组合」：关键是可重复执行和输出规范。'}
  ]
 }
 ]
};
})();
