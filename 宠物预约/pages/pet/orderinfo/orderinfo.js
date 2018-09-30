var e = getApp();

Page({
    data: {
        date: "",
        petName: "",
        petType: "",
        petUid: "",
        remark: "",
        service: "",
        staff: "",
        storeid: "",
        storeName: "",
        time: "",
        staffUid: "",
        serviceUid: "",
        servicePrice: 0
    },
    onLoad: function(t) {
        console.log(t);
        var a = t.petType;
        a = 1 == a ? "其他" : 2 == a ? "猫咪" : "狗狗", this.setData({
            date: t.date,
            petName: t.pet,
            petType: a,
            petUid: t.petUid,
            remark: t.remark,
            service: t.service,
            staff: t.staff,
            storeid: t.storeid,
            time: t.time,
            serviceUid: t.serviceUid,
            staffUid: t.staffUid,
            servicePrice: t.servicePrice
        });
        var s = this;
        e.authRequest("wxapi/customerDirect/welcometostore", {
            storeId: this.data.storeid
        }, function(e) {
            e.successed && s.setData({
                bookToastHidden: !0,
                storeName: e.store.storeName
            });
        });
    },
    getDateTime: function() {
        var e = this.data.date, t = this.data.time;
        return t && "时间..." !== t && (e = this.data.date + " " + t), e;
    },
    formSubmit: function(t) {
        var a = this;
        console.log(t);
        var s = this;
        s.setData({
            bookToastHidden: !1
        }), e.authRequest("wxapi/customerDirect/makeappointment", {
            StoreId: s.data.storeid,
            DateStart: s.getDateTime(),
            ServiceUid: s.data.serviceUid,
            StaffUid: s.data.staffUid,
            ServicePrice: s.data.servicePrice,
            ExtData: JSON.stringify(s.data)
        }, function(t) {
            t.successed ? (console.log(t), s.setData({
                submitted: !0,
                bookToastHidden: !0
            }), wx.redirectTo({
                url: "/pages/pet/success/success?storeid=" + a.data.storeid
            })) : (a.setData({
                bookToastHidden: !0
            }), e.showError("无法预约所选时间"));
        }, function(t) {
            a.setData({
                bookToastHidden: !0
            }), e.showError(t.message);
        }, null);
    }
});