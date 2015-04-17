#Overview#
Service Controller Platform (SCP) is a system prototype which provides strategically automatic operation and maintenance scheme based on SDN.  SCP possesses capabilities of grouping the policies to generate new service, defining policy based on customers, giving out policies quickly and defining service chain. The target of SCP is to quickly respond customer’s need and to improve the customer experience effectively.

The overall architecture of SCP is shown as follows:
![image](https://github.com/chinatelecom-sdn-group/ServiceControlPlatform/raw/master/doc/SCP-Architecture.png)

SCP mainly contains 8 functional modules and depends on 3 plug-ins of ODL which are PM, SCM and PFM, the overall structure is shown as follows:
![image](https://github.com/chinatelecom-sdn-group/ServiceControlPlatform/raw/master/doc/SCP-Structure.png)

#Function#
* Simplify service orchestration by providing the method to define basic policy, to define service, to activate project etc.
* Simplify the complexity of policy distribution by connecting with SDN Controller(OpenDaylight).
* Manage resource pool in real time by defining YANG model of resource monitoring and connect with netconf server.
* Monitor customer status in real time by connecting with BRASes and update flowtables according to customer status.

#Environment#
mongodb >= 2.6.7

nodejs >= 0.10.29

#Installation#
	npm install

#Configuration#
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
#Run#
	node bin/ServiceControlPlatform

#Corporator#

*	Guangzhou Research Institute of China Telecom 

#Author#

##designer##
* Hong Tang(chinatelecom.sdn.group@gmail.com)
* Liang Ou(chinatelecom.sdn.group@gmail.com)

##Coder##
* Qianfeng Chen (chinatelecom.sdn.group@gmail.com)
* Peng Li (chinatelecom.sdn.group@gmail.com)
* Boqi Mo (chinatelecom.sdn.group@gmail.com)