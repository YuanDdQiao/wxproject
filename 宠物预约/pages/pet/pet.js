require("../../utils/util.js");

var t = getApp();

Page({
    data: {
        loaded: !1,
        storeId: null,
        pets: [],
        res: ""
    },
    onLoad: function(t) {
        console.log(t);
        t.storeid;
    },
    onShow: function() {
        var e = this;
        t.showToast(), t.authRequest("wxapi/customerDirect/mypets", {
            storeId: this.data.storeId
        }, function(o) {
            o.successed ? (console.log(o), e.setData({
                loaded: !0,
                pets: o.pets
            })) : t.showError(o.message);
        });
    },
    addPet: function() {
        wx.navigateTo({
            url: "/pages/pet/addpet/addpet?storeid=" + this.data.storeId
        });
    },
    editPet: function(t) {
        var e = t.currentTarget.dataset.uid, o = t.currentTarget.dataset.storeid;
        wx.redirectTo({
            url: "/pages/pet/info/info?storeid=" + o + "&petuid=" + e
        });
    },
    binderrorimg: function(t) {
        console.log(t);
    }
});