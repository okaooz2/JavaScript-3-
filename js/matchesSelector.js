function matchesSelector(element, selector) {
	if(element.matchesSelector) {
		return element.matchesSelector(selector);
	}
	else if(element.msMatchesSelector) {		//IE9
		return element.msMatchesSelector(selector);
	}
	else if(element.mozMatchesSelector) {		//火狐3.6
		return element.mozMatchesSelector(selector);
	}
	else if(element.webkitMatchesSelector) {		//Safari, Chrome
		return element.webkitMatchesSelector(selector);
	}
	else {
		throw new Error("您的浏览器不支持matchesSelector()方法！！");
	}
}