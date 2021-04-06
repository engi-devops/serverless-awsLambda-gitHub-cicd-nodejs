const express = require('express');
const userModel = require('../model/user.model');

const routes = express.Router({
    mergeParams: true
});

const errorFormatter = e => {
    let errors = {};
    const allErrors = e.substring(e.indexOf(':') + 1).trim();
    const allErrorsInArrayFormate = allErrors.split(',').map(err.trim());
    allErrorsInArrayFormate.forEach(error => {
        const [key, value] = error.split(':').map(err => err.trim());
        errors[key] = value;
    });
    return errors
}

routes.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        messeage: "Nodejs + serverless + awsLambda api call successfull."
    });
});



routes.post('/register', async (req, res) => {
    try {
        const user = new userModel(req.body);
        await user.save()
          .then(userItem =>
            res.status(200).json({
                success: true,
                messeage: "Nodejs + serverless + awsLambda user register api call successfull.",
                data: userItem
            })
        ).catch(err =>
            res.status(500).json({
                success: false,
                messeage: "Could not register the user.",
                errorInfo: err
            })
        );
    } catch (err) {
        return res.status(400).json({
            success: false,
            messeage: "Bad Request.",
            errorInfo: err
        });
    }

});


module.exports = {
    routes,
};