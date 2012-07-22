$(function(){
  var socket = io.connect(location.href);

  var time_initial;
  var recording = false;
  
  $('#startstop').click(function(e){
    if(recording){
      recording = false;
      $(this).text("Start");     
    } else {
      recording = true;
      $(this).text("Stop");
      time_initial = new Date();
    }
    e.preventDefault();
  });
  
  if (window.DeviceOrientationEvent) {
    
    //$('body').append($('<div>Got here</div>'));
    
    window.ondevicemotion = function(event) {
      
      //$('body').append($('<div>' + recording + " " + event.acceleration.x + '</div>'));
      
      if(recording){        
        
        var date = new Date();
      
        var data = {
          x: event.acceleration.x,
          y: event.acceleration.y,
          z: event.acceleration.z,
          date: date,
          time: date - time_initial
        }
        
        //$('body').append($('<div>' + data.x + ',' + data + '</div>'));
        socket.emit('move', data);
      }
      
    }
  } else {
    $('button').hide();
  }
  
  socket.on('movedata', function (data) {
    if(!recording){
      $('body').append($('<div>' + data.x + ',' + data.y + ',' + data.z + ',' + data.time + '</div>')); 
    }
  });
  
});