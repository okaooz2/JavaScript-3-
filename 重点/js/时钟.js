/**********************************************************************
 * 本函数作用为生成一个时钟
 * 1. 函数返回值为一个包含时钟的canvas元素，该时钟会动态变换
 * ********************************************************************/


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
            // this.hour = time.getHours();
            // this.minute = time.getMinutes();
            // this.second = time.getSeconds();
            this.hour = 5;
            this.minute = 23;
            this.second = 17;
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
            //在画刻度(60个刻度)
            this.context.save();
            for(var i=0; i<60; ++i) {
                this.context.beginPath();
                if(i%5 === 0) {
                    this.context.fillStyle = "black";
                }
                else {
                    this.context.fillStyle = "#C0C0C0";
                }
                this.context.arc(-125, 0, 3, 0, 2*Math.PI, true);
                this.context.fill();
                this.context.rotate(Math.PI/30);    //Math.PI/30 = 2π/60
            }
            this.context.restore();
            //画12个数字
            this.context.save();
            this.context.rotate(Math.PI*0.5);        //为了字体方向正确，要把坐标轴该回默认状态
            this.context.font = "bold 20px lets_go_digitalregular";
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
            //画电子显示器框
            this.context.beginPath();
            this.context.fillStyle = "#ddd";
            this.context.fillRect(-75, -65, 40, 130);

            this.panel = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        },
        //画时针的方法--->无返回值
        drawHour: function() {
            var hours = this.hour + this.minute/60;
            this.context.beginPath();
            this.context.strokeStyle = "rgba(0,0,0,0.6 )";
            this.context.lineWidth = 10;
            this.context.lineCap = "round";
            this.context.moveTo(-20*Math.cos(hours*Math.PI/6), -20*Math.sin(hours*Math.PI/6)); //Math.PI/6 = 2π/12
            this.context.lineTo(70*Math.cos(hours*Math.PI/6), 70*Math.sin(hours*Math.PI/6));
            this.context.stroke();
            //在时针顶端绘制一线条增加美感
            this.context.beginPath();
            this.context.strokeStyle = "white";
            this.context.lineWidth = 3;
            this.context.moveTo(30*Math.cos(hours*Math.PI/6), 30*Math.sin(hours*Math.PI/6)); //Math.PI/6 = 2π/12
            this.context.lineTo(65*Math.cos(hours*Math.PI/6), 65*Math.sin(hours*Math.PI/6));
            this.context.stroke();
        },
        //画分针的方法--->无返回值
        drawMinute: function() {
            this.context.beginPath();
            this.context.strokeStyle = "rgba(255,215,0,0.85)";
            this.context.lineWidth = 6;
            this.context.lineCap = "round";
            this.context.moveTo(-30*Math.cos(this.minute*Math.PI/30), -30*Math.sin(this.minute*Math.PI/30));   //Math.PI/30 = 2π/60
            this.context.lineTo(100*Math.cos(this.minute*Math.PI/30), 100*Math.sin(this.minute*Math.PI/30));
            this.context.stroke();
        },
        //画秒针的方法--->无返回值
        drawSecond: function() {
            this.context.beginPath();
            this.context.fillStyle = "rgba(128,0,0,0.55)";
            this.context.moveTo(-40*Math.cos(this.second*Math.PI/30 - 0.08), -40*Math.sin(this.second*Math.PI/30 - 0.08));   //Math.PI/30 = 2π/60
            this.context.lineTo(-40*Math.cos(this.second*Math.PI/30 + 0.08), -40*Math.sin(this.second*Math.PI/30 + 0.08));
            this.context.lineTo(120*Math.cos(this.second*Math.PI/30 - 0.01), 120*Math.sin(this.second*Math.PI/30 - 0.01)); 
            this.context.lineTo(120*Math.cos(this.second*Math.PI/30 + 0.01), 120*Math.sin(this.second*Math.PI/30 + 0.01));
            this.context.fill();
        },
        //画电子表--->无返回值
        drawDigitalClock: function() {
            this.context.save();
            this.context.rotate(Math.PI*0.5);
            this.context.beginPath();
            //时，分
            this.context.font = "40px digital_dismayregular";
            this.context.textAlign = "center";
            this.context.textBaseline = "middle";
            this.context.fillStyle = "red";
            this.context.fillText("" + (this.hour<12 ? 0 : "") + this.hour + ":" + this.minute, -13, 56);
            //秒
            this.context.font = "25px digital_dismayregular";
            this.context.fillText(this.second, 48, 58);
            this.context.restore();
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
                that.drawDigitalClock();
                that.drawHour();
                that.drawMinute();
                that.drawSecond();
                //表盘中间的点
                that.context.beginPath();
                that.context.fillStyle = "red";
                that.context.arc(0, 0, 6, 0, 2*Math.PI, true);
                that.context.fill();

                if(++that.second === 60) {
                    that.second = 0;
                    if(++that.minute === 60) {
                        that.initialProperty();      //每整点更新一次时间
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