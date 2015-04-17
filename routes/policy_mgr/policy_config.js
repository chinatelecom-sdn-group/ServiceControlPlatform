/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements policy entry config view
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
var monitor_entry = require('../../models/system_models/monitor_entry');
var Content = {
    "zh-cn" : {
        title:"策略",
        table_head : ["策略名称","模板名称","优先级","内容","策略编号"],
        table_items : ["Name","Type","Priority","Content","id"],
        dlg_add_title:"添加策略",
        dlg_modify_title:"修改策略",
        dlg_delete_title:"删除策略",
        dlg_select_title:"选择策略模板",
        dlg_delete_url:"policy_config/delete",
        PolicyID :"策略编号",
        PolicyName :"策略名称",
        PolicyType:"策略类型",
        Priority:"优先级",
        algorithm:"算法",
        service_chain:"服务链",
        pf_logical_chain:"PF逻辑路径",
        pf_physics_chain:"PF物理路径",
        pf_template:"PF 模板",
        pf_template_offset:"PF模板位置",
        pf_head:"PF 头",
        src_ip:"源IP",
        src_port:"源端口",
        protocol:"协议",
        dst_ip:"目的IP",
        dst_port:"目的端口",
        dns_original_dst_ip:"原DNS目的IP",
        dns_modify_dst_ip:"新DNS目的IP",
        action:"操作",
        page_url:"policy_config",
        "service_list":[
            "DPI",
            "FW",
            "Video Transcoding",
            "Video Cache",
            "Http Header Enrichment",
            "Load Balancer",
            "CGN NAT44",
            "CGN NAT64",
            "Application Acceleration",
            "Metadata Embedded Overlay"
        ],
        "action_list":[
            "Drop",
            "Loopback"
        ]
    },
    "en" : {
        title:"Policy",
        table_head : ["PolicyName","TemplateName","Priority","Content","PolicyID"],
        table_items : ["Name","Type","Priority","Content","id"],
        dlg_add_title:"Add Policy",
        dlg_modify_title:"Modify Policy",
        dlg_delete_title:"Delete Policy",
        dlg_delete_url:"policy_config/delete",
        PolicyID :"Policy ID",
        PolicyName :"PolicyName",
        PolicyType:"PolicyType",
        Priority:"Priority",
        algorithm:"Algorithm",
        service_chain:"Service Chain",
        pf_logical_chain:"PF Logical Chain",
        pf_physics_chain:"PF Physics Chain",
        pf_template:"PF Template",
        pf_template_offset:"PF Template Offset",
        pf_head:"PF Head",
        src_ip:"Source IP",
        src_port:"Source Port",
        protocol:"Protocol",
        dst_ip:"Destination IP",
        dst_port:"Destination Port",
        dns_original_dst_ip:"current DNS Destination IP",
        dns_modify_dst_ip:"new DNS Destination IP",
        action:"Action",
        page_url:"policy_config",
        "service_list":[
            "DPI",
            "FW",
            "Video Transcoding",
            "Video Cache",
            "Http Header Enrichment",
            "Load Balancer",
            "CGN NAT44",
            "CGN NAT64",
            "Application Acceleration",
            "Metadata Embedded Overlay"
        ],
        "action_list":[
            "Drop",
            "Loopback"
        ]
    }
};
var _framework = new framework();
var module = {
    "name": "Policy",
    "ejs": "policy_mgr/policy_config",
    "ejs4content": "_main_/table_select",
    "check_box":"check_box_policy",
    "head_active":"/policy_config",
    "left_active":"/policy_config",//指示活动标签
    "menu":menu,
    "content":Content,
    data:{
        topo:"[]"
    },
    "collection":"PolicyEntry"//指定表名，与system_cfg.js对应
};

exports.get = function(req, res){
    monitor_entry.get_globol_topo("",function(err,results)
    {
        if(results!=null){
            //console.log(results.host);
            module.data.topo = JSON.stringify(results.host);
        }
        console.log(module);
        _framework.get(req,res,module);
    });
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