/* =====================================================================
   全真模拟卷 · 广东省职业院校技能大赛（高职组）"云计算应用"赛项
   依据：2024 广东省样题①公开模块分值结构（CSDN 公开资料，调研已核验）：
   模块一 私有云 50 分 = 任务1 服务搭建10 + 任务2 服务运维25 + 任务3 运维开发15
   模块二 容器云 50 分 = 任务1 服务搭建10 + 任务2 服务运维25 + 任务3 运维开发15
   任务细节为同构原创（公开样题正文受平台限制，任务面按省赛典型题量编排）。
   ===================================================================== */
(function(){
window.KC_PAPERS=window.KC_PAPERS||{};
window.KC_PAPERS['guangdong']={
 id:'guangdong',
 name:'广东省职业院校技能大赛 · 云计算应用 · 省赛全真卷',
 tag:'省赛线 · 全真结构',
 order:5,
 desc:'省赛是国赛的同构缩印：私有云 50 分 + 容器云 50 分，任务结构完全一致（搭建 10 + 运维 25 + 运维开发 15）。省赛建议 240 分钟连续作答——先拿满搭建分，运维题按模板化清单逐项落。',
 source:'2024 广东省职业院校技能大赛（高职组）"云计算应用"赛项样题①公开分值结构；任务细节为同构原创',
 env:'双机虚拟机（controller + compute）：CentOS 7.9 / openEuler，OpenStack Train 离线包，K8s 离线包；也可直接复用国赛卷的实验环境',
 rules:'<b>省赛要诀</b>：① 省赛评分通常比国赛更紧贴任务书字面——照题面参数原样落，别自由发挥 ② 搭建任务约 20 分是送分链，目标 40 分钟内完成 ③ 运维 25 分大题里必有「部署+配置+验证」三段，验证不做的等于白做。',
 modules:[
 {
  name:'模块一 私有云（50 分 · 建议 120 分钟）',
  minutes:120,
  brief:'<p><b>环境</b>：双机 OpenStack（controller 192.168.100.10 / compute 192.168.100.20），镜像 cirros，离线 yum 源。企业背景题面：数字化平台聚焦 DevOps 与数据驱动。</p>',
  tasks:[
  {title:'任务1 · 私有云服务搭建（10 分）',
   brief:'<p>基础环境 + 核心组件安装链：</p>',
   checks:[
    {d:'双机主机名/IP/hosts 配置正确；免密互通',p:1},
    {d:'Yum 源 + 环境变量脚本生效',p:1},
    {d:'MariaDB/RabbitMQ/Memcached 运行且调优参数生效',p:2},
    {d:'Keystone/Glance/Nova/Neutron/Dashboard 五件套服务正常',p:4},
    {d:'可创建云主机并可访问（全链验证）',p:2}
   ],
   refs:['iaas-install 系列脚本或手装；openstack service list'],
   sol:'省赛搭建题是国赛搭建链的子集：顺序不变，参数从题面抄。'},
  {title:'任务2 · 私有云服务运维（25 分）',
   brief:'<p>运维大题五连（每题都含「做出来+验出来」两层分）：</p>',
   checks:[
    {d:'Glance 对接 Cinder/Swift 后端并验证镜像创建',p:5},
    {d:'Nova 平台管理：规格创建/资源配额调整/实例迁移',p:5},
    {d:'Neutron 运维：新建租户网络拓扑并验证连通',p:5},
    {d:'Cinder 扩容：卷扩容/快照/恢复全流程',p:5},
    {d:'平台排错：修复 1 处组件故障并验证恢复',p:5}
   ],
   refs:['openstack flavor create --disk 10 --ram 2048 …','openstack volume snapshot create …','tail -f /var/log/neutron/server.log'],
   sol:'每小题的验证命令平时就要背：运维 25 分里「验证层」的分不比操作层少。'},
  {title:'任务3 · 私有云运维开发（15 分）',
   brief:'<p>脚本开发三连：</p>',
   checks:[
    {d:'Shell：按要求编写云主机管理脚本（参数化）',p:5},
    {d:'OpenStack CLI/SDK：查询资源并按格式输出',p:5},
    {d:'数据库操作：SQL 完成指定查询与统计',p:5}
   ],
   refs:['openstack server list --format csv','mysql -e "select …" nova'],
   sol:'输出格式（csv/json）题面会明确要求——格式错了整题扣，抄好题面。'}
  ]
 },
 {
  name:'模块二 容器云（50 分 · 建议 120 分钟）',
  minutes:120,
  brief:'<p>单机 Docker + 三节点 K8s（可用 1 master 2 node 或全部一机模拟）。</p>',
  tasks:[
  {title:'任务1 · 容器云服务搭建（10 分）',
   brief:'<p>容器环境与集群：</p>',
   checks:[
    {d:'Docker 安装 + 镜像加速器 + 私有仓库可用',p:3},
    {d:'K8s 集群搭建完成（节点 Ready）',p:4},
    {d:'Dashboard/metrics-server 任一组件按题要求部署',p:3}
   ],
   refs:['kubeadm init --image-repository …；kubectl apply -f recommended.yaml'],
   sol:'搭建 10 分要在 40 分钟内拿下——全部用离线包+脚本，现场不下载任何东西。'},
  {title:'任务2 · 容器云服务运维（25 分）',
   brief:'<p>运维五连：</p>',
   checks:[
    {d:'容器化部署 Web 应用（含 ConfigMap 配置挂载）',p:5},
    {d:'数据库容器化 + PVC 持久化 + 备份策略',p:5},
    {d:'Service/Ingress 暴露与域名访问',p:5},
    {d:'HPA 伸缩 / 滚动更新 / 回滚三连操作',p:5},
    {d:'集群排错：Pod 无法起/节点 NotReady 修复',p:5}
   ],
   refs:['kubectl rollout undo deployment web；kubectl describe pod …（Events 定位）'],
   sol:'排错优先看 Events 与 describe，90% 的省赛容器题在这两步内见答案。'},
  {title:'任务3 · 容器云运维开发（15 分）',
   brief:'<p>开发三连：</p>',
   checks:[
    {d:'Dockerfile 编写并构建业务镜像（规范分层+元数据）',p:5},
    {d:'Shell：容器/集群批量巡检脚本',p:5},
    {d:'CI/CD 或编排开发：pipeline/chart 任一交付',p:5}
   ],
   refs:['docker build -t app:v1 -f Dockerfile .；helm create web'],
   sol:'Dockerfile 押题：多阶段构建+HEALTHCHECK+非 root 用户是常见加分点。'}
  ]
 }
 ]
};
})();
