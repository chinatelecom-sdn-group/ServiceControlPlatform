/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements active project、 listen project、create session
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var nodegrass = require('nodegrass');//http工具库
var system_cfg = require('../../models/db/system_cfg');
var session_instance_collection = require('./session_instance').module.collection;
var subscriber_collection = require('../subscriber_mgr/subscriber_config').module.collection;
var subscriber_group_collection = require('../subscriber_mgr/subscriber_group_config').module.collection;
var service_package_collection = require('../service_mgr/service_package').module.collection;
var service_template_collection = require('../service_mgr/service_template').module.collection;
var policy_group_collection = require('../policy_mgr/policy_group_config').module.collection;
var policy_entry_collection = require('../policy_mgr/policy_config').module.collection;
var crypto = require('crypto');//做md5
var policy_handler = require("./policy_handler");
var monitor_entry = require('../../models/system_models/monitor_entry');
//--------------------------------------------------------------------------
function toArray(array){
    //console.log(typeof object);
    var id_array = new Array();
    for(var i=0; i<array.length; i++) {
        id_array.push(array[i]._id);
    }
    return id_array;
}

function json_param_to_array(objson,param){
    var array = new Array();
    for(var i=0; i<objson.length; i++){
        var tmp = toArray(objson[i][param]);
        for(var j=0; j<tmp.length; j++){
            array.push(tmp[j]);
        }
    }
    return array;
}

function get_service_package_id_by_policy_group_id(resource_list,policy_group_id){
    var service_template_id = resource_list.ServiceTemplateMap[policy_group_id].id;
    var service_package_id = resource_list.ServicePackageMap[service_template_id].id;
    return service_package_id;
}

//获取用户组列表
function get_subscriber_group_list(req,res,resource_list,callback){
    //console.log("[info]get_subscriber_group_list:"+req.body.SubscriberGroupIDs);
    var subscriber_group = system_cfg.getOperationByName(subscriber_group_collection);
    var array = toArray(req.body.SubscriberGroupList);
    var model = {
        search:{_id:{$in:array}},
        columns:'id Name Type SubscriberList'
    };
    //查询数据库
    subscriber_group.get(model,function(err,result){
        if(err!=null){
            callback(err,null);
        }else{
            resource_list.VirtualSubscriberGroupList = [];
            resource_list.SubscriberGroupList = [];
            resource_list.SubscriberGroupMap = {};
            for(var SubscriberGroupIndex in result){
                //console.log("SubscriberGroup:"+typeof result[SubscriberGroup].SubscriberIDs);
                console.log(result[SubscriberGroupIndex]);
                var SubscriberGroup = result[SubscriberGroupIndex];
                if(SubscriberGroup.Type=="Normal"){
                    var index = resource_list.SubscriberGroupList.length;
                    resource_list.SubscriberGroupList[index] = SubscriberGroup;
                }else if(SubscriberGroup.Type=="Virtual"){
                    var index = resource_list.VirtualSubscriberGroupList.length;
                    resource_list.VirtualSubscriberGroupList[index] = SubscriberGroup;
                }
                //记录映射关系
                for(var i=0; i<SubscriberGroup.SubscriberList.length; i++ ){
                    var key = SubscriberGroup.SubscriberList[i]._id;
                    var tmp = {"id":"","name":""};
                    tmp.id = SubscriberGroup._id;
                    tmp.name = SubscriberGroup.Name;
                    resource_list.SubscriberGroupMap[key] = tmp;
                }
            }
            callback(null,resource_list);
        }
    });
}

function get_service_package_list(req,res,resource_list,callback){
    //console.log("[info]get_service_package:"+req.body.ServicePackageIDs);
    var service_package = system_cfg.getOperationByName(service_package_collection);
    var array = toArray(req.body.ServicePackageList);
    var model = {
        search:{_id:{$in:array}},
        columns:'id Name ServiceTemplateList'
    };
    service_package.get(model,function(err,result){
        if(err!=null){
            err.message = "service_package.get error";
            callback(err,null);
        }else{
            resource_list.ServicePackageList = result;
            resource_list.ServicePackageMap = {};
            for(var ServicePackage in result){
                //console.log("PolicyEntryIDs:"+typeof result[PolicyGroup].PolicyEntryIDs);
                for(var i=0; i<result[ServicePackage]. ServiceTemplateList.length; i++ ){
                    var key = result[ServicePackage]. ServiceTemplateList[i]._id;
                    var tmp = {"id":"","name":""};
                    tmp.id = result[ServicePackage]._id;
                    tmp.name = result[ServicePackage].Name;
                    resource_list.ServicePackageMap[key] = tmp;
                }
            }
            callback(null,resource_list);
        }
    });
}

