/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements Flow Policy mongoose schema
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var mongoose = require('mongoose');

// define new schema for mongodb
var FlowPolicySchema = new mongoose.Schema({
    _id: { type: String, required: true, index: { unique: true } },
    PolicyID: { type: String, required: true },
    srv_dev: { type: String, required: true },
    fl_tbl_id: {type: String, required: true},
    encap_type: {type: String, required: true},
    encap_val: {type: String, required: true}
});
//export FlowPolicySchema
module.exports = FlowPolicySchema;