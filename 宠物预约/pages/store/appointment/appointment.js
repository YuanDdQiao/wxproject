var t = require("../../../utils/utilDate.js"), e = getApp();

Page({
    data: {
        loaded: !1,
        isTimeValid: !1,
        storeId: null,
        dateFrom: "0",
        dateTo: "0",
        date: "0",
        time: "0",
        times: [ "时间..." ],
        bookToastHidden: !0,
        service: 0,
        services: [ {
            uid: "0",
            name: "..."
        } ],
        staff: 0,
        staffs: [ {
            Uid: "0",
            Name: "..."
        } ]
    },
    getStaffUid: function() {
        var t = this.data.staffs[this.data.staff];
        return console.log(this.data.staffs, this.data.staff), t ? t.Uid : "0";
    },
    getStaffName: function() {
        var t = this.data.staffs[this.data.staff];
        return t && "..." !== t.Name ? t.Name : null;
    },
    getDateTime: function() {
        var t = this.data.date, e = this.data.times[this.data.time];
        return e && "时间..." !== e && (t = this.data.date + " " + e + ":00"), t;
    },
    getServiceUid: function() {
        var t = this.data.services[this.data.service];
        return t ? t.uid : "0";
    },
    getServiceName: function() {
        var t = this.data.services[this.data.service];
        return t && "..." !== t.name ? t.name : null;
    },
    onLoad: function(e) {
        var a = e.storeid, s = new Date(), i = t.addDays(s, 1), d = t.addDays(s, 365);
        this.setData({
            dateFrom: t.formatDate(s),
            dateTo: t.formatDate(d),
            date: t.formatDate(i),
            storeId: a
        });
    },
    onShow: function() {
        var t = this;
        e.showToast(), e.authRequest("wxapi/customerDirect/lookupdata", {
            storeId: this.data.storeId,
            serviceType: "1210000",
            serviceUid: this.getServiceUid(),
            day: this.data.date
        }, function(a) {
            if (a.successed) {
                var s = a.staffs;
                s.splice(0, 0, {
                    Uid: "0",
                    Name: "..."
                });
                var i = a.services;
                0 == i && i.splice(0, 0, {
                    uid: "0",
                    name: "..."
                });
                var d = a.times;
                0 == d.length && d.splice(0, 0, "时间..."), t.setData({
                    loaded: !0,
                    staffs: s,
                    times: d,
                    services: i
                });
            } else e.showError(a.message);
        });
    },
    bindServiceChange: function(t) {
        this.setData({
            service: t.detail.value
        }), this.loadTimes();
    },
    bindStaffChange: function(t) {
        this.setData({
            staff: t.detail.value
        }), this.loadTimes();
    },
    formSubmit: function(t) {
        var e = this, a = e.data.services[e.data.service];
        if (a && "0" !== a.uid) {
            var s = e.data.times[e.data.time];
            s && "时间..." !== s ? wx.showModal({
                title: "确认预约？",
                success: function(a) {
                    a.confirm && e.submitToServer(t);
                }
            }) : 1 == e.data.times.length ? wx.showModal({
                title: "没有可以在线预约的时间段",
                content: "请直接联系门店客服预约",
                showCancel: !1
            }) : wx.showModal({
                title: "请选择时间",
                showCancel: !1
            });
        } else wx.showModal({
            title: "没有可以在线预约的服务",
            showCancel: !1
        });
    },
    submitToServer: function(t) {
        var a = this, s = this;
        s.setData({
            bookToastHidden: !1
        });
        var i = t.detail.value, d = [];
        d.push("项目: " + (s.getServiceName() || "未选")), d.push("人员: " + (s.getStaffName() || "未选"));
        var o = [];
        o.push("留言: " + (i.remarks || "无")), e.authRequest("wxapi/customerDirect/makeappointment", {
            StoreId: s.data.storeId,
            DateStart: s.getDateTime(),
            ServiceUid: s.getServiceUid(),
            StaffUid: s.getStaffUid(),
            Remarks: o.join("; "),
            ExtData: d.join("; ")
        }, function(t) {
            if (t.successed) s.setData({
                submitted: !0,
                bookToastHidden: !0
            }), e.setToast("预约成功"), wx.navigateBack(); else {
                if (a.setData({
                    bookToastHidden: !0
                }), t.times) {
                    var i = t.times;
                    0 == i.length && i.splice(0, 0, "时间..."), a.setData({
                        time: 0,
                        times: i
                    });
                }
                e.showError("无法预约所选时间");
            }
        }, function(t) {
            a.setData({
                bookToastHidden: !0
            }), e.showError(t.message);
        }, null);
    },
    bindDateChange: function(t) {
        this.setData({
            date: t.detail.value
        }), this.loadTimes();
    },
    bindTimeChange: function(t) {
        this.setData({
            time: t.detail.value
        });
    },
    loadTimes: function() {
        var t = this, a = this;
        e.authRequest("wxapi/customerDirect/findpretimes", {
            storeId: a.data.storeId,
            day: a.data.date,
            serviceType: "1110000",
            serviceUid: a.getServiceUid(),
            staffUid: a.getStaffUid()
        }, function(a) {
            if (a.successed) {
                var s = a.times;
                if (0 == s.length && s.splice(0, 0, "时间..."), a.staffs) {
                    var i = a.staffs;
                    i.splice(0, 0, {
                        Uid: "0",
                        Name: "..."
                    }), t.setData({
                        time: 0,
                        times: s,
                        staffs: i
                    });
                } else t.setData({
                    time: 0,
                    times: s
                });
            } else e.showError("所选日期不可以在线预约");
        }, null, "加载预约时间");
    },
    addPet: function() {
        wx.navigateTo({
            url: "/pages/pet/addpet/addpet?storeid=" + this.data.storeId
        });
    },
    gotoHome: function() {
        wx.navigateBack();
    }
});