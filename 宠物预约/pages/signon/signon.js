var e = getApp(), t = 0;

Page({
    data: {
        bookToastHidden: !0,
        userName: "",
        userPassword: "",
        isRequesting: !1,
        countDownSeconds: 0,
        btnClass: "ppg_btn",
        storeInfo: {}
    },
    onLoad: function(t) {
        var s = this;
        e.getStoreInfo(function(e) {
            s.setData({
                storeInfo: e
            }), wx.setNavigationBarTitle({
                title: e.storeName
            });
        }), this.setData({
            userName: "",
            userPassword: ""
        });
    },
    confirm: function() {
        this.setData({
            "dialog.hidden": !0,
            "dialog.title": "",
            "dialog.content": ""
        });
    },
    login: function(t) {
        var s = this;
        this.setData({
            bookToastHidden: !1,
            isRequesting: !0
        }), e.authRequest("wxapi/customeraccount/signin", {
            customerTel: t.userName,
            securityCode: t.userPassword
        }, function(t) {
            t.successed ? (e.saveUserInfo({
                customer: t.customer,
                token: t.accessToken
            }), s.setData({
                isRequesting: !1,
                bookToastHidden: !0
            }), wx.reLaunch ? wx.reLaunch({
                url: "/pages/store/store"
            }) : wx.redirectTo({
                url: "/pages/store/store"
            })) : (s.setData({
                isRequesting: !1,
                bookToastHidden: !0
            }), wx.showModal({
                title: t.Message || "账号或密码不正确",
                showCancel: !1
            }));
        }, function(e) {
            s.setData({
                isRequesting: !1,
                bookToastHidden: !0
            });
        }, null);
    },
    formSubmit: function(e) {
        var t = this;
        if (!t.data.isRequesting) {
            var s = t.data.userName, o = t.data.userPassword, a = !0;
            if ("" == s && (a = !1), "" == o && (a = !1), a) {
                var n = {
                    userName: s,
                    userPassword: o
                };
                t.login(n);
            } else wx.showModal({
                title: "请输入电话和验证码",
                showCancel: !1
            });
        }
    },
    bindPhoneInput: function(e) {
        this.setData({
            userName: e.detail.value
        });
    },
    bindPwdInput: function(e) {
        this.setData({
            userPassword: e.detail.value
        });
    },
    countDown: function() {
        if (!(t > 0)) {
            t = 120;
            var e = this, s = setInterval(function() {
                (t -= 1) <= 0 && clearInterval(s), e.setData({
                    countDownSeconds: t,
                    btnClass: "ppg_btnGray"
                });
            }, 1e3);
        }
    },
    requestForCode: function() {
        var s = this, o = this;
        if (t > 0) wx.showModal({
            title: "不能重复发送注册验证码，请注意查收短信或请稍后重试",
            showCancel: !1
        }); else {
            var a = o.data.userName;
            "" != a ? (o.setData({
                bookToastHidden: !1
            }), e.authRequest("wxapi/customeraccount/SendSecurityCodeCode", {
                customerTel: a
            }, function(t) {
                t.Success ? (s.setData({
                    bookToastHidden: !0
                }), wx.showToast({
                    title: "验证码已经发送，请注意查收",
                    duration: 3e3
                }), o.countDown()) : (s.setData({
                    bookToastHidden: !0
                }), e.showError(t.Message));
            }, function(e) {
                s.setData({
                    bookToastHidden: !0
                });
            }, null)) : wx.showModal({
                title: "请输入电话号码",
                showCancel: !1
            });
        }
    }
});