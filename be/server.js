const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { MONGOBD_URL } = require('./config');
const cors = require('cors');

mongoose.connect(MONGOBD_URL);

mongoose.connection.on('connected', () => {
 console.log("DB Connected");
});

mongoose.connection.on('error', () => {
 console.log("Error");
});

require('./models/user_model');
require('./models/tweet_model');
require('./models/profile_model');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(require('./routes/user_route'));
app.use(require('./routes/tweet_route'));
app.use(require('./routes/file_route'));
app.listen(5000, () => {
 console.log("Server started....:)");
});
