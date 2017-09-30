var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended:false}));

var mysql = require('mysql');
var mongodb = require('mongodb');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'test1234',
  database : 'restful'
});

//RESTfull  -> postman에서 서버 호출
var users = [];
app.get('/user',function(req,res){
	//res.send(JSON.stringify(users));   //배열 방식 처리 로직
	connection.query('select * from user',
		function(err,results,fields){
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(results));
			}
		});
});
app.get('/user/:id',function(req,res){
	connection.query('select * from user where id=?',
		[req.params.id], function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				if (results.length > 0) {
					results[0].city = '서울';
					res.send(JSON.stringify(results[0]));
				} else {
					res.send(JSON.stringify({}));
				}				
			}
		});

	/* 배열 방식 구 로직
	var select_index = -1;
	for (var i=0; i < users.length; i++){
		var obj = users[i];
		if (obj.id == Number(req.params.id)){
			select_index = i;
			break;
		}
	}
	if (select_index == -1){
		res.send(JSON.stringify({}));;
	} else {
		res.send(JSON.stringify(users[select_index]));
	}
	//res.send(JSON.stringify({api:'get user info', id:req.params.id}));
	*/
});
app.post('/user',function(req,res) {
	connection.query(
		'insert into user(name,age) values(?,?)',
		[req.body.name, req.body.age],
		function(err, result){
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		});

	/* console.log(req.body.name);
	console.log(req.body.age);
	var name = req.body.name;
	var age = Number(req.body.age);
	var obj = {id:users.length+1,name:name,age:age};
	users.push(obj);
	//res.send(JSON.stringify({api:'add user info'}));
	res.send(JSON.stringify({result:true, api:'add user info'})); */
});
app.put('/user/:id',function(req,res){
	connection.query(
		'update user set name=?,age=? where id=?',
		[req.body.name, req.body.age, req.params.id],
		function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		});

	/* 배열방식 구 로직
	var select_index = -1;
	for (var i=0; i < users.length; i++){
		var obj = users[i];
		if (obj.id == Number(req.params.id)){
			select_index = i;
			break;
		}
	}
	if (select_index == -1){
		res.send(JSON.stringify({result:false}));;
	} else {
		var name = req.body.name;
		var age = Number(req.body.age);
		var obj = {id:Number(req.params.id), name:name, age:age};
		users[select_index] = obj;
		res.send(JSON.stringify({restlt:true}));
	}
	//res.send(JSON.stringify({api:'modify user info', id:req.params.id})); 
	*/
});
app.delete('/user/:id',function(req,res){
	connection.query(
		'delete from user where id=?',
		[req.params.id],
		function(err, result) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		});
	/*
	var select_index = -1;
	for (var i=0; i < users.length; i++){
		var obj = users[i];
		if (obj.id == Number(req.params.id)){
			select_index = i;
			break;
		}
	}
	if (select_index == -1){
		res.send(JSON.stringify({result:false}));
	} else {
		users.splice(select_index,1);
		res.send(JSON.stringify({result:true}));
	}
	//res.send(JSON.stringify({api:'delete user info', id:req.params.id}));
	*/
});
app.listen(52273,function(){
	console.log('Server running');
});

