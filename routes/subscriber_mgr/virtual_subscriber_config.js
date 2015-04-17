/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements the virtual subscriber config view
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
        title:"虚拟用户",
        table_head : ["名称","PF Head","PF Head MD5"],
        table_items : ["Name","Head","HeadMd5"]
    },
    "en" : {
        title:"Virtual Subscriber",
        table_head : ["Name","PF Head","PF Head MD5"],
        table_items : ["Name","Head","HeadMd5"]
    }
};
var _framework = new framework();
var module = {
    "name": "VirtualSubscriber",
    "ejs4content": "_main_/table_select",
    "check_box":"check_box_subscriber",
    "menu":menu,
    "content":Content,
    "collection":"VirtualSubscriber"//指定表名，与system_cfg.js对应
};

exports.get_content = function(req, res){
    console.log("VirtualSubscriber content");
    _framework.get_content(req,res,module);
};

exports.module = module;