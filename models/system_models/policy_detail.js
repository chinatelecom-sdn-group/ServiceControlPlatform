/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements policy detail mongoose schema
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

var PolicySchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Type: { type: String, required: true },
    Priority: { type: Number, required: true },
    Content: { type: String, required: true },
    Description: {type: String, default:""}
});
// define
var PolicyDetailSchema = new mongoose.Schema({
    _id: { type: String, required: true, index: { unique: true } },
    '5tuple_v4': { type: {src_net:String,src_port:String,protocol:String,dst_net:String,dst_port:String}, required: true },
    PolicyList: { type: [PolicySchema], required: true },
    Status: { type: String, required: true }
});
//建立db存取方法
module.exports = PolicyDetailSchema;