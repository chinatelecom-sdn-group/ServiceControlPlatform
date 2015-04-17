/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements service package view
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
        title:"业务套餐",
        table_head : ["业务套餐名","业务模板ID","业务套餐编号"],
        table_items : ["Name","ServiceTemplateList","id"],
        dlg_add_title:"添加业务套餐",
        dlg_modify_title:"修改业务套餐",
        dlg_select_title:"选择业务模板",
        dlg_delete_title:"删除业务套餐",
        dlg_delete_url:"service_package/delete",
        service_package_id :"业务套餐编号",
        service_package_name :"业务套餐名字",
        service_template_list:"业务模板ID链",
        page_url:"service_package",
        id:"业务套餐编号",
        Name:"业务套餐名字",
        PackageType:"套餐类型",
        TimeDuration:"有效时间",
        Description:"描述",
        ServiceTemplateList:"业务模板列表"
    },
    "en" : {
        title:"Service Package",
        table_head : ["Service Package Name","Service Template IDs","Service Package ID"],
        table_items : ["Name","ServiceTemplateList","id"],
        dlg_add_title:"Add ServicePackage",
        dlg_modify_title:"Modify ServicePackage",
        dlg_select_title:"Select ServiceTemplate",
        dlg_delete_title:"Delete ServicePackage",
        dlg_delete_url:"service_package/delete",
        service_package_id :"Service Package ID",
        service_package_name :"Service Package Name",
        service_template_list:"Service Template List",
        page_url:"service_package",
        id:"Service Package ID",
        Name:"Service Package Name",
        PackageType:"Package Type",
        TimeDuration:"Time Duration",
        Description:"Description",
        ServiceTemplateList:"Service Template List"
    }
};

var _framework = new framework();
var module = {
    "name": "ServicePackage",
    "ejs": "service_mgr/service_package",
    "ejs4content": "_main_/table_select",
    "check_box":"check_box_service_package",
    "head_active":"/service_package",
    "left_active":"/service_package",//指示活动标签
    "menu":menu,
    "content":Content,
    "collection":"ServicePackage",//指定表名，与system_cfg.js对应
    "widget":{
        "Name": {type:"text",help:"format: ServiceType-AccessType-location-(name)"},
        "PackageType": {type:"select",value:["BB basic","Wifi-basic","3G/4G","value-added"],help:""},
        "TimeDuration": {type:"text",help:""},
        "Description": {type:"text",help:""},
        "ServiceTemplateList": {type:"multiple_select",help:""}
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