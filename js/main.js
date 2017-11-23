var Main = function(game){

};

Main.prototype = {

	create: function() {
		console.log('!!!started!!!');
		this.game.stage.backgroundColor = "34495f";
		this.tileWidth = this.game.cache.getImage('bluePolygon').width;
		this.tileHeight = this.game.cache.getImage('bluePolygon').height;
		this.tiles = this.game.add.group();
		// Игровое поле
		this.Grid = [
			[null, null, null, null, null],
			[null, null, null, null, null],
			[null, null, null, null, null],
			[null, null, null, null, null],
			[null, null, null, null, null],
			[null, null, null, null, null]
		];
		this.tileTypes = [
			'bluePolygon',
			'greenPolygon',
			'purplePolygon',
			'redPolygon',
			'yellowPolygon'
		];
		this.freeSpace = 10;
		this.activeTile1 = null;
		this.activeTile2 = null;
		this.canMove = false;
		this.matchArr = [];
		// Добавляем хаоса
		var seed = Date.now();
		this.random = new Phaser.RandomDataGenerator([seed]);
		this.fillGrid();
	},

	update: function() {
		this.canMove = true;
		if(this.activeTile1 && this.activeTile2){
			this.canMove = false;
			this.matchArr = [];
			this.swapTiles();
			//this.activeTile1.scale.setTo(1, 1);
			//this.activeTile2.scale.setTo(1, 1);
			this.activeTile1 = null;
			this.activeTile2 = null;
			while (this.removeTiles()) {
				this.removeTiles();
				this.fillGrid();
				//this.checkMatches();
				console.log('this.matchArr !== []');
				//break;
			}
		}

	},
	
	fillGrid: function(){
		this.canMove = false;
		for(let i = 0; i < this.Grid.length; i++){
			console.log('-----');
			for(let j = 0; j < this.Grid[i].length; j++){
				if (this.Grid[i][j] === null) {
					//console.log(j);
				    //this.freeSpaceY += 20;
			    	// Выбираем цвет
			    	let tileColor = this.tileTypes[this.random.integerInRange(0, this.tileTypes.length - 1)];
			    	// Создаем тайлы в игре
			    	let tile = this.tiles.create(j*this.freeSpace + (j * this.tileWidth + this.tileWidth / 2), 0, tileColor);
			    	// Анимируем появление
			    	//var y = j; 
			    	this.game.add.tween(tile).to({y:i*this.freeSpace+i*this.tileHeight+this.tileHeight / 2}, 500, Phaser.Easing.Linear.In, true);
			    	// Устанавливаем якорь в середину тайла
			    	tile.anchor.setTo(0.5, 0.5);
			    	// Разрешаем ввод
			    	tile.inputEnabled = true;
			    	// Устанавливаем действик по нажатию
			    	tile.events.onInputDown.add(this.clickTiles, this);
			    	tile.events.onInputOver.add(this.overTiles, this);
			     	// и добавляем в массив
			    	this.Grid[i][j] = tile;
			    	//this.canMove = true;
					console.log('+');
				} else {
					console.log('-');
				}
				
				
			}
		}
	},
	
	dropTiles: function (tile) {
		// body...
	},
	
	//  Это какая - то хуйня
	clickTiles: function (tile, pointer){
		
		if(this.canMove && !this.activeTile1 && !this.activeTile2){
			this.activeTile1 = tile;
            console.log('tile1');
			this.startPosX = (tile.x - this.tileWidth/2) / this.tileWidth;
			this.startPosY = (tile.y - this.tileHeight/2) / this.tileHeight;
		}
		
	},
	
	overTiles: function (tile, pointer){
		if (this.canMove && this.activeTile1 && !this.activeTile2 && this.activeTile1 != tile){
			if (this.checkPosition(tile)){
		    		//tile.scale.setTo(1.2, 1.2);
			        this.activeTile2 = tile;
		    }
			
		}
	},
	
	swapTiles: function (){
		this.canMove = false;
		var tempTile1 = {posX:0, posY:0, x:0, y:0, pointer:null};
		var tempTile2 = {posX:0, posY:0, x:0, y:0, pointer:null};
		for (var i = 0; i < this.Grid.length; i++) {
			if (this.Grid[i].indexOf(this.activeTile1) != -1){
				tempTile1.posX = i;
				tempTile1.posY = this.Grid[i].indexOf(this.activeTile1);
				tempTile1.x = this.activeTile1.x;
				tempTile1.y = this.activeTile1.y;
				tempTile1.pointer = this.activeTile1;

				//
			}
			if (this.Grid[i].indexOf(this.activeTile2) != -1){
				tempTile2.posX = i;
				tempTile2.posY = this.Grid[i].indexOf(this.activeTile2);
				tempTile2.x = this.activeTile2.x;
				tempTile2.y = this.activeTile2.y;
				tempTile2.pointer = this.activeTile2;
			}
		}
		this.Grid[tempTile1.posX][tempTile1.posY] = tempTile2.pointer;
		this.Grid[tempTile2.posX][tempTile2.posY] = tempTile1.pointer;
		
		this.animateSwap(tempTile1, tempTile2, this.checkMatches());

	    this.activeTile1 = null;
		this.activeTile2 = null;
	},
	
	animateSwap: function(tempTile1, tempTile2, result){
		if (result){
		    this.game.add.tween(this.activeTile1).to({x:tempTile2.x, y:tempTile2.y}, 200, Phaser.Easing.Linear.In, true);
		    this.game.add.tween(this.activeTile2).to({x:tempTile1.x, y:tempTile1.y}, 200, Phaser.Easing.Linear.In, true);
		} else {
			this.Grid[tempTile1.posX][tempTile1.posY] = tempTile1.pointer;
		    this.Grid[tempTile2.posX][tempTile2.posY] = tempTile2.pointer;
		    this.game.add.tween(this.activeTile1).to({x:tempTile2.x, y:tempTile2.y}, 200, Phaser.Easing.Linear.In, true).yoyo(true).repeat(0);
	    	this.game.add.tween(this.activeTile2).to({x:tempTile1.x, y:tempTile1.y}, 200, Phaser.Easing.Linear.In, true).yoyo(true).repeat(0);
		}
			
	},
	
	
	checkPosition: function(tile){
		if (this.activeTile1.x - this.tileWidth - this.freeSpace === tile.x && this.activeTile1.y === tile.y){
			return true;
		}else if(this.activeTile1.x + this.tileWidth + this.freeSpace === tile.x && this.activeTile1.y === tile.y){
			return true;
		}else if(this.activeTile1.y - this.tileHeight - this.freeSpace === tile.y && this.activeTile1.x === tile.x){
			return true;
		}else if(this.activeTile1.y + this.tileHeight + this.freeSpace === tile.y && this.activeTile1.x === tile.x){
			return true;
		}else{
			return false;
		}
	},
	
	checkMatches: function(){
		this.matchArr = [];
		let hMatch = [];
		let vMatch = [];
		
		// ищем совпадения по горизонтали
		for (let i = 0; i < this.Grid.length; i++){
			let temp = [];
			temp.push([1, this.Grid[i][0].key]);
			for (let j = 1; j < this.Grid[i].length; j++){
                if (this.Grid[i][j].key === temp[temp.length - 1][1]){
                	//console.log(this.Grid[i][j].key);
                	temp[temp.length - 1][0]++;
                	//console.log(temp[temp.length - 1][0]);
                } else {
                	temp.push([1, this.Grid[i][j].key]);
                }
			}
			// заполняем временный горизонтальный массив (1 - к удалению 0 - не трогать)
			hMatch.push([]);
			for (let k = 0; k < temp.length; k++){
				for (let l = 0; l < temp[k][0]; l++){
					if (temp[k][0] > 2){
						hMatch[i].push(1);
					} else {
						hMatch[i].push(0);
					}
				}
			}
			//console.log(temp);
		}
		
		// ищем совпадения по вертикали
		for (let i = 0; i < this.Grid.length; i++){
			vMatch.push([]);
		}
		//console.log(vMatch);
		for (let i = 0; i < this.Grid[0].length; i++){
			let temp = [];
			temp.push([1, this.Grid[0][i].key]);
			//console.log(this.Grid[0][i].key);
			for (let j = 1; j < this.Grid.length; j++){
				//console.log(this.Grid[j][i].key);
				if (this.Grid[j][i].key === temp[temp.length - 1][1]){
                	//console.log(this.Grid[i][j].key);
                	temp[temp.length - 1][0]++;
                	//console.log(temp[temp.length - 1][0]);
                } else {
                	temp.push([1, this.Grid[j][i].key]);
                }
			}
			//console.log(temp);
			
			let pos = 0;
			for (let k = 0; k < temp.length; k++) {
				for (let l = 0; l < temp[k][0]; l++) {
					if (temp[k][0] > 2){
						vMatch[pos].push(1);
					} else {
						vMatch[pos].push(0);
					}
					pos++;
				}
			}
		}
		
		// совмещаем два массива в итоговый
		for (let i = 0; i < hMatch.length; i++) {
			this.matchArr.push([]);
			for (let j = 0; j < hMatch[0].length; j++) {
				if (hMatch[i][j] || vMatch[i][j]) {
					this.matchArr[i].push(1);
				} else {
					this.matchArr[i].push(0);
				}
			}
		}
		//console.log(this.matchArr);
		return true;
		
	},
	
	removeTiles: function() {
		for (let i = 0; i < this.matchArr.length; i++) {
			for (let j = 0; j < this.matchArr[i].length; j++) {
				if (this.matchArr[i][j] === 1) {
					this.tiles.remove(this.Grid[i][j]);
					//this.matchArr = [];
					//return true;
				}
			}
		}
		
		return false;
	},

	gameOver: function(){
		this.game.state.start('GameOver');
	}

};