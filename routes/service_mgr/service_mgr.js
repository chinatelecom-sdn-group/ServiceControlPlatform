/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements service package management
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var Navigation = {
    "zh-cn" : {
        menu_head : "业务管理",
        menu_items : ["业务套餐","业务模板"],
        menu_item_links:["/service_package","/service_template"]
    },
    "en" : {
        menu_head : "Service",
        menu_items : ["Service Package","Service Template"],
        menu_item_links:["/service_package","/service_template"]
    }
};

module.exports = Navigation;