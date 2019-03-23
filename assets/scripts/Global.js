var money = 200;
var CurrentPlayerState = cc.Enum({
    White: 0,
    Black: 1
});
var economy = {
    
    getMoney:function()
    {
        return money;
    },
};
module.exports = economy;