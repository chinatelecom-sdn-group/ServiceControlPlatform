/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements collect flow policy from opendaylight
 * <p/>
 *
 * @author peng li(chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

/**
 * Created by Administrator on 2014/7/7.
 */
var framework = require('../_main_/framework');
var menu = require('./policy_detail_mgr');
var Content = {
    "zh-cn": {
        title: "详细策略流",
        table_head: ["流系统编号", "策略编号", "交换机信息", "交换机流表编号", "封装类型", "封装参数"],
        table_items: ["id", "PolicyID", "srv_dev", "fl_tbl_id", "encap_type", "encap_val"],
        dlg_add_title: "添加详细策略流",
        dlg_modify_title: "修改详细策略流",
        dlg_delete_title: "删除详细策略流",
        dlg_select_title: "选择详细策略流",
        FlowPolicy_id: "流系统编号",
        FlowPolicy_PolicyID: "策略编号",
        FlowPolicy_Content: "流信息",
        FlowPolicy_srv_dev: "交换机信息",
        FlowPolicy_fl_tbl_id: "交换机流表编号",
        FlowPolicy_encap_type: "封装类型",
        FlowPolicy_encap_val: "封装参数",
        page_url: 'flow_policy'
    },
    "en": {
        title: "FlowPolicy",
        table_head: ["FlowID", "PolicyID", "SwitchInfo", "Switch_Flow_table_id", "Encap_Type", "Encap_Value"],
        table_items: ["id", "PolicyID", "srv_dev", "fl_tbl_id", "encap_type", "encap_val"],
        dlg_add_title: "Add FlowPolicy",
        dlg_modify_title: "Modify FlowPolicy",
        dlg_delete_title: "Delete FlowPolicy",
        dlg_select_title: "Select FlowPolicy",
        FlowPolicy_id: "FlowID",
        FlowPolicy_PolicyID: "PolicyID",
        FlowPolicy_Content: "FlowPolicyContent",
        FlowPolicy_srv_dev: "SwitchInfo",
        FlowPolicy_fl_tbl_id: "Switch_Flow_table_id",
        FlowPolicy_encap_type: "Encap_Type",
        FlowPolicy_encap_val: "Encap_Value",
        page_url: 'flow_policy'
    }
};
var _framework = new framework();
var module = {
    "name": "FlowPolicy",
    "ejs": "flow_policy_mgr/flow_policy_config",
    "ejs4content": "flow_policy_mgr/flow_policy_select",
    "check_box": "check_box_flow_policy",
    "head_active": "/policy_detail",
    "left_active": "/flow_policy",//指示活动标签
    "menu": menu,
    "content": Content,
    "collection":"FlowPolicy"//指定表名，与system_cfg.js对应
};

exports.get = function (req, res) {
    _framework.get(req, res, module);
};

exports.get_content = function (req, res) {
    _framework.get_content(req, res, module);
};

exports.module = module;

exports.content = Content;
