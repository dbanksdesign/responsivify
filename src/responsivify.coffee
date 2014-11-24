class @Responsivify
  @DEFAULTS: {
    breakpoints: {
      'max_breakpoint'     : 1300,
      'largest_breakpoint' : 1200,
      'larger_breakpoint'  : 1100,
      'large_breakpoint'   : 1000,
      'medium_breakpoint'  : 800,
      'small_breakpoint'   : 600,
      'smaller_breakpoint' : 400
    },

    html_class: true
  }

  constructor: (@init_options) ->

    @options = _.extend @init_options, Responsivify.DEFAULTS
    @options.breakpoint_values  = _.invert(@options.breakpoints)
    @options.breakpoint_classes = _.keys(@options.breakpoints)
    @options.breakpoint_widths  = _.values(@options.breakpoints)

    @current_width      = null
    @current_breakpoint = null

    @setup_event_handlers()
    @setup_helpers()
    @threshold()


  # Sets up the event handler on window.resize and debounces it so
  # it only gets called once window.resize hasn't been called in the last
  # 300 milliseconds
  setup_event_handlers: () =>
    $(window).resize( _.debounce(@threshold.bind(@), 300) )


  setup_helpers: () =>
    _.each(@options.breakpoints, (val, key, list) =>
      method_name = "is_#{key}_breakpoint"
      width = val
      @[method_name] = () =>
        @current_width >= width
      )


  threshold: () ->
    width      = $(window).outerWidth()
    breakpoint = @get_breakpoint( width )
    expanding  = false

    # If the new responsive classname is different, then we've hit a threshold
    if @current_breakpoint != breakpoint
      # expanding lets us know if the users window is expanding or not (duh)
      expanding = true if @current_width < width

      # Set the breakpoint classname on the html element and set the width/current class onto this class
      $('html').addClass(breakpoint).removeClass(@current_breakpoint) if @options.html_class

      #
      @current_breakpoint = breakpoint
      @current_width      = width

      # Trigger a generic threshold happened event
      @Events('threshold').publish({expanding: expanding, breakpoint: @current_breakpoint});

      # Trigger events that are at least the breakpoint we changed to
      # ex: is_large_breakpoint, is_medium_breakpoint, is_small_breakpoint
      _.each(@options.breakpoints, (width, breakpoint, list) =>
        @publish_event(breakpoint, expanding) if @current_width >= width
        )


  publish_event: (breakpoint, expanding) =>
    @Events("is_#{breakpoint}").publish({expanding: expanding, breakpoint: @current_breakpoint})


  # Gets the responsive classname for a specific browser width
  # classnames are always for the largest possible width
  # ie: 1199 = larger_breakpoint, 1200 = largest_breakpoint
  get_breakpoint: (width) =>
    breakpoint_width = _.find(@options.breakpoint_widths, (val) =>
      return width >= val
      )
    return @options.breakpoint_values[breakpoint_width]


  Events: (id) ->
    @EVENTS = @EVENTS || {}
    topic = id && @EVENTS[ id ]

    if !topic
      callbacks = $.Callbacks()
      topic = {
        publish: callbacks.fire,
        subscribe: callbacks.add,
        unsubscribe: callbacks.remove
      }

      @EVENTS[ id ] = topic if id

    return topic

