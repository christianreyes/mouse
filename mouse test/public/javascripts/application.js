$(function(){
  var socket = io.connect(location.href);

  var time_initial;
  var recording = false;
  
  var allowed = false;
  
  setTimeout(function(){
    allowed = true;
  }, 1000);
  
	$('#left').mousedown(function(){
		$('img').attr('src', '/images/mouse_leftdown.png');
		//return false;
	});

	$('#left').mouseup(function(){
		$('img').attr('src', '/images/mouse_off.png');
	  //return false;
	});
	
	$('#right').mousedown(function(){
		$('img').attr('src', '/images/mouse_rightdown.png');
		//return false;
	});

	$('#right').mouseup(function(){
		$('img').attr('src', '/images/mouse_off.png');
		//return false;
	});
  
  //$('#box').css('left', window.width / 2).css('top', window.height / 2);
  
  $('#right').click(function(e){
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
  
  $('#left').click(function(){
    socket.emit("click");
    return false;
  });
  
  if (window.DeviceOrientationEvent) {
    
    //$('body').append($('<div>Got here</div>'));
    
    window.ondevicemotion = function(event) {
      
      //$('body').append($('<div>' + recording + " " + event.acceleration.x + '</div>'));
      if(allowed){
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
          
          var send = false;
          
          if(Math.abs(data.x) > .7){
            //data.x = data.x > .7 ? .7 : -.7;
            allowed = false;
            send = true;
          } else {
            data.x = 0; 
          }
          
          if(Math.abs(data.y) > .7){
            //data.y = data.y > .7 ? .7 : -.7;
            allowed = false;
            send = true;
          } else {
            data.y = 0;
          }
          
          if(send){
            socket.emit("move", data);
            
            setTimeout(function(){
              allowed = true;
            }, 600)
          }
        }      
      }
    }
  } else {
    $('button').hide();
  }
  
  socket.on('movedata', function (data) {
    if(!recording){
      //$('body').append($('<div>' + data.x + ',' + data.y + ',' + data.z + ',' + data.time + '</div>')); 
      if(Math.abs(data.x) > 0.05)
        $('#box').css('left', parseInt($('#box').css('left')) - data.x * 10 + 'px');
      if(Math.abs(data.y) > 0.05)
        $('#box').css('top', parseInt($('#box').css('top')) + data.y * 10 + 'px');
    }
  });
  
});