var  name_array=["Russia","Egypt","Saudi", "Uruguay",
				"Spain","Morocco","Iran","Portugal" ,
                 "Argentina","Iceland","Nigeria","Croatia",
                 "France","Australia","Peru","Denmark",
                 "Brazil","Costarica","Serbia", "Switzerland", 
                "Mexico", "Korea","Germany","Sweden",
                 "Belgium","Panama","Tunisia","England",  
                 "Japan","Senegal","Poland","Columbia",];
var color_array={

};
var __constant__={
	// timeScale=undefined,
	start_time:"2018/06/01",
	end_time:"2018/07/31",
	middle_time:"2018/06/29",
	start:15,
	blank:15,
	race_inf:undefined,
	data:undefined,
	end_point_1:{"x":720,"y":500},//定义一个淘汰终点，如果被淘汰直接拉到此点
	end_point_2:{"x":1050,"y":500},
	// end_point_3:{"x":1300,"y":500},
	// end_point_4:{"x":1300,"y":500},
	left_off:20,//用于计算横坐标
	top_off:40,//这是偏移量
	length:1400,//坐标轴的长度
	timeScale:undefined,
	point_array_map:null,
	set_pro:null,
};
$(function(){
	__constant__.point_array_map=new Map();
 	createSvg("container","svg_top");//四个参数分别为svg
 	createSvg("container","svg_bottom");
 	createAxis("svg_bottom",__constant__.start_time,__constant__.end_time);
 	load("test(1).json");
})