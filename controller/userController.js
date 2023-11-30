const User = require("../model/User");
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const logger = require("../logger/logger");


async function regReq(req, res) {
    try {
        const { name, email, password, phoneNumber } = req.body;
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.send(result.array());
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const user = await User.find( { email: email});
        console.log(user);

        if (!user.length == 0) {
            logger.error("User already exists!!");
            return res.status(404).json({ message: "User already exists!!!" });
        }

        const newUser = await User.create(
            { name: name, email, email, password: hashPassword, phoneNumber: phoneNumber }
        );

        logger.info("User Successfully registered!! You can login!");
        return res.status(200).json({ message: "User Successfully registered!! You can login!" });
    }
    catch (error) {
        logger.error(error.message);
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

        const user = await User.findOne({ email: email });
        if (user) {
            if (bcrypt.compareSync(password, user.password)) {
                const accessToken = jwt.sign({
                    _id: user._id
                }, 'secret', { expiresIn: 60 * 60 });

                req.session.autherization = {
                    accessToken, user
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

function logOutReq(req, res) {
    if (req.session.autherization["accessToken"]) {
        req.session.autherization["accessToken"] = null;
        return res.status(200).json({ title: "Successful", message: "User logged Out!" });
    }
    else {
        return res.status(403).json({ message: "User is not loogged In, Login First" });
    }
}


const sendResetPasswordMail = async(name, email, token)=>{
    try{
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS : true,
            auth: {
              // TODO: replace `user` and `pass` values from <https://forwardemail.net>
              user: 'vishalprakash0202@gmail.com',
              pass: '9682043049@'
            }
          });


          const mailOptions = {
            from: "vishalprakash0202@gmail.com",
            to: email,
            subject: "For Reset password",
            html: `<p> hi ${name}, Please copy the link <a href="http://127:0.0.1:3000/reset-password?token=${token}">Reset your password!</a>`
          }

          console.log("reach here");

          transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                console.log(err.message);
            }
            else{
                console.log("eMail has been sent:- ", info.response);
            }
          })
    }
    catch{
        (error)=>{
            res.status(400).send({message: error.message});
        }
    }
}


async function forgetPassword(req, res) {
    try {
        const email = req.body.email;
        console.log(email);
        const user = await User.find({ email: email });

        if (user.length > 0) {
            const token = randomstring.generate();
            const data = await User.updateOne({ email: email }, { $set: { token: token } });
            console.log("hello here...");
            await sendResetPasswordMail(user[0].name, user[0].email, token);
            return res.status(200).json({ title: "Successful", message: "Please check your mail!!" });
        }
        else {
            throw new Error("User is not found!");
        }
    }
    catch (error) {
        return res.status(400).json({ title: "Unsuccessful", message: error.message });
    }
}




module.exports = {
    regReq,
    loginReq,
    logOutReq,
    forgetPassword
}