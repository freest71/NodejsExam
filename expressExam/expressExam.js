var express = require('express');
var bodyParsor = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var app = express();

app.use(cookieParser());
app.use(bodyParsor.urlencoded({extended:false}));

//127.0.0.1:52273/index.html 실행시 public폴더에서 index.html을 찾는다.
//정적으로 저장되어(ex:이미지등..) 있는것을 쉽게 보여주는것은 public에 저장(루트를 기준으로 찾아감)
app.use(express.static(__dirname+'/public'));

//웹브라우저에서 호출->쿠키를 읽어 로그인여부체크 (/루트는 로그인이 되었을경우만 보이는 page) 
app.get('/',function(req,res){
	if (req.cookies.auth) { //로그인 정보가 있을 경우
		res.send('<html><body><h1>Login Sucess</h1>'+
			'<form method="POST" action="/logout">'+
			'<input type="submit" value="Logout"/>'+
			'</form></body></html>');
	} else { //로그인을 하지 않았으면 무조건 로그인페이지로
		res.redirect('/login');
	}
});
app.post('/logout',function(req,res){
	res.clearCookie('auth');
	res.redirect('/');  //redirect()은 무조건 get방식이다.
});
app.get('/login',function(req,res){
	fs.readFile(__dirname+'/public/login.html',
		function(err, data) {
			if (err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(data.toString());
			}
		});
});
//submit버튼 클릭시 post방식 대응
app.post('/login',function(req,res){
	var username = req.body.username;
	var password = req.body.password;
	//hash로 인코딩값으로 비교
	if (username == 'hong' && password == '1234'){
		res.cookie('auth',true);
		res.redirect('/');		
	} else {
		res.redirect('login');
	}
});

//루트 디렉토리 다음 문장에 따라 해당 page실행 , id:동적page
app.get('/a',function(req, res){
	res.send("<a href='/b'>Go to B</a>"+
		"<a href='/index.html'>Go to Home</a>");
});
app.get('/b',function(req, res){
	res.send("<a href='/a'>Go to A</a>");
});
app.get('/page/:id',function(req, res){
	var id = req.params.id;
	res.send("<h1>"+id+' Page</h1>');
});

// 위 app에 create포함 콜백 개념으로 app.use()은 콜백이 된상태라고 보면 됨
/*
app.use(function(req,res){
	//http통신 -> res.writeHead(200, {'Content-Type':'text/html'});
	//res.end('<h1>Hello, Express</h1>');

	//웹화면에서 request한 내용을 출력
	//console.log(req);

	var name = req.query.name;
	var region = req.query.region;

	var agent = req.header('User-Agent');
	if (agent.toLowerCase().match(/chrome/)){
		res.send('<h1>Hello, Chrome</h1>' + 'name:'+name+'<br>region:'+region);		
	} else {
		res.send('<h1>Hello, others</h1>'+ 'name:'+name+'<br>region:'+region);		
	}

	var object = {
		name:'Hong',
		age:30,
		marriage:false,
		friends:['JOHN','SUE'],
		job:{
			name:'salaryman',
			income:100
		}
	}

	//json객체를 문자로 변환후 화면으로 리턴
	res.send(JSON.stringify(object));

	//express 패키지를 사용하는경우 위 두줄을 아래 한줄로 사용가능함
	//res.send('<h1>Hello, Express2<h1>');
})
*/

app.listen(52273, function() {
	console.log('Server Running....');
});
