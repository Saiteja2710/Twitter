const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');
const UserModel = mongoose.model("UserModel");
const { JWT_SECRET } = require('../config');
router.post("/signup", (req, res) => {
  const { Name, username, email, password } = req.body;
  if (!Name || !username || !email || !password) {
     return res.status(400).json({ error: "one or more fields are mandatory" });
  }
  UserModel.find({ email: email })
     .then((userInDB) => {
       if (userInDB.length > 0) {
         return res.status(500).json({ error: "User already exists please Login" });
       }
       bcryptjs.hash(password, 16)
         .then((hashedPassword) => {
           const user = new UserModel({ Name, username, email, password: hashedPassword,author:req.user });
           user.save()
             .then((newUser) => {
               res.status(201).json({ result: newUser });
             })
             .catch((error) => {
               console.log(error);
             });
         })
         .catch((err) => {
           console.log(err);
         });
     })
     .catch((err) => {
       console.log(err);
     });
 });


router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return res.status(400).json({ error: "One or more mandatory fields are empty" });
  }
  UserModel.findOne({ email: email })
    .then((userInDB) => {
      if (!userInDB) {
        return res.status(401).json({ error: "Please SignUp You don't have account" });
      }
      bcryptjs.compare(password, userInDB.password)
        .then((didMatch) => {
          if (didMatch) {
            const jwtToken = jwt.sign({ _id: userInDB._id }, JWT_SECRET);
            const userInfo = {"id":userInDB._id, "Name": userInDB.Name,"username":userInDB.username,"profileImg":userInDB.profileImg };
            res.status(200).json({ result: { token: jwtToken, user: userInfo } });
          } else {
            return res.status(401).json({ error: "Invalid Credentials" });
          }
        }).catch((err) => {
          console.log(err);
        })
    })
    .catch((err) => {
      console.log(err);
    })
});

router.get('/author',(req,res)=>{
  UserModel.find({author:req.body.id})
    .then((data)=>{
      if(!data){
        return res.status(201).json({ message: "No data found" });
      }
      res.status(200).json(data);
    })
    .catch((error) => {
      // Internal server error
      console.error("Error fetching tweets:", error);
      res.status(500).json({ message: "Internal server error" });
  });
})



module.exports = router;