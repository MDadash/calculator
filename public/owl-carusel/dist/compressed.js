!function (t, e, i, s) {
    function n(e, i) {
        this.settings = null, this.options = t.extend({}, n.Defaults, i), this.$element = t(e), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = {
            time: null,
            target: null,
            pointer: null,
            stage: {start: null, current: null},
            direction: null
        }, this._states = {
            current: {},
            tags: {initializing: ["busy"], animating: ["busy"], dragging: ["interacting"]}
        }, t.each(["onResize", "onThrottledResize"], t.proxy(function (e, i) {
            this._handlers[i] = t.proxy(this[i], this)
        }, this)), t.each(n.Plugins, t.proxy(function (t, e) {
            this._plugins[t.charAt(0).toLowerCase() + t.slice(1)] = new e(this)
        }, this)), t.each(n.Workers, t.proxy(function (e, i) {
            this._pipe.push({filter: i.filter, run: t.proxy(i.run, this)})
        }, this)), this.setup(), this.initialize()
    }

    n.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        rewind: !1,
        checkVisibility: !0,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: e,
        fallbackEasing: "swing",
        slideTransition: "",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab"
    }, n.Width = {Default: "default", Inner: "inner", Outer: "outer"}, n.Type = {
        Event: "event",
        State: "state"
    }, n.Plugins = {}, n.Workers = [{
        filter: ["width", "settings"], run: function () {
            this._width = this.$element.width()
        }
    }, {
        filter: ["width", "items", "settings"], run: function (t) {
            t.current = this._items && this._items[this.relative(this._current)]
        }
    }, {
        filter: ["items", "settings"], run: function () {
            this.$stage.children(".cloned").remove()
        }
    }, {
        filter: ["width", "items", "settings"], run: function (t) {
            var e = this.settings.margin || "", i = !this.settings.autoWidth, s = this.settings.rtl,
                n = {width: "auto", "margin-left": s ? e : "", "margin-right": s ? "" : e};
            !i && this.$stage.children().css(n), t.css = n
        }
    }, {
        filter: ["width", "items", "settings"], run: function (t) {
            var e = (this.width() / this.settings.items).toFixed(3) - this.settings.margin, i = null,
                s = this._items.length, n = !this.settings.autoWidth, o = [];
            for (t.items = {
                merge: !1,
                width: e
            }; s--;) i = this._mergers[s], i = this.settings.mergeFit && Math.min(i, this.settings.items) || i, t.items.merge = 1 < i || t.items.merge, o[s] = n ? e * i : this._items[s].width();
            this._widths = o
        }
    }, {
        filter: ["items", "settings"], run: function () {
            var e = [], i = this._items, s = this.settings, n = Math.max(2 * s.items, 4),
                o = 2 * Math.ceil(i.length / 2), r = s.loop && i.length ? s.rewind ? n : Math.max(n, o) : 0, a = "",
                h = "";
            for (r /= 2; 0 < r;) e.push(this.normalize(e.length / 2, !0)), a += i[e[e.length - 1]][0].outerHTML, e.push(this.normalize(i.length - 1 - (e.length - 1) / 2, !0)), h = i[e[e.length - 1]][0].outerHTML + h, r -= 1;
            this._clones = e, t(a).addClass("cloned").appendTo(this.$stage), t(h).addClass("cloned").prependTo(this.$stage)
        }
    }, {
        filter: ["width", "items", "settings"], run: function () {
            for (var t = this.settings.rtl ? 1 : -1, e = this._clones.length + this._items.length, i = -1, s = 0, n = 0, o = []; ++i < e;) s = o[i - 1] || 0, n = this._widths[this.relative(i)] + this.settings.margin, o.push(s + n * t);
            this._coordinates = o
        }
    }, {
        filter: ["width", "items", "settings"], run: function () {
            var t = this.settings.stagePadding, e = this._coordinates, i = {
                width: Math.ceil(Math.abs(e[e.length - 1])) + 2 * t,
                "padding-left": t || "",
                "padding-right": t || ""
            };
            this.$stage.css(i)
        }
    }, {
        filter: ["width", "items", "settings"], run: function (t) {
            var e = this._coordinates.length, i = !this.settings.autoWidth, s = this.$stage.children();
            if (i && t.items.merge) for (; e--;) t.css.width = this._widths[this.relative(e)], s.eq(e).css(t.css); else i && (t.css.width = t.items.width, s.css(t.css))
        }
    }, {
        filter: ["items"], run: function () {
            this._coordinates.length < 1 && this.$stage.removeAttr("style")
        }
    }, {
        filter: ["width", "items", "settings"], run: function (t) {
            t.current = t.current ? this.$stage.children().index(t.current) : 0, t.current = Math.max(this.minimum(), Math.min(this.maximum(), t.current)), this.reset(t.current)
        }
    }, {
        filter: ["position"], run: function () {
            this.animate(this.coordinates(this._current))
        }
    }, {
        filter: ["width", "position", "items", "settings"], run: function () {
            var t, e, i, s, n = this.settings.rtl ? 1 : -1, o = 2 * this.settings.stagePadding,
                r = this.coordinates(this.current()) + o, a = r + this.width() * n, h = [];
            for (i = 0, s = this._coordinates.length; i < s; i++) t = this._coordinates[i - 1] || 0, e = Math.abs(this._coordinates[i]) + o * n, (this.op(t, "<=", r) && this.op(t, ">", a) || this.op(e, "<", r) && this.op(e, ">", a)) && h.push(i);
            this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + h.join("), :eq(") + ")").addClass("active"), this.$stage.children(".center").removeClass("center"), this.settings.center && this.$stage.children().eq(this.current()).addClass("center")
        }
    }], n.prototype.initializeStage = function () {
        this.$stage = this.$element.find("." + this.settings.stageClass), this.$stage.length || (this.$element.addClass(this.options.loadingClass), this.$stage = t("<" + this.settings.stageElement + ">", {class: this.settings.stageClass}).wrap(t("<div/>", {class: this.settings.stageOuterClass})), this.$element.append(this.$stage.parent()))
    }, n.prototype.initializeItems = function () {
        var e = this.$element.find(".owl-item");
        if (e.length) return this._items = e.get().map(function (e) {
            return t(e)
        }), this._mergers = this._items.map(function () {
            return 1
        }), void this.refresh();
        this.replace(this.$element.children().not(this.$stage.parent())), this.isVisible() ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass)
    }, n.prototype.initialize = function () {
        var t, e, i;
        this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading") && (t = this.$element.find("img"), e = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : s, i = this.$element.children(e).width(), t.length && i <= 0 && this.preloadAutoWidthImages(t)), this.initializeStage(), this.initializeItems(), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized")
    }, n.prototype.isVisible = function () {
        return !this.settings.checkVisibility || this.$element.is(":visible")
    }, n.prototype.setup = function () {
        var e = this.viewport(), i = this.options.responsive, s = -1, n = null;
        i ? (t.each(i, function (t) {
            t <= e && s < t && (s = Number(t))
        }), "function" == typeof (n = t.extend({}, this.options, i[s])).stagePadding && (n.stagePadding = n.stagePadding()), delete n.responsive, n.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + s))) : n = t.extend({}, this.options), this.trigger("change", {
            property: {
                name: "settings",
                value: n
            }
        }), this._breakpoint = s, this.settings = n, this.invalidate("settings"), this.trigger("changed", {
            property: {
                name: "settings",
                value: this.settings
            }
        })
    }, n.prototype.optionsLogic = function () {
        this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
    }, n.prototype.prepare = function (e) {
        var i = this.trigger("prepare", {content: e});
        return i.data || (i.data = t("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(e)), this.trigger("prepared", {content: i.data}), i.data
    }, n.prototype.update = function () {
        for (var e = 0, i = this._pipe.length, s = t.proxy(function (t) {
            return this[t]
        }, this._invalidated), n = {}; e < i;) (this._invalidated.all || 0 < t.grep(this._pipe[e].filter, s).length) && this._pipe[e].run(n), e++;
        this._invalidated = {}, !this.is("valid") && this.enter("valid")
    }, n.prototype.width = function (t) {
        switch (t = t || n.Width.Default) {
            case n.Width.Inner:
            case n.Width.Outer:
                return this._width;
            default:
                return this._width - 2 * this.settings.stagePadding + this.settings.margin
        }
    }, n.prototype.refresh = function () {
        this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed")
    }, n.prototype.onThrottledResize = function () {
        e.clearTimeout(this.resizeTimer), this.resizeTimer = e.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate)
    }, n.prototype.onResize = function () {
        return !!this._items.length && this._width !== this.$element.width() && !!this.isVisible() && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))
    }, n.prototype.registerEventHandlers = function () {
        t.support.transition && this.$stage.on(t.support.transition.end + ".owl.core", t.proxy(this.onTransitionEnd, this)), !1 !== this.settings.responsive && this.on(e, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", t.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
            return !1
        })), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", t.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", t.proxy(this.onDragEnd, this)))
    }, n.prototype.onDragStart = function (e) {
        var s = null;
        3 !== e.which && (t.support.transform ? s = {
            x: (s = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","))[16 === s.length ? 12 : 4],
            y: s[16 === s.length ? 13 : 5]
        } : (s = this.$stage.position(), s = {
            x: this.settings.rtl ? s.left + this.$stage.width() - this.width() + this.settings.margin : s.left,
            y: s.top
        }), this.is("animating") && (t.support.transform ? this.animate(s.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === e.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = t(e.target), this._drag.stage.start = s, this._drag.stage.current = s, this._drag.pointer = this.pointer(e), t(i).on("mouseup.owl.core touchend.owl.core", t.proxy(this.onDragEnd, this)), t(i).one("mousemove.owl.core touchmove.owl.core", t.proxy(function (e) {
            var s = this.difference(this._drag.pointer, this.pointer(e));
            t(i).on("mousemove.owl.core touchmove.owl.core", t.proxy(this.onDragMove, this)), Math.abs(s.x) < Math.abs(s.y) && this.is("valid") || (e.preventDefault(), this.enter("dragging"), this.trigger("drag"))
        }, this)))
    }, n.prototype.onDragMove = function (t) {
        var e = null, i = null, s = null, n = this.difference(this._drag.pointer, this.pointer(t)),
            o = this.difference(this._drag.stage.start, n);
        this.is("dragging") && (t.preventDefault(), this.settings.loop ? (e = this.coordinates(this.minimum()), i = this.coordinates(this.maximum() + 1) - e, o.x = ((o.x - e) % i + i) % i + e) : (e = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), i = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), s = this.settings.pullDrag ? -1 * n.x / 5 : 0, o.x = Math.max(Math.min(o.x, e + s), i + s)), this._drag.stage.current = o, this.animate(o.x))
    }, n.prototype.onDragEnd = function (e) {
        var s = this.difference(this._drag.pointer, this.pointer(e)), n = this._drag.stage.current,
            o = 0 < s.x ^ this.settings.rtl ? "left" : "right";
        t(i).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== s.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(n.x, 0 !== s.x ? o : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = o, (3 < Math.abs(s.x) || 300 < (new Date).getTime() - this._drag.time) && this._drag.target.one("click.owl.core", function () {
            return !1
        })), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"))
    }, n.prototype.closest = function (e, i) {
        var n = -1, o = this.width(), r = this.coordinates();
        return this.settings.freeDrag || t.each(r, t.proxy(function (t, a) {
            return "left" === i && a - 30 < e && e < a + 30 ? n = t : "right" === i && a - o - 30 < e && e < a - o + 30 ? n = t + 1 : this.op(e, "<", a) && this.op(e, ">", r[t + 1] !== s ? r[t + 1] : a - o) && (n = "left" === i ? t + 1 : t), -1 === n
        }, this)), this.settings.loop || (this.op(e, ">", r[this.minimum()]) ? n = e = this.minimum() : this.op(e, "<", r[this.maximum()]) && (n = e = this.maximum())), n
    }, n.prototype.animate = function (e) {
        var i = 0 < this.speed();
        this.is("animating") && this.onTransitionEnd(), i && (this.enter("animating"), this.trigger("translate")), t.support.transform3d && t.support.transition ? this.$stage.css({
            transform: "translate3d(" + e + "px,0px,0px)",
            transition: this.speed() / 1e3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "")
        }) : i ? this.$stage.animate({left: e + "px"}, this.speed(), this.settings.fallbackEasing, t.proxy(this.onTransitionEnd, this)) : this.$stage.css({left: e + "px"})
    }, n.prototype.is = function (t) {
        return this._states.current[t] && 0 < this._states.current[t]
    }, n.prototype.current = function (t) {
        if (t === s) return this._current;
        if (0 === this._items.length) return s;
        if (t = this.normalize(t), this._current !== t) {
            var e = this.trigger("change", {property: {name: "position", value: t}});
            e.data !== s && (t = this.normalize(e.data)), this._current = t, this.invalidate("position"), this.trigger("changed", {
                property: {
                    name: "position",
                    value: this._current
                }
            })
        }
        return this._current
    }, n.prototype.invalidate = function (e) {
        return "string" === t.type(e) && (this._invalidated[e] = !0, this.is("valid") && this.leave("valid")), t.map(this._invalidated, function (t, e) {
            return e
        })
    }, n.prototype.reset = function (t) {
        (t = this.normalize(t)) !== s && (this._speed = 0, this._current = t, this.suppress(["translate", "translated"]), this.animate(this.coordinates(t)), this.release(["translate", "translated"]))
    }, n.prototype.normalize = function (t, e) {
        var i = this._items.length, n = e ? 0 : this._clones.length;
        return !this.isNumeric(t) || i < 1 ? t = s : (t < 0 || i + n <= t) && (t = ((t - n / 2) % i + i) % i + n / 2), t
    }, n.prototype.relative = function (t) {
        return t -= this._clones.length / 2, this.normalize(t, !0)
    }, n.prototype.maximum = function (t) {
        var e, i, s, n = this.settings, o = this._coordinates.length;
        if (n.loop) o = this._clones.length / 2 + this._items.length - 1; else if (n.autoWidth || n.merge) {
            if (e = this._items.length) for (i = this._items[--e].width(), s = this.$element.width(); e-- && !(s < (i += this._items[e].width() + this.settings.margin));) ;
            o = e + 1
        } else o = n.center ? this._items.length - 1 : this._items.length - n.items;
        return t && (o -= this._clones.length / 2), Math.max(o, 0)
    }, n.prototype.minimum = function (t) {
        return t ? 0 : this._clones.length / 2
    }, n.prototype.items = function (t) {
        return t === s ? this._items.slice() : (t = this.normalize(t, !0), this._items[t])
    }, n.prototype.mergers = function (t) {
        return t === s ? this._mergers.slice() : (t = this.normalize(t, !0), this._mergers[t])
    }, n.prototype.clones = function (e) {
        var i = this._clones.length / 2, n = i + this._items.length, o = function (t) {
            return t % 2 == 0 ? n + t / 2 : i - (t + 1) / 2
        };
        return e === s ? t.map(this._clones, function (t, e) {
            return o(e)
        }) : t.map(this._clones, function (t, i) {
            return t === e ? o(i) : null
        })
    }, n.prototype.speed = function (t) {
        return t !== s && (this._speed = t), this._speed
    }, n.prototype.coordinates = function (e) {
        var i, n = 1, o = e - 1;
        return e === s ? t.map(this._coordinates, t.proxy(function (t, e) {
            return this.coordinates(e)
        }, this)) : (this.settings.center ? (this.settings.rtl && (n = -1, o = e + 1), i = this._coordinates[e], i += (this.width() - i + (this._coordinates[o] || 0)) / 2 * n) : i = this._coordinates[o] || 0, i = Math.ceil(i))
    }, n.prototype.duration = function (t, e, i) {
        return 0 === i ? 0 : Math.min(Math.max(Math.abs(e - t), 1), 6) * Math.abs(i || this.settings.smartSpeed)
    }, n.prototype.to = function (t, e) {
        var i = this.current(), s = null, n = t - this.relative(i), o = (0 < n) - (n < 0), r = this._items.length,
            a = this.minimum(), h = this.maximum();
        this.settings.loop ? (!this.settings.rewind && Math.abs(n) > r / 2 && (n += -1 * o * r), (s = (((t = i + n) - a) % r + r) % r + a) !== t && s - n <= h && 0 < s - n && (i = s - n, t = s, this.reset(i))) : t = this.settings.rewind ? (t % (h += 1) + h) % h : Math.max(a, Math.min(h, t)), this.speed(this.duration(i, t, e)), this.current(t), this.isVisible() && this.update()
    }, n.prototype.next = function (t) {
        t = t || !1, this.to(this.relative(this.current()) + 1, t)
    }, n.prototype.prev = function (t) {
        t = t || !1, this.to(this.relative(this.current()) - 1, t)
    }, n.prototype.onTransitionEnd = function (t) {
        if (t !== s && (t.stopPropagation(), (t.target || t.srcElement || t.originalTarget) !== this.$stage.get(0))) return !1;
        this.leave("animating"), this.trigger("translated")
    }, n.prototype.viewport = function () {
        var s;
        return this.options.responsiveBaseElement !== e ? s = t(this.options.responsiveBaseElement).width() : e.innerWidth ? s = e.innerWidth : i.documentElement && i.documentElement.clientWidth ? s = i.documentElement.clientWidth : console.warn("Can not detect viewport width."), s
    }, n.prototype.replace = function (e) {
        this.$stage.empty(), this._items = [], e && (e = e instanceof jQuery ? e : t(e)), this.settings.nestedItemSelector && (e = e.find("." + this.settings.nestedItemSelector)), e.filter(function () {
            return 1 === this.nodeType
        }).each(t.proxy(function (t, e) {
            e = this.prepare(e), this.$stage.append(e), this._items.push(e), this._mergers.push(1 * e.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)
        }, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
    }, n.prototype.add = function (e, i) {
        var n = this.relative(this._current);
        i = i === s ? this._items.length : this.normalize(i, !0), e = e instanceof jQuery ? e : t(e), this.trigger("add", {
            content: e,
            position: i
        }), e = this.prepare(e), 0 === this._items.length || i === this._items.length ? (0 === this._items.length && this.$stage.append(e), 0 !== this._items.length && this._items[i - 1].after(e), this._items.push(e), this._mergers.push(1 * e.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[i].before(e), this._items.splice(i, 0, e), this._mergers.splice(i, 0, 1 * e.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[n] && this.reset(this._items[n].index()), this.invalidate("items"), this.trigger("added", {
            content: e,
            position: i
        })
    }, n.prototype.remove = function (t) {
        (t = this.normalize(t, !0)) !== s && (this.trigger("remove", {
            content: this._items[t],
            position: t
        }), this._items[t].remove(), this._items.splice(t, 1), this._mergers.splice(t, 1), this.invalidate("items"), this.trigger("removed", {
            content: null,
            position: t
        }))
    }, n.prototype.preloadAutoWidthImages = function (e) {
        e.each(t.proxy(function (e, i) {
            this.enter("pre-loading"), i = t(i), t(new Image).one("load", t.proxy(function (t) {
                i.attr("src", t.target.src), i.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh()
            }, this)).attr("src", i.attr("src") || i.attr("data-src") || i.attr("data-src-retina"))
        }, this))
    }, n.prototype.destroy = function () {
        for (var s in this.$element.off(".owl.core"), this.$stage.off(".owl.core"), t(i).off(".owl.core"), !1 !== this.settings.responsive && (e.clearTimeout(this.resizeTimer), this.off(e, "resize", this._handlers.onThrottledResize)), this._plugins) this._plugins[s].destroy();
        this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.remove(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel")
    }, n.prototype.op = function (t, e, i) {
        var s = this.settings.rtl;
        switch (e) {
            case"<":
                return s ? i < t : t < i;
            case">":
                return s ? t < i : i < t;
            case">=":
                return s ? t <= i : i <= t;
            case"<=":
                return s ? i <= t : t <= i
        }
    }, n.prototype.on = function (t, e, i, s) {
        t.addEventListener ? t.addEventListener(e, i, s) : t.attachEvent && t.attachEvent("on" + e, i)
    }, n.prototype.off = function (t, e, i, s) {
        t.removeEventListener ? t.removeEventListener(e, i, s) : t.detachEvent && t.detachEvent("on" + e, i)
    }, n.prototype.trigger = function (e, i, s, o, r) {
        var a = {item: {count: this._items.length, index: this.current()}},
            h = t.camelCase(t.grep(["on", e, s], function (t) {
                return t
            }).join("-").toLowerCase()),
            l = t.Event([e, "owl", s || "carousel"].join(".").toLowerCase(), t.extend({relatedTarget: this}, a, i));
        return this._supress[e] || (t.each(this._plugins, function (t, e) {
            e.onTrigger && e.onTrigger(l)
        }), this.register({
            type: n.Type.Event,
            name: e
        }), this.$element.trigger(l), this.settings && "function" == typeof this.settings[h] && this.settings[h].call(this, l)), l
    }, n.prototype.enter = function (e) {
        t.each([e].concat(this._states.tags[e] || []), t.proxy(function (t, e) {
            this._states.current[e] === s && (this._states.current[e] = 0), this._states.current[e]++
        }, this))
    }, n.prototype.leave = function (e) {
        t.each([e].concat(this._states.tags[e] || []), t.proxy(function (t, e) {
            this._states.current[e]--
        }, this))
    }, n.prototype.register = function (e) {
        if (e.type === n.Type.Event) {
            if (t.event.special[e.name] || (t.event.special[e.name] = {}), !t.event.special[e.name].owl) {
                var i = t.event.special[e.name]._default;
                t.event.special[e.name]._default = function (t) {
                    return !i || !i.apply || t.namespace && -1 !== t.namespace.indexOf("owl") ? t.namespace && -1 < t.namespace.indexOf("owl") : i.apply(this, arguments)
                }, t.event.special[e.name].owl = !0
            }
        } else e.type === n.Type.State && (this._states.tags[e.name] ? this._states.tags[e.name] = this._states.tags[e.name].concat(e.tags) : this._states.tags[e.name] = e.tags, this._states.tags[e.name] = t.grep(this._states.tags[e.name], t.proxy(function (i, s) {
            return t.inArray(i, this._states.tags[e.name]) === s
        }, this)))
    }, n.prototype.suppress = function (e) {
        t.each(e, t.proxy(function (t, e) {
            this._supress[e] = !0
        }, this))
    }, n.prototype.release = function (e) {
        t.each(e, t.proxy(function (t, e) {
            delete this._supress[e]
        }, this))
    }, n.prototype.pointer = function (t) {
        var i = {x: null, y: null};
        return (t = (t = t.originalEvent || t || e.event).touches && t.touches.length ? t.touches[0] : t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t).pageX ? (i.x = t.pageX, i.y = t.pageY) : (i.x = t.clientX, i.y = t.clientY), i
    }, n.prototype.isNumeric = function (t) {
        return !isNaN(parseFloat(t))
    }, n.prototype.difference = function (t, e) {
        return {x: t.x - e.x, y: t.y - e.y}
    }, t.fn.owlCarousel = function (e) {
        var i = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var s = t(this), o = s.data("owl.carousel");
            o || (o = new n(this, "object" == typeof e && e), s.data("owl.carousel", o), t.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function (e, i) {
                o.register({
                    type: n.Type.Event,
                    name: i
                }), o.$element.on(i + ".owl.carousel.core", t.proxy(function (t) {
                    t.namespace && t.relatedTarget !== this && (this.suppress([i]), o[i].apply(this, [].slice.call(arguments, 1)), this.release([i]))
                }, o))
            })), "string" == typeof e && "_" !== e.charAt(0) && o[e].apply(o, i)
        })
    }, t.fn.owlCarousel.Constructor = n
}(window.Zepto || window.jQuery, window, document), function (t, e, i, s) {
    var n = function (e) {
        this._core = e, this._interval = null, this._visible = null, this._handlers = {
            "initialized.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.autoRefresh && this.watch()
            }, this)
        }, this._core.options = t.extend({}, n.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    n.Defaults = {autoRefresh: !0, autoRefreshInterval: 500}, n.prototype.watch = function () {
        this._interval || (this._visible = this._core.isVisible(), this._interval = e.setInterval(t.proxy(this.refresh, this), this._core.settings.autoRefreshInterval))
    }, n.prototype.refresh = function () {
        this._core.isVisible() !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh())
    }, n.prototype.destroy = function () {
        var t, i;
        for (t in e.clearInterval(this._interval), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.AutoRefresh = n
}(window.Zepto || window.jQuery, window, document), function (t, e, i, s) {
    var n = function (e) {
        this._core = e, this._loaded = [], this._handlers = {
            "initialized.owl.carousel change.owl.carousel resized.owl.carousel": t.proxy(function (e) {
                if (e.namespace && this._core.settings && this._core.settings.lazyLoad && (e.property && "position" == e.property.name || "initialized" == e.type)) {
                    var i = this._core.settings, s = i.center && Math.ceil(i.items / 2) || i.items,
                        n = i.center && -1 * s || 0,
                        o = (e.property && void 0 !== e.property.value ? e.property.value : this._core.current()) + n,
                        r = this._core.clones().length, a = t.proxy(function (t, e) {
                            this.load(e)
                        }, this);
                    for (0 < i.lazyLoadEager && (s += i.lazyLoadEager, i.loop && (o -= i.lazyLoadEager, s++)); n++ < s;) this.load(r / 2 + this._core.relative(o)), r && t.each(this._core.clones(this._core.relative(o)), a), o++
                }
            }, this)
        }, this._core.options = t.extend({}, n.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    n.Defaults = {lazyLoad: !1, lazyLoadEager: 0}, n.prototype.load = function (i) {
        var s = this._core.$stage.children().eq(i), n = s && s.find(".owl-lazy");
        !n || -1 < t.inArray(s.get(0), this._loaded) || (n.each(t.proxy(function (i, s) {
            var n, o = t(s),
                r = 1 < e.devicePixelRatio && o.attr("data-src-retina") || o.attr("data-src") || o.attr("data-srcset");
            this._core.trigger("load", {
                element: o,
                url: r
            }, "lazy"), o.is("img") ? o.one("load.owl.lazy", t.proxy(function () {
                o.css("opacity", 1), this._core.trigger("loaded", {element: o, url: r}, "lazy")
            }, this)).attr("src", r) : o.is("source") ? o.one("load.owl.lazy", t.proxy(function () {
                this._core.trigger("loaded", {element: o, url: r}, "lazy")
            }, this)).attr("srcset", r) : ((n = new Image).onload = t.proxy(function () {
                o.css({"background-image": 'url("' + r + '")', opacity: "1"}), this._core.trigger("loaded", {
                    element: o,
                    url: r
                }, "lazy")
            }, this), n.src = r)
        }, this)), this._loaded.push(s.get(0)))
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.Lazy = n
}(window.Zepto || window.jQuery, window, document), function (t, e, i, s) {
    var n = function (i) {
        this._core = i, this._previousHeight = null, this._handlers = {
            "initialized.owl.carousel refreshed.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.autoHeight && this.update()
            }, this), "changed.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.autoHeight && "position" === t.property.name && this.update()
            }, this), "loaded.owl.lazy": t.proxy(function (t) {
                t.namespace && this._core.settings.autoHeight && t.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update()
            }, this)
        }, this._core.options = t.extend({}, n.Defaults, this._core.options), this._core.$element.on(this._handlers), this._intervalId = null;
        var s = this;
        t(e).on("load", function () {
            s._core.settings.autoHeight && s.update()
        }), t(e).resize(function () {
            s._core.settings.autoHeight && (null != s._intervalId && clearTimeout(s._intervalId), s._intervalId = setTimeout(function () {
                s.update()
            }, 250))
        }), t(".head").click(function () {
            s._core.settings.autoHeight && (null != s._intervalId && clearTimeout(s._intervalId), s._intervalId = setTimeout(function () {
                s.update()
            }, 650))
        }), t(".content").click(function () {
            s._core.settings.autoHeight && (null != s._intervalId && clearTimeout(s._intervalId), s._intervalId = setTimeout(function () {
                s.update()
            }, 650))
        }), t(".next__block").click(function () {
            s._core.settings.autoHeight && (null != s._intervalId && clearTimeout(s._intervalId), s._intervalId = setTimeout(function () {
                s.update()
            }, 650))
        }), t(".cost_calc_first_tab").click(function () {
            s._core.settings.autoHeight && (null != s._intervalId && clearTimeout(s._intervalId), s._intervalId = setTimeout(function () {
                s.update()
            }, 650))
        })
    };
    n.Defaults = {autoHeight: !1, autoHeightClass: "owl-height"}, n.prototype.update = function () {
        var e = this._core._current, i = e + this._core.settings.items, s = this._core.settings.lazyLoad,
            n = this._core.$stage.children().toArray().slice(e, i), o = [], r = 0;
        t.each(n, function (e, i) {
            o.push(t(i).height())
        }), (r = Math.max.apply(null, o)) <= 1 && s && this._previousHeight && (r = this._previousHeight), this._previousHeight = r, this._core.$stage.parent().height(r).addClass(this._core.settings.autoHeightClass)
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.AutoHeight = n
}(window.Zepto || window.jQuery, window, document), function (t, e, i, s) {
    var n = function (e) {
        this._core = e, this._videos = {}, this._playing = null, this._handlers = {
            "initialized.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.register({type: "state", name: "playing", tags: ["interacting"]})
            }, this), "resize.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.video && this.isInFullScreen() && t.preventDefault()
            }, this), "refreshed.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove()
            }, this), "changed.owl.carousel": t.proxy(function (t) {
                t.namespace && "position" === t.property.name && this._playing && this.stop()
            }, this), "prepared.owl.carousel": t.proxy(function (e) {
                if (e.namespace) {
                    var i = t(e.content).find(".owl-video");
                    i.length && (i.css("display", "none"), this.fetch(i, t(e.content)))
                }
            }, this)
        }, this._core.options = t.extend({}, n.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", t.proxy(function (t) {
            this.play(t)
        }, this))
    };
    n.Defaults = {video: !1, videoHeight: !1, videoWidth: !1}, n.prototype.fetch = function (t, e) {
        var i = t.attr("data-vimeo-id") ? "vimeo" : t.attr("data-vzaar-id") ? "vzaar" : "youtube",
            s = t.attr("data-vimeo-id") || t.attr("data-youtube-id") || t.attr("data-vzaar-id"),
            n = t.attr("data-width") || this._core.settings.videoWidth,
            o = t.attr("data-height") || this._core.settings.videoHeight, r = t.attr("href");
        if (!r) throw new Error("Missing video URL.");
        if (-1 < (s = r.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/))[3].indexOf("youtu")) i = "youtube"; else if (-1 < s[3].indexOf("vimeo")) i = "vimeo"; else {
            if (!(-1 < s[3].indexOf("vzaar"))) throw new Error("Video URL not supported.");
            i = "vzaar"
        }
        s = s[6], this._videos[r] = {
            type: i,
            id: s,
            width: n,
            height: o
        }, e.attr("data-video", r), this.thumbnail(t, this._videos[r])
    }, n.prototype.thumbnail = function (e, i) {
        var s, n, o = i.width && i.height ? "width:" + i.width + "px;height:" + i.height + "px;" : "",
            r = e.find("img"), a = "src", h = "", l = this._core.settings, c = function (i) {
                s = l.lazyLoad ? t("<div/>", {class: "owl-video-tn " + h, srcType: i}) : t("<div/>", {
                    class: "owl-video-tn",
                    style: "opacity:1;background-image:url(" + i + ")"
                }), e.after(s), e.after('<div class="owl-video-play-icon"></div>')
            };
        if (e.wrap(t("<div/>", {
            class: "owl-video-wrapper",
            style: o
        })), this._core.settings.lazyLoad && (a = "data-src", h = "owl-lazy"), r.length) return c(r.attr(a)), r.remove(), !1;
        "youtube" === i.type ? (n = "//img.youtube.com/vi/" + i.id + "/hqdefault.jpg", c(n)) : "vimeo" === i.type ? t.ajax({
            type: "GET",
            url: "//vimeo.com/api/v2/video/" + i.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (t) {
                n = t[0].thumbnail_large, c(n)
            }
        }) : "vzaar" === i.type && t.ajax({
            type: "GET",
            url: "//vzaar.com/api/videos/" + i.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (t) {
                n = t.framegrab_url, c(n)
            }
        })
    }, n.prototype.stop = function () {
        this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video")
    }, n.prototype.play = function (e) {
        var i, s = t(e.target).closest("." + this._core.settings.itemClass), n = this._videos[s.attr("data-video")],
            o = n.width || "100%", r = n.height || this._core.$stage.height();
        this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), s = this._core.items(this._core.relative(s.index())), this._core.reset(s.index()), (i = t('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>')).attr("height", r), i.attr("width", o), "youtube" === n.type ? i.attr("src", "//www.youtube.com/embed/" + n.id + "?autoplay=1&rel=0&v=" + n.id) : "vimeo" === n.type ? i.attr("src", "//player.vimeo.com/video/" + n.id + "?autoplay=1") : "vzaar" === n.type && i.attr("src", "//view.vzaar.com/" + n.id + "/player?autoplay=true"), t(i).wrap('<div class="owl-video-frame" />').insertAfter(s.find(".owl-video")), this._playing = s.addClass("owl-video-playing"))
    }, n.prototype.isInFullScreen = function () {
        var e = i.fullscreenElement || i.mozFullScreenElement || i.webkitFullscreenElement;
        return e && t(e).parent().hasClass("owl-video-frame")
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this._core.$element.off("click.owl.video"), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.Video = n
}(window.Zepto || window.jQuery, window, document), function (t, e, i, s) {
    var n = function (e) {
        this.core = e, this.core.options = t.extend({}, n.Defaults, this.core.options), this.swapping = !0, this.previous = void 0, this.next = void 0, this.handlers = {
            "change.owl.carousel": t.proxy(function (t) {
                t.namespace && "position" == t.property.name && (this.previous = this.core.current(), this.next = t.property.value)
            }, this), "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": t.proxy(function (t) {
                t.namespace && (this.swapping = "translated" == t.type)
            }, this), "translate.owl.carousel": t.proxy(function (t) {
                t.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
            }, this)
        }, this.core.$element.on(this.handlers)
    };
    n.Defaults = {animateOut: !1, animateIn: !1}, n.prototype.swap = function () {
        if (1 === this.core.settings.items && t.support.animation && t.support.transition) {
            this.core.speed(0);
            var e, i = t.proxy(this.clear, this), s = this.core.$stage.children().eq(this.previous),
                n = this.core.$stage.children().eq(this.next), o = this.core.settings.animateIn,
                r = this.core.settings.animateOut;
            this.core.current() !== this.previous && (r && (e = this.core.coordinates(this.previous) - this.core.coordinates(this.next), s.one(t.support.animation.end, i).css({left: e + "px"}).addClass("animated owl-animated-out").addClass(r)), o && n.one(t.support.animation.end, i).addClass("animated owl-animated-in").addClass(o))
        }
    }, n.prototype.clear = function (e) {
        t(e.target).css({left: ""}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd()
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.Animate = n
}(window.Zepto || window.jQuery, window, document), function (t, e, i, s) {
    var n = function (e) {
        this._core = e, this._call = null, this._time = 0, this._timeout = 0, this._paused = !0, this._handlers = {
            "changed.owl.carousel": t.proxy(function (t) {
                t.namespace && "settings" === t.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : t.namespace && "position" === t.property.name && this._paused && (this._time = 0)
            }, this), "initialized.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.autoplay && this.play()
            }, this), "play.owl.autoplay": t.proxy(function (t, e, i) {
                t.namespace && this.play(e, i)
            }, this), "stop.owl.autoplay": t.proxy(function (t) {
                t.namespace && this.stop()
            }, this), "mouseover.owl.autoplay": t.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this), "mouseleave.owl.autoplay": t.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play()
            }, this), "touchstart.owl.core": t.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this), "touchend.owl.core": t.proxy(function () {
                this._core.settings.autoplayHoverPause && this.play()
            }, this)
        }, this._core.$element.on(this._handlers), this._core.options = t.extend({}, n.Defaults, this._core.options)
    };
    n.Defaults = {
        autoplay: !1,
        autoplayTimeout: 5e3,
        autoplayHoverPause: !1,
        autoplaySpeed: !1
    }, n.prototype._next = function (s) {
        this._call = e.setTimeout(t.proxy(this._next, this, s), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()), this._core.is("interacting") || i.hidden || this._core.next(s || this._core.settings.autoplaySpeed)
    }, n.prototype.read = function () {
        return (new Date).getTime() - this._time
    }, n.prototype.play = function (i, s) {
        var n;
        this._core.is("rotating") || this._core.enter("rotating"), i = i || this._core.settings.autoplayTimeout, n = Math.min(this._time % (this._timeout || i), i), this._paused ? (this._time = this.read(), this._paused = !1) : e.clearTimeout(this._call), this._time += this.read() % i - n, this._timeout = i, this._call = e.setTimeout(t.proxy(this._next, this, s), i - n)
    }, n.prototype.stop = function () {
        this._core.is("rotating") && (this._time = 0, this._paused = !0, e.clearTimeout(this._call), this._core.leave("rotating"))
    }, n.prototype.pause = function () {
        this._core.is("rotating") && !this._paused && (this._time = this.read(), this._paused = !0, e.clearTimeout(this._call))
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this.stop(), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.autoplay = n
}(window.Zepto || window.jQuery, window, document), function (t, e, i, s) {
    "use strict";
    var n = function (e) {
        this._core = e, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        }, this._handlers = {
            "prepared.owl.carousel": t.proxy(function (e) {
                e.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + t(e.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>")
            }, this), "added.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 0, this._templates.pop())
            }, this), "remove.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 1)
            }, this), "changed.owl.carousel": t.proxy(function (t) {
                t.namespace && "position" == t.property.name && this.draw()
            }, this), "initialized.owl.carousel": t.proxy(function (t) {
                t.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation"))
            }, this), "refreshed.owl.carousel": t.proxy(function (t) {
                t.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"))
            }, this)
        }, this._core.options = t.extend({}, n.Defaults, this._core.options), this.$element.on(this._handlers)
    };
    n.Defaults = {
        nav: !1,
        navText: ['<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>'],
        navSpeed: !1,
        navElement: 'button id="buttonNavigation2" type="button" role="presentation"',
        navContainer: !1,
        navContainerClass: "owl-nav",
        navClass: ["owl-prev", "owl-next"],
        slideBy: 1,
        dotClass: "owl-dot",
        dotsClass: "owl-dots",
        dots: !0,
        dotsEach: !1,
        dotsData: !1,
        dotsSpeed: !1,
        dotsContainer: !1
    }, n.prototype.initialize = function () {
        var e, i = this._core.settings;
        for (e in this._controls.$relative = (i.navContainer ? t(i.navContainer) : t("<div>").addClass(i.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = t("<" + i.navElement + ">").addClass(i.navClass[0]).html(i.navText[0]).prependTo(this._controls.$relative).on("click", t.proxy(function (t) {
            this.prev(i.navSpeed)
        }, this)), this._controls.$next = t("<" + i.navElement + ">").addClass(i.navClass[1]).html(i.navText[1]).appendTo(this._controls.$relative).on("click", t.proxy(function (t) {
            this.next(i.navSpeed)
        }, this)), i.dotsData || (this._templates = [t('<button role="button">').addClass(i.dotClass).append(t("<span>")).prop("outerHTML")]), this._controls.$absolute = (i.dotsContainer ? t(i.dotsContainer) : t("<div>").addClass(i.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "button", t.proxy(function (e) {
            var s = t(e.target).parent().is(this._controls.$absolute) ? t(e.target).index() : t(e.target).parent().index();
            e.preventDefault(), this.to(s, i.dotsSpeed)
        }, this)), this._overrides) this._core[e] = t.proxy(this[e], this)
    }, n.prototype.destroy = function () {
        var t, e, i, s, n;
        for (t in n = this._core.settings, this._handlers) this.$element.off(t, this._handlers[t]);
        for (e in this._controls) "$relative" === e && n.navContainer ? this._controls[e].html("") : this._controls[e].remove();
        for (s in this.overides) this._core[s] = this._overrides[s];
        for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
    }, n.prototype.update = function () {
        var t, e, i = this._core.clones().length / 2, s = i + this._core.items().length, n = this._core.maximum(!0),
            o = this._core.settings, r = o.center || o.autoWidth || o.dotsData ? 1 : o.dotsEach || o.items;
        if ("page" !== o.slideBy && (o.slideBy = Math.min(o.slideBy, o.items)), o.dots || "page" == o.slideBy) for (this._pages = [], t = i, e = 0; t < s; t++) {
            if (r <= e || 0 === e) {
                if (this._pages.push({start: Math.min(n, t - i), end: t - i + r - 1}), Math.min(n, t - i) === n) break;
                e = 0
            }
            e += this._core.mergers(this._core.relative(t))
        }
    }, n.prototype.draw = function () {
        var e, i = this._core.settings, s = this._core.items().length <= i.items,
            n = this._core.relative(this._core.current()), o = i.loop || i.rewind;
        this._controls.$relative.toggleClass("disabled", !i.nav || s), i.nav && (this._controls.$previous.toggleClass("disabled", !o && n <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !o && n >= this._core.maximum(!0))), this._controls.$absolute.toggleClass("disabled", !i.dots || s), i.dots && (e = this._pages.length - this._controls.$absolute.children().length, i.dotsData && 0 !== e ? this._controls.$absolute.html(this._templates.join("")) : 0 < e ? this._controls.$absolute.append(new Array(e + 1).join(this._templates[0])) : e < 0 && this._controls.$absolute.children().slice(e).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(t.inArray(this.current(), this._pages)).addClass("active"))
    }, n.prototype.onTrigger = function (e) {
        var i = this._core.settings;
        e.page = {
            index: t.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: i && (i.center || i.autoWidth || i.dotsData ? 1 : i.dotsEach || i.items)
        }
    }, n.prototype.current = function () {
        var e = this._core.relative(this._core.current());
        return t.grep(this._pages, t.proxy(function (t, i) {
            return t.start <= e && t.end >= e
        }, this)).pop()
    }, n.prototype.getPosition = function (e) {
        var i, s, n = this._core.settings;
        return "page" == n.slideBy ? (i = t.inArray(this.current(), this._pages), s = this._pages.length, e ? ++i : --i, i = this._pages[(i % s + s) % s].start) : (i = this._core.relative(this._core.current()), s = this._core.items().length, e ? i += n.slideBy : i -= n.slideBy), i
    }, n.prototype.next = function (e) {
        t.proxy(this._overrides.to, this._core)(this.getPosition(!0), e)
    }, n.prototype.prev = function (e) {
        t.proxy(this._overrides.to, this._core)(this.getPosition(!1), e)
    }, n.prototype.to = function (e, i, s) {
        var n;
        !s && this._pages.length ? (n = this._pages.length, t.proxy(this._overrides.to, this._core)(this._pages[(e % n + n) % n].start, i)) : t.proxy(this._overrides.to, this._core)(e, i)
    }, t.fn.owlCarousel.Constructor.Plugins.Navigation = n
}(window.Zepto || window.jQuery, window, document), function (t, e, i, s) {
    "use strict";
    var n = function (i) {
        this._core = i, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
            "initialized.owl.carousel": t.proxy(function (i) {
                i.namespace && "URLHash" === this._core.settings.startPosition && t(e).trigger("hashchange.owl.navigation")
            }, this), "prepared.owl.carousel": t.proxy(function (e) {
                if (e.namespace) {
                    var i = t(e.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                    if (!i) return;
                    this._hashes[i] = e.content
                }
            }, this), "changed.owl.carousel": t.proxy(function (i) {
                if (i.namespace && "position" === i.property.name) {
                    var s = this._core.items(this._core.relative(this._core.current())),
                        n = t.map(this._hashes, function (t, e) {
                            return t === s ? e : null
                        }).join();
                    if (!n || e.location.hash.slice(1) === n) return;
                    e.location.hash = n
                }
            }, this)
        }, this._core.options = t.extend({}, n.Defaults, this._core.options), this.$element.on(this._handlers), t(e).on("hashchange.owl.navigation", t.proxy(function (t) {
            var i = e.location.hash.substring(1), s = this._core.$stage.children(),
                n = this._hashes[i] && s.index(this._hashes[i]);
            void 0 !== n && n !== this._core.current() && this._core.to(this._core.relative(n), !1, !0)
        }, this))
    };
    n.Defaults = {URLhashListener: !1}, n.prototype.destroy = function () {
        var i, s;
        for (i in t(e).off("hashchange.owl.navigation"), this._handlers) this._core.$element.off(i, this._handlers[i]);
        for (s in Object.getOwnPropertyNames(this)) "function" != typeof this[s] && (this[s] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.Hash = n
}(window.Zepto || window.jQuery, window, document), function (t, e, i, s) {
    var n = t("<support>").get(0).style, o = "Webkit Moz O ms".split(" "), r = {
        transition: {
            end: {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd",
                transition: "transitionend"
            }
        },
        animation: {
            end: {
                WebkitAnimation: "webkitAnimationEnd",
                MozAnimation: "animationend",
                OAnimation: "oAnimationEnd",
                animation: "animationend"
            }
        }
    };

    function a(e, i) {
        var r = !1, a = e.charAt(0).toUpperCase() + e.slice(1);
        return t.each((e + " " + o.join(a + " ") + a).split(" "), function (t, e) {
            if (n[e] !== s) return r = !i || e, !1
        }), r
    }

    function h(t) {
        return a(t, !0)
    }

    !!a("transition") && (t.support.transition = new String(h("transition")), t.support.transition.end = r.transition.end[t.support.transition]), !!a("animation") && (t.support.animation = new String(h("animation")), t.support.animation.end = r.animation.end[t.support.animation]), a("transform") && (t.support.transform = new String(h("transform")), t.support.transform3d = !!a("perspective"))
}(window.Zepto || window.jQuery, window, document);