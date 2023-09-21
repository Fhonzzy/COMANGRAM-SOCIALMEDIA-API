const Post = require("../Model/Post");

const createPost = async (req, res) => {
	const { userId } = req.user;
	try {
		const post = new Post({ user: userId, ...req.body });
		await post.save();
		res.status(200).json(post);
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const updatePost = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	try {
		const post = await Post.findOneAndUpdate(
			{ user: userId, _id: id },
			req.body,
			{ runValidators: true, new: true }
		);
		if (!post) {
			res.status(400).json({ msg: `Post with id:${id} not Found` });
		} else {
			res.status(200).json({ msg: "Post Updated Successfully", post });
		}
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const deletePost = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	try {
		const post = await Post.findOneAndDelete({ user: userId, _id: id });
		if (!post) {
			res.status(400).json({ msg: `Post with id:${id} not Found` });
		} else {
			res.status(200).json({ msg: "Post Deleted Successfully", post });
		}
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getAllPosts = async (req, res) => {
	try {
		const post = await Post.find().populate("user", ["username", "email"]);
		res.status(200).json({ AllPosts: post });
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getPosts = async (req, res) => {
	const { userId } = req.user;
	const { id } = req.params;
	try {
		const post = await Post.findOne({ user: userId, _id: id });
		if (!post) {
			res.status(400).json({ msg: `Post with id:${id} not Found` });
		} else {
			res.status(200).json(post);
		}
	} catch (error) {
		res.status(500).json(error.message);
	}
};

const getAllUserPosts = async (req, res) => {
    const {userId} = req.user

    try {
        const post = await Post.find({user: userId})
        res.status(200).json(post)
    } catch (error) {
        res.status(500).status(error.message)
    }
}

const likePost = async (req, res) => {
    const {userId} = req.user
    const {id} = req.params

    try {
        const post = await Post.findOne({_id:id})

        if(!post) {
            res.status(400).json({msg: `No post with id: ${id}`})
        }

        if(!post.likes.includes(userId)) {
            await post.updateOne({$push:{likes:userId}})
            res.status(200).json({msg:"Post has been liked"})
        } else {
            await post.updateOne({$pull:{likes:userId}})
            res.status(200).json({msg: "Post has been disliked"})
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
};



module.exports = {
	createPost,
	updatePost,
	deletePost,
	getAllPosts,
	getPosts,
    getAllUserPosts,
	likePost,
};
