const mongoose                   = require("mongoose");
const PassportLocalMongoose      = require("passport-local-mongoose")

const UserSchema = new mongoose.Schema(
    {
        username: {type: String, unique: true, required: true},
        password: String,
        email: {type: String, unique: true, required: true},
        resetPasswordToken: String,
        resetPasswordExpires: Date
    }
);

UserSchema.plugin(PassportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);