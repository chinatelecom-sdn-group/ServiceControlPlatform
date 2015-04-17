/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements manage the project session instance
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
var menu = require('./project_mgr');
var Content = {
    "zh-cn" : {
        title:"会话监控",
        table_head : ["项目名称","用户","用户类型","用户组","应用类型","业务套餐","会话编号"],
        table_items : ["ProjectName","AccountName","AccountType","SubscriberGroupName","AppType","ServicePackageNameList","id"],
        dlg_add_title:"添加用户",
        dlg_modify_title:"修改用户",
        dlg_delete_title:"删除用户",
        account_name :"账户",
        ip_address:"IP地址",
        page_url:"session_instance"
    },
    "en" : {
        title:"Session Instance",
        table_head : ["Project Name","Account Name","Account Type","Subscriber Group","AppType","Service Package","Instance ID"],
        table_items : ["ProjectName","AccountName","AccountType","SubscriberGroupName","AppType","ServicePackageNameList","id"],
        dlg_add_title:"Add Subscriber",
        dlg_modify_title:"Modify Subscriber",
        dlg_delete_title:"Delete Subscriber",
        account_name :"AccountName",
        ip_address:"IPAddress",
        page_url:"session_instance"
    }
};
var _framework = new framework();
var module = {
    "name": "SessionInstance",
    "ejs": "project_mgr/session_instance",
    "ejs4content": "_main_/table_select",
    "check_box":"check_box_project",
    "head_active":"/project_config",
    "left_active":"/session_instance",//指示活动标签
    "menu":menu,
    "content":Content,
    "collection":"SessionInstance"//指定表名，与system_cfg.js对应
};
exports.get = function(req, res){
    _framework.get(req,res,module);
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