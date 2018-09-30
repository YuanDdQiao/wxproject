var t = getApp();

Page({
    data: {
        storeid: "",
        uid: ""
    },
    onLoad: function(e) {
        console.log(e), this.setData({
            storeid: e.storeid
        });
        var o = this;
        t.authRequest("wxapi/customerDirect/appointments", {
            storeId: e.storeid
        }, function(t) {
            t.successed && (console.log(t), o.setData({
                uid: t.appointments[0].Uid
            }));
        }), wx.hideShareMenu();
    },
    check: function() {
        wx.navigateTo({
            url: "/pages/pet/orderdetail/orderdetail?storeid=" + this.data.storeid + "&uid=" + this.data.uid
        });
    },
    goBack: function() {
        wx.navigateBack({
            delta: 2
        });
    },
    onShareAppMessage: function(t) {
        return "button" === t.from && console.log(t.target), {
            title: "",
            path: "/pages/pet/success/success?storeid=" + this.data.storeid,
            success: function(t) {
                console.log(t);
            },
            fail: function(t) {
                console.log(t);
            }
        };
    }
});