function get_service_template_list(req,res,resource_list,callback){
    //console.log("[info]get_service_template_list:"+resource_list.ServicePackageList);
    var service_template = system_cfg.getOperationByName(service_template_collection);
    var array = json_param_to_array(resource_list.ServicePackageList,"ServiceTemplateList");
    var model = {
        search:{_id:{$in:array}},
        columns:'id Name Type PolicyGroupList'
    };
    service_template.get(model,function(err,result){
        if(err!=null){
            err.message = "service_template.get error";
            callback(err,null);
        }else{
            resource_list.ServiceTemplateList = result;
            resource_list.ServiceTemplateMap = {};
            for(var ServiceTemplate in result){
                //console.log("PolicyEntryIDs:"+typeof result[PolicyGroup].PolicyEntryIDs);
                for(var i=0; i<result[ServiceTemplate].PolicyGroupList.length; i++ ){
                    var key = result[ServiceTemplate].PolicyGroupList[i]._id;
                    var tmp = {"id":"","name":""};
                    tmp.id = result[ServiceTemplate]._id;
                    tmp.name = result[ServiceTemplate].Name;
                    resource_list.ServiceTemplateMap[key] = tmp;
                }
            }
            callback(null,resource_list);
        }
    });
}
function get_policy_group_list(req,res,resource_list,callback){
    //console.log("[info]get_policy_group_list:"+resource_list.ServiceTemplateList);
    var policy_group = system_cfg.getOperationByName(policy_group_collection);
    var array = json_param_to_array(resource_list.ServiceTemplateList,"PolicyGroupList");
    var model = {
        search:{_id:{$in:array}},
        columns:'id Name PolicyList'
    };
    policy_group.get(model,function(err,result){
        if(err!=null){
            err.message = "policy_group.get error";
            callback(err,null);
        }else{
            resource_list.PolicyGroupList = result;
            resource_list.PolicyGroupMap = {};
            resource_list.PolicyGroupListMap = {};
            for(var PolicyGroup in result){
                //console.log("PolicyEntryIDs:"+typeof result[PolicyGroup].PolicyEntryIDs);
                for(var i=0; i<result[PolicyGroup].PolicyList.length; i++ ){
                    var key = result[PolicyGroup].PolicyList[i]._id;
                    var tmp = {"id":"","name":""};
                    tmp.id = result[PolicyGroup]._id;
                    tmp.name = result[PolicyGroup].Name;
                    resource_list.PolicyGroupMap[key] = tmp;
                }
                //组织PolicyGroupListMap
                var service_package_id = get_service_package_id_by_policy_group_id(resource_list,result[PolicyGroup]._id);
                if(!resource_list.PolicyGroupListMap.hasOwnProperty(service_package_id)){
                    resource_list.PolicyGroupListMap[service_package_id] = new Array();
                }
                resource_list.PolicyGroupListMap[service_package_id].push(result[PolicyGroup]);
            }
            callback(null,resource_list);
        }
    });
}

function get_subscriber_list(req,res,resource_list,callback){
    //console.log("[info]get_subscriber_list:"+resource_list.SubscriberGroupList);
    var subscriber = system_cfg.getOperationByName(subscriber_collection);
    var array = json_param_to_array(resource_list.SubscriberGroupList,"SubscriberList");
    var model = {
        search:{_id:{$in:array}},
        columns:'id Account IPAddress'
    };
    subscriber.get(model,function(err,result){
        if(err!=null){
            err.message = "get_subscriber_list.get error";
            callback(err,null);
        }else{
            //组装resource_list
            resource_list.SubscriberList = result;
            callback(null,resource_list);
        }
    });
}

function get_virtual_subscriber_list(req,res,resource_list,callback){
    console.log("[info]get_subscriber_list:"+resource_list.VirtualSubscriberGroupList);
    var subscriber = system_cfg.getOperationByName("VirtualSubscriber");//查找VirtualSubscriber
    var array = json_param_to_array(resource_list.VirtualSubscriberGroupList,"SubscriberList");
    var model = {
        search:{_id:{$in:array}},
        columns:'id Name HeadMd5'
    };
    subscriber.get(model,function(err,result){
        if(err!=null){
            err.message = "virtual_subscriber_list.get error";
            callback(err,null);
        }else{
            //组装resource_list
            resource_list.VirtualSubscriberList = result;
            callback(null,resource_list);
        }
    });
}

