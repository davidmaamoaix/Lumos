var x;
var y;
var player_size;

function start(){
	x=100;y=625;
	player_size=50;
	setInterval(update,40);
}

function update(){

}

function draw_player(ctx){
	ctx.globalCompositeOperation="source-atop";
	ctx.fillStyle="#333";
	ctx.fillRect(x-(player_size/2),y-(player_size/2),player_size,player_size);
	ctx.globalCompositeOperation="destination-over";
	ctx.fillStyle="#FFF";
	ctx.fillRect(x-(player_size/2),y-(player_size/2),player_size,player_size);
	ctx.globalCompositeOperation="source-over";
}

document.onload=start();