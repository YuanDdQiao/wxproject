var t = getApp();

Page({
    data: {
        storeId: "",
        petUid: "",
        tempFilePaths: "",
        uploadFiles: "",
        isHidden: !0
    },
    onLoad: function(t) {
        console.log(t.petsPhoto), t.petsPhoto && null != t.petsPhoto && "" != t.petsPhoto && this.setData({
            tempFilePaths: t.petsPhoto + "?temp=" + 2 * Math.random(),
            isHidden: !1
        }), this.setData({
            storeId: t.storeid,
            petUid: t.petUid
        });
    },
    get: function() {
        var t = this;
        wx.chooseImage({
            count: 1,
            sizeType: [ "original" ],
            sourceType: [ "album" ],
            success: function(e) {
                t.setData({
                    tempFilePaths: e.tempFilePaths[0],
                    uploadFiles: e.tempFilePaths,
                    isHidden: !1
                });
            }
        });
    },
    take: function() {
        var t = this;
        wx.chooseImage({
            count: 1,
            sizeType: [ "original" ],
            sourceType: [ "camera" ],
            success: function(e) {
                t.setData({
                    tempFilePaths: e.tempFilePaths[0],
                    uploadFiles: e.tempFilePaths,
                    isShow: !1
                });
            }
        });
    },
    save: function() {
        var e = getCurrentPages(), s = (e[e.length - 1], e[e.length - 2]), o = this.data.uploadFiles;
        if (0 != o.length) {
            var a = this;
            console.log(t.getBaseUrl()), t.authFileRequest("wxapi/customerDirect/UploadPetsPhoto", {
                formData: {
                    storeId: a.data.storeId,
                    petUid: a.data.petUid
                },
                filePath: o[0]
            }, function(e) {
                console.log(e);
                var o = JSON.parse(e);
                console.log(o.msg), o && o.successed ? (s.setData({
                    tempFilePaths: o.ext + o.msg,
                    petPhoto: o.msg,
                    isShow: !1
                }), t.setToast("头像保存成功"), wx.navigateBack()) : wx.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1
                });
            }, function(t) {
                wx.showModal({
                    title: "提示",
                    content: "上传失败",
                    showCancel: !1
                });
            }, "保存中...");
        } else wx.showModal({
            title: "提示",
            content: "请选一张或拍一张图片",
            showCancel: !1
        });
    },
    binderrorimg: function(t) {
        this.setData({
            isHidden: !0
        });
    }
});