(function(Fly) {


var Game = function( id ) {
	// 根据用户传入的id创建canvas对象
	this.cv = Fly.createCV( id );
	this.ctx = this.cv.getContext('2d');

	this.isStart = true;

	// 存储所有的游戏对象
	this.roleList = [];
	// 存储游戏的英雄（小鸟）
	this.hero = null;
	// 游戏的资源（图片）
	this.imgSrc = ['birds', 'land', 'sky', 'pipe1', 'pipe2'];

	this.lastFrameTime = new Date();
	this.curFrameTime = 0;
};

Game.prototype = {
	constructor: Game,
	
	// 开始游戏
	startGame: function() {
		var that = this;

		// 调用 loadImages 等待所有的图片加载完成！
		Fly.loadImages(this.imgSrc, function( imgList ) {

			// 调用初始化角色方法
			that.initRoles( imgList );

			// 调用绑定事件方法
			that.bindEvent();

			// 调用渲染方法
			that.draw(imgList);

		});
	},

	// 结束游戏
	stopGame: function() {

		this.isStart = false;
	},

	// 初始化角色
	initRoles: function( imgList ) {
		var that = this;
		// 创建小鸟对象
    this.hero = Fly.factory('Bird', {
    	ctx: this.ctx,
    	img: imgList.birds,
    	landH: imgList.land.height
    });
    
    // 给小鸟整个发布者 添加订阅者 Game
    this.hero.addListener( function() {
    	// console.log(this);
    	
    	that.stopGame();
    } );

    // 创建天空对象
    for(var i = 0; i < 2; i++) {
      this.roleList.push(
      	Fly.factory('Sky', {
	      	ctx: this.ctx,
	      	img: imgList.sky,
	      	x: imgList.sky.width * i
	      })
      );
    }

    // 绘制管道
    for(var i = 0; i < 6; i++) {
    	this.roleList.push(
    		Fly.factory('Pipe', {
    			ctx: this.ctx,
    			imgDown: imgList.pipe1,
    			imgUp: imgList.pipe2,
    			// 宽度 * 3 表示：管道之间的距离
    			x: i * imgList.pipe1.width * 3 + 300
    		})
    	)
    }

    // 创建陆地对象
    for(var i = 0; i < 4; i++) {
    	this.roleList.push(
    		Fly.factory('Land', {
    			ctx: this.ctx,
    			img: imgList.land,
    			x: i * imgList.land.width,
    			y: this.cv.height - imgList.land.height
    		})
    	);
    }
	},

	// 渲染方法
	draw: function( imgList ) {
		var that = this;

		var render = function() {
	    // 当前帧时间（每次绘制都会获取当前时间）
			that.curFrameTime = new Date();
	    // 得到两次绘制的时间间隔
			var delta = that.curFrameTime - that.lastFrameTime;
	    // 重置上一帧时间
			that.lastFrameTime = that.curFrameTime;

			// 需要每次都开启新路径
			that.ctx.beginPath();
	    // 清空画布
			that.ctx.clearRect(0, 0, cv.width, cv.height);
	    // 保存默认状态（小鸟旋转改变了画布的坐标系）
	    that.ctx.save();
	    
	    // 绘制所有的游戏对象
	    that.roleList.forEach(function( role ) {
	    	role.draw( delta );
	    });

	    // 绘制小鸟
	   	that.hero.draw( delta );



	    // 恢复到默认状态
	    that.ctx.restore();

	    if(that.isStart) {
	      // 动画函数处理，继续下一次渲染
	  		window.requestAnimationFrame( render );
	    }
		};

		window.requestAnimationFrame( render );
	},

	// 绑定事件
	bindEvent: function() {
		var that = this;

  	that.cv.addEventListener('click', function() {
  		that.hero.changeSpeed( -0.3 );
  	});
	}
};

// Fly.Game = Game;

// 使用单例模式，保证整个游戏中，只有一个实例对象！
var instance = null;
var createGame = function( id ) {
	if(instance === null) {
		instance = new Game(id);
	}

	return instance;
};

Fly.createGame = createGame;

})(Fly);