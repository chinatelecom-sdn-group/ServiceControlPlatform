var paper_chain_view;
var chain_graph_set=[];

function clear_chain_path()
{ 
    paper_chain_view.clear();
	for(var i=0;i<chain_graph_set.length;i++)
	{
	     chain_graph_set[i].remove();
	}
	chain_graph_set.length=0;
}

function clean_all_choosed()//用于清除所有已选择
{
    paper.forEach(function(obj){
	    if(obj.data("link_data"))
		{
		    if(obj.attr("stroke-dasharray"))
			    obj.animate({"opacity":1,"stroke":"red"},100);
			else
			    obj.animate({"opacity":1,"stroke":"#00DDAA"},100);
		}
		if(obj.type=="rect"&&obj.attr("stroke")!="none")
		{
			obj.animate({ "stroke": "none" },500);
		}
	});
	paper_chain_view.forEach(function(obj){
	    if(obj.data("link_data"))
		{
		    obj.animate({"opacity":1,"stroke":"#BBBBBB"},100);
		}
		if(obj.type=="rect"&&obj.attr("stroke")!="none")
		{
			obj.animate({ "stroke": "none" },500);
		}
	});
}


function focus_link_and_show(logic_path,phy_path_list,url)//对目标链路进行高亮选中并显示细节
{
	clean_all_choosed();
	logic_path.animate({"opacity":0.5},300,function(event){this.animate({"opacity":1},300,function(event){this.animate({"opacity":0.5},300,function(event){this.animate({"opacity":1},300);});});});
	logic_path.animate({"stroke":"blue"},500);
	for(var i=0;i<phy_path_list.length;i++)
	{
	    phy_path_list[i].animate({"opacity":0.5},300,function(event){this.animate({"opacity":1},300,function(event){this.animate({"opacity":0.5},300,function(event){this.animate({"opacity":1},300);});});});
		phy_path_list[i].animate({"stroke":"blue"},500);
	}
	//alert(JSON.stringify(obj1.data("link_data")));
	$("#id_statistics_view").animate({"opacity": 0}, 500,function()
    {
		$.ajax({
			type:"get",
			url:"/monitor_links_query_frame?",
			data:{links:logic_path.data("link_data"),chain_name:$('#sc_project_selector option:selected').val()},
			success:function(msg){
				$("#id_statistics_view").html(msg);
			},
			error:function(err){
				$("#id_statistics_view").html(err);
			}
			});
		$("#id_statistics_view").animate({"opacity": 1}, 500);
	});
}


function show_link_l2p(obj)
{
	var link_json=obj.data("link_data");
	var phy_path_list=[];
	paper.forEach(function(OBJ)
	{
		if(OBJ.data("link_data"))
		{
		    for(var i=0;i<obj.data("link_data").length;i++)
			{
				if(OBJ.data("link_data")==obj.data("link_data")[i])
				{
				    phy_path_list.push(OBJ);
				}
			}
		}
	});
	if(phy_path_list.length)
	{
        focus_link_and_show(obj,phy_path_list);//保证只触发一次，然后多条物理路
	}
	else
	{
	    $("#modal-container-info-dlg-content").html("此逻辑路径无法映射到到物理路径!");
        $("#modal-container-info-dlg").modal('show');
	}
}

function show_link_p2l(obj)
{
	var link_json=obj.data("link_data");
	var will_return=0;
	paper_chain_view.forEach(function(OBJ)
	{
	    if(will_return)
		    return;
		if(OBJ.data("link_data"))
		{
		    for(var i=0;i<OBJ.data("link_data").length;i++)
			{
				 if(OBJ.data("link_data")[i]==link_json)
				 {
				     focus_link_and_show(OBJ,[obj]);//保证只触发一次，然后一条物理路				 
					 will_return=1;
					 return;
				 }
			}
		}
	});
}

