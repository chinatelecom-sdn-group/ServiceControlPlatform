/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements SCP web page and db framework
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var error = require('./error_enum');
var system_cfg = require('../../models/db/system_cfg');
var language = require('../../models/language_config/language_config');
var project_menu = require('../project_mgr/project_mgr');
var service_menu = require('../service_mgr/service_mgr');
var policy_menu = require('../policy_mgr/policy_mgr');
var subscriber_menu = require('../subscriber_mgr/subscriber_mgr');
var monitor_menu = require('../monitor_mgr/monitor_mgr');
var system_menu = require('../system_config/system_config');
var policy_detail_menu = require('../policydetail_mgr/policy_detail_mgr');
//head navigation :language config
var Nav_Head = {
    "zh-cn" : {
        menu_items : ["项目管理","业务管理","策略管理","用户管理","系统监控","系统设置"],
        menu_item_icons:["glyphicon-list-alt","glyphicon-shopping-cart","glyphicon-briefcase","glyphicon-phone","glyphicon-eye-open","glyphicon-cog"],
        menu_item_links:[project_menu["zh-cn"],service_menu["zh-cn"],policy_menu["zh-cn"],subscriber_menu["zh-cn"],monitor_menu["zh-cn"],system_menu["zh-cn"]],
        menu_admin:{"name":""},
        menu_admin_items:["帮助","退出"],
        menu_admin_item_links:["#","/logout"],
        menu_admin_item_icons:["glyphicon-info-sign","glyphicon-log-out"],
        search_holder:"搜索...",
        main_page:"首页",
        btn_search : "搜索",
        btn_add : "增加",
        btn_del:"删除",
        btn_close:"取消",
        btn_save:"保存",
        btn_confirm:"确定"
    },
    "en" : {
        menu_items : ["Project","Service","Policy","Subscriber","Monitor","Setting"],
        menu_item_icons:["glyphicon-list-alt","glyphicon-shopping-cart","glyphicon-briefcase","glyphicon-phone","glyphicon-eye-open","glyphicon-cog"],
        menu_item_links:[project_menu["en"],service_menu["en"],policy_menu["en"],subscriber_menu["en"],monitor_menu["en"],system_menu["en"]],
        menu_admin:{"name":""},
        menu_admin_items:["help","Exit"],
        menu_admin_item_links:["#","/logout"],
        menu_admin_item_icons:["glyphicon-info-sign","glyphicon-log-out"],
        search_holder:"Search...",
        main_page:"Home",
        btn_search : "Search",
        btn_add : "Add",
        btn_del:  "Delete",
        btn_close:"Cancel",
        btn_save:"Save",
        btn_confirm:"OK"
    }
};

//foot navigation :language config
var Nav_foot = {
    "zh-cn" : {
        Develop:"研发单位",
        intel:"Intel Network Platform Group",
        gsta:"中国电信股份有限公司广州研究院"
    },
    "en":{
        Develop:"Developed by",
        intel:"Intel Network Platform Group",
        gsta:"China Telecom Guangzhou Research Institute"
    }
}
// module framework
function framework(){

}

/**
 * getUIData , english or chinese depend on request
 * @param {object} req - http request
 * @param {object} nav - navigation at left
 * @param {object} content - page content
 */
framework.prototype.getUIData = function(req,nav,content) {
    var _UIData = {
        Nav_head:Nav_Head[req.session.language],
        Nav_foot:Nav_foot[req.session.language],
        Nav_left:nav[req.session.language],
        Content:content[req.session.language]
    };
    _UIData.Nav_head.menu_admin.name = req.session.user;
    return _UIData;
};

/**
 * getError , english or chinese depend on request
 * @param {object} req - http request
 * @param {object} content - page content
 */
framework.prototype.getError = function(req,content){
    if(req.session.language==""||req.session.language==null){
        req.session.language = "en";
    }
    return error[req.session.language][content];
};
/**
 * build mongodb search conditon
 * @param {object} req - http request
 * @param {object} module - page module
 */
framework.prototype.buildSearch = function(req,module){
    var db_operation = system_cfg.getOperationByName(module.collection);
    var search = {};
    if(module.condition){
        search = module.condition;
    }
    if(req.query.querydata){
        var data = new RegExp(req.query.querydata+".*");
        var Attr = db_operation.getAttrs();
        var SearchArray = new Array();
        for(var i=0; i<Attr.length; i++){
            var tmp = {};
            tmp[Attr[i]] = data;
            SearchArray.push(tmp);
        }
        SearchArray.push({"id":data});
        search = {'$or': SearchArray};
    }
    return search;
}
/**
 * buildColumns
 * @param {object} req - http request
 * @param {object} module - page module
 */
framework.prototype.buildColumns = function(req,module){
    var db_operation = system_cfg.getOperationByName(module.collection);
    var columns = "id";
    var Attr = db_operation.getAttrs();
    for(var i=0; i<Attr.length; i++){
        columns +=" " + Attr[i];
    }
    return columns;
}
/**
 * buildPage for page table
 * @param {object} req - http request
 * @param {object} module - page module
 */
framework.prototype.buildPage = function(req){
    var page={limit:10,num:1};
    if(req.query.p>0){
        page['num']=req.query.p<1?1:req.query.p;
    }
    return page;
}
/**
 * build mongodb search conditon
 * @param {object} req - http request
 * @param {object} module - page module
 */
framework.prototype.getCondition = function(req,module){
    var condition = {
        search:this.buildSearch(req,module),
        columns:this.buildColumns(req,module),
        page:this.buildPage(req)
    };
    return condition;
}

/**
 * return html page
 * @param {object} req - http request
 * @param {object} res - http response
 * @param {object} module - page module
 */
