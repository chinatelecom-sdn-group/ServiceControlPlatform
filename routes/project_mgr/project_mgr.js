/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements project management main info
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

var Navigation = {
    "zh-cn" : {
        menu_head : "项目管理",
        menu_items : ["项目","会话监控","流表信息"],
        menu_item_links:["/project_config","/session_instance","/policy_detail"]
    },
    "en" : {
        menu_head : "Project",
        menu_items : ["Project","Session Instance","Policy Detail"],
        menu_item_links:["/project_config","/session_instance","/policy_detail"]
    }
};

module.exports = Navigation;