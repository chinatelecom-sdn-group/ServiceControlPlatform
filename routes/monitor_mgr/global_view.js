/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements Resource Global view : topology 、host 、vm etc
 * <p/>
 *
 * @author Boqi Mo (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var framework = require('../_main_/framework');
var monitor_mgr = require('./monitor_mgr');
var monitor_entry = require('../../models/system_models/monitor_entry');
var _framework = new framework();
var common = require('./common_content');
var flow_entry_collector = require("./pf_flow_entry_collect");

/**
 * return page
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.get = function(req, res){
    common.Content["zh-cn"].title="总体拓扑";
    common.Content["en"].title="Global View";
    var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
	if(req.query.test_data=="1")
	{
		common.Content["zh-cn"].title="总体拓扑(测试数据)";
		common.Content["en"].title="Global View(test data)";
	}
    monitor_entry.get_globol_topo(false,function(err,results)
    {
        if(!results){
            res.render('monitor_mgr/error_page', {message:"CAT FIND TOPO!!!"});
        }
        else{
            console.log(JSON.stringify(results));
            res.render('monitor_mgr/global_view', {
                nav_head: _UIData.Nav_head,
                nav_left:_UIData.Nav_left,
                nav_foot:_UIData.Nav_foot,
                content:_UIData.Content,
                head_active:"/global_view",
                left_active:"/global_view",//指示活动标签
                results:JSON.stringify(results)
            });
        }
    },req.query.test_data);
}

/**
 * return host runtime info
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.get_host_info = function(req, res){
    var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
    var condition={"Name":req.query.name};
    monitor_entry.get_host_info(condition,function(err,results){
        console.log(results);
        if(!results)
        {
            res.render('monitor_mgr/empty_view', {message:"OBJECT NOT FOUND!!!"});
        }
        else{
            res.render('monitor_mgr/host_statistics_view', 
			{
				content:_UIData.Content,
				host:results,
				query_url:"/monitor_host_history",
				query_fields:"name:$(\"span#host_name\").text()"
			});
        }
    });
}

/**
 * return host history
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.get_host_history = function(req, res){
	var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
    var time_start = (new Date(req.query.start)).getTime();
    var time_end = (new Date(req.query.end)).getTime();
    var condition={
        "Name":req.query.name,
        "start":time_start,
        "end":time_end,
        "size":req.query.size
    };
    console.log(condition);
    monitor_entry.get_hosthistory(condition,function(err,results){
         if(!results){
            res.render('monitor_mgr/empty_view', {message:"OBJECT NOT FOUND!!!"});
         }
         else{
            console.log(results);
            res.render('monitor_mgr/host_history_view', {
                host_history:results,
                network:JSON.stringify(results.Network),
                labels:JSON.stringify(results.time)
            });
         }
    });
}
/**
 * return switch runtime info
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.get_switch_info = function(req, res){
	var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
    var condition={"Name":String("Switch@"+req.query.name)};
    monitor_entry.get_switch_info(condition,function(err,results){
        //console.log(results);
        if(!results)
        {
            res.render('monitor_mgr/empty_view', {message:"OBJECT NOT FOUND!!!"});
        }
        else{
            flow_entry_collector.collect(req.query.name,function(err,flow_info){
                res.render('monitor_mgr/switch_statistics_view',
                    {
                        content:_UIData.Content,
                        switch_info:results,
                        flow_info:flow_info,
                        sw:req.query.name,
                        query_url:"/monitor_switch_history",
                        query_fields:"name:$(\"span#host_name\").text()"
                    });
            });
        }
    });
}

/**
 * return switch history info
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.get_switch_history = function(req, res){
	var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
    var time_start = (new Date(req.query.start)).getTime();
    var time_end = (new Date(req.query.end)).getTime();
    var condition={
        "Name":req.query.name,
        "start":time_start,
        "end":time_end,
        "size":req.query.size
    };
    //console.log("condition--------------------"+condition);
    monitor_entry.get_switch_history(condition,function(err,results){
        if(!results){
            res.render('monitor_mgr/empty_view', {message:"OBJECT NOT FOUND!!!"});
        }
        else{
            console.log(results);
            res.render('monitor_mgr/switch_history_view', {
                switch_history:results,
                switch_history_str:JSON.stringify(results),
                labels:JSON.stringify(results.Time)
            });
        }
    });
}

/**
 * return port runtime info
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.get_port_info = function(req, res){
	var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
    var condition={"Name":req.query.name,"Sw_Name":String("Switch@"+req.query.sw)};
	console.log("condition--------------------"+JSON.stringify(condition));
    monitor_entry.get_port_info(condition,function(err,results){
        console.log("result:-------"+JSON.stringify(results));
        if(!results)
        {
            res.render('monitor_mgr/empty_view', {message:"OBJECT NOT FOUND!!!"});
        }
        else{
            res.render('monitor_mgr/port_statistics_view', 
			{
				content:_UIData.Content,
				port_info:results,
				sw:req.query.sw,
				query_url:"/monitor_port_history?",
				query_fields:"name:$(\"span#host_name\").text(),sw:\""+req.query.sw+"\""
			});
        }
    });
}

/**
 * return port history info
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.get_port_history = function(req, res){
	var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
    var time_start = (new Date(req.query.start)).getTime();
    var time_end = (new Date(req.query.end)).getTime();
    var condition={
        "Sw_Name":String("Switch@"+req.query.sw),
		"Name":req.query.name,
        "start":time_start,
        "end":time_end,
        "size":req.query.size,
		"Sw_Name":req.query.sw
    };
    console.log(condition);
    monitor_entry.get_port_history(condition,function(err,results){
        if(!results){
            res.render('monitor_mgr/empty_view', {message:"OBJECT NOT FOUND!!!"});
        }
        else{
            console.log(results);
            res.render('monitor_mgr/port_history_view', {
                port_history:results,
                port_history_str:JSON.stringify(results),
				sw:req.query.sw,
                labels:JSON.stringify(results.time)
            });
        }
    });
}