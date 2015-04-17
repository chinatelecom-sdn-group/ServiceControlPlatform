/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements Monitor Management main page
 * <p/>
 *
 * @author Boqi Mo (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

//language config
var Navigation = {
    "zh-cn" : {
        menu_head : "系统监控",
        menu_items : ["总体拓扑","总体拓扑(测试数据)","SC项目","PF项目","用户","变量"],
        menu_item_links:["/global_view","/global_view?test_data=1","/sc_project_view","/pf_project_view","/monitor_user","/monitor_variable"]
    },
    "en" : {
        menu_head : "Monitor",
        menu_items : ["Global View","Global View(test data)","SC Projects","PF Projects","User","Variable"],
        menu_item_links:["/global_view","/global_view?test_data=1","/sc_project_view","/pf_project_view","/monitor_user","/monitor_variable"]
    }
};

module.exports = Navigation;