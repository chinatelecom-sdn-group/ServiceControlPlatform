function wsug(thisobj,e, str){
	var oThis = arguments.callee;
	if(!str) {
		oThis.sug.style.visibility = 'hidden';
		document.onmousemove = null;
		return;
	}		
	if(!oThis.sug){
		var div = document.createElement('div'), css = 'top:0; left:0; position:absolute; z-index:100; visibility:hidden';
			div.style.cssText = css;
			div.setAttribute('style',css);
		var sug = document.createElement('div'), css= 'font:normal 12px/16px "宋体"; white-space:nowrap; color:#666; padding:3px; position:absolute; left:0; top:0; z-index:10; background:#f9fdfd; border:1px solid #0aa';
			sug.style.cssText = css;
			sug.setAttribute('style',css);
		var dr = document.createElement('div'), css = 'position:absolute; top:3px; left:3px; background:#333; filter:alpha(opacity=50); opacity:0.5; z-index:9';
			dr.style.cssText = css;
			dr.setAttribute('style',css);
		var ifr = document.createElement('iframe'), css='position:absolute; left:0; top:0; z-index:8; filter:alpha(opacity=0); opacity:0';
			ifr.style.cssText = css;
			ifr.setAttribute('style',css);
		div.appendChild(ifr);
		div.appendChild(dr);
		div.appendChild(sug);
		div.sug = sug;
		document.body.appendChild(div);
		oThis.sug = div;
		oThis.dr = dr;
		oThis.ifr = ifr;
		div = dr = ifr = sug = null;
	}
	var e = e || window.event, obj = oThis.sug, dr = oThis.dr, ifr = oThis.ifr;
	obj.sug.innerHTML = str;
	var w = obj.sug.offsetWidth, h = obj.sug.offsetHeight, dw = document.documentElement.clientWidth||document.body.clientWidth; dh = document.documentElement.clientHeight || document.body.clientHeight;
	var st = document.documentElement.scrollTop || document.body.scrollTop, sl = document.documentElement.scrollLeft || document.body.scrollLeft;
	var left = e.clientX +sl +17 + w < dw + sl && e.clientX + sl + 15 || e.clientX +sl-8 - w, top = e.clientY + st + 17;
	obj.style.left = left+ 10 + 'px';
	obj.style.top = top + 10 + 'px';
	dr.style.width = w + 'px';
	dr.style.height = h + 'px';
	ifr.style.width = w + 3 + 'px';
	ifr.style.height = h + 3 + 'px';
	//setTimeout(function(obj)
	//{obj.style.visibility = 'visible';
	//},500);
	obj.style.visibility = 'visible';
	//obj.style.visibility = 'hidden';
	//alert("dsfdf");
	//thisobj.style.fillOpacity=0;
	//thisobj.animate({"fill-opacity": 0.2},1,function(){thisobj.animate({"fill-opacity": 1},200);});
	//thisobj.animate({"opacity": 0.2},1,function(){thisobj.animate({"opacity": 1},200);});
	
	document.onmousemove = function(e){
		var e = e || window.event, st = document.documentElement.scrollTop || document.body.scrollTop, sl = document.documentElement.scrollLeft || document.body.scrollLeft;
		var left = e.clientX +sl +17 + w < dw + sl && e.clientX + sl + 15 || e.clientX +sl-8 - w, top = e.clientY + st +17 + h < dh + st && e.clientY + st + 17 || e.clientY + st - 5 - h;
		obj.style.left = left + 'px';
		obj.style.top = top + 'px';
		//obj.style.fill-opacity=0;
		//obj.animate({"fill-opacity": 0.2},500);
		//alert("dsfdsa");
	}
}


