function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var e = require("../../../utils/utilDate.js"), a = getApp();

Page({
    data: {
        infoClass: "ppg_active",
        orderClass: "",
        dateFrom: "",
        dateTo: "",
        bookToastHidden: !0,
        notFound: !1,
        pet: {},
        petSex: 0,
        petType: 0,
        sterilizeds: 0,
        PetSexs: [ "男生", "女生" ],
        PetTypes: [ "其他", "猫咪", "狗狗" ],
        Sterilized: [ "是", "否" ],
        isShow: !0,
        tempFilePaths: "",
        petPhoto: "",
        storeId: null
    },
    onLoad: function(t) {
        var o = this, s = a.storeId(), i = t.petuid, d = new Date(), n = (e.addDays(d, 1), 
        e.addDays(d, -10950));
        a.authRequest("wxapi/customerDirect/mypet", {
            storeId: s,
            petUid: i
        }, function(t) {
            var i = t.pet;
            t.successed ? o.setData({
                loaded: !0,
                storeId: s,
                dateFrom: e.formatDate(n),
                dateTo: e.formatDate(d),
                pet: t.pet,
                petBirthDay: i.PetBirthDay ? i.PetBirthDay.substring(0, 10) : "",
                notFound: !1,
                petSex: i.PetSex - 1,
                petType: i.PetType - 1,
                sterilizeds: i.BeSterilized - 1,
                tempFilePaths: i.PetsPhotoFull,
                petPhoto: i.PetsPhoto
            }) : (a.showError("找不到宠物数据"), o.setData({
                notFound: !0
            }));
        });
    },
    formSubmit: function(t) {
        var e = this;
        console.log(t), t.detail.value.petName ? wx.showModal({
            title: "确认更新宠物信息？",
            success: function(a) {
                a.confirm && e.submitToServer(t);
            }
        }) : wx.showModal({
            title: "请收入宠物名字",
            showCancel: !1
        });
    },
    submitToServer: function(e) {
        var o, s = this, i = this;
        i.setData({
            bookToastHidden: !1
        });
        var d = e.detail.value;
        console.log(i.data.petSex - 0 + 1), a.authRequest("wxapi/customerDirect/updatepet", (o = {
            StoreId: i.data.storeId || 0,
            Uid: i.data.pet.Uid,
            PetName: d.petName.trim(),
            PetType: d.petType,
            PetSex: i.data.petSex - 0 + 1
        }, t(o, "PetType", i.data.petType - 0 + 1), t(o, "BeSterilized", d.sterilized), 
        t(o, "PetBirthDay", i.data.petBirthDay), t(o, "Remark", d.remark), t(o, "BeSterilized", i.data.sterilizeds - 0 + 1), 
        t(o, "PetsPhoto", i.data.petPhoto), o), function(t) {
            t.successed ? (i.setData({
                submitted: !0,
                bookToastHidden: !0
            }), a.setToast("宠物信息成功"), wx.navigateBack(), wx.navigateBack()) : (s.setData({
                bookToastHidden: !0
            }), a.showError(t.message));
        }, function(t) {
            s.setData({
                bookToastHidden: !0
            }), a.showError(t.message);
        }, null);
    },
    bindPetBirthDayChange: function(t) {
        this.setData({
            petBirthDay: t.detail.value
        });
    },
    bindPetSexChange: function(t) {
        this.setData({
            petSex: t.detail.value
        });
    },
    bindPetTypeChange: function(t) {
        this.setData({
            petType: t.detail.value
        });
    },
    bindSterilizedChange: function(t) {
        this.setData({
            sterilizeds: t.detail.value
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
    photoEidt: function(t) {
        var e = this;
        console.log(e.data.pet), wx.navigateTo({
            url: "/pages/pet/photoEdit/photoEdit?storeid=" + e.data.pet.StoreId + "&petUid=" + e.data.pet.Uid + "&petsPhoto=" + e.data.tempFilePaths
        });
    },
    removePet: function(t) {
        var e = this;
        console.log(t);
        var o = this;
        o.setData({
            bookToastHidden: !1
        }), a.authRequest("wxapi/customerDirect/deletepet", {
            StoreId: o.data.storeId || 0,
            Uid: o.data.pet.Uid
        }, function(t) {
            t.successed ? (o.setData({
                submitted: !0,
                bookToastHidden: !0
            }), a.setToast("删除成功"), wx.navigateBack(), wx.navigateBack()) : (e.setData({
                bookToastHidden: !0
            }), a.showError(t.message));
        }, function(t) {
            e.setData({
                bookToastHidden: !0
            }), a.showError(t.message);
        }, null);
    },
    delPet: function(t) {
        var e = this;
        wx.showModal({
            title: "确认删除宠物记录？",
            success: function(a) {
                a.confirm && e.removePet(t);
            }
        });
    },
    onShow: function() {
        a.showToast();
    }
});