framework.prototype.get = function(req, res,module){
    //console.log(module.collection);
    system_cfg.getOperationByNameEx(req, res,module.collection,function(err,redir,db_operation){
       if(redir){
            res.redirect(redir);//重定向
       } else{
           var condition = framework.prototype.getCondition(req,module);
           var _UIData = framework.prototype.getUIData(req,module.menu,module.content);
           //console.log(_UIData.Nav_head.menu_item_links);
           db_operation.getPagination(condition,function(err, pageCount, list){
               //console.log(db_operation.getAttrs());
               condition.page['pageCount']=pageCount;
               condition.page['size']=list.length;
               condition.page['numberOf']=pageCount>5?5:pageCount;
               res.render(module.ejs, {
                   title: module.name,
                   nav_head: _UIData.Nav_head,
                   nav_left:_UIData.Nav_left,
                   nav_foot:_UIData.Nav_foot,
                   content:_UIData.Content,
                   data:module.data,
                   model:db_operation.getAttrs(),
                   widget:module.widget,
                   head_active:module.head_active,
                   left_active:module.left_active,//指示活动标签
                   List:list,
                   page:condition.page
               });
           });
       }
    });
};

/**
 * return html page of content part
 * @param {object} req - http request
 * @param {object} res - http response
 * @param {object} module - page module
 */

framework.prototype.get_content = function(req, res,module){
    system_cfg.getOperationByNameEx(req, res,module.collection,function(err,redir,db_operation){
        if(redir){
            res.redirect(redir);//重定向
        } else{
            var condition = framework.prototype.getCondition(req,module);
            var _UIData = framework.prototype.getUIData(req,module.menu,module.content);
            db_operation.getPagination(condition,function(err, pageCount, list){
                //console.log(list);
                condition.page['pageCount']=pageCount;
                condition.page['size']=list.length;
                condition.page['numberOf']=pageCount>5?5:pageCount;
                res.render(module.ejs4content, {
                    content:_UIData.Content,
                    check_box:module.check_box,
                    List:list,
                    page:condition.page
                });
            });
        }
    });
};

/**
 * return db operation
 * @param {object} req - http request
 * @param {object} res - http response
 * @param {object} collection - collection
 * @param {function} callback - callback function
 */
framework.prototype.get_db_operation = function(req, res,collection,callback){
    system_cfg.getOperationByNameEx(req, res,collection,function(err,redir,db_operation){
        callback(err,redir,db_operation);
    });
};

/**
 * render interface
 * @param {object} req - http request
 * @param {object} res - http response
 * @param {object} module - page module
 * @param {object} _UIData - navigation 、 foot , UIData
 * @param {object} condition - search condition
 * @param {object} list - list
 * @param {object} db_operation - db operation
 * @param {object} addition - page special part
 */
framework.prototype.render = function(req, res,module,_UIData,condition,list,db_operation,addition){
    res.render(module.ejs, {
        title: module.name,
        nav_head: _UIData.Nav_head,
        nav_left:_UIData.Nav_left,
        nav_foot:_UIData.Nav_foot,
        content:_UIData.Content,
        data:module.data,
        model:db_operation.getAttrs(),
        widget:module.widget,
        head_active:module.head_active,
        left_active:module.left_active,//指示活动标签
        List:list,
        addition:addition,
        page:condition.page
    });
};

/**
 * common db add data operation
 * @param {object} req - http request
 * @param {object} res - http response
 * @param {object} module - module
 */
framework.prototype.do_add = function(req, res,module){
    var db_operation = system_cfg.getOperationByName(module.collection);
    var instance = {};
    for(var i=0; i<db_operation.attrArray.length; i++){
        console.log(db_operation.attrArray[i]);
        console.log(req.body[db_operation.attrArray[i]]);
        if(req.body.hasOwnProperty(db_operation.attrArray[i])){
            instance[db_operation.attrArray[i]] = req.body[db_operation.attrArray[i]];
        }
    }
    //console.log(instance);
    db_operation.save(instance,function(err) {
        if(err!=null) {
            return res.render("_main_/error",{message:"modify "+module.name+" Error",error:err});
        }
        else{
            return res.render("_main_/info",{info:"suceess"});
        }
    });
};

/**
 * common db modify data operation
 * @param {object} req - http request
 * @param {object} res - http response
 * @param {object} module - module
 */
framework.prototype.do_modify = function(req, res,module){
    var db_operation = system_cfg.getOperationByName(module.collection);
    var instance = {};
    for(var i=0; i<db_operation.attrArray.length; i++){
        if(req.body.hasOwnProperty(db_operation.attrArray[i])){
            instance[db_operation.attrArray[i]] = req.body[db_operation.attrArray[i]];
        }
    }
    //console.log(req.body.id);
    //console.log("do_modify:"+JSON.stringify(instance));
    db_operation.modify(req.body.id,instance,function(err){
        if(err!=null) {
            return res.render("_main_/error",{message:"modify "+module.name+" Error",error:err});
        }
        else{
            return res.render("_main_/info",{info:"suceess"});
        }
    });
};

/**
 * common db delete data operation
 * @param {object} req - http request
 * @param {object} res - http response
 * @param {object} module - module
 */
framework.prototype.do_delete = function(req, res,module){
    var db_operation = system_cfg.getOperationByName(module.collection);
    db_operation.remove(req.body.id,function(err,docs) {
        if(err!=null) {
            return res.render("_main_/error",{message:"modify "+module.name+" Error",error:err});
        }else{
            return res.render("_main_/info",{info:"suceess"});
        }
    });
};

//export module
module.exports = framework;