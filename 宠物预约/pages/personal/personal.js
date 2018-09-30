var o = getApp();

Page({
    data: {},
    onLoad: function(o) {},
    logout: function() {
        wx.showModal({
            title: "确认退出帐户？",
            success: function(t) {
                t.confirm && o.logout();
            }
        });
    },
    gotoHome: function(o) {
        wx.redirectTo({
            url: "/pages/store/store"
        });
    }
});