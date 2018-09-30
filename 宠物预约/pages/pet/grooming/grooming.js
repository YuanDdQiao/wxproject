var t = require("../../../utils/utilDate.js"), e = getApp();

Page({
    data: {
        loaded: !1,
        isTimeValid: !1,
        storeId: null,
        dateFrom: "0",
        dateTo: "0",
        date: "0",
        time: "00:00",
        times: [ "时间..." ],
        bookToastHidden: !0,
        service: 0,
        submitClass: "ppg_confirm",
        btnClass: "selectBtn",
        mask: !0,
        serviceSelect: !0,
        petSelect: !0,
        staffSelect: !0,
        petUid: "",
        serviceUid: "",
        labelClass: "ppg_activeBorder",
        services: [ {
            uid: "0",
            name: "..."
        } ],
        pet: 0,
        pets: [ {
            Uid: "0",
            PetName: "..."
        } ],
        staff: 0,
        staffs: [ {
            Uid: "0",
            Name: "..."
        } ],
        petType: ""
    },
    getStaffUid: function() {
        var t = this.data.staffs[this.data.staff];
        return t ? t.Uid : "0";
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
    getPetName: function() {
        var t = this.data.pets[this.data.pet];
        return t && "..." !== t.PetName ? t.PetName : null;
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
            serviceType: "1110000",
            serviceUid: this.getServiceUid(),
            staffUid: this.getStaffUid(),
            day: this.data.date
        }, function(a) {
            if (a.successed) {
                var s = a.services;
                0 == s && s.splice(0, 0, {
                    uid: "0",
                    name: "..."
                });
                var i = a.times;
                0 == i.length && i.splice(0, 0, "时间...");
                var d = a.pets;
                0 == d.length && d.splice(0, 0, {
                    Uid: "0",
                    PetName: "..."
                }), t.setData({
                    loaded: !0,
                    services: s,
                    staffs: a.staffs,
                    times: i,
                    pets: d,
                    petType: a.pets[0].PetType
                });
            } else e.showError(a.message);
        });
    },
    bindServiceChange: function(t) {
        this.setData({
            service: t.detail.value
        }), this.loadTimes();
    },
    bindPetChange: function(t) {
        this.setData({
            pet: t.detail.value
        });
    },
    bindStaffChange: function(t) {
        this.setData({
            staff: t.detail.value
        }), this.loadTimes();
    },
    formSubmit: function(t) {
        var e = this, a = e.data.pets[e.data.pet];
        if (a && "0" !== a.Uid) {
            var s = e.data.services[e.data.service];
            if (s && "0" !== s.uid) {
                var i = e.data.times[e.data.time];
                i && "时间..." !== i ? wx.navigateTo({
                    url: "/pages/pet/orderinfo/orderinfo?storeid=" + this.data.storeId + "&service=" + this.data.services[this.data.service].name + "&serviceUid=" + (this.data.services[this.data.service].uid || "") + "&servicePrice=" + (this.data.services[this.data.service].sellPrice || 0) + "&staffUid=" + this.data.staffs[this.data.staff].Uid + "&pet=" + this.data.pets[this.data.pet].PetName + "&staff=" + this.data.staffs[this.data.staff].Name + "&date=" + this.data.date + "&time=" + this.data.times[this.data.time] + "&remark=" + t.detail.value.remark + "&petType=" + this.data.petType + "&petUid=" + this.data.pets[this.data.pet].Uid
                }) : 1 == e.data.times.length ? wx.showModal({
                    title: "无法在线预约",
                    content: "请直接联系门店客服预约",
                    showCancel: !1
                }) : wx.showModal({
                    title: "请选择时间",
                    showCancel: !1
                });
            } else wx.showModal({
                title: "请选择服务类型",
                showCancel: !1
            });
        } else wx.showModal({
            title: "请选择宠物",
            showCancel: !1
        });
    },
    submitToServer: function(t) {
        var a = this, s = this;
        s.setData({
            bookToastHidden: !1
        });
        var i = t.detail.value, d = [];
        d.push("宠物: " + (s.getPetName() || "默认")), d.push("留言: " + (i.remarks || "无"));
        var r = [];
        r.push("项目: " + (s.getServiceName() || "未选")), r.push("人员: " + (s.getStaffName() || "未选")), 
        e.authRequest("wxapi/customerDirect/makeappointment", {
            StoreId: s.data.storeId,
            DateStart: s.getDateTime(),
            ServiceUid: s.getServiceUid(),
            StaffUid: s.getStaffUid(),
            Remarks: d.join("; "),
            ExtData: r.join("; ")
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
        console.log(t), this.setData({
            date: t.detail.value
        }), this.loadTimes();
    },
    bindTimeChange: function(t) {
        console.log(t), this.setData({
            time: t.detail.value,
            submitClass: "ppg_over"
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
                if (0 == s.length ? (s.splice(0, 0, "该日期无法预约"), t.setData({
                    submitClass: "ppg_confirm"
                })) : t.setData({
                    submitClass: "ppg_over"
                }), a.staffs) {
                    var i = a.staffs;
                    t.setData({
                        time: 0,
                        times: s,
                        staffs: i
                    });
                } else t.setData({
                    time: 0,
                    times: s
                });
            } else e.showError("无法预约所选时间");
        }, null, "加载预约时间");
    },
    addPet: function() {
        var t = this.data.pets.length;
        wx.navigateTo({
            url: "/pages/pet/addpet/addpet?storeid=" + this.data.storeId + "&param=1&length=" + t
        });
    },
    petSelect: function() {
        this.setData({
            mask: !1,
            petSelect: !1
        });
    },
    staffSelect: function() {
        this.setData({
            mask: !1,
            serviceSelect: !0,
            petSelect: !0,
            staffSelect: !1
        });
    },
    serviceSelect: function() {
        this.setData({
            mask: !1,
            serviceSelect: !1,
            petSelect: !0,
            staffSelect: !0
        });
    },
    selectCancel: function() {
        this.setData({
            mask: !0,
            serviceSelect: !0,
            petSelect: !1,
            staffSelect: !0
        });
    },
    thinkSelectWhoPet: function(t) {
        console.log(t), this.setData({
            petUid: t.detail.value
        });
    },
    petSelected: function() {
        for (var t = 0; t < this.data.pets.length; t++) this.data.petUid == this.data.pets[t].Uid && this.setData({
            pet: t,
            petType: this.data.pets[t].PetType
        });
        this.setData({
            mask: !0,
            petSelect: !0
        });
    },
    thinkSelectWhoStaff: function(t) {
        console.log(t), this.setData({
            staffUid: t.detail.value
        });
    },
    staffSelected: function() {
        for (var t = 0; t < this.data.staffs.length; t++) this.data.staffUid == this.data.staffs[t].Uid && (this.setData({
            staff: t
        }), this.loadTimes());
        this.setData({
            mask: !0,
            staffSelect: !0
        });
    },
    thinkSelectWhoService: function(t) {
        console.log(t), this.setData({
            serviceUid: t.detail.value
        });
    },
    serviceSelected: function() {
        for (var t = 0; t < this.data.services.length; t++) this.data.serviceUid == this.data.services[t].uid && (this.setData({
            service: t
        }), this.loadTimes());
        this.setData({
            mask: !0,
            serviceSelect: !0,
            petSelect: !0,
            staffSelect: !0
        });
    }
});