function light_chain_path(json_data)//在物理图中描线的函数
{
    var chain_data=json_data.Line;
	var chain_name=json_data.name;
	var chain_data_len=chain_data.length;
	var vm_obj_list=[];
	//var line_height_distance=10;
	var line_height_distance=0;
	var base_line_height=40;
	var line_attr;
	var jiantou_attr={"stroke-width":"2","stroke":"black"};
	
	function get_port(name,sw_name)
	{
	    var OBJ=null;
		paper.forEach(function(obj)
		{
		    if(OBJ)
			    return;
			if(obj.data("name")==name)
			{
			    if((obj.data("type")=="ovs_phy_port"||obj.data("type")=="ovs_int_port")&&obj.data("sw_name")==sw_name)
				{
				    OBJ=obj;
					return;
				}
			}
		});
		return OBJ;
	}
		
	for(var index=0;index<chain_data_len;index++)
	{
		var inport=get_port(chain_data[index].inport.Name,chain_data[index].host);
		var outport=get_port(chain_data[index].outport.Name,chain_data[index].host);
		if(!inport||!outport)
		{
			$("#modal-container-info-dlg-content").html("无法定位路径:  in:  <b>"+chain_data[index].inport.port+"</b>,  out:  <b>"+chain_data[index].outport.port+"</b>,  host:  <b>"+chain_data[index].host+"</b>");
            $("#modal-container-info-dlg").modal('show');
			continue;
		}
		
		var in_port_x=inport.attr("x")+3;
		var in_port_y=inport.attr("y")+3;
		var out_port_x=outport.attr("x")+3;	
		var out_port_y=outport.attr("y")+3;
		
		if(in_port_y>out_port_y)
		    base_y=in_port_y+30;
		else if (out_port_y>in_port_y)
		    base_y=out_port_y+30;
		else
		    base_y=in_port_y;
		
		
	
		var arr_border_len=6;
		var line0;
		
		if(chain_data[index]["status"]=="disable")//已经失效的线为虚线
		    line_attr ={"stroke-width":"2","stroke":"red","cursor":"pointer","stroke-dasharray":"- "};
		else
		   //line_attr ={"stroke-width":"4","stroke":"#7E4001","cursor":"pointer"};
		   line_attr ={"stroke-width":"5","stroke":"#00DDAA","cursor":"pointer"};

		
		if(base_y==in_port_y)//在同一高度上，用曲线
		{
			PATH="M"+in_port_x+" "+in_port_y+"C"+in_port_x+" "+in_port_y+" "+(out_port_x+in_port_x)/2+" "+(base_y-base_line_height+(index*line_height_distance + base_line_height*2)*((index+1)%2))+" "+out_port_x+" "+out_port_y;
			chain_graph_set.push( line0=paper.path(PATH).attr(line_attr) );
			var arr_x=(out_port_x+in_port_x)/2;//画箭头
			line_tmp=paper.path("M"+arr_x+" 0 L"+arr_x+" 2000");
			var point_set=Raphael.pathIntersection(line0.attr("path"), line_tmp.attr("path"));
			arr_y=point_set[0].y;
			line_tmp.remove();					
			var aaa;
			(out_port_x>in_port_x)?aaa=-1:aaa=1;			
		    chain_graph_set.push(paper.path("M"+arr_x +" "+  arr_y+" L"+(arr_x+aaa*arr_border_len)+" "+(arr_y+arr_border_len)  +
		    " M"+arr_x +" "+  arr_y+" L"+(arr_x+aaa*arr_border_len)+" "+(arr_y-arr_border_len)).attr(jiantou_attr) );	
		}
		else//不同高度，用直线
		{
		    PATH="M"+in_port_x+" "+in_port_y+"L"+in_port_x+" "+in_port_y+" "+out_port_x+" "+out_port_y;
			chain_graph_set.push( line0=paper.path(PATH).attr(line_attr) );
			
			arr_x=(in_port_x+out_port_x)/2;
			arr_y=(in_port_y+out_port_y)/2;
			var angle = Raphael.angle(in_port_x, in_port_y, out_port_x, out_port_y);//得到两点之间的角度
			var a45 = Raphael.rad(angle - 45);//角度转换成弧度
			var a45m = Raphael.rad(angle + 45);
			var point1_x = arr_x + Math.cos(a45) * arr_border_len;
			var point1_y= arr_y + Math.sin(a45) * arr_border_len;
			var point2_x = arr_x + Math.cos(a45m) * arr_border_len;
			var point2_y= arr_y + Math.sin(a45m) * arr_border_len;
			chain_graph_set.push(paper.path("M"+point1_x+" "+point1_y+" L"+point1_x+" "+point1_y+" "+arr_x +" "+ arr_y+" "+point2_x+" "+point2_y).attr(jiantou_attr));
		}
		
		line0.data("link_data",chain_data[index])
		.click(function(event){show_link_p2l(this);})
		;
		
        paper.text(in_port_x-5,in_port_y-8,chain_data[index].inport.port);
		paper.text(out_port_x-5,out_port_y-8,chain_data[index].outport.port);

        if(index==0)//画开始的圆圈
		{
		    chain_graph_set.push(paper.circle(in_port_x,in_port_y,7,7).attr({"stroke-width":"2","stroke": "red"}));
		}		
		if(index==chain_data_len-1)//画结束的圆圈
		{
		     chain_graph_set.push(paper.circle(out_port_x,out_port_y,7,7).attr({"stroke-width":"2","stroke": "blue"}));
		}
	}
	
}

