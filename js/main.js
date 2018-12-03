(function() {
 var DEBUG, before, c, clamp, collides, ctx, delta, draw, elapsed, keysDown, keysPressed, load, loading, now, ogre, setDelta, tick, update;

 c = document.getElementById('draw');

 ctx = c.getContext('2d');

 delta = 0;

 now = 0;

 before = Date.now();

 elapsed = 0;

 loading = 0;

 DEBUG = false;
 //DEBUG = true;

 c.width = 800;

 c.height = 600;

 keysDown = {};

 keysPressed = {};
 click = {};

 images = [];

 audios = [];

 framesThisSecond = 0;
 fpsElapsed = 0;
 fps = 0

 popups = [];
 toBoom = 0.5;
 toToBoom = 0.5;
 boom = {};
 money = 0;
 killed = 0;

 levels = [
   {
     'img': 'pt',
     'money': 500000,
     'killed': 10000,
   },
   {
     'img': 'pr',
     'money': 1500000,
     'killed': 14000,
   },
   {
     'img': 'tr',
     'money': 3000000,
     'killed': 80000,
   },
   {
     'img': 'lk',
     'money': 200000,
     'killed': 40000,
   },
   {
     'img': 'km',
     'money': 100000,
     'killed': 50000,
   },
 ]

 level = 0;

 window.addEventListener("keydown", function(e) {
         keysDown[e.keyCode] = true;
         return keysPressed[e.keyCode] = true;
         }, false);

 window.addEventListener("keyup", function(e) {
         return delete keysDown[e.keyCode];
         }, false);

 c.addEventListener("click", function(e) {
   click = {
     'x': e.offsetX,
     'y': e.offsetY,
   }
 })

 setDelta = function() {
     now = Date.now();
     delta = (now - before) / 1000;
     return before = now;
 };

 if (!DEBUG) {
     console.log = function() {
         return null;
     };
 }

 ogre = false;

 clamp = function(v, min, max) {
     if (v < min) {
         return min;
     } else if (v > max) {
         return max;
     } else {
         return v;
     }
 };

 collides = function(a, b) {
     return a.x + a.w > b.x && a.x < b.x + b.w && a.y + a.h > b.y && a.y < b.y + b.h;
 };

 clicked = function(c, x, y, w, h) {
    return c.x >= x && c.x <= x + w && c.y >= y && c.y <= y + h;
 }

 player = {
   x: 400,
   y: 480,
   w: 50,
   h: 50,
 }

 tick = function() {
     setDelta();
     elapsed += delta;
     update(delta);
     draw(delta);
     keysPressed = {};
     click = null;
     if (!ogre) {
         return window.requestAnimationFrame(tick);
     }
 };

 speed = 120;

 update = function(delta) {
     framesThisSecond += 1;
     fpsElapsed += delta;

     var yes = click && clicked(click, 240, 460, 120, 50);
     var no = click && clicked(click, 460, 460, 80, 50);

     lvl = levels[level];

     if(yes) {
       console.log('yes');
       money += lvl['money'];
       killed += lvl['killed'];
     }

     if(no) {
       console.log('no');
     }

     if(yes || no) {
       level++;
       if(level == levels.length) {
         ogre = true;
       }
     }

     if(click) {
       console.log(click);
     }

     if(fpsElapsed >= 1) {
        fps = framesThisSecond / fpsElapsed;
        framesThisSecond = fpsElapsed = 0;
     }
 };

 draw = function(delta) {
     ctx.fillStyle = "#000000";
     ctx.fillRect(0, 0, c.width, c.height);

     if(DEBUG) {
        ctx.fillStyle = "#888888";
        ctx.font = "20px Visitor";
        ctx.fillText(Math.round(fps), 20, 590);
     }

     if(ogre) {
        ctx.fillStyle = "#eeeeee";
        ctx.font = "64px Visitor";
        ctx.fillText("Good job!", 400, 200);
        ctx.font = "32px Visitor";
        ctx.fillText(`Money earned: $${money}`, 400, 300);
        ctx.fillText(`People killed: ${killed}`, 400, 350);
        return;
     }

     ctx.fillStyle = "#521515";

     lvl = levels[level];

     ctx.drawImage(images[lvl['img']], 500, 100);

     ctx.textAlign = 'center';

    ctx.fillStyle = "#eeeeee";
    ctx.font = "24px Visitor";
    image_name = 'text' + ((level % 3) + 1);
    ctx.drawImage(images[image_name], 100, 100);

    ctx.font = "32px Visitor";
    ctx.fillText(`Sell for $${lvl['money']}?`, 400, 420);

    ctx.fillText('Yes', 300, 500);
    ctx.fillText('No', 500, 500);

 };

 (function() {
  var targetTime, vendor, w, _i, _len, _ref;
  w = window;
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
  vendor = _ref[_i];
  if (w.requestAnimationFrame) {
  break;
  }
  w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
  }
  if (!w.requestAnimationFrame) {
  targetTime = 0;
  return w.requestAnimationFrame = function(callback) {
  var currentTime;
  targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
  return w.setTimeout((function() {
          return callback(+(new Date));
          }), targetTime - currentTime);
  };
  }
 })();

 loadImage = function(name, callback) {
    var img = new Image()
    console.log('loading')
    loading += 1
    img.onload = function() {
        console.log('loaded ' + name)
        images[name] = img
        loading -= 1
        if(callback) {
            callback(name);
        }
    }

    img.src = 'img/' + name + '.png'
 }

    loadImage('text1');
    loadImage('text2');
    loadImage('text3');
    loadImage('pt');
    loadImage('pr');
    loadImage('tr');
    loadImage('km');
    loadImage('lk');

//  audios["jeb"] = new Audio('sounds/jeb.ogg');
//  audios["ultimate_jeb"] = new Audio("sounds/ultimate_jeb.ogg");

//  loadMusic("melody1");

 load = function() {
     if(loading) {
         window.requestAnimationFrame(load);
     } else {
         window.requestAnimationFrame(tick);
     }
 };

 load();

}).call(this);
