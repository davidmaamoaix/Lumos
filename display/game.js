var ctx;
var mouse;
var doesUpdate;
var canvas=document.getElementById('game');;

function start(){
	mouse=[0,0]
	doesUpdate=true;
	ctx=canvas.getContext('2d');
	canvas.width=1080;
	canvas.height=720;
	ctx.fillStyle='#FFF';
	ctx.fillRect(0,0,1080,720);
	setInterval(update,40);
}

function update(){

	if(doesUpdate) doesUpdate=false;
	else return;

	// Init
	ctx.clearRect(0,0,canvas.width,canvas.height);

	// Setup
	var shapes=[
				// Border
				[[0,0],[1080,0],[1080,1],[0,1]],
				[[0,0],[0,720],[1,720],[1,0]],
				[[0,720],[1080,720],[1080,719],[0,719]],
				[[1080,0],[1080,720],[1079,720],[1079,0]],

				// Level				
				[[100,100],[200,150],[100,250]],
				[[200,200],[350,450],[275,500],[150,350]],
				[[700,300],[900,300],[900,400],[700,400]]]; // [x1 y1 x2 y2]

	// Def Ray
	var mid=[canvas.width/2,canvas.height/2];

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
				vertices.push(vertex);

				// Get Radians
				var dx=vertex[0]-mouse[0];
				var dy=vertex[1]-mouse[1];
				var curr_angle=Math.atan(Math.abs(dy/dx));
				if(dx*dy<0) curr_angle=Math.PI/2-curr_angle; // Quadrant I & III
				var multiplier=0;
				if(dx<0) multiplier++; // Quadrant II & III
				if(dy<0) multiplier++; // Quadrant III & IV
				if(dx>0&&dy<0) multiplier+=2; // Quadrant IV
				curr_angle+=Math.PI/2*multiplier;

				// Get Offset
				var get_vertex=function(radian,vertex){
					var dx=vertex[0]+10;
					return [dx,Math.tan(radian)*dx]
				};
				//vertices.push(get_vertex(curr_angle,vertex));
				//vertices.push(get_vertex(curr_angle-0.00001,vertex));
			}
		});
	});

	vertices.forEach(function(vertex){

		// Closest
			var min_cross=null;
			for(var i=0;i<shapes.length;i++){
				var sides=shapes[i].length;
				for(var j=0;j<sides;j++){
					var temp_cross=get_intersect([mouse,vertex],[shapes[i][j%sides],shapes[i][(j+1)%sides]]);
					if(temp_cross==null) continue;
					if(min_cross==null||distance(mouse,temp_cross)<distance(mouse,min_cross)){
						min_cross=temp_cross;
					}
				}
			}
			// Draw Closest
			ctx.beginPath()
			ctx.moveTo(mouse[0],mouse[1]);
			ctx.lineTo(min_cross[0],min_cross[1]);
			ctx.strokeStyle="#00F";
			ctx.stroke();
	});

	// Draw Shapes
	draw_shapes(shapes);
}

function draw_shapes(shapes){
	shapes.forEach(function(shape){
		ctx.beginPath();
		ctx.moveTo(shape[0][0],shape[0][1]);
		for(var i=1;i<shape.length;i++){
			ctx.lineTo(shape[i][0],shape[i][1]);
		}
		ctx.fillStyle="#999";
		ctx.fill();
	});
}

canvas.onmousemove=function(e){
	var rect=canvas.getBoundingClientRect();
	mouse=[e.clientX-rect.left,e.clientY-rect.top];
	doesUpdate=true;
};

document.onload=start();
