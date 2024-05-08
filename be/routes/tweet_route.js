const express = require('express')
const mongoose = require('mongoose')
const router = express.Router();
const Tweet = mongoose.model("Tweet");
const UserModel = mongoose.model("UserModel")
const protectedRoute = require('../middleware/protectedResource');
router.post('/tweet', protectedRoute, (req, res) => {
    const { tweetMessage, tweetImage } = req.body;
    if (!tweetMessage) {
        return res.status(400).json({ message: "Tweet message is required" });
    }

    const tweetObj = new Tweet({
        content: tweetMessage,
        Image: tweetImage,
        author: req.user._id, // Assuming req.user contains user information
    });

    tweetObj.save()
        .then((newTweet) => {
            res.status(201).json({ tweet: newTweet });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        });
});


router.delete('/deletetweet/:id', protectedRoute, (req, res) => {
    const tweetId = req.params.id;

    Tweet.findOne({ _id: tweetId })
        .then((tweet) => {
            if (!tweet) {
                return res.status(404).json({ message: 'Tweet not found' });
            }

            // Check if the authenticated user is the author of the tweet
            if (tweet.author.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Delete the tweet
            Tweet.deleteOne({ _id: tweetId })
                .then(() => {
                    res.status(200).json({ message: 'Deleted Successfully', deletedTweet: tweet });
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

router.get('/tweets',protectedRoute,(req, res) => {
    Tweet.find({})
        .then((data) => {
            if (!data)
                res.status(200).json({ "Message": "Not Data found" })
            res.status(201).json({ data })
        })
        .catch((error) => {
            res.status(400).json({ "Message": "Interal server error" })
        })
})
router.get('/mytweets', protectedRoute, (req, res) => {
    Tweet.find({ author: req.user._id })
        .then((data) => {
            if (!data || data.length === 0) {
                // No data found
                return res.status(201).json({ message: "No data found" });
            }
            
            // Data found
            res.status(200).json(data);
        })
        .catch((error) => {
            // Internal server error
            console.error("Error fetching tweets:", error);
            res.status(500).json({ message: "Internal server error" });
        });
});

router.put('/profile', protectedRoute, (req, res) => {
    const { profileImg, Name,username } = req.body;

    if (!profileImg || !Name || !username) {
        return res.status(400).json({ message: "One or more fields are mandatory" });
    }

    UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $set: { Name: req.body.Name,username:req.body.username,  profileImg: req.body.profileImg }
        },
        { new: true } // This option returns the updated document
    )
        
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(400).json({ message: "Action can't be done" });
            }
            res.status(200).json({ message: "Updated Successfully", updatedUser });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({ error: "Internal Server Error" });
        });
}
);

router.put('/like', protectedRoute, (req, res) => {
    const tweetId = req.body.id;

    // Construct a query to find the tweet by its ID
    const query = { _id: tweetId };

    Tweet.findOneAndUpdate(
        query,
        { $push: { likes: req.user.id } },
        { new: true }
    )
        .then((result) => {
            res.json({ result });
        })
        .catch((error) => {
            console.error(error);
            res.status(400).json({ msg: "Error" });
        });
});

router.put('/unlike', protectedRoute, (req, res) => {
    const tweetId = req.body.id;

    // Construct a query to find the tweet by its ID
    const query = { _id: tweetId };

    Tweet.findOneAndUpdate(
        query,
        { $pull: { likes: req.user.id } },
        { new: true }
    )
        .then((result) => {
            res.json({ result });
        })
        .catch((error) => {
            console.error(error);
            res.status(400).json({ msg: "Error" });
        });
});

router.put('/comment', protectedRoute, (req, res) => {
    const comment = { commentText: req.body.commentText, commentedBy: req.user._id }
    const tweetId = req.body.id;

    // Use findByIdAndUpdate and provide the tweetId directly as the first argument
    Tweet.findByIdAndUpdate(tweetId, {
        $push: { comments: comment }
    }, { new: true })
    .populate("comments.commentedBy", "_id Name") //comment owner
        .populate("author", "_id Name")// post owner
  
        .then((result) => {
            res.json({ result });
        })
        .catch((error) => {
            console.error(error);
            res.status(400).json({ msg: "Error" });
        });
});

router.put('/retweet',protectedRoute,(req,res)=>{
    const tweetId = req.body.id;

    // Construct a query to find the tweet by its ID
    const query = { _id: tweetId };

    Tweet.findOneAndUpdate(
        query,
        { $push: { Retweetedby: req.user.id } },
        { new: true }
    )
        .then((result) => {
            res.json({ result });
        })
        .catch((error) => {
            console.error(error);
            res.status(400).json({ msg: "Error" });
        });

})

router.put('/follow', protectedRoute, (req, res) => {
    const tweetId = req.body.id;

    // Construct a query to find the tweet by its ID
    const query = { _id: tweetId };

    Tweet.findOneAndUpdate(
        query,
        { $pull: { followers: req.user.id } },
        { new: true }
    )
        .then((result) => {
            res.json({ result });
        })
        .catch((error) => {
            console.error(error);
            res.status(400).json({ msg: "Error" });
        });
});





module.exports = router;