var host_group=[];
var paper;
var org_paper_width;
var org_paper_height;
var paper_width;
var paper_height;
var now_view_x=0;
var now_view_y=0;
//var arr_botton_set=[];
var addjustting_view=0;
var addjustting_div=0;
var base_mouse_x=0;
var base_mouse_y=0;
var color_set=["#33AA33","red","blue","#33AAFF","#AABB22","#DD3377","#3A507B"];
var type_color_set=[];
var host_list=[];
var phy_port_obj_list=[];
var small_text_list=[];
var pre_touming_obj;
var warning_kuang;
var lighting_obj;


function AddjustView(dx,dy,zoom_percent)
{
	view_percent=paper_width/org_paper_width;
	now_view_x=now_view_x+view_percent*dx;
	now_view_y=now_view_y+view_percent*dy;
	

	paper_width=paper_width*zoom_percent/100;
	paper_height=paper_height*zoom_percent/100;
	
	view_percent=paper_width/org_paper_width;
	
	//为了适应缩放的时候以中心点为缩放
	now_view_x=now_view_x+paper_width/2 * (100-zoom_percent)/100;
	now_view_y=now_view_y+paper_height/2 * (100-zoom_percent)/100;
    paper.setViewBox(now_view_x, now_view_y, paper_width, paper_height,false);
	//console.log(view_percent);
	//console.log(dx,dy,zoom_percent)
	//console.log("paper_width="+paper_width);
	
	
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
	//console.log(paper_width,paper_height);
	/*
	for(var i=0;i<arr_botton_set.length;i++)
	{
	    //arr_botton_set[i].attr({"x":arr_botton_set[i].attr("x")-dx});
		//arr_botton_set[i].attr("oy")=arr_botton_set[i].attr("oy")-dy;
		//alert("t-"+now_view_x+",-"+now_view_y+"");
		arr_botton_set[i].transform("t"+now_view_x+","+now_view_y+"");
	}*/
	
}

/*
function draw_arrow_button()
{
    
	arr_botton_set.push(paper.image("/images/arrow_up.gif",30,10,15, 15).attr({fill: "#99CC33",stroke: "none", cursor: "pointer"}).mousedown(function (){AddjustView(0,-30);}).mouseup(function (){addjustting=1;}));
	arr_botton_set.push(paper.image("/images/arrow_left.gif",10,30,15, 15).attr({fill: "#99CC33",stroke: "none",cursor: "pointer"}).mousedown(function (){AddjustView(-30,0);}).mouseup(function (){addjustting=1;}));
	arr_botton_set.push(paper.image("/images/arrow_down.gif",30,50,15, 15).attr({fill: "#99CC33",stroke: "none",cursor: "pointer"}).mousedown(function (){AddjustView(0,30);}).mouseup(function (){addjustting=1;}));
	arr_botton_set.push(paper.image("/images/arrow_right.gif",50,30,15, 15).attr({fill: "#99CC33",stroke: "none",cursor: "pointer"}).mousedown(function (){AddjustView(30,0);}).mouseup(function (){addjustting=1;}));
	arr_botton_set.push(paper.circle(38,38,30,30));
	arr_botton_set.push(paper.circle(38,38,5,5).attr({fill: "#CCCCCC"}));
}
*/

function enable_set_view()
{
    paper.canvas.onmousedown=function(event)
	{
		if(moving_obj)
		    return;
		base_mouse_x=event.screenX;
		base_mouse_y=event.screenY;
		addjustting_view=1;
		paper.canvas.style.cursor="move";
	}
	paper.canvas.onmousemove=function(event)
	{
	    if(addjustting_view)
		{
		    AddjustView(base_mouse_x-event.screenX,base_mouse_y-event.screenY,100);
			base_mouse_x=event.screenX;
		    base_mouse_y=event.screenY;
		}
	}
	paper.canvas.onmouseup=function()
	{
	    addjustting_view=0;
		paper.canvas.style.cursor="default";
	}
	paper.canvas.onmousewheel=function(event)
	{
	    var direct=0;
        event=event || window.event;
	    var pct;
        if(event.wheelDelta)
		    {pct=100-event.wheelDelta/12;}
	    else if(event.detail)//Firefox
		    {pct=100-event.detail/12;}
        AddjustView(0,0,pct);
	}
	
	paper.canvas.onmouseenter=function()
	{
	    document.onmousewheel=function(){return false;}
    }
	paper.canvas.onmouseleave=function()
	{
	    document.onmousewheel=function(){return true;}
    }
}

