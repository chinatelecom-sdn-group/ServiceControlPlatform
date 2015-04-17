/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements flow policy detail from opendaylight
 * <p/>
 *
 * @author Peng li (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

/**
 * Created by Administrator on 2014/7/7.
 */
var framework = require('../_main_/framework');
var menu = require('../project_mgr/project_mgr');
var flow_policy = require("./flow_policy");
var Content = {
    "zh-cn": {
        title: "策略数据",
        table_head: ["系统策略编号", "五元组", "服务链"],
        table_items: ["id", "5tuple_v4", "PolicyList"],
        dlg_add_title: "添加策略数据",
        dlg_modify_title: "修改策略数据",
        dlg_delete_title: "删除策略数据",
        dlg_select_title: "选择策略数据",
        PolicyManagement_id: "系统策略编号",
        PolicyManagement_5tuple_v4: "五元组",
        PolicyManagement_Services: "服务链",
        page_url: "policy_detail"
    },
    "en": {
        title: "Policy Detail",
        table_head: ["PolicyID", "5tuple_v4", "PolicyList"],
        table_items: ["id", "5tuple_v4", "PolicyList"],
        dlg_add_title: "Add PolicyManagement",
        dlg_modify_title: "Modify PolicyManagement",
        dlg_delete_title: "Delete PolicyManagement",
        dlg_select_title: "Select PolicyManagement",
        PolicyManagement_id: "PolicyID",
        PolicyManagement_5tuple_v4: "5tuple_v4",
        PolicyManagement_Services: "Services",
        page_url: "policy_detail"
    }
};
var _framework = new framework();
var module = {
    "name": "PolicyDetail",
    "ejs": "policy_detail_mgr/policy_detail_config",
    "ejs4content": "_main_/table_select",
    "check_box": "check_box_policy_detail",
    "head_active": "/project_config",
    "left_active": "/policy_detail",//指示活动标签
    "menu": menu,
    "content": Content,
    "flow_content":flow_policy.content,
    "collection":"PolicyDetail"//指定表名，与system_cfg.js对应
};
exports.get = function (req, res) {
    _framework.get(req, res, module);
};

exports.get_content = function (req, res) {
    _framework.get_content(req, res, module);
};
