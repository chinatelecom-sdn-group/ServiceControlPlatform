/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements project config view
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
var project_active = require('./project_active');
var system_cfg = require('../../models/db/system_cfg');
var menu = require('./project_mgr');
var Content = {
    "zh-cn" : {
        title:"项目",
        table_head : ["项目名称","状态","用户组","套餐组","项目编号"],
        table_items : ["Name","State","SubscriberGroupList","ServicePackageList","id"],
        dlg_add_title:"添加项目",
        dlg_add_slave_title:"添加从项目",
        dlg_modify_title:"修改项目",
        dlg_delete_title:"删除项目",
        select_subscriber_group:"选择用户组",
        select_subscriber_group_list:"用户组列表",
        select_service_package:"选择业务",
        select_service_package_list:"业务列表",
        project_id :"项目编号",
        project_name :"项目名称",
        project_description :"项目描述",
        page_url:"project_config"
    },
    "en" : {
        title:"Project",
        table_head : ["ProjectName","State","SubscriberGroupList","ServicePackageList","ProjectID"],
        table_items : ["Name","State","SubscriberGroupList","ServicePackageList","id"],
        dlg_add_title:"Add Project",
        dlg_add_slave_title:"Add Slave Project",
        dlg_modify_title:"Modify Project",
        dlg_delete_title:"Delete Project",
        select_subscriber_group:"Select Subscriber",
        select_subscriber_group_list:"Subscriber Group List",
        select_service_package:"Select Service Package",
        select_service_package_list:"Service Package",
        project_id :"Project ID",
        project_name :"Project Name",
        project_description :"Project Description",
        page_url:"project_config"
    }
};
var _framework = new framework();
var module = {
    "name": "Project",
    "ejs": "project_mgr/project_config",
    "ejs4content": "_main_/table_select",
    "check_box":"check_box_project",
    "head_active":"/project_config",
    "left_active":"/project_config",//指示活动标签
    "menu":menu,
    "content":Content,
    "condition":{MasterId:""},
    "collection":"Project"//指定表名，与system_cfg.js对应
};

function build_query_slave_project_condition(master_project_list){
    var master_id_array = new Array();
    for(var i=0; i<master_project_list.length; i++){
        master_id_array.push(master_project_list[i]._id);
    }
    return {MasterId: {$in: master_id_array}};
}
function build_project_list(master_project_list,slave_project_list){
    var slave_project_map = {};
    var slave_project_str_map = {};
    var project_list = [];
    for(var slave_id=0; slave_id<slave_project_list.length; slave_id++){
        var slave_project = slave_project_list[slave_id];
        if(slave_project_map[slave_project.MasterId]==undefined){
            slave_project_map[slave_project.MasterId] = new Array();
            slave_project_str_map[slave_project.MasterId] = slave_project.MasterId;
        }
        var slave_project_index = slave_project_map[slave_project.MasterId].length;
        slave_project_map[slave_project.MasterId][slave_project_index] = {
            index:slave_id,
            project_id:slave_project._id
        };
        slave_project_str_map[slave_project.MasterId] += ","+slave_project._id
    }
    for(var master_index=0; master_index<master_project_list.length; master_index++){
        var master_project = master_project_list[master_index];
        var project_index = project_list.length;
        project_list[project_index] = master_project_list[master_index];
        if(slave_project_map[master_project._id]!=undefined){
            for(var slave_project_index=0; slave_project_index<slave_project_map[master_project._id].length; slave_project_index++){
                var project_index = project_list.length;
                var salve_index =  slave_project_map[master_project._id][slave_project_index].index;
                project_list[project_index] = slave_project_list[salve_index];
            }
        }
    }
    var result = {
        list:project_list,
        slave_project_map:slave_project_str_map
    }
    return result;
}

exports.get = function(req, res){
   // _framework.get(req,res,module);
    _framework.get_db_operation(req,res,module.collection,function(err,redir,db_operation){
        if(redir){
            res.redirect(redir);//重定向
        } else{
            var condition = _framework.getCondition(req,module);
            var _UIData = _framework.getUIData(req,module.menu,module.content);
            //先查分页查询主project
            db_operation.getPagination(condition,function(err, pageCount, master_project_list){
                //console.log(list);
                condition.page['pageCount']=pageCount;
                condition.page['size']=master_project_list.length;
                condition.page['numberOf']=pageCount>5?5:pageCount;
                //修改查找条件，以查找slave project
                condition.search = build_query_slave_project_condition(master_project_list);
                //再查询
                db_operation.get(condition,function(error, slave_project_list){
                    //console.log("[info]"+slave_project_list);
                    var result = build_project_list(master_project_list,slave_project_list);
                    //console.log(result);
                    _framework.render(req,res,module,_UIData,condition,result.list,db_operation,result.slave_project_map);
                });
            });
        }
    });
};

exports.get_content = function(req, res){
    _framework.get_content(req,res,module);
};

exports.get_slave_project = function(req, res){
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

exports.do_active_or_inactive  = function(req, res){
    var db_operation = system_cfg.getOperationByName(module.collection);
    try {
        project_active.do_active_or_inactive(req,res);
    } catch (err) {
        console.log(err.stack);
        db_operation.modify(req.body.id,{State:req.body.state},function(err){
            return res.json(
                {
                    id:req.body.id,
                    state:req.body.state,
                    result:"fail"
                });
        });
    }
};

exports.module = module;