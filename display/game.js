var ctx;
var mouse;
var canvas=document.getElementById('game');;

function start(){
	mouse=[0,0]
	ctx=canvas.getContext('2d');
	canvas.width=1080;
	canvas.height=720;
	ctx.fillStyle='#FFF';
	ctx.fillRect(0,0,1080,720);
	setInterval(update,40);
}

function update(){

	// Init
	ctx.clearRect(0,0,canvas.width,canvas.height);

	// Render Shapes
	var shapes=[[[100,100],[200,150],[100,250]],
				[[200,200],[350,450],[275,500],[150,350]],
				[[700,300],[900,300],[900,400],[700,400]]]; // [x1 y1 x2 y2]
	draw_shapes(shapes);

	// Def Ray
	var mid=[canvas.width/2,canvas.height/2];

	//Closest
	var min_cross=null;
	for(var i=0;i<shapes.length;i++){
		var sides=shapes[i].length;
		for(var j=0;j<sides;j++){
			var temp_cross=get_intersect(mid,mouse,shapes[i][j%sides],shapes[i][(j+1)%sides]);
			if(temp_cross!=null){

			}
		}
	}

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
	mouse=[e.clientX,e.clientY];
};

document.onload=start();
