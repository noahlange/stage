/*
 * This is a long and boring page of miscellaneous code that makes everything work properly.
 * There are a handful of things that may be of interest to an end user, namely the breakpoint
 * variable at the top of the first function, which controls when the navbar is flipped back
 * and forth from transparent to opaque due to mobile viewports or browser resizing. If you
 * change things in _bootstrap_variables.scss, you're gonna want to change it here. This is
 * in a separate section than the other stuff because no one wants to see the navbar flickering
 * while everyone else takes their sweet time getting ready for the show.
 */

$("#cover-page, .article-cover").ready(function() {

  var breakpoint = 768;
  var transparentNavBackgroundColor = "rgba(0,0,0,0)";
  var transparentNavLinkColor = "#fff";

  var defaultBackgroundColor = $(".navbar").css("background-color");
  var defaultBorderColor = $(".navbar").css("border-color");
  var defaultLinkColor = $(".navbar a").css("color");

  var scrolledPastCover;

  function navbarTransparent() {
    $(".navbar").removeClass("navbar-default");
    $(".navbar").addClass("navbar-inverse");
    $(".navbar").css("background-color", transparentNavBackgroundColor);
    $(".navbar").css("border-color", transparentNavBackgroundColor);
    $(".navbar a").css("color", transparentNavLinkColor);
  }

  function navbarOpaque() {
    $(".navbar").addClass("navbar-default");
    $(".navbar").removeClass("navbar-inverse");
    $(".navbar").css("background-color", defaultBackgroundColor);
    $(".navbar").css("border-color", defaultBorderColor);
    $(".navbar a").css("color",defaultLinkColor);
  }

  $(window).resize(function() {
    if ($(window).width() < breakpoint) {
      navbarOpaque();
    } else if (!scrolledPastCover) {
      navbarTransparent();
    }
  });
  if ($(window).width() > breakpoint) {
    $( "#cover-page, .article-cover" ).waypoint(function(direction) {
      navbarTransparent();
    });
    $( "#main-container" ).waypoint(function(direction) {
      if (direction === 'up') {
        navbarTransparent();
        scrolledPastCover = false;
      } else {
        navbarOpaque();
        scrolledPastCover = true;
      }
    });
  }
});

/*
 * This next section is split between initializing stellar.js and all of the special
 * case things that crop up with Tables of Contents, image modals and jPlayer. You're
 * probably not going to need to mess with this.
 */

$(document).ready(function() {

  $(window).stellar();

  if ($("#TableOfContents").length != 0) {
    $("#TableOfContents").affix({
      offset: {
        top: $("#TableOfContents").offset().top - 60
      }
    });
  };

  if ($(".jp-jplayer").length != 0) {
    $(".jp-jplayer").each( function() {
      var parent = $(this).parent();
      var id = parent.attr('id');
      var datasrc = parent.attr('data-src');
      var title = parent.attr('title');
      var selector = "#jquery_jplayer_"+id;
      $( selector ).jPlayer({
        ready: function (event) {
          console.log("???")
          $(this).jPlayer("setMedia", {
            title: title,
            m4a: datasrc,
          });
        },
        supplied: "m4a",
        wmode: "window",
        smoothPlayBar: true,
        keyEnabled: true,
        remainingDuration: false,
        toggleDuration: false,
        cssSelectorAncestor: '#jp_container_'+id
      });

    });
  };

  if ($(".img-modal").length != 0) {
    $("body").append('<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-body"></div></div></div></div>');
  }

  $('.img-modal').on('click',function(){
    console.log(this);
    var src = $(this).attr('src');
    var img = '<img src="' + src + '" class="img-responsive" style="width:100%"/>';
    $('#myModal').modal();
    $('#myModal').on('shown.bs.modal', function(){
      $('#myModal .modal-body').html(img);
    });
    $('#myModal').on('hidden.bs.modal', function(){
      $('#myModal .modal-body').html('');
    });
  });
});
