$(document).ready(function(){
    var canvas = document.getElementById('canvas');
    var stage = new JTopo.Stage(canvas);
    //显示工具栏
    //showJTopoToobar(stage);
    var scene = new JTopo.Scene(stage);
    scene.background = './img/bg.jpg';

    var node = new JTopo.Node("Hello");
    node.setLocation(409, 269);
    scene.add(node);

    node.mousedown(function(event){
        if(event.button == 2){
            node.text = '按下右键';
        }else if(event.button == 1){
            node.text = '按下中键';
        }else if(event.button == 0){
            node.text = '按下左键';
        }
    });

    node.mouseup(function(event){
        if(event.button == 2){
            node.text = '松开右键';
        }else if(event.button == 1){
            node.text = '松开中键';
        }else if(event.button == 0){
            node.text = '松开左键';
        }
    });
    node.click(function(event){
        console.log("单击");
    });
    node.dbclick(function(event){
        console.log("双击");
    });
    node.mousedrag(function(event){
        console.log("拖拽");
    });
    node.mouseover(function(event){
        console.log("mouseover");
    });
    node.mousemove(function(event){
        console.log("mousemove");
    });
    node.mouseout(function(event){
        console.log("mouseout");
    });

});