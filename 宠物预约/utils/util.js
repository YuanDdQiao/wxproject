module.exports = {
    replacePhone: function(e, n) {
        for (var r = [], o = 0; o < e.length; o++) {
            if (n) {
                var t = e[o].phone;
                e[o].phone = t.replace(t.substring(3, 7), "****");
            }
            r[o] = e[o].name + " " + e[o].phone + "\n" + e[o].province + e[o].city + e[o].addr;
        }
        return r;
    }
};