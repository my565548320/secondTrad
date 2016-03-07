var Admin = {
	attributes:{
		username:{
			type:'string',
			required:true,
			unique: true
		},
		password:{
			type:'string',
			required:true,
			minLength: 5,
			columnName: 'encrypted_password'
		},
		created:{
			type:'datetime',
			required:true,
			defaultsTo: Date.now
		}

	},
	beforeCreate:function(values,next) {
		Utils.cryptPassword(values.password).then(function(res){
			values.password = res;
			next();
		},function(err){
			return next(err);
		});
	},
	beforeUpdate:function(values,next){
		Utils.cryptPassword(values.password).then(function(res){
			values.password = res;
			next();
		},function(err){
			return next(err);
		});
	}
};

module.exports = Admin;