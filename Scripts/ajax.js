/**
 * Created by Zhou.Xin.Lin on 2017/11/20.
 */
define(function(){
    var Ajax = {
        get: function (url, fn, fnError) {
            var obj;  // XMLHttpRequest对象用于在后台与服务器交换数据
            if (window.XMLHttpRequest) {
                // 非IE内核
                obj = new XMLHttpRequest();
            } else if (window.ActiveXObject) {
                // IE内核,这里早期IE的版本写法不同,具体可以查询下
                obj = new ActiveXObject("Microsoft.XMLHTTP");
            }
            obj.open('GET', url, true);
            obj.onreadystatechange = function () {
                if (obj.readyState === 4) {
                    if ((obj.status === 200 || obj.status === 304)) { // readyState == 4说明请求已完成
                        fn.call(this, obj.responseText);  //从服务器获得数据
                    } else if (fnError) {
                        fnError.call(this, obj.responseText);  // 异常时调用
                    }
                }
            };
            obj.send();
        },
        post: function (url, data, fn, fnError) {         // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
            var obj = new XMLHttpRequest();
            obj.open("POST", url, true);
            obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  // 添加http头，发送信息至服务器时内容编码类型
            obj.onreadystatechange = function () {
                if (obj.readyState === 4) {
                    if ((obj.status === 200 || obj.status === 304)) {  // 304未修改
                        fn.call(this, obj.responseText);
                    } else {
                        if (fnError) {
                            fnError.call(this, obj.responseText);  // 异常时调用
                        }
                    }
                }
            };
            obj.send(data);
        }
    };
    return Ajax;
});