function enable_div_resize()
{
    function $(id){return document.getElementById(id)}	
    //var oTop = $("canvasDiv");
	var oTop = $("main_top");
    var oLine = $("device_line");
	var oDta=$("detail_area");	
	oLine.onmouseenter=function (event){wsug(this,event, "click to hide!!");}
	oLine.onmouseleave=function (event){wsug(this,event, 0);}
    oLine.onmousedown = function (e)
    {
		/*var pre_mouse_y=e.clientY;
		addjustting_div=1;
		document.onmousemove = function (e)
        {
			if(!addjustting_div)
			    return;
			var dy=e.clientY-pre_mouse_y;
			pre_mouse_y=e.clientY;
			if(oTop.offsetHeight+dy <=10 || oDta.offsetHeight-dy <=10)
			    return;
			oTop.style.height=oTop.offsetHeight+dy+"px";
			oDta.style.height=oDta.offsetHeight-dy+"px";
			return false;			
        };
        document.onmouseup = function ()
        {
            document.onmousemove = null;
            document.onmouseup = null;
			addjustting_div=0;
            oLine.releaseCapture && oLine.releaseCapture()
        };*/
		
		if(oTop.style.display!="none")
		{
		    oDta.style.height=oDta.offsetHeight+oTop.offsetHeight+"px";
			oTop.style.display="none";
			oLine.children[0].children[0].src="/images/click_arrow_down.gif";
			oLine.onmouseenter=function (event){wsug(this,event, "click to expand!!");}
		}
		else
		{
		     oTop.style.display="block";
			 oDta.style.height=(oDta.offsetHeight-oTop.offsetHeight)+"px";
			 oLine.children[0].children[0].src="/images/click_arrow_up.gif";
			 oLine.onmouseenter=function (event){wsug(this,event, "click to hide!!");}
		}
       
    };
	 //oLine.setCapture && oLine.setCapture();
        return false
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

			$('#detail_area').animate({"opacity": 0}, 500,function()
			{
			    document.getElementById("detail_area").src="/pages/page_click_to_show_detail.html";
			    $('#detail_area').animate({"opacity": 1},500);
			}
			);
			pre_touming_obj=null;
            lighting_obj="null";
		}
	    
	}
}



