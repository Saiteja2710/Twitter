const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const TweetSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Content is required'],
    },
    author: {
        type: ObjectId,
        ref: "UserModel"
    },
    likes: {
        type: Array,
        default: [],
    },
    tweetedby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel"
    },
    Retweetedby: {
        type: Array,
        default: [],
    },
    Image: {
        type: String,
        default:""
    },
    comments: [
        {
            commentText: String,
            commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" }
        }
    ]
}, { timestamps: true });

mongoose.model('Tweet', TweetSchema);
