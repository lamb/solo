var Q=require('q');

function asyncFunc1(){

	console.log('asyncFunc1');
	var dfd=Q.defer();
	setTimeout(function(){
		dfd.resolve('I\'m done after 1000ms.');
	},1000);
	return dfd.promise;
}

function syncFunc1(preData){

	console.log('syncFunc1');

	// console.log(preData);

	// console.log(preData.abc.c);

	return 'I\'m done immediately.';

}

function syncFunc2(preData){

	console.log('syncFunc2');

	console.log(preData);

	// console.log(preData.abc.c);
	return 'I\'m done immediately.';

}

function syncFunc3(preData){

	console.log('syncFunc3');

	console.log(preData);

	console.log(preData.abc.c);
	return 'I\'m done immediately.';

}

function asyncFunc2(preData){

	console.log('asyncFunc2');

	console.log(preData);
	// console.log(preData.abc.c);
	var dfd=Q.defer();
	setTimeout(function(){
		dfd.resolve('I\'m done after 2000ms.');
	},2000);
	return dfd.promise;
}


/*Q.when(asyncFunc1()).then(syncFunc1).then(asyncFunc2).done(function(data){

	console.log(data);

});
*/

/*Q.when(syncFunc1()).then(asyncFunc1()).then(asyncFunc2).then(syncFunc2,function(err){
	console.log('error!!!!!!!!!');
	console.log(err);
});*/

Q.when(syncFunc1()).then(asyncFunc1()).then(asyncFunc2).then(syncFunc3).then(syncFunc2).fail(function(err){
	console.log('error!!!!!!!!!');
	console.log(err);
});