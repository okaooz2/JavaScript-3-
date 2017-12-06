var CookieUtil = {
    /**
     * 此函数作用为根据输入的参数返回对应的cookie
     * 注意，此函数检索不到中文名称的cookie
    */
    get: function(name) {
        var all_cookie = decodeURIComponent(document.cookie);
        //在cookie中搜索名字为name的字符串，并记录其在原字符串中的索引号
        var name_reg = eval("/\\b" + name + "=/");      //"\"要转义为"\\"
        var start_index = all_cookie.search(name_reg);
        //如果查找到了要找的cookie，则把它记录下来
        if(start_index > -1) {
            var end_index = all_cookie.indexOf(";", start_index);
            //如果后面没有";"，则表示该cookie是最后一个cookie
            if(end_index === -1) {
                end_index = all_cookie.length - 1;
            }
            //记录cookie字符串
            var cookie_value = all_cookie.substring(start_index, end_index + 1);
        }
        
        return cookie_value;
    },
    /**
     * 此函数作用为新增cookie或覆盖旧的cookie
     * 注意，输入参数为一对象，其属性最多6个，分别为:
     * name, value, domain, path, expires, secure
     * 其中name和value为必须输入的参数，expires为Data类型数据，secure为布尔类型
     */
    set: function(obj) {
        var cookie = "";
        //设置cookie名称
        if(obj.name) {
            cookie += encodeURIComponent(obj.name);
        }
        //设置cookie值
        if(obj.value) {
            cookie += "=" + encodeURIComponent(obj.value);
        }
        //设置cookie域
        if(obj.domain) {
            cookie += "; domain=" + obj.domain;
        }
        //设置cookie路径
        if(obj.path) {
            cookie += "; path=" + obj.path;
        }
        //设置cookie失效时间
        if(obj.expires instanceof Date) {
            cookie += "; expires=" + obj.expires.toGMTString();
        }
        //设置安全标示
        if(obj.secure === true) {
            cookie += "; secure";
        }
        //添加cookie
        document.cookie = encodeURIComponent(cookie);
    },
    /**
     * 此函数作用为删除指定的cookie
    */
    unset: function(obj) {
        //通过设定过期时间实现删除cookie
        this.set({
            name: obj.name,
            expires: new Date(0),
            path: obj.path,
            domain: obj.domain,
            secure: obj.secure
        })
    }
};