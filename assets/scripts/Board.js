window.CurrentPlayerState = cc.Enum({
 	White: -1,
 	Black: 1
});

cc.Class({
    extends: cc.Component,

    properties: {
    	spriteUp: {
        	default: null,
        	type: cc.SpriteFrame
    	},
    	spriteLeftUp: {
        	default: null,
       	 	type: cc.SpriteFrame
    	},
    	spriteLeft: {
       	 	default: null,
       		type: cc.SpriteFrame
    	},
    	spriteLeftDown: {
       	 	default: null,
        	type: cc.SpriteFrame
    	},
    	spriteDown: {
       		default: null,
       	 	type: cc.SpriteFrame
    	},
    	spriteRightDown: {
        	default: null,
        	type: cc.SpriteFrame
    	},
     	spriteRight: {
        	default: null,
        	type: cc.SpriteFrame
    	},
    	spriteRightUp: {
        	default: null,
        	type: cc.SpriteFrame
    	},
    	spriteWhiteWood: {
        	default: null,
        	type: cc.SpriteFrame
    	},
    	spriteBlackWood: {
        	default: null,
        	type: cc.SpriteFrame
    	},
    	whiteChecker:{
			default:null,
			type:cc.Prefab
		},
    	blackChecker:{
			default:null,
			type:cc.Prefab
		},
		spriteWhiteQueen: {
        	default: null,
        	type: cc.SpriteFrame
    	},
    	spriteBlackQueen: {
        	default: null,
        	type: cc.SpriteFrame
    	},
    	spriteWhiteChecker: {
        	default: null,
        	type: cc.SpriteFrame
    	},
    	spriteBlackChecker: {
        	default: null,
        	type: cc.SpriteFrame
    	},
		cell:{
			default:null,
			type:cc.Prefab
		},
		countCell:8
    },
   	inArray(arr,item){
   		for (let i = 0; i < arr.length ;i++) 
   			if(arr[i].x == item.x && arr[i].y == item.y)
   				return i;
   		return -1;
    },
    onLoad () {

    	this.checkersArray = new Array(this.countCell);
		for (var i = 0; i < this.checkersArray.length; i++) {
  			this.checkersArray [i] = new Array(this.countCell);
		};

		this.checkersPool = new cc.NodePool('checkersPool');
    	this.currentPlayer = CurrentPlayerState.White;
    	this.selectedChecker = null;
    	this.currentCheckerStartMove = false;
    	this.requiredMoves = [];
    	this.possibleMoves = [];
    	this.victims = [];
    },
    nextPlayer(){
    	if(this.currentPlayer == CurrentPlayerState.White)
    		this.currentPlayer = CurrentPlayerState.Black;
    	else
    		this.currentPlayer = CurrentPlayerState.White;
    	this.selectedChecker = null;
    	this.currentCheckerStartMove = false;
    	this.checkEndGame();
    },
    checkEndGame(){
    	let whiteWin = true;
    	let blackWin = true;
    	for (let x = 0; x < this.countCell; x++) 
			for (let y = 0; y < this.countCell; y++)
				if(this.checkersArray[x][y] != null){
					if(this.checkersArray[x][y].getComponent("Checker").checkersColor == CurrentPlayerState.White )
						blackWin = false;
					if(this.checkersArray[x][y].getComponent("Checker").checkersColor == CurrentPlayerState.Black )
						whiteWin = false;
				}
		if(whiteWin) this.node.getComponent("View").showEndGame("White Win"); //cc.log("White Win");
		if(blackWin) this.node.getComponent("View").showEndGame("Black Win"); //cc.log("Black Win");
    },
    showMove(){
    	this.possibleMoves = [];
       	let pos = this.selectedChecker.getComponent("Checker").pos;
    	if(this.selectedChecker.getComponent("Checker").isQueen){
    		function checkMove(pos,dir){
    			if(pos.x < this.countCell && pos.x >= 0 && pos.y < this.countCell && pos.y >= 0 
    				&& this.checkersArray[pos.x][pos.y] == null){
    				this.possibleMoves.push(pos);
    				checkMove.call(this,new cc.Vec2(pos.x+dir.x, pos.y+dir.y),dir);
    			}
    		};
    		for(let x of [-1,1])
    			for(let y of [-1,1])
    				checkMove.call(this,new cc.Vec2(pos.x+x,pos.y+y),new cc.Vec2(x,y));
    	}
    	else{
    		let direction = 1;
    		if(this.selectedChecker.getComponent("Checker").checkersColor ==CurrentPlayerState.White)
    			direction = -1;
    		if(pos.x+1 < this.countCell && this.checkersArray[pos.x+1][pos.y+direction] == null)
    			this.possibleMoves.push(new cc.Vec2(pos.x+1,pos.y+direction));
    		if(pos.x-1 >= 0 && this.checkersArray[pos.x-1][pos.y+direction] == null)
    			this.possibleMoves.push(new cc.Vec2(pos.x-1,pos.y+direction));
    	}
    	this.node.getComponent("View").showMove(this.possibleMoves);
    },
    showCutMove(checker){
    	if(!checker.getComponent("Checker"))
    		return false;
    	this.requiredMoves = [];
    	this.victims = [];
    	let pos = checker.getComponent("Checker").pos;

    	if(checker.getComponent("Checker").isQueen){
    		function checkCutMove(pos,dir,cutedChecker){
    			if(pos.x < this.countCell && pos.x >= 0 && pos.y < this.countCell && pos.y >= 0){
    				if(this.checkersArray[pos.x][pos.y] == null && cutedChecker == null ){
    					checkCutMove.call(this,new cc.Vec2(pos.x+dir.x, pos.y+dir.y),dir,null);
    				}else if(this.checkersArray[pos.x][pos.y] == null && cutedChecker != null ){
    					this.requiredMoves.push(pos);
    					this.victims.push(cutedChecker);
    					checkCutMove.call(this,new cc.Vec2(pos.x+dir.x, pos.y+dir.y),dir,cutedChecker);
    				}else if(this.checkersArray[pos.x][pos.y] != null && cutedChecker == null 
    					&& this.checkersArray[pos.x][pos.y].getComponent("Checker").checkersColor != this.currentPlayer){
    					cutedChecker = this.checkersArray[pos.x][pos.y];
    					checkCutMove.call(this,new cc.Vec2(pos.x+dir.x, pos.y+dir.y),dir,cutedChecker);
    				}
    			} 
    		};
    		for(let x of [-1,1])
    			for(let y of [-1,1])
    				checkCutMove.call(this,new cc.Vec2(pos.x+x,pos.y+y),new cc.Vec2(x,y),null);
    	}else{
    		for(let x of [-1,1])
    			for(let y of [-1,1])
    				if((pos.x+x*2) < this.countCell && (pos.x+x*2) >= 0 && (pos.y+y*2) < this.countCell && (pos.y+y*2) >= 0 
    					&& this.checkersArray[pos.x+x][pos.y+y] != null 
    					&& this.checkersArray[pos.x+x][pos.y+y].getComponent("Checker").checkersColor!=this.currentPlayer
    					&& this.checkersArray[pos.x+x*2][pos.y+y*2] == null )
    				{
    					this.requiredMoves.push(new cc.Vec2(pos.x+x*2,pos.y+y*2));
    					this.victims.push(this.checkersArray[pos.x+x][pos.y+y]);
    				}
    		}

    	if(this.requiredMoves.length > 0)
    		this.node.getComponent("View").showMove(this.requiredMoves);
    	else
    		return false;
    	return true;
    },
    moveChecker(endPos){
    	let startPos = this.selectedChecker.getComponent("Checker").pos;
    	this.checkersArray[endPos.x][endPos.y] = this.checkersArray[startPos.x][startPos.y];
    	this.checkersArray[startPos.x][startPos.y] = null;
    	this.node.getComponent("View").moveChecker(endPos,this.checkersArray[endPos.x][endPos.y]);
    	this.selectedChecker.getComponent("Checker").pos = endPos;
    	this.createQueen(endPos);
    	this.selectedChecker = null;
    	this.nextPlayer();
    	this.possibleMoves = [];
    },
    createQueen(pos){
    	if(this.checkersArray[pos.x][pos.y].getComponent("Checker").checkersColor == CurrentPlayerState.White && pos.y == 0){
    		this.checkersArray[pos.x][pos.y].getComponent(cc.Sprite).spriteFrame = this.spriteWhiteQueen;
    		this.checkersArray[pos.x][pos.y].getComponent("Checker").isQueen = true;
    	} 
    	if(this.checkersArray[pos.x][pos.y].getComponent("Checker").checkersColor == CurrentPlayerState.Black && pos.y == this.countCell-1){
    		this.checkersArray[pos.x][pos.y].getComponent(cc.Sprite).spriteFrame = this.spriteBlackQueen;
    		this.checkersArray[pos.x][pos.y].getComponent("Checker").isQueen = true;
    	}
    },
    cutChecker(endPos){

    	let startPos = this.selectedChecker.getComponent("Checker").pos;
    	this.checkersArray[endPos.x][endPos.y] = this.checkersArray[startPos.x][startPos.y];
    	this.checkersArray[startPos.x][startPos.y] = null;
    	this.selectedChecker.getComponent("Checker").pos = endPos;
    	this.createQueen(endPos);

    	let cutedPos = this.victims[this.inArray(this.requiredMoves,endPos)].getComponent("Checker").pos;
    	this.checkersArray[cutedPos.x][cutedPos.y] = null;

    	this.node.getComponent("View").cutChecker(
    		endPos,this.checkersArray[endPos.x][endPos.y]);//,this.victims[this.inArray(this.requiredMoves,endPos)]);

    	this.checkersPool.put(this.victims[this.inArray(this.requiredMoves,endPos)]);

    	if(this.showCutMove(this.selectedChecker)){
    		this.currentCheckerStartMove = true;
    	}else{
    		this.currentCheckerStartMove = false;
    		this.nextPlayer();
    	}
    },
    needToChop()
    {
   		let requiredCut = false;
   		for (let x = 0; x < this.countCell; x++) 
			for (let y = 0; y < this.countCell; y++)
   				if( this.checkersArray[x][y] != null && this.checkersArray[x][y].getComponent("Checker").checkersColor == this.currentPlayer 
   					&& this.showCutMove( this.checkersArray[x][y] ) ) 
   					requiredCut = true;
   		this.node.getComponent("View").hideMove();
   		return requiredCut;
    },
    click(pos){
   		let requiredCut = this.needToChop();
   		
   		if(this.selectedChecker)
   			this.showCutMove(this.selectedChecker);

    	if ((this.checkersArray[pos.x][pos.y] != null) && !this.currentCheckerStartMove && 
    		(this.checkersArray[pos.x][pos.y].getComponent("Checker").checkersColor == this.currentPlayer)){
    		this.selectedChecker = this.checkersArray[pos.x][pos.y];
    		cc.log("Checker selected");
    		if (!requiredCut)
    			this.showMove();
    		this.showCutMove(this.selectedChecker);
    	}else if(this.checkersArray[pos.x][pos.y] == null && !requiredCut && this.inArray(this.possibleMoves,pos) != -1 
    		&& !this.currentCheckerStartMove){
    		cc.log("Move checker");
    		this.moveChecker(pos);
    	}else if(this.checkersArray[pos.x][pos.y] == null && requiredCut && this.inArray(this.requiredMoves,pos) != -1){
    		cc.log("Cut checker");
    		this.cutChecker(pos);
    	}
    },
    createBoard(countCell){
    	function createCell(sprite,pos,newCell){
    		if(newCell == null)
	    		newCell = new cc.Node();
	    	else
	    		newCell.getComponent("Cell").pos = new cc.Vec2(pos.x + this.countCell/2,pos.y + this.countCell/2);
			let spriteComponent = newCell.addComponent(cc.Sprite);
			spriteComponent.spriteFrame = sprite;
			this.node.addChild(newCell);
			newCell.position = new cc.Vec2(pos.x*this.widthCell, pos.y*this.widthCell);
    	}

    	for (let i = -countCell/2; i < countCell/2; i++) {
			createCell.call(this, this.spriteDown,new cc.Vec2(i, -countCell/2-1));
    		createCell.call(this, this.spriteUp,new cc.Vec2(i, countCell/2));
    		createCell.call(this, this.spriteLeft,new cc.Vec2(-countCell/2-1, i));
			createCell.call(this, this.spriteRight,new cc.Vec2(countCell/2, i));
		}
		createCell.call(this, this.spriteRightUp,new cc.Vec2(countCell/2, countCell/2));
    	createCell.call(this, this.spriteRightDown,new cc.Vec2(countCell/2, -countCell/2-1));
    	createCell.call(this, this.spriteLeftUp,new cc.Vec2(-countCell/2-1, countCell/2));
		createCell.call(this, this.spriteLeftDown,new cc.Vec2(-countCell/2-1, -countCell/2-1));

		for (let i = -countCell/2; i < countCell/2; i++) 
			for (let j = -countCell/2; j < countCell/2; j++)
				if((1+i+j)%2 == 0)
					createCell.call(this, this.spriteWhiteWood,new cc.Vec2(i, j),cc.instantiate(this.cell));
				else
					createCell.call(this, this.spriteBlackWood,new cc.Vec2(i, j),cc.instantiate(this.cell));
    },
    addCheckers(){
    	function createChecker(checker,pos){
    		this.checkersArray[pos.x][pos.y] = null;     
            if (this.checkersPool.size() > 0) {
                this.checkersArray[pos.x][pos.y] = this.checkersPool.get(this);
            } else {
                this.checkersArray[pos.x][pos.y] = cc.instantiate(this.whiteChecker);
            }
            this.checkersArray[pos.x][pos.y].position = 
            	new cc.Vec2((pos.x - this.countCell/2)*this.widthCell, (pos.y - this.countCell/2)*this.widthCell);
            this.checkersArray[pos.x][pos.y].getComponent(cc.Sprite).spriteFrame = checker;
            this.checkersArray[pos.x][pos.y].getComponent("Checker").pos = pos;
    		this.checkersArray[pos.x][pos.y].getComponent("Checker").isQueen = false;
    		return this.checkersArray[pos.x][pos.y];

    		// this.checkersArray[pos.x][pos.y] = cc.instantiate(checker);
    		// // this.checkersArray[pos.x][pos.y].rotation = 180;
    		// this.checkersArray[pos.x][pos.y].position = new cc.Vec2((pos.x - this.countCell/2)*this.widthCell, (pos.y - this.countCell/2)*this.widthCell);
    		// this.checkersArray[pos.x][pos.y].getComponent("Checker").pos = pos;
    		// this.checkersArray[pos.x][pos.y].getComponent("Checker").isQueen = false;
    		// this.node.addChild(this.checkersArray[pos.x][pos.y]);
    	}

    	let parent = new cc.Node();
    	parent.name = "Checkers";
    	this.node.addChild(parent);
    	for (let x = 0; x < this.countCell; x++) 
			for (let y = 0; y < this.countCell; y++){
				this.checkersArray[x][y] = null;
    			if(y >= 0 && y < 3 && ((1+x+y)%2 == 0)){
    				parent.addChild(createChecker.call(this, this.spriteBlackChecker, new cc.Vec2(x, y)));
    				// parent.addChild(createChecker.call(this, this.blackChecker, new cc.Vec2(x, y)));
    				this.checkersArray[x][y].getComponent("Checker").checkersColor = window.CurrentPlayerState.Black;
    			}
    			if(y >= this.countCell-3 && y < this.countCell && ((1+x+y)%2 == 0)){
    				parent.addChild(createChecker.call(this, this.spriteWhiteChecker, new cc.Vec2(x, y)));
    				// parent.addChild(createChecker.call(this, this.whiteChecker, new cc.Vec2(x, y)));
    				this.checkersArray[x][y].getComponent("Checker").checkersColor = window.CurrentPlayerState.White;
    			}
    		}
    	return parent;
    },
    start () {
    	this.widthCell = this.spriteBlackWood.getRect().width;
    	this.createBoard(this.countCell);
    	this.parentCheckers = this.addCheckers();
    	this.node.getComponent("View").init(this.countCell,this.widthCell);
    },
    newGame (){
    	this.node.getComponent("View").showEndGame("");
    	this.parentCheckers.destroy();
    	this.onLoad();
    	this.parentCheckers = this.addCheckers();
    	this.node.getComponent("View").hideMove();
    }
});
