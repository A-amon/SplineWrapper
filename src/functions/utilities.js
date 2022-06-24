/**
 * @description Generate random dark color hex code (# + 6 digits) 
 * from https://stackoverflow.com/a/20114692
 */
 function getDarkColor() {
	var color = "#";
	for (var i = 0; i < 6; i++) {
	  color += Math.floor(Math.random() * 10);
	}
	return color;
  }
  
  export { getDarkColor };
  