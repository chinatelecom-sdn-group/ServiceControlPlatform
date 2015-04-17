/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements  policy group config view
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
var menu = require('./policy_mgr');
var Content = {
    "zh-cn" : {
        title:"策略组",
        table_head : ["策略组名称","子策略个数","子策略列表","策略组编号"],
        table_items : ["Name","PolicyListNum","PolicyList","id"],
        dlg_add_title:"添加策略组",
        dlg_modify_title:"修改策略组",
        dlg_delete_title:"删除策略组",
        dlg_select_policy_title:"选择策略",
        dlg_delete_url:"policy_group_config/delete",
        policy_group_name :"策略组名",
        policy_list:"策略列表",
        page_url:"policy_group_config",
        id:"策略组编号",
        Name:"策略组名称",
        PolicyList:"策略列表"
    },
    "en" : {
        title:"Policy Group",
        table_head : ["PolicyGroupName","PolicyNum","PolicyList","PolicyGroupID"],
        table_items : ["Name","PolicyListNum","PolicyList","id"],
        dlg_add_title:"Add Policy Group",
        dlg_modify_title:"Modify Policy Group",
        dlg_delete_title:"Delete Policy Group",
        dlg_select_policy_title:"Select Policy",
        dlg_delete_url:"policy_group_config/delete",
        policy_group_name :"PolicyGroupName",
        policy_list:"PolicyList",
        page_url:"policy_group_config",
        id:"Policy Group ID",
        Name:"Policy Group Name",
        PolicyList:"Policy Name"
    }
};
var _framework = new framework();
var module = {
    "name": "PolicyGroup",
    "ejs": "policy_mgr/policy_group_config",
    "ejs4content": "_main_/table_select",
    "check_box":"check_box_policy_group",
    "head_active":"/policy_config",
    "left_active":"/policy_group_config",//指示活动标签
    "menu":menu,
    "content":Content,
    "collection":"PolicyGroup",//指定表名，与system_cfg.js对应
    "widget":{
        "Name": {type:"text",help:"format: ServiceType-AccessType-function-name"},
        "PolicyList": {type:"multiple_select",help:""}
    }
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