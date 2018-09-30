require("../../utils/util.js");

var t = getApp();

Page({
    data: {
        loaded: !1,
        store: {},
        storeId: null,
        logo: "/images/icon/store.png",
        address: ""
    },
    onLoad: function(o) {
        var e = this;
        o.storeid && t.setStoreId(o.storeid);
        var s = t.storeId(), r = this;
        t.authRequest("wxapi/customerDirect/welcometostore", {
            storeId: t.storeId()
        }, function(t) {
            t.successed ? (t.store.address.length > 20 ? r.setData({
                address: t.store.address.substring(0, 20) + "..."
            }) : r.setData({
                address: t.store.address
            }), e.setData({
                loaded: !0,
                storeId: s,
                store: t.store,
                logo: t.store.logoUrl ? t.store.logoUrl : "/images/icon/store.png"
            }), wx.setNavigationBarTitle({
                title: t.store.storeName
            })) : wx.showModal({
                title: "提示",
                content: "网络错误，请稍候再试或联系客服。",
                showCancel: !1
            });
        });
    },
    unbindBindStore: function() {
        var t = this;
        wx.showModal({
            title: "确认解除绑定？",
            success: function(o) {
                o.confirm && t.doUnbindStore();
            }
        });
    },
    doUnbindStore: function() {
        var o = this.data.storeId;
        o && t.authRequest("wxapi/customerDirect/unbindstore", {
            storeId: o
        }, function(o) {
            o.successed ? (t.setToast("解绑成功"), t.setRefresh(), wx.navigateBack()) : t.showError(o.message);
        }, function(o) {
            t.showError(o.message);
        });
    },
    onShow: function() {
        t.showToast();
    },
    gotoAppointment: function() {
        wx.navigateTo({
            url: "/pages/store/appointment/appointment?storeid=" + this.data.storeId
        });
    },
    gotoPets: function() {
        wx.navigateTo({
            url: "/pages/pet/pet?storeid=" + this.data.storeId
        });
    },
    gotoHistory: function() {
        wx.navigateTo({
            url: "/pages/history/history?storeid=" + this.data.storeId
        });
    },
    gotoPetGrooming: function() {
        wx.navigateTo({
            url: "/pages/pet/grooming/grooming?storeid=" + this.data.storeId
        });
    },
    gotoPetBoarding: function() {
        wx.navigateTo({
            url: "/pages/pet/boarding/boarding?storeid=" + this.data.storeId
        });
    },
    change: function() {
        wx.navigateTo({
            url: "/pages/index/index"
        });
    }
});