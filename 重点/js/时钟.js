/**********************************************************************
 * 本函数作用为生成一个时钟
 * 1. 函数返回值为一个包含时钟的canvas元素，该时钟会动态变换
 * 2. 为了展示效果，请用与配套的css字体文件一起使用
 * ********************************************************************/


function makeClock() {
    var clock = {
        hour: 0.0,
        minute: 0,
        second: 0,
        canvas: null,
        context: null,

        //读取（系统）时间，并初始化属性--->无返回值
        initialProperty: function() {
            var time = new Date();
            //初始化时间
            this.hour = time.getHours();
            this.minute = time.getMinutes();
            this.second = time.getSeconds();
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
            //把表盘作为背景
            var panel = this.canvas.toDataURL("image/png");
            this.canvas.style.background = "url(" + panel + ")";
        },
        //画时针的方法--->无返回值
        drawHour: function() {
            var hours = this.hour + this.minute/60;
            this.context.beginPath();
            this.context.strokeStyle = "rgba(47,79,79,0.7)";
            this.context.lineWidth = 11;
            this.context.lineCap = "round";
            this.context.moveTo(-20*Math.cos(hours*Math.PI/6), -20*Math.sin(hours*Math.PI/6)); //Math.PI/6 = 2π/12
            this.context.lineTo(65*Math.cos(hours*Math.PI/6), 65*Math.sin(hours*Math.PI/6));
            this.context.stroke();
            //画时针箭头
            this.context.beginPath();
            this.context.fillStyle = "rgba(47,79,79,0.7)";
            this.context.moveTo(80*Math.cos(hours*Math.PI/6), 80*Math.sin(hours*Math.PI/6)); //Math.PI/6 = 2π/12
            this.context.lineTo(60*Math.cos(hours*Math.PI/6 + 0.3), 60*Math.sin(hours*Math.PI/6 + 0.3));
            this.context.lineTo(65*Math.cos(hours*Math.PI/6), 65*Math.sin(hours*Math.PI/6));
            this.context.lineTo(60*Math.cos(hours*Math.PI/6 - 0.3), 60*Math.sin(hours*Math.PI/6 - 0.3));
            this.context.fill();
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
            this.context.lineWidth = 8;
            this.context.lineCap = "round";
            this.context.moveTo(-30*Math.cos(this.minute*Math.PI/30), -30*Math.sin(this.minute*Math.PI/30));   //Math.PI/30 = 2π/60
            this.context.lineTo(90*Math.cos(this.minute*Math.PI/30), 90*Math.sin(this.minute*Math.PI/30));
            this.context.stroke();
            //画分针箭头
            this.context.beginPath();
            this.context.fillStyle = "rgba(255,215,0,0.85)";
            this.context.moveTo(105*Math.cos(this.minute*Math.PI/30), 105*Math.sin(this.minute*Math.PI/30));   //Math.PI/30 = 2π/60
            this.context.lineTo(70*Math.cos(this.minute*Math.PI/30 + 0.25), 70*Math.sin(this.minute*Math.PI/30 + 0.25));
            this.context.lineTo(85*Math.cos(this.minute*Math.PI/30), 85*Math.sin(this.minute*Math.PI/30));
            this.context.lineTo(70*Math.cos(this.minute*Math.PI/30 - 0.25), 70*Math.sin(this.minute*Math.PI/30 -0.25));
            this.context.fill();
        },
        //画秒针的方法--->无返回值
        drawSecond: function() {
            this.context.beginPath();
            this.context.fillStyle = "rgba(220,20,60,0.65)";
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
            this.context.fillStyle = "#00008B";
            this.context.fillText("" + (this.hour<10 ? 0 : "") + this.hour + ":" + (this.minute<10 ? 0 : "") + this.minute, -13, 56);
            //秒
            this.context.font = "25px digital_dismayregular";
            this.context.fillText("" + (this.second<10 ? 0 : "") + this.second, 48, 59);
            this.context.restore();
        },
        //控制全局流程的方法--->无返回值
        globalProgress: function() {
            this.initialProperty();
            this.initiaoPanel();
            var that = this;
            //当切换页面再切换回来时，更新时间。因为在切换其他页面的过程中页面执行可能暂停了。
            document.addEventListener("visibilitychange", function(event) {
                if(!document.hidden) {
                    that.initialProperty();
                }
            }, false);
            
            _globalProgress();
            function _globalProgress() {
                that.context.clearRect(-150, -150, that.canvas.width, that.canvas.height);
                that.drawDigitalClock();
                that.drawHour();
                that.drawMinute();
                that.drawSecond();
                //表盘中间的点
                that.context.beginPath();
                that.context.fillStyle = "red";
                that.context.arc(0, 0, 8, 0, 2*Math.PI, true);
                that.context.fill();
                //自动走秒，不用时刻读取系统时间
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


    /*************************************************************************************/
    clock.globalProgress();

    //延时函数，延时1s（在chrome浏览器下电子表内部文字有延时加载的情况，为了避免文字变化带来的视觉影响而写此函数，然而我的手机还是那样，即使延时了5秒。。。）
    (function() {
        var second = new Date().getTime();
        var next_second = second + 1000;
        while(next_second > second) {
            second = new Date().getTime();
        }
    })();

    return clock.canvas;
}