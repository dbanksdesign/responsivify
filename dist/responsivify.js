(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Responsivify = (function() {
    Responsivify.DEFAULTS = {
      breakpoints: {
        'max_breakpoint': 1300,
        'largest_breakpoint': 1200,
        'larger_breakpoint': 1100,
        'large_breakpoint': 1000,
        'medium_breakpoint': 800,
        'small_breakpoint': 600,
        'smaller_breakpoint': 400
      },
      html_class: true
    };

    function Responsivify(init_options) {
      this.init_options = init_options;
      this.get_breakpoint = __bind(this.get_breakpoint, this);
      this.publish_event = __bind(this.publish_event, this);
      this.setup_helpers = __bind(this.setup_helpers, this);
      this.setup_event_handlers = __bind(this.setup_event_handlers, this);
      this.options = _.extend(this.init_options, Responsivify.DEFAULTS);
      this.options.breakpoint_values = _.invert(this.options.breakpoints);
      this.options.breakpoint_classes = _.keys(this.options.breakpoints);
      this.options.breakpoint_widths = _.values(this.options.breakpoints);
      this.current_width = null;
      this.current_breakpoint = null;
      this.setup_event_handlers();
      this.setup_helpers();
      this.threshold();
    }

    Responsivify.prototype.setup_event_handlers = function() {
      return $(window).resize(_.debounce(this.threshold.bind(this), 300));
    };

    Responsivify.prototype.setup_helpers = function() {
      return _.each(this.options.breakpoints, (function(_this) {
        return function(val, key, list) {
          var method_name, width;
          method_name = "is_" + key + "_breakpoint";
          width = val;
          return _this[method_name] = function() {
            return _this.current_width >= width;
          };
        };
      })(this));
    };

    Responsivify.prototype.threshold = function() {
      var breakpoint, expanding, width;
      width = $(window).outerWidth();
      breakpoint = this.get_breakpoint(width);
      expanding = false;
      if (this.current_breakpoint !== breakpoint) {
        if (this.current_width < width) {
          expanding = true;
        }
        if (this.options.html_class) {
          $('html').addClass(breakpoint).removeClass(this.current_breakpoint);
        }
        this.current_breakpoint = breakpoint;
        this.current_width = width;
        this.Events('threshold').publish({
          expanding: expanding,
          breakpoint: this.current_breakpoint
        });
        return _.each(this.options.breakpoints, (function(_this) {
          return function(width, breakpoint, list) {
            if (_this.current_width >= width) {
              return _this.publish_event(breakpoint, expanding);
            }
          };
        })(this));
      }
    };

    Responsivify.prototype.publish_event = function(breakpoint, expanding) {
      return this.Events("is_" + breakpoint).publish({
        expanding: expanding,
        breakpoint: this.current_breakpoint
      });
    };

    Responsivify.prototype.get_breakpoint = function(width) {
      var breakpoint_width;
      breakpoint_width = _.find(this.options.breakpoint_widths, (function(_this) {
        return function(val) {
          return width >= val;
        };
      })(this));
      return this.options.breakpoint_values[breakpoint_width];
    };

    Responsivify.prototype.Events = function(id) {
      var callbacks, topic;
      this.EVENTS = this.EVENTS || {};
      topic = id && this.EVENTS[id];
      if (!topic) {
        callbacks = $.Callbacks();
        topic = {
          publish: callbacks.fire,
          subscribe: callbacks.add,
          unsubscribe: callbacks.remove
        };
        if (id) {
          this.EVENTS[id] = topic;
        }
      }
      return topic;
    };

    return Responsivify;

  })();

}).call(this);
