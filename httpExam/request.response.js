//------------------------------------------------------------------------------
// index.html 대응 할 웹서버
//------------------------------------------------------------------------------
// request.response.js 최초는 listen() 실행 -> 웹화면에서 url요청은 -> GET방식 -> 
// 제출 버튼 클릭시 POST방식 -> 아래 이벤트 로직에서 POST request 처리
// index.html submit POST방식일때 서버은 이벤트로 대응한다.
// express객체 사용시 http모듈 기능을 모두 제공한다. express객체만 알아도 됨
// ejs은 외부 패키지 모듈 -> npm instrall ejs 로 설치후 사용해야 함 -> data를 json으로 던짐
// ejs <%= 붙여서 도는 뛰어서 문법에 정확히 맞혀야 한다.
// ejs, jade 은 동적으로 html처리하는 모듈(서버에서 동적html 처리하는 방식)
// ejs, jade은 클라이언트 변경시마다 서버 로직이 변경해야 한다.
// 또 따른 방식은 별도 웹서버을 두고 ajax방식으로 처리시 서버 render링 없이 구현된다.(확장성 높음)
// html 보여주는 web 서버,  data만 처리하는 web 서버로 운영
//-------------------------------------------------------------------------------
//-------------------------------------------------------------------------------
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
var jade = require('jade');
http.createServer(function(req,res){
	if (req.method == 'GET'){
		console.log(req.url+" GET");
		if (req.url == '/') {
			fs.readFile('index.html', function(err,data) {
				if (!err){
					res.writeHead(200, {'Content-Type':'text/html'});
					res.end(data);
				} else {
					res.writeHead(404);;
					res.end();
				}
			});
		} else if (req.url == '/ejs') {
			fs.readFile('template.ejs','utf8',function(err,data){
				if(!err) {
					var html = ejs.render(data,
						{name:'Hong', description:'Hello,World for EJS'});
					res.writeHead(200, {'Content-Type':'text/html'});
					res.end(html);
				}
			});
		} else if (req.url == '/jade') {
			fs.readFile('template.jade','utf8',function(err,data){
				if (!err)
				{
					var fn = jade.compile(data);
					var html = fn({name:'Hong', description:'Hello,World for JADE'});
					res.writeHead(200,{'Content-Type':'text/html'});
					res.end(html);
				}
			});
		}

	} else if (req.method == 'POST') {
		console.log(req.url+" POST");
		req.on('data', function(data){
			res.writeHead(200, {'Content-Type':'text/html'});
			res.end('<h1>'+data+'</h1>');
		});
	}
}).listen(52273, function(){
	console.log('Server running...');
});