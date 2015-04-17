/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements Subscriber mongoose schema
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
// define new schema for mongodb
var SubscriberSchema = new mongoose.Schema({
    Account: { type: String, required: true, index: { unique: true } },
    IPAddress: { type: String, required: true },
    AccessType: { type: String ,required: true},
    AccessBandwidth: { type: String,default:"" },
    SessionType: { type: String,default:"" },
    AssignedAddressType: { type: String,default:"" },
    IPAddressType: { type: String,default:"" },
    ServiceType: { type: String,default:"" },
    ServiceBundleName: { type: String,default:"" },
    ServiceProvider: { type: String,default:"" },
    Location: { type: String,default:"" }
});
//export schema
module.exports = SubscriberSchema;