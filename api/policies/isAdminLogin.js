var isAdminLogin = function(req,res,next){
	if(req.session.userInfo){
		return next();
	}
	return res.redirect('/admin/auth/login.html');
};
module.exports = isAdminLogin;