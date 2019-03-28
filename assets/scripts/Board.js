window.CurrentPlayerState = cc.Enum({
 	White: -1,
 	Black: 1
});

cc.Class({
    extends: cc.Component,

    properties: {
		spriteWhiteQueen: {
        	default: null,
        	type: cc.SpriteFrame
    	},
    	spriteBlackQueen: {
        	default: null,
        	type: cc.SpriteFrame
    	},
		isRotate: {
            default: null,
            type: cc.Node
        },
		countCell:8
    },
   	inArray(arr,item){//check element Vec2 in array
   		for (let i = 0; i < arr.length ;i++) 
   			if(arr[i].x == item.x && arr[i].y == item.y)
   				return i;
   		return -1;
    },
    nextPlayer(){//change curent player on other
    	if(this.currentPlayer == CurrentPlayerState.White)
    		this.currentPlayer = CurrentPlayerState.Black;
    	else
    		this.currentPlayer = CurrentPlayerState.White;
    	this.selectedChecker = null;
    	this.currentCheckerStartMove = false;
    	this.checkEndGame();
    	if(this.isRotate.getComponent(cc.Toggle).isChecked){
    		this.node.rotation = 180 * this.currentPlayer;
    		for (let x = 0; x < this.countCell; x++) 
				for (let y = 0; y < this.countCell; y++)
					if(this.checkersArray[x][y] != null)
						this.checkersArray[x][y].rotation = 180* this.currentPlayer;
		}	
    },
    checkEndGame(){//check if the game ended
    	let whiteWin = true;
    	let blackWin = true;
    	for (let x = 0; x < this.countCell; x++) 
			for (let y = 0; y < this.countCell; y++)
				if(this.checkersArray[x][y] != null){
					if(this.checkersArray[x][y].getComponent("Checker").checkersColor == CurrentPlayerState.White )
						blackWin = false;
					else
						whiteWin = false;
				}
		if(whiteWin) this.node.getComponent("View").showEndGame("White Win"); 
		if(blackWin) this.node.getComponent("View").showEndGame("Black Win"); 
    },
    showMove(){//show posible move for selected checker
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
    		let direction = -1;
    		if(this.selectedChecker.getComponent("Checker").checkersColor == CurrentPlayerState.White)
    			direction = 1;
    		if(pos.x+1 < this.countCell && this.checkersArray[pos.x+1][pos.y+direction] == null)
    			this.possibleMoves.push(new cc.Vec2(pos.x+1,pos.y+direction));
    		if(pos.x-1 >= 0 && this.checkersArray[pos.x-1][pos.y+direction] == null)
    			this.possibleMoves.push(new cc.Vec2(pos.x-1,pos.y+direction));
    	}
    	this.node.getComponent("View").showMove(this.possibleMoves);
    },
    showCutMove(checker){//show required move for checker
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
    moveChecker(endPos){//move selectedChecker to endPos
    	let startPos = this.selectedChecker.getComponent("Checker").pos;
    	this.checkersArray[endPos.x][endPos.y] = this.checkersArray[startPos.x][startPos.y];
    	this.checkersArray[startPos.x][startPos.y] = null;
    	this.checkQueen(endPos);
    	this.node.getComponent("View").moveChecker(endPos,this.checkersArray[endPos.x][endPos.y]);
    	this.selectedChecker.getComponent("Checker").pos = endPos;
    	this.selectedChecker = null;
    	this.nextPlayer();
    	this.possibleMoves = [];
    },
    checkQueen(pos){//check whether the checker is a queen
    	let checker = this.checkersArray[pos.x][pos.y].getComponent("Checker");
    	if((checker.checkersColor == CurrentPlayerState.White && pos.y == this.countCell-1)
    		||(checker.checkersColor == CurrentPlayerState.Black && pos.y == 0))
    		this.node.getComponent("View").createQueen(checker);
    },
    cutChecker(endPos){//cut checker in position endPos
    	let startPos = this.selectedChecker.getComponent("Checker").pos;
    	this.checkersArray[endPos.x][endPos.y] = this.checkersArray[startPos.x][startPos.y];
    	this.checkersArray[startPos.x][startPos.y] = null;
    	this.selectedChecker.getComponent("Checker").pos = endPos;
    	this.checkQueen(endPos);

    	let cutedPos = this.victims[this.inArray(this.requiredMoves,endPos)].getComponent("Checker").pos;
    	this.checkersArray[cutedPos.x][cutedPos.y] = null;

    	this.node.getComponent("View").moveChecker(endPos,this.checkersArray[endPos.x][endPos.y]);
    	this.getComponent("View").deleteChecker(this.victims[this.inArray(this.requiredMoves,endPos)]);

    	if(this.showCutMove(this.selectedChecker)){
    		this.currentCheckerStartMove = true;
    	}else{
    		this.currentCheckerStartMove = false;
    		this.nextPlayer();
    	}
    },
    needToChop()//check if you should to chop on this turn
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
    click(pos){//click on a cell or checker
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
    start () {
    	this.checkersArray = new Array(this.countCell);
		for (var i = 0; i < this.checkersArray.length; i++) {
  			this.checkersArray [i] = new Array(this.countCell);
		};
    	this.currentPlayer = CurrentPlayerState.White;
    	this.selectedChecker = null;
    	this.currentCheckerStartMove = false;
    	this.requiredMoves = [];
    	this.possibleMoves = [];
    	this.victims = [];
    	this.node.getComponent("View").init(this.countCell);
    	this.parentCheckers = this.node.getComponent("View").addCheckers(this.checkersArray);
    },
    newGame (){//creating a new game
    	this.node.getComponent("View").showEndGame("");
    	this.parentCheckers.destroy();
    	this.start();
    	this.node.getComponent("View").hideMove();
    }
});
