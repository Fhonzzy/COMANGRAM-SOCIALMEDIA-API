const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    user : {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    title : {
        type: String,
        max: 100
    },
    content : {
        type: String,
        max: 500
    },
    image : {
        type: String
    },
    likes : {
        type: Array,
        default: [],
    }
}, {timestamps: true})

module.exports = mongoose.model("Posts", PostSchema)