function get_policy_list(req,res,resource_list,callback){
    //console.log("[info]get_policy_list:"+resource_list.PolicyGroupList);
    var policy_entry = system_cfg.getOperationByName(policy_entry_collection);
    var array = json_param_to_array(resource_list.PolicyGroupList,"PolicyList");
    var model = {
        search:{_id:{$in:array}},
        columns:'id Name Type Priority Content'
    };
    policy_entry.get(model,function(err,result){
        if(err!=null){
            err.message = "policy_entry.get error";
            callback(err,null);
        }else{
            resource_list.PolicyList = result;
            resource_list.PolicyListMap = {};
            for(var Policy in result){
                //组织PolicyGroupListMap
                var policy_id = result[Policy]._id;
                var policy_group_id = resource_list.PolicyGroupMap[policy_id].id;
                if(!resource_list.PolicyListMap.hasOwnProperty(policy_group_id)){
                    resource_list.PolicyListMap[policy_group_id] = new Array();
                }
                resource_list.PolicyListMap[policy_group_id].push(result[Policy]);
            }
            callback(null,resource_list);
        }
    });
}

function get_resource_topo_list(req,res,resource_list,callback) {
    monitor_entry.get_globol_topo("",function(err,results)
    {
        if(err==null){
            resource_list["resource_topo"] = results.host;
            callback(null,resource_list);
        }else{
            callback(err,resource_list);
        }
    });
}
function get_host_sequence(req,res,resource_list,callback){
    monitor_entry.get_variable_by_name("host_sequence",function(error,host_sequence){
        if(error!=null){
            callback(error,resource_list);
        }else{
            resource_list["host_sequence"] = host_sequence.value;
            callback(null,resource_list);
        }
    });
}
//建造instance的policy部分
function build_instance_policy_content(instance,resource_list){
    for(var ServicePackageIndex=0; ServicePackageIndex<resource_list.ServicePackageList.length;ServicePackageIndex++) {
        //建立instance
        var ServicePackage = resource_list.ServicePackageList[ServicePackageIndex];
        var ServicePackageIDListIndex = instance.ServicePackageIDList.length;
        instance.ServicePackageIDList[ServicePackageIDListIndex] = ServicePackage._id;
        instance.ServicePackageNameList[ServicePackageIDListIndex] = ServicePackage.Name;
        //根据serviceID查询PolicyGroupID
        var PolicyGroupList = resource_list.PolicyGroupListMap[ServicePackage._id];
        if (PolicyGroupList != null) {
            //查找相应的policy group
            for (var PolicyGroupIndex = 0; PolicyGroupIndex < PolicyGroupList.length; PolicyGroupIndex++) {
                var PolicyGroup = PolicyGroupList[PolicyGroupIndex];
                var PolicyGroupIDListIndex = instance.PolicyGroupIDList.length;
                instance.PolicyGroupIDList[PolicyGroupIDListIndex] = PolicyGroup._id;
                instance.PolicyGroupNameList[PolicyGroupIDListIndex] = PolicyGroup.Name;
                //根据PolicyGroupID查询PolicyList
                var PolicyList = resource_list.PolicyListMap[PolicyGroup._id];
                for (var PolicyIndex = 0; PolicyIndex < PolicyList.length; PolicyIndex++) {
                    var Policy = {
                        ID: PolicyList[PolicyIndex]._id,
                        Name: PolicyList[PolicyIndex].Name,
                        Type: PolicyList[PolicyIndex].Type,
                        GroupID: PolicyGroup._id,
                        Priority: PolicyList[PolicyIndex].Priority,
                        Content: PolicyList[PolicyIndex].Content
                    };
                    Policy = policy_handler.handle(Policy,instance,resource_list);
                    //保存到instance
                    instance.PolicyList.push(Policy);
                }
            }
        }
        return instance;
    }
}

