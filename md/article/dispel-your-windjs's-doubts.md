# 消除你对Wind.js的疑虑
## 2012-08-13 23:52

### eval is (always) evil

> eval大概也算是整个ECMAScript语言中最强大的一个方法，
他就像是一个完整的ECMAScript解析器。你说它evil,我也承认这个
方法会存在危险，有可能带来安全问题，特别是在用它执行用户输入
数据的情况下。但Wind.js是用eval来运行已经“编译”后的代码，
让你更舒服顺畅的来编写异步回调的代码。这些代码是你自己写的，
所以不必担心代码注入、跨站脚本攻击这样的安全问题。没有这这个
困扰和担忧，我相信eval应该是美好的。

### API太丑，eval为什么不封装？

> 通过eval执行的代码是被认为是包含该次调用的执行环境的一部分，
因此被执行的代码具有与该执行环境有着相同的作用域链。

	var Wind = require("wind");
	
	var msg = 'hello world';
	eval("console.log(msg)");//hello world
	
	var msg = 'hello world';
	var newFunc = eval(Wind.compile("async", function () { 
		console.log(msg);
	}));
	newFunc().start();//hello world

> 变量msg是在eval外定义的，但eval中还是能够打印"hello world"。
如果包装起来如法访问到msg这个变量。

	var Wind = require("wind");
	
	var vm = require("vm");
	var sandbox = {
	      Wind: Wind,
	      console:console
	};
	
	function $async(fun){
		var script = vm.createScript(Wind.compile("async", fun));
		return script.runInNewContext(sandbox);
	}
	
	var msg = 'hello world';
	var newFunc = $async(function () { 
		console.log(msg);
	});
	newFunc().start();//[WARNING] An unhandled error occurred: ReferenceError: msg is not defined

> 上面的例子中看到我们使用vm模块对eval有一个简单的包装，可以直接
使用$async方法来替换以前的写法。从打印信息中，你很容易看出访问
不到msg这个参数。麻烦请注意一下调用script.runInNewContext()方法
时传入了一个sandbox对象，这相当于往代码运行环境中添加上下文参数。
如果sanbox这个参数不传递，运行上端代码会报ReferenceError: Wind 
is not defined的错误。这就是eval为什么无法包装的原因。

> 如果你的代码不需要依赖上下文你可以用上述方法包装，例如这样：

	var Wind = require("wind");
	
	var vm = require("vm");
	var sandbox = {
	      Wind: Wind,
	      console:console
	};
	
	function $async(fun){
		var script = vm.createScript(Wind.compile("async", fun));
		return script.runInNewContext(sandbox);
	}
	
	var fib = $async(function () {
	
	    $await(Wind.Async.sleep(1000));
	    console.log(0);
	    
	    $await(Wind.Async.sleep(1000));
	    console.log(1);
	
	    var a = 0, current = 1;
	    while (true) {
	        var b = a;
	        a = current;
	        current = a + b;
	
	        $await(Wind.Async.sleep(1000));
	        console.log(current);
	    }
	});
	
	fib().start();

### Wind.js很重很慢不适合前端
	
> Wind.js基础组件及异步运行库共计4K大小（Minified + GZipped），
Wind.js完全不会给前端带来负担，给你带来顺畅舒服的异步编程体验。

### 生成的代码看不懂，难以调试

> Wind.js生产的代码也完全是Javascript代码，你无需为调试担忧。
下面是一个例子，我相信你很容易就可以看懂。

	// Original: 
	function () {
	
	    $await(Wind.Async.sleep(1000));
	    console.log(0);
	    
	    $await(Wind.Async.sleep(1000));
	    console.log(1);
	
	    var a = 0, current = 1;
	    while (true) {
	        var b = a;
	        a = current;
	        current = a + b;
	
	        $await(Wind.Async.sleep(1000));
	        console.log(current);
	    }
	}
	
	// Windified: 
	/* async << function () { */     (function () {
	                                     var _builder_$0 = Wind.builders["async"];
	                                     return _builder_$0.Start(this,
	                                         _builder_$0.Delay(function () {
	/*     $await(Wind.Async.sleep(1000)); */    return _builder_$0.Bind(Wind.Async.sleep(1000), function () {
	/*     console.log(0); */                        console.log(0);
	/*     $await(Wind.Async.sleep(1000)); */        return _builder_$0.Bind(Wind.Async.sleep(1000), function () {
	/*     console.log(1); */                            console.log(1);
	/*     var a = 0, current = 1; */                    var a = 0, current = 1;
	                                                     return _builder_$0.While(function () {
	/*     while (true) { */                                 return true;
	                                                     },
	                                                         _builder_$0.Delay(function () {
	/*         var b = a; */                                     var b = a;
	/*         a = current; */                                   a = current;
	/*         current = a + b; */                               current = a + b;
	/*         $await(Wind.Async.sleep(1000)); */                return _builder_$0.Bind(Wind.Async.sleep(1000), function () {
	/*         console.log(current); */                              console.log(current);
	                                                                 return _builder_$0.Normal();
	                                                             });
	                                                         })
	/*     } */                                          );
	                                                 });
	                                             });
	                                         })
	                                     );
	/* } */                          })

### eval性能方面会有问题

> 有童鞋提出这方面的问题，但不知道提供什么样子的测试才能令人信服，从而消除疑虑，放心大胆的使用Wind.js。
这个问题还在收集整理中...

### 写在最后

> 在ADC被老赵的执着打动了，支持老赵从文档开始吧。
如果你还有对Wind.js的任何疑虑都可以留言，这个文档的目的就是消除你对Wind.js的疑虑。