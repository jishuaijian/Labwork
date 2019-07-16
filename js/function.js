function init_set(){
	__constant__.set_pro=new Set();
	for(let i=0;i<32;i++){
		if(i%4==0||i%4==3){
			__constant__.set_pro.add(name_array[i]);
		}
	}
	console.log(__constant__.set_pro);
}
function createSvg(target,id){
	d3.select("#"+target).append("svg")
					     .attr("id",id);
}
var parseDate=d3.timeParse("%Y/%m/%d");
function createAxis(tartget,begin,end){	
	begin=parseDate(begin);
	end=parseDate(end);
	timeScale=d3.scaleTime()
                   .domain([begin,end])
                   .range([0,__constant__.length]);                  
	var xAxis=d3.axisBottom(timeScale)
	  				.ticks(30)
	  				.tickFormat(d3.timeFormat("%Y/%m/%d"));
    d3.select("#"+tartget).append("g")
       .attr("class","axis")
       .attr("id","g")
       .attr("transform","translate("+__constant__.left_off+","+__constant__.top_off+")")    //???????标记
       .call(xAxis)
       .selectAll("text")
	   .attr("transform", "rotate(-70)")
	   .style("text-anchor", "end");
}
function init_point(){//初始化映射，每个球队映射一个数组，数组中是一个坐标对象，
	for(let i=0;i<32;i++){
		var coor_x=timeScale(parseDate(__constant__.start_time));
		var coor_y=__constant__.start+i*__constant__.blank;
		var coor={"x":coor_x,"y":coor_y};
		var empty=[];
		empty.push(coor);
		__constant__.point_array_map.set(name_array[i],empty);
	}
}
function load(src){
	d3.json(src).then(function(json){
		init_set();
		init_point();
		// console.log(__constant__.point_array_map);
		// alert(__constant__.point_array_map.get(1).length);
		race_cycle(json,__constant__.start_time,__constant__.end_time,__constant__.middle_time);
		// alert(__constant__.point_array_map.get(1).length);
		// console.log(__constant__.point_array_map);
		createCircles();
		createLine();
		// createArea();
	});
}
var DateToString=d3.timeFormat("%Y/%m/%d");

function race_cycle(data,start_time,end_time,middle_time){//这里的参数均为String类型
	var tem_start=parseDate(start_time);   //将三个时间转换Date类型
	var tem_end=parseDate(end_time);
	var tem_middle=parseDate(middle_time);
	for(let i=tem_start;i<=tem_end; i.setDate(i.getDate()+1)){
		i=DateToString(i);
		console.log(i);
		One_day(data,i,middle_time);//两个时间均为String类型
		i=parseDate(i);
	}
}
function One_day(data,time,middle_time){
     
	var all_race=data[time];//获取某天的所有比赛，对每一场比赛进行逐次处理,这里可能获取不到比赛信息，则all_race为undefined
	var time_date=parseDate(time);//获取DATE类型的日期，用于进行时间的加减法
	var start_time_date=parseDate(__constant__.start_time);
	var middle_time_date=parseDate(__constant__.middle_time);//这里要用月份进行一次判断
	var judge=(time_date.getMonth()<middle_time_date.getMonth())||(((time_date.getMonth()==middle_time_date.getMonth())&&(time_date.getDate()<=middle_time_date.getDate())));
	console.log(judge);
	if(judge){//判断是小组赛还是淘汰赛
		if(all_race!==undefined){
			for(let i=0;i<all_race.length;i++){//通过一个循环将所有比赛处理完毕
				phase_1(all_race[i][0],all_race[i][1],time);
		    }
		}	
		__constant__.point_array_map.forEach(function(value,key,map){
			var num=value.length;
			// dateSpan = sDate2 - sDate1;
		    //dateSpan = Math.abs(dateSpan);
		    //iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
			var int=Math.floor((time_date-start_time_date)/(24*3600*1000));
			if(num>int){ //判断今天有无比赛，通过节点数组的长度来确定,如果长度大于则说明今天的坐标已经更新
			}else{//更新今天没有比赛的球队的坐标，没有比赛，则横坐标平移一条，纵坐标返回初始纵坐标
				var coor={};
				coor.x=timeScale(parseDate(time));
				coor.y=value[0].y;
				value.push(coor);
				__constant__.point_array_map.set(key,value);
			}

		});
		var judge_2=(time_date.getMonth()==middle_time_date.getMonth())&&(time_date.getDate()==middle_time_date.getDate());
		console.log(judge_2);
		if(judge_2){
			__constant__.point_array_map.forEach(function(value,key,map){
				if(!__constant__.set_pro.has(key)){
					value.push(__constant__.end_point_1);
					__constant__.point_array_map.set(key,value);
				}
			});
		}
	}else{//处理淘汰赛
		if(all_race!==undefined){
			for(let i=0;i<all_race.length;i++){//通过一个循环将所有比赛处理完毕
				phase_2(all_race[i][0],all_race[i][1],time,all_race[i][2]);
			}
		}
	}	
}
function phase_1(queue_a,queue_b,time){
	var coor_a_arr=__constant__.point_array_map.get(queue_a);
	var coor_a=coor_a_arr[coor_a_arr.length-1];
	var coor_b_arr=__constant__.point_array_map.get(queue_b);//得到球队b的坐标队列
	var coor_b=coor_b_arr[coor_b_arr.length-1];//得到球队b的坐标
	// if(race==="null"){  //说明没有比赛
	// 	coor_a.x=timeScale(time);//横坐标根据比例尺确定,纵坐标不变
	// 	coor_a_arr.push(coor_a);//a的新点压入数组
	// 	__constant__.point_array_map.set(queue_a,coor_a_arr);//更新映射
	// 	coor_b.x=timeScale(time);	
	// }else{
	var temp_a={};
	var temp_b={};
	time=parseDate(time);
	temp_a.x=timeScale(time);//根据时间确定横坐标
	temp_a.y=(coor_a.y+coor_b.y)/2;//根据中点确定纵坐标
	temp_b.x=timeScale(time);
	temp_b.y=(coor_a.y+coor_b.y)/2;
	// }
	//将新的节点压入节点数组
	coor_a_arr.push(temp_a);
	coor_b_arr.push(temp_b);
	//更新映射
	__constant__.point_array_map.set(queue_a,coor_a_arr);
	__constant__.point_array_map.set(queue_b,coor_b_arr);
}

