function t(t) {
    if (Array.isArray(t)) {
        for (var a = 0, e = Array(t.length); a < t.length; a++) e[a] = t[a];
        return e;
    }
    return Array.from(t);
}

var a = getApp();

Page({
    data: {
        storeId: "",
        modal: !0,
        uid: "",
        appointments: [],
        isShow: !0,
        storeName: ""
    },
    onLoad: function(t) {
        var e = this;
        console.log(t), this.setData({
            storeId: t.storeid,
            uid: t.uid
        }), a.authRequest("wxapi/customerDirect/appointments", {
            storeId: this.data.storeId
        }, function(t) {
            if (t.successed) for (var s = 0; s < t.appointments.length; s++) t.appointments[s].DateStart = t.appointments[s].DateStart.substring(0, 16), 
            t.appointments[s].DateEnd = t.appointments[s].DateEnd.substring(0, 16), e.data.uid == t.appointments[s].Uid && (t.appointments[s].ExtDataJson = a.tryParseJsonStr(t.appointments[s].ExtData), 
            e.setData({
                appointments: t.appointments[s]
            }), "" == t.appointments[s].StaffName ? e.setData({
                isShow: !0
            }) : e.setData({
                isShow: !1
            }));
            console.log(e.data.appointments);
        });
        var s = this;
        a.authRequest("wxapi/customerDirect/welcometostore", {
            storeId: this.data.storeId
        }, function(t) {
            t.successed && s.setData({
                storeName: t.store.storeName
            });
        });
    },
    back: function() {
        this.setData({
            modal: !0
        });
    },
    continue: function() {
        wx.navigateBack({
            delta: 2
        });
    },
    cancel: function() {
        this.setData({
            modal: !1
        });
    },
    confirm: function() {
        var e = this, s = this;
        a.authRequest("wxapi/customerDirect/cancelappointment", {
            storeId: s.data.storeId,
            uid: s.data.uid
        }, function(a) {
            if (a.successed) {
                for (var n = s.data.appointments, o = -1, i = 0; i < n.length; i++) if (n[i].Uid == uid) {
                    o = i;
                    break;
                }
                o >= 0 && (n = [].concat(t(n.slice(0, o)), t(n.slice(o + 1)))), e.setData({
                    appointments: n
                }), wx.navigateTo({
                    url: "/pages/pet/cancelSuccess/cancelSuccess?storeid=" + s.data.storeId
                });
            } else wx.navigateTo({
                url: "/pages/pet/cancelFail/cancelFail?storeid=" + s.data.storeId
            });
        }, function(t) {
            a.showError(t.message);
        }, null);
    }
});