/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements the subscriber group
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

/**
 * Created by Administrator on 2014/7/7.
 */
var framework = require('../_main_/framework');
var menu = require('./subscriber_mgr');
var Content = {
    "zh-cn" : {
        title:"用户组",
        table_head : ["用户组名","组类型","业务类型","用户数量","用户组编号"],
        table_items : ["Name","Type","ServiceType","SubscriberListNum","id"],
        dlg_add_title:"添加用户组",
        dlg_modify_title:"修改用户组",
        dlg_delete_title:"删除用户组",
        dlg_select_subscriber_title:"选择用户",
        dlg_select_virtual_subscriber_title:"选择虚拟用户",
        subscriber_group_id :"用户组编号",
        subscriber_group_name :"用户组名称",
        subscriber_selected:"已选用户",
        page_url:"subscriber_group_config",
        id:"用户组编号",
        Name: "用户组名称",
        Type:"组类型",
        ServiceType: "业务类型",
        ServiceProvider: "服务提供商",
        Company: "公司",
        Location: "位置",
        SubscriberList: "用户列表",
        VirtualSubscriberList: "PF头列表"
    },
    "en" : {
        title:"Subscriber Group",
        table_head : ["Subscriber GroupName","Type","Service Type","Subscriber Number","Subscriber GroupID"],
        table_items : ["Name","Type","ServiceType","SubscriberListNum","id"],
        dlg_add_title:"Add Subscriber Group",
        dlg_modify_title:"Modify Subscriber Group",
        dlg_delete_title:"Delete Subscriber Group",
        dlg_select_subscriber_title:"Select Subscriber",
        dlg_select_virtual_subscriber_title:"Select Vritual Subscriber",
        subscriber_group_id :"Group ID",
        subscriber_group_name :"Group Name",
        subscriber_selected:"Configured Subscriber",
        page_url:"subscriber_group_config",
        id:"Subscriber Group ID",
        Name: "Subscriber Group Name",
        Type:"Group Type",
        ServiceType: "Service Type",
        ServiceProvider: "Service Provider",
        Company: "Company",
        Location: "Location",
        SubscriberList: "Subscriber List",
        VirtualSubscriberList: "PF Head List"
    }
};
var _framework = new framework();
var module = {
    "name": "Subscriber Group",
    "ejs": "subscriber_mgr/subscriber_group_config",
    "ejs4content": "_main_/table_select",
    "check_box":"check_box_subscriber_group",
    "head_active":"/subscriber_config",
    "left_active":"/subscriber_group_config",//指示活动标签
    "menu":menu,
    "content":Content,
    "collection":"SubscriberGroup"//指定表名，与system_cfg.js对应
};

exports.get = function(req, res){
    _framework.get(req,res,module);
};

exports.get_content = function(req, res){
    _framework.get_content(req,res,module);
};

exports.do_add = function(req, res){
    _framework.do_add(req,res,module);
};

exports.do_modify = function(req, res){
    _framework.do_modify(req,res,module);
};

exports.do_delete = function(req, res){
   _framework.do_delete(req,res,module);
};

exports.module = module;