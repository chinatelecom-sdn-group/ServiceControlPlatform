var paper;
//var host_group=[];
var addjustting_view=0;
var moving_obj=0;
var base_mouse_x=0;
var base_mouse_y=0;
var host_list=[];
var phy_port_obj_list=[];
var small_text_list=[];
var pre_touming_obj;
var warning_kuang;
var lighting_obj;
var link_list=[];

var view_data_set=[];


function AddjustView(paper_handle,dx,dy,zoom_percent)
{
	var i=0;
	for(;i<view_data_set.length;i++)
	{
	    if(view_data_set[i].handle==paper_handle)
		{
		    break;
		}
	}
	if(i==view_data_set.length)
	 {
	   console.log("can;t find paper_handle");
	   return;
	 }
	
	var view_percent=view_data_set[i].paper_width/view_data_set[i].org_paper_width;
    view_data_set[i].now_view_x=view_data_set[i].now_view_x+view_percent*dx;
    view_data_set[i].now_view_y=view_data_set[i].now_view_y+view_percent*dy;

    view_data_set[i].paper_width=view_data_set[i].paper_width*zoom_percent/100;
    view_data_set[i].paper_height=view_data_set[i].paper_height*zoom_percent/100;

    view_percent=view_data_set[i].paper_width/view_data_set[i].org_paper_width;

    //为了适应缩放的时候以中心点为缩放
    view_data_set[i].now_view_x=view_data_set[i].now_view_x+view_data_set[i].paper_width/2 * (100-zoom_percent)/100;
    view_data_set[i].now_view_y=view_data_set[i].now_view_y+view_data_set[i].paper_height/2 * (100-zoom_percent)/100;
    paper_handle.setViewBox(view_data_set[i].now_view_x,   view_data_set[i].now_view_y,   view_data_set[i].paper_width,   view_data_set[i].paper_height,   false);

    for(var i=0;i<small_text_list.length;i++)//小于60显示比例的时候
    {
        if(view_percent<0.85)
        {
            small_text_list[i].show();
        }
        else
        {
            small_text_list[i].hide();
        }
    }
}


function enable_set_view(paper_handle)
{
    paper_handle.canvas.onmousedown=function(event)
    {
        if(moving_obj)
            return;
        base_mouse_x=event.screenX;
        base_mouse_y=event.screenY;
        addjustting_view=1;
        paper_handle.canvas.style.cursor="move";
    }
    paper_handle.canvas.onmousemove=function(event)
    {
        if(addjustting_view)
        {
            AddjustView(paper_handle,base_mouse_x-event.screenX,base_mouse_y-event.screenY,100);
            base_mouse_x=event.screenX;
            base_mouse_y=event.screenY;
        }
    }
    paper_handle.canvas.onmouseup=function()
    {
        addjustting_view=0;
        paper_handle.canvas.style.cursor="default";
    }
    
	
	function scroll_event(event)
    {
        var direct=0;
        event=event || window.event;
        var pct;
        if(event.wheelDelta)
        {pct=100-event.wheelDelta/12;}
        else if(event.deltaY)//Firefox
        {pct=100+event.deltaY/0.3;}
        AddjustView(paper_handle,0,0,pct);
    }
    
	paper_handle.canvas.onmousewheel=scroll_event;
	paper_handle.canvas.onwheel=scroll_event;
	
    paper_handle.canvas.onmouseenter=function()
    {
        document.onmousewheel=function(){return false;}
		document.onwheel=function(){return false;}
    }
    paper_handle.canvas.onmouseleave=function()
    {
        document.onmousewheel=function(){return true;}
		document.onwheel=function(){return true;}
    }
}


