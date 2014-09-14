// If running under node.js as a library
if ( typeof module !== 'undefined' ) {
  module.exports = {
    LeadSheet: LeadSheet
  }
}

function LeadSheet() {
  this.stanzas = []
  this.chords = {}
}

function strip_tags(input, allowed) {
  allowed = (((allowed || '') + '')
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
    commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '')
    .replace(tags, function ($0, $1) {
      return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
    });
}

LeadSheet.prototype.parse = function( raw_string ) {
  var raw_string = strip_tags( raw_string )
  var lines = raw_string.split("\n")
  var current_stanza = new Stanza()
  for (var i=0; i<lines.length; i++) {
    var line = lines[i]
    switch( true ) {
      // If line matches /^[a-z0-9]:/i
      case /^[^\s]+?\s*:/i.test( line ):
        // Pull out the key value pair and add to the LeadSheet object
        var res = /([^\s]+?)\s*:\s*(.*)/i.exec( line )
        this[ res[1] ] = res[2]
        break;
      // If line matches /^\+/
      case /^\+/.test( line ):
        // Load the chord
        var res = /^\+\s*([^\s]+)\s*([0-9x,]+)\s*(.*)$/.exec( line )
        this.chords[ res[1] ] = new Chord( res[2], LeadSheetHelper.clean( res[3] == "" ? res[1] : res[3] ) )
        break
      // If line is blank or ends in =
      case ( /^\s*$/.test( line ) || /.*?=\s*/.test( line ) ):
      // Check if current stanza is not empty and add to stanzas if not
        if ( current_stanza.length() > 0 ) this.stanzas.push( current_stanza )
        var stanza_name = /^(.*?)\s*=\s*/.exec( line )
        if( stanza_name ) {
          current_stanza = new Stanza( stanza_name[1] )
        } else {
          current_stanza = new Stanza( )
        }
        break
      // Otherwise, push the line to the current stanza
      default:
        current_stanza.push( new StanzaLine( line ) )
    }
  }
}

LeadSheet.prototype.emit = function() {
  var header = ""
  if ( this.Title ) {
    header += LeadSheet.xml( 'div', this.Title, { 'class': 'title' } )
  }
  if ( this.Artist ) {
    header += LeadSheet.xml( 'div', this.Artist, { 'class': 'artist' } )
  }
  var chords = ""
  for ( var c in this.chords ) {
    chords += LeadSheet.xml( 'div', this.chords[c].emit(), { 'class': 'chord' } )
  }
  var stanzas = ""
  for ( var i = 0; i < this.stanzas.length; i++ ) {
    stanzas += this.stanzas[i].emit( this )
  }
  return LeadSheet.xml( 'div',
    LeadSheet.xml( 'div', header, { 'class': 'header'} ) +
    LeadSheet.xml( 'div', chords, { 'class': 'chords' } ) +
    LeadSheet.xml( 'div', stanzas, { 'class': 'stanzas' } ),
    { 'class': 'leadsheet' }
  )
  // return JSON.stringify( this )
}

LeadSheet.prototype.stylesheet = function() {
  var stylesheet = [
    ".leadsheet { width: 210mm; padding: 20mm; } /* Page setup */",
    ".header { text-align: center; padding-bottom: 2em; }",
    ".title { font-size: 2em; font-weight: bold; }",
    ".artist { font-size: 1.5em; }",
    ".chords { text-align: center; padding-bottom: 2em; }",
    ".chord { display: inline; }",
    ".chordbox { width: 2cm; height: 2cm; }",
    ".chordbox text.fretmarker { font-size: 60%; font-style: italic; dominant-baseline: central; text-anchor: end; }",
    ".chordbox text.chordname { text-anchor: middle; }",
    ".chordbox circle.fretted { fill: black; stroke: black; }",
    ".chordbox circle.open { fill: none; stroke: black; }",
    ".chordbox line, .chordbox path { stroke-linecap: square; stroke: black; }",
    ".chordbox line.fret { }",
    ".chordbox line.nut { stroke-width: 2px; }",
    ".chordbox line.string { }",
    ".chordbox path.unplayed { }",
    ".stanza { padding-bottom: 2em; }",
    ".repeat { display: inline-block; float: right; font-style: italic; }",
    ".repeat:before { content: 'repeat x '; }",
    ".stanzaline { }",
    ".withchords { padding-top: 1em; }",
    ".stanzaname { font-style: italic; }",
    ".stanzaname:after { content: ':'; }",
    ".barsystem { border-left: 2px solid; margin: 0 0 1ex 0; }",
    ".bar { border-right: 2px solid; display: inline-block; width: 7em; padding: 0 1em; text-align: center; }",
    ".barelement { display: inline-block; padding: 0 5px; }",
    ".lyric { display: inline; }",
    ".chordref { width: 0; display: inline-block; position: relative; top: -1em; text-align: center; vertical-align: baseline; }",
    ".undefined { color: red; }",
    ].join("")
  return stylesheet
}

