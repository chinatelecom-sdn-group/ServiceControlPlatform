/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements Session Instance mongoose schema
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
var mongoose = require('mongoose');
var subscriber = require('./subscriber');
var subscriber_group = require('./subscriber_group');
var service_package = require('./service_package');
var service_template = require('./service_template');
var policy_group = require('./policy_group');
var policy_entry = require('./policy_entry');

var PolicySchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Type: { type: String, required: true },
    Priority: { type: Number, required: true },
    Content: { type: String, required: true },
    Description: {type: String, default:""}
});
// define new schema for mongodb
var SessionInstanceSchema = new mongoose.Schema({
        PMInstanceID: { type: String, required: true, index: { unique: true }},
        AppType: { type: String, required: true },
        ProjectID: { type: String},
        ProjectName: { type: String, required: true},
        ProjectMasterID: { type: String},
        HeadHex: { type: String,default:"-"},//头标识
        IPAddress: { type: String,default:"-" },//账户标识
        AccountName: { type: String,default:"-" },//账户标识
        AccountType: { type: String, required: true},//账户类型：normal、virtual
        SessionType: { type: String, required: true},//账户类型：master、slave
        ServiceType: { type: String, required: true},//账户类型：SCM、PFM
        SubscriberGroupID: { type: String, required: true},
        SubscriberGroupName: { type: String, required: true},
        SubscriberID: { type: String, required: true},
        ServicePackageIDList: { type: [String], required: true },
        ServicePackageNameList: { type: [String], required: true },
        PolicyGroupIDList: { type: [String], required: true },
        PolicyGroupNameList: { type: [String], required: true },
        PolicyList: { type: [PolicySchema], required: true },
        Context:{ type: {
            PortInfo: {
                Inport: { type: String },
                Export: { type: String }
            },
            HostList: { type: [String] },
            SwithList:{
                host: { type: String },
                ports: { type: [String] }
            },
            EffectPolicy:{type:[PolicySchema]}
        }, required: true }
});
//export schema
module.exports = SessionInstanceSchema;;