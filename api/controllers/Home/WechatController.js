var wechat = require('wechat');
var wechatController ={
	index:wechat(Config.basketball.weixin_token,function(req,res,next){
		var message = req.weixin;
		console.log(message);
		res.reply([
      {
        title: '你来我家接我吧',
        description: '这是女神与高富帅之间的对话',
        picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
        url: 'http://nodeapi.cloudfoundry.com/'
      }
    ]);
	})
};
module.exports = wechatController;