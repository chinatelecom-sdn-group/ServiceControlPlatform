/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements monitor subscriber status（online or offline）
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


exports.get_online_user = function(req, res){
    common.Content["zh-cn"].title="用户";
    common.Content["en"].title="User";
    var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
    monitor_entry.get_online_user({},function(err,result)
    {
			res.render('monitor_mgr/user', {
				nav_head: _UIData.Nav_head,
				nav_left:_UIData.Nav_left,
                nav_foot:_UIData.Nav_foot,
				content:_UIData.Content,
				head_active:"/User",
				left_active:"/User",
				result:result,
				debug_info:err
            });
    });
}



exports.get_user_meal = function(req, res){
  var condition={"user":req.query.user};
	monitor_entry.get_user_meal(condition,function(err,result)
	{
	   if(!result)
	       result="---";
	   res.json({"meal":result,"debug_info":err});
	});
}


exports.set_user_meal = function(req, res){
	monitor_entry.set_user_meal({"user":req.query.user,"meal":req.query.meal},function(err,result)
	{
	   res.json({"message":result,"debug_info":err});
	});
}

exports.get_variable = function(req, res){
    common.Content["zh-cn"].title="变量";
    common.Content["en"].title="Variable";
    var _UIData = _framework.getUIData(req,monitor_mgr,common.Content);
    monitor_entry.get_variable(function(err,result)
    {
			res.render('monitor_mgr/variable', {
				nav_head: _UIData.Nav_head,
                nav_left:_UIData.Nav_left,
                nav_foot:_UIData.Nav_foot,
				content:_UIData.Content,
				head_active:"/Variable",
				left_active:"/Variable",
				result:JSON.parse(JSON.stringify(result))
            });
    });
}

exports.set_variables = function(req, res){
    monitor_entry.set_variables(req.query.vars,function(err,result)
    {
		if(!err)
			res.json({"message":"success"});
		else
			res.json({"message":"fail"});
    });
}

/////////////////////////////////////////////

//这里用作无登录的时候外链接查询
//////////////////////
exports.get_user_unlogin = function(req, res){
   monitor_entry.get_variable(function(err,result)
   {	  
	  for(var i=0;i<result.length;i++)
	  {  
		  if(result[i].name=="unlogin_visit_key")
		  {
			  if(req.query.key==result[i].value)
			  {
			      break;//验证成功
			  }
		  }
		  if(i==result.length-1)
		  {
		      res.json({"message":"auth fail"});
			  return;
		  }
	  }
	 monitor_entry.get_online_user({},function(err,result)
	 {
		   for(var i=0;i<result.length;i++)
		   {
		       obj=result[i];
			   if(obj[1]==req.query.ip)
			   {
			       res.json({"message":"success","user":obj[0],"ip":obj[1],"meal":obj[2]});
				   return;
			   }
		   }
		   res.json({"message":"not found"});
	  });
	});
}


exports.set_user_meal_unlogin = function(req, res){
   monitor_entry.get_variable(function(err,result)
   {
	    for(var i=0;i<result.length;i++)
	  {
		  if(result[i].name=="unlogin_visit_key")
		  {
			  if(req.query.key==result[i].value)
			  {
				  break;//验证成功
			  }
		  }
		  if(i==result.length-1)
		  {
			  res.json({"message":"auth fail"});
			  return;
		  }
	  }
		monitor_entry.set_user_meal({"user":req.query.user,"meal":req.query.meal},function(err,result)
		{
		   res.json({"message":result});
		});
	});
}