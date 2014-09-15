
stage
=====

Stage provides a comprehensive theme for musicians and other creative types. Built off the [SASS](http://sass-lang.com/) port of the [Twitter Bootstrap](http://getbootstrap.com/) framework, Stage features great typography, a responsive design, comprehensive options for social media, navbar links, author information and more.

Demo is [here](http://stage.noahlange.com/)

While the Stage theme is heavily based off the excellent [Hugo Incorporated](https://github.com/nilproductions/hugo-incorporated) Hugo theme, in turns based off [Jekyll Incorporated](https://github.com/kippt/jekyll-incorporated), Stage has a few extra tricks up its sleeves.

# Content

Stage comes pre-packaged with a number of content types:

* Artists
* Albums
* Songs
* Media (galleries of photos or videos)
* Events

# Presentation

## Images

Stage features a full-page cover photo for the index and the option for large photos on node pages. With some help from [waypoint.js](http://imakewebthings.com/jquery-waypoints/), Stage features  transparency effects for the navbar when transitioning between cover photos and regular content. There's also some [stellar.js](http://markdalgleish.com/projects/stellar.js/) for extra parallax effects.

The media data type allows for the creation of image galleries, dictated as an array in the front matter and rendered as a responsive grid.

Clicking images created with the 'imagemodal' shortcode summons a Bootstrap modal with the image.

## Bootstrap & SASS

For those interested in getting their hands dirty with styling, Stage comes with a Compass gemfile  pre-included. All of the Bootstrap variables are fully customizable, including typefaces and colors.

Tables of Contents, when displayed via the "toc : 'true'" / "toc: true" flag in front matter, scroll alongside the viewport via Bootstrap's affix.js.

## Typefaces

By default, Stage ships with Font Awesome, as well as the Lato typeface at weights 300, 500 and 700.

Somewhat less ubiquitous than Helvetica Neue, Lato is a superb typeface that's entirely at home in both casual and professional situations. If that's not to your liking, typefaces can be replaced with the fonts parameter in the config.yaml file, or added after a "|" character.

# Shortcodes

Stage comes prepackaged with a handful of shortcodes that simplify media-type things. Apart from spf13's Vimeo and YouTube shortcodes, Stage features a custom imagemodal shortcode that creates thumbnail images that appear in modals when clicked, as well as an audio player shortcode that embeds an instance of the jPlayer audio player into the page.

# Libraries & APIs

## Google Maps

Events can be given their own longitudes and latitudes and Google Maps will fetch a location map for the cover photo and a street view photograph for the sidebar photo. If you're expecting to have considerable traffic (10k+ API calls daily), it would be considerate to sign up for a Google Maps API key or disable this functionality via config.yaml.

## leadsheet.js

Stage comes bundled with [leadsheet.js](https://github.com/gilesdring/js-leadsheet), a leadsheet generator loosely based on Markdown. Simply use the {{ % lyrics %}} shortcode around properly-formatted lyrics to generate a leadsheet.

An example verse from a song to demonstrate leadsheet.js syntax is as follows. Pluses (with no trailing space, as to not trigger Markdown's &lt;ul&gt; generator) demarcate chords, which are inserted at the time they appear within square brackets. Verses are offset by paragraph breaks.

```
+G 3,2,0,0,0,3
+C x,3,2,0,1,0
+F 1,3,3,2,1,1
+Am x,0,2,2,1,0

[C]I'm not one to go to bars, but I watch the [F]people when I [C]do [Am]
Listen to them [F]talking and [C]have a drink or [G]two
[C]Step on up right to the bar, ask for a [F]whiskey on the [C]rocks [Am]
And the bartender, he gets the [F]glass and [G]we begin to [C]talk
```

## jPlayer

The latest version of the jQuery plugin jPlayer is also included

All songs with linked audio files in their front matter have an integrated audio player on the purchase bar, and the {{% audio %}} shortcode allows users to embed audio files directly into their markdown.

# Configuration

There are a number of features bundled into the config file. Since Stage is intended for solo artists or bands, the 'author' field present in Hugo Incorporated has been condensed into a single artist field described in the main configuration file. This saves the end-user from having to enter author information for each individual song, album and post, instead centralizing the data in the artist paramater.

Navbar allows the user to customize the destination for the various links in the navbar, without having to edit the navbar directly. The same goes for social media links.

The default config.yaml file is as follows:

```
---
baseurl: "/"
theme: "stage"
metaDataFormat: "yaml"
params:
 title: "Stage"
 subtitle: "A Hugo theme for musicians and creatives."
 coverimage: "/images/stage.jpg"
 artist:
   name: "Stage"
   description: "Enter a description of the artist here."
   image: "/images/avatar.png"
   link: "/"
   website: "/"
   facebook: "http://facebook.com/"
   soundcloud: "http://soundcloud.com/"
   reverbnation: "http://reverbnation.com/"
   contact: "http://example.com"
 navbar:
   blog: "/post/"
   bio: "/"
   music: "/"
   media: "/"
 fonts: "Lato:300,500,700"
 maps: true
---
```

# Future

Since I'm using Stage for my own site, it's unlikely to be abandoned soon. So, that means there's more in store for Stage than what's here just now.

- Replace waypoint.js with Bootstrap's scrollspy.
- Disqus and social sharing re-integration.
- More shortcodes for formatting things.
- Multi-author support.
- There are some legacy issues from this being built off Hugo Incorporated, including feeds apparently not working.
- When Hugo begins to support AJAX more natively, you can bet that a fixed player will appear.

Feel free to make pull requests with upgrades to Stage at [GitHub](http://github.com/noahlange/stage).

***

# Credits & Tech
* [Hugo](http://hugo.spf13.com)
* [jQuery](http://jquery.org)
* [Hugo Incorporated](https://github.com/nilproductions/hugo-incorporated)
* [Jekyll Incorporated](https://github.com/kippt/jekyll-incorporated)

## Images & Navigation
* [waypoint.js](http://imakewebthings.com/jquery-waypoints/)
* [stellar.js](http://markdalgleish.com/projects/stellar.js/)

## Markup and Styling
* [SASS](http://sass-lang.com/)
* [Compass](http://compass-style.org/)
* [Bootstrap](http://getbootstrap.com/)
* [CSSStickyFooter](http://www.cssstickyfooter.com/)
## Leadsheets
* [leadsheet.js](https://github.com/gilesdring/js-leadsheet)
* [phpjs' strip_tags](https://github.com/kvz/phpjs)

## Audio Player
* [jPlayer](http://jplayer.org/)

## Maps
* [Google Maps](google.com/maps)
