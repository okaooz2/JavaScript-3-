function loadScriptString(code_text) {
	var script_element = document.createElement("script");
	script_element.style = "text/javascript";

	try {
		script_element.appendChild(document.createTextNode(code_text));
	}
	catch(ex) {		//IE
		script_element.text = code_text;
	}
	document.body.appendChild(script_element);
}


function loadStyleString(code_text) {
	var style_element = document.createElement("style");
	style_element.style = "text/css";

	try {
		style_element.appendChild(document.createTextNode(code_text));
	}
	catch(ex) {		//IE
		style_element.styleSheet.cssText = code_text;
	}
	var head = document.getElementsByTagName[0];
	head.appendChild(style_element);
}