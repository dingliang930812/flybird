(function(Fly) {

var Pipe = function( config ) {
	this.ctx = config.ctx;
	this.imgDown = config.imgDown;
	this.imgUp = config.imgUp;
	this.imgW = this.imgUp.width;
	this.imgH = this.imgUp.height;

	this.x = config.x;
	this.pipeTopY = 0;
	this.pipeDownY = 0;
	this.speed = -0.1;

	// 创建管道对象的时候，就初始话管道的高度
	this.calcPipeHeight();
};

Pipe.prototype = {
	constructor: Pipe,

	draw: function( delta ) {
		// 绘制上边的管道
		this.ctx.drawImage(this.imgUp, this.x, this.pipeTopY, this.imgW, this.imgH);
		// 绘制下边的管道
		this.ctx.drawImage(this.imgDown, this.x, this.pipeDownY, this.imgW, this.imgH);

		// 绘制管道的路径
		this.ctx.rect(this.x, this.pipeTopY, this.imgW, this.imgH);
		this.ctx.rect(this.x, this.pipeDownY, this.imgW, this.imgH);

		this.x += this.speed * delta;
		if(this.x <= -this.imgW) {
			// 因为两个管道之间是有距离的，
			// * 3 表示两个管道之间的距离
			this.x += this.imgW * 3 * 6 ;

			// 重置（重新生成管道的）高度
			this.calcPipeHeight();
		}
	},

	// 随机生成上边管道的高度
	calcPipeHeight: function() {
		var pipeTopHeight = Math.random() * 200 + 50;
		this.pipeTopY = pipeTopHeight - this.imgH;
		this.pipeDownY = pipeTopHeight + 60;
	}
};

Fly.Pipe = Pipe;
})(Fly);