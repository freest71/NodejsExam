var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(__dirname+'/public'));

var mysql = require('mysql');

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'test1234',
  database : 'restful'
});
connection.connect();

/////////////////////////////////////////////////
var MongoClient = require('mongodb').MongoClient;
// Connection URL 
var url = 'mongodb://localhost:27017/restful';
var dbObj = null;

// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
  console.log("Connected correctly to server");
  dbObj = db;
});
app.get('/user/message',function(req,res) {
	//get방식은 query에서
	console.log(req.query.sender_id);
	var condition = {};
	if (req.query.sender_id != undefined)
		condition = {sender_id:req.query.sender_id};
	var messages = dbObj.collection('messages');
	//messages.find({})  //전체row 조회
	messages.find(condition)	//?sender_id=2 매개변수로 지정한건만 조회
	    .toArray(function(err,results){
		if (err){
			res.send(JSON.stringify(err));;
		} else {
			res.send(JSON.stringify(results));
		}
	});

});
var ObjectID = require('mongodb').ObjectID;
app.get('/user/message/:id',function(req,res) {
	var messages = dbObj.collection('messages');
	messages.findOne(
		{_id:ObjectID.createFromHexString(req.params.id)},
		function(err, result){
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		});
});
app.post('/user/message',function(req,res) {
	//post방식은 body에서, query가능하지만 body에 있으므로 사용
	console.log(req.body.sender_id);
	console.log(req.body.reciever_id);
	console.log(req.body.message);

	connection.query('select id,name from user where id=? or id=?',
		[req.body.sender_id, req.body.reciever_id],
		function(err, results, fields) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {	
				var sender = {};
				var reciever = {};
				for (var i = 0; i < results.length; i++) {
					if (results[i].id == Number(req.body.sender_id)) {
						sender = results[i];
					}
					if (results[i].id == Number(req.body.receiver_id)) {
						reciever = results[i];
					}
				}
				var object = {
					sender_id:req.body.sender_id,
					reciever_id:req.body.reciever_id,
					sender:sender, reciever:reciever,
					message:req.body.message,
					created_at:new Date()					
				}
				console.log("__log__object1");
				var messages = dbObj.collection('messages');
				messages.save(object, function(err,result) {
					if (err) {
						res.send(JSON.stringify(err));
						console.log("__log__object_err");
					} else {
						res.send(JSON.stringify(result));
						console.log("__log__object_succ");
					}
				});
			}
		});
});
app.delete('/user/message/:id',function(req,res) {
	//특정row get과 모두 동일하면서 아래 remove만 바꺼주면 됨
	var messages = dbObj.collection('messages');
	messages.remove(
		{_id:ObjectID.createFromHexString(req.params.id)},
		function(err, result){
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}
		});
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
					//results[0].city = '서울';
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