/*var vm_list=[];
var link_list=[];
var div_list=[];
var start_point;
var end_point;

//画布
//var paper;
var connection;//连线
//两对象连线方法
Raphael.fn.connection = function (obj1, obj2, line, bg) {
	if (obj1.line && obj1.from && obj1.to) {
		line = obj1;
		obj1 = line.from;
		obj2 = line.to;
	}
	var bb1 = obj1.getBBox(),
		bb2 = obj2.getBBox(),
		p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
		{x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
		{x: bb1.x - 1, y: bb1.y + bb1.height / 2},
		{x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
		{x: bb2.x + bb2.width / 2, y: bb2.y - 1},
		{x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
		{x: bb2.x - 1, y: bb2.y + bb2.height / 2},
		{x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
		d = {}, dis = [];
	for (var i = 0; i < 4; i++) {
		for (var j = 4; j < 8; j++) {
			var dx = Math.abs(p[i].x - p[j].x),
				dy = Math.abs(p[i].y - p[j].y);
			if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
				dis.push(dx + dy);
				d[dis[dis.length - 1]] = [i, j];
			}
		}
	}
	if (dis.length == 0) {
		var res = [0, 4];
	} else {
		res = d[Math.min.apply(Math, dis)];
	}
	var x1 = p[res[0]].x,
		y1 = p[res[0]].y,
		x4 = p[res[1]].x,
		y4 = p[res[1]].y;
	dx = Math.max(Math.abs(x1 - x4) / 2, 10);
	dy = Math.max(Math.abs(y1 - y4) / 2, 10);
	var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
		y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
		x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
		y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
		
	arr_size=15;
	var angle = Raphael.angle(x1, y1, x4, y4);//得到两点之间的角度
		var a45 = Raphael.rad(angle - 45);//角度转换成弧度
		var a45m = Raphael.rad(angle + 45);
		var x_a_a = x4 + Math.cos(a45) * arr_size;
		var y_a_a = y4 + Math.sin(a45) * arr_size;
		var x_a_b = x4 + Math.cos(a45m) * arr_size;
		var y_a_b = y4 + Math.sin(a45m) * arr_size;
		
		
	x_a=(x1+x4)/2;
	y_a=Math.max(y1,y4)+200;
	var path= ["M",x1.toFixed(3), y1.toFixed(3), "C",x1.toFixed(3), y1.toFixed(3), x_a, y_a,x4.toFixed(3), y4.toFixed(3)].join(",");
	//console.log(path);
	
	//var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)
	//,"M",x4.toFixed(3), y4.toFixed(3),"L",x_a_a,y_a_a,"M", x4.toFixed(3), y4.toFixed(3),"L",x_a_b,y_a_b].join(",");
	 
	 
	if (line && line.line) {
		line.bg && line.bg.attr({path: path});
		line.line.attr({path: path});
		function bingToFront(obj)
		{
			setTimeout(obj.toFront(),100);
		}
		bingToFront(line.bg);
	} else {
		var color = typeof line == "string" ? line : "#000";
		return {
			bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
			line: this.path(path).attr({stroke: color, fill: "none"}),
			from: obj1,
			to: obj2
		};
	}
};

var start = function () {
	this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
	this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
	
	//this.animate({"fill-opacity": 0.2}, 500);
	moving_obj=1;
	
};
function move(dx, dy) {
	this.toFront();
	old_pos_x=this.attr("x");
	old_pos_y=this.attr("y");		
	if(paper_width)
		gensui_rate=paper_width/org_paper_width;
	else
		gensui_rate=1;
	dx=dx*gensui_rate;
	dy=dy*gensui_rate;
	
	var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
	this.attr(att);
	
	//var attr = {x: this.xx + dx, y: this.yy + dy}; 
	//this.attr(attr);
	if(this.data("cooperative"))
	{
		var lb = this.data("cooperative"); 
		var attr1 = {x: this.ox + dx + this.attr("width") / 2, y: this.oy + dy + this.attr("height") / 2+30}; 
		lb.attr(attr1); 
		lb.toFront();
	}
	if(this.data("childs"))
	{
		var obj = this.data("childs"); 
		for(var i=0;i<obj.length;i++)
		{
			obj[i].toFront();
			if(obj[i].type=="path")
				obj[i].translate(this.attr("x")-old_pos_x,this.attr("y")-old_pos_y);
			else
				obj[i].attr({x: obj[i].attr("x") + this.attr("x")-old_pos_x , y: obj[i].attr("y") + this.attr("y")-old_pos_y});
		}
	}
	
	//paper.connection(connection);
	for (var i = link_list.length; i--;) 
	{
		paper.connection(link_list[i]);
	}
	paper.safari();
},
function up() {
	//this.animate({"fill-opacity": 1}, 500);
	moving_obj=0;
};
*/	
