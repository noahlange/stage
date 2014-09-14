$("#cover-page, .article-cover").ready(function() {
  var defaultBackgroundColor = $(".navbar").css("background-color");
  var defaultBorderColor = $(".navbar").css("border-color");
  var defaultLinkColor = $(".navbar a").css("color");
  function navbarTransparent() {
    $(".navbar").removeClass("navbar-default");
    $(".navbar").addClass("navbar-inverse");
    $(".navbar").css("background-color", "rgba(0,0,0,0)");
    $(".navbar").css("border-color", "rgba(0,0,0,0)");
    $(".navbar a").css("color", "#fff");
  }
  function navbarOpaque() {
    $(".navbar").addClass("navbar-default");
    $(".navbar").removeClass("navbar-inverse");
    $(".navbar").css("background-color", defaultBackgroundColor);
    $(".navbar").css("border-color", defaultBorderColor);
    $(".navbar a").css("color",defaultLinkColor);
  }
  $( "#cover-page, .article-cover" ).waypoint(function(direction) {
    navbarTransparent();
  });
  $( "#main-container" ).waypoint(function(direction) {
    if (direction === 'up') {
      navbarTransparent();
    } else {
      navbarOpaque();
    }
  });
})

$(document).ready(function() {

  $(window).stellar();

  if ($("#TableOfContents").length != 0) {
    $("#TableOfContents").affix({
      offset: {
        top: $("#TableOfContents").offset().top - 60
      }
    });
  }

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
