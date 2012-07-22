
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app   = module.exports = express.createServer();
var io    = require('socket.io').listen(app, {log: false});
var fs    = require('fs');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  process.env.TZ='America/New_York';
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

var sys = require('util')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }

var port = process.env.PORT || 3000;

app.listen(port);

var x = 500;
var y = 500;

var mouse_event = -1;
var peak_thres = .5;
var peak = false;
var x_dir = 0;
var y_dir = 0;
var move_thres = .3;
var boost = 10;

var allowed = true;

io.sockets.on('connection', function (socket) {
  socket.on("click", function(){
    exec("./click2 -x " + x  + " -y " + y + " -click 1 -interval 1", puts); 
    //return false;
  });
  
  socket.on('move', function (data) {
    //console.log(data);
    io.sockets.emit('movedata', data);
    
    
    /*
    if(peak == false && Math.abs(data.x) > peak_thres){
      peak = true;
      x_dir = data.x > peak_thres ? 1 : -1;
    }
    
    if(peak == true && Math.abs(data.x) > move_thres){
      x += ( -1 * x_dir * Math.abs(data.x) * boost);
    } else{
      peak = false;
    }
    
    
    
    */
    
    
    if(allowed){
      //x += -1 * data.x * 30
      //console.log(x );
      //y += data.y * 10
      //exec("./click -x " + x  + " -y " + y + " -click 0 -interval 1", puts); 
      allowed = false;
      
      var id = setInterval(function(){
        x -= data.x * 2
        if(x < 0) x = 0;
        if(x > 1280) x =768;
        
        y += data.y * 2
        if(y < 0) y = 0;
        if(y > 768) y =768;
        
        exec("./click -x " + x  + " -y " + y + " -click 0 -interval 1", puts); 
        allowed = true;
      }, 10)
      
      setTimeout(function(){
        clearInterval(id);
      }, 750)
    }
    
    //if(mouse_event == -1){
    //  mouse_event = setTimeout(function(){
    
    //    mouse_event = -1;
    //  }, 25); 
    //}
  });
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
