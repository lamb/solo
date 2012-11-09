# 这是文章的标题
## 2012-07-19 16:56


### 这是h3

> This is a blockquote.
>
> This is the second paragraph in the blockquote.
>
> ## This is an H2 in a blockquote

    _Task = require('../models/myModel').Task;
    _find  = _Task.prototype.find
    _Task.prototype.find = function(cb){
        cb(null,[{name:'task1'}])
    };

    var fs = require('fs'), path = require('path');
    console.log(__dirname);
    fs.watch(__dirname, function (event, filename) {
        if(filename){
            var type  = event == "change" ? "changed" : "created"; //有文件或目录发生改变或被添加
            var filepath = path.join(__dirname ,filename);
            var stat = fs.statSync(filepath);
            "isDirectory,isFile,isSymbolicLink".replace(/\w+/g,function(method){
                if(stat[method]()){
                    console.log( method.replace(/^is/,"")+ "  '"+ filepath +"' has "+ type)
                }
            });
        }else{
            console.log("Some file is removed") //删除了某个文件或目录
        }
    });

monitor 项目说明
==============

[Java Eye](http://www.iteye.com/)
[link](http://www.neti.ee)

部署环境
----
----
1. JDK:	1.6_x 最好采用最新版本的JDK
2. Tomcat: 6.x	请不要使用tomcat5.5的安装版
3. 数据库:	支持SQL Server和Oracle, 如果需要切换数据库请看后面部分: _更换数据库环境_
	+ __SQLServer__:	修改oracleDriver_mssql2005.properties 中的配置
	+ __Oracle__:	修改oracleDriver.properties 中的配置

This is a demo page
===================

    var fuck = '方滨兴';
    console.log(fuck == 404);
    // true