function draw_chain_view(json_data)//画chain的逻辑视图
{
    var chain_data=json_data.Line;
	var chain_name=json_data.name;
	
	var start_x=100;
    var start_y=150;
    var vm_width=50;
    var vm_distance=200;
    var up_distance=60;
    var port_width=13;
    var line_attr={cursor:"pointer","stroke-width":"7","stroke":"#BBBBBB"};
    var circle_r=10;
    
	paper_chain_view.clear();
    var obj_amount=chain_data.length;
	
	var vm_index=-1;
	var tmp_links_set=[];
	
    for(var i=0;i<obj_amount;i++)
    {
        tmp_links_set.push(chain_data[i]);	//记录下一条物理路径	
		if(chain_data[i].outport.type!="vm")//此lian路上不是连接着vm
		{
		    if(i==obj_amount-1)//最后一段
            {
                paper_chain_view.path("M"+(start_x+vm_distance*(vm_index+1)+vm_width/3)+  " "  +(start_y-up_distance+port_width/2)+
                    " L"+  (start_x+vm_distance*(vm_index+1)+vm_width/3)  +" "+  start_y+
                    " L"+  (start_x+vm_distance*(vm_index+2)+vm_width/3)  +" "+  start_y)
                    .attr(line_attr)
					.data("link_data",tmp_links_set)
		            .click(function(event){show_link_l2p(this)});
				;
				tmp_links_set=[];
                paper_chain_view.image("/images/cloud.png",start_x+vm_distance*(vm_index+2)+vm_width/3-50,start_y-up_distance,100,100);				
            }
			continue;
		}

		vm_index++;
		
		paper_chain_view.rect(start_x+vm_distance-vm_width/3+vm_distance*vm_index,start_y-up_distance-vm_width,vm_width, vm_width,0).attr({fill: "#44a3e4",stroke: "none",cursor:"pointer"})
            .data("name",chain_data[i].outport.name)
            .data("host",chain_data[i].host)
            .click(function(event)
			{			
				var finded_obj=0;//是否能找到对象的标志
				var vm_name=this.data("name");
				paper.forEach(function(obj)
				{
					if(finded_obj)
					    return;
					if(obj.data("name")==vm_name)
					{
						if(obj.data("type")=="vm")
						{
							finded_obj=1;
							show_detail(obj,"/monitor_host_detail");//另外一张视图中的镜像VM高亮
							return;
						}
					}
				});
				
                if(!finded_obj)//找不到相关对象，此次点击不生效
				{
				    //alert("找不到对应VM");
					$("#modal-container-info-dlg-content").html("找不到对应VM");$("#modal-container-info-dlg").modal('show');
     				return;
				}
				
				clean_all_choosed();//清除已选择			
				this.animate({ "stroke": "green","stroke-width":5 },800);				
				this.animate({"fill-opacity": 0.2}, 250,function(){this.animate({"fill-opacity": 1}, 250);});				
            }
        )
            .mouseover(function (event){wsug(this,event, "name:<b>"+this.data("name")+"</b><br/>host:<b>"+this.data("host")+"</b>");})
            .mouseout(function (event){wsug(this,event, 0);})
        ;
        //画vm说明文字
        paper_chain_view.text(start_x+vm_distance+vm_distance*vm_index+vm_width/6,start_y-up_distance-vm_width-10,chain_data[i].outport.name).attr({"font-size":15,"font-weight":"bold"});
        //左方默认入端口
        paper_chain_view.rect(start_x+vm_distance+vm_distance*vm_index+-port_width/2,start_y-up_distance-port_width/2,port_width,port_width,0).attr({fill: "white",stroke: "none",cursor:"pointer"})
            .data("index",chain_data[i].inport.port)
            .mouseover(function (event){wsug(this,event, "port index:<b>"+this.data("index")+"</>");})
            .mouseout(function (event){wsug(this,event, 0);})
        ;
        //右方默认出端口
        paper_chain_view.rect(start_x+vm_distance+vm_width/3+vm_distance*vm_index-port_width/2,start_y-up_distance-port_width/2,port_width,port_width,0).attr({fill: "white",stroke: "none",cursor:"pointer"})
            .data("index",chain_data[i].outport.port)
            .mouseover(function (event){wsug(this,event, "port index:<b>"+this.data("index")+"</>");})
            .mouseout(function (event){wsug(this,event, 0);})
        ;
		
		var link_path;
        if(vm_index)//不是第一条线
        {
            link_path=paper_chain_view.path("M"+(start_x+vm_distance*(vm_index+1))+" "+(start_y-up_distance+port_width/2)+
                " L"+  (start_x+vm_distance*(vm_index+1))  +" "+  start_y+
                " L"+  (start_x+vm_distance*vm_index+vm_width/3)  +" "+  start_y+
                " L"+  (start_x+vm_distance*vm_index+vm_width/3) +" "+  (start_y-up_distance+port_width/2))
                .attr(line_attr);
        }
        else//第一条线从入端口开始画
        {
            link_path=paper_chain_view.path("M"+(start_x+vm_distance*(vm_index+1))+" "+(start_y-up_distance+port_width/2)+
                " L"+  (start_x+vm_distance*(vm_index+1))  +" "+  start_y+
                " L"+  (start_x+vm_distance*vm_index+vm_width/3)  +" "+  start_y)
                .attr(line_attr);
            paper_chain_view.image("/images/user.png",start_x+vm_distance*vm_index+vm_width/3-vm_width,start_y-up_distance,100,100);
        }
		
		link_path.data("link_data",tmp_links_set)
		.click(function(event){show_link_l2p(this)});
        tmp_links_set=[];//清空每条逻辑路径的物理路径数据
    }
	
}




function disable_all_event(paper_handle)//禁止物理图所有点击事件，鼠标手势
{
    var paper=paper_handle;
    paper.forEach(function (obj){
        if(obj.events)//清除所有点击事件
        {
            for(var i=0;i<obj.events.length;i++)
            {
                if(obj.events[i].name=="click")
                {
                    obj.events[i].unbind();
                    break;
                }
            }
        }
		obj.attr({"cursor":"default"});//鼠标全部变为普通类型
    });
}