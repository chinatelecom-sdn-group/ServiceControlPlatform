/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements Project mongoose schema
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
var ProjectSchema = new mongoose.Schema({
    Name: { type: String, required: true, index: { unique: true } },
    Description:{ type: String, default: ""},
    SubscriberGroupList: { type: [{ _id: String, Name: String }], required: true },
    ServicePackageList: { type: [{ _id: String, Name: String }], required: true },
    State:{ type: String, default: "InActive"},//InActive,Active,Creating,Deleting
    MasterId:{type:String,default: ""}
});
//export schema
module.exports = ProjectSchema;