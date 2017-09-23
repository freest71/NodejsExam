//전역변수 출력
console.log('filename:',__filename);
console.log('dirname:'+__dirname);

//console 전역객체 사용
console.log('숫자:$d + %d = %d', 273, 52, 273+52);
console.log('문자열:%s', 'Hello World...!','특수기호와 상관없음');
console.log('JSON:%j',{name:'Hong'});
console.log('JSON:'+{name:'Hong'});
console.log('JSON:'+JSON.stringify({name:'Hong'}));

//객체선언 ->메모리 동적 할당 
var obj = {name:'Hong'};

//객체럴 문자로 (외부로 JSON전문을 전달하기 위해 문자처리)
obj = JSON.stringify(obj);

//문자를 객체로 (외부에서 문자 json을 받아 객체처리) -> 별도 객체/메모리
obj = JSON.parse(obj);

// 몽고DB, MYSQL을 비동기로 호출하고 -> 각각의 결과를 JSON형태로 합쳐서 사용 가능

console.time('alpha');
var output = 1;
for (var i = 1; i <= 10; i++) 
{
	output *= 1;
}
console.log('Result='+output);
console.timeEnd('alpha');

var module = require('./module.js');
console.log('abs(-273)='+module.abs(-273));
console.log('circleArea(3)='+module.circleArea(3));
