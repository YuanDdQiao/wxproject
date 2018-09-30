Page({
    data: {},
    goBack: function() {
        wx.navigateBack({
            delta: 3
        });
    }
});