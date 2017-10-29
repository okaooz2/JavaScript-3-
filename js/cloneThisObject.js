function cloneThisObject(object) {
	var new_object = new Object();
	// if(object instanceof Array) {
	// 	new_object = new Array();
	// }

	var value;
	for(var key in object) {
		// var value = object[key];
		value = object[key];
		new_object[key] = (value instanceof Object) ? cloneThisObject(value) : value;
	}
	return new_object;
}