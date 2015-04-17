/*chain_data=[
{vm_name:"vm2",vm_type:"cisco_firewall",vm_id:"205",host_name:"computer1",inport:"port1",outport:"port2"},
{vm_name:"vm1",vm_type:"huawei_os",vm_id:"204",host_name:"computer1",inport:"port7",outport:"port12"},
{vm_name:"vm6",vm_type:"cisco_firewall",vm_id:"6",host_name:"computer2",inport:"port1",outport:"port2"},
{vm_name:"vm4",vm_type:"junos",vm_id:"4",host_name:"computer2",inport:"port4",outport:"port3"},
];
*/
var chain_graph_set=[];

function light_chain_path(chain_data)
{
    var chain_data_len=chain_data.length;
	var vm_obj_list=[];
	var line_height_distance=20;
	var base_line_height=60;
	
	    function find_vm()
		{
		    var return_value="";
			paper.forEach(function(obj)
		    {
		        if(obj.data("name")==chain_data[index].vm_name)
			    {
			        if(obj.data("type")=="vm")
					{
					    return_value=obj;
						return;
					}
			    }
		    }
		    );
			return return_value;
		}
	
	
	for(var index=0;index<chain_data_len;index++)
	{
		var vm_obj=find_vm();
		if(vm_obj!="")
		{
			vm_obj_list.push(vm_obj);
		}
		else
		{
		    alert("cant find  vm!!!!-------------"+chain_data[index].vm_name);
			return;
		}
		
		in_port_x=vm_obj_list[index].attr("x")+10;
		base_y=vm_obj.attr("y")+50;		
		out_port_y=base_y;		
		in_port_y=base_y;
		
		
		if(index==0)
		{
		    chain_graph_set.push(paper.circle(in_port_x,base_y,7,7).attr({"stroke-width":"2","stroke": "red"}));
		}
		else if(index>0)
		{
			
            out_port_x=vm_obj_list[index-1].attr("x")+20;		


			
			PATH="M"+out_port_x+" "+out_port_y+"C"+out_port_x+" "+out_port_y+" "+(out_port_x+in_port_x)/2+" "+(base_y-base_line_height+(index*line_height_distance + base_line_height*2)*(index%2))+" "+in_port_x+" "+in_port_y;		
			chain_graph_set.push( line0=paper.path(PATH).attr({"stroke-width":"2","stroke":"green"}) );
			//画箭头
			var arr_x=(out_port_x+in_port_x)/2;
			line_tmp=paper.path("M"+arr_x+" 0 L"+arr_x+" 2000");
			var point_set=Raphael.pathIntersection(line0.attr("path"), line_tmp.attr("path"));
			arr_y=point_set[0].y;
			line_tmp.remove();			
			var aaa;
			(out_port_x>in_port_x)?aaa=1:aaa=-1;
			var arr_border_len=10;
			chain_graph_set.push(paper.path("M"+arr_x +" "+  arr_y+" L"+(arr_x+aaa*arr_border_len)+" "+(arr_y+arr_border_len)  +
			" M"+arr_x +" "+  arr_y+" L"+(arr_x+aaa*arr_border_len)+" "+(arr_y-arr_border_len)).attr({"stroke-width":"2","stroke":"green"}) );
			
		}
		
		if(index==chain_data_len-1)
		{
		     chain_graph_set.push(paper.circle(in_port_x+10,base_y,7,7).attr({"stroke-width":"2","stroke": "blue"}));
		}
	}
	
}

function clear_chain_path()
{ 
    for(var i=0;i<chain_graph_set.length;i++)
	{
	     chain_graph_set[i].remove();
	}
}