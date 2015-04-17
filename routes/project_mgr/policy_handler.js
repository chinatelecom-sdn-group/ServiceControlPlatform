/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements handle policy （eg.phy_path、logic_path）to json data
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

/**
 * Created by jaydom on 2015/1/28.
 */
var system_cfg = require('../../models/db/system_cfg');
var monitor_entry = require('../../models/system_models/monitor_entry');
function handle_head_template_policy(policy,instance,resource_list){
    //var policy_content = JSON.parse(policy.Content);
    var template_policy = JSON.parse(policy.Content);
    var template_head = {
        ProjectID:instance.ProjectID,//指示这个head属于哪个project产生的
        Name:policy.Name,
        Offset:template_policy.offset,
        Head:policy.Content,
        HeadHex:template_policy.head
    };
    var index = resource_list.TemplateHeadList.length;
    resource_list.TemplateHeadList[index] = template_head;//用于保存
    instance.HeadHex = template_head.HeadHex;
    instance.ServiceType = "PFM";
}

function handle_phy_path_policy(policy,instance,resource_lis){
    var phy_path_policy = JSON.parse(policy.Content);
    var map = {};
    for(var i=0; i<phy_path_policy.edges.length; i++){
        var host = phy_path_policy.edges[i].host;
        var switchinstance = null;
        if(!map.hasOwnProperty(host)){
            var index = instance.Context.SwithList.length;
            map[host] = index;
            instance.Context.HostList.push(host);
            switchinstance = {
                host:host,
                ports:[]
            };
            instance.Context.SwithList.push(switchinstance);
        }else{
            var index = map[host];
            switchinstance = instance.Context.SwithList[index];
        }
        switchinstance.ports.push(phy_path_policy.edges[i].inport.port);
        switchinstance.ports.push(phy_path_policy.edges[i].outport.port);
        if(i==0){
            instance.Context.PortInfo["Inport"] = phy_path_policy.edges[i].inport.port;
        }else if(i==phy_path_policy.edges.length-1){
            instance.Context.PortInfo["Export"] = phy_path_policy.edges[i].outport.port;
        }
    }
}
function strToArray(content){
    var arrayService;
    if (content.indexOf(",") > 0) {
        arrayService = content.split(",");
    }
    else {
        arrayService = new Array(content);
    }
    return arrayService;
}
function select_host(host_select_list,host_list,index){
    var host = null;
    if(host_list.length>index){
        host = {
            name:host_list[index].name,
            vm:[],
            switch:host_list[index].switch
        };
        host_select_list.push(host);
    }
    return host;
}
function select_vm(host_select_list,host_list,index,vm_type){
    var vm = null;
    if(host_list.length>index){
        if(host_list[index].valid_vm_index.hasOwnProperty(vm_type)){
            if(host_list[index].valid_vm_index[vm_type].length>0){
                var vm_index = host_list[index].valid_vm_index[vm_type].pop();
                vm = host_list[index].vm[vm_index];
            }
        }
    }
    host_select_list[index].vm.push(vm);
    return vm;
}
function handle_pf_path_auto_policy_sort_host(host_topo_list){
    var temp1 = JSON.stringify(host_topo_list);
    var temp2 = JSON.parse(temp1);
    var host_list = new Array();
    for(var index=0; index<temp2.length; index++){
        var host = temp2[index];
        host_list[index] = {
            name:host.name,
            vm:host.vm,
            switch:host.switch,
            valid_vm_index:{}
        };
        for(var vm_index=0; vm_index<host.vm.length; vm_index++){
            var vm = host.vm[vm_index];
            if(vm.type!=undefined&&vm.type!=""){
               if(!host_list[index].valid_vm_index.hasOwnProperty(vm.type)){
                   host_list[index].valid_vm_index[vm.type] = new Array();
               }
               host_list[index].valid_vm_index[vm.type].push(vm_index);
            }
        }
    }
    return host_list;
}
function handle_pf_path_auto_policy_random_simple(host_list,service_list,str_services){
    var host_select_list = new Array();
    select_host(host_select_list,host_list,0);
    select_host(host_select_list,host_list,1);
    if(service_list.length==4){
        for(var index= 0,host_index=0; index<service_list.length; index+=2,host_index++){
            select_vm(host_select_list,host_list,host_index,service_list[index]);
            select_vm(host_select_list,host_list,host_index,service_list[index+1]);
        }
    }else if(service_list.length==3){
        if(str_services=="DPI,DPI,FW"){
            select_vm(host_select_list,host_list,0,"DPI");
            select_vm(host_select_list,host_list,1,"DPI")
            select_vm(host_select_list,host_list,1,"FW");
        }else if(str_services=="DPI,FW,FW"){
            select_vm(host_select_list,host_list,0,"DPI");
            select_vm(host_select_list,host_list,0,"FW");
            select_vm(host_select_list,host_list,1,"FW");
        }else if(str_services=="FW,FW,DPI"){
            select_vm(host_select_list,host_list,0,"DPI");
            select_vm(host_select_list,host_list,1,"FW");
            select_vm(host_select_list,host_list,1,"DPI");
        }else if(str_services=="FW,DPI,DPI"){
            select_vm(host_select_list,host_list,0,"FW");
            select_vm(host_select_list,host_list,0,"DPI");
            select_vm(host_select_list,host_list,1,"DPI");
        }else if(str_services=="FW,DPI,FW") {
            var two_vm_host_index = Math.floor(Math.random()*1+0);//运行两个vm的host的下标
            if(one_vm_host_index==0){
                select_vm(host_select_list,host_list,0,"FW");
                select_vm(host_select_list,host_list,0,"DPI");
                select_vm(host_select_list,host_list,1,"FW");
            }else{
                select_vm(host_select_list,host_list,0,"FW");
                select_vm(host_select_list,host_list,1,"DPI");
                select_vm(host_select_list,host_list,1,"FW");
            }
        }else if(str_services=="DPI,FW,DPI"){
            var two_vm_host_index = Math.floor(Math.random()*1+0);//运行两个vm的host的下标
            if(one_vm_host_index==0){
                select_vm(host_select_list,host_list,0,"DPI");
                select_vm(host_select_list,host_list,0,"FW");
                select_vm(host_select_list,host_list,1,"DPI");
            }else{
                select_vm(host_select_list,host_list,0,"DPI");
                select_vm(host_select_list,host_list,1,"FW");
                select_vm(host_select_list,host_list,1,"DPI");
            }
        }
    }else if(service_list.length==2){
        if(service_list[0]==service_list[1]){
            select_vm(host_select_list,host_list,0,service_list[0]);
            select_vm(host_select_list,host_list,1,service_list[1]);
        }else{
            var random = Math.floor(Math.random()*3+0);//运行两个vm的host的下标(0-2)
            //{ 2|0} { 0|2} {1|1}
            if(random==0){
                // 1 1|0
                select_vm(host_select_list,host_list,0,service_list[0]);
                select_vm(host_select_list,host_list,0,service_list[1]);
            }else if(random==1){
                select_vm(host_select_list,host_list,1,service_list[0]);
                select_vm(host_select_list,host_list,1,service_list[1]);
            }else{
                select_vm(host_select_list,host_list,0,service_list[0]);
                select_vm(host_select_list,host_list,1,service_list[1]);
            }
        }
    }else if(service_list.length==1){
        //{ 1|0} { 0|1}
        var random = Math.floor(Math.random()*1+0);//运行两个vm的host的下标(0-1)
        if(random==0){
            // 1 1|0
            select_vm(host_select_list,host_list,0,service_list[0]);
        }else {
            select_vm(host_select_list,host_list,1,service_list[0]);
        }
    }
    return host_select_list;
}
function handle_pf_path_auto_policy_select_vm(host_list,service_list){
    if(service_list.length>=4){
        if(service_list[0]!=service_list[1]&&service_list[0]==service_list[2]&&service_list[1]==service_list[3]){
            //全选
        }else {

        }
    }else if(service_list==3){

    }else if(service_list==2){

    }else if(service_list==1){

    }
}
function build_logic_port(port_no,type){
    var port = {
        port:port_no,
        type:type
    };
    return port;
}
function handle_pf_path_auto_policy_convert_path(host_select_list){
    var policy_content = {
        edges:[]
    };
    for(var host_index=0; host_index<host_select_list.length; host_index++){
        var port_list = new Array();
        var host = host_select_list[host_index];
        var host_port1 = 0;
        var host_port2 = 0;
        if(host.switch.phy_ports.length==0){
            continue;
        }else if(host.switch.phy_ports.length==1){
            host_port1 = host_port2 = host.switch.phy_ports[0].port_no;
        }else if(host.switch.phy_ports.length>=2){
            if(host.switch.phy_ports[0].name=="phyPort0"){
                host_port1 = host.switch.phy_ports[0].port_no;
                host_port2 = host.switch.phy_ports[1].port_no;
            }else if(host.switch.phy_ports[0].name=="phyPort1"){
                host_port1.inport = host.switch.phy_ports[1].port_no;
                host_port2.outport = host.switch.phy_ports[0].port_no;
            }else{
                host_port1.inport = host.switch.phy_ports[0].port_no;
                host_port1.outport = host.switch.phy_ports[1].port_no;
            }
        }
        port_list.push(build_logic_port(host_port1,"phy"));
        for(var vm_index=0; vm_index<host.vm.length; vm_index++){
            var vm = host.vm[vm_index];
            if(vm==null||vm==undefined){
                continue;
            }
            var vm_port1 = 0;
            var vm_port2 = 0;
            if(vm.ovs_ports.length==0){
                continue;
            }else if(vm.ovs_ports.length==1){
                vm_port1 = vm_port2 = vm.ovs_ports[0].port_no;
            }else if(vm.ovs_ports.length>=2){
                vm_port1 = vm.ovs_ports[0].port_no;
                vm_port2 = vm.ovs_ports[1].port_no;
            }
            port_list.push(build_logic_port(vm_port1,"vm"));//入口
            port_list.push(build_logic_port(vm_port2,"vm"));//出口
        }
        port_list.push(build_logic_port(host_port2,"phy"));
        //build line list
        for(var i=0; i<port_list.length; i+=2){
            var line = {
                host:host.name,
                inport:port_list[i],
                outport:port_list[i+1]
            }
            policy_content.edges.push(line);
        }
    }
    return JSON.stringify(policy_content);
}
function handle_pf_path_auto_policy(policy,instance,resource_lis){
    var service_list = strToArray(policy.Content);
    //sort host
    var host_list = handle_pf_path_auto_policy_sort_host(resource_lis.resource_topo);
    //select vm in host
    var host_select_list = handle_pf_path_auto_policy_random_simple(host_list,service_list,policy.Content);
    //convert phy path
    policy.Content = handle_pf_path_auto_policy_convert_path(host_select_list);
    //console.log(policy);
    return policy;
}
exports.handle = function(Policy,instance,resource_list){
    if(Policy.Type=="PFTemplate"){
        handle_head_template_policy(Policy,instance,resource_list);
    }else if(Policy.Type=="PFPhysicsPath"||Policy.Type=="PFPathManual"){
        handle_phy_path_policy(Policy,instance,resource_list);
    }else if(Policy.Type=="PFPathAuto"){
        //替换策略
        Policy =  handle_pf_path_auto_policy(Policy,instance,resource_list);
        Policy.Type = "PFPathManual";//转换为人工路径类型
        handle_phy_path_policy(Policy,instance,resource_list);
    }
    return Policy;
}