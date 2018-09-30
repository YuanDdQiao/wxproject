var e = getApp();

Page({
    data: {
        bookToastHidden: !0,
        loaded: !1,
        stores: [],
        loading: !0,
        rawStores: [],
        viewStores: [],
        keyword: "",
        bindStores: []
    },
    onLoad: function() {
        this.data.loaded || this.loadData();
    },
    loadData: function() {
        var t = this;
        e.authRequest("wxapi/customerDirect/mystores", {}, function(s) {
            s.successed ? (t.setData({
                loaded: !0,
                stores: s.stores,
                bindStores: s.stores
            }), 0 == s.stores.length && t.doBindStore(e.storeId(), function() {
                wx.reLaunch ? wx.reLaunch({
                    url: "/pages/store/store"
                }) : wx.redirectTo({
                    url: "/pages/store/store"
                });
            })) : e.showError(s.message);
        });
    },
    onShow: function() {
        e.showToast(), e.needRefresh() && (this.loadData(), e.resetRefresh());
    },
    formSubmit: function(e) {
        console.log(e);
        var t = this;
        e.detail.value.keywords ? t.submitToServer(e) : wx.showModal({
            title: "请输入店名关键字",
            showCancel: !1
        });
    },
    submitToServer: function(t) {
        var s = this, o = this;
        o.setData({
            bookToastHidden: !1
        });
        var r = t.detail.value;
        e.authRequest("wxapi/customerDirect/findstores", {
            keywords: r.keywords,
            industry: "宠物行业"
        }, function(t) {
            t.successed ? (0 == t.stores.length && wx.showModal({
                title: "没有找到记录",
                showCancel: !1
            }), o.setData({
                submitted: !0,
                bookToastHidden: !0,
                stores: t.stores
            })) : (s.setData({
                bookToastHidden: !0
            }), e.showError(t.message));
        }, function(t) {
            s.setData({
                bookToastHidden: !0
            }), e.showError(t.message);
        }, null);
    },
    bindStore: function(t) {
        for (var s = t.currentTarget.dataset.storeid, o = t.currentTarget.dataset.storename, r = this, a = !1, n = 0; n < this.data.bindStores.length; n++) s == this.data.bindStores[n].storeUserId && (a = !0);
        s && a ? wx.reLaunch ? wx.reLaunch({
            url: "/pages/store/store?storeid=" + s
        }) : wx.redirectTo({
            url: "/pages/store/store?storeid=" + s
        }) : s && 0 == a && wx.showModal({
            title: "是否绑定门店？",
            content: o,
            success: function(t) {
                t.confirm && (r.doBindStore(s), e.setRefresh());
            }
        });
    },
    doBindStore: function(t, s) {
        var o = this;
        this.setData({
            bookToastHidden: !1
        }), e.authRequest("wxapi/customerDirect/bindstore", {
            storeId: t
        }, function(t) {
            t.successed ? (o.setData({
                bookToastHidden: !0
            }), s ? s() : wx.showModal({
                title: "绑定成功, 返回主页？",
                cancelText: "否",
                confirmText: "是",
                success: function(e) {
                    e.confirm && wx.navigateBack();
                }
            })) : (o.setData({
                bookToastHidden: !0
            }), e.showError(t.message));
        }, function(t) {
            o.setData({
                bookToastHidden: !0
            }), e.showError(t.message);
        }, null);
    }
});