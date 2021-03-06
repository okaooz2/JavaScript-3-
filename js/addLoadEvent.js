/*************************************************************************************************
此函数功能为：可连续装载多个函数到window.onload事件中
1. func为要装载函数的函数名
2. 连续装载函数请多次调用本函数
**************************************************************************************************/


function addLoadEvent(func) {
	var loadEvents = window.onload;		//把现有的onload事件先保存起来
	if(typeof loadEvents !== "function") {		//如果事件是空的（指针是空的，还没有函数被装载）
		window.onload = func;
	}
	else {			//如果原来已有函数被装载，则直接装载函数会覆盖原有函数
		window.onload = function() {		//因此把原有函数和新的函数装到一个容器（新的函数）中，再装载
			loadEvents();
			func();
		}
	}
}