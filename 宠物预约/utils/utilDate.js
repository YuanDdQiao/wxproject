function t(t) {
    return [ t.getFullYear(), t.getMonth() + 1, t.getDate() ].map(r).join("-");
}

function e(t) {
    return [ t.getHours(), t.getMinutes(), t.getSeconds() ].map(r).join(":");
}

function n(t) {
    return [ t.getHours(), t.getMinutes() ].map(r).join(":");
}

function r(t) {
    return (t = t.toString())[1] ? t : "0" + t;
}

function u(t, e) {
    var n = new Date(t);
    return n.setTime(n.getTime() + 60 * e * 1e3), n;
}

module.exports = {
    formatDate: t,
    formatTime: e,
    formatTimeHHMM: n,
    formatDateTime: function(n) {
        return t(n) + " " + e(n);
    },
    addDays: function(t, e) {
        var n = new Date(t);
        return n.setDate(n.getDate() + e), n;
    },
    addHours: function(t, e) {
        var n = new Date(t);
        return n.setTime(n.getTime() + 60 * e * 60 * 1e3), n;
    },
    addMinutes: u,
    hourRange: function(t, e, r) {
        for (var o = [], a = 0, i = t; i <= e && (o.push(n(i)), !(++a > 100)); i = u(i)) ;
        return o;
    }
};