function phase_2(queue_a,queue_b,time){
	var coor_a_arr=__constant__.point_array_map.get(queue_a);
	var coor_a=coor_a_arr[coor_a_arr.length-1];
	var coor_b_arr=__constant__.point_array_map.get(queue_b);//得到球队b的坐标队列
	var coor_b=coor_b_arr[coor_b_arr.length-1];//得到球队b的坐标
	// if(result===0){//代表球队a失败，则下一定点直接拉到终点，球队b 节点计算
	// 	var temp=coor_a;     
	// 	coor_a=__constant__.end_point;
	// 	coor_b.x=timeScale(time);
	// 	coor_b.y=(temp.y+coor_b.y)/2;
	// }else{//球队b失败类似处理，
	var temp_a={};
	var temp_b={};
    time=parseDate(time);
	temp_a.x=timeScale(time);
	temp_a.y=(coor_a.y+coor_b.y)/2;
	temp_b.x=timeScale(time);
	temp_b.y=(coor_a.y+coor_b.y)/2;
	// }
	//现在要将新的节点压入数组
	coor_a_arr.push(temp_a);
	coor_b_arr.push(temp_b);

	// var temp_b_2=__constant__.end_point_2;
	// coor_b_arr.push(temp_b_2);
	//最后更新映射
	__constant__.point_array_map.set(queue_a,coor_a_arr);
	__constant__.point_array_map.set(queue_b,coor_b_arr);
}

//根据坐标队列在图上画点
function createCircles(){
	__constant__.point_array_map.forEach(function(value,key,map){
			d3.select("#svg_top").selectAll("circle_"+key)
			  .data(value)
			  .enter()
			  .append("circle")
			  .attr("r",3)
			  .attr("cx",function(d){
			  	return d.x+__constant__.left_off;
			  })
			  .attr("cy",function(d){
			  	return d.y;
			  })
			  .attr("class","circle_"+key);
	});
}

function createLine(){
	var color=d3.scaleOrdinal(d3.schemeCategory10);
	__constant__.point_array_map.forEach(function(value,key,map){
		var linePath=d3.line()
						   .x(function(d){
						   	return d.x;
						   })
						   .y(function(d){
						   	return d.y;
						   });
		d3.select("#svg_top").append("path")
		  .attr("d",linePath(value))
		  .attr("fill","none")
		  .attr("stroke",function(d,i){
		  	return color(i);
		  })
		  .attr("transform","translate(20,0)")
		  ;
	});
}

function createArea(){
	__constant__.point_array_map.forEach(function(value,key,map){
		var areaPath=d3.area()
						   // .curve(d3.curveCardinal)
						   .x(function(d){
						   	return d.x;
						   })
						   .y0(function(d){
						   	return d.y-3;
						   })
						   .y1(function(d){
						   	return d.y+3;
						   });

		d3.select("#svg_top").append("path")
		  .attr("d",areaPath(value))
		  .attr("fill","red")
		  // .attr("interpolate","basis")
		  // .attr("stroke",function(d,i){
		  // 	return color(i);
		  // })
		  .attr("transform","translate(20,0)")
		  ;
	});
}