function enable_paper_clear_choosed_obj()
{
    warning_kuang=paper.circle(1, 1, 150).attr({stroke: "#111","stroke-dasharray":"- "}).hide();
    setInterval(function()
        {
            warning_kuang.animate({transform: "s1.2"}, 500,function(){warning_kuang.animate({transform: "s1"}, 500);});
        },
        1000);

    paper.canvas.onclick=function(e)
    {
        if(e.target.toString()=="[object SVGSVGElement]")
        {
            warning_kuang.hide();
            //paper.forEach(function (obj){obj.animate({ "fill-opacity": 1,"opacity": 1 },500);});
            paper.forEach(function (obj){
                if(obj.type=="rect"&&obj.attr("stroke")!="none"){
                    obj.animate({ "stroke":"none" },500);
                }
            });

            $('#id_statistics_view').animate({"opacity": 0}, 500,function()
                {
                    $("#id_statistics_view").html("<div class=\"panel panel-gsta-sm panel-default\"  style=\"margin: 10px;\">\
			             <div class=\"panel-body\"><center><img src=\"images/graph.png\" class=\"img-rounded\"><h4>请选择对象</h4></center></div></div>");
                    $('#id_statistics_view').animate({"opacity": 1},500);
                }
            );
			
            pre_touming_obj=null;
            lighting_obj="null";
        }

    }
}


function select_and_show(type,name,sw)
{
    var will_return=0;
	paper.forEach(function(obj){
	    if(will_return)
		    return;
		if(obj.data("name")==name)
		{
			if(type=="switch")
			{
				if(obj.data("type")=="ovs_bridge")
				{
					show_detail(obj,"/monitor_switch_detail");
					will_return=1;
				}
			}
			else if(type=="port"&&obj.data("sw_name")==sw)
			{
					show_detail(obj,"/monitor_port_detail");
					will_return=1;
			}
		}
	});
	if(!will_return)//找不到对象，但是这种port实际存在
	{
	    $.ajax({
        type:"get",
        url:"/monitor_port_detail?",
        data:{"name":name,"sw":sw},
        success:function(msg){
            $("#id_statistics_view").html(msg);
        },
        error:function(err){
            $("#id_statistics_view").html(err);
        }
        });
		pre_touming_obj.animate({ "stroke": "none" },500);
		pre_touming_obj=null;
	}
}


function show_detail(obj,url)
{
    if(obj==pre_touming_obj)
        return;
    //全部变灰
    paper.forEach(function (obj)
    {
		if(obj.type=="rect")
        {
            //obj.animate({ "fill-opacity": 0.2 },800);
            if(obj.attr("stroke")!="none")
            {
                obj.animate({ "stroke": "none" },100);
            }
        }
    });
    //选中对象闪动
    /*if(obj.attr("fill-opacity"))
     {
     obj.animate({"fill-opacity": 0.2}, 250,function(){this.animate({"fill-opacity": 1}, 250,function(){this.animate({"fill-opacity": 0.2}, 250,function(){this.animate({"fill-opacity": 1}, 250);});});});
     }
     if(obj.attr("opacity"))
     {
     obj.animate({"opacity": 0.2}, 250,function(){this.animate({"opacity": 1}, 250,function(){this.animate({"opacity": 0.2}, 250,function(){this.animate({"opacity": 1},250);});});});
     }
     obj.animate({"fill-opacity": 0.2}, 250,function(){this.animate({"fill-opacity": 1}, 250,function(){this.animate({"fill-opacity": 0.2}, 250);});});

     lighting_handle=setInterval(function(){
     obj.animate({"fill-opacity": 0.2}, 250,function(){this.animate({"fill-opacity": 1}, 250,function(){this.animate({"fill-opacity": 0.2}, 250,function(){this.animate({"fill-opacity": 1}, 250);});});});
     },750);*/

    /*function keep_lighting()
    {
        if(lighting_obj=="null")
        {return;}
        //lighting_obj.animate({"fill-opacity":0.2},400,function(){lighting_obj.animate({"fill-opacity":1},400,function(){keep_lighting();});});
        lighting_obj.animate({"stroke":"green","stroke-width":3},400,function(){lighting_obj.animate({"stroke":"black","stroke-width":3},400,function(){keep_lighting();});});
    }
    lighting_obj=obj;
    keep_lighting();*/
	obj.animate({"stroke":"green","stroke-width":5},600);


    //闪动虚线框框选
    /*if(obj.type=="path")
    {
        warning_kuang.hide()
    }
    else
    {
        var kuang_width;
        obj.attr("height")>obj.attr("width")? kuang_width=obj.attr("height")*0.5+20:kuang_width=obj.attr("width")*0.5+20;
        warning_kuang.attr({"cx":obj.attr("x")+obj.attr("width")/2,   "cy": obj.attr("y")+obj.attr("height")/2,    "r":kuang_width  });
        //warning_kuang.show().toFront();
    }*/
	
	////细节页面呈现,渐变
	$("#id_statistics_view").animate({"opacity": 0}, 500,function()
	{   
		$("#id_statistics_view").html("<div class=\"panel panel-gsta-sm panel-default\"  style=\"margin: 10px;\">\
                        <div class=\"panel-body\"><center><img src=\"images/graph.png\" class=\"img-rounded\"><h4>读取中......</h4></center></div></div>");//清空
		var data_to_send;
		if(obj.data("sw_name"))//是port对象
		{
		    data_to_send={"name":obj.data("name"),"sw":obj.data("sw_name")};
		}
		else
		{
		     data_to_send={"name":obj.data("name")};
		}
			$.ajax({
				type:"get",
				url:url,
				data:data_to_send,
				success:function(msg){
					$("#id_statistics_view").html(msg);
				},
				error:function(err){
					$("#id_statistics_view").html("<div class=\"panel panel-gsta-sm panel-default\"  style=\"margin: 10px;\">\
							<div class=\"panel-body\"><center><img src=\"images/graph.png\" class=\"img-rounded\"><h4>读取对象失败！</h4></center></div></div>");
				}
			});

	    $("#id_statistics_view").animate({"opacity": 1}, 500);
	});
    
    pre_touming_obj=obj;
}



