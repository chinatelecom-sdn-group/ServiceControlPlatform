/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements the subscriber config view
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
        title:"用户",
        table_head : ["账号","IP地址","访问类型","访问带宽","服务提供商","用户编号"],
        table_items : ["Account","IPAddress","AccessType","AccessBandwidth","ServiceProvider","id"],
        dlg_add_title:"添加用户",
        dlg_modify_title:"修改用户",
        dlg_delete_title:"删除用户",
        _id:"id",
        page_url:"subscriber_config",
        id:"用户编号",
        Account :"账户",
        IPAddress:"IP地址",
        AccessType:"访问类型",
        AccessBandwidth:"访问带宽",
        SessionType:"会话类型",
        AssignedAddressType:"分配地址类型",
        IPAddressType:"IP地址类型",
        ServiceType:"业务类型",
        ServiceBundleName:"业务套餐",
        ServiceProvider:"服务提供商",
        Location:"地区"
    },
    "en" : {
        title:"Subscriber",
        table_head : ["Account","IP Address","Access Type","Access Bandwidth","Service Provider","SubscriberID"],
        table_items : ["Account","IPAddress","AccessType","AccessBandwidth","ServiceProvider","id"],
        dlg_add_title:"Add Subscriber",
        dlg_modify_title:"Modify Subscriber",
        dlg_delete_title:"Delete Subscriber",
        _id:"id",
        page_url:"subscriber_config",
        id:"Subscriber ID",
        Account :"Account",
        IPAddress:"IPAddress",
        AccessType:"Access Type",
        AccessBandwidth:"Access Bandwidth",
        SessionType:"Session Type",
        AssignedAddressType:"Assigned Address Type",
        IPAddressType:"IP Address Type",
        ServiceType:"Service Type",
        ServiceBundleName:"Service Bundle Name",
        ServiceProvider:"Service Provider",
        Location:"Location"
    }
};
var _framework = new framework();
var module = {
    "name": "Subscriber",
    "ejs": "subscriber_mgr/subscriber_config",
    "ejs4content": "_main_/table_select",
    "check_box":"check_box_subscriber",
    "head_active":"/subscriber_config",
    "left_active":"/subscriber_config",//指示活动标签
    "menu":menu,
    "content":Content,
    "collection":"Subscriber",//指定表名，与system_cfg.js对应
    "widget":{
        "Account": {type:"text",help:""},
        "IPAddress": {type:"text",help:""},
        "AccessType": {type:"select",value:["DSL","Eth","FTTH","3G","4G"],help:""},
        "AccessBandwidth": {type:"select",value:["4M","8M","12M","20M","100M"],help:""},
        "SessionType": {type:"select",value:["PPPoE","IPoE"],help:""},
        "AssignedAddressType": {type:"select",value:["DHCP","Fixed","NAT"],help:""},
        "IPAddressType": {type:"select",value:["IPv6","IPv4"],help:""},
        "ServiceType": {type:"select",value:["IPTV","Internet","VPN","value-added"],help:""},
        "ServiceBundleName": {type:"select",value:["189 standard","189 plus"],help:""},
        "ServiceProvider": {type:"select",value:["gd.189.cn","ct.189.cn"],help:""},
        "Location": {type:"select",value:["Canton","Beijing","Shanghai"],help:""}
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