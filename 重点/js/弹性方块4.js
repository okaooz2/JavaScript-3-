/**************************************************************************************************
 * 此函数作用为在特定位置添加一可互动的弹性方块盒子
 * 1. 请在html文档要添加此盒子的地方建立一个空的div元素，并赋予类名"bounce-box"
 *  例：<div class="bounce-box"></div>
 * 2. 运行时，盒子和方块的尺度参数会有弹出框提示输入
 * 3. 为保证视觉效果，请组合配套的css表单使用
 **************************************************************************************************/


function buildBounceBox() {
    //定义方块对象
    function Square(position_x, position_y) {
        this.position_x = position_x;
        this.position_y = position_y;
        this.x_flag = false;        //true表示往右运动，false表示往左运动
        this.y_flag = false;        //true表示往下运动，false表示往上运动
        this.is_removed = false;
    }
    Square.prototype = {
        side_length: [0],
        wall_right: [0],
        wall_bottom: [0],
        color_is_change: [false],

        setProtoProperty: function(side_length, box_width, box_height) {
            if(this.side_length[0] === 0) {
                this.side_length[0] = side_length;
                this.wall_right[0] = box_width - side_length;
                this.wall_bottom[0] = box_height - side_length;
            }
        },
        moving: function(context) {
            var that = this;
            function _moving() {
                return function() {
                    context.clearRect(that.position_x, that.position_y, that.side_length[0], that.side_length[0]);

                    if(that.is_removed) {
                        return false;
                    }

                    //设置x轴运动方向
                    if(that.position_x <= 0) {
                        that.x_flag = true;
                    }
                    else if(that.position_x >= that.wall_right[0]) {
                        that.x_flag = false;
                    }
                    //设置y轴运动方向
                    if(that.position_y <= 0) {
                        that.y_flag = true;
                    }
                    else if(that.position_y >= that.wall_bottom[0]) {
                        that.y_flag = false;
                    }
                    
                    that.position_x = that.x_flag ? ++that.position_x : --that.position_x;
                    that.position_y = that.y_flag ? ++that.position_y : --that.position_y;

                    //画图
                    context.beginPath();
                    context.fillStyle = "red";
                    context.fillRect(that.position_x, that.position_y, that.side_length[0], that.side_length[0]);
                    if(that.color_is_change[0]) {
                        if(that.x_flag && that.y_flag) {
                            context.fillStyle = "yellow";
                        }
                        else if(that.x_flag && !that.y_flag) {
                            context.fillStyle = "#00BFFF";
                        }
                        else if(!that.x_flag && that.y_flag) {
                            context.fillStyle = "#00FF7F";
                        }
                        else {
                            context.fillStyle = "#FF6347";
                        }
                    }
                    else {
                        context.fillStyle = "yellow";
                    }
                    context.fillRect(that.position_x+3, that.position_y+3, that.side_length-6, that.side_length-6);

                    requestAnimationFrame(_moving()); 
                }
            }
            requestAnimationFrame(_moving());
        }
    }
/***********************************************************************************************************/

    //定义碰撞的抽象组合对象
    function Bounce(side_length) {
        this.squares = new Array();
        this.side_length = side_length;
    }
    Bounce.prototype = {
        //新增一个参加碰撞的实例
        addSquare: function(square) {
            this.squares.push(square);
        },
        bouncing: function() {
            var that = this;
            function _bouncing() {
                return function() {
                    for(var i=0, len=that.squares.length; i<len; ++i) {
                        for(var j=i+1; j<len; ++j) {
                            var _x = that.squares[j].position_x - that.squares[i].position_x;
                            var _y = that.squares[j].position_y - that.squares[i].position_y;
                            var delta_x = Math.abs(_x);
                            var delta_y = Math.abs(_y);

                           
                            if(delta_x <= that.side_length && delta_y <= that.side_length) {
                                //x方向碰撞
                                if(delta_x > delta_y) {      
                                    if(_x > 0) {
                                        that.squares[i].x_flag = false;
                                        that.squares[j].x_flag = true;
                                    }
                                    else {
                                        that.squares[i].x_flag = true;
                                        that.squares[j].x_flag = false;
                                    }
                                }
                                //y方向碰撞
                                else if(delta_y > delta_x) {
                                    if(_y > 0) {
                                        that.squares[i].y_flag = false;
                                        that.squares[j].y_flag = true;
                                    }
                                    else {
                                        that.squares[i].y_flag = true;
                                        that.squares[j].y_flag = false;
                                    }
                                }
                                else {
                                    that.squares[i].x_flag = !that.squares[i].x_flag;
                                    that.squares[j].x_flag = !that.squares[j].x_flag;
                                    that.squares[i].y_flag = !that.squares[i].y_flag;
                                    that.squares[j].y_flag = !that.squares[j].y_flag;
                                }
                            }
                        }
                    }
                    requestAnimationFrame(_bouncing());
                }
            }
            requestAnimationFrame(_bouncing());
        }
    }
/*********************************************************************************************************/

    //根据用户输入初始化画布尺寸
    var box = document.querySelector("div.bounce-box");
    var canvas = document.createElement("canvas");
    var box_width = 0;
    var box_height = 0;
    var side_length = 0;
    (function() {
        var canvas_size = prompt("请输入箱子大小和方块边长（中间用空格隔开）", "290 340 25");
        if(canvas_size !== null) {
            canvas_size = canvas_size.split(/ +/);      //这里正则表达式不需要用引号括起来
            box_width = parseInt(canvas_size[0]);
            box_height = parseInt(canvas_size[1]);
            side_length = parseInt(canvas_size[2])
        }
        else {
            box_width = 290;        //默认值
            box_height = 340;
            side_length = 25;
        }
        canvas.width = box_width;           //这里千万不要修改style.with和style.height的值
        canvas.height = box_height;
    })();

    //创建各元素
    var inner_box = document.createElement("div");
    inner_box.appendChild(canvas);
    box.appendChild(inner_box);
    (function() {
        var panel = document.createElement("div"); 
        panel.innerHTML = "<h1>方块个数为：<span>0</span></h1><button>碰撞不变色</button><button>碰撞变色</button><button>减少一个方块</button><button>移除全部方块</button>";
        inner_box.parentNode.insertBefore(panel, inner_box);
        var buttons = panel.querySelectorAll("button");
        var count = 0;
        var counter = panel.querySelector("span");
        buttons[0].addEventListener("click", function() {
            if(typeof bounce.squares[0] === "undefined") {
                return false;
            }
            bounce.squares[0].color_is_change[0] = false;
        }, false);
        buttons[1].addEventListener("click", function() {
            if(typeof bounce.squares[0] === "undefined") {
                return false;
            }
            bounce.squares[0].color_is_change[0] = true;
        }, false);
        buttons[2].addEventListener("click", removeOne, false);
        buttons[3].addEventListener("click", removeAll, false);

        inner_box.innerHTML += "<button>发射</button><button>发射</button><button>发射</button><button>发射</button>";
        buttons = inner_box.querySelectorAll("button");
        for(var i=0,len=buttons.length; i<len; ++i) {
            switch(i) {     //0~3分别对应左上，右上，右下，左下
                case 0: 
                    buttons[i].style.left = 0;
                    buttons[i].style.bottom = "100%";
                    buttons[i].addEventListener("click", function(event) {
                        addSquare(0, 0);
                    }, false);
                    break;
                case 1: 
                    buttons[i].style.right = 0;
                    buttons[i].style.bottom = "100%";
                    buttons[i].addEventListener("click", function(event) {
                        addSquare(canvas.width-side_length, 0);
                    }, false);
                    break;
                case 2: 
                    buttons[i].style.left = 0;
                    buttons[i].style.top = "100%";
                    buttons[i].style.transform = "translate(0, -4px)";  //不知道为什么画布的父元素在y方向上多出了一点不能包围画布，故做一个平移。下同
                    buttons[i].addEventListener("click", function(event) {
                        addSquare(0, canvas.height-side_length);
                    }, false);
                    break;
                case 3: 
                    buttons[i].style.right = 0;
                    buttons[i].style.top = "100%";
                    buttons[i].style.transform = "translate(0, -4px)";
                    buttons[i].addEventListener("click", function(event) {
                        addSquare(canvas.width-side_length, canvas.height-side_length);
                    }, false);
                    break;
                default: break;
            }
        }

        function addSquare(position_x, position_y) {
            //判断够不够位置添加方块
            for(var i=0, len=bounce.squares.length; i<len; ++i) {
                if(Math.abs(position_x - bounce.squares[i].position_x) <= side_length && Math.abs(position_y - bounce.squares[i].position_y) <= side_length) {
                    return false;
                }
            }

            var squre = new Square(position_x, position_y);
            squre.setProtoProperty(side_length, canvas.width, canvas.height);
            squre.moving(context);
            bounce.addSquare(squre);
            counter.firstChild.nodeValue = ++count;
        }

        function removeOne() {
            if(count <= 0) {
                return false;
            }

            bounce.squares.shift().is_removed = true;
            counter.firstChild.nodeValue = --count;
        }
        function removeAll() {
            if(count <= 0) {
                return false;
            }

            while(bounce.squares.length !== 0) {
                bounce.squares.shift().is_removed = true;
            }
            counter.firstChild.nodeValue = count = 0;
        }
    })();

    canvas = document.querySelector("div.bounce-box canvas");    //也许是因为用innerHTML重写了html文档，原来的canvas不能访问正确的位置，这里重新选定canvas
    var context = canvas.getContext("2d");
    var bounce = new Bounce(side_length);
    bounce.bouncing();
}