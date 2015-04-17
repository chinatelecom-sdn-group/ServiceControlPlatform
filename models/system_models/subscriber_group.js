/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements Subscriber Group mongoose schema
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
//mongoose.connect(settings.db_url);

// define new schema for mongodb
var SubscriberGroupSchema = new mongoose.Schema({
    Name: { type: String, required: true, index: { unique: true } },
    Type:{ type: String, required: true },
    ServiceType:{ type: String, required: true },
    ServiceProvider:{ type: String, required: true },
    Company:{ type: String, required: true },
    Location:{ type: String, required: true },
    GroupDescription:{ type: String, default:"" },
    SubscriberListNum:{ type: Number, default:"" },
    SubscriberList: { type: [{ _id: String, Name: String }], required: true },
    Description: {type: String, require: true}
});
//export schema
module.exports = SubscriberGroupSchema;