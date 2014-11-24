(function( $,_ ) {

  window.Responsivify = function(options) {

  }

    Events: Spokes.Utils.Events,

    BREAKPOINT_WIDTHS_TO_CLASSES: {
      1300 : 'max_breakpoint',
      1200 : 'largest_breakpoint',
      1100 : 'larger_breakpoint',
      1000 : 'large_breakpoint',
      800  : 'medium_breakpoint',
      600  : 'small_breakpoint',
      400  : 'smaller_breakpoint'
    },

    BREAKPOINT_CLASSES_TO_WIDTHS: {
      'max_breakpoint'     : 1300,
      'largest_breakpoint' : 1200,
      'larger_breakpoint'  : 1100,
      'large_breakpoint'   : 1000,
      'medium_breakpoint'  : 800,
      'small_breakpoint'   : 600,
      'smaller_breakpoint' : 400
    },

    BREAKPOINT_CLASSES : ['max_breakpoint','largest_breakpoint','larger_breakpoint','large_breakpoint','medium_breakpoint','small_breakpoint','smaller_breakpoint'],
    BREAKPOINT_WIDTHS  : [1300, 1200, 1100, 1000, 800, 600, 400],

    current_width      : null,
    current_classname  : null,


    // Sets up the event handlers and initializes the width/classname for the browser
    initialize: function() {
      this.setup_event_hanlders();
      this.setup_helpers();
      this.threshold();
    },


    // Sets up the event handler on window.resize and debounces it so
    // it only gets called once window.resize hasn't been called in the last
    // 300 milliseconds
    setup_event_hanlders: function() {
      $(window).resize( _.debounce(this.threshold.bind(this), 300) );
    },


    // Create helper methods to test if the browser is at least a certain width
    // is_large_width() = true
    setup_helpers: function() {
      var self = this;
      $.each(this.BREAKPOINT_CLASSES_TO_WIDTHS, function(attr, val){
        var method_name = 'is_' + attr;
        var width = val;
        self[method_name] = function() {
          return self.current_width >= width;
        }
      });
    },


    // Checks if the browser resize triggers a breakpoint
    // and changes the classname on the HTML element
    threshold: function() {
      var width     = $(window).outerWidth(),
          classname = this.get_classname( width ),
          expanding = null;

      // If the new responsive classname is different, then we've hit a threshold
      if (this.current_classname != classname) {
        if (this.current_width < width)
          expanding = true // expanding lets us know if the users window is expanding or not (duh)

        // Set the breakpoint classname on the html element and set the width/current class onto this class
        $('html').addClass(classname).removeClass(this.current_classname);
        this.current_classname = classname;
        this.current_width     = width;

        // Trigger a generic threshold happened event
        this.Events('threshold').publish({expanding: expanding, breakpoint: this.current_classname});

        // Trigger events that are at least the breakpoint we changed to
        // ex: is_large_breakpoint, is_medium_breakpoint, is_small_breakpoint
        var i = _.indexOf(this.BREAKPOINT_CLASSES, classname);
        for (i; i <= this.BREAKPOINT_CLASSES.length - 1; i++) {
          this.Events('is_' + this.BREAKPOINT_CLASSES[i]).publish({expanding: expanding, breakpoint: this.current_classname});
        };
      }
    },


    // Gets the responsive classname for a specific browser width
    // classnames are always for the largest possible width
    // ie: 1199 = larger_breakpoint, 1200 = largest_breakpoint
    get_classname: function(width) {
      var classname = '';
      for (var i = 0; i < this.BREAKPOINT_WIDTHS.length; i++) {
        if (width >= this.BREAKPOINT_WIDTHS[i]) {
          return this.BREAKPOINT_CLASSES[i];
        }
      };
    }

  };

})(jQuery,_);