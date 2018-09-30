require("../../utils/util.js");

var t = getApp();

Page({
    data: {
        loaded: !1,
        storeId: null,
        pets: []
    },
    onLoad: function(t) {
        t.storeid;
    },
    onShow: function() {
        var e = this;
        t.showToast(), t.authRequest("wxapi/customerDirect/mypets", {
            storeId: this.data.storeId
        }, function(s) {
            s.successed ? e.setData({
                loaded: !0,
                pets: s.pets
            }) : t.showError(s.message);
        });
    },
    addPet: function() {
        wx.navigateTo({
            url: "/pages/pet/addpet/addpet?storeid=" + this.data.storeId
        });
    },
    editPet: function(t) {
        var e = t.currentTarget.dataset.uid;
        wx.navigateTo({
            url: "/pages/pet/editpet/editpet?storeid=" + this.data.storeid + "&petuid=" + e
        });
    }
});