#概述#
Service Controller Platform (简称SCP) 是一套基于SDN提供策略化自动运维方案的系统原型，提供各种类型的基础策略。SCP可以组合策略生成新的业务，可以基于用户定义策略，可以快速下发策略，可以定义业务链，以期能够快速响应客户业务的需求，提高集团客户的用户体验。

SCP的总体架构，如下图：
![image](https://github.com/chinatelecom-sdn-group/ServiceControlPlatform/raw/master/doc/SCP-Architecture.png)

SCP主要包括8个功能模块，依赖ODL中的PM、SCM、PFM等3个插件，整体结构如下图：

![image](https://github.com/chinatelecom-sdn-group/ServiceControlPlatform/raw/master/doc/SCP-Structure.png)

#功能#
*	通过提供定义基础策略、定义业务、激活项目等方式，简化业务编排操作流程
*	通过连接SDN Controller(opendaylight),简化策略下发复杂性
*	通过定义资源监控yang模型，连接netconf服务端，实时管理资源池
*	通过连接bras，实时监控用户状态，根据用户在线状态，实时更新流表

#环境#
mongodb >= 2.6.7

nodejs >= 0.10.29
#安装#
	npm install
#配置#
vi bin/config.js

	var system_cfg = {
	    	"mongodb": {
	       	"IP": "172.21.2.1",
	        "Port": "27019",
	        "ServiceControlPlatform": {
	            "User": "SCP",
	            "Password": "SCP123"
	        },
	        "PolicyManagement": {
	            "User": "PM",
	            "Password": "PM123"
	        }
	    },
	    "opendaylight": {
	        "IP": "172.21.2.6",
	        "Port": "8080",
	        "User": "admin",
	        "Password": "admin"
	    }
	}
	exports.system_cfg = system_cfg;
#运行#
	node bin/ServiceControlPlatform

#公司#

*	Guangzhou Research Institute of China Telecom 

#作者#

##设计##
* Hong Tang(chinatelecom.sdn.group@gmail.com)
* Liang Ou(chinatelecom.sdn.group@gmail.com)

##实现##
* Qianfeng Chen (chinatelecom.sdn.group@gmail.com)
* Peng Li (chinatelecom.sdn.group@gmail.com)
* Boqi Mo (chinatelecom.sdn.group@gmail.com)