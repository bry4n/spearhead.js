class Module
  @moduleKeywords: ['extended']
  
  @extend: (klass) ->
    @[key] = value for key, value of klass when key not in @moduleKeywords
    klass.extended?.apply(@)
    @
  
class Application extends Module
  eventSplitter: /^(\S+)\s*(.*)$/
  tagName: 'div'
  divElement: try document.createElement(@tagName) catch e then @tagName
  
  constructor: (@options) ->
    throw new Error("Please include the jQuery or Zepto library!") unless (jQuery || Zepto)
    @_configure(@constructor)
    @initialize?.apply(@, arguments)
    @_configure(@options || {})
    @el = $((@el || @divElement))
    @events = (@events || {})
    @_delegateEvents()
    super
  
  _configure: (options) ->
    for key, value of options
      @[key] = value

  _delegateEvents: ->
    for event, callback of @events
      callback = @[callback] unless typeof(callback) is 'function'
      throw new Error("Method '#{callback}' does not exist") unless callback
      [_, eventName, selector] = event.match(@eventSplitter)
      if selector is ''
        @el.bind(eventName, callback)
      else
        @el.delegate(selector, eventName, callback)

Spearhead = @Spearhead    = {}
Spearhead.VERSION         = "0.1"
Spearhead.Class           = Module
Spearhead.Application     = Application
