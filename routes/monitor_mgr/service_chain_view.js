/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements service chain view
 * <p/>
 *
 * @author Boqi Mo(chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var framework = require('../_main_/framework');
var monitor_mgr = require('./monitor_mgr');
var monitor_entry = require('../../models/system_models/monitor_entry');
var _framework = new framework();
var common = require('./common_content');

exports.get_chain_history=function (req,res) {
	var time_start = (new Date(req.query.start)).getTime();
    var time_end = (new Date(req.query.end)).getTime();
    var condition={
        "Name":req.query.name,
        "start":time_start,
        "end":time_end,
        "size":req.query.size
    };
    console.log(condition);
	results=
	{
	  "time":["00:01","00:02","00:03","00:04","00:05","00:06","00:07","00:08"],
	  "start_rx":[],
	  "start_tx":[],
	  "end_rx":[],
	  "end_tx":[]
	}
	
	for(var i=0;i<10;i++)
	{
	    results.start_rx.push(parseInt(Math.random()*5)+5);
		results.start_tx.push(parseInt(Math.random()*5)+5);
		results.end_rx.push(parseInt(Math.random()*5)+5);
		results.end_tx.push(parseInt(Math.random()*5)+5);
	}
	
	res.render('monitor_mgr/chain_history_view',{results:JSON.stringify(results),name:req.query.name});
	
}

exports.get_chain_query_frame=function (req,res) {
	var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
	res.render('monitor_mgr/query_frame',
	{
		content:_UIData.Content,
		query_url:"/monitor_chain_history?",
		query_fields:String("name:\""+req.query.name+"\"")
	});
}


exports.get_links_query_frame=function (req,res) {
	var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
	res.render('monitor_mgr/query_frame',
	{	
		content:_UIData.Content,
        query_url:"/monitor_links_history?",
		query_fields:String("chain_name:\""+req.query.chain_name+"\",links:"+JSON.stringify(req.query.links))
	});
}


exports.get_links_history=function (req,res) {
    var condition={links:req.query.links,chain_name:req.query.chain_name};
	console.log(condition);
    monitor_entry.get_links_history(condition,function(err,reuslts){
        res.render("monitor_mgr/links_history_view",{reuslts:reuslts,chain_name:req.query.chain_name});
    });
}