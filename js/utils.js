// 将一些公共的方法，放到当前文件中！
(function( win ) {

// 创建一个对象，这个对象用来承载所有的公共方法
var FlyObj = {};

// 角度转弧度：
FlyObj.toRadian = function( angle ) {

	return angle / 180 * Math.PI;
};

// 弧度转角度：
FlyObj.toAngle = function( radian ) {

	return radian / Math.PI * 180;
};

// 加载图片的方法
FlyObj.loadImages = function( imgSrc, callback ) {
  var count = 0,
    len = imgSrc.length,
    imgList = {};
	
  imgSrc.forEach(function(src) {
    var img = new Image();
    img.src = 'imgs/' + src + '.png';

    img.addEventListener('load', function() {
      count++;
      imgList[src] = img;

      if(count >= len) {
        // 只要这个条件成立了，就说明所有的图片都加载完成了！
        callback( imgList );
      }
    });
  });
  };

// 创建canvas标签
FlyObj.createCV = function( id ) {
  var dv = document.getElementById(id);

  var cv = document.createElement('canvas');
  cv.height = 600;
  cv.width = 800;

  dv.appendChild( cv );

  return cv;
};

// 添加一个工厂方法，用来创建所有的对象
FlyObj.factory = function( name, config ) {
  switch(name) {
    case 'Bird':
      return new Fly.Bird(config);
    case 'Sky':
      return new Fly.Sky(config);
    case 'Land':
      return new Fly.Land(config);
    case 'Pipe':
      return new Fly.Pipe(config);
    case 'Game':
      // return new Fly.Game(config);
      return Fly.createGame(config);
  }
};

// 通过 window 暴露到全局环境中！供其他对象来使用
win.Fly = FlyObj;
})( window );