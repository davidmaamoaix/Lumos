function get_intersect(ray,line){

	// Changes in Position
	var ray_dx=ray[1][0]-ray[0][0];
	var ray_dy=ray[1][1]-ray[0][1];
	var line_dx=line[1][0]-line[0][0];
	var line_dy=line[1][1]-line[0][1];

	// Parallel
	if(line_dy/line_dx==ray_dy/ray_dx) return null;

	var delta=((line[0][1]-ray[0][1])*ray_dx+(ray[0][0]-line[0][0])*ray_dy)/(ray_dy*line_dx-ray_dx*line_dy);
	var percentage=(line[0][0]+line_dx*delta-ray[0][0])/ray_dx;

	if(percentage<0||delta<0||delta>1) return null;

	return [ray[0][0]+ray_dx*percentage,ray[0][1]+ray_dy*percentage];
}

function distance(a,b){
	return Math.sqrt((a[0]-b[0])**2+(a[1]-b[1])**2);
}

function add(a,b){
	return [a[0]+b[0],a[1]+b[1]];
}

function scale(vec,scaler){
	return [vec[0]*scaler,vec[1]*scaler];
}