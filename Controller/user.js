const Profile = require("../Model/Profile");

const createProfile = async (req, res) => {
	const { userId } = req.user;
	const { profilePicture, coverPicture, desc, city, from, relationship } =
		req.body;

	try {
		// If a profile already exists for the user
		const existingProfile = await Profile.findOne({ user: userId });

		if (existingProfile) {
			return res
				.status(400)
				.json({ message: "Profile already exists for this user." });
		}

		// Create new profile with the user's ID
		const newProfile = await Profile.create({ user: userId, ...req.body });

		res
			.status(201)
			.json({ message: "Profile created successfully.", Profile: newProfile });
	} catch (error) {
		console.error("Error creating profile:", error);
		res.status(500).json({ message: "Internal server error." });
	}
};

const updateProfile = async (req, res) => {
	try {
        const { userId } = req.user;
	const { profilePicture, coverPicture, desc, city, from, relationship } =
		req.body;

	const existingProfile = await Profile.findOne({ user: userId });

	if (!existingProfile) {
		res.status(404).json("User Doesn't exist");
	}

    existingProfile.profilePicture = profilePicture || existingProfile.profilePicture
    existingProfile.coverPicture = coverPicture || existingProfile.coverPicture
    existingProfile.desc = desc || existingProfile.desc
    existingProfile.city = city || existingProfile.city
    existingProfile.from = from || existingProfile.from
    existingProfile.relationship = relationship || existingProfile.relationship

    await existingProfile.save()
    res.status(200).json({ message: 'Profile updated successfully.', updatedProfile: existingProfile });

    } catch (error) {
        res.status(500).json({msg:error.message})
    }
};

const getUser = async (req, res) => {
    const {userId} = req.user
    try {
        const userProfile = await Profile.findOne({user:userId}).populate('user', ['username', 'email'])
        if(!userProfile) {
            res.status(400).json("User dosen't exist")
        }
        res.status(200).json(userProfile)
    } catch (error) {
        res.status(500).json(error.message)
    }
};

const followUser = async (req, res) => {
    const {userId} = req.user
    const {id} = req.params

    if (userId !== id) {
        try {
            const user = await Profile.findOne({user:id})
            const currentUser = await Profile.findOne({user:userId})
            if(!user.followers.includes(userId)) {
                await user.updateOne({$push:{followers:userId}})
                await currentUser.updateOne({$push:{following:id}})
                res.status(200).json("User followed")
            } else {
                res.status(403).json("You already follow this user")
            }
        } catch (error) {
            res.status(500).json(error.message)
        }
    } else {
        res.status(403).json("You can't follow yourself")
    }
};

const unFollowUser = async (req, res) => {
    const {userId} = req.user
    const {id} = req.params

    if (userId !== id) {
        try {
            const user = await Profile.findOne({user:id})
            const currentUser = await Profile.findOne({user:userId})
            if(user.followers.includes(userId)) {
                await user.updateOne({$pull:{followers:userId}})
                await currentUser.updateOne({$pull:{following:id}})
                res.status(200).json("User unfollowed")
            } else {
                res.status(403).json("You already follow this user")
            }
        } catch (error) {
            res.status(500).json(error.message)
        }
    } else {
        res.status(403).json("You can't unfollow yourself")
    }
};

module.exports = {
	updateProfile,
	getUser,
	followUser,
	unFollowUser,
	createProfile,
};