function build_slave_instance_policy_content(instance,resource_list){
    instance.ServiceType = resource_list.MasterSession.ServiceType;
    instance.ServicePackageIDList = resource_list.MasterSession.ServicePackageIDList;
    instance.ServicePackageNameList = resource_list.MasterSession.ServicePackageNameList;
    instance.PolicyGroupIDList = resource_list.MasterSession.PolicyGroupIDList;
    instance.PolicyGroupNameList = resource_list.MasterSession.PolicyGroupNameList;
    instance.PolicyList = resource_list.MasterSession.PolicyList;
    var headhost = "";
    var tailhost = "";
    if(instance.Context.HostList.length>0){
        var index = instance.Context.HostList.length - 1;
        headhost = instance.Context.HostList[0];
        tailhost= instance.Context.HostList[index];
        if(resource_list.TemplateHeadList.length==1){
            build_left_to_right_add_head_policy(headhost,instance,resource_list,resource_list.TemplateHeadList[0],"ipaddhead");
            build_right_to_left_add_head_policy(tailhost,instance,resource_list,resource_list.TemplateHeadList[0],"ipaddheadback");
            build_left_to_right_add_head_policy(headhost,instance,resource_list,resource_list.TemplateHeadList[0],"arpaddhead");
            build_right_to_left_add_head_policy(tailhost,instance,resource_list,resource_list.TemplateHeadList[0],"arpaddheadback");
        }else if(resource_list.TemplateHeadList.length>=2){
            build_left_to_right_add_head_policy(headhost,instance,resource_list,resource_list.TemplateHeadList[0],"ipaddhead");
            build_right_to_left_add_head_policy(tailhost,instance,resource_list,resource_list.TemplateHeadList[1],"ipaddheadback");
            build_left_to_right_add_head_policy(headhost,instance,resource_list,resource_list.TemplateHeadList[0],"arpaddhead");
            build_right_to_left_add_head_policy(tailhost,instance,resource_list,resource_list.TemplateHeadList[1],"arpaddheadback");
        }else{
            console.log("[error][build_slave_instance_policy_content]resource_list.TemplateHeadList:"+resource_list.TemplateHeadList.length);
        }
    }else{
        console.log("[error][build_slave_instance_policy_content]instance.Context.HostList.length:"+instance.Context.HostList.length);
    }
}

function build_left_to_right_add_head_policy(host,instance,resource_list,templateHead,addHeadTable){
    var policy = {
        ID:"-",
        Name:"",
        Type:"AddFlowEntry",
        GroupID:"-",
        Priority:0,
        Content:"-"
    };
    var policy_content = {
        table:addHeadTable,
        host:[host],
        actions:[]
    };
    var policy_action_1 = {
        actionName:"inst_header",
        actionOptions:"[offset="+templateHead.Offset+",header="+templateHead.Name+"]"
    };
    var table = "checkhead"+resource_list.MasterSession.Context.PortInfo.Inport;
    policy_content.actions.push(policy_action_1);
    var policy_action_2 = {
        actionName:"goto_table",
        actionOptions:"[tid="+table+",bytepos=0]"
    };
    policy_content.actions.push(policy_action_2);
    policy.Content =  JSON.stringify(policy_content);
    instance.Context.EffectPolicy.push(policy);//真正生效的policy
}

function build_right_to_left_add_head_policy(host,instance,resource_list,templateHead,addHeadTable){
    var policy = {
        ID:"-",
        Name:"",
        Type:"AddFlowEntry",
        GroupID:"-",
        Priority:0,
        Content:"-"
    };
    var policy_content = {
        table:addHeadTable,
        host:[host],
        actions:[]
    };
    var policy_action_1 = {
        actionName:"inst_header",
        actionOptions:"[offset="+templateHead.Offset+",header="+templateHead.Name+"]"
    };
    var table = "checkhead"+resource_list.MasterSession.Context.PortInfo.Export;
    policy_content.actions.push(policy_action_1);
    var policy_action_2 = {
        actionName:"goto_table",
        actionOptions:"[tid="+table+",bytepos=0]"
    };
    policy_content.actions.push(policy_action_2);
    policy.Content =  JSON.stringify(policy_content);
    instance.Context.EffectPolicy.push(policy);//真正生效的policy
}

