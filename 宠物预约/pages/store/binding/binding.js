var t = getApp();

Page({
    data: {
        bookToastHidden: !0,
        stores: [],
        industry: 0,
        industries: [ {
            value: "宠物行业",
            name: "宠物行业"
        }, {
            value: "生活服务",
            name: "生活服务"
        }, {
            value: "母婴行业",
            name: "母婴行业"
        } ]
    },
    onLoad: function(t) {},
    pickIndustry: function(t) {
        this.setData({
            industry: t.detail.value
        });
    },
    formSubmit: function(t) {
        var e = this;
        t.detail.value.keywords ? e.submitToServer(t) : wx.showModal({
            title: "请输入店名关键字",
            showCancel: !1
        });
    },
    submitToServer: function(e) {
        var s = this, o = this;
        o.setData({
            bookToastHidden: !1
        });
        var a = e.detail.value;
        t.authRequest("wxapi/customerDirect/findstores", {
            keywords: a.keywords,
            industry: o.data.industries[o.data.industry].value
        }, function(e) {
            e.successed ? (0 == e.stores.length && wx.showModal({
                title: "没有找到记录",
                showCancel: !1
            }), o.setData({
                submitted: !0,
                bookToastHidden: !0,
                stores: e.stores
            })) : (s.setData({
                bookToastHidden: !0
            }), t.showError(e.message));
        }, function(e) {
            s.setData({
                bookToastHidden: !0
            }), t.showError(e.message);
        }, null);
    },
    bindStore: function(e) {
        var s = e.currentTarget.dataset.storeid, o = e.currentTarget.dataset.storename, a = this;
        s && wx.showModal({
            title: "是否绑定门店？",
            content: o,
            success: function(e) {
                e.confirm && (a.doBindStore(s), t.setRefresh());
            }
        });
    },
    doBindStore: function(e) {
        var s = this;
        this.setData({
            bookToastHidden: !1
        }), t.authRequest("wxapi/customerDirect/bindstore", {
            storeId: e
        }, function(e) {
            e.successed ? (s.setData({
                bookToastHidden: !0
            }), wx.showModal({
                title: "绑定成功, 返回主页？",
                cancelText: "否",
                confirmText: "是",
                success: function(t) {
                    t.confirm && wx.navigateBack();
                }
            })) : (s.setData({
                bookToastHidden: !0
            }), t.showError(e.message));
        }, function(e) {
            s.setData({
                bookToastHidden: !0
            }), t.showError(e.message);
        }, null);
    },
    gotoHome: function() {
        wx.navigateBack();
    }
});