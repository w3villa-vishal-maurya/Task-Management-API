const User = require("../model/user");
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


async function regReq(req, res) {
    try {
        const { name, email, password, phoneNumber } = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.send(result.array());
        }

        console.log(req.body);
        const user = await User.find(req.body);

        if (!user.length == 0) {
            return res.status(404).json({ message: "User already exists!!!" });
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = await User.create(
            { name: name, email, email, password: hashPassword, phoneNumber: phoneNumber }
        );

        return res.status(200).json({ message: "User Successfully registered!! You can login!" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


async function loginReq(req, res) {
    try {
        const { email, password } = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.send(result.array());
        }

        const user = await User.find({ email: email });

        if (user.length > 0) {
            if (bcrypt.compareSync(password, user[0].password)) {
                const accessToken = jwt.sign({
                    data: email
                }, 'secret', { expiresIn: 60 * 60 });

                req.session.autherization = {
                    accessToken, email
                };
                return res.status(200).json({ message: "User Successfully logged In!!" });
            }
            else {
                throw new Error("Wrong Credentials!!!");
            }
        }
        else {
            throw new Error("User is not Registered!");
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

function logOutReq(req, res){
    if(req.session.autherization["accessToken"]){
        req.session.autherization["accessToken"] = null;
        return res.status(200).json({title:"Successful", message:"User logged Out!"});
    }
    else{
        return res.status(403).json({message : "User is not loogged In, Login First"});
    }
}

module.exports = {
    regReq,
    loginReq,
    logOutReq
}