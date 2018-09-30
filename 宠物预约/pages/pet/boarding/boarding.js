var t = require("../../../utils/utilDate.js"), e = getApp();

Page({
    data: {
        loaded: !1,
        isTimeValid: !1,
        storeId: null,
        dateFrom: "",
        dateTo: "",
        food: !1,
        potty: !1,
        submitClass: "ppg_confirm",
        date: "0",
        time: "0",
        times: [ "时间..." ],
        date2: "0",
        time2: "0",
        times2: [ "时间..." ],
        mask: !0,
        petSelect: !0,
        bookToastHidden: !0,
        submitted: !1,
        pet: 0,
        pets: [ {
            Uid: "0",
            PetName: "..."
        } ],
        eatingHabits: [ {
            name: "早",
            id: "1"
        }, {
            name: "中",
            id: "2"
        }, {
            name: "晚",
            id: "3"
        }, {
            name: "宵夜",
            id: "4"
        } ],
        pottyHabits: [ {
            name: "早",
            id: "1"
        }, {
            name: "中",
            id: "2"
        }, {
            name: "晚",
            id: "3"
        } ]
    },
    getStaffUid: function() {
        return "0";
    },
    getDateTime: function() {
        var t = this.data.date, e = this.data.times[this.data.time];
        return e && "时间..." !== e && (t = this.data.date + " " + e + ":00"), t;
    },
    getDateTime2: function() {
        var t = this.data.date2, e = this.data.times2[this.data.time2];
        return e && "时间..." !== e && (t = this.data.date2 + " " + e + ":00"), t;
    },
    getServiceUid: function() {
        return "1120001";
    },
    getPetName: function() {
        var t = this.data.pets[this.data.pet];
        return t && "..." !== t.PetName ? t.PetName : null;
    },
    onLoad: function(e) {
        var a = e.storeid, i = new Date(), s = t.addDays(i, 1), d = t.addDays(i, 2), o = t.addDays(i, 365);
        this.setData({
            dateFrom: t.formatDate(i),
            dateTo: t.formatDate(o),
            date: t.formatDate(s),
            date2: t.formatDate(d),
            storeId: a
        });
    },
    onShow: function() {
        var t = this;
        e.showToast(), e.authRequest("wxapi/customerDirect/lookupdata", {
            storeId: this.data.storeId,
            serviceType: "1120000",
            serviceUid: this.getServiceUid(),
            day: this.data.date
        }, function(a) {
            if (a.successed) {
                var i = a.times;
                0 == i.length && i.splice(0, 0, "时间...");
                var s = a.times2;
                0 == s.length && s.splice(0, 0, "时间...");
                var d = a.pets;
                0 == d.length && d.splice(0, 0, {
                    Uid: "0",
                    PetName: "..."
                }), t.setData({
                    loaded: !0,
                    pets: d,
                    times: i,
                    times2: s
                });
            } else e.showError(a.message);
        });
    },
    formSubmit: function(t) {
        var e = this, a = e.data.pets[e.data.pet];
        if (a && "0" !== a.Uid) {
            var i = e.data.times[e.data.time];
            if (i && "时间..." !== i) {
                var s = e.data.times2[e.data.time2];
                if (s && "时间..." !== s) {
                    var d = t.detail.value;
                    0 != d.eatingHabits.length ? 0 != d.pottyHabits.length ? wx.navigateTo({
                        url: "/pages/pet/boardinfo/boardinfo?storeid=" + this.data.storeId + "&service=宠物寄养&pet=" + a.PetName + "&petUid=" + a.Uid + "&petType=" + a.PetType + "&remark=" + d.remarks + "&startDate=" + e.getDateTime() + "&endDate=" + e.getDateTime2() + "&eatingHabits=" + d.eatingHabits.join(", ") + "&pottyHabits=" + d.pottyHabits.join(", ")
                    }) : wx.showModal({
                        title: "请选择排便习惯",
                        showCancel: !1
                    }) : wx.showModal({
                        title: "请选择喂食习惯",
                        showCancel: !1
                    });
                } else wx.showModal({
                    title: "请选择结束时间",
                    showCancel: !1
                });
            } else wx.showModal({
                title: "请选择开始时间",
                showCancel: !1
            });
        } else wx.showModal({
            title: "请选择宠物",
            showCancel: !1
        });
    },
    submitToServer: function(t) {
        var a = this, i = this;
        i.setData({
            bookToastHidden: !1
        });
        var s = t.detail.value, d = [];
        d.push("宠物寄养"), d.push(i.getPetName()), d.push(i.getDateTime()), d.push(i.getDateTime2()), 
        d.push(s.eatingHabits.join(", ")), d.push(s.pottyHabits.join(", ")), d.push(s.remarks), 
        e.authRequest("wxapi/customerDirect/makeappointment", {
            StoreId: i.data.storeId,
            DateStart: i.getDateTime(),
            DateEnd: i.getDateTime2(),
            ServiceUid: i.getServiceUid(),
            Remarks: d.join("; ")
        }, function(t) {
            t.successed ? (i.setData({
                submitted: !0,
                bookToastHidden: !0
            }), e.setToast("预约成功"), wx.navigateBack()) : (a.setData({
                bookToastHidden: !0
            }), e.showError(t.message));
        }, function(t) {
            a.setData({
                bookToastHidden: !0
            }), e.showError(t.message);
        }, null);
    },
    bindPetChange: function(t) {
        this.setData({
            pet: t.detail.value
        });
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
    bindDateChange2: function(t) {
        t.detail.value < this.data.date ? wx.showModal({
            title: "结束日期不可以小于开始日期",
            showCancel: !1
        }) : (this.setData({
            date2: t.detail.value
        }), this.loadTimes2());
    },
    bindTimeChange2: function(t) {
        this.setData({
            time2: t.detail.value
        });
    },
    loadTimes: function() {
        var t = this, a = this;
        e.authRequest("wxapi/customerDirect/findpretimes", {
            storeId: a.data.storeId,
            day: a.data.date,
            serviceType: "1120000",
            serviceUid: a.getServiceUid(),
            staffUid: a.getStaffUid()
        }, function(a) {
            if (a.successed) {
                var i = a.times;
                0 == i.length && i.splice(0, 0, "时间..."), t.setData({
                    time: 0,
                    times: i
                });
            } else e.showError("所选日期不可以在线预约");
        }, null, "加载预约时间");
    },
    loadTimes2: function() {
        var t = this, a = this;
        e.authRequest("wxapi/customerDirect/findpretimes", {
            storeId: a.data.storeId,
            day: a.data.date2,
            serviceType: "1120000",
            serviceUid: a.getServiceUid(),
            staffUid: a.getStaffUid()
        }, function(a) {
            if (a.successed) {
                var i = a.times;
                0 == i.length && i.splice(0, 0, "时间..."), t.setData({
                    time: 0,
                    times2: i
                });
            } else e.showError("所选日期不可以在线预约");
        }, null, "加载预约时间");
    },
    addPet: function() {
        var t = this.data.pets.length;
        wx.navigateTo({
            url: "/pages/pet/addpet/addpet?storeid=" + this.data.storeId + "&param=1&length=" + t
        });
    },
    checkIsOk: function(t) {
        "food" == t.currentTarget.id && (t.detail.value.length > 0 ? this.setData({
            food: !0
        }) : this.setData({
            food: !1
        })), "potty" == t.currentTarget.id && (t.detail.value.length > 0 ? this.setData({
            potty: !0
        }) : this.setData({
            potty: !1
        })), 1 == this.data.potty && 1 == this.data.food ? this.setData({
            submitClass: "ppg_over"
        }) : this.setData({
            submitClass: "ppg_confirm"
        });
    },
    petSelect: function() {
        this.setData({
            mask: !1,
            petSelect: !1
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
    selectCancel: function() {
        this.setData({
            mask: !0,
            petSelect: !0
        });
    }
});