function create_instance(projectId,projectName,masterProjectId){
    var instance = {
        "ProjectID":projectId,
        "ProjectName":projectName,
        "ProjectMasterID":masterProjectId,//代表由从project产生
        "HeadHex":"",//PF template head
        "SubscriberGroupID": "-",
        "SubscriberGroupName": "-",
        "PMInstanceID":"",
        "AppType": "-",
        "SubscriberID":"",
        "AccountName": "-",
        "AccountType": "-",
        "SessionType":"Master",
        "ServiceType":"SCM",
        "IPAddress": "-",
        "ServicePackageIDList":[],
        "ServicePackageNameList":[],
        "PolicyGroupIDList":[],
        "PolicyGroupNameList":[],
        "PolicyList":[],
        "Context":{
            "PortInfo":{
                "Inport":"",
                "Export":""
            },
            "HostList":[],
            "SwithList":[],
            "EffectPolicy":[]
        }
    };
    return instance;
}
function get_master_project(req,res,resource_list,callback){
    if(req.body.MasterId!=""){
        resource_list.MasterProjectID = req.body.MasterId;
    }
}
//生成主instance：master instance
function resource_to_master_instance(req,res,resource_list,callback){
    //如果为slave project就不需要建立master session
    if(req.body.MasterId==""){
        //一个用户对应一个service
        var instance = create_instance(req.body.id,req.body.name,req.body.MasterId);
        instance.SubscriberID = "*";
        instance.AccountName = "PF-Master-Session";
        instance.AccountType = "Virtual";//虚拟
        instance.IPAddress = "-";
        build_instance_policy_content(instance,resource_list);
        //保存instance
        if(instance.ServiceType=="PFM"){
            instance.Context.EffectPolicy = instance.PolicyList;
            resource_list.MasterSession = instance;
            resource_list.SessionInstanceList.push(instance);
        }
    }else{
        resource_list.MasterProjectID = req.body.MasterId;
    }
    callback(null,resource_list);
}
//生成从instance：slave instance
function resource_to_instance(req,res,resource_list,callback){
    //一个用户对应一个service
    for(var SubscriberIndex=0; SubscriberIndex<resource_list.SubscriberList.length; SubscriberIndex++){
        //建立instance
        var Subscriber = resource_list.SubscriberList[SubscriberIndex];
        var SubscriberID = resource_list.SubscriberList[SubscriberIndex]._id;
        var instance = create_instance(req.body.id,req.body.name,req.body.MasterId);
        instance.SubscriberID = SubscriberID;
        instance.AccountName = Subscriber.Account;
        instance.AccountType = "Normal";
        instance.IPAddress = Subscriber.IPAddress;
        instance.SubscriberGroupID = resource_list.SubscriberGroupMap[SubscriberID].id;
        instance.SubscriberGroupName = resource_list.SubscriberGroupMap[SubscriberID].name;
        //判断为PFM的Service
        if(resource_list.MasterSession!=null&&resource_list.MasterSession.ServiceType=="PFM"){
            if(resource_list.MasterProjectID==null){
                //属于master project 衍生出来的session
                instance.SessionType = "Slave";
                if(resource_list.MasterSession.Context.HostList.length==1){
                    instance.Context.HostList.push(resource_list.MasterSession.Context.HostList[0]);//只作用头部
                    instance.Context.SwithList.push(resource_list.MasterSession.Context.SwithList[0]);//只作用头部
                }else if(resource_list.MasterSession.Context.HostList.length>=2){
                    instance.Context.HostList.push(resource_list.MasterSession.Context.HostList[0]);//只作用头部
                    instance.Context.SwithList.push(resource_list.MasterSession.Context.SwithList[0]);//只作用头部
                    var index = resource_list.MasterSession.Context.HostList.length -1;
                    instance.Context.HostList.push(resource_list.MasterSession.Context.HostList[index]);//只作用尾部
                    instance.Context.SwithList.push(resource_list.MasterSession.Context.SwithList[index]);//只作用尾部
                }
                build_slave_instance_policy_content(instance,resource_list);
            }else{
                //属于slave project 生成的session
                instance.SessionType = "Slave";
                instance.Context.HostList = resource_list.MasterSession.Context.HostList;//作用全部
                instance.Context.SwithList = resource_list.MasterSession.Context.SwithList;//作用全部
                build_instance_policy_content(instance,resource_list);
            }
        }else{
            //SCM
            build_instance_policy_content(instance,resource_list);
        }
        //保存instance
        resource_list.SessionInstanceList.push(instance);
    }
    callback(null,resource_list);
}

//生成从instance：slave instance
function resource_to_virtual_instance(req,res,resource_list,callback) {
    //一个用户对应一个service
    for(var SubscriberIndex=0; SubscriberIndex<resource_list.VirtualSubscriberList.length; SubscriberIndex++){
        //建立instance
        var VirtualSubscriber = resource_list.VirtualSubscriberList[SubscriberIndex];
        var VirtualSubscriberID = resource_list.VirtualSubscriberList[SubscriberIndex]._id;
        var instance = create_instance(req.body.id,req.body.name,req.body.MasterId);
        instance.SubscriberID = VirtualSubscriberID;
        instance.HeadHex = VirtualSubscriber.HeadHex;
        instance.AccountName = VirtualSubscriber.Name;
        instance.AccountType = "Virtual";
        instance.SessionType = "Slave";
        instance.SubscriberGroupID = resource_list.SubscriberGroupMap[VirtualSubscriberID].id;
        instance.SubscriberGroupName = resource_list.SubscriberGroupMap[VirtualSubscriberID].name;
        build_instance_policy_content(instance,resource_list);
        instance.Context.EffectPolicy = instance.PolicyList;
        //保存instance
        resource_list.SessionInstanceList.push(instance);
    }
    callback(null,resource_list);
}

