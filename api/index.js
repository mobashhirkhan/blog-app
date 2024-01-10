const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdawrfdewrf34r23d3ded';

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());

mongoose.connect('mongodb+srv://blog:3GIkEjgRjLEVSEvV@cluster0.yjctoyd.mongodb.net/?retryWrites=true&w=majority');

//app.use(cors());

app.post('/register', async(req, res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password:bcrypt.hashSync(password, salt),
        });
    } catch(e){
        res.status(400).json(e);
    }
});

app.post('/login', async(req, res) => {
    const {username, password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk){
        //logged in
        jwt.sign({username, id:userDoc._id}, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json('ok');
        });
    } else {
        // not logged in
        res.status(400).json('wrong credentials');
    }
});

app.listen(4000);
//mongodb+srv://blog:3GIkEjgRjLEVSEvV@cluster0.yjctoyd.mongodb.net/?retryWrites=true&w=majority
//3GIkEjgRjLEVSEvV