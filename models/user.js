// User Model:
// user: username, password & email.

// You're free to define your user how you like. Passport-local-mongoose will add a username, hash and 
// salt field to store the username, the hashed password and the salt value. Passport-mongoose-local
// will add some methods to your Schema.

const { required } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema ({
    email:
    {
        type: String,
        required:true,
    },
});
// as mentioned above, username and password needs not to be added in the userSchema, as it will be added
// with hashing and salting in the database.

userSchema.plugin(passportLocalMongoose); 
// now it will add username and password to our userSchema.
// passport automatically checks for, if the user is unique or not.

// Exporting it to be used in other files.
module.exports = mongoose.model("User", userSchema);