const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({

    Name:{
        type:String,
        required:[true]
    },
    profileImg :{
        type: String,
        default: "https://unsplash.com/photos/a-person-jumping-into-the-air-at-sunset-urBne08-lTQ"
        
    },
    dateofbirth:{
        type:Date,
        
    },
    username:{
        type:String,
        required:[true],
    },
    email:{
        type:String,
        required:[true]
    },
    location:{
        type:String,
        
    },
    password:{
        type:String,
        required:[true]
    },
    followers:{
        type:Array,
        defaultValue :[],
    },
    following :{
        type:Array,
        defaultValue:[],
    },
    author: {
        type: ObjectId,
        ref: "UserModel"
    }
},{timestamps:true})

mongoose.model("UserModel", userSchema)