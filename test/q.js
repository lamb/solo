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

	console.log(preData);

	return 'I\'m done immediately.';

}

function asyncFunc2(preData){

	console.log('asyncFunc2');

	console.log(preData);
	var dfd=Q.defer();
	setTimeout(function(){
		dfd.resolve('I\'m done after 2000ms.');
	},2000);
	return dfd.promise;
}


Q.when(asyncFunc1()).then(syncFunc1).then(asyncFunc2).done(function(data){

	console.log(data);

});