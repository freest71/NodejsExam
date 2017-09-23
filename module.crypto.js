//----------------------------------------
// 복호화가 불가능한 hash
//----------------------------------------
var crypto = require('crypto');

var password = 'test1234!@#$';
var shasum = crypto.createHash('sha256');
shasum.update(password);
var output = shasum.digest('hex');

console.log('password='+password);
console.log('hash='+output);

var shasum2 = crypto.createHash('sha256');
shasum2.update('test1234~@##');
var output2 = shasum2.digest('hex');
console.log('wrong hash='+output2);

//-------------------------------------------
// 복호화 가능한 암호화처리
// secret_key은 나만 알고 있는 임의값set
//-------------------------------------------
var secret_key = "IAMABOYYOUAREAGIRL9283746271!@!%@%@&!";
var cipher = crypto.createCipher('aes192',secret_key);
cipher.update(password, 'utf8', 'base64');
var cipheredOutput = cipher.final('base64');

var decipher = crypto.createDecipher('aes192',secret_key);
decipher.update(cipheredOutput, 'base64', 'utf8');
var decipheredOutput = decipher.final('utf8');

console.log('ciphered password='+cipheredOutput);
console.log('deciphered password='+decipheredOutput);

//--------------------------------------------
// 파일로 저장
// 앞에 password은 문자, :뒤에 있는 password은 값이다.
// 비동기 방식이므로 아래 로직은 write , read 순인데  실행해보면 read가 먼저 발생할 수 있다.
// 비동기 방식은 순차처리할지를 주의해야 한다.
// 비동기로 write, read로 비동기 실행되지만 이후 실제 실행은 os딴에서 비동기 실행 결과는 예측할 수 없다.
// 순차처리 하려면 아래 else 문장에 fs.readFile문장을 추가한다. 
//--------------------------------------------
var fs = require('fs');
var data = {password:password, output:output, cipheredOutput:cipheredOutput};

fs.writeFile('password.txt', JSON.stringify(data),
	'utf8', function(err) 
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			console.log('write completed...');
		}
	});

fs.readFile('password.txt', 'utf8', function(err,data){
	if (err) {
		console.log(err);		
	} else {
		console.log('read_data='+data);
	}
})

