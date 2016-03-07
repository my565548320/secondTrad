var AuthController ={
	'login':function(req,res,next) {
		return res.view('admin/auth/login');
	}
};
module.exports = AuthController;