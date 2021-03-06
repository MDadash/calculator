function initializeCarusel(e, n) {
    var t = $(".owl-next"), o = $(".owl-prev");
    null != e && 0 === e.relatedTarget._current || null == e && n ? o.hide() : o.show(), t.show(), (null != e && 7 === e.relatedTarget._current || null == e && n) && (o.show(), t.hide()), (null != e && 2 === e.relatedTarget._current || null == e && n) && ($("#p_prldr1").show("slow"), setTimeout(function () {
        $("#p_prldr1").hide("slow")
    }, 2e3))
}

function changeCarusel(e, n) {
    var t = $(".owl-next"), o = $(".owl-prev");
    null != e && 0 == e.page.index || null == e && n ? o.hide() : o.show(), t.show(), (null != e && e.page.index == e.page.count - 1 || null == e && !n) && (o.show(), t.hide()), (null != e && 2 == e.page.index || null == e && n) && ($("#p_prldr1").show("slow"), setTimeout(function () {
        $("#p_prldr1").hide("slow")
    }, 2e3))
}

function scrollFunction() {
    20 < document.body.scrollTop || document.documentElement.scrollTop, document.getElementById("mybtn").style.display = "block"
}

function topFunction() {
    document.body.scrollTop = 0, document.documentElement.scrollTop = 0
}

function resize() {
    var e = $(".b"), n = e.width(), t = $(window).width(), o = e.offset();
    e.css("margin-left", -((n - t) / 2 + o.left))
}

$(document).ready(function () {
    $(".owl-carousel").owlCarousel({
        items: 1,
        autoHeight: !0,
        nav: !0,
        lazyLoad: !1,
        mouseDrag: !1,
        URLhashListener: !0,
        startPosition: "URLHash",
        onInitialized: function (e) {
            initializeCarusel(e, !0)
        },
        navText: ['<p onclick="topFunction()" id="mybtn">Название страници </br> Предыдущая страница</p><img class="nav-next" src="images/prev_arrows.png" alt="">', '<p onclick="topFunction()" id="mybtn">Название страници </br> Следующая страница</p><img src="images/arrow-next_owl.png" alt="">']
    }).on("changed.owl.carousel", function (e) {
        changeCarusel(e, !0)
    })
}), window.onscroll = function () {
    scrollFunction()
}, $(document).ready(function () {
    resize(), $(window).on("resize", resize)
});
var base = {
    findClass: function (e, n) {
        if (document.getElementsByClassName) return (n || document).getElementsByClassName(e);
        var t, o, l, i = (n = n || document).getElementsByTagName("*"), s = i.length, a = e.split(/\s+/), r = a.length,
            c = [];
        for (t = 0; t < s; t++) {
            for (l = !0, o = 0; o < r; o++) -1 == i[t].className.search("\\b" + a[o] + "\\b") && (l = !1);
            l && c.push(i[t])
        }
        return c
    }, bind: function (e, n, t) {
        e.addEventListener && e.addEventListener(n, t, !1)
    }, init: [], ready: function () {
        if (!arguments.callee.done) {
            arguments.callee.done = !0, this.timer && clearInterval(this.timer);
            var e, n = this.init.length;
            for (e = 0; e < n; e++) this.init[e]();
            this.init = []
        }
    }, check: function () {
        var e = this, n = function () {
            e.ready()
        };
        document.addEventListener && document.addEventListener("DOMContentLoaded", n, !1), /KHTML|WebKit/i.test(navigator.userAgent) && (this.timer = setInterval(function () {
            /loaded|complete/.test(document.readyState) && base.ready()
        }, 10)), this.bind(window, "load", n)
    }
}, toggler = {
    process: function () {
        var e, n = base.findClass("toggler"), t = n.length;
        for (e = 0; e < t; e++) base.bind(n[e], "click", this.toggle);
        for (t = (n = base.findClass("content")).length, e = 0; e < t; e++) n[e].style.display = "none"
    }, toggle: function () {
        var e = base.findClass("content", this.parentNode)[0], n = arguments[0] || window.event;
        $(e).slideDown("slow", function () {
        }), "block" == e.style.display ? e.style.display = "none" : e.style.display = "block", n.preventDefault ? n.preventDefault() : n.returnValue = !1
    }
};
base.init.push(function () {
    toggler.process()
}), base.check(), $(".cost_calc_first_tab").each(function () {
    var e = $(this);
    $(this).find(".content").click(function () {
        e.next().show()
    })
}), $(window).on("load", function () {
    var e = $("#p_prldr");
    e.find(".svg_anm").fadeOut(), e.delay(500).fadeOut("slow")
}), $(".owl-dots").children().addClass("toltips").length;