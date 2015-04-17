/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements 
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var SessionStore = require("session-mongoose")(express);
var authentication = require('./routes/_main_/authentication');
var system_cfg = require('./models/db/system_cfg');
var store = new SessionStore({
    url: system_cfg.get_scp_db_url(),
    interval: 60000
});

var routes = require('./routes/_main_/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//cookie
app.use(express.session({
    secret: "ServiceControlPlatformbyvoid",
    store: store,
    cookie: { maxAge: 9000000 }
}));
app.use(function (req, res, next) {
    res.locals.userid = req.session.userid;
    res.locals.user = req.session.user;
    res.locals.language = req.session.language;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if (err) res.locals.message = '<div class="alert alert-dismissable alert-danger">' + err + '</div>';
    next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);
//登陆
app.all('/', authentication.notAuthentication);
app.get('/', routes.login);
app.post('/', routes.dologin);
var basic_config = require('./routes/system_config/basic_config');
app.all('/basic_config', authentication.notAuthentication);
app.get('/basic_config', basic_config.get);
app.post('/basic_config', basic_config.do_modify);
//主页
app.all('/index', authentication.Authentication);
app.get('/index', routes.index);
//退出
app.get('/logout', routes.logout);
//system_models
var language_config = require('./routes/system_config/language_config');
app.all('/system_config', authentication.Authentication);
app.get('/system_config', language_config.get);
app.post('/system_config', language_config.do_modify);
app.all('/language_config', authentication.Authentication);
app.get('/language_config', language_config.get);
app.post('/language_config', language_config.do_modify);
var password_config = require('./routes/system_config/password_config');
app.all('/password_config', authentication.Authentication);
app.get('/password_config', password_config.get);
app.post('/password_config', password_config.do_modify);
var user_config = require('./routes/system_config/user_config');
app.all('/user_config', authentication.Authentication);
app.get('/user_config', user_config.get);
app.post('/user_config', user_config.do_add);
app.put('/user_config', user_config.do_modify);
app.delete('/user_config', user_config.do_delete);
//subscriber:subscriber 套餐定制
var subscriber = require('./routes/subscriber/subscriber');
app.get('/subscriber', subscriber.get);
app.get('/user', subscriber.get);
app.get('/query_subscriber', subscriber.query_subscriber);
app.post('/modify_subscriber', subscriber.modify_subscriber);
//subscriber:subscriber_config
var subscriber_config = require('./routes/subscriber_mgr/subscriber_config');
app.all('/subscriber_config', authentication.Authentication);
app.all('/subscriber_config/get_content', authentication.Authentication);
app.get('/subscriber_config', subscriber_config.get);
app.get('/subscriber_config/get_content', subscriber_config.get_content);
app.post('/subscriber_config', subscriber_config.do_add);
app.put('/subscriber_config', subscriber_config.do_modify);
app.delete('/subscriber_config', subscriber_config.do_delete);
//virtual_subscriber:virtual_subscriber_config
var virtual_subscriber_config = require('./routes/subscriber_mgr/virtual_subscriber_config');
app.all('/virtual_subscriber_config/get_content', authentication.Authentication);
app.get('/virtual_subscriber_config/get_content', virtual_subscriber_config.get_content);
//subscriber:subscriber_group_config
var subscriber_group_config = require('./routes/subscriber_mgr/subscriber_group_config');
app.all('/subscriber_group_config', authentication.Authentication);
app.all('/subscriber_group_config/get_content', authentication.Authentication);
app.get('/subscriber_group_config', subscriber_group_config.get);
app.get('/subscriber_group_config/get_content', subscriber_group_config.get_content);
app.post('/subscriber_group_config', subscriber_group_config.do_add);
app.put('/subscriber_group_config', subscriber_group_config.do_modify);
app.delete('/subscriber_group_config', subscriber_group_config.do_delete);
//service:service_package
var service_package = require('./routes/service_mgr/service_package');
app.all('/service_package', authentication.Authentication);
app.all('/service_package/get_content', authentication.Authentication);
app.get('/service_package', service_package.get);
app.get('/service_package/get_content', service_package.get_content);
app.post('/service_package', service_package.do_add);
app.put('/service_package', service_package.do_modify);
app.delete('/service_package', service_package.do_delete);
//service:service_template
var service_template = require('./routes/service_mgr/service_template');
app.all('/service_template', authentication.Authentication);
app.all('/service_template/get_content', authentication.Authentication);
app.get('/service_template', service_template.get);
app.get('/service_template/get_content', service_template.get_content);
app.post('/service_template', service_template.do_add);
app.put('/service_template', service_template.do_modify);
app.delete('/service_template', service_template.do_delete);
//policy:policy_config
var policy_config = require('./routes/policy_mgr/policy_config');
app.all('/policy_config', authentication.Authentication);
app.all('/policy_config/get_content', authentication.Authentication);
app.get('/policy_config', policy_config.get);
app.get('/policy_config/get_content', policy_config.get_content);
app.post('/policy_config', policy_config.do_add);
app.put('/policy_config', policy_config.do_modify);
app.delete('/policy_config', policy_config.do_delete);
//PolicyManagement:policy
var policy_detail = require('./routes/policydetail_mgr/policy_detail');
app.all('/policy_detail', authentication.Authentication);
app.get('/policy_detail', policy_detail.get);


var flow_policy = require('./routes/policydetail_mgr/flow_policy');
app.all('/flow_policy', authentication.Authentication);
app.all('/flow_policy/get_content', authentication.Authentication);
app.get('/flow_policy', flow_policy.get);
app.get('/flow_policy/get_content', flow_policy.get_content);

//monitor 2nd version
var global_view = require('./routes/monitor_mgr/global_view');
app.all('/global_view', authentication.Authentication);
app.get('/global_view', global_view.get);
app.get('/monitor_host_detail', authentication.Authentication);
app.get('/monitor_host_detail', global_view.get_host_info);
app.get('/monitor_host_history', authentication.Authentication);
app.get('/monitor_host_history', global_view.get_host_history);
app.get('/monitor_switch_detail', authentication.Authentication);
app.get('/monitor_switch_detail', global_view.get_switch_info);
app.get('/monitor_switch_history', authentication.Authentication);
app.get('/monitor_switch_history', global_view.get_switch_history);
app.get('/monitor_port_detail', authentication.Authentication);
app.get('/monitor_port_detail', global_view.get_port_info);
app.get('/monitor_port_history', authentication.Authentication);
app.get('/monitor_port_history', global_view.get_port_history);
var sc_project_view = require('./routes/monitor_mgr/sc_project_view');
app.all('/sc_project_view', authentication.Authentication);
app.get('/sc_project_view', sc_project_view.get);

var pf_project_view = require('./routes/monitor_mgr/pf_project_view');
app.get('/monitor_chain_data', pf_project_view.get_service_chain_data);//只有pf view才有
app.all('/pf_project_view', authentication.Authentication);
app.get('/pf_project_view', pf_project_view.get);
var chain_view = require('./routes/monitor_mgr/service_chain_view');
app.get('/monitor_chain_query_frame', authentication.Authentication);
app.get('/monitor_chain_query_frame', chain_view.get_chain_query_frame);
app.get('/monitor_chain_history', authentication.Authentication);
app.get('/monitor_chain_history', chain_view.get_chain_history);
app.get('/monitor_links_query_frame', authentication.Authentication);
app.get('/monitor_links_query_frame', chain_view.get_links_query_frame);
app.get('/monitor_links_history', authentication.Authentication);
app.get('/monitor_links_history', chain_view.get_links_history);
var tool_view=require('./routes/monitor_mgr/tool');
app.get('/monitor_user', authentication.Authentication);
app.get('/monitor_user', tool_view.get_online_user);
app.get('/monitor_get_user_meal', authentication.Authentication);
app.get('/monitor_get_user_meal', tool_view.get_user_meal);
app.get('/monitor_set_user_meal', authentication.Authentication);
app.get('/monitor_set_user_meal', tool_view.set_user_meal);
app.get('/monitor_variable', authentication.Authentication);
app.get('/monitor_variable', tool_view.get_variable);
app.get('/monitor_set variables', authentication.Authentication);
app.get('/monitor_set_variables', tool_view.set_variables);

//app.post('/monitor_change_user_status', tool_view.change_user_status);
//无登录验证，直接跨域访问接口
app.get('/monitor_get_user_unlogin', tool_view.get_user_unlogin);
app.get('/monitor_set_user_meal_unlogin', tool_view.set_user_meal_unlogin);



//policy:policy_group_config
var policy_group_config = require('./routes/policy_mgr/policy_group_config');
app.all('/policy_group_config', authentication.Authentication);
app.all('/policy_group_config/get_content', authentication.Authentication);
app.get('/policy_group_config', policy_group_config.get);
app.get('/policy_group_config/get_content', policy_group_config.get_content);
app.post('/policy_group_config', policy_group_config.do_add);
app.put('/policy_group_config', policy_group_config.do_modify);
app.delete('/policy_group_config', policy_group_config.do_delete);
//project:project_config
var project_config = require('./routes/project_mgr/project_config');
app.all('/project_config', authentication.Authentication);
app.all('/project_config/active', authentication.Authentication);
app.get('/project_config', project_config.get);
app.post('/project_config/active', project_config.do_active_or_inactive);
app.post('/project_config', project_config.do_add);
app.put('/project_config', project_config.do_modify);
app.delete('/project_config', project_config.do_delete);
//project_active
var project_active = require('./routes/project_mgr/project_active');
app.post('/scp_rpc_update_subscriber', project_active.rpc_update_subscriber_status);
//project:session_instance
var session_instance = require('./routes/project_mgr/session_instance');
app.all('/session_instance', authentication.Authentication);
app.get('/session_instance', session_instance.get);
app.delete('/session_instance', session_instance.do_delete);

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.render('_main_/error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.render('_main_/error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
