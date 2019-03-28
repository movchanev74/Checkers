cc.Class({
    extends: cc.Component,
    properties: {
        pos: { 
            get () {
                return this._pos;
            },
            set (value) {
                this._pos = value;
            }
        }
    }
});
