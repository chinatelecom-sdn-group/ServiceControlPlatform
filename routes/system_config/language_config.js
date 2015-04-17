/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements the config language view
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
        title:"语言设置",
        session_language : "zh-cn",
        label_language : "语言",
        btn_save : "保存"
    },
    "en" : {
        title:"Language Setting",
        session_language : "en",
        label_language : "language",
        btn_save : "save"
    }
};
exports.get = function(req, res){
    var _UIData = _framework.getUIData(req,menu,Content);
    res.render('system_config/language_config', {
        title: 'Language Setting',
        nav_head: _UIData.Nav_head,
        nav_left:_UIData.Nav_left,
        nav_foot:_UIData.Nav_foot,
        content:_UIData.Content,
        head_active:"/system_config",
        left_active:"/language_config"//指示活动标签
    });
};

exports.do_modify = function(req, res){
    req.session.language=req.body.language;
    res.redirect('/language_config');
};