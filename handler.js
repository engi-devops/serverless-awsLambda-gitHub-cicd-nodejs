'use strict';

module.exports.generateRandomNumber = event => {
  const randomNumber = parseInt(Math.random() * 100);
    console.log("The random generated integer is-: ", randomNumber);
  return randomNumber;
};

const awsServerlessExpress = require('aws-serverless-express');
const setupapplication = require('./src/app');

const server = awsServerlessExpress.createServer(setupapplication);

exports.handler = (event, context) => {
  return awsServerlessExpress.proxy(server, event, context);
}