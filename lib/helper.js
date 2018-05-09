//助手
Helper=function ( ) { }
Helper.prototype.json_error = function(msg) {
  	return {code:1,msg:msg,count:0,data:''}
};

Helper.prototype.json_success = function(data,msg) {
  	return {code:0,msg:msg,count:data.length,data:data}
};

Helper.prototype.menu_tree = function (list, sort) {
	var menu  = [] , sub_menu=[];
	list.forEach(function (val) {
		 if (val[sort]==0) {
		 	val['sub']=[];
		 	menu.push(val);
		 }else{
		 	sub_menu.push(val);
		 }
	})
	menu.forEach(function (val,index) {
		sub_menu.forEach(function (sub) {
			console.log(sub)
			if (sub.pid==val.id) {
				menu[index]['sub'].push(sub);
			}
		})
	})

	return menu;
}
module.exports = Helper;