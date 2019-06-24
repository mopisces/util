import axios from 'axios' ;

var httpInstance = axios.create();//创建axios对象

httpInstance.defaults.timeout = 2500;//设置超时默认值
httpInstance.defaults.retry = 4;//请求超时重新发起请求的次数
httpInstance.defaults.retryDelay = 1000;//请求间隙

httpInstance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';//设置post请求头部信息

/**
 * [设置请求拦截器]
 * @param  {[object]} config [请求的配置信息]
 * @param  {[object]} error [请求错误对象]
 */
httpInstance.interceptors.request.use(
	config => {
		//Request settings
		config.headers.Token = 'token值'; //设置请求头部的自定义信息
		return config;
	},
	error => {
		// Do something with request error
		requestErrorHandler(error)
	}
);
/**
 * [设置响应拦截器]
 * @param  {[object]} response [响应对象]
 * @param  {[object]} error [响应错误对象/统一处理错误返回]
 */
httpInstance.interceptors.response.use(
	response => {
		//Do somethings ...
		return response;
	},
	error => {
		//错误处理
		responseErrorHandle(error);
	}
);
/**
 * [API接口response错误时处理] 
 * @param  {[object]} error    [API接口返回的错误对象]
 * @return {[type]}              [description]
 */
const responseErrorHandle = (error) => {
	if(	error.data.code == 40004){
		//do somethings ...
		console.dir(error.data)
	}
	//请求超时，重新发起请求
	if(error.code == 'ECONNABORTED'){
		var config = error.config
		if(!config || !config.retry) return Promise.reject(error);
		config._retryCount = config._retryCount || 0 ;
		if( config._retryCount >= config.retry ){
			return Promise.reject(error);
		}
		config._retryCount += 1;
		var backoff = new Promise((resolve)=>{
			setTimeout(()=>{
				resolve();
			},config.retryDelay || 1000);
		})
		return backoff.then(()=>{
			return httpInstance(config);
		})
	}
}
/**
 * [request错误时处理]
 * @param  {[object]} error [错误对象]
 * @return {[type]}       [description]
 */
const requestErrorHandler = (error) => {
	//Do somethings ...
	//请求错误，重新发起请求 
	console.dir(error)
}

export default {
	/**
	 * [get axios的get方法]
	 * @param  {[string]} url    [URL地址]
	 * @param  {Array}  params [参数]
	 * @return {[mix]}        [resolve对象/reject对象]
	 */
	get(url,params = {}){
		return new Promise((resolve,reject)=>{
			httpInstance.get(url,{
				params:params
			}).then( response => {
				resolve(response.data);
			}).catch( error =>{
				reject(error);
			})
		})
	},
	/**
	 * [post axios的post的方法]
	 * @param  {[string]} url  [URL地址]
	 * @param  {Object} data [参数]
	 * @return {[mix]}      [resolve对象/reject对象]
	 */
	post(url,data = {}){
		return new Promise((resolve,reject)=>{
			let params = new URLSearchParams()
			params.append('data',JSON.stringify(data))
			httpInstance.post(url,params).then(response=>{
				resolve(response.data);
			}).catch(error=>{
				reject(error);
			})
		})
	},
	/**
	 * [patch axios的patch的方法]
	 * @param  {[string]} url  [URL地址]
	 * @param  {Object} data [参数]
	 * @return {[mix]}      [resolve对象/reject对象]
	 */
	patch(url,data = {}){
		return new Promise((resolve,reject)=>{
			let params = new URLSearchParams()
			params.append('data',JSON.stringify(data))
			httpInstance.patch(url,params).then(response=>{
				resolve(response.data);
			}).catch(error=>{
				reject(error);
			})
		})
	},
	/**
	 * [put axios的put的方法]
	 * @param  {[string]} url  [URL地址]
	 * @param  {Object} data [参数]
	 * @return {[mix]}      [resolve对象/reject对象]
	 */
	put(url,data = {}){
		return new Promise((resolve,reject)=>{
			let params = new URLSearchParams()
			params.append('data',JSON.stringify(data))
			httpInstance.put(url,params).then(response=>{
				resolve(response.data);
			}).catch(error=>{
				reject(error);
			})
		})
	}
}