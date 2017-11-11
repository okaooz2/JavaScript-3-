function makeClock() {
    var clock = {
        hour: 0.0,
        minute: 0,
        second: 0,
        canvas: null,
        context: null,
        panel: null,    //存放面板图像

        //读取（系统）时间，并初始化属性--->无返回值
        initialProperty: function() {
            var time = new Date();
            //初始化时间
            this.hour = time.getHours();
            this.minute = time.getMinutes();
            this.second = time.getSeconds();
            (this.hour > 12) ? (this.hour -= 12) : (null);
            //创建画板，并初始化上下文
            if(this.canvas === null) {
                this.canvas = document.createElement("canvas");
                this.context = this.canvas.getContext("2d");
                this.canvas.width = 300;
                this.canvas.height = 300;
                this.context.translate(150, 150);       //以图的中心做原点(钟的中心)
                this.context.rotate(-Math.PI*0.5);      //变化坐标系使角度从0点开始计算
            }
        },
        //初始化表盘--->无返回值
        initiaoPanel: function() {
            //先画圆形外框
            this.context.beginPath();
            this.context.strokeStyle = "black";
            this.context.lineWidth = 15;
            this.context.arc(0, 0, 140, 0, 2*Math.PI, true);
            this.context.stroke();
            //表盘中间的点
            this.context.beginPath();
            this.context.fillStyle = "blue";
            this.context.arc(0, 0, 10, 0, 2*Math.PI, true);
            this.context.fill();
            //在画刻度(60个刻度)
            this.context.save();
            for(var i=0; i<60; ++i) {
                this.context.beginPath();
                if(i%5 === 0) {
                    this.context.fillStyle = "black";
                }
                else {
                    this.context.fillStyle = "#ccc";
                }
                this.context.arc(-125, 0, 3, 0, 2*Math.PI, true);
                this.context.fill();
                this.context.rotate(Math.PI/30);    //Math.PI/30 = 2π/60
            }
            this.context.restore();
            //画12个数字
            this.context.save();
            this.context.rotate(Math.PI*0.5);        //为了字体方向正确，要把坐标轴该回默认状态
            this.context.font = "bold 20px 微软雅黑";
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";
            this.context.fillStyle = "blue";
            for(var i=0, text=3; i<12; ++i, ++text) {
                if(text > 12) {
                    text -= 12;
                }
                this.context.fillText(text, 109*Math.cos(i*Math.PI/6), 109*Math.sin(i*Math.PI/6));
            }
            this.context.restore();
            // this.panel = this.canvas.toDataURL("image/png");
            this.panel = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        },
        //画时针的方法--->无返回值
        drawHour: function() {
            var hours = this.hour + this.minute/60;
            this.context.beginPath();
            this.context.strokeStyle = "black";
            this.context.lineWidth = 10;
            this.context.lineCap = "round";
            this.context.moveTo(-20*Math.cos(hours*Math.PI/6), -20*Math.sin(hours*Math.PI/6)); //Math.PI/6 = 2π/12
            this.context.lineTo(70*Math.cos(hours*Math.PI/6), 70*Math.sin(hours*Math.PI/6));
            this.context.stroke();
        },
        //画分针的方法--->无返回值
        drawMinute: function() {
            this.context.strokeStyle = "black";
            this.context.lineWidth = 5;
            this.context.lineCap = "round";
            this.context.moveTo(-20*Math.cos(this.minute*Math.PI/30), -20*Math.sin(this.minute*Math.PI/30));   //Math.PI/30 = 2π/60
            this.context.lineTo(100*Math.cos(this.minute*Math.PI/30), 100*Math.sin(this.minute*Math.PI/30));
            this.context.stroke();
        },
        //画秒针的方法--->无返回值
        drawSecond: function() {
            this.context.beginPath();
            this.context.fillStyle = "red";
            this.context.moveTo(-40*Math.cos(this.second*Math.PI/30 - 0.08), -40*Math.sin(this.second*Math.PI/30 - 0.08));   //Math.PI/30 = 2π/60
            this.context.lineTo(-40*Math.cos(this.second*Math.PI/30 + 0.08), -40*Math.sin(this.second*Math.PI/30 + 0.08));
            this.context.lineTo(120*Math.cos(this.second*Math.PI/30 - 0.01), 120*Math.sin(this.second*Math.PI/30 - 0.01)); 
            this.context.lineTo(120*Math.cos(this.second*Math.PI/30 + 0.01), 120*Math.sin(this.second*Math.PI/30 + 0.01));
            this.context.fill();
        },
        //控制全局流程的方法--->无返回值
        globalProgress: function() {
            this.initialProperty();
            this.initiaoPanel();

            var that = this;
            _globalProgress();
            function _globalProgress() {
                that.context.clearRect(-150, -150, that.canvas.width, that.canvas.height);
                that.context.putImageData(that.panel, 0, 0);
                that.drawHour();
                that.drawMinute();
                that.drawSecond();

                if(++that.second === 60) {
                    that.second = 0;
                    if(++that.minute === 60) {
                        that.initialProperty();      //最长间隔一小时更新一次时间
                    }
                }
                
                window.setTimeout(_globalProgress, 1000);
            }
        }
    };

    /************************************************************************************************/
    clock.globalProgress();

    return clock.canvas;
}