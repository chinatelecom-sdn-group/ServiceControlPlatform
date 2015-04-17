/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements the system config main page
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var Navigation = {
    "zh-cn" : {
        menu_head : "系统管理",
        menu_items : ["语言设置","密码设置","系统用户管理"],
        menu_item_links:["/language_config","/password_config","/user_config"]
    },
    "en" : {
        menu_head : "System Setting",
        menu_items : ["Language Setting","Password Setting","User Management"],
        menu_item_links:["/language_config","/password_config","/user_config"]
    }
};

module.exports = Navigation;