/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements index page
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

/* GET home page. */
var framework = require('./framework');
var user_collection = require('../system_config/user_config').module.collection;
var system_cfg = require('../../models/db/system_cfg');
var _framework = new framework();
//menu language config
var Content = {
    "zh-cn" : {
        menu_head : "管理",
        menu_items : ["虚拟机管理","虚拟网络管理","策略管理","用户管理","服务器管理","帮助"],
        menu_item_links:["#","#","#","#","#","#"],
        addbutton:"增加",
        delbutton:"删除"
    },
    "en" : {
        menu_head : "Management",
        menu_items : ["VM Management","VNet Management","Policy Management","Subscriber Management","Service Management","Help"],
        menu_item_links:["#","#","#","#","#","#"],
        addbutton:"增加",
        delbutton:"删除"
    }
};

/**
 * @description redirect to index (project_config)
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.index = function(req, res){
    res.redirect('/project_config');
    //res.render('_main_/index', {content:{ title: 'login' },nav_head:{}});
};

/**
 * @description return login page
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.login = function(req, res){
    res.render('_main_/login', { title: 'login' });
};

/**
 * @description clean user session and redirect to index
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.logout = function(req, res){
    req.session.user=null;
    res.redirect('/');
};

/**
 * @description clean user session and redirect to index
 * @param {object} req - http request
 * @param {object} res - http response
 */
exports.dologin = function(req, res){
    system_cfg.getOperationByNameEx(req, res,user_collection,function(err,redir,db_operation){
        if(redir){
            res.redirect(redir);//重定向
        } else{
            db_operation.findOne({name:req.body.username}, function(err, user) {
                console.log(user);
                if(!user) {
                    req.session.error = _framework.getError(req,"user not exist");
                    return res.redirect('/');
                }
                if(user.password != req.body.password) {
                    req.session.error = _framework.getError(req,"wrong password");
                    return res.redirect('/');
                }
                req.session.userid = user._id;
                req.session.user = user.name;
                req.session.language = req.body.language;
                res.redirect('/index');
                console.log(user);
            });
        }
    });
};
