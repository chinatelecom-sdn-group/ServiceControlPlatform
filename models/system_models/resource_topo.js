/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements Resource Topology mongoose schema
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

/**
 * Created by jaydom on 2015/2/2.
 */
var mongoose = require('mongoose');

// define new schema for mongodb
var model_vm = new mongoose.Schema({
    name:String,
    link_id:String,
    type:String,
    pty:String,
    ovs_ports:[{
        name:String,
        outway:String,
        port_no:Number
    }],
    mgr_port:{
        name:String,
        outway:String,
        port_no:Number
    }
});

// define new schema for mongodb
// topo - define vms and switchs on a host 
var model_topo = new mongoose.Schema({
    name: { type: String, required: true, index: { unique: true } },
    link_id:{ type: String },
    ip:{ type: String },
    pty1: { type: String },
    pty2: { type: String },
    vm: {
        type: [model_vm] },//可选
    switch:{
        type:{
            mac:String,
            name:String,
            link_id:String,
            int_ports:[String],
            phy_ports:[
                {
                    name:String,
                    re_mac:String,
                    port_no:Number
                }
            ]
        }, required: true
    }
});

//export model_topo
module.exports = model_topo;