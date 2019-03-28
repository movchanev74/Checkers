cc.Class({
    extends: cc.Component,

    properties: {
    },
    onLoad () { //function called on load
        this.node.on('touchstart', function(){
            let pos;
            if(this.getComponent("Checker")){
                pos = this.getComponent("Checker").pos;
                cc.find("Canvas/Board").getComponent("Board").click(pos);
            }
            else if(this.getComponent("Cell")){
                pos = this.getComponent("Cell").pos;
                cc.find("Canvas/Board").getComponent("Board").click(pos);
            }

        }, this.node);  
    },
    rotateClick(){
        cc.find("Canvas/Board").getComponent("Board").setRotate(this.node.getComponent(cc.Toggle).isChecked);
    }
});
