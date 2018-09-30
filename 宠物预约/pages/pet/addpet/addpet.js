function e(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

var t, a = require("../../../utils/utilDate.js"), s = getApp();

Page({
    data: (t = {
        name: !1,
        sex: !1,
        type: !1,
        sterilized: !1,
        isShow: !0,
        bookToastHidden: !0,
        storeId: null,
        submitClass: "submit",
        dateFrom: "",
        dateTo: "",
        tempFilePaths: "",
        petName: "",
        petType: 0,
        petTypes: [ {
            value: 3,
            name: "狗"
        }, {
            value: 2,
            name: "猫"
        }, {
            value: 1,
            name: "其它"
        } ],
        petSex: 0,
        petSexs: [ {
            value: 2,
            name: "女生",
            img: "girlIcon.png"
        }, {
            value: 1,
            name: "男生",
            img: "boyIcon.png"
        } ]
    }, e(t, "sterilized", 0), e(t, "sterilizeds", [ {
        value: 1,
        name: "是"
    }, {
        value: 2,
        name: "否"
    } ]), e(t, "petBirthDay", ""), e(t, "remark", ""), e(t, "param", ""), e(t, "length", 0), 
    t),
    onLoad: function(e) {
        console.log(e);
        var t = new Date(), s = (a.addDays(t, 1), a.addDays(t, -10950)), i = e.storeid;
        this.setData({
            storeId: i,
            dateFrom: a.formatDate(s),
            dateTo: a.formatDate(t),
            param: e.param,
            length: e.length
        });
    },
    formSubmit: function(e) {
        var t = this;
        e.detail.value.petName ? wx.showModal({
            title: "确认添加宠物？",
            success: function(a) {
                a.confirm && t.submitToServer(e);
            }
        }) : wx.showModal({
            title: "请收入宠物名字",
            showCancel: !1
        });
    },
    submitToServer: function(e) {
        var t = this, a = this;
        a.setData({
            bookToastHidden: !1
        });
        var i = e.detail.value;
        s.authRequest("wxapi/customerDirect/addpet", {
            StoreId: a.data.storeId || 0,
            PetName: i.petName.trim(),
            PetType: i.petType,
            PetSex: i.petSex,
            BeSterilized: i.sterilized,
            PetBirthDay: a.data.petBirthDay,
            Remark: i.remark,
            tempFilePaths: a.data.tempFilePaths
        }, function(e) {
            if (e.successed) {
                if (a.setData({
                    submitted: !0,
                    bookToastHidden: !0
                }), s.setToast("添加宠物成功"), 1 == t.data.param) {
                    var i = t.data.length, r = getCurrentPages();
                    r[r.length - 1];
                    r[r.length - 2].setData({
                        pet: i
                    });
                }
                wx.navigateBack();
            } else t.setData({
                bookToastHidden: !0
            }), s.showError(e.message);
        }, function(e) {
            t.setData({
                bookToastHidden: !0
            }), s.showError(e.message);
        }, null);
    },
    bindPetBirthDayChange: function(e) {
        e.detail.value;
        this.setData({
            petBirthDay: e.detail.value
        });
    },
    bindSterilizedChange: function(e) {
        e.detail.value;
        this.setData({
            submitClass: "over"
        });
    },
    headphotoEidt: function() {
        wx.navigateTo({
            url: "/pages/pet/photoEdit/photoEdit?storeid=" + this.data.storeId
        });
    },
    changeClass: function(e) {
        console.log(e), "name" == e.currentTarget.id && (e.detail.value.length > 0 ? this.setData({
            name: !0
        }) : this.setData({
            name: !1
        })), "sex" == e.currentTarget.id && (e.detail.value.length > 0 ? this.setData({
            sex: !0
        }) : this.setData({
            sex: !1
        })), "type" == e.currentTarget.id && (e.detail.value.length > 0 ? this.setData({
            type: !0
        }) : this.setData({
            type: !1
        })), "sterilized" == e.currentTarget.id && (e.detail.value > 0 ? this.setData({
            sterilized: !0
        }) : this.setData({
            sterilized: !1
        })), 1 == this.data.name && 1 == this.data.sex && 1 == this.data.type && 1 == this.data.sterilized ? this.setData({
            submitClass: "over"
        }) : this.setData({
            submitClass: "submit"
        });
    }
});