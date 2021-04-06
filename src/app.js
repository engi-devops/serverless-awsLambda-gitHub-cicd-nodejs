const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { MONGO_CONNECTION_STRING } = require('./config/DB');
const mongoose = require('mongoose');
mongoose.connect(MONGO_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function() {
            console.log(`we are connected!`);    
        });

const {
    routes: indexRouter,
} = require('./routes');

const app = express();

app.use(cors({ exposedHeaders: ['X-Token', 'X-Powered-By'] }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb',}),)
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, }),)

app.use('/api/v1/', indexRouter);
    
module.exports = app;