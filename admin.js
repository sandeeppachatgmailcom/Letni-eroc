const express = require('express');
const session = require('express-session');
const MemoryStore = require('express-session').MemoryStore;
const mongodb = require('./model/mongoose');
const cookieParser = require('cookie-parser');  
const mainroot = require('./router/mainrout');  
const swal = require ('sweetalert');
const morgan = require('morgan');
const app = express();
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(morgan("dev"))
app.use(
    session({
        secret: 'YourSecureSecretKey', // Use a strong and secure secret key
        resave: false,
        saveUninitialized: true,
        store: new MemoryStore(),
    })
);
app.use(express.static('asset'));
app.use(express.urlencoded({ extended: true })) // Correct typo 'extend' to 'extended'
app.use(express.json());
app.use('/', mainroot);
app.listen(5000, () => {
    mongodb.db;
    console.log('Server started at port 5000');
});
