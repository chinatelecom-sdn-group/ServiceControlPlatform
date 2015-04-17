/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements service chain project view
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var framework = require('../_main_/framework');
var monitor_mgr = require('./monitor_mgr');
var monitor_entry = require('../../models/system_models/monitor_entry');
var _framework = new framework();
var common = require('./common_content');


/**
 * get html by ejs and data
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.get = function(req, res){
    common.Content["zh-cn"].title="SC项目";
    common.Content["en"].title="SC Projects";
	var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
    monitor_entry.get_chain_list(false,function(err,results)
    {
        if(!results){
            res.render('monitor_mgr/error_page', {message:"CAT FIND TOPO!!!"});
        }
        else{
            //console.log(JSON.stringify(results));
            res.render('monitor_mgr/sc_project_view', {
                nav_head: _UIData.Nav_head,
                nav_left:_UIData.Nav_left,
                nav_foot:_UIData.Nav_foot,
                content:_UIData.Content,
                head_active:"/sc_project_view",
                left_active:"/sc_project_view",//指示活动标签
				chain_detail_url:"/monitor_chain_query_frame?",
				chain_list_url:"/monitor_chain_data?",
                results:results
            });
        }
    });
}

/**
 * get service chain data
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.get_service_chain_data = function(req, res){
	var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
    var condition={"Name":req.query.name};
	console.log(condition);
    //查询业务链数据
    monitor_entry.get_chain_data(condition,function(err,chain_data){
        if(!chain_data){
            res.json({topo_data:null,chain_data:null});
        }
        else{
            //console.log(chain_data);
            //查询拓扑数据
            monitor_entry.get_globol_topo(false,function(err,topo_data)
            {
				 res.json({topo_data:topo_data,chain_data:chain_data});
            });
        }
    });
}