LeadSheet.xml = function( name, content, attributes ) {
  var att_str = ""
  if (attributes) {
    for ( var att in attributes) {
      att_val = attributes[att]
      att_str += " " + att + "='" + att_val + "'"
    }
  }
  var xml
  if ( !content ){
    xml='<' + name + att_str + '></' + name + '>'
  } else {
    xml='<'+ name + att_str + '>' + content + '</' + name + '>'
  }
  return xml
}


function LeadSheetHelper() {

}

LeadSheetHelper.clean = function( string ) {
  string = string.replace( /#/g, "&#9839;" )
  string = string.replace( /\\/g, "&#9837;" )
  return string
}

LeadSheetHelper.uuid = function() {
  uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
  return uuid
}


function Chord( strings, name ) {
  this.name = name
  this.strings = strings.split(",")
}

Chord.get_fret_range = function( ar ) {
  var the_max = 0;
  var the_min = Infinity;
  for ( var i = 0; i < ar.length; i++) {
    if ( ! isNaN( ar[i] ) ) {
      the_max = Math.max( ar[i], the_max )
      the_min = Math.min( ar[i], the_min )
    }
  }
  return { max: the_max, min: the_min }
}

Chord.prototype.emit = function() {
  var uuid = LeadSheetHelper.uuid()
  var num_strings = this.strings.length
  var spacing = [7,10]
  var fret_range = Chord.get_fret_range( this.strings )
  var num_frets = 5
  var bottom_fret = Math.max( fret_range.max - num_frets + 1, 0 )

  var box_width = spacing[0] * (num_strings-1)
  var box_height = spacing[1] * (num_frets-1)

  var defs = LeadSheet.xml( 'defs',
    LeadSheet.xml( 'circle', '',
      {'id': 'open_' + uuid, 'class': 'open','cx': '0', 'cy': (-spacing[1]/2), 'r': '3' } ) +
    LeadSheet.xml( 'circle', '',
      {'id': 'fretted_' + uuid, 'class': 'fretted', 'cx': '0', 'cy': (-spacing[1]/2), 'r': '2.5' } ) +
    LeadSheet.xml( 'path', '',
      {'id': 'unplayed_' + uuid, 'class': 'unplayed', d: 'M -3 ' + (-3-spacing[1]/2) + ' l 6 6 m -6 0 l 6 -6' } ) +
    LeadSheet.xml( 'line', '',
      {'id': 'string_' + uuid, 'class': 'string', 'x1': '0', 'y1': '0', 'x2': '0', 'y2': box_height } ) +
    LeadSheet.xml( 'line', "",
      {'id': 'fret_' + uuid, 'class': 'fret', 'x1': '0', 'y1': '0', 'x2': box_width, 'y2': '0' } ) +
    LeadSheet.xml( 'line', "",
      {'id': 'nut_' + uuid, 'class': 'nut', 'x1': '0', 'y1': '0', 'x2': box_width, 'y2': '0' } )
  )

  var box = ""

  box += LeadSheet.xml( 'text', this.name,
    { 'class': 'chordname', 'x': (box_width/2), 'y': -spacing[1]-3 })
  if ( bottom_fret != 0 ) {
    box += LeadSheet.xml( 'text', (bottom_fret + 1)+ "fr.",
    { 'class': 'fretmarker', 'x': -5, 'y': 0 })
  }
  // Draw frets
  for ( var i = 0; i < num_frets; i++) {
    var ref = '#fret'
    var fret_offset = bottom_fret + i
    if ( fret_offset == 0 ) {
      var ref = '#nut'
    }
    box += LeadSheet.xml( 'use', '', { 'xlink:href': ref + '_' + uuid, y: i*spacing[1] })
  }

  // Draw strings and fret markers
  for ( var i = 0; i < num_strings; ++i) {
    var ref
    var string_offset = i*spacing[0]
    var fret_offset = 0;
    switch( this.strings[i] ) {
      case 'x': ref = '#unplayed'; fret_offset = 0; break;
      case '0': ref = '#open'; fret_offset = 0; break;
      default:
        if ( this.strings[i] < bottom_fret ) {
          ref = '#unplayed'; fret_offset = 0; break;
        } else {
          ref = '#fretted'; fret_offset = (this.strings[i] - bottom_fret) * spacing[1]; break;
        }
    }
    box += LeadSheet.xml( 'use', "", { 'xlink:href': '#string_' + uuid, 'x': string_offset})
    box += LeadSheet.xml( 'use', "", { 'xlink:href': ref + '_' + uuid, x: string_offset, y: fret_offset } )
  }
  return LeadSheet.xml( 'svg',
    defs +
    LeadSheet.xml( 'g', box, { 'transform': 'translate(25,25)'} ),
    { 'xmlns': "http://www.w3.org/2000/svg", 'version': "1.1", 'class': 'chordbox' }
  )
}

function StanzaLine( string ) {
  this.parts = []
  switch( true ) {
    case (/[\[\]]/.test( string )): this.extra_class = ' withchords'; break;
    case (/^\|/.test( string )): this.extra_class = ' barsystem'; break;
    default: this.extra_class = ""
  }
  this.type = /^\|/.test( string ) ? 'bars' : 'lyrics'
  if ( /x[0-9]+/.test( string ) ) {
    var line = /^(.*?)\s*x([0-9]+)\s*$/.exec( string )
    if ( line[2] ) this.repeat = line[2]
    string = line[1]
  }
  string = string.replace( /\[/g, '[~' ).replace( /\]/g, '[' ).replace( /\|/g, '[|')
  var chunks = string.split( '[' )
  var last_part = ""
  for ( var i = 0; i < chunks.length; i++ ) {
    switch ( true ) {
      case /^~/.test( chunks[i] ):
        var chord = /^~\s*(.*)\s*/.exec( chunks[i] )
        this.parts.push( new ChordRef( chord[1] ) )
        last_part = 'chordref'
        break
      case /^\|/.test( chunks[i] ):
        var bar = /^\|\s*(.*?)\s*$/.exec( chunks[i] )
        this.parts.push( new Bar( bar[1] ) )
        last_part = 'bar'
        break
      case /^\s*$/.test( chunks[i] ):
        break
      default:
        this.parts.push( new Lyric( chunks[i], last_part ) )
        last_part = 'lyric'
    }
  }
}

StanzaLine.prototype.push = function( elem ){
  this.parts.push( elem )
}

StanzaLine.prototype.emit = function( ls ) {
  var line = ""
  for ( var j = 0; j < this.parts.length; j++ ) {
    line += this.parts[j].emit( ls )
  }
  if ( this.repeat ) line += LeadSheet.xml( 'div', this.repeat, { 'class': 'repeat' } )
  return LeadSheet.xml( 'div', line, { 'class': 'stanzaline' + this.extra_class } )
}

function ChordRef( ref ) {
  this.ref = ref
}

ChordRef.prototype.emit = function( ls ) {
  if ( ls.chords[this.ref] ) {
    return LeadSheet.xml( 'div', ls.chords[this.ref].name, { 'class': 'chordref' } )
  } else {
    return LeadSheet.xml( 'div', this.ref, { 'class': 'chordref undefined'})
  }
}

function Bar( content ) {
  this.content = LeadSheetHelper.clean( content ).split( " " )
}

Bar.prototype.emit = function( ls ) {
  var bar = ""
  for ( var i = 0; i < this.content.length; i++ ) {
    bar += LeadSheet.xml( 'div', this.content[i] , { 'class': 'barelement' })
  }
  return LeadSheet.xml( 'div', bar, {'class': 'bar'})
}

function Lyric( text, last_part ) {
  this.text = text
}

Lyric.prototype.emit = function() {
  return LeadSheet.xml( 'div', this.text, { 'class': 'lyric' } )
}

function Stanza( title ) {
  this.title = title
  this.lines = []
}

Stanza.prototype.push = function( elem ) {
  this.lines.push( elem )
}

Stanza.prototype.length = function( ) {
  return this.lines.length
}

Stanza.prototype.emit = function( ls ) {
  var stanza = ""
  if ( this.title ) {
    stanza += LeadSheet.xml('div', this.title, {'class': 'stanzaname'})
  }
  for ( var i = 0; i < this.lines.length; i++ ) {
    stanza += this.lines[i].emit( ls )
  }
  return LeadSheet.xml( 'div', stanza, { 'class': 'stanza' } )
}
