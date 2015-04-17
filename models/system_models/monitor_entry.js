/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements monitor mongoose schema
 * <p/>
 *
 * @author Boqi mo (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

/**
 * Created by Administrator on 2014/7/7.
 */
var mongoose = require('mongoose');
var system_cfg = require('../../bin/config').system_cfg;//数据库配置

// define new schema for mongodb
var ObjetSchema = new mongoose.Schema({
	type:{type: String, required: true},
	name:{type: String, required: true},
    id:	{type: String, required: true},
	cpu_cores:{type: Number, required: true},
	vnc:{type: String, required: true},
	ip:{type: String, required: true},
	glance:{type: String, required: true},
	remark:{type: String, required: true},
	interfaces:{type: Array, required: true},
	mem_total:{type: Number, required: true},
	disk_total:{type: Number, required: true},
	host_name:{type: String, required: true}
});

var HostObjectSchema = new mongoose.Schema({
    //oID: { type: Number, required: true, index: { unique: true }},
    //fID: { type: Number, required: true, index: { unique: true }},
	type:{type: String, required: true},
	
    id:	{type: String, required: true},
	cpu_cores:{type: Number, required: true},
	vnc:{type: String, required: true},
	ip:{type: String, required: true},
	glance:{type: String, required: true},
	remark:{type: String, required: true},
	interfaces:{type: Array, required: true},
	mem_total:{type: Number, required: true},
	disk_total:{type: Number, required: true},
	host_name:{type: String, required: true},	
	
	CPUMhz:{type: Number, required: true},
	CPUNum:{type: Number, required: true},
	DiskTotal:{type: Number, required: true},
	MemoryTotal:{type: Number, required: true},
	Name:{type: String, required: true},
	Network:{type: Array, required: true}
});

var PortRecordSchema= new mongoose.Schema({
    "TimeStamp":{type: Number, required: true},
    "Port":{type: Array, required: true}
});

var PortConfigSchema= new mongoose.Schema({
    "Port":{type: Array, required: true},
	"Name":{type: String, required: true}
});

var HostRecordSchema = new mongoose.Schema({
"Name": {type: String, required: true},
   "Time": {type: Date, required: true},
   "CPUUsed":{type: Number, required: true},
   "MemoryFree": {type: Number, required: true},
   "MemoryTotal": {type: Number, required: true},
   "MemoryUsed": {type: Number, required: true},
   "DiskFree": {type: Number, required: true},
   "DiskTotal": {type: Number, required: true},
   "DiskUsed": {type: Number, required: true},
   "Network":{type: Array, required: true},
   "TimeStamp":{type: Number, required: true}
});

var TopoSchema = new mongoose.Schema({
	//host:{type: Array, required: true},
	name:{type: String, required: true}
});

var SettingSchema = new mongoose.Schema({
	name:{type: String, required: true},
	value:{type: String, required: true}
});

var ChainSchema= new mongoose.Schema({
	Name:{type: String, required: true},
	Line:{type: Array, required: true}
});


var FlowRecordSchema = new mongoose.Schema({
   "Host": {type: String, required: true},
   "Time": {type: Date, required: true},
   "TimeStamp":{type: Number, required: true},
   "Traffic":{type: Array, required: true}
});

//建立db存取方法
//var scp_db_url="mongodb://lp:lp@127.0.0.1:27019/ServiceControlPlatform";
var scp_url = system_cfg.mongodb.IP + ":" + system_cfg.mongodb.Port + "/ServiceControlPlatform";
var scp_user = system_cfg.mongodb.ServiceControlPlatform.User;
var scp_password = system_cfg.mongodb.ServiceControlPlatform.Password;
var scp_db_url = "mongodb://"+scp_user + ":"+scp_password +"@"+scp_url;
var local_db = mongoose.createConnection(scp_db_url);
//console.log(local_db);
var HostRecordModel=local_db.model( 'Resource_Host_Record', HostRecordSchema,  'Resource_Host_Record');
//var ObjectsModel=local_db.model( 'Monitor_Objects', ObjetsSchema,  'Monitor_Objects');
var ObjectModel=local_db.model( 'Monitor_object', ObjetSchema,  'Monitor_object');
var HostObjectModel=local_db.model( 'Resource_Host_Config', HostObjectSchema,  'Resource_Host_Config');

var TopoModel=local_db.model( 'Resource_Topo', TopoSchema,  'Resource_Topo');
var SettingModel=local_db.model( 'Setting', SettingSchema,  'Setting');
var ChainModel=local_db.model( 'Resource_Chain', ChainSchema,  'Resource_Chain');

var PortRecordModel=local_db.model( 'Resource_vSwitch_Record', PortRecordSchema,  'Resource_vSwitch_Record');
var PortConfigModel=local_db.model( 'Resource_vSwitch_Config', PortConfigSchema,  'Resource_vSwitch_Config');


function print_time(time_obj)
{
    var temp_time=new Date();
	var hour;
	var minutes;
	
	temp_time.setTime(time_obj);
	hour=String(temp_time.getHours());
	minutes=String(temp_time.getMinutes());
	if(hour.length < 2)
		hour=String("0"+hour);
	if(minutes.length < 2)
		minutes=String("0"+minutes);
	return (hour+":"+minutes);
}

exports.get_globol_topo=function (Return_chain_names,callback,test_data_view) {
    console.log("test_data_view-------"+test_data_view);
    if(test_data_view == "1")
	{
	    var TopoModel=local_db.model( 'Resource_Topo_Real', TopoSchema,  'Resource_Topo_Real');
	}
	else
	{
	    var TopoModel=local_db.model( 'Resource_Topo', TopoSchema,  'Resource_Topo');
	}
	
	
	TopoModel.find({},{_id:0}).exec(function(error, topo_result)
	{		
		SettingModel.findOne({"name":"host_sequence"},{_id:0,"value":1}).exec(function(error, setting_result)//排序
		{
			if(setting_result)//在有指定顺序的情况下才排序
			{
				var topo_outcome=[];
				var sequence_array=eval('(' + (JSON.stringify(setting_result)) + ')').value.split(",");
				for(var i=0;i<sequence_array.length;i++)
				{
					for(var j=0;j<topo_result.length;j++)
					{
					    //console.log("------------------"+topo_result[j].name+"    "+sequence_array[i]);
						if(topo_result[j])
						{
						    if(topo_result[j].name==sequence_array[i])
							{
								
								topo_outcome.push(topo_result[j]);
								delete topo_result[j];
								break;
							}
						}
					}
					
				}
				for(var j=0;j<topo_result.length;j++)//没有在指定排序记录的，则随意放在后面
				{
				    if(topo_result[j])
					    topo_outcome.push(topo_result[j]);
				}
				topo_result=topo_outcome;
			}
			else
			{
			    topo_outcome=topo_result;
			}
			
			if(Return_chain_names)
			{
				ChainModel.find({},{_id:0}).exec(
				  function(error,chain_result)
				  {
					   var result={topo_data:{host:topo_outcome},chains_set:chain_result};
					   callback(error,result);
				  }			  
				);
			}
			else
			{
				callback(error,{host:topo_outcome});
			}
		});
	});
}

exports.get_chain_data=function (conditon,callback) {
	var switch_data;
	function get_port_name(sw,index)
	{
	    for(var i=0;i<switch_data.length;i++)
		{
			if(switch_data[i].Name==sw)
			{
      			for(var j=0;j<switch_data[i].Port.length;j++)
				{
					if(switch_data[i].Port[j].Port==index)
					{
						return switch_data[i].Port[j].Name;
					}
				}
				return null;
			}
		}
		return null;
	}
	PortConfigModel.find({},{"_id":0}).exec(function(error, port_config_result)
	{
		switch_data=port_config_result;
		ChainModel.findOne(conditon,{"_id":0}).exec(function(error, chain_result)
		{	
			var temp_outcome=chain_result;
			for(var i=0;i<temp_outcome.Line.length;i++)
			{
			    var sw_name=String("Switch@"+temp_outcome.Line[i].host);
				temp_outcome.Line[i].inport["Name"]=get_port_name(sw_name,temp_outcome.Line[i].inport.port);
				temp_outcome.Line[i].outport["Name"]=get_port_name(sw_name,temp_outcome.Line[i].outport.port);
				if(Math.floor(Math.random()*3)==1)//随机模拟状态
				{
				    temp_outcome.Line[i]["status"]="disable";
				}
				
			}
			callback(error,chain_result);
		});
	});
}

exports.get_chain_list=function (conditon,callback) {
	ChainModel.find(conditon,{"Name":1,"_id":0}).exec(function(error, chain_list_result)
	{	
		callback(error,chain_list_result);
	});
}



exports.get_host_info=function(condition,callback)
{    
	HostObjectModel.findOne(condition,{"_id":0}).exec(function(error, obj_result) //虚拟机计算资源历史记录
	{
		if(obj_result)
		{
		   var result=JSON.stringify(obj_result);//.parseJSON();
		   result=eval('(' + result + ')'); 

		   var now=new Date();
		   time_prv=now.getTime()-6*60*1000;//六分钟之前
		   HostRecordModel.findOne({Name:condition.Name,TimeStamp:{$gt:time_prv}},"").sort({Time:-1}).exec(function(error, record1)
		   {
		       if(!record1)
			   {
			        result["status"]="offline";
			   }
			   else
			   {
			       result["mem_free"]=parseInt((record1.MemoryFree)/1024);
			       result["disk_free"]=parseInt((record1.DiskFree)/1024);
                   result["CPUUsed"] = record1.CPUUsed
                   result["Network"] = record1.Network;
			    }

				result["DiskTotal"]=parseInt((result["DiskTotal"])/1024);
				result["MemoryTotal"]=parseInt((result["MemoryTotal"])/1024);
               console.log("-----------------"+JSON.stringify(result));
			   callback(error,result);
			   
		   });
		}
        else
        {		
		    callback(error,null);
		}
	});
}

exports.get_switch_info=function(condition,callback)
{
    console.log(condition);
	PortConfigModel.findOne(condition,{"_id":0}).exec(function(error, port_config_result)
	{
	    console.log(port_config_result);
		callback(null, port_config_result);
	});
}


exports.get_hosthistory=function(obj,callback)
{
	var results={time:[],Cpu:[],MemoryTotal:0,Memory:[],DiskTotal:0,Disk:[],Network:[]};
	var condition={};	
	var start_time;
	var end_time;
	var time_size;
	var time_interval;
		
	start_time=obj.start;
	end_time=obj.end;
	time_size=obj.size;
	condition["TimeStamp"]={"$gte":start_time,"$lte":end_time};
	condition["Name"]=obj.Name;
	console.log("condition-------------------"+JSON.stringify(condition));	
	
	var time_interval=time_size*60*1000;
	var point_num=parseInt((end_time-start_time)/time_interval);
	
	
	HostRecordModel.find(condition,{"_id":0}).sort({TimeStamp:-1}).exec(function(error, host_result)//降序排序
	{
        console.log("host_result.length------"+host_result.length);
		if (error) 
		{
            callback(error, null);
			return;
        }
		else
		{
		    if(!host_result.length)
			{ 
			    callback(null, null);
			}
			else
			{
				//console.log(host_result);
				results.MemoryTotal=parseInt(host_result[0].MemoryTotal/1024);//单位M
				results.DiskTotal=parseInt(host_result[0].DiskTotal);//单位M
				//生成最基本的网卡数组
				for(var i=0;i<host_result[0].Network.length;i++)
				{
				    var temp_json={name:"",rx:[],tx:[],rx_total:0,tx_total:0};
					temp_json.name=host_result[0].Network[i].Name;
					results.Network.push(temp_json);
				}
				
				
				console.log("point_num:---------"+point_num);
				for(var point_index=0;      point_index<point_num;     point_index++)
				{
				    var cpu_total=0
					var mem_total=0;
					var disk_total=0;
					
					var push_num=0;//每次要求平均的点的个数
					//console.log(end_time-point_index*time_interval);
					
					for( var i=0 ; i<host_result.length; i++)
					{
					    //找到符合条件的，压入数组
						if(host_result[i]["TimeStamp"] <= end_time-(point_num-point_index-1)*time_interval &&  host_result[i]["TimeStamp"] > end_time-(point_num-point_index)*time_interval)
						{						
							cpu_total+=host_result[i]["CPUUsed"]*100;
							mem_total+=parseInt(host_result[i]["MemoryFree"]/1024);
							disk_total+=parseInt(host_result[i]["DiskFree"]);
							
							for(var k=0;k<results.Network.length;k++)
							{
								for(var k2=0;k2<host_result[i].Network.length;k2++)
								{
									if(results.Network[k].name==host_result[i].Network[k2].Name)
									{
										results.Network[k].rx_total+=parseInt((host_result[i].Network[k2].RxSpeed/1024));
										results.Network[k].tx_total+=parseInt((host_result[i].Network[k2].TxSpeed/1024));
									}
								}
							}
							push_num++;
						}
					}
					
					
					if(push_num)//需要计算平均值
					{
						results["Cpu"].push(cpu_total/push_num);
						results["Memory"].push(parseInt(mem_total/push_num));
						results["Disk"].push(parseInt(disk_total/push_num));
						for(var k=0;k<results.Network.length;k++)
						{
							results.Network[k].rx.push(parseInt(results.Network[k].rx_total/push_num));
							results.Network[k].tx.push(parseInt(results.Network[k].tx_total/push_num));                            							
						}
						
					}
					else//区间内没有点
					{
						results["Cpu"].push(0);
						results["Memory"].push(0);
						results["Disk"].push(0);
						for(var k=0;k<results.Network.length;k++)
						{
							results.Network[k].rx.push(0);
							results.Network[k].tx.push(0);
						}
						i++;
					}
					results.time.push(print_time(end_time-(point_num-point_index-1)*time_interval));
				}
				
				for(var k=0;k<results.Network.length;k++)
				{
				    delete results.Network[k].rx_total;
					delete results.Network[k].tx_total;
				}
				arr_length=results["time"].length;
				results["time"].push(" ")//防止界面的全部数据相同的bug
				results["Cpu"].push(results["Cpu"][arr_length-1]+1);
				results["Memory"].push(results["Memory"][arr_length-1]-1);
				results["Disk"].push(results["Disk"][arr_length-1]-1);
				for(var k=0;k<results.Network.length;k++)
				{
					results.Network[k].rx.push(0.1);
					results.Network[k].tx.push(0.1);
				}
                callback(null, results);				
			}
		}
	});
}



exports.get_switch_history=function(obj,callback)
{
	var results={time:[],Port:[]};
	var condition={};	
	var start_time;
	var end_time;
	var time_size;
	var time_interval;
		
	start_time=obj.start;
	end_time=obj.end;
	time_size=obj.size;
	condition["TimeStamp"]={"$gte":start_time,"$lte":end_time};
	condition["Name"]=obj.Name;
	console.log("condition-------------------"+JSON.stringify(condition));	
	
	var time_interval=time_size*60*1000;
	var point_num=parseInt((end_time-start_time)/time_interval);	
	
	PortRecordModel.find(condition,{"_id":0}).sort({TimeStamp:-1}).exec(function(error, host_result)//降序排序
	{
		if (error) 
		{
            callback(error, null);
			return;
        }
		else
		{
		    if(!host_result.length)
			{ 
			    callback(null, null);
			}
			else
			{
				//生成最基本的网卡数组
				for(var i=0;i<host_result[0].Port.length;i++)
				{
				    var temp_json={Name:"",rx:[],tx:[],rx_total:0,tx_total:0};
					temp_json.Name=host_result[0].Port[i].Name;
					results.Port.push(temp_json);
				}				
				console.log("point_num:---------"+point_num);
				for(var point_index=0;      point_index<point_num;     point_index++)
				{					
					var push_num=0;//每次要求平均的点的个数					
					for( var i=0 ; i<host_result.length; i++)
					{
					    //找到符合条件的，压入数组
						if(host_result[i]["TimeStamp"] <= end_time-(point_num-point_index-1)*time_interval &&  host_result[i]["TimeStamp"] > end_time-(point_num-point_index)*time_interval)
						{						
							for(var k=0;k<results.Port.length;k++)
							{
								for(var k2=0;k2<host_result[i].Port.length;k2++)
								{
									if(results.Port[k].name==host_result[i].Port[k2].Name)
									{
										results.Port[k].rx_total+=parseInt((host_result[i].Port[k2].RxSpeed/1024));
										results.Port[k].tx_total+=parseInt((host_result[i].Port[k2].TxSpeed/1024));
									}
								}
							}
							push_num++;
						}
					}
					
					
					if(push_num)//需要计算平均值
					{
						for(var k=0;k<results.Port.length;k++)
						{
							results.Port[k].rx.push(parseInt(results.Port[k].rx_total/push_num));
							results.Port[k].tx.push(parseInt(results.Port[k].tx_total/push_num));                            							
						}
						
					}
					else//区间内没有点
					{
						for(var k=0;k<results.Port.length;k++)
						{
							results.Port[k].rx.push(0);
							results.Port[k].tx.push(0);
						}
						i++;
					}
					results.time.push(print_time(end_time-(point_num-point_index-1)*time_interval));
				}
				
				for(var k=0;k<results.Port.length;k++)
				{
				    delete results.Port[k].rx_total;
					delete results.Port[k].tx_total;
				}
				
				results["time"].push(" ")//防止界面的全部数据相同的bug
				for(var k=0;k<results.Port.length;k++)
				{
				    results.Port[k].rx.push(0.1);
					results.Port[k].tx.push(0.1);
				}
                callback(null, results);				
			}
		}
	});
}


exports.get_port_info=function(condition,callback)
{
	var results={};
	PortConfigModel.findOne({Name:condition.Sw_Name},{"_id":0}).exec(function(error, sw_result)
	{
		if (error||!sw_result) 
		{
            callback(error, null);
			return;
        }
		else
		{
			for(var i=0;i<sw_result.Port.length;i++)
			{
				if(sw_result.Port[i].Name==condition.Name)
				{
					callback(null,sw_result.Port[i]);
					return;
				}
			}
			callback(null,null);				
			return;
		}
	});
}

exports.get_port_history=function(obj,callback)
{
    var results={Name:"",rx:[],tx:[],rx_total:0,tx_total:0,time:[]};
	var condition={};	
	var start_time;
	var end_time;
	var time_size;
	var time_interval;
	
	start_time=obj.start;
	end_time=obj.end;
	time_size=obj.size;
	condition["TimeStamp"]={"$gte":start_time,"$lte":end_time};
	condition["Name"]="Switch@"+obj.Sw_Name;
	console.log("condition-------------------"+JSON.stringify(condition));;
	
	var time_interval=time_size*60*1000;
	var point_num=parseInt((end_time-start_time)/time_interval);	
	
	PortRecordModel.find(condition,{"_id":0}).sort({TimeStamp:-1}).exec(function(error, host_result)//降序排序
	{
        //console.log("host_result.length------"+host_result.length);
		if (error) 
		{
            callback(error, null);
			return;
        }
		else
		{
		    if(!host_result.length)
			{ 
			    callback(null, null);
			}
			else
			{
				console.log("point_num:---------"+point_num);				
				for(var point_index=0;      point_index<point_num;     point_index++)
				{
				    var cpu_total=0
					var mem_total=0;
					var disk_total=0;					
					var push_num=0;//每次要求平均的点的个数					
					for( var i=0 ; i<host_result.length; i++)
					{
					    //找到符合条件的，压入数组
						if(host_result[i]["TimeStamp"] <= end_time-(point_num-point_index-1)*time_interval &&  host_result[i]["TimeStamp"] > end_time-(point_num-point_index)*time_interval)
						{						
							for(var k2=0;k2<host_result[i].Port.length;k2++)
							{
								if(obj.name==host_result[i].Port[k2].Name)
								{
									results.rx_total+=parseInt((host_result[i].Port[k2].RxSpeed/1024));
									results.tx_total+=parseInt((host_result[i].Port[k2].TxSpeed/1024));
								}
							}
							push_num++;
						}
					}

					if(push_num)//需要计算平均值
					{

						results.rx.push(parseInt(results.rx_total/push_num));
						results.tx.push(parseInt(results.tx_total/push_num));
					}
					else//区间内没有点
					{

						results.rx.push(0);
						results.tx.push(0);
						i++;
					}
					results.time.push(print_time(end_time-(point_num-point_index-1)*time_interval));
				}

				delete results.rx_total;
				delete results.tx_total;
				results["time"].push(" ")//防止界面的全部数据相同的bug
				results["rx"].push(0.1);
				results["tx"].push(0.1);
                callback(null, results);				
			}
		}
	});
}


exports.get_links_history=function(condition,callback)
{
    var results;
	results=condition;
	for(var i=0;i<results.links.length;i++)
	{
	    results.links[i]["rx"]=[3,3,2,5,1,8,3,4,7];
		results.links[i]["tx"]=[4,1,5,7,1,0,2,8,3];
	}
	results["time"]=["03","04","05","06","07","08","09","10","11"];
	callback(null, results);
}

//radius&& bras

exports.get_online_user=function(condition,callback)
{
    SettingModel.find({},{_id:0}).exec(function(error, setting_result)
	{
		setting_result = JSON.parse(JSON.stringify(setting_result));
		var bras_addr,bras_user,bras_pw;
		for(var i=0;i<setting_result.length;i++)
		{
		    if(setting_result[i].name=="bras_addr")
			    bras_addr=String(setting_result[i].value);
			else if(setting_result[i].name=="bras_user")
			    bras_user=String(setting_result[i].value);
			else if(setting_result[i].name=="bras_pw")
			    bras_pw=String(setting_result[i].value);
		}
		
		var exec = require("child_process").exec;
		cmd = "sh bras_script/get_online_user.sh "+bras_addr+" "+bras_user+" "+bras_pw;
		exec(cmd, function (error, stdout, stderr) {
		   var result=[];
		   var array=String(stdout).split("\n");
		   for(var i=0;i<array.length;i++)
		   {
			   if(array[i] == "")
				   break;
			   result.push(array[i].split(","));
		   }
			callback(stderr,result);
		});
	});
}

exports.get_user_meal=function(condition,callback)
{
	SettingModel.find({},{_id:0}).exec(function(error, setting_result)
	{
		setting_result = JSON.parse(JSON.stringify(setting_result));
		var bras_addr,bras_user,bras_pw;
		for(var i=0;i<setting_result.length;i++)
		{
		    if(setting_result[i].name=="bras_addr")
			    bras_addr=String(setting_result[i].value);
			else if(setting_result[i].name=="bras_user")
			    bras_user=String(setting_result[i].value);
			else if(setting_result[i].name=="bras_pw")
			    bras_pw=String(setting_result[i].value);
		}
	    var exec = require("child_process").exec;
		cmd = "sh bras_script/get_user_meal.sh "+bras_addr+" "+bras_user+" "+bras_pw+" "+String(condition.user);
		exec(cmd, function (error, stdout, stderr) {
			callback(stderr,String(stdout).split("\n")[0]);
		});
	});
}

exports.set_user_meal=function(condition,callback)
{
    SettingModel.find({},{_id:0}).exec(function(error, setting_result)
	{
		setting_result = JSON.parse(JSON.stringify(setting_result));
		var radius_addr,radius_pw,bras_addr,radius_key;
		for(var i=0;i<setting_result.length;i++)
		{
		    if(setting_result[i].name=="radius_addr")
			    radius_addr=String(setting_result[i].value);
			else if(setting_result[i].name=="radius_pw")
			    radius_pw=String(setting_result[i].value);
			else if(setting_result[i].name=="bras_addr")
			    bras_addr=String(setting_result[i].value);
			else if(setting_result[i].name=="radius_key")
			    radius_key=String(setting_result[i].value);
		}
		var exec = require("child_process").exec;
		cmd = "sh bras_script/set_user_meal.sh "+radius_addr+" "+radius_pw+" "+bras_addr+" "+radius_key+" "+String(condition.user)+" "+String(condition.meal);
		exec(cmd, function (error, stdout, stderr) {
			console.log("excute result--------"+stdout);
			callback(stderr,String(stdout).split("\n")[0]);
		});
	});
}


exports.get_variable=function(callback)
{
    SettingModel.find({},{_id:0}).exec(function(error, setting_result)
	{
			callback(error,setting_result);
	});
}

exports.get_variable_by_name=function(name,callback)
{
    SettingModel.find({name:name}).exec(function(error, setting_result)
    {
        if(error!=null){
            callback(error,null);
        }else if(setting_result.length==1){
            callback(null,setting_result[0]);
        }else{
            callback("get_variable_by_name error",null);
        }
    });
}

exports.set_variables=function(var_list,callback)
{
	var Err;
	for(var i=0;i<var_list.length;i++)
	{
		SettingModel.update({"name":var_list[i].name},{"name":var_list[i].name,"value":var_list[i].value},{"upsert":true},function(error, setting_result)
		{
			if(error)
				Err=error;
		});
		if(Err)
		{
		    console.log("Err is "+Err);
			break;
		}
	}
	callback(Err,null);
}