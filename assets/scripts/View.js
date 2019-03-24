cc.Class({
    extends: cc.Component,

    properties: {
        spriteGreenPoint: {
            default: null,
            type: cc.SpriteFrame
        }
    },
    init(countCell,widthCell){
        this.countCell = countCell; 
        this.widthCell = widthCell;
    },
    moveChecker(endPos,checker)
    {
        checker.x = (endPos.x - this.countCell/2)*this.widthCell;
        checker.y = (endPos.y - this.countCell/2)*this.widthCell;
        this.hideMove();
    },
    cutChecker(endPos,checker,cutedChecker){
        checker.x = (endPos.x - this.countCell/2)*this.widthCell;
        checker.y = (endPos.y - this.countCell/2)*this.widthCell;
        cutedChecker.active = false;
        this.hideMove();
    },
    showMove(moves){
        this.hideMove();
        for (let i = 0; i < moves.length; i++) 
        {
            let newMove = new cc.Node();
            let spriteComponent = newMove.addComponent(cc.Sprite);
            spriteComponent.spriteFrame = this.spriteGreenPoint;
            this.movesParent.addChild(newMove);
            newMove.position = new cc.Vec2((moves[i].x - this.countCell/2)*this.widthCell, (moves[i].y - this.countCell/2)*this.widthCell);
            this.moves.push(newMove);
        }
    },
    hideMove()
    {
        for (let i = 0; i < this.moves.length; i++) 
            this.moves[i].destroy();
        this.moves = [];
    },
    start () {
        this.moves = [];
        this.movesParent = new cc.Node();
        this.node.addChild(this.movesParent);
    }
});
