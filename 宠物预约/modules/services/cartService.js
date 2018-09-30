var t, e, i = getApp(), s = function(t) {
    this.initConfig(t);
};

s.prototype = {
    initConfig: function(e) {
        var i = this;
        i.config = Object.assign({}, t, e), i.items = [], i.eventHandlers = [], i.needSync = !0, 
        i.loaded = !1;
    },
    loadOnce: function(t) {
        this.loaded ? (this.notify("reload"), t && t()) : this.doLoad(t);
    },
    load: function(t) {
        console.log("load", this.needSync), this.needSync ? this.doLoad(t) : (this.notify("reload"), 
        t && t());
    },
    doLoad: function(t) {
        var e = this;
        e.loaded = !0, this.syncCart(function() {
            e.notify("reload"), t && t();
        });
    },
    subscribe: function(t) {
        this.eventHandlers.indexOf(t) < 0 && this.eventHandlers.push(t);
    },
    unsubscribe: function(t) {
        var e = this.eventHandlers.indexOf(t);
        e >= 0 && this.eventHandlers.splice(e, 1);
    },
    notify: function(t, e) {
        this.eventHandlers.forEach(function(i) {
            i(this, t, e);
        }, this);
    },
    _add: function(t, e, i, s) {
        s || (s = []);
        var n = {
            ProductId: t,
            ProductName: e,
            SellPrice: i,
            ProductNum: 1,
            CartItemAttributes: s
        };
        return n.CartIdx = this.items.length, n.ItemTotal = this.calculatePrice(n), this.items.push(n), 
        this.needSync = !0, n;
    },
    calculatePrice: function(t) {
        var e = t.SellPrice;
        for (var i in t.CartItemAttributes) {
            var s = t.CartItemAttributes[i], n = parseFloat(s.attributeValue);
            console.log(), n && n > 0 && (e += n);
        }
        return (e * t.ProductNum).toFixed(2);
    },
    _updateNum: function(t, e) {
        e < 0 && (e = 0), t && t.ProductNum != e && (t.ProductNum = e, t.ItemTotal = this.calculatePrice(t), 
        this.needSync = !0);
    },
    _remove: function(t) {
        for (var e = this.items.length; e--; ) this.items[e] === t && (this.items.splice(e, 1), 
        this.needSync = !0);
    },
    removeById: function(t, e, i) {
        var s = this.findItemsById(t);
        for (var n in s) {
            var r = s[n];
            r.ProductNum > 0 && (r.ProductNum = 0, this.needSync = !0);
        }
        e || this.syncCart(i, !1);
    },
    find: function(t, e) {
        if (!t) return this.items;
        for (var i = 0; i < this.items.length; i++) {
            var s = this.items[i];
            if (s.ProductId == t) {
                var n = !0;
                if (e && e.length > 0) if (s.CartItemAttributes && s.CartItemAttributes.length == e.length) {
                    for (var r = 0; r < e.length; r++) if (e[r].txtproductAttributeUid != s.CartItemAttributes[r].txtproductAttributeUid) {
                        n = !1;
                        break;
                    }
                } else n = !1;
                if (n) return s;
            }
        }
        return null;
    },
    findItemsById: function(t) {
        for (var e = [], i = 0; i < this.items.length; i++) {
            var s = this.items[i];
            s.ProductId == t && s.ProductNum && s.ProductNum > 0 && e.push(s);
        }
        return e;
    },
    add: function(t, e, i, s, n, r) {
        var o = this.find(t, s);
        return o ? this._updateNum(o, o.ProductNum + 1) : o = this._add(t, e, i, s), n || this.syncCart(r, !1), 
        this.notify("add", o), o;
    },
    addByCartIdx: function(t) {
        var e = this.items[t];
        return e && this._updateNum(e, e.ProductNum + 1), e;
    },
    findByIdx: function(t) {
        return this.items[t];
    },
    minus: function(t, e, i) {
        var s = this.find(t);
        return s && s.ProductNum > 0 && (this._updateNum(s, s.ProductNum - 1), e || this.syncCart(i, !1), 
        this.notify("minus", s)), s;
    },
    minusByCartIdx: function(t) {
        var e = this.items[t];
        return e && this._updateNum(e, e.ProductNum - 1), e;
    },
    update: function(t, e, i, s, n, r) {
        var o = this.find(t);
        o ? this._updateNum(o, e) : (o = this._add(t, i, s), this._updateNum(o, e)), n || (this.syncCart(r, !1), 
        this.notify("update", o));
    },
    clear: function(t) {
        this.items = [], this.needSync = !0, this.syncCart(t, !1), this.notify("reload");
    },
    summary: function() {
        for (var t, e = 0, i = 0, s = 0; s < this.items.length; s++) i += (t = this.items[s]).ProductNum, 
        e = t.ItemTotal ? parseFloat(t.ItemTotal) + e : parseFloat(this.calculatePrice(t)) + e;
        return e = e.toFixed(2), {
            amount: e,
            quantity: i
        };
    },
    syncCart: function(t, e, s) {
        var n = this, r = this;
        if (r.needSync || s) {
            void 0 === e && (e = !0);
            var o = JSON.stringify(this.items);
            r.needSync = !1, i.authRequest(r.config.syncUrl, {
                storeId: i.storeId(),
                isMerge: e,
                shopcartItems: o
            }, function(e) {
                if (e && e.Success) {
                    r.items = JSON.parse(e.Result);
                    for (var i = 0; i < r.items.length; i++) {
                        var s = r.items[i];
                        s.CartIdx = i, s.ItemTotal = n.calculatePrice(s);
                    }
                    r.message = e.Message, r.message && wx.showModal({
                        content: r.message,
                        showCancel: !1,
                        confirmColor: "#5a5a5a",
                        success: function(t) {}
                    }), t && t(r.items, r.message);
                } else r.needSync = !0, t && t(!1);
            }, function(e) {
                r.needSync = !0, t && t(!1), i.showError(e.message);
            }, null);
        } else t && t(r.items);
    },
    checkout: function(t) {
        var e = this, s = JSON.stringify(this.items);
        e.needSync = !1, i.authRequest(e.config.checkoutUrl, {
            storeId: i.storeId(),
            isMerge: !0,
            shopcartItems: s
        }, function(s) {
            console.log(s), s.successed ? t && t(s) : (i.showError(s.message), e.needSync = !0, 
            t && t(!1));
        }, function(s) {
            i.showError(s.message), e.needSync = !0, t && t(!1);
        }, null);
    }
}, t = {
    syncUrl: "/wxapi/shopcart/syncshopcart",
    checkoutUrl: "/wxapi/shopcart/checkout"
};

module.exports = {
    initCartService: function(t) {
        return null == e && (e = new s(t)), e;
    }
};