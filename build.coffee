{Spearhead}   = require './src/spearhead'
CoffeeScript  = require 'coffee-script'
fs            = require 'fs'
path          = require 'path'
util          = require 'util'
spawn         = require('child_process').spawn
growl         = (try require 'growl' catch e then util.log)

header = """
  /**
   * Spearhead.js Javascript Framework v#{Spearhead.VERSION}
   * http://spearheadjs.org/
   *
   * Copyright 2012, Bryan Goines
   * Released under the MIT License
   */
"""

Build =

  notify: (message) ->
    options =
      title: "CoffeeScript"
    growl message, options

  files: ->
    files = fs.readdirSync 'src'
    for file in files when file.match(/\.coffee$/)
      path = 'src/' + file
      newPath = file.replace(/\.coffee$/,'.js')
      source = header + "\n\n" + CoffeeScript.compile(fs.readFileSync(path).toString(), bare:false)
      @notify "compiling #{file} (#{newPath})"
      fs.writeFileSync newPath, source
  
  minify: ->
    uglify = spawn("uglifyjs", ["-o spearhead.min.js", "spearhead.js"])
    uglify.stdout.on 'data', (data) -> console.log data
  
  watch: ->
    files = fs.readdirSync 'src'
    for file in files when file.match(/\.coffee$/)
      util.log "watching #{file}"
      fs.watchFile 'src/' + file, (curr, prev) ->
        if +curr.mtime isnt +prev.mtime
          Build.files()
  all: ->
    Build.files()
    Build.minify()

exports.Build = Build
