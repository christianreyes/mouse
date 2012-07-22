$(function(){
  $(body).append($('<div>').text("Page loaded"));
  
  window.ondevicemotion = function(event) {
    $(body).append($('<div>').text(event.acceleration.x + '\t' + event.acceleration.y));
  }  
});