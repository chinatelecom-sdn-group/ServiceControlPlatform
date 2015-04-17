/*
 * Copyright (c) 2015 GuangZhou Research Institute of China Telecom. and others.  All rights reserved.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v1.0 which accompanies this distribution,
 * and is available at http://www.eclipse.org/legal/epl-v10.html
 */
/**
 * This model implements collecting flow  through ssh
 * <p/>
 *
 * @author Qianfeng chen (chinatelecom.sdn.group@gmail.com)
 * @version 0.1
 *          <p/>
 * @since 2015-03-23
 */

/**
 * Created by jaydom on 2015/2/10.
 */
var _ = require('underscore');
var process = require("child_process");
var stately = require("stately.js");
var Connection = require('ssh2');
//parse PFA table regex
var table_regex = {
    total:/#{8}\s*[\w]+\s*#{9}\s*PFA:[\s\w#=:]+PFA:[\s\w\[\]\(\)#,]+#{26}/g,
    fields: /#{8}\s*([\w]+)\s*#{9}\s*PFA:\s*SUMMARY#\s*ID=(\d+)\s*TYPE=(\w+)\s*SIZE=(\d+)\s*PFA:[\s\w\[\]\(\)#,]+#{26}/
};
//parse PFA flow regex
var flow_regex = {
    total:/-{26}[\w\s:#=:\[\],-]+?-{26}/g,//g才会匹配多个 ?最短匹配
    fields:/\s*PFA: SUMMARY# COUNT=(\d+) TIMEOUT=(\d+) KEY_LEN=(\d+)Bytes\s*PFA: KEY# (\w+)\s*/,
    actions:{
        total:/PFA: ACTION# TYPE:\s*([\w_]+)\s*Options: \[([\w=,_-]+)\]\s*/g,
        NORMAL:/PFA: ACTION# TYPE:\s*([\w_]+)\s*Options: \[([\w=,_-]+)\]\s*/,
        INST_TEMPLATE:{
            regex:/offset=(\d+),template=(.+)/,
            func:function(array){
                var Options = {
                    offset:array[1],
                    template:array[2]
                };
                return Options;
            }
        },
        REMOVE_TEMPLATE:{
            regex:/template=(.+)/,
            func:function(array){
                var Options = {
                    template:array[1]
                };
                return Options;
            }
        },
        GOTO_TABLE:{
            regex:/id=(\d+),byteoffset=(\d+),nb_field=(\d+)/,
            func:function(array){
                var Options = {
                    id:array[1],
                    byteoffset:array[2],
                    nb_field:array[3]
                };
                return Options;
            }
        },
        OUTPUT:{
            regex:/port=(\d+),metaoffset=(\d+),len=(\d+),pktoffset=(\d+)/,
            func:function(array){
                var Options = {
                    port:array[1],
                    metaoffset:array[2],
                    len:array[3],
                    pktoffset:array[4]
                };
                return Options;
            }
        }
    }
};
/**
 * parse PFA Template string
 * @param {string} date - Template string
 */
function parseTemplate(date){
    console.log("parseTemplate");
    //to do
}
/**
 * parse PFA table string
 * @param {string} date - Table string
 */
function parseTable(data){
    var arrayTable = [];
    var szTables = data.match(table_regex.total);
    if(szTables!=null){
        for(var i=0; i<szTables.length; i++){
            var szTable = szTables[i];
            var table = table_regex.fields.exec(szTable);
            if(table.length>=5){
                var table_json = {
                    name:table[1],
                    id:table[2],
                    type:table[3],
                    size:table[4],
                    flow:[]
                };
                arrayTable.push(table_json);
            }else{
                console.log("[error]");
                console.log(table);
            }
        }
    }else{
        console.log("[parseTable:error]");
        console.log(data);
    }
    return arrayTable;
}

/**
 * parse PFA table string
 * @param {string} date - Flow entry String
 */
function parseFlowEntry(data){
    //console.log(data);
    var arrayFlow = [];
    var szFlows = data.match(flow_regex.total);
    if(szFlows!=null){
        for(var i=0; i<szFlows.length; i++){
            var szFlow = szFlows[i];
            var flow = flow_regex.fields.exec(szFlow);
            if(flow==null){
                console.log("[parseFlowEntry error]parse flow entry");
                console.log(szFlow);
            }else if(flow.length>=5){
                var flow_json = {
                    count:flow[1],
                    timeout:flow[2],
                    key_length:flow[3],
                    key:flow[4],
                    actions:parseFlowEntryAction(szFlow)
                };
                arrayFlow.push(flow_json);
            }else{
                console.log("[parseFlowEntryerror]parse flow entry:length too small");
                console.log(flow);
            }
        }
    }else if(data.indexOf("APP: no flow in this table")>0){
        //to do nothing
        console.log("[parseFlowEntry error]no flow in this table");
    }else if(data.indexOf("APP: get table information failed")>0){
        console.log("[parseFlowEntry error]APP: get table information failed");
    }else{
        console.log("[parseFlowEntry fatal error]match flow entry");
        console.log(data);
    }
    //console.log(JSON.stringify(arrayFlow, null, 4));
    return arrayFlow;
}
/**
 * parse PFA action of Flow entry string
 * @param {string} date - action of Flow entry  String
 */
function parseFlowEntryAction(szFlow){
    //再匹配action
    var arrayAction = [];
    var actions = szFlow.match(flow_regex.actions.total);
    if(actions!=null){
        for(var j=0; j<actions.length; j++){
            var szAction = actions[j];
            var action = flow_regex.actions.NORMAL.exec(szAction);
            if(action!=null){
                if(flow_regex.actions.hasOwnProperty(action[1])){
                    var actionOption = flow_regex.actions[action[1]].regex.exec(action[2]);
                    if(actionOption!=null){
                        var action_json = {
                            name:action[1],
                            options:action[2],
                            detail:flow_regex.actions[action[1]].func(actionOption)
                        };
                        arrayAction.push(action_json);
                    }else{
                        console.log("[parseFlowEntryAction error]parse action option");
                        console.log(action[2]);
                    }
                }else{
                    console.log("[parseFlowEntryAction error]unknown action type:"+action[1]);
                }
            }else{
                console.log("[parseFlowEntryAction error]parse action normal");
                console.log(szAction);
            }
        }
    }else {
        console.log("[parseFlowEntryAction error]match action normal");
        console.log(szFlow);
    }
    return arrayAction;
}

/**
 * collect PFA flow entry by ssh
 * @param {string} host - action of Flow entry  String
 * @param {function}callback - callback
 */
function collect_pfs_flow_entry(host,callback){
    var res_cache = "";
    var cur_table = 0;
    var array_table = [];
    var shell_info = "";
    var ssh = new Connection();
    var end = _.once(function () { ssh.end(); });
    var lastError = null;
    var ret = _.once(function () { console.log(JSON.stringify(array_table, null, 4)); callback(lastError,array_table)});
    var fsm = stately.machine({
        'Start':{
            'start': function(){
                //连接ssh
                ssh.connect({
                    host: host,
                    port: 22,
                    username: 'root',// defaut user , should be config by web
                    password: 'gsta123' // defaut passwork , should be config by web
                });
            },
            'res':function(stream,res){
                if(res.trim().lastIndexOf("#")==res.trim().length-1){
                    //console.log("[shell_info]{"+res.trim()+"}");
                    shell_info = res.trim();
                    return [this.ShowTemplate,this.ShowTemplate.req(stream)];//切换，并且执行请求
                }
            }
        },
        'ShowTemplate': {
            'req':function(stream){
                res_cache = "";
                stream.write("ovs-pfactl -c f -n 3 --proc-type=secondary -- get_all_encaps dpdk@dp\n");
                console.log("ovs-pfactl -c f -n 3 --proc-type=secondary -- get_all_encaps dpdk@dp");
            },
            'res':function(stream,res){
                console.log("[info]{"+res+"}");
                res_cache += res;
                if(res.indexOf("APP: continue (c) or exit (e) :")==0){
                    return [this.ExitShowTemplate,this.ExitShowTemplate.req(stream)];//切换，并且执行请求
                }else if(res.indexOf(shell_info)>=0){
                    //处理响应消息
                    parseTemplate(res_cache);
                    return [this.ShowTable,this.ShowTable.req(stream)];//切换，并且执行请求
                }
            }
        },
        'ExitShowTemplate': {
            'req':function(stream){
                stream.write("e\n");
            },
            'res':function(stream,res){
                res_cache += res;
                if(res.indexOf("APP: continue (c) or exit (e) :")==0){
                    return [this.ExitShowTemplate,this.ExitShowTemplate.req(stream)];//切换，并且执行请求
                }else if(res.indexOf(shell_info)>=0){
                    //处理响应消息
                    parseTemplate(res_cache);
                    return [this.ShowTable,this.ShowTable.req(stream)];//切换，并且执行请求
                }
            }
        },
        'ShowTable': {
            'req':function(stream){
                res_cache = "";
                stream.write("ovs-pfactl -c f -n 3 --proc-type=secondary -- dump-tables dpdk@dp\n");
                console.log("ovs-pfactl -c f -n 3 --proc-type=secondary -- dump-tables dpdk@dp");
                return this.ShowTable;
            },
            'res':function(stream,res){
                // console.log(res);
                if(!(res.trim().indexOf("EAL")==0)){
                    res_cache += res;
                }
                if(res.indexOf("APP: continue (c) or exit (e) :")==0){
                    return [this.ExitShowTable,this.ExitShowTable.req(stream)];//切换，并且执行请求
                }else if(res.indexOf(shell_info)>=0){
                    //处理响应消息
                    array_table = parseTable(res_cache);
                    if(array_table.length>0){
                        return [this.ShowTableFlowEntry,this.ShowTableFlowEntry.req(stream)];//切换，并且执行请求
                    }else{
                        return [this.ExitCollect,this.ExitCollect.req(stream)];//切换，并且执行请求
                    }
                }
            }
        },
        'ExitShowTable': {
            'req':function(stream){
                stream.write("e\n");
            },
            'res':function(stream,res){
                res_cache += res;
                if(res.indexOf("APP: continue (c) or exit (e) :")==0){
                    return [this.ExitShowTable,this.ExitShowTable.req(stream)];//切换，并且执行请求
                }else if(res.indexOf(shell_info)>=0){
                    //处理响应消息
                    array_table = parseTable(res_cache);
                    if(array_table.length>0){
                        return [this.ShowTableFlowEntry,this.ShowTableFlowEntry.req(stream)];//切换，并且执行请求
                    }else{
                        return [this.ExitCollect,this.ExitCollect.req(stream)];//切换，并且执行请求
                    }
                }
            }
        },
        'ShowTableFlowEntry': {
            'req':function(stream){
                res_cache = "";
                var table = array_table[cur_table];
                stream.write("ovs-pfactl -c f -n 3 --proc-type=secondary -- dump-flows dpdk@dp tid="+table.name+"\n");
                console.log("ovs-pfactl -c f -n 3 --proc-type=secondary -- dump-flows dpdk@dp tid="+table.name+"");
            },
            'res':function(stream,res){
                if(!(res.trim().indexOf("EAL")==0)){
                    res_cache += res;
                }
                if(res.indexOf("APP: continue (c) or exit (e) :")==0){
                    return [this.ExitShowTableFlowEntry,this.ExitShowTableFlowEntry.req(stream)];//切换，并且执行请求
                }else if(res.indexOf(shell_info)>=0){
                    //处理响应消息
                    array_table[cur_table].flow = parseFlowEntry(res_cache);
                    cur_table += 1;
                    //return [this.ExitCollect,this.ExitCollect.req(stream)];//切换，并且执行请求
                    if(cur_table<array_table.length){
                        return [this.ShowTableFlowEntry,this.ShowTableFlowEntry.req(stream)];//切换，并且执行请求
                    }else{
                        return [this.ExitCollect,this.ExitCollect.req(stream)];//切换，并且执行请求
                    }
                }
            }
        },
        'ExitShowTableFlowEntry': {
            'req':function(stream){
                stream.write("e\n");
            },
            'res':function(stream,res){
                res_cache += res;
                if(res.indexOf("APP: continue (c) or exit (e) :")==0){
                    return [this.ExitShowTableFlowEntry,this.ExitShowTableFlowEntry.req(stream)];//切换，并且执行请求
                }else if(res.indexOf(shell_info)>=0){
                    //处理响应消息
                    array_table[cur_table].flow = parseFlowEntry(res_cache);
                    cur_table += 1;
                    //return [this.ExitCollect,this.ExitCollect.req(stream)];//切换，并且执行请求
                    if(cur_table<array_table.length){
                        return [this.ShowTableFlowEntry,this.ShowTableFlowEntry.req(stream)];//切换，并且执行请求
                    }else{
                        return [this.ExitCollect,this.ExitCollect.req(stream)];//切换，并且执行请求
                    }
                }
            }
        },
        'ExitCollect': {
            'req':function(stream){
                end();
            },
            'res':function(stream,res){
                console.log("[ExitCollect]"+res);
            }
        }
    }).bind(function (event, oldState, newState) {

        var transition = oldState + ' => ' + newState;

        switch (transition) {
            /*
             ...
             case 'STOPPED => PLAYING':
             case 'PLAYING => PAUSED':
             ...
             */
            default:
                if(oldState!=newState){
                    console.log("[debug]"+oldState+"=>"+newState);
                    //fsm.req(stream);
                }
                //console.log(transition);
                break;
        }
    });

    ssh.on('ready', function() {
        ssh.shell(function(error, stream) {
            if (error) {
                lastError = error;
                console.log(error);
                return;
            }
            //callback
            stream.on('data', function (data) {
                fsm.res(stream,data.toString());
            });
            stream.on('exit',function(){
                console.log("exit");
            });
        });
    });
    ssh.on('error', function (error) {
        lastError = error;
        end();
        ret();
    });
    ssh.on('end', function () {
        console.log("end");
        ret();
    });
    ssh.on('close', function () {
        console.log("close");
        ret();
    });
//启动状态机
    fsm.start();
}
//export function
exports.collect= collect_pfs_flow_entry;