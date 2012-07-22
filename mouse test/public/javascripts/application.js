$(function(){
  var socket = io.connect(location.href);

  var time_initial;
  var recording = false;
  
  /*
  $('#left').ontouchstart = function(){
    $('img').attr('src', '/images/mouse_leftdown.png');
  };
  
  $('#left').ontouchend = function(){
    $('img').attr('src', '/images/mouse_off.png');
  };
  */
  
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
  
  $('#left').click(function(e){
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
      //$('body').append($('<div>' + data.x + ',' + data.y + ',' + data.z + ',' + data.time + '</div>')); 
      if(Math.abs(data.x) > 0.05)
        $('#box').css('left', parseInt($('#box').css('left')) - data.x * 10 + 'px');
      if(Math.abs(data.y) > 0.05)
        $('#box').css('top', parseInt($('#box').css('top')) + data.y * 10 + 'px');
    }
  });
  
});