function draw_global_view(topo_data)
{
    var vm_width=30;
    var min_vm_distance=5;
    var base_x=100;
    var base_y=35;
    
	paper.clear();
	phy_port_obj_list=[];
	host_list=[];
	small_text_list=[]
	link_list=[];
    for(var i=0 ; i<topo_data.host.length ; i++,base_x=base_x+host_width+50)
    {
        var host_width=200;
        var host_heigth=200;
        var st = paper.set();
        var host_child_array=[];

        vm_amount=topo_data.host[i].vm.length;

        if(host_width < vm_width*(2*vm_amount+1 ) )
        {
            host_width=vm_width*(2*vm_amount+1 );
        }

        //画主机框
        //var host_obj=paper.rect(base_x,base_y,host_width, host_heigth,15).attr({fill: "#99CC33",stroke: "black",cursor:"default"})
        var host_obj=paper.rect(base_x,base_y,host_width, host_heigth,15).attr({fill: "#AAAAAA",stroke: "none",cursor:"default"})
                .data("type","hypervisor")
                .data("ip",topo_data.host[i].ip)
                .data("name",topo_data.host[i].name)
                .click(function (){show_detail(this,"/monitor_host_detail");})
        //.drag(move, start, up)
            ;
        //画主机描述
        host_child_array.push(paper.text(base_x+host_width/2, base_y+25, topo_data.host[i].name).attr({"font-size":20}));

        bridge_mac=topo_data.host[i].switch.mac;
        //画桥
        host_child_array.push(
            paper.rect(base_x+10,base_y+150,host_width-20, 20+25,4).attr({fill: "#DDAA00",stroke: "none",cursor:"default"})
                .data("type","ovs_bridge")
                .data("mac",bridge_mac)
				.data("name",topo_data.host[i].name)
                .click(function (){show_detail(this,"/monitor_switch_detail");})
                .mouseover(function (event){wsug(this,event, "This bridge's mac: :<br /><b>"+this.data("mac")+"</b>");})
                .mouseout(function (event){wsug(this,event, 0);})
        );
        //画桥连接的物理口
        phy_ports_amount=topo_data.host[i].switch.phy_ports.length;
        for(var j=0;j<phy_ports_amount;j++)
        {
            w=host_width-20;
            L=(w-7*phy_ports_amount)/(phy_ports_amount+1);

            var phy_port_obj=
                    paper.rect(base_x+10+ L +j*(7+L)  ,  base_y+168+25,7, 7).attr({fill: "#6633CC",stroke: "none",cursor:"pointer"})
                        .data("type","ovs_phy_port")
                        .data("bridge_mac",bridge_mac)
                        .data("re_mac",topo_data.host[i].switch.phy_ports[j].re_mac)
                        .data("connected",0)
                        .data("name",topo_data.host[i].switch.phy_ports[j].name)
						.data("sw_name",topo_data.host[i].name)
                        .click(function (){show_detail(this,"/monitor_port_detail");})
                        .mouseover(function (event){wsug(this,event, "Physics port:<br/><b>"+this.data("name")+"</b>");})
                        .mouseout(function (event){wsug(this,event, 0);})
                ;
            //port_name_text_obj=paper.text(base_x+10+ L +j*(7+L)+7 ,  base_y+168+25-5,phy_port_obj.data("name")).attr({"font-size":3});
            host_child_array.push(phy_port_obj);
            phy_port_obj_list.push(phy_port_obj);
        }

        //画虚拟机
        vm_distance=host_width/(vm_amount*2+1);
        for(var j=0;j<vm_amount;j++)
        {

            obj_pos_x=base_x  +  (host_width- vm_amount*(vm_width+vm_distance)+vm_distance)/2 +  j*(vm_width+vm_distance);
            obj_pos_y=base_y+100;

            //var vm_fill_color="#44a3e4";
            var vm_fill_color="#428BCA";
            host_child_array.push(
                paper.rect(obj_pos_x,  obj_pos_y, vm_width, vm_width,5)
                    .attr({fill: vm_fill_color, cursor: "pointer",stroke: "none"})
                    .data("name",topo_data.host[i].vm[j].name)
                    .data("id",topo_data.host[i].vm[j].id)
                    .data("hostid",topo_data.host[i].id)
                    .data("type","vm")
                    .data("vmtype",topo_data.host[i].vm[j].type)
                    .click(function (){show_detail(this,"/monitor_host_detail");})
                    .mouseover(function (event){wsug(this,event, "Type:<b>"+this.data("vmtype")+"</b>");})
                    .mouseout(function (event){wsug(this,event, 0);})
            );
            //画虚拟机名字
			if(topo_data.host[i].vm[j].name.length<=8)
			    vm_name_text=paper.text(obj_pos_x+vm_width/2, obj_pos_y-vm_width/10-10+10*(0%2), topo_data.host[i].vm[j].name).attr({"font-size":10});
			else
                vm_name_text=paper.text(obj_pos_x+vm_width/2, obj_pos_y-vm_width/10-10+10*(j%2)-3, topo_data.host[i].vm[j].name).attr({"font-size":10});
            //vm_name_text=paper.text(obj_pos_x+vm_width/2, obj_pos_y+vm_width/10, topo_data.host[i].vm[j].name).attr({"font-size":3});
			host_child_array.push(vm_name_text);

            //虚拟机网卡
            for(var k=0;k<2;k++)//最多两个
            {
                //虚拟机口
                host_child_array.push(
                    paper.rect(
                            obj_pos_x+7+k*10,obj_pos_y+vm_width-3,7,7).attr({fill: "white",stroke: "none",cursor: "normal"})
                        .data("name",topo_data.host[i].vm[j].ovs_ports[k].name)
                        .mouseover(function (event){wsug(this,event,"interface:<b>"+this.data("name")+"</b>");})
                        .mouseout(function (event){wsug(this,event, 0);})
                );
                //port_name_text=paper.text(obj_pos_x+7+k*10+3,obj_pos_y+vm_width-3+7+(k%2)*2, topo_data.host[i].vm[j].ovs_ports[k].name).attr({"font-size":3});
                //虚拟交换机口
                host_child_array.push(
                    paper.rect(obj_pos_x+7+k*10,base_y+148,7,7).attr({fill: "#11AACC",stroke: "none",cursor: "pointer"})
                        .data("name",topo_data.host[i].vm[j].ovs_ports[k].outway)
						.data("sw_name",topo_data.host[i].name)
                        .data("type","ovs_int_port")
                        .mouseover(function (event){wsug(this,event, "port:<br /><b>"+this.data("name")+"</b>");})
                        .click(function (){show_detail(this,"/monitor_port_detail");})
                        .mouseout(function (event){wsug(this,event, 0);})
                );
                //port_name_text=paper.text(obj_pos_x+7+k*10+3,base_y+148+7+(k%2)*5, topo_data.host[i].vm[j].ovs_ports[k].outway).attr({"font-size":3});
                //port_name_text.hide();
                //host_child_array.push(port_name_text);
                //small_text_list.push(port_name_text);

                //paper.connection(vm_list[index-1], vm_list[index], "#3E417F", "#3E417F|5");
                //var obj=paper.path("M"+(obj_pos_x+10+k*10)+" "+(obj_pos_y+vm_width)+" L"+(obj_pos_x+10+k*10)+" "+(obj_pos_y+vm_width+23));
                host_child_array.push(
                    paper.path("M"+(obj_pos_x+10+k*10)+" "+(obj_pos_y+vm_width+5)+" L"+(obj_pos_x+10+k*10)+" "+(obj_pos_y+vm_width+23-5)).attr({"fill":"black"})
                );
            }
        }
        //关联起vm所有下属对象
        host_obj.data("childs",host_child_array);
        host_list.push(host_obj);
    }


    var base_link_heigh=30;
    var link_distance=10;

    //画桥之间的连线
    for(var i=0,k=0;i<phy_port_obj_list.length;i++)
    {
        if(phy_port_obj_list[i].data("connected")==0)
        {
            for(var j=0;j<phy_port_obj_list.length;j++)
            {
                if(phy_port_obj_list[i].data("bridge_mac")==phy_port_obj_list[j].data("re_mac") && phy_port_obj_list[i].data("re_mac") ==phy_port_obj_list[j].data("bridge_mac"))
                {
                    //var link_obj=paper.connection(phy_port_obj_list[i], phy_port_obj_list[j], "#3E417F", "#3E417F|5");
                    link_obj=paper.path(
                            "M"+(phy_port_obj_list[i].attr("x")+3)+" "+(phy_port_obj_list[i].attr("y")+5)+
                            "L"+(phy_port_obj_list[i].attr("x")+3)+" "+(phy_port_obj_list[i].attr("y")+base_link_heigh+link_distance*(k%2))+
                            "L"+(phy_port_obj_list[j].attr("x")+3)+" "+(phy_port_obj_list[i].attr("y")+base_link_heigh+link_distance*(k%2))+
                            "L"+(phy_port_obj_list[j].attr("x")+3)+" "+(phy_port_obj_list[j].attr("y")+5)
                    ).attr({"stroke-width":"4","stroke":"#888888"})
					.data("nodes",[phy_port_obj_list[i].data("bridge_mac"),phy_port_obj_list[i].data("re_mac")])//用于记录这条线连接着哪两个switch，以后方便点击事件
					;
                    k++;

                    //link_obj.bg
                    //.attr({"cursor": "pointer"})
                    //.mousedown(function (){show_detail(this);});
                    link_list.push(link_obj);
                    phy_port_obj_list[i].data("connected",1);
                    phy_port_obj_list[j].data("connected",1);
                }
            }
        }
    }
}

function init_stage(canvas_div_name)
{
    //paper_width = org_paper_width = document.getElementById(canvas_div_name).clientWidth;
    //paper_height = org_paper_height = document.getElementById(canvas_div_name).clientHeight;
	var temp_json={handle:null,paper_width:0,org_paper_width:0,paper_height:0,org_paper_height:0,now_view_x:0,now_view_y:0};
    temp_json.paper_width=temp_json.org_paper_width=document.getElementById(canvas_div_name).clientWidth;
    temp_json.paper_height=temp_json.org_paper_height=document.getElementById(canvas_div_name).clientHeight;
    var paper_handle = Raphael(canvas_div_name, temp_json.paper_width, temp_json.paper_height);
	temp_json.handle=paper_handle;	
	view_data_set.push(temp_json);
	enable_set_view(paper_handle);
	return paper_handle;
}