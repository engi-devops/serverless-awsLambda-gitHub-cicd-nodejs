const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

    const UserItemSchema = new mongoose.Schema({
        email: {
            type: String,
            unique: true,
        },
        phone_number: {
            type: Number,
            // required: [true, "phone number is required"]
        },
        password: {
            type: String,
            // required: true
        },
        login_type: {
            type: String,
            default: '',
            // required: true
        },
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
