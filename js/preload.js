var Preload = function(game){};

Preload.prototype = {

	preload: function(){ 
		this.game.load.image('bluePolygon', './img/gems/element_blue_polygon.png');
		this.game.load.image('greenPolygon', './img/gems/element_green_polygon.png');
		this.game.load.image('greyPolygon', './img/gems/element_grey_polygon.png');
		this.game.load.image('purplePolygon', './img/gems/element_purple_polygon.png');
		this.game.load.image('redPolygon', './img/gems/element_red_polygon.png');
		this.game.load.image('yellowPolygon', './img/gems/element_yellow_polygon.png');

	},

	create: function(){
		this.game.state.start("Main");
	}
}