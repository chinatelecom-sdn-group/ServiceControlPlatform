/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements service template view
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var framework = require('../_main_/framework');
var menu = require('./service_mgr');
var Content = {
    "zh-cn" : {
        title:"业务模板",
        table_head : ["名称","类型","策略组","业务模板编号"],
        table_items : ["Name","Type","PolicyGroupList","id"],
        dlg_add_title:"添加业务模板",
        dlg_modify_title:"修改业务模板",
        dlg_delete_title:"删除业务模板",
        dlg_select_title:"选择策略组",
        dlg_delete_url:"service_template/delete",
        service_template_name :"业务模板名称",
        service_template_type:"业务模板类型",
        policy_group_list:"策略组列表",
        page_url:"service_template",
        id:"业务模板编号",
        Name:"业务模板名称",
        Type:"业务模板类型",
        Description:"描述",
        PolicyGroupList:"策略组列表"

    },
    "en" : {
        title:"Service Template",
        table_head : ["ServiceTemplateName","ServiceTemplateType","PolicyGroupIDs","ServiceTemplateID"],
        table_items : ["Name","Type","PolicyGroupList","id"],
        dlg_add_title:"Add Service Template",
        dlg_modify_title:"Modify Service Template",
        dlg_delete_title:"Delete Service Template",
        dlg_select_title:"Select Policy Group",
        dlg_delete_url:"service_template/delete",
        service_template_name :"Service Template Name",
        service_template_type:"Service Template Type",
        policy_group_list:"Policy Group List",
        page_url:"service_template",
        id:"Service Template ID",
        Name:"Service Template Name",
        Type:"Service Template Type",
        Description:"Description",
        PolicyGroupList:"Policy Group List"
    }
};

var _framework = new framework();
var module = {
    "name": "ServiceTemplate",
    "ejs": "service_mgr/service_template",
    "ejs4content": "_main_/table_select",
    "check_box":"check_box_service_template",
    "head_active":"/service_package",
    "left_active":"/service_template",//指示活动标签
    "menu":menu,
    "content":Content,
    "collection":"ServiceTemplate",//指定表名，与system_cfg.js对应
    "widget":{
        "Name": {type:"text",help:"format: ServiceType-AccessBandwidth-operation-(name)"},
        "Type": {type:"select",value:["basic forward","value-added","VPN"],help:""},
        "Description": {type:"text",help:""},
        "PolicyGroupList": {type:"multiple_select",help:""}
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