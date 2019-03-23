// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () { 
        this.node.on('touchstart', function(){
            let countCell = 8;
            if(this.getComponent("Checker"))
                cc.find("Canvas/Board").getComponent("Board").click(this.getComponent("Checker").pos);
            else if(this.getComponent("Cell"))
                cc.find("Canvas/Board").getComponent("Board").click(this.getComponent("Cell").pos);
            
            // cc.log(this);
            // cc.find("Canvas/Board").getComponent("Board").click(new cc.Vec2(this.x/32 + countCell/2, this.y/32 + countCell/2));
            // cc.find("Canvas/Board").getComponent("Board").click(this.getComponent("Checker").pos);

        }, this.node);  
    },

    start () {

    },
});
