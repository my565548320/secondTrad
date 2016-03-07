var API = require('wechat-api');
var Config = require('./Config');
var redis = require('./Redis');
var Q = require('q');
var crypto = require('crypto');
var api = new API(Config.basketball.weixin_appid,Config.basketball.weixin_appsecret,function(callback){
	redis.get('wechat_access_token',function(err,res){
		if(err){
			return callback(err);
		}
		callback(null,JSON.parse(res));
	});
},function(token,callback){
	redis.set('wechat_access_token',JSON.stringify(token),7200,callback);
});
api.registerTicketHandle(function (type, callback) {
 redis.get('wechat_ticketToken', function (err, res) {
   if (err) return callback(err);
   callback(null, JSON.parse(res));
 });
}, function(type, ticketToken,callback) {
 redis.set('wechat_ticketToken',JSON.stringify(ticketToken),7200,callback);
});
var errMessage = '';
module.exports = {
	getError:function(){
		return errMessage;
	},
	checkSignature:function(signature,timestamp,nonce){
		var tmpArr = [Config.basketball.weixin_token, timestamp, nonce];
	  tmpArr.sort();                           // 1.将token、timestamp、nonce三个参数进行字典序排序
	  var tmpStr = tmpArr.join('');            // 2.将三个参数字符串拼接成一个字符串tmpStr    
	  var shasum = crypto.createHash('sha1');  
	  shasum.update(tmpStr);              
	  var shaResult = shasum.digest('hex');    // 3.字符串tmpStr进行sha1加密
	  if(shaResult === signature){             // 4.加密后的字符串与signature对比，确定来源于微信
	      return true;
	  }
	  return false;
	},
	getJsConfig:function(params){
		var defer = Q.defer();
		api.getJsConfig(params, function(err,result){
			if(err){
				defer.reject(err);
			}else{
				defer.resolve(result);
			}
		});
		return defer.promise;
	},
	/**
	 * 上传多媒体文件 图文列表
	 * @param  {[type]} news [description]
	 * @return {[type]}      [description]
	 */
	uploadNews:function(news){
		var defer = Q.defer();
		api.uploadNews(news, function(err,res){
			if(err){
				defer.reject(err);
			}else{
				defer.resolve(res);
			}
		});
		return defer.promise;
	},
	/**
	 * 将通过上传下载多媒体文件得到的视频media_id变成视频素材
	 * @param  {[type]} opts 
	 * {
			 "media_id": "rF4UdIMfYK3efUfyoddYRMU50zMiRmmt_l0kszupYh_SzrcW5Gaheq05p_lHuOTQ",
			 "title": "TITLE",
			 "description": "Description"
			}
	 * @return {[type]}      [description]
	 */
	uploadMPVideo:function(opts){
		var defer = Q.defer();
		api.uploadMPVideo(opts, function(err,res){
			if(err){
				defer.reject(err);
			}else{
				defer.resolve(res);
			}
		});
		return defer.promise;
	},
	/**
	 * 群发消息，分别有图文（news）、文本(text)、语音（voice）、图片（image）和视频（video）
	 * 详情请见：http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html
	 * @param  {[type]} opts      
	 * {
	 * 	 "image":{
	 * 		"media_id":"123dsdajkasd231jhksad"
	 *   },
	 *   "msgtype":"image"
	 * }
	 * @param  {[type]} receivers 一个组，或者openid列表, 或者true（群发给所有人）
	 * @return {[type]}           [description]
	 */
	massSend:function(opts, receivers){
		var defer = Q.defer();
		api.massSend(opts, receivers, function(err,res){
			if(err){
				defer.reject(err);
			}
			if(res.errcode !== 0){
				errMessage = res.errmsg;
				defer.resolve(false);
			}else{
				defer.resolve(res);
			}
		});
		return defer.promise;
	},
	/**
	 * 群发图文（news）消息
	 * 详情请见：http://mp.weixin.qq.com/wiki/15/5380a4e6f02f2ffdc7981a8ed7a40753.html
	 * @param  {[type]} mediaId   [description]
	 * @param  {[type]} receivers [description]
	 * @return {[type]}           [description]
	 */
	massSendNews:function(mediaId,receivers){
		var defer = Q.defer();
		api.massSendNews(mediaId, receivers, function(err,res){
			if(err){
				defer.reject(err);
			}
			if(res.errcode !== 0){
				errMessage = res.errmsg;
				defer.resolve(false);
			}else{
				defer.resolve(res);
			}
		});
		return defer.promise;
	},
	massSendText:function(content, receivers){
		var defer = Q.defer();
		api.massSendText(content, receivers, function(err,res){
			if(err){
				defer.reject(err);
			}
			if(res.errcode !== 0){
				errMessage = res.errmsg;
				defer.resolve(false);
			}else{
				defer.resolve(res);
			}
		});
		return defer.promise;
	},
	massSendVoice:function(media_id, receivers){
		var defer = Q.defer();
		api.massSendVoice(media_id, receivers, function(err,res){
			if(err){
				defer.reject(err);
			}
			if(res.errcode !== 0){
				errMessage = res.errmsg;
				defer.resolve(false);
			}else{
				defer.resolve(res);
			}
		});
		return defer.promise;
	},
	massSendImage:function(media_id, receivers){
		var defer = Q.defer();
		api.massSendImage(media_id, receivers, function(err,res){
			if(err){
				defer.reject(err);
			}
			if(res.errcode !== 0){
				errMessage = res.errmsg;
				defer.resolve(false);
			}else{
				defer.resolve(res);
			}
		});
		return defer.promise;
	},
	massSendVideo:function(media_id, receivers){
		var defer = Q.defer();
		api.massSendVideo(media_id, receivers, function(err,res){
			if(err){
				defer.reject(err);
			}
			if(res.errcode !== 0){
				errMessage = res.errmsg;
				defer.resolve(false);
			}else{
				defer.resolve(res);
			}
		});
		return defer.promise;
	},
	/**
	 * 群发视频（video）消息，直接通过上传文件得到的media id进行群发（自动生成素材）
	 * @param  {[type]} data      
	 * {
	 * "media_id": "rF4UdIMfYK3efUfyoddYRMU50zMiRmmt_l0kszupYh_SzrcW5Gaheq05p_lHuOTQ",
	 * "title": "TITLE",
	 * "description": "Description"
	 * }
	 * @param  {[type]} receivers [description]
	 * @return {[type]}           [description]
	 */
	massSendMPVideo:function(data, receivers){
		var defer = Q.defer();
		api.massSendMPVideo(data, receivers, function(err,res){
			if(err){
				defer.reject(err);
			}
			if(res.errcode !== 0){
				errMessage = res.errmsg;
				defer.resolve(false);
			}else{
				defer.resolve(res);
			}
		});
		return defer.promise;
	},
	/**
	 * 上传永久素材，分别有图片（image）、语音（voice）、和缩略图（thumb）
	 * 详情请见：http://mp.weixin.qq.com/wiki/14/7e6c03263063f4813141c3e17dd4350a.html
	 * @param  {[type]} filepath [description]
	 * @param  {[type]} type     [description]
	 * @return {[type]}          [description]
	 */
	uploadMaterial:function(filepath,type){
		var defer = Q.defer();
		api.uploadMaterial(filepath, type, function(err,res){
			if(err){
				defer.reject(err);
			}else{
				defer.resolve(res);
			}
			
		});
		return defer.promise;
	},
	/**
	 * 上传永久素材，视频（video）
	 * 详情请见：http://mp.weixin.qq.com/wiki/14/7e6c03263063f4813141c3e17dd4350a.html
	 * @param  {[type]} filepath    [description]
	 * @param  {[type]} description 
	 * var description = {
	 * 	"title":VIDEO_TITLE,
	 *  "introduction":INTRODUCTION
	 * };
	 * @return {[type]}             [description]
	 */
	uploadVideoMaterial:function(filepath,description){
		var defer = Q.defer();
		api.uploadVideoMaterial(filepath, description, function(err,res){
			if(err){
				defer.reject(err);
			}else{
				defer.resolve(res);
			}
			
		});
		return defer.promise;
	},
	uploadNewsMaterial:function(news){
		var defer = Q.defer();
		api.uploadNewsMaterial(news, function(err,res){
			if(err){
				defer.reject(err);
			}else{
				defer.resolve(res);
			}
			
		});
		return defer.promise;
	},
	/**
	 * 根据媒体ID获取永久素材
	 * @param  {[type]} media_id [description]
	 * @return {[type]}          [description]
	 */
	getMaterial:function(media_id){
		var defer = Q.defer();
		api.getMaterial(media_id, function(err,result,res){
			if(err){
				defer.reject(err);
			}else{
				defer.resolve(result,res);
			}
			
		});
		return defer.promise;
	},
	/**
	 * 新增临时素材，分别有图片（image）、语音（voice）、视频（video）和缩略图（thumb）
	 * 详情请见：http://mp.weixin.qq.com/wiki/5/963fc70b80dc75483a271298a76a8d59.html
	 * @param  {[type]} filepath [description]
	 * @param  {[type]} type     [description]
	 * @return {[type]}          [description]
	 */
	uploadMedia:function(filepath,type){
		var defer = Q.defer();
		api.uploadMedia(filepath,type, function(err,res){
			if(err){
				defer.reject(err);
			}else{
				defer.resolve(res);
			}
			
		});
		return defer.promise;
	},
	getMedia:function(media_id){
		var defer = Q.defer();
		api.getMedia(media_id, function(err,result,res){
			if(err){
				defer.reject(err);
			}else{
				defer.resolve(result,res);
			}
			
		});
		return defer.promise;
	},
	uploadImage:function(filepath){
		var defer = Q.defer();
		api.uploadImage(filepath, function(err,res){
			if(err){
				defer.reject(err);
			}else{
				defer.resolve(res);
			}
			
		});
		return defer.promise;
	},
	/**
	 * 创建自定义菜单
	 * 详细请看：http://mp.weixin.qq.com/wiki/13/43de8269be54a0a6f64413e4dfa94f39.html
	 * @param  {[type]} menus
	 * {"button":[
	 * 	{
	 *  	"type":"click",
	 *   	"name":"今日歌曲",
	 *    "key":"V1001_TODAY_MUSIC"
	 *  }
	 * ,{
	 * 	"name":"菜单",
	 *  "sub_button":[{
	 *  	"type":"view",
	 *   	"name":"搜索",
	 *    "url":"http://www.soso.com/"
	 *  },{
	 *  	"type":"click",
	 *   	"name":"赞一下我们",
	 *    "key":"V1001_GOOD"
	 *    }
	 *  ]}
	 * ]}
	 * ]}
	 * @return {[type]}       [description]
	 */
	createMenu:function(menus){
		var defer = Q.defer();
		api.createMenu(menus, function(err,res){
			if(err){
				defer.reject(err);
			}else{
				if(res.errcode !== 0){
					errMessage = res.errmsg;
					defer.resolve(false);
				}else{
					defer.resolve(res);
				}
			}
			
		});
		return defer.promise;
	},
	/**
	 * 删除自定义菜单
	 * @return {[type]} [description]
	 */
	removeMenu:function(){
		var defer = Q.defer();
		api.removeMenu(function(err,res){
			if(err){
				defer.reject(err);
			}else{
				if(res.errcode !== 0){
					errMessage = res.errmsg;
					defer.resolve(false);
				}else{
					defer.resolve(res);
				}
			}
		});
		return defer.promise;
	},
	/**
	 * 客服消息，发送文字消息
	 * @param  {[type]} openid [description]
	 * @param  {[type]} text   [description]
	 * @return {[type]}        [description]
	 */
	sendText:function(openid,text){
		var defer = Q.defer();
		api.sendText(openid,text,function(err,res){
			if(err){
				defer.reject(err);
			}else{
				if(res.errcode !== 0){
					errMessage = res.errmsg;
					defer.resolve(false);
				}else{
					defer.resolve(res);
				}
			}
		});
		return defer.promise;
	},
	sendImage:function(openid,media_id){
		var defer = Q.defer();
		api.sendImage(openid,media_id,function(err,res){
			if(err){
				defer.reject(err);
			}else{
				if(res.errcode !== 0){
					errMessage = res.errmsg;
					defer.resolve(false);
				}else{
					defer.resolve(res);
				}
			}
		});
		return defer.promise;
	},
	sendVoice:function(openid,media_id){
		var defer = Q.defer();
		api.sendVoice(openid,media_id,function(err,res){
			if(err){
				defer.reject(err);
			}else{
				if(res.errcode !== 0){
					errMessage = res.errmsg;
					defer.resolve(false);
				}else{
					defer.resolve(res);
				}
			}
		});
		return defer.promise;
	},
	/**
	 * 客服消息，发送图文消息（点击跳转到外链）
	 * @param  {[type]} openid   
	 * @param  {[type]} articles 
	 * var articles = [
	 * {
	 * 	"title":"Happy Day",
	 *  "description":"Is Really A Happy Day",
	 *  "url":"URL",
	 *  "picurl":"PIC_URL"
	 * },
	 * ];
	 * @return {[type]}          
	 */
	sendNews:function(openid,articles){
		var defer = Q.defer();
		api.sendNews(openid,articles,function(err,res){
			if(err){
				defer.reject(err);
			}else{
				if(res.errcode !== 0){
					errMessage = res.errmsg;
					defer.resolve(false);
				}else{
					defer.resolve(res);
				}
			}
		});
		return defer.promise;
	},
	/**
	 * 客服消息，发送图文消息（点击跳转到图文消息页面）
	 * @param  {[type]} openid   [description]
	 * @param  {[type]} media_id [description]
	 * @return {[type]}          [description]
	 */
	sendMpNews:function(openid,media_id){
		var defer = Q.defer();
		api.sendMpNews(openid,media_id,function(err,res){
			if(err){
				defer.reject(err);
			}else{
				if(res.errcode !== 0){
					errMessage = res.errmsg;
					defer.resolve(false);
				}else{
					defer.resolve(res);
				}
			}
		});
		return defer.promise;
	},
	/**
	 * 创建临时二维码
	 * @param  {[type]} sceneId 场景ID
	 * @param  {[type]} expire  过期时间，单位秒。最大不超过604800（即7天）
	 * @return {[type]}         [description]
	 */
	createTmpQRCode:function(sceneId,expire){
		var defer = Q.defer();
		api.createTmpQRCode(sceneId,expire,function(err,res){
			if(err){
				defer.reject(err);
			}else{
				if(res.errcode){
					errMessage = res.errmsg;
					defer.resolve(false);
				}else{
					defer.resolve(res);
				}
			}
		});
		return defer.promise;
	},
	/**
	 * 创建永久二维码
	 * @param  {[Number,String]} sceneId 场景ID。数字ID不能大于100000，字符串ID长度限制为1到64
	 * @return {[type]}         [description]
	 */
	createLimitQRCode:function(sceneId){
		var defer = Q.defer();
		api.createLimitQRCode(sceneId,function(err,res){
			if(err){
				defer.reject(err);
			}else{
				if(res.errcode){
					errMessage = res.errmsg;
					defer.resolve(false);
				}else{
					defer.resolve(res);
				}
			}
		});
		return defer.promise;
	},
	/**
	 * 生成显示二维码的链接。微信扫描后，可立即进入场景
	 * @param  {[string]} titck 
	 * @return {[string]}  显示二维码的URL地址，通过img标签可以显示出来
	 */
	showQRCodeURL:function(titck){
		return api.showQRCodeURL(titck);
	},
	/**
	 * 发送模板消息
	 * 详细细节: http://mp.weixin.qq.com/wiki/17/304c1885ea66dbedf7dc170d84999a9d.html
	 * @param  {[type]} openid     [description]
	 * @param  {[type]} templateId [description]
	 * @param  {[type]} url        URL置空，则在发送后,点击模板消息会进入一个空白页面（ios）, 或无法点击（android）
	 * @param  {[type]} data       
	 * var data = {
	 * "first": {
	 * 		"value":"恭喜你购买成功！",
	 *   	"color":"#173177"
	 *  },
	 *  "keyword1":{
	 *  	"value":"巧克力",
	 *  	"color":"#173177"
	 *  }, 
	 * }
	 * @return {[type]}            [description]
	 */
	sendTemplate:function(openid,templateId,url,data){
		var defer = Q.defer();
		api.sendTemplate(openid,templateId,url,function(err,res){
			if(err){
				defer.reject(err);
			}else{
				if(res.errcode !== 0){
					errMessage = res.errmsg;
					defer.resolve(false);
				}else{
					defer.resolve(res);
				}
			}
		});
		return defer.promise;
	},
	/**
	 * 短网址服务
	 * 详细细节 http://mp.weixin.qq.com/wiki/10/165c9b15eddcfbd8699ac12b0bd89ae6.html
	 * @param  {[type]} url [description]
	 * @return {[type]}     [description]
	 */
	shorturl:function(url){
		var defer = Q.defer();
		api.shorturl(url,function(err,res){
			if(err){
				defer.reject(err);
			}else{
				if(res.errcode !== 0){
					errMessage = res.errmsg;
					defer.resolve(false);
				}else{
					defer.resolve(res);
				}
			}
		});
		return defer.promise;
	},
	/**
	 * 获取用户基本信息。可以设置lang，其中zh_CN 简体，zh_TW 繁体，en 英语。默认为en
	 * @param  {[type]} openid [description]
	 * @param  {[type]} lang   [description]
	 * @return {[type]}        [description]
	 */
	getUser:function(openid,lang){
		var defer = Q.defer();
		if(!lang){
			lang = 'zh_CN';
		}
		api.getUser({openid:openid, lang:lang}, function(err,res){
			if(err){
				defer.reject(err);
			}else{
				if(res.errcode){
					errMessage = res.errmsg;
					defer.resolve(false);
				}else{
					defer.resolve(res);
				}
			}
		});
		return defer.promise;
	}





};