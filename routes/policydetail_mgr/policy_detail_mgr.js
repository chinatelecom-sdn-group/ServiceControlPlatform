/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements policy detail main info
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var Navigation = {
    "zh-cn" : {
        menu_head : "策略信息",
        menu_items : ["策略信息","流表"],
        menu_item_links:["/policy_detail","/flow_policy"]
    },
    "en" : {
        menu_head : "Policy Detail",
        menu_items : ["Policy Detail","Policy Flow"],
        menu_item_links:["/policy_detail","/flow_policy"]
    }
};

module.exports = Navigation;