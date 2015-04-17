/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements the config password view
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var menu = require('./system_config');
var framework = require('../_main_/framework');
var _framework = new framework();
var Content = {
    "zh-cn" : {
        title:"密码设置",
        current_pw : "当前密码",
        new_pw : "新密码",
        repeat_pw:"确认新密码",
        btn_save : "保存"
    },
    "en" : {
        title:"Password Setting",
        current_pw : "Current Password",
        new_pw : "New Password",
        repeat_pw:"Confirn Password",
        btn_save : "save"
    }
};
exports.get = function(req, res){
    var _UIData = _framework.getUIData(req,menu,Content);
    res.render('system_config/password_config', {
        title: 'Password Setting',
        nav_head: _UIData.Nav_head,
        nav_left:_UIData.Nav_left,
        nav_foot:_UIData.Nav_foot,
        content:_UIData.Content,
        head_active:"/system_config",
        left_active:"/password_config"//指示活动标签
    });
};

exports.do_modify = function(req, res){
    User.modify(req.body.id_modify_dlg_UserID,req.body.id_modify_dlg_UserName,req.body.id_modify_dlg_Password,function(err){
        if(err!=null) {
            req.session.error = _framework.getError(req,"modify user fail");
            return res.redirect('/password_config');
        }
        res.redirect('/password_config');
    });
};