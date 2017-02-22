/* 小鸟对象 */
(function( Fly ) {

// 构造函数
var Bird = function( config ) {
]
	// this.属性名 = 属性值;
	this.img = config.img;       // 小鸟图片
	this.imgW = this.img.width / 3;      // 小鸟图片的宽度
	this.imgH = this.img.height;         // 小鸟图片的高度
	this.ctx = config.ctx;

	this.frameIndex = 0;              // 小鸟当前绘制的帧数
	this.y = 100;                     // 小鸟垂直方向初始位置
	this.x = 100;
	this.speed = 0;                   // 小鸟初始速度
	this.a = 0.0005;                  // 小鸟加速度
	this.maxAngle = 45;
  this.maxSpeed = 0.3;
  this.curAngle = 0;


  // 小鸟就是消息的发布者：
  this.listeners = [];
  this.landH = config.landH;
};

// 原型
Bird.prototype = {
	constructor: Bird,

	draw: function( delta ) {
		// 每一次重新绘制都检测有没有发生碰撞！
		this.isDie();

		// 超过最大值的处理:（通过速度来判断）
    if(this.speed >= this.maxSpeed) {
      this.speed = this.maxSpeed;
    } else if(this.speed <= -this.maxSpeed) {
      this.speed = -this.maxSpeed;
    }
    this.curAngle = this.speed / this.maxSpeed * this.maxAngle;

    // 平移画布，使得小鸟围绕自己转动
    this.ctx.translate(this.x, this.y);
    // 根据当前角度（curAngle）旋转
    this.ctx.rotate(Fly.toRadian(this.curAngle));
    // 绘制小鸟（注意 绘制坐标的变化）
		this.ctx.drawImage(this.img, this.imgW * this.frameIndex++, 0, this.imgW, this.imgH, -1/2*this.imgW, -1/2*this.imgH, this.imgW, this.imgH);
    // 获取下一帧
		this.frameIndex %= 3;

		// 计算速度和位置
		this.speed += this.a * delta;
		this.y += this.speed * delta + 1/2 * this.a * Math.pow(delta, 2);
	},

	// 作用：修改速度
	changeSpeed: function( speed ) {

		this.speed = speed;
	},

	// 添加订阅
	addListener: function( callback ) {
		this.listeners.push( callback );
	},
	
	// 小鸟碰撞检测
	isDie: function() {
		if(this.y <= 0 || (this.y >= this.ctx.canvas.height - this.landH) || this.ctx.isPointInPath(this.x, this.y)) {

			// 小鸟只要发生碰撞，就通知多有的订阅者！
			this.listeners.forEach(function( fn ) {
				fn();
			});
   	}
	}
};

Fly.Bird = Bird;
})(Fly);