function execute_func(funcs,count,req,res,resource_list,callback){
    //console.log("[execute_func]"+count);
    if(count == funcs.length){
        callback(null,resource_list);//处理完成
    }
    else{
        funcs[count](req,req,resource_list,function(err,result){
            if(err!=null){
                callback(err,null);//出错
            }
            else{
                count++;
                execute_func(funcs,count,req,res,result,callback);
            }
        });
    }
}

function build_instance_list(req, res,callback){
    //创建ServiceInstance列表
    var resource_list = {
        "SubscriberGroupList":"",
        "SubscriberGroupMap":"",
        "ServicePackageList":"",
        "ServicePackageMap":"",
        "ServiceTemplateList":"",
        "ServiceTemplateMap":"",
        "PolicyGroupList":"",
        "PolicyGroupMap":"",
        "SubscriberList":"",//普通用户
        "VirtualSubscriberList":"",//虚拟用户
        "PolicyList":"",
        "PolicyGroupListMap":"",
        "PolicyListMap":"",
        "TemplateHeadList":[],//新头
        "MasterProjectID":null,
        "MasterSession":null,
        host_sequence:"",
        resource_topo:[],
        "SessionInstanceList":[]//新session
    };
    var service_instance;
    //指定函数处理链表
    var func_list = [
        get_subscriber_group_list,
        get_service_package_list,
        get_service_template_list,
        get_policy_group_list,
        get_subscriber_list,
        get_virtual_subscriber_list,
        get_policy_list,
        get_resource_topo_list,
        get_host_sequence,
        resource_to_master_instance,
        resource_to_instance,
        resource_to_virtual_instance
    ];
    //执行
    execute_func(func_list,0,req,res,resource_list,callback);
};
//---------------------------------------------------------------------------
function set_session_list(resource_list,req,res,callback){
    if(resource_list.SessionInstanceList.length>0){
        console.log("[info]:resource_list.SessionInstanceList.length:"+resource_list.SessionInstanceList.length);
        console.log("[info]:resource_list.SessionInstanceList:"+JSON.stringify(resource_list.SessionInstanceList[1]));
        set_policy_and_instance(resource_list.SessionInstanceList,0,callback);
    }
    else{
        //没有数据
        callback("[error][active project]no session data",null);
    }
}

//用于虚拟用户组VirtualSubscriber
function save_template_head_list(resource_list,callback){
    if(resource_list.TemplateHeadList.length>0){
        save_template_head(resource_list.TemplateHeadList,0,callback);
    }
    else{
        //没有数据(允许没有：因为并非所有project都会有PFTemplate Policy)
        callback(null,null);
    }
}

function save_template_head(template_head_list,count,callback){
    if(count>=template_head_list.length){
        callback(null,null);
    }else{
        var virtual_subscriber = template_head_list[count];
        var virtual_subscriber_db = system_cfg.getOperationByName("VirtualSubscriber");
        virtual_subscriber_db.save(virtual_subscriber,function(err){
            count++;
            //继续执行
            save_template_head(template_head_list,count,callback);
            /*
            if(err!=null) {
                callback(err,null);
            }
            else{
                count++;
                //继续执行
                save_template_head(template_head_list,count,callback);
            }
            */
        });
    }
}
function active_project(req,res,callback){
    //1.建造instance list
    //2.添加PM的policy 和 instance
    build_instance_list(req,res,function(err,resource_list){
        if(err!=null){
            return callback(err,null);
        }else{
            //先保存
            set_session_list(resource_list,req,res,function(err,result){
                if(err!=null){
                    callback(err,null);
                }else{
                    save_template_head_list(resource_list,callback);
                }
            });
        }
    });
}

function build_http_request(instance){
    var http_data = {
        "5tuple_v4":
        {
            "src_net": instance.IPAddress,
            "src_port": "-",
            "protocol": "-",
            "dst_port": "-",
            "dst_net": "-"
        },
        "head":{

        },
        "PolicyList": instance.Context.EffectPolicy
    };
    http_data = JSON.stringify(http_data);
    var pm_url = system_cfg.getOpenDaylightUrl()+"?PolicyType="+instance.ServiceType;
    var pm_auth = system_cfg.getOpenDaylightAuthorization();
    var http_headers = {
        "Authorization": "Basic "+pm_auth,
        "Content-Type": "application/json",
        "Content-Length": http_data.length,
        "Content-Num": 10
    };
    var http_result = {
        url:pm_url,
        head:http_headers,
        data:http_data
    };
    return http_result;
}

