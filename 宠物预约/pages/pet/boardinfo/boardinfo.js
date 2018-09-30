var t = getApp();

Page({
    data: {
        petName: "",
        petType: "",
        petUid: "",
        remark: "",
        service: "",
        storeid: "",
        storeName: "",
        eat: "",
        potty: "",
        start: "",
        end: "",
        sellPrice: 0
    },
    onLoad: function(e) {
        console.log(e);
        var a = e.eatingHabits.split(",").join(" "), s = e.pottyHabits.split(",").join(" "), o = e.petType;
        o = 1 == o ? "其他" : 2 == o ? "猫咪" : "狗狗", this.setData({
            petName: e.pet,
            petType: o,
            petUid: e.petUid,
            remark: e.remark,
            service: e.service,
            storeid: e.storeid,
            eat: a,
            potty: s,
            start: e.startDate.substring(0, 16),
            end: e.endDate.substring(0, 16),
            userName: "",
            userPassword: ""
        });
        var r = this;
        t.authRequest("wxapi/customerDirect/welcometostore", {
            storeId: this.data.storeid
        }, function(t) {
            t.successed && r.setData({
                storeName: t.store.storeName
            });
        });
    },
    getDateTime: function() {
        var t = this.data.date, e = this.data.time;
        return e && "时间..." !== e && (t = this.data.date + " " + e), console.log(t), t;
    },
    formSubmit: function(e) {
        var a = this, s = this;
        s.setData({
            bookToastHidden: !1
        }), t.authRequest("wxapi/customerDirect/makeappointment", {
            StoreId: s.data.storeid,
            DateStart: s.data.start,
            DateEnd: s.data.end,
            ExtData: JSON.stringify(s.data)
        }, function(e) {
            e.successed ? (console.log(e), s.setData({
                submitted: !0,
                bookToastHidden: !0
            }), wx.redirectTo({
                url: "/pages/pet/success/success?storeid=" + a.data.storeid
            })) : (a.setData({
                bookToastHidden: !0
            }), t.showError("无法预约所选时间"));
        }, function(e) {
            a.setData({
                bookToastHidden: !0
            }), t.showError(e.message);
        }, null);
    }
});