/****
 * 该对象为自定义函数
 * 使用方法例：
 *  var event_target = new EventTarget();
    event_target.addHandeler("add", add);
    event_target.addHandeler("add", add);
    event_target.addHandeler("add", ddd);
    event_target.addHandeler("add", ddd);
    event_target.addHandeler("add", add);
    event_target.fire({type: "add", 
                        add1: 100, 
                        add2: 250});
    event_target.removeHandler("add", add);
    event_target.removeSeriesHandler("add", add);
    event_target.removeAllHandler("add");
 * **/


/*
自定义事件对象
*/
function EventTarget() {
    /*
    this.handlers对象内存放数组，
    所存放的数组中，
    数组名为事件名，
    数组值为事件处理函数的集合（数组）
    */
    this.handlers = {};
}
EventTarget.prototype = {
    constructor: EventTarget,

    //为事件新增处理函数
    //添加的函数若需要传入参数，则应以对象的形式传入，详细可看fire函数的执行过程
    addHandeler: function(event_type, event_handler) {
        //若之前没有添加过该事件，则添加该事件
        if(typeof this.handlers[event_type] === "undefined") {
            this.handlers[event_type] = [];
        }
        //为事件新增处理函数
        this.handlers[event_type].push(event_handler);
    },
    //执行某事件的所有处理函数
    //event为执行函数所需的参数，它应以对象的形式给出
    //event对象最基本应包含：event.type-->事件名
    //event.target为事件执行的环境，默认为this，若需要更改请另行在event对象中设置
    //该函数可多次添加同一个函数
    fire: function(event) {
        //若处理函数的执行环境没有设定，则默认设定为this
        if(typeof event.target === "undefined") {
            event.target = this;
        }
        //判断事件是否已经定义
        if(this.handlers[event.type] instanceof Array) {
            //定义handlers存放事件处理函数数组
            var handlers = this.handlers[event.type];
            //把事件函数的
            //逐个执行事件处理函数（是按事件添加顺序执行的）
            for(var i=0, len=handlers.length; i<len; ++i) {
                handlers[i](event);
            }
        }
    },
    //删除某事件的某个处理函数
    //对于多次添加了同一个函数的情况，该函数只删除最近添加的那个函数
    removeHandler: function(event_type, event_handler) {
        //首先检测该事件是否存在
        if(this.handlers[event_type] instanceof Array) {
            var handlers = this.handlers[event_type];
            //查找处理函数，查找到就删除，查找不到就不做任何操作
            //从数组末尾开始遍历，删除最近添加的一个函数（该函数可能在数组前面也有添加）
            for(var i=handlers.length-1; i>-1; --i) {
                //如果找到对应的函数的话就把它删除，并退出循环
                if(handlers[i] === event_handler) {
                    handlers.splice(i, 1);
                    break;
                }
            }
        }
    },
    //删除数组中某函数
    //该函数会把之前添加的全部同名函数（与输入函数为同一函数）全部删除
    removeSeriesHandler: function(event_type, event_handler) {
        //首先检测该事件是否存在
        if(this.handlers[event_type] instanceof Array) {
            var handlers = this.handlers[event_type];
            //可删除多个匹配的函数
            for(var i=handlers.length-1; i>-1; --i) {
                //如果找到对应的函数的话就把它删除
                if(handlers[i] === event_handler) {
                    handlers.splice(i, 1);
                }
            }
        }
    },
    //移除某事件的所有处理函数
    removeAllHandler: function(event_type) {
        //首先检测该事件是否存在
        if(this.handlers[event_type] instanceof Array) {
            //移除所有函数
            this.handlers[event_type].splice(0);
        }
    }
};