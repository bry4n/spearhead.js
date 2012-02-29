/**
 * Spearhead.js Javascript Framework v0.1
 * http://spearheadjs.org/
 *
 * Copyright 2012, Bryan Goines
 * Released under the MIT License
 */

(function() {
  var Application, Module, Spearhead,
    __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Module = (function() {

    function Module() {}

    Module.moduleKeywords = ['extended'];

    Module.extend = function(klass) {
      var key, value, _ref;
      for (key in klass) {
        value = klass[key];
        if (__indexOf.call(this.moduleKeywords, key) < 0) this[key] = value;
      }
      if ((_ref = klass.extended) != null) _ref.apply(this);
      return this;
    };

    return Module;

  })();

  Application = (function(_super) {

    __extends(Application, _super);

    Application.prototype.eventSplitter = /^(\S+)\s*(.*)$/;

    Application.prototype.tagName = 'div';

    Application.prototype.divElement = (function() {
      try {
        return document.createElement(Application.tagName);
      } catch (e) {
        return Application.tagName;
      }
    })();

    function Application(options) {
      var _ref;
      this.options = options;
      if (!(jQuery || Zepto)) {
        throw new Error("Please include the jQuery or Zepto library!");
      }
      this._configure(this.constructor);
      if ((_ref = this.initialize) != null) _ref.apply(this, arguments);
      this._configure(this.options || {});
      this.el = $(this.el || this.divElement);
      this.events = this.events || {};
      this._delegateEvents();
      Application.__super__.constructor.apply(this, arguments);
    }

    Application.prototype._configure = function(options) {
      var key, value, _results;
      _results = [];
      for (key in options) {
        value = options[key];
        _results.push(this[key] = value);
      }
      return _results;
    };

    Application.prototype._delegateEvents = function() {
      var callback, event, eventName, selector, _, _ref, _ref2, _results;
      _ref = this.events;
      _results = [];
      for (event in _ref) {
        callback = _ref[event];
        if (typeof callback !== 'function') callback = this[callback];
        if (!callback) throw new Error("Method '" + callback + "' does not exist");
        _ref2 = event.match(this.eventSplitter), _ = _ref2[0], eventName = _ref2[1], selector = _ref2[2];
        if (selector === '') {
          _results.push(this.el.bind(eventName, callback));
        } else {
          _results.push(this.el.delegate(selector, eventName, callback));
        }
      }
      return _results;
    };

    return Application;

  })(Module);

  Spearhead = this.Spearhead = {};

  Spearhead.VERSION = "0.1";

  Spearhead.Class = Module;

  Spearhead.Application = Application;

}).call(this);
