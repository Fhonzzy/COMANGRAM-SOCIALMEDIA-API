const User = require("../Model/User");

const deleteAccount = async (req, res) => {
	const { userId } = req.user;

	try {
		// Find the user by ID
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found." });
		}

		// Delete the user (which will trigger the pre-remove middleware to delete profile and posts)
        await User.deleteOne({ _id: userId }); // Use deleteOne instead of remove

		res.status(200).json({ msg: "Account Deleted" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = deleteAccount