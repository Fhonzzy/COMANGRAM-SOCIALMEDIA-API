const mongoose = require("mongoose");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Profile = require('./Profile')
const Post = require('./Post')

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			require: [true, "Please Provide Username"],
			minlength: 3,
			maxlength: 30,
			unique: true,
		},
		email: {
			type: String,
			required: [true, "Please Provide Email"],
			maxlength: 50,
			unique: true,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				"Please Provide A Valid Email",
			],
		},
		password: {
			type: String,
			required: [true, "Please Provide Password"],
			minlength: 8,
		},
		
	},
	{ timestamps: true }
);

UserSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

UserSchema.pre('remove', async function (next) {
	try {
	  await Profile.deleteOne({ user: this._id }); // Delete associated profile
	  await Post.deleteMany({ user: this._id }); // Delete associated posts
	  next();
	} catch (error) {
	  next(error);
	}
  });

UserSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id, username:this.username}, process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePasswords = async function(userPassword) {
	const isMatch = await bcrypt.compare(userPassword, this.password)
	return isMatch
}

			

module.exports = mongoose.model("User", UserSchema);