function show_detail(obj)
{
    if(obj==pre_touming_obj)
	    return;
	//全部变灰
	paper.forEach(function (obj) 
	{
     //obj.attr({ "fill-opacity": 0.2,"opacity": 0.2 });
	 if(obj.type=="path")
	     {
		     //obj.animate({ "opacity": 0.2 },800);
		 }
	 else if(obj.type=="rect")
		{
		    //obj.animate({ "fill-opacity": 0.2 },800);
			if(obj.attr("stroke")!="none")
			{
			    obj.animate({ "stroke": "none" },800);
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
	
	function keep_lighting()
	{
		if(lighting_obj=="null")
		    {return;}
			//lighting_obj.animate({"fill-opacity":0.2},400,function(){lighting_obj.animate({"fill-opacity":1},400,function(){keep_lighting();});});
			lighting_obj.animate({"stroke":"green","stroke-width":3},400,function(){lighting_obj.animate({"stroke":"none"},400,function(){keep_lighting();});});
	}	
	lighting_obj=obj;
	keep_lighting();
	
	
	//闪动虚线框框选
	if(obj.type=="path")
	{
	    warning_kuang.hide()
	}
	else
	{
	    var kuang_width;
	    obj.attr("height")>obj.attr("width")? kuang_width=obj.attr("height")*0.5+20:kuang_width=obj.attr("width")*0.5+20;	
	    warning_kuang.attr({"cx":obj.attr("x")+obj.attr("width")/2,   "cy": obj.attr("y")+obj.attr("height")/2,    "r":kuang_width  });
	    //warning_kuang.show().toFront();
	}
	//细节页面呈现
	$('#detail_area').animate({"opacity": 0}, 500,
	   function()
	   {
	        //document.getElementById("detail_area").src="/monitor_vm?type=3&oID=2&view=r";
			//document.getElementById("detail_area").src="/monitor_chain";
			if(obj.data("type")=="ovs_phy_port"||obj.data("type")=="ovs_int_port")
			{
			    document.getElementById("detail_area").src="/monitor_port_traffic?name="+obj.data("name")+"&sw=Switch@172.21.2.7";
			}
			else
			{
			    document.getElementById("detail_area").src="/monitor_hostdetail?name="+obj.data("name");
			}
			$('#detail_area').animate({"opacity": 1},500);
	   }
	);
	pre_touming_obj=obj;
}



function draw_global_view()
{
	var vm_width=30;
	var min_vm_distance=5;
	var base_x=100;
	var base_y=70;
	
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
			.mouseover(function (event){wsug(this,event, "ip:<b>"+this.data("ip")+"</b>");})
			.mouseout(function (event){wsug(this,event, 0);})
			.click(function (){show_detail(this);})
			//.drag(move, start, up)
			;
			//画主机描述
			host_child_array.push(
			paper.text(base_x+host_width/2, base_y+25, topo_data.host[i].name).attr({"font-size":20})
			//paper.text(base_x+host_width/2, base_y+28, "ip:"+topo_data.host[i].ip).attr({"font-size":20})
			//paper.text(base_x+host_width/2, base_y+46, "id:"+topo_data.host[i].id).attr({"font-size":20})
			//paper.text(base_x+host_width/2, base_y+64, "pty1:"+topo_data.host[i].pty1).attr({"font-size":20})
			);
			
			bridge_mac=topo_data.host[i].switch.mac;
			//画桥
			host_child_array.push(
			paper.rect(base_x+10,base_y+150,host_width-20, 20+10,4).attr({fill: "#DDAA00",stroke: "none",cursor:"default"})
			.data("type","ovs_bridge")
			.data("mac",bridge_mac)
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
				paper.rect(base_x+10+ L +j*(7+L)  ,  base_y+168+10,7, 7).attr({fill: "#6633CC",stroke: "none",cursor:"pointer"})
				.data("type","ovs_phy_port")
				.data("bridge_mac",bridge_mac)
				.data("re_mac",topo_data.host[i].switch.phy_ports[j].re_mac)
				.data("connected",0)
			    .data("name",topo_data.host[i].switch.phy_ports[j].name)
				.click(function (){show_detail(this);})
			    .mouseover(function (event){wsug(this,event, "Physics port name:<br/><b>"+this.data("name")+"</b>");})
			    .mouseout(function (event){wsug(this,event, 0);})
				;
				port_name_text_obj=paper.text(base_x+10+ L +j*(7+L)+17 ,  base_y+168+10,phy_port_obj.data("name")).attr({"font-size":3});
				port_name_text_obj.hide();
				small_text_list.push(port_name_text_obj);
				host_child_array.push(port_name_text_obj);
				
				host_child_array.push(phy_port_obj);				
				phy_port_obj_list.push(phy_port_obj);				
			}
			
			//画虚拟机
		    vm_distance=host_width/(vm_amount*2+1);
			for(var j=0;j<vm_amount;j++)
			{
				var vm_fill_color;
				var index=0;
				for(;index<type_color_set.length;index++)
				{
				    if(type_color_set[index] == topo_data.host[i].vm[j].type)
					{
					    vm_fill_color=color_set[index];
						break;
					}
				}
				if(index==type_color_set.length)
				{
				    vm_fill_color=color_set[index];
					type_color_set.push(topo_data.host[i].vm[j].type);
				}
				
				obj_pos_x=base_x  +  (host_width- vm_amount*(vm_width+vm_distance)+vm_distance)/2 +  j*(vm_width+vm_distance);
				obj_pos_y=base_y+100;
				
				vm_fill_color="#44a3e4";
				
				host_child_array.push(
				paper.rect(obj_pos_x,  obj_pos_y, vm_width, vm_width,5)
				.attr({fill: vm_fill_color, cursor: "pointer",stroke: "none"})
				.data("name",topo_data.host[i].vm[j].name)
				.data("id",topo_data.host[i].vm[j].id)
				.data("hostid",topo_data.host[i].id)
				.data("type","vm")
				.data("vmtype",topo_data.host[i].vm[j].type)
				.click(function (){show_detail(this);})
			    .mouseover(function (event){wsug(this,event, "Name:<b>"+this.data("name")+"</b><br/>Type:<b>"+this.data("vmtype")+"</b>");})
			    .mouseout(function (event){wsug(this,event, 0);})
				);
				//画主机名字
				host_child_array.push(paper.text(obj_pos_x+vm_width/2, obj_pos_y-vm_width/10-10+10*(j%2), topo_data.host[i].vm[j].name).attr({"font-size":10}));
				//画当缩放比例到达一定时候会显示的说明文字
				/*vm_name_text=paper.text(obj_pos_x+vm_width/2, obj_pos_y+vm_width/10, topo_data.host[i].vm[j].name).attr({"font-size":3});
				vm_name_text.hide();
				host_child_array.push(vm_name_text);
				small_text_list.push(vm_name_text);*/
				
				//虚拟机网卡
				for(var k=0;k<2;k++)//最多两个
				{
				    //虚拟机口
					host_child_array.push(
					paper.rect(
					obj_pos_x+7+k*10,obj_pos_y+vm_width-3,7,7).attr({fill: "white",stroke: "none",cursor: "normal"})
					.data("name",topo_data.host[i].vm[j].ovs_ports[k].name)
					.mouseover(function (event){wsug(this,event,"Name:<b>"+this.data("name")+"</b>");})
					.mouseout(function (event){wsug(this,event, 0);})
					);
					port_name_text=paper.text(obj_pos_x+7+k*10+3,obj_pos_y+vm_width-3+7+(k%2)*2, topo_data.host[i].vm[j].ovs_ports[k].name).attr({"font-size":3});
				    port_name_text.hide();
				    host_child_array.push(port_name_text);
				    small_text_list.push(port_name_text);
					//虚拟交换机口
					host_child_array.push(
					paper.rect(obj_pos_x+7+k*10,base_y+148,7,7).attr({fill: "#11AACC",stroke: "none",cursor: "pointer"})
					.data("name",topo_data.host[i].vm[j].ovs_ports[k].outway)
					.data("type","ovs_int_port")
					.mouseover(function (event){wsug(this,event, "Name:<br /><b>"+this.data("name")+"</b>");})
					.click(function (){show_detail(this);})
					.mouseout(function (event){wsug(this,event, 0);})
					);
					port_name_text=paper.text(obj_pos_x+7+k*10+3,base_y+148+7+(k%2)*2, topo_data.host[i].vm[j].ovs_ports[k].outway).attr({"font-size":3});
				    port_name_text.hide();
				    host_child_array.push(port_name_text);
				    small_text_list.push(port_name_text);
					
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
    //var link_distance=20;
	var link_distance=0;
	
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
					"L"+(phy_port_obj_list[i].attr("x")+3)+" "+(phy_port_obj_list[i].attr("y")+base_link_heigh+link_distance*k)+
					"L"+(phy_port_obj_list[j].attr("x")+3)+" "+(phy_port_obj_list[i].attr("y")+base_link_heigh+link_distance*k)+
					"L"+(phy_port_obj_list[j].attr("x")+3)+" "+(phy_port_obj_list[j].attr("y")+5)
					).attr({"stroke-width":"4","stroke":"#888888"});
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
