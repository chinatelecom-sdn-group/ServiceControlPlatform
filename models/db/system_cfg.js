/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements system config reading and init system params
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var model_flow_policy = require('../system_models/flow_policy');
var model_policy_detail = require('../system_models/policy_detail');
var model_policy_entry = require('../system_models/policy_entry');
var model_policy_group = require('../system_models/policy_group');
var model_project = require('../system_models/project');
var model_session_instance = require('../system_models/session_instance');
var model_service_package = require('../system_models/service_package');
var model_service_template = require('../system_models/service_template');
var model_subscriber = require('../system_models/subscriber');
var model_subscriber_group = require('../system_models/subscriber_group');
var model_user = require('../system_models/user');
var model_virtual_subscriber = require('../system_models/virtual_subscriber');
var model_resource_topo = require('../system_models/resource_topo');
var dbOperation = require('./db_operation');
var mongoose = require('mongoose');
var fs = require('fs');
var system_cfg = require('../../bin/config').system_cfg;//data base config
//default config
var opendaylight_cfg={
    "Url":"",
    "IP":"",
    "Port":"",
    "User":"",
    "Password":"",
    "Authorization":""
};
//connection list
var db_connection_list = {
    "ScpDB":null,
    "SCPDBURL":"",
    "PolicyManagementDB":null,
    "PolicyManagementDBURL":""
};
//database operation list
var db_operation_list = {
    "FlowPolicy":null,
    "PolicyDetail":null,
    "PolicyEntry":null,
    "PolicyGroup":null,
    "Project":null,
    "SessionInstance":null,
    "ServicePackage":null,
    "ServiceTemplate":null,
    "Subscriber":null,
    "SubscriberGroup":null,
    "Users":null,
    "VirtualSubscriber":null
};

/*
 *@description convert url
 *@param syscfg - reference config.js
 *@param dbname - database name {ServiceControlPlatform} or {PolicyManagement}
 */
function toMongoDBUrl(syscfg,dbname){
    var db_url = "mongodb://";
    db_url += syscfg["mongodb"][dbname].User + ":" + syscfg["mongodb"][dbname].Password+"@";
    db_url += syscfg["mongodb"].IP +":" + syscfg["mongodb"].Port;
    db_url += "/"+dbname;
    return db_url;
}

/*
 *@description read config function
 *@ param resource_list - input param and output param , as handle result
 * @param callback - callback function param1:data,param2:error
 */
function read_cfg_func(resource_list,callback){
    resource_list.system_cfg = system_cfg;
    callback(null,null);
}

/*
 *@description init system param
 *@ param resource_list - input param and output param , as handle result
 * @param callback - callback function param1:data,param2:error
 */
function init_system_func(resource_list,callback){
    var syscfg = resource_list.system_cfg;
    //初始化Opendaylight链接
    opendaylight_cfg.IP = syscfg["opendaylight"].IP;
    opendaylight_cfg.Port = syscfg["opendaylight"].Port;
    opendaylight_cfg.User = syscfg["opendaylight"].User;
    opendaylight_cfg.Password = syscfg["opendaylight"].Password;
    var user_password = opendaylight_cfg.User + ":" + opendaylight_cfg.Password;
    opendaylight_cfg.Authorization = new Buffer(user_password).toString('base64');//Opendaylight密码;
    opendaylight_cfg.Url = "http://"+opendaylight_cfg.IP+":"+opendaylight_cfg.Port+"/controller/nb/v2/policies";
    //初始化数据库链接
    db_connection_list["ScpDBURL"] = toMongoDBUrl(syscfg,"ServiceControlPlatform");
    db_connection_list["PolicyManagementDBURL"] = toMongoDBUrl(syscfg,"PolicyManagement");
    db_connection_list["ScpDB"] = mongoose.createConnection(db_connection_list["ScpDBURL"]);
    db_connection_list["PolicyManagementDB"] = mongoose.createConnection(db_connection_list["PolicyManagementDBURL"]);
    callback(null,null);
}

/*
 *@description build mongodb operation
 *@ param resource_list - input param and output param , as handle result
 * @param callback - callback function param1:data,param2:error
 */
