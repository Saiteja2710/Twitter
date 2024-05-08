const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types;
const profileSchema = new mongoose.Schema({
    profileImg :{
        type: String,
        default:"https://unsplash.com/photos/man-in-white-and-black-pinstripe-suit-jacket-G-jo31ESuRE"
    },
    dateofbirth:{
        type:Date,
        required: [true]
    },
    Name :{
        type:String,
        required:[true]
    },
    author: {
        type: ObjectId,
        ref: "UserModel"
    }

})

mongoose.model("Profile",profileSchema);