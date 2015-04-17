/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
var system_cfg = {
    "mongodb": {
        "IP": "172.21.2.1",
        "Port": "27019",
        "ServiceControlPlatform": {
            "User": "lp",
            "Password": "lp"
        },
        "PolicyManagement": {
            "User": "PolicyManagement",
            "Password": "PolicyManagement"
        }
    },
    "opendaylight": {
        "IP": "172.21.2.6",
        "Port": "8080",
        "User": "admin",
        "Password": "admin"
    }
}
exports.system_cfg = system_cfg;