/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements modify the service package of subscriber
 * <p/>
 *
 * @author Boqi Mo (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */
var nodegrass = require('nodegrass');
exports.get = function(req, res){
    res.render("subscriber/subscriber.ejs",{});
};

exports.query_subscriber = function(req, res){
    console.log("++++++++++++++++++++query_subscriber"+req.connection.remoteAddress);
    var condition = "ip="+"60.176.142.3";
    //var condition = "ip="+req.connection.remoteAddress;
    var url = "http://172.21.2.1:3003/monitor_get_user_unlogin?&key=t8BExvtqDeb6lFokPV0f14&"+condition;
    console.log("[modify_subscriber]"+url);
    nodegrass.get(url,function(data,status,headers){
        if(data==null){
            res.json({"message": "not found"});
        }else{
            var subscriber = JSON.parse(data);
            res.json(subscriber);
        }
    },'utf8').on('error', function(e) {
        res.json({"message": "not found"});
    });
};

exports.modify_subscriber = function(req, res){
    console.log("++++++++++++++++++++modify_subscriber");
    var condition = "user="+req.body.user+"&"+"meal="+req.body.meal;
    var url = "http://172.21.2.1:3003/monitor_set_user_meal_unlogin?&key=t8BExvtqDeb6lFokPV0f14&"+condition;
    console.log("[modify_subscriber]"+url);
    nodegrass.get(url,function(data,status,headers){
        console.log(data);
        if(data==null){
            res.json({"message": "fail"});
        }else{
            var subscriber = JSON.parse(data);
            res.json(subscriber);
        }
    },'utf8').on('error', function(e) {
        res.json({"message": "fail"});
    });
};