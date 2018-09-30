var t = 3315691, e = "https://wxservice-stg.pospal.cn/", o = null, n = !1, s = null, a = null, i = null;

App({
    onLaunch: function() {
        this.loadUserInfo(), this.loadSessionToken(), wx.hideShareMenu(), this.checkLogin();
    },
    checkOpenid: function(t) {
        null !== i ? t && t() : this.renewOpenid(t);
    },
    renewOpenid: function(t) {
        var e = this;
        wx.login({
            success: function(o) {
                o.code ? e.authRequest("/wxapi/customeraccount/Auth", {
                    storeId: e.storeId(),
                    code: o.code
                }, function(o) {
                    e.saveVisitorInfo({
                        hasOpenid: o.hasOpenid,
                        token: o.accessToken
                    }), t && t();
                }) : (wx.showModal({
                    content: "无法获取用户信息，不能进行预约!",
                    showCancel: !1
                }), t && t());
            },
            fail: function() {
                wx.showModal({
                    content: "无法获取用户信息，不能进行预约!",
                    showCancel: !1
                }), t && t();
            }
        });
    },
    setToast: function(t) {
        this.toastMessage = {
            title: t
        };
    },
    resetToast: function(t) {
        this.toastMessage = {
            title: ""
        };
    },
    showToast: function() {
        var t = this;
        t.toastMessage && t.toastMessage.title && wx.showToast({
            title: t.toastMessage.title,
            icon: "success",
            complete: function(e) {
                t.resetToast();
            }
        });
    },
    needRefresh: function() {
        return !0 === this.appState.needRefresh;
    },
    setRefresh: function() {
        this.appState.needRefresh = !0;
    },
    resetRefresh: function() {
        this.appState.needRefresh = !1;
    },
    getBaseUrl: function() {
        return e;
    },
    getBaseImgUrl: function() {
        return SERVER_IMG_BASE;
    },
    checkLogin: function() {
        null === s && (this.loadUserInfo() || wx.redirectTo({
            url: "/pages/signon/signon"
        }));
    },
    loadUserInfo: function() {
        var t = wx.getStorageSync("userInfo") || null;
        return !(!t || !t.customer) && (s = t.customer, i = t.hasOpenid || null, t.token && (a = t.token), 
        !0);
    },
    setSessionToken: function(t) {
        a = t, wx.setStorage({
            key: "SESSIONTOKEN",
            data: t,
            success: function(t) {}
        });
    },
    loadSessionToken: function() {
        var t = wx.getStorageSync("SESSIONTOKEN") || null;
        t && (a = t);
    },
    saveVisitorInfo: function(t, e) {
        i = t.hasOpenid;
        var o = wx.getStorageSync("userInfo") || {};
        o.hasOpenid = i, wx.setStorage({
            key: "userInfo",
            data: o,
            success: function(t) {
                e && "function" == typeof e && e(t);
            }
        });
    },
    saveUserInfo: function(t, e) {
        s = t.customer, t.token && this.setSessionToken(t.token);
        wx.getStorageSync("userInfo");
        t.hasOpenid = null, wx.setStorage({
            key: "userInfo",
            data: t,
            success: function(t) {
                e && "function" == typeof e && e(t);
            }
        });
    },
    logout: function() {
        var t = this;
        this.authRequest("wxapi/customeraccount/logoff", {}, function(e) {
            t.doLogout();
        }, function(e) {
            t.doLogout();
        }, "正在退出...");
    },
    doLogout: function() {
        s = null, a = null, wx.clearStorage(), wx.redirectTo({
            url: "/pages/signon/signon"
        });
    },
    getCustomer: function() {
        return s;
    },
    getUserInfo: function(t) {
        var e = this;
        this.globalData.userInfo ? "function" == typeof t && t(this.globalData.userInfo) : wx.login({
            success: function() {
                wx.getUserInfo({
                    success: function(o) {
                        e.globalData.userInfo = o.userInfo, "function" == typeof t && t(e.globalData.userInfo);
                    }
                });
            }
        });
    },
    globalData: {
        userInfo: null
    },
    toastMessage: {
        title: ""
    },
    listeners: [],
    appState: {
        needRefresh: !1
    },
    dispatch: function() {
        this.listeners.forEach(function(t) {
            return t();
        });
    },
    getState: function() {
        return this.appState;
    },
    setState: function(t) {
        this.appState = t, this.dispatch();
    },
    subscribe: function(t) {
        var e = this;
        return e.listeners.push(t), function() {
            var o = e.listeners;
            o.splice(o.indexOf(t), 1);
        };
    },
    authRequest: function(t, o, n, s, i) {
        null !== i && wx.showToast({
            title: i || "加载中",
            icon: "loading",
            duration: 6e4
        });
        var u = o.storeId || this.storeId();
        delete o.storeId;
        var r = this;
        wx.request({
            url: e + t,
            method: "POST",
            data: o,
            success: function(t) {
                t.statusCode >= 200 && t.statusCode < 300 || (s && "function" == typeof s ? s(t) : r.showError()), 
                t.header && t.header.VISITORSESSION ? (console.log("VISITORSESSION from header"), 
                r.setSessionToken(t.header.VISITORSESSION)) : t.data && t.data.VISITORSESSION && (console.log("VISITORSESSION from data"), 
                r.setSessionToken(t.data.VISITORSESSION)), t.data && t.data.NOAUTHORIZED ? wx.redirectTo({
                    url: "/pages/signon/signon"
                }) : n && "function" == typeof n && n(t.data);
            },
            header: {
                PSPLVISITORID: a,
                STOREID: u,
                PSPLVISITORAUTO: "API",
                POSPALSTOREMODE: "RegularOrder"
            },
            fail: function(t) {
                r.showError(), s && "function" == typeof s && s(t);
            },
            complete: function() {
                null !== i && wx.hideToast();
            }
        });
    },
    request: function(t, o, n, s, a) {
        null !== a && wx.showToast({
            title: a || "加载中",
            icon: "loading",
            duration: 1e4
        });
        var i = this;
        wx.request({
            url: e + t,
            method: "POST",
            data: o,
            success: function(t) {
                n && "function" == typeof n && n(t.data);
            },
            fail: function(t) {
                i.showError(), s && "function" == typeof s && s(t);
            },
            complete: function() {
                null !== a && wx.hideToast();
            }
        });
    },
    authFileRequest: function(t, o, n, s, i) {
        null !== i && wx.showToast({
            title: i || "加载中",
            icon: "loading",
            duration: 1e4
        });
        var u = o.filePath, r = o.name || "untitled", c = o.formData || {};
        wx.uploadFile({
            url: e + t,
            filePath: u,
            name: r,
            formData: c,
            header: {
                PSPLVISITORID: a,
                STOREID: o.storeId || this.storeId(),
                PSPLVISITORAUTO: "API"
            },
            success: function(t) {
                t.statusCode >= 200 && t.statusCode < 300 ? n && n(t.data) : s && "function" == typeof s && s(t.errMsg);
            },
            fail: function(t) {
                s && s(t);
            },
            complete: function() {
                null !== i && wx.hideToast();
            }
        });
    },
    storeId: function() {
        return t;
    },
    setStoreId: function(e, s) {
        e && (e !== t && (o = null, t = e, i = null), n = !0);
    },
    showError: function(t) {
        wx.showModal({
            title: t || "网络错误，请稍后再试试",
            showCancel: !1
        });
    },
    tryParseJsonStr: function(t) {
        if (null != t && "" != t) try {
            return JSON.parse(t);
        } catch (t) {
            console.log(t);
        }
        return {};
    },
    getStoreInfo: function(e, n, s) {
        var a = this;
        null != o && !n ? e && e(o) : wx.getLocation({
            type: "wgs84",
            success: function(n) {
                var i = n.latitude, u = n.longitude;
                a.authRequest("wxapi/store/GetStoreDataFast", {
                    storeId: a.storeId(),
                    latitude: i,
                    longitude: u,
                    autoSelect: !0 === s
                }, function(n) {
                    if (n.successed) {
                        var a = n.result, i = a.distanceInMeter;
                        i > 0 && (i = (i / 1e3).toFixed(1));
                        var u = {
                            distance: i,
                            storeLogo: a.logoUrl,
                            storeName: a.storeName,
                            address: a.address,
                            banners: a.Banners,
                            tel: a.tel,
                            isCustomer: a.IsCustomer,
                            isOutBizTime: a.IsOutBizTime,
                            isBizClosed: a.IsBizClosed
                        };
                        !0 === s && a.storeUserId > 0 && (t = a.storeUserId), o = u, e && e(u);
                    }
                }, function(t) {}, null);
            },
            fail: function(t) {
                var n = a;
                wx.showModal({
                    content: "无法使用你的位置信息选择门店。",
                    showCancel: !1,
                    complete: function(t) {
                        n.authRequest("wxapi/store/GetStoreDataFast", {
                            storeId: n.storeId()
                        }, function(t) {
                            if (t.successed) {
                                var n = t.result, s = {
                                    distance: 0,
                                    storeLogo: n.logoUrl,
                                    storeName: n.storeName,
                                    address: n.address,
                                    tel: n.tel,
                                    allowance: n.allowance
                                };
                                o = s, e && e(s);
                            }
                        }, function(t) {}, null);
                    }
                });
            }
        });
    }
});