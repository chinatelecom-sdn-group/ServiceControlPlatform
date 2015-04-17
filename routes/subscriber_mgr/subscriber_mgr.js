/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements the subscriber management main info
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var Navigation = {
    "zh-cn" : {
        menu_head : "用户管理",
        menu_items : ["用户","用户组"],
        menu_item_links:["/subscriber_config","/subscriber_group_config"]
    },
    "en" : {
        menu_head : "Subscriber",
        menu_items : ["Subscriber","Subscriber Group"],
        menu_item_links:["/subscriber_config","/subscriber_group_config"]
    }
};

module.exports = Navigation;