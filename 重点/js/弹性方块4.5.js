/***************************************************************************************************
 * 此函数作用为在特定位置添加一可互动的弹性方块盒子
 * 1. 运行时，盒子和方块的尺度参数会有弹出框提示输入
 * 2. 弹出提示框时，若选择取消则不会建立盒子，并返回false；若填好信息后选择确认，则建立盒子并返回盒子的元素
 * 3. 为保证视觉效果，请组合配套的css表单使用，也可根据下面的元素结构自行设计或添加表单
 * 
 * 返回的盒子元素结构如下：
 * <div class="bounce-box">
        <div class="inner-panel">
            <h1>方块个数为：<span>0</span></h1>
            <button>碰撞不变色</button>
            <button>碰撞变色</button>
            <button>减少一个方块</button>
            <button>移除全部方块</button>
        </div>
        <div class="inner-box">
            <canvas>您的浏览器不支持canvas画布功能！</canvas>
            <button>发射</button>
            <button>发射</button>
            <button>发射</button>
            <button>发射</button>
        </div>
    </div>
 ***************************************************************************************************/


function buildBounceBox() {
    /***************************
     * 整体流程控制方法存储的对象
     * *************************/
    function ProcessControl() {
    }
    ProcessControl.prototype = {
        //获取用户输入参数的方法--->若用户取消输入则返回false，接受数据成功则返回true
        getInputData: function() {
            var size_data = prompt("请输入画布的宽高和方块的边长（中间用空格隔开）", "290 340 30");
            if(size_data === null) {
                return false;
            }

            size_data = size_data.split(/ +/);
            perameter_data.canvas_width = parseInt(size_data[0]);
            perameter_data.canvas_height = parseInt(size_data[1]);
            perameter_data.side_length = parseInt(size_data[2]);

            return true;
        },
        //创建各级元素的方法--->无返回值
        setElement: function() {
            var bounce_box = document.createElement("div");
            bounce_box.className = "bounce-box";

            var inner_panel = document.createElement("div");
            inner_panel.className = "inner-panel";
            inner_panel.innerHTML = "<h1>方块个数为：<span>0</span></h1><button>碰撞不变色</button><button>碰撞变色</button><button>减少一个方块</button><button>移除全部方块</button>";
            bounce_box.appendChild(inner_panel);

            var inner_box = document.createElement("div");
            inner_box.className = "inner-box";
            inner_box.innerHTML = "<canvas>您的浏览器不支持canvas画布功能！</canvas><button>发射</button><button>发射</button><button>发射</button><button>发射</button>";
            bounce_box.appendChild(inner_box)

            //要顺带把存储参数的对象中，【用到的元素】部分属性赋值
            perameter_data.bounce_box = bounce_box;
            perameter_data.canvas = inner_box.querySelector("canvas");
            perameter_data.context = perameter_data.canvas.getContext("2d");
            perameter_data.counter = inner_panel.querySelector("span");
        },   
        //初始化界面的方法--->无返回值
        initializeInterface: function() {
            perameter_data.canvas.width = perameter_data.canvas_width;
            perameter_data.canvas.height = perameter_data.canvas_height;
        },
        //绑定各按钮事件--->接受方块集合对象；无返回值
        dealWithButton: function(all_squares) {
            var buttons = perameter_data.bounce_box.querySelectorAll(".inner-box button");
            for(var i=0, len=buttons.length; i<len; ++i) {
                switch(i) {
                    case 0: 
                        buttons[i].style = "left: 0; bottom: 100%;";
                        buttons[i].addEventListener("click", function(event) {
                            all_squares.addOneSquare(0, 0);
                        }, false);
                        break;
                     case 1: 
                        buttons[i].style = "right: 0; bottom: 100%;";
                        buttons[i].addEventListener("click", function(event) {
                            all_squares.addOneSquare(perameter_data.canvas_width - perameter_data.side_length, 0);
                        }, false);
                        break;
                    case 2: 
                        buttons[i].style = "right: 0; top: 100%;";
                        buttons[i].addEventListener("click", function(event) {
                            all_squares.addOneSquare(perameter_data.canvas_width - perameter_data.side_length, perameter_data.canvas_height - perameter_data.side_length);
                        }, false);
                        break;
                     case 3: 
                        buttons[i].style = "left: 0; top: 100%;";
                        buttons[i].addEventListener("click", function(event) {
                            all_squares.addOneSquare(0, perameter_data.canvas_height - perameter_data.side_length);
                        }, false);
                        break;
                    default: break;
                }
            }

            buttons =  perameter_data.bounce_box.querySelectorAll(".inner-panel button");
            for(var i=0, len=buttons.length; i<len; ++i) {
                switch(i) {
                    case 0:     //碰撞不变色 
                        buttons[i].addEventListener("click", function(event) {
                            perameter_data.color_is_change = false;
                        }, false);
                        break;
                    case 1:     //碰撞变色 
                        buttons[i].addEventListener("click", function(event) {
                            perameter_data.color_is_change = true;
                        }, false);
                        break;
                    case 2:     //移除一个方块
                        buttons[i].addEventListener("click", function(event) {
                            all_squares.removwOneSquare();
                        }, false);
                        break;
                    case 3:     //移除全部方块
                        buttons[i].addEventListener("click", function(event) {
                            all_squares.removwAllSquare();
                        }, false);
                        break;
                    default: break;
                }
            }
        },
        //控制盒子循环流程的方法--->接受方块集合对象，处理碰撞事件对象；无返回值；自循环
        globalProcess: function(all_squares, dealWith_bounce) {
            function _globalProcess() {
                //更新方块和抹除方块（这里顺序不要乱，不然效果会不好）
                for(var i=0, len=all_squares.squares.length; i<len; ++i) {
                    dealWith_bounce.bounceWithWall(all_squares.squares[i]);
                }
                dealWith_bounce.bounceWithAnother(all_squares.squares);
                all_squares.moveSquares();
                all_squares.drawAllSquares();

                requestAnimationFrame(_globalProcess);
            }
            requestAnimationFrame(_globalProcess);
        }
    }

    /************************
     * 存储参数的对象
     * **********************/
    var perameter_data = {
        //不变的参数
        canvas_width: 0,
        canvas_height: 0,
        side_length: 0,

        //变化的参数
        // count_of_square: 0,
        color_is_change: false,
        
        //用到的元素
        canvas: null,
        context: null,
        bounce_box: null,
        counter: null
    };

    /***********************
     * 单个方块对象
     * *********************/
    function Square() {
        this.position_x = 0;
        this.position_y = 0;
        this.speedX_flag = true;    //true表示往右边运动，false表示往左边运动
        this.speedY_flag = true;    //true表示往下边运动，false表示往上边运动
    }

    /******************************
     * 方块集合的对象
     * ****************************/
    function AllSquares() {
        this.squares = [];
    }
    AllSquares.prototype = {
        //一次在画布上更新所有方块的方法--->无返回值
        drawAllSquares: function() {
            perameter_data.context.clearRect(0, 0, perameter_data.canvas_width, perameter_data.canvas_height);
            perameter_data.context.beginPath();

            for(var i=0, len=this.squares.length; i<len; ++i) {
                perameter_data.context.fillStyle = "red";
                perameter_data.context.fillRect(this.squares[i].position_x, this.squares[i].position_y, perameter_data.side_length, perameter_data.side_length);
                if(perameter_data.color_is_change) {
                    if(this.squares[i].speedX_flag && this.squares[i].speedY_flag) {
                        perameter_data.context.fillStyle = "yellow";
                    }
                    else if(this.squares[i].speedX_flag && !this.squares[i].speedY_flag) {
                        perameter_data.context.fillStyle = "#00BFFF";
                    }
                    else if(!this.squares[i].speedX_flag && this.squares[i].speedY_flag) {
                        perameter_data.context.fillStyle = "#00FF7F";
                    }
                    else {
                        perameter_data.context.fillStyle = "#FF6347";
                    }
                }
                else {
                    perameter_data.context.fillStyle = "yellow";
                }
                perameter_data.context.fillRect(this.squares[i].position_x+3, this.squares[i].position_y+3, perameter_data.side_length-6, perameter_data.side_length-6);
            }
        },
        //处理方块运动的方法--->无返回值
        moveSquares: function() {
            for(var i=0, len=this.squares.length; i<len; ++i) {
                this.squares[i].position_x = this.squares[i].speedX_flag ? ++this.squares[i].position_x : --this.squares[i].position_x;
                this.squares[i].position_y = this.squares[i].speedY_flag ? ++this.squares[i].position_y : --this.squares[i].position_y;
            }
        },
        //增加一个方块的方法--->接受方块的初始位置；若不够位置插入方块则返回false，插入方块则返回true
        addOneSquare: function(position_x, position_y) {
            for(var i=0, len=this.squares.length; i<len; ++i) {
                if(Math.abs(position_x - this.squares[i].position_x) <= perameter_data.side_length && Math.abs(position_y - this.squares[i].position_y) <= perameter_data.side_length) {
                    return false;
                }
            }

            var square = new Square();
            square.position_x = position_x;
            square.position_y = position_y;
            this.squares.push(square);
            perameter_data.counter.innerHTML = this.squares.length;

            return true;
        },
        //减少一个方块的方法--->移除成功则返回true， 失败则返回false
        removwOneSquare: function() {
            if(this.squares.length === 0) {
                return false;
            }

            this.squares.shift();
            perameter_data.counter.innerHTML = this.squares.length;

            return true;
        },
        //移除全部方块的方法--->不返回值
        removwAllSquare: function() {
            this.squares.splice(0, this.squares.length);
            perameter_data.counter.innerHTML = this.squares.length;
        }
    }

    /****************************
     * 处理碰撞事件的对象
     * **************************/
    function DealWithBounce() {
    }
    DealWithBounce.prototype = {
        //处理方块与边界的碰撞的方法--->传入单个方块对象；无返回值
        bounceWithWall: function(square) {
            if(square.position_x <= 0) {
                square.speedX_flag = true;
            }
            else if(square.position_x >= perameter_data.canvas_width - perameter_data.side_length) {
                square.speedX_flag = false;
            }

            if(square.position_y <= 0) {
                square.speedY_flag = true;
            }
            else if(square.position_y >= perameter_data.canvas_height - perameter_data.side_length) {
                square.speedY_flag = false;
            }
        },
        //处理方块之间碰撞的方法--->传入全部方块的集合（数组）；无返回值
        bounceWithAnother: function(squares) {
            for(var i=0, len=squares.length; i<len; ++i) {
                for(var j=i+1; j<len; ++j) {
                    var _x = squares[j].position_x - squares[i].position_x;
                    var _y = squares[j].position_y - squares[i].position_y;
                    var deltaX = Math.abs(_x);
                    var deltaY = Math.abs(_y);

                    //发生了碰撞
                    if(deltaX < perameter_data.side_length && deltaY < perameter_data.side_length) {
                        //x方向发生碰撞
                        if(deltaX > deltaY) {
                            if(_x > 0) {    //j方块在右侧
                                squares[j].speedX_flag = true;
                                squares[i].speedX_flag = false;
                            }
                            else {      //i方块在右侧
                                squares[i].speedX_flag = true;
                                squares[j].speedX_flag = false;
                            }
                        }
                        //x方向发生碰撞
                        else if(deltaY > deltaX) {
                            if(_y > 0) {    //j方块在下面
                                squares[j].speedY_flag = true;
                                squares[i].speedY_flag = false;
                            }
                            else {      //i方块在下面
                                squares[i].speedY_flag = true;
                                squares[j].speedY_flag = false;
                            }
                        }
                        //尖角发生碰撞
                        else if(deltaX <= perameter_data.side_length-2) {   //减2是为了稳定对角碰撞的效果
                            squares[i].speedX_flag = !squares[i].speedX_flag;
                            squares[j].speedX_flag = !squares[j].speedX_flag;
                            squares[i].speedY_flag = !squares[i].speedY_flag;
                            squares[j].speedY_flag = !squares[j].speedY_flag;
                        }
                    }
                }
            }
        }
    }

    /****************************************************************************/
    var process_control = new ProcessControl();
    if(!process_control.getInputData()) {       //获取用户输入
        return false;
    }
    var all_squares = new AllSquares();
    var deal_with_bounce = new DealWithBounce();

    process_control.setElement();      //创建了元素
    process_control.initializeInterface();      //为元素（canvas元素）设置宽度
    process_control.dealWithButton(all_squares);       //为按键绑定事件
    process_control.globalProcess(all_squares, deal_with_bounce);   //让盒子自动循环运作

    return perameter_data.bounce_box;
}