var ctx;
var mouse;
var items;
var shapes;
var doesUpdate;
var canvas=document.getElementById('game');

function start(){
	mouse=[0,0];
	items=[];
	doesUpdate=true;
	ctx=canvas.getContext('2d');
	canvas.width=1080;
	canvas.height=720;
	ctx.fillStyle='#333';
	ctx.fillRect(0,0,1080,720);
	setInterval(update,40);
}

function update(){

	// Init
	ctx.clearRect(0,0,canvas.width,canvas.height);

	// Setup
	shapes=[ // [x1 y1 x2 y2]
				// Border
		[[0,0],[1080,0],[1080,1],[0,1]],
		[[0,0],[0,720],[1,720],[1,0]],
		[[0,720],[1080,720],[1080,650],[0,650]],
		[[1080,0],[1080,720],[1079,720],[1079,0]],

		// Level
		[[100,135],[130,135],[130,265],[170,265],[170,285],[100,285]], // L (100-170)
		[[295,135],[315,135],[315,250],[325,265],[335,265],[345,250],
		[345,135],[365,135],[365,255],[340,285],[320,285],[295,255]], // U (295-365)
		[[510,135],[540,185],[570,135],[570,285],[540,185],[510,285]], // M
		[[735,135],[765,135],[785,155],[785,265],[765,285],[755,285],[755,265],[765,255],[765,165],
		[755,155],[745,155],[735,165],[735,255],[745,265],[745,285],[735,285],[715,265],[715,155]], // O (715-785)
		[[930,135],[960,135],[980,155],[930,155],[930,200],[960,200],[980,220],[980,265],[960,285],
		[930,285],[910,265],[960,265],[960,220],[930,220],[910,200],[910,155]]]; // S (910-980)


	var vertices=get_vertices(mouse);
	draw_polygon(vertices,"#FFF");

	// Offset the mouse to create fuzzy shadows
	var offset_len=12.5;
	var offset_count=10;
	var gradient_alpha=1;
	for(var i=0;i<2*Math.PI;i+=2*Math.PI/offset_count){
		var vertices=get_vertices([mouse[0]+(offset_len*Math.cos(i)),mouse[1]+(offset_len*Math.sin(i))]);
		draw_polygon(vertices,"rgba(255,255,255,"+(gradient_alpha/offset_count)+")");
	}

	// Draw Items
	draw_items();

	// Draw Shapes
	draw_shapes(shapes);
}

function get_radians(origin,to){
	return Math.atan2(to[1]-origin[1],to[0]-origin[0]);
}

function draw_shapes(shapes){
	ctx.beginPath();
	for(var i=0;i<shapes.length;i++){
		var shape=shapes[i];
		ctx.moveTo(shape[0][0],shape[0][1]);
		var num_points=shape.length;
		for(var j=1;j<=num_points;j++){
			ctx.lineTo(shape[j%num_points][0],shape[j%num_points][1]);
		}
	}
	ctx.lineWidth=2;
	ctx.strokeStyle="#FFF";
	ctx.stroke();
	ctx.fillStyle="#323232";
	ctx.fill();
}

function collide(point){
	if(point[0]<0||point[0]>1079||point[1]<0||point[1]>719) return true;
	var pixel=ctx.getImageData(point[0],point[1],1,1).data[0];
	return pixel==50;
}

function draw_polygon(points,style){
	//Draw Polygon
	ctx.beginPath();
	ctx.moveTo(points[0][0],points[0][1]);
	for(var i=1;i<points.length;i++){
		ctx.lineTo(points[i][0],points[i][1]);
	}
	ctx.fillStyle=style;
	ctx.fill();
}

function add_item(draw_func){
	items.push(draw_func);
}

function draw_items(){
	ctx.globalCompositeOperation="source-atop";
	items.forEach(function(func){
		func(ctx,false);
	});
	ctx.globalCompositeOperation="destination-over";
	ctx.fillStyle="#FFF";
	items.forEach(function(func){
		func(ctx,true);
	});
	ctx.globalCompositeOperation="source-over";
}

function get_vertices(mouse_pos){
	// Vertices
	// Vertices
	var vertices=[];
	shapes.forEach(function(shape){
		shape.forEach(function(vertex){
			var duplicate=function(array,vertex){
				for(var i=0;i<vertices.length;i++){
					if(vertices[i][0]==vertex[0]&&vertices[i][1]==vertex[1]) return true;
				}
				return false;
			};
			if(!duplicate(vertices,vertex)){

				// Get Radians
				var curr_angle=get_radians(mouse_pos,vertex);
				vertices.push(vertex.concat([curr_angle]));

				// Get Offset
				var get_vertex=function(radians,vertex){
					var dx=10;
					return [vertex[0]+dx,vertex[1]+Math.tan(radians)*dx]
				};

				var offset=[curr_angle-0.001,curr_angle+0.001];
				vertices.push([mouse_pos[0]+Math.cos(offset[0]),mouse_pos[1]+Math.sin(offset[0]),offset[0]]);
				vertices.push([mouse_pos[0]+Math.cos(offset[1]),mouse_pos[1]+Math.sin(offset[1]),offset[1]]);
			}
		});
	});

	//Sort Counter-Clockwise
	vertices=vertices.sort(function(a,b){return a[2]-b[2]});

	var polygon=[];
	vertices.forEach(function(vertex){

		// Closest
		var min_cross=null;
		for(var i=0;i<shapes.length;i++){
			var sides=shapes[i].length;
			for(var j=0;j<sides;j++){
				var temp_cross=get_intersect([mouse_pos,vertex],[shapes[i][j%sides],shapes[i][(j+1)%sides]]);
				if(temp_cross==null) continue;
				if(min_cross==null||distance(mouse_pos,temp_cross)<distance(mouse_pos,min_cross)){
					min_cross=temp_cross;
				}
			}
		}

		if(min_cross!=null) polygon.push(min_cross);
	});

	return polygon;
}

canvas.onmousemove=function(e){
	var rect=canvas.getBoundingClientRect();
	mouse=[e.clientX-rect.left,e.clientY-rect.top];
	doesUpdate=true;
};

document.onload=start();
