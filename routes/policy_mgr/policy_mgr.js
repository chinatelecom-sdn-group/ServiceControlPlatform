/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements  policy management main info
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var Navigation = {
    "zh-cn" : {
        menu_head : "策略管理",
        menu_items : ["策略","策略组"],
        menu_item_links:["/policy_config","/policy_group_config"]
    },
    "en" : {
        menu_head : "Policy",
        menu_items : ["Policy","Policy Group"],
        menu_item_links:["/policy_config","/policy_group_config"]
    }
};

module.exports = Navigation;