function t(t, i) {
    if (!(t instanceof i)) throw new TypeError("Cannot call a class as a function");
}

var i = function() {
    function t(t, i) {
        for (var e = 0; e < i.length; e++) {
            var a = i[e];
            a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), 
            Object.defineProperty(t, a.key, a);
        }
    }
    return function(i, e, a) {
        return e && t(i.prototype, e), a && t(i, a), i;
    };
}(), e = 0, a = function() {
    function a(i) {
        t(this, a), this.onFirstView = function() {}, this.onLastView = function() {}, this.afterViewChange = function() {}, 
        this.beforeViewChange = function() {}, i = i || {};
        var s = getCurrentPages();
        this.pageCtx = s[s.length - 1], this.id = e++, this.screenWidth = wx.getSystemInfoSync().windowWidth, 
        this.templateName = i.templateName || "hSwiperItem", this.DataVarName = i.varStr, 
        this.wrapperStyle = "hSwiperConStyle" + this.id, this.pageCtx.data[this.DataVarName] = this.pageCtx.data[this.DataVarName] || {}, 
        this.data = this.pageCtx.data[this.DataVarName], this.data.id = this.id, this.data.templateName = this.templateName, 
        this.data.wrapperStyle = this.wrapperStyle, this.data.wrapperStyleValue = {}, this.data.wrapperStyleValue[this.wrapperStyle] = "", 
        this.data.itemStyle = "", this.data.list = i.list || [], this.data.swiperAnmiation = {}, 
        this.nowView = parseInt(i.nowView, 10) || 0, this.reduceDistance = parseInt(i.reduceDistance, 10) || 0, 
        this.itemWidth = parseInt(i.itemWidth || this.screenWidth - this.reduceDistance, 10), 
        this.nowTranX = -this.itemWidth * this.nowView + this.reduceDistance / 2, this.viewAnimation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 300,
            timingFunction: "ease",
            delay: 0
        }), this.moveAnimation = wx.createAnimation({
            transformOrigin: "50% 50%",
            duration: 0,
            timingFunction: "ease",
            delay: 0
        }), this.startPos = this.endPos = 0, this.registerEvent(), this.initData(), this.initStruct();
    }
    return i(a, [ {
        key: "initStruct",
        value: function() {
            var t = this.data.list.length;
            this.updateConStyle("width", t * this.itemWidth + "px"), this.updateItemStyle("width", this.itemWidth + "px");
        }
    }, {
        key: "styleStringify",
        value: function(t) {
            var i = "";
            for (var e in t) i += e + ":" + t[e] + ";";
            return i;
        }
    }, {
        key: "updateData",
        value: function(t, i) {
            var e = {};
            e[this.DataVarName + "." + t] = i, this.pageCtx.setData(e);
        }
    }, {
        key: "updateItemStyle",
        value: function(t, i) {
            var e = this.parseStyle(this.data.itemStyle) || "";
            e[t] = i, this.data.itemStyle = this.styleStringify(e), this.updateData("itemStyle", this.data.itemStyle);
        }
    }, {
        key: "updateConStyle",
        value: function(t, i) {
            var e = this.parseStyle(this.data.wrapperStyleValue[this.wrapperStyle]) || "";
            e[t] = i, this.data.wrapperStyleValue[this.data.wrapperStyle] = this.styleStringify(e);
            var a = "wrapperStyleValue." + this.data.wrapperStyle;
            this.updateData(a, this.data.wrapperStyleValue[this.data.wrapperStyle]);
        }
    }, {
        key: "parseStyle",
        value: function(t) {
            var i = {}, e = t.split(";");
            return e = e.map(function(t) {
                var e = t.split(":");
                2 === e.length && (i[e[0]] = e[1]);
            }), i;
        }
    }, {
        key: "registerEvent",
        value: function() {
            var t = this;
            this.pageCtx["swiperTouchstart" + this.id] = function(i) {
                t.startPos = i.changedTouches[0].clientX, t.touchTime = i.timeStamp;
            }, this.pageCtx["swiperTouchmove" + this.id] = function(i) {
                t.endPos = i.changedTouches[0].clientX, t.movePos(t.endPos - t.startPos);
            }, this.pageCtx["swiperTouchend" + this.id] = function(i) {
                var e = i.timeStamp - t.touchTime, a = Math.abs(i.changedTouches[0].clientX - t.startPos);
                e < 500 && a > 1 ? i.changedTouches[0].clientX - t.startPos > 0 ? t.preView() : t.nextView() : (t.endPos = i.changedTouches[0].clientX, 
                t.movePos(t.endPos - t.startPos), t.nowTranX += t.endPos - t.startPos, t.moveViewTo(t.getNowView()));
            };
        }
    }, {
        key: "initData",
        value: function() {
            var t = {};
            t[this.DataVarName] = this.data, this.pageCtx.setData(t);
        }
    }, {
        key: "movePos",
        value: function(t) {
            var i = this.nowTranX + t, e = this.data.list.length > 0 ? this.data.list.length : 1, a = -this.itemWidth * (e - 1) - 40;
            i > 40 && (i = 40), i < a && (i = a), this.updateMoveAnimation(i);
        }
    }, {
        key: "updateMoveAnimation",
        value: function(t) {
            this.moveAnimation.translateX(t).translate3d(0).step();
            this.updateData("swiperAnmiation", this.moveAnimation.export());
        }
    }, {
        key: "moveViewTo",
        value: function(t) {
            this.beforeViewChange(this.data.list[this.nowView], this.nowView), this.nowView = t, 
            this.nowTranX = -this.itemWidth * t + this.reduceDistance / 2, console.log("移动视图", t, this.nowTranX, this.itemWidth), 
            this.updateViewAnimation(this.nowTranX), this.afterViewChange(this.data.list[this.nowView], this.nowView), 
            0 === t ? this.onFirstView(this.data.list[this.nowView], this.nowView) : t === this.data.list.length - 1 && this.onLastView(this.data.list[this.nowView], this.nowView);
        }
    }, {
        key: "updateViewAnimation",
        value: function(t) {
            this.viewAnimation.translateX(t).translate3d(0).step(), this.updateData("swiperAnmiation", this.viewAnimation.export());
        }
    }, {
        key: "getNowView",
        value: function() {
            var t = this.data.length - 1, i = Math.abs(Math.round(this.nowTranX / this.itemWidth));
            return this.nowTranX > 0 ? 0 : (i = i > 0 ? i : 0, i = i > t ? t : i);
        }
    }, {
        key: "nextView",
        value: function() {
            var t = this.nowView + 1;
            return t = t > this.data.list.length - 1 ? this.data.list.length - 1 : t, this.nowView = t, 
            this.moveViewTo(t), t;
        }
    }, {
        key: "preView",
        value: function() {
            var t = this.nowView - 1;
            return t = t < 0 ? 0 : t, this.nowView = t, this.moveViewTo(t), t;
        }
    }, {
        key: "updateList",
        value: function(t) {
            this.data.list = t, this.updateData("list", t), this.initStruct();
        }
    }, {
        key: "updateListData",
        value: function(t) {
            this.data.list = t;
        }
    }, {
        key: "updateListItem",
        value: function(t, i, e) {
            var a = "list[" + t + "]." + i;
            this.updateData(a, e);
        }
    }, {
        key: "getList",
        value: function() {
            return this.data.list;
        }
    } ]), a;
}();

module.exports = a;