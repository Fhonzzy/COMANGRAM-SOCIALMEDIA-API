const User = require("../Model/User");
const register = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		const user = await User.create({ username, email, password });
		res.status(201).json(user);
	} catch (err) {
		console.log(err.message);
	}
};

const login = async (req, res) => {
	try {
		const { username, password } = req.body;

		const user = await User.findOne({ username });

		if (!user) {
			return res.status(400).json("User Not Found");
		}

		const checkPassword = await user.comparePasswords(password);

		if (!checkPassword) {
			return res.status(400).json("Password Is Wrong");
		}

		const token = user.createJWT();

		res.status(200).json({ user: user, token: token });
	} catch (error) {
		res.status(500).json(error.message);
	}
};

module.exports = {
	register,
	login,
};
