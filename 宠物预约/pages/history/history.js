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
        toastHidden: !0,
        year: 0,
        month: 2,
        byMonth: !1,
        years: [ {
            value: 2017,
            name: "2017"
        } ],
        months: [ {
            value: 1,
            name: "1月"
        }, {
            value: 2,
            name: "2月"
        }, {
            value: 3,
            name: "3月"
        }, {
            value: 4,
            name: "4月"
        }, {
            value: 5,
            name: "5月"
        }, {
            value: 6,
            name: "6月"
        }, {
            value: 7,
            name: "7月"
        }, {
            value: 8,
            name: "8月"
        }, {
            value: 9,
            name: "9月"
        }, {
            value: 10,
            name: "10月"
        }, {
            value: 11,
            name: "11月"
        }, {
            value: 12,
            name: "12月"
        } ],
        storeId: null,
        total: 0,
        appointments: []
    },
    pickYear: function(t) {
        this.setData({
            year: t.detail.value
        });
    },
    pickMonth: function(t) {
        this.setData({
            month: t.detail.value
        });
    },
    onLoad: function(t) {
        var e = this;
        console.log(t);
        var n = t.storeid, o = new Date().getMonth();
        this.setData({
            storeId: n,
            month: o
        }), a.authRequest("wxapi/customerDirect/appointments", {
            storeId: n
        }, function(t) {
            if (t.successed && (console.log(t), t.appointments.length > 0)) {
                for (var n = 0; n < t.appointments.length; n++) t.appointments[n].DateStart = t.appointments[n].DateStart.substring(0, 16).split("-").join("."), 
                t.appointments[n].DateEnd = t.appointments[n].DateEnd.substring(0, 16).split("-").join("."), 
                t.appointments[n].ExtDataJson = a.tryParseJsonStr(t.appointments[n].ExtData);
                e.setData({
                    loaded: !0,
                    appointments: t.appointments
                });
            }
            console.log(e.data.appointments);
        });
    },
    formSubmit: function(t) {
        var e = this, n = this;
        n.setData({
            bookToastHidden: !1
        });
        t.detail.value;
        a.authRequest("wxapi/customerDirect/appointments", {
            storeId: n.data.storeId,
            year: n.data.years[n.data.year].value || 2017,
            month: n.data.months[n.data.month].value || 1
        }, function(t) {
            t.successed ? (0 == t.appointments.length && wx.showModal({
                title: "没有找到记录",
                showCancel: !1
            }), n.setData({
                submitted: !0,
                byMonth: !0,
                bookToastHidden: !0,
                appointments: t.appointments
            })) : (e.setData({
                bookToastHidden: !0
            }), a.showError(t.message));
        }, function(t) {
            e.setData({
                bookToastHidden: !0
            }), a.showError(t.message);
        }, null);
    },
    cancelAppt: function(t) {
        var a = this, e = t.currentTarget.dataset.uid;
        wx.showModal({
            title: "是否取消预约？",
            success: function(t) {
                t.confirm && a.doCancelAppt(e);
            }
        });
    },
    doCancelAppt: function(e) {
        var n = this, o = this;
        o.setData({
            bookToastHidden: !1
        }), a.authRequest("wxapi/customerDirect/cancelappointment", {
            storeId: o.data.storeId,
            uid: e
        }, function(s) {
            if (s.successed) {
                for (var i = o.data.appointments, r = -1, d = 0; d < i.length; d++) if (i[d].Uid == e) {
                    r = d;
                    break;
                }
                r >= 0 && (i = [].concat(t(i.slice(0, r)), t(i.slice(r + 1)))), n.setData({
                    bookToastHidden: !0,
                    appointments: i
                }), wx.showToast({
                    title: "预约已经取消",
                    duration: 3e3
                });
            } else n.setData({
                bookToastHidden: !0
            }), a.showError("无法取消预约");
        }, function(t) {
            n.setData({
                bookToastHidden: !0
            }), a.showError(t.message);
        }, null);
    },
    addOrder: function() {
        wx.navigateBack();
    },
    goDetail: function(t) {
        wx.navigateTo({
            url: "/pages/pet/orderdetail/orderdetail?storeid=" + this.data.storeId + "&uid=" + t.currentTarget.dataset.uid
        });
    }
});