function build_operation(resource_list,callback){
    db_operation_list["FlowPolicy"] = new dbOperation("FlowPolicy",model_flow_policy,db_connection_list["PolicyManagementDB"]);
    db_operation_list["PolicyDetail"] = new dbOperation("PolicyDetail",model_policy_detail,db_connection_list["PolicyManagementDB"]);
    db_operation_list["PolicyEntry"] = new dbOperation("PolicyEntry",model_policy_entry,db_connection_list["ScpDB"]);
    db_operation_list["PolicyGroup"] = new dbOperation("PolicyGroup",model_policy_group,db_connection_list["ScpDB"]);
    db_operation_list["Project"] = new dbOperation("Project",model_project,db_connection_list["ScpDB"]);
    db_operation_list["SessionInstance"] = new dbOperation("SessionInstance",model_session_instance,db_connection_list["ScpDB"]);
    db_operation_list["ServicePackage"] = new dbOperation("ServicePackage",model_service_package,db_connection_list["ScpDB"]);
    db_operation_list["ServiceTemplate"] = new dbOperation("ServiceTemplate",model_service_template,db_connection_list["ScpDB"]);
    db_operation_list["Subscriber"] = new dbOperation("Subscriber",model_subscriber,db_connection_list["ScpDB"]);
    db_operation_list["SubscriberGroup"] = new dbOperation("SubscriberGroup",model_subscriber_group,db_connection_list["ScpDB"]);
    db_operation_list["Users"] = new dbOperation("Users",model_user,db_connection_list["ScpDB"]);
    db_operation_list["VirtualSubscriber"] = new dbOperation("VirtualSubscriber",model_virtual_subscriber,db_connection_list["ScpDB"]);
    db_operation_list["Resource_Topo"] = new dbOperation("Resource_Topo",model_resource_topo,db_connection_list["ScpDB"]);
    callback(null,null);
}

/*
 *@description Execute by ordor
 * @param funcs - function list
 * @param count - execute function number
 * @param resource_list - input param and output param , as handle result
 * @param callback - callback function param1:data,param2:error
 */
function execute_func(funcs,count,resource_list,callback){
    if(count == funcs.length){
        callback(null,null);//处理完成
    }
    else{
        funcs[count](resource_list,function(err,redir){
            if(err!=null){
                callback(err,null);//出错
            }
            else if(redir!=null){
                //有重定向
                callback(err,redir);
            }
            else{
                count++;
                execute_func(funcs,count,resource_list,callback);
            }
        });
    }
}

/*
 *@description system init function
 * @param callback - callback function param1:data,param2:error
 */
function init(callback){
    //创建ServiceInstance列表
    var resource_list = {
        "system_cfg":""
    };
    var service_instance;
    //指定函数处理链表
    var func_list = [
        read_cfg_func,
        init_system_func,
        build_operation
    ];
    //执行
    execute_func(func_list,0,resource_list,callback);
};

/*
 *@export function list
 */
exports.init_system = init;

/*
 *@description get db operation by name
 * @param name - db operation name
 */
exports.getOperationByName = function (name) {
    return db_operation_list[name];
}

/*
 *@description get db operation by name, if null,build a operation
 * @param name - db operation name
 * @param {object} req - http request
 * @param {object} res - http response
 * @param callback - callback function param1:data,param2:error
 */
exports.getOperationByNameEx = function (req,res,name,callback) {
    if(db_operation_list[name]==null){
        init(function(err,redir){
            callback(err,redir,db_operation_list[name]);
        });
    }else{
        callback(null,null,db_operation_list[name]);
    }
}

/*
 *@description get Opendaylight url
 */
exports.getOpenDaylightUrl = function () {
    return opendaylight_cfg.Url;
}

/*
 *@description get Opendaylight Authorization (md5)
 */
exports.getOpenDaylightAuthorization = function () {
    return opendaylight_cfg.Authorization;
}

/*
 *@description get scp db url
 */
exports.get_scp_db_url = function(){
    return toMongoDBUrl(system_cfg,"ServiceControlPlatform");
}

/*
 *@description get policy management db url
 */
exports.get_pm_db_url = function(){
    return toMongoDBUrl(system_cfg,"PolicyManagement");
}