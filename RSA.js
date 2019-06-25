import { JSEncrypt } from 'jsencrypt';
import md5 from 'js-md5';

export default{
	/**
	 * [sortByKey 生成sign/返回有sign的对象]
	 * @rules : 1.对象的键名sort排序 2.key=value&...生成字符串 3.md5()函数加密 4.转成小写
	 * @param  {[obj]} obj [生成sign所需的参数]
	 * @return {[obj]}     [带有sign的对象]
	 */
	sortByKey(obj){
		obj['nonce'] = Math.ceil(Math.random()*10);//1~10内的随机值
		obj['timestamp'] = parseInt((new Date().getTime())/ 1000);//时间戳
		obj['appid'] = 'appid';//换成实际appid
		let newkey = Object.keys(obj).sort().reverse();
		let str = '';
		for (var i = newkey.length - 1; i >= 0; i--) {
			str += newkey[i] + '=' + obj[newkey[i]] + '&';
		}
		str += 'key=' + 'appsercet';//换成实际appserect
		obj['sign'] = md5(str).toLowerCase();
		return obj;
	},
	/**
	 * [RsaEncrpt 对数据进行Rsa加密]
	 * @param {[mix]} data [需要加密的数据]
	 * @return {[mix]} [加密后的数据或false]
	 */
	RsaEncrpt( data ){
		let encrypt = new JSEncrypt();
		let publicKey = 'publicKey';//公钥
		encrypt.setPublicKey( publicKey );
		let str = data;
		if( typeof(data) != 'string' ){
			str = JSON.stringify(data);
		}
		if(str.length > 128){ //加密字符串长度由生成密钥对时定义
			return false;
		}
		return encrypt.encrypt(str);
	}
}