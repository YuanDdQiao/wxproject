require("../../../utils/utilDate.js");

var t = getApp();

Page({
    data: {
        storeid: null,
        petUid: null,
        pets: [],
        infoClass: "ppg_active",
        orderClass: "",
        isPhotoHidden: !0,
        appointments: []
    },
    onLoad: function(e) {
        var s = this, a = (e.storeid, e.petuid);
        t.showToast(), t.authRequest("wxapi/customerDirect/mypets", {
            storeId: this.data.storeid
        }, function(e) {
            if (e.successed) for (var i = 0; i < e.pets.length; i++) e.pets[i].Uid == a && (e.pets[i].PetBirthDay && (e.pets[i].PetBirthDay = e.pets[i].PetBirthDay.substring(0, 10)), 
            e.pets[i].PetsPhotoFull && "" != e.pets[i].PetsPhotoFull && s.setData({
                isPhotoHidden: !1
            }), s.setData({
                pets: e.pets[i]
            })); else t.showError(e.message);
        }), t.authRequest("wxapi/customerDirect/appointments", {
            storeId: this.data.storeid
        }, function(e) {
            if (e.successed && (console.log(e), e.appointments.length > 0)) {
                for (var i = [], n = 0; n < e.appointments.length; n++) e.appointments[n].ExtDataJson = t.tryParseJsonStr(e.appointments[n].ExtData), 
                e.appointments[n].ExtDataJson && e.appointments[n].ExtDataJson.petUid == a && (e.appointments[n].DateStart = e.appointments[n].DateStart.substring(0, 16).split("-").join("."), 
                e.appointments[n].DateEnd = e.appointments[n].DateEnd.substring(0, 16).split("-").join("."), 
                i.push(e.appointments[n]));
                s.setData({
                    loaded: !0,
                    appointments: i
                });
            }
            console.log(s.data.appointments);
        });
    },
    editPet: function(t) {
        t.currentTarget.dataset.uid;
        wx.navigateTo({
            url: "/pages/pet/editpet/editpet?petuid=" + this.data.pets.Uid
        });
    },
    changeInfo: function() {
        this.setData({
            infoClass: "ppg_active",
            orderClass: ""
        });
    },
    changeOrder: function() {
        this.setData({
            infoClass: "",
            orderClass: "ppg_active"
        });
    },
    binderrorimg: function(t) {
        this.setData({
            isPhotoHidden: !0
        });
    }
});