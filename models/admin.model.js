const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Exception = require('../utils/Exception');
const { sign } = require('jsonwebtoken');

const AdminSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: [
				true,
				'Username and password is required.'
			]
		},
		password: {
			type: String,
			required: [
				true,
				'Username and password is required.'
			]
		},
		refreshTokens: {
			type: Array,
			required: false,
		}
	},
	{
		collection: 'admin',
		timestamps: true
	}
);

AdminSchema.pre('save', function (next) {
	const user = this;
	if (!this.isModified('password')) return next();

	bcrypt.genSalt(10, function (err, salt) {
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) {
				return next(err);
			}
			user.password = hash;
			return next();
		});
	});
});


/**
 * Compare input password from the one in user account database.
 * @param {*} candidatePassword 
 * @param {*} callback 
 */
AdminSchema.methods.comparePassword = function (candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return callback(err);
		
		return callback(null, isMatch);
	});
};

/**
 * Removes the refresh token from the user account.	
 * @param {*} token 
 * @param {*} callback 
 */
AdminSchema.methods.removeRefreshToken = function (token, callback) {
	const user = this;	

	const findToken = new Promise((resolve) =>resolve(
		user.refreshTokens.includes(token)));
	const filteredTokens = new Promise((resolve) => resolve(
		user.refreshTokens.filter(t => t !== token)));
	
	Promise.all([findToken, filteredTokens])
		.then(([isFound, token]) => {
			if (!isFound) return callback(new Exception('Token not recognized.', 401));
			user.refreshTokens = token;
			user.save((err, user)=>{
				if(err) return callback(err);
				callback(null, user);
			});
		})
		.catch(err => {
			return callback(err);
		});
};

/**
 * Creates a new refresh token and adds it to the user account.
 * @param {*} res 
 * @param {*} callback 
 */
AdminSchema.methods.processRefreshToken = function (res, callback) {
	const user = this;
	const token = sign({id: user._id}, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: '7d'
	});

	user.refreshTokens.push(token);

	user.save()
		.then(() => {
			res.cookie('refresh_token', token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				path: '/refresh_token'	    
			});
			callback();
		})
		.catch(err => {
			callback(err);
		});
};

/**
 * Creates an access token and sends it to the client.
 */
AdminSchema.methods.generateAccessToken = function (res) {
	const user = this;
	const token = sign({id: user._id}, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: '1h'
	});
    res.status(200).send({
		success: true,
		access_token: token
	});
};

module.exports = mongoose.model('Admin', AdminSchema);
