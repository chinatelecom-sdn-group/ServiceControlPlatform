/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements user management
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
var menu = require('./system_config');
var Content = {
    "zh-cn" : {
        title:"用户管理",
        table_head : ["系统用户编号","用户名","密码"],
        table_items : ["id","name","password"],
        dlg_add_title:"添加用户",
        dlg_modify_title:"修改用户",
        dlg_delete_title:"删除用户",
        userid :"用户编号",
        username :"用户名",
        password:"密码",
        page_url:"user_config"
    },
    "en" : {
        title:"User Management",
        table_head : ["SystemUserID","User Name","Password"],
        table_items : ["id","name","password"],
        dlg_add_title:"Add User",
        dlg_modify_title:"Modify User",
        dlg_delete_title:"Delete User",
        userid :"user id",
        username :"username",
        password:"password",
        page_url:"user_config"
    }
};
var _framework = new framework();
var module = {
    "name": "User Management",
    "ejs": "system_config/user_config",
    "head_active":"/system_config",
    "left_active":"/user_config",//指示活动标签
    "menu":menu,
    "content":Content,
    "collection":"Users",//指定表名，与system_cfg.js对应
    "condition":{name:{$ne:"admin"}}
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