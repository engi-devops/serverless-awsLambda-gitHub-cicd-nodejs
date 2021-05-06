const express = require('express');
const userModel = require('../model/user.model');
const JwtTokenGenerator = require('../services/jwt-service');
const helper = require('../services/helper');

const routes = express.Router({
    mergeParams: true
});

routes.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: "Nodejs + serverless + awsLambda api call successfull."
    });
});



routes.post('/auth/register', async (req, res) => {
    try {
        let equalConditions = {};
        if (req.body.email) {
            equalConditions.email = {
                $regex: new RegExp(req.body.email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
            };
        } else {
            equalConditions.socialId = req.body.socialId;
        }

        userModel.findOne(equalConditions).then(async (user) => {
            if (user) {
                if (req.body.login_type == 'normal') {
                    if (user.login_type != req.body.login_type) {
                        return res.status(404).json({
                            success: false,
                            message: "user not found.",
                        });
                    } else {
                        // var data = user.toObject();
                        // delete data.password;
                            return res.status(409).json({
                                success: false,
                                message: "user already exists.",
                            });
                    }
                }
                if (req.body.login_type != 'normal' && user.login_type != 'normal') {
                    userModel
                        .findByIdAndUpdate(
                            user._id,
                            {
                                $set: {
                                    login_type: req.body.login_type,
                                },
                            },
                            {
                                new: true,
                            },
                        )
                        .then(async (user) => {
                            const token = await JwtTokenGenerator.createToken(
                                user._id,
                                user.email,
                                user.login_type,
                            );
                            var data = user.toObject();
                            delete data.password;

                            data.access_token = token;

                            return res.status(200).json({
                                success: true,
                                message: "Login successfully.",
                                data: helper.removenull(data)
                            });
                        })
                        .catch((err) => {
                            throw err;
                        });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: "Your credentials are unacceptable.",
                        errorInfo: err
                    });
                }
            } else {
                const user = new userModel(req.body);
                await user.save(async (error, user) => {
                    const token = await JwtTokenGenerator.createToken(user._id, user.email, user.login_type);
                    var data = user.toObject();
                    delete data.password;

                    data.access_token = token;

                    if (error) {
                        return res.status(400).json({
                            success: false,
                            message: "Bad Request.",
                            errorInfo: err
                        });
                    } else {
                        return res.status(200).json({
                            success: true,
                            message: "Nodejs + serverless + awsLambda user register&login api call successfull.",
                            data: helper.removenull(data)
                        });
                    }
                });
            }
        });
        
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Bad Request.",
                errorInfo: err
            });
        }
}); 

routes.post('/auth/login', async (req, res) => {
    try {
            let email = req.body.email;
            let condition = {
                email: {
                    $regex: new RegExp(email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
                },
            };
            userModel.findOne(condition).then(async (user) => {
                if (user) {
                    const token = await JwtTokenGenerator.createToken(user._id, user.email, user.login_type);
                    var data = user.toObject();
                    delete data.password;
                    data.access_token = token;

                    if (req.body.login_type != 'normal') {
                        return res.status(200).json({
                            success: true,
                            message: "Login successfully.",
                            data: helper.removenull(data)
                        });
                    } else {
                        user.comparePassword(req.body.password, async (err, match) => {
                            if (match === true) {
                                return res.status(200).json({
                                    success: true,
                                    message: "Login successfully.",
                                    data: helper.removenull(data)
                                });
                            } else {
                                return res.status(401).json({
                                    success: false,
                                    message: "Unauthorized access.",
                                    data: helper.removenull(data)
                                });
                            }
                        });
                    }
                } else {
                    return res.status(404).json({
                        success: false,
                        message: "User not found.",
                    });
                }
            }).catch((err) => {
                return res.status(400).json({
                    success: false,
                    message: "Bad Request.",
                    errorInfo: err
                });
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Bad Request.",
                errorInfo: err
            });
        }
})

module.exports = {
    routes,
};