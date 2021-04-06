const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

    const UserItemSchema = new mongoose.Schema({
        name: {
            type: String,
            trim: true,
            required: [true, "name is required."]
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, "E-mail is required."],
            index: {
                uniqe : true
            },
            minlength: [6, "Email can't be shorter than 6 characters."],
            maxlength: [64, "Email can't be longer than 64 characters."],
        },
        phone_number: {
            type: Number,
            required: [true, "phone number is required"]
        },
        password: {
            type: String,
            required: [true, "password is required."]
        }
    }, {
        timestamps : true       
    });

    UserItemSchema.path('email').validate(async email => {
        const emailCount = await mongoose.models.user.countDocuments({
            email
        })
        return !emailCount;

    }, "E-mail already exists.");

    UserItemSchema.pre('save', function (next) {
        if (!this.isModified('password')) return next();
        bcrypt.hash(this.password, SALT_ROUNDS, (err, hash) => {
            if (err) return next(err);
            this.password = hash
            next();
        })
    })

const userModel = mongoose.model('user', UserItemSchema);

module.exports = userModel;