function set_policy_and_instance(service_instance_list,count,callback){
    if(count>=service_instance_list.length){
        callback(null,null);
    }else{
        var instance = service_instance_list[count];
        //1.保存policy到PM
        var http_requests = build_http_request(instance);
        //console.log(http_requests.head);
        //console.log(http_requests.url);
        console.log("[info]http post:["+http_requests.data+"]");
        var session_instance = system_cfg.getOperationByName(session_instance_collection);
        nodegrass.post(http_requests.url,function(data,status,headers){
            //console.log("status:"+status+"\n"+data);
            //console.log("head:"+JSON.stringify(headers));
            //保存PM返回的ID
            if(status!=200){
                callback("http post:"+status,null);
            }else{
                try {
                    var json_content = JSON.parse(data);
                    //保存instance到本地DB
                    instance.PMInstanceID = json_content["_id"];
                    //console.log(instance);
                    session_instance.save(instance,function(err){
                        if(err!=null) {
                            callback(err,null);
                        }
                        else{
                            count++;
                            //继续执行
                            set_policy_and_instance(service_instance_list,count,callback);
                        }
                    });
                } catch (err) {
                    console.log(err.stack);
                    callback(err,null);
                }
            }

        },http_requests.head,http_requests.data,'utf8').on('error', function(err) {
            callback(err,null);
        });
    }
}

function delete_policy_and_instance(service_instance_list,count,callback) {
    var instance = service_instance_list[count];
    var http_data = {
        "_id":instance.PMInstanceID,
        "5tuple_v4":
        {
            "src_net": instance.IPAddress,
            "src_port": "-",
            "protocol": "-",
            "dst_port": "-",
            "dst_net": "-"
        },
        "head":{
            head:instance.HeadHex
        },
        "switch":instance.Context.SwithList
    };
    http_data = JSON.stringify(http_data);
    //console.log(instance);
    console.log(http_data);
    var pm_url = system_cfg.getOpenDaylightUrl()+"?PolicyID="+instance.PMInstanceID+"&PolicyType=PFM";
    var pm_auth = system_cfg.getOpenDaylightAuthorization();
    var http_headers = {
        "Authorization": "Basic "+pm_auth,
        "Content-Type": "application/json",
        "Content-Length": http_data.length,
        "Content-Num": 10
    };
    //1.删除PM的policy
    console.log("[info]http post:["+http_data+"]");
    var session_instance = system_cfg.getOperationByName(session_instance_collection);
    nodegrass.delete(pm_url,function(content,status,headers){
        //console.log(content);
        //删除本地instance
        var array = new Array(instance._id)
        session_instance.remove(array,function(err){
            if(err!=null) {
                callback(err,null);
            }
            else{
                count++;
                if(count<service_instance_list.length){
                    //继续执行
                    delete_policy_and_instance(service_instance_list,count,callback);
                }else{
                    callback(err,null);
                }
            }
        });
    },http_headers,http_data,'utf8').on('error', function(err) {
        callback(err,null);
    });
}

function inactive_project(req,res,callback){
    //1.查询instance list
    //2.删除policy
    //3.删除instance
    var session_instance = system_cfg.getOperationByName(session_instance_collection);
    var model = {
        search:{ProjectID:req.body.id},
        columns:'id ProjectID PMInstanceID IPAddress HeadHex Context SessionType'
    };
    session_instance.get(model,function(err, service_instance_list){
        console.log("getSessionInstance:["+service_instance_list+"]");
        if(err!=null){
            return callback(err,null);//返回
        }else{
            if(service_instance_list.length>0){
                delete_policy_and_instance(service_instance_list,0,function(err,data){
                    var virtual_subscriber_db = system_cfg.getOperationByName("VirtualSubscriber");
                    virtual_subscriber_db.remove_custom({ProjectID:req.body.id},function(err,data){
                        return callback(null,data);
                        //return callback(err,data);
                    });
                });
            }
            else{
                //没有数据
                return callback("[Error][inActive Project]no seesion data",null);
            }
        }
    });
}
function func_handle_result(err,id,f_state,s_state,res) {
    if(err!=null) {
        return res.json({id:id,state:f_state,result:"fail"});
    }
    else{
        return res.json({id:id,state:s_state,result:"success"});
    }
}

exports.do_active_or_inactive = function(req, res){
    var project = system_cfg.getOperationByName("Project");
    if(req.body.state=="InActive"){
        //当前为InActive，代表请求激活
        project.modify(req.body.id,{State:'Creating'},function(err){
            if(err!=null){
                return res.json(
                    {
                        id:req.body.id,
                        state:req.body.state,
                        result:"fail"
                    });
            } else{
                active_project(req,res,function(err,result){
                    if(err!=null){
                        console.log("[error]active project:"+err);
                        project.modify(req.body.id,{State:'InActive'},function(err){
                            func_handle_result(err,req.body.id,'Creating','InActive',res);
                        });
                    }else{
                        //将结果写入数据库
                        project.modify(req.body.id,{State:'Active'},function(err){
                            func_handle_result(err,req.body.id,'Creating','Active',res);
                        });
                    }
                });
            }
        });
    }else if(req.body.state=="Active"){
        //先改变Project状态
        project.modify(req.body.id,{State:'Deleting'},function(err){
            if(err!=null){
                return res.json(
                    {
                        id:req.body.id,
                        state:req.body.state,
                        result:"fail"
                    });
            } else{
                inactive_project(req,res,function(err,result){
                    if(err!=null){
                        project.modify(req.body.id,{State:'Active'},function(err){
                            func_handle_result(err,req.body.id,'Creating','Active',res);
                        });
                    }else{
                        project.modify(req.body.id,{State:'InActive'},function(err){
                            func_handle_result(err,req.body.id,'Creating','InActive',res);
                        });
                    }
                });
            }
        });
    }else{
        res.json({id:req.body.id,state:req.body.state,result:"unkown state"});
    }
};
function query_session_instance(conditon,callback){
    var session_instance = system_cfg.getOperationByName(session_instance_collection);
    var model = {
        search:conditon,
        columns:'id AccountName ProjectID PMInstanceID IPAddress HeadHex Context'
    };
    session_instance.get(model,callback);
}

function update_subscribe_online(online_users,count,callback) {
    if(count>=online_users.length){
        callback(null,null);//执行完成
    }else{
        var subscriber = online_users[count];
        var session_instance = system_cfg.getOperationByName(session_instance_collection);
        var model = {
            search:{AccountName:subscriber.user},
            columns:'*'
        };
        session_instance.get(model,function(err,session_list){
            if(session_list==null){
                callback(err,null);//错误
            }else{
                var del_sesion_list = [];
                var add_seesion_list = [];
                for(var i=0; i<session_list.length; i++){
                    if(session_list.IPAddress!=subscriber.ip){
                        var new_sesion = session_list[i];
                        new_sesion.IPAddress = subscriber.ip;
                        del_sesion_list.push(session_list[i]);
                        add_seesion_list.push(new_sesion);
                    }
                }
                //执行delete-session
                delete_policy_and_instance(del_sesion_list,0,function(err,data){
                    if(err!=null){
                        callback(err,data);
                    }else{
                        set_policy_and_instance(add_seesion_list,0,function(err,data){
                            if(err!=null){
                                callback(err,data);
                            }else{
                                update_subscribe_online(online_users,count++,callback);//继续执行
                            }
                        });
                    }
                });
            }
        });
    }
}
function update_subscribe_online_list(req,res,resource_list,callback) {
    if(resource_list.add.length>0){
        update_subscribe_online(resource_list.add,0,callback);
    }else{
        callback(null,null);
    }
}
function update_subscribe_offline_list(req,res,resource_list,callback) {
    if(resource_list.delete.length>0){
        update_subscribe_offline(resource_list.delete,0,callback);
    }else{
        callback(null,null);
    }
}
function update_subscribe_offline(offline_users,count,callback) {
    if(count>=offline_users.length){
        callback(null,null);//执行完成
    }else{
        var session_instance = system_cfg.getOperationByName(session_instance_collection);
        var model = {
            search:{AccountName:offline_users[count].user},
            columns:'*'
        };
        session_instance.get(model,function(err,session_list){
            //执行delete-session
            delete_policy_and_instance(session_list,0,function(err,data){
                if(err!=null){
                    callback(err,data);
                }else{
                    update_subscribe_offline(offline_users,count++,callback);//继续执行
                }
            });
        });
    }
}
//更新用户状态
exports.rpc_update_subscriber_status= function(req, res){
    /*
    var subscriber_status = {
        add:[
            {user:"",ip:""},
            {user:"",ip:""}
        ],
        delete:[
            {user:"",ip:""},
            {user:"",ip:""},
            {user:"",ip:""}
        ]
    }
    */
    var resource_list = req.body;
    //指定函数处理链表
    var func_list = [
        update_subscribe_online_list,
        update_subscribe_offline_list,
    ];
    //执行
    execute_func(func_list,0,req,res,resource_list,callback);
}