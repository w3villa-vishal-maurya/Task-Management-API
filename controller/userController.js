const User = require("../model/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../error");
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");
const logger = require("../logger/logger");
const env = require("dotenv").config();


async function regReq(req, res, next) {
    try {
        const { name, email, password, phoneNumber, role} = req.body;


        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).send(result.array());
        }


        // genSalt for hash-password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const user = await User.findOne({ email: email });

        if (user) {
            logger.error("Email already exists!!");
            throw new BadRequestError(
                "Email already exists!"
            );
        }

        // Create new user
        const newUser = await User.create(
            { name: name, email, email, password: hashPassword, phoneNumber: phoneNumber , role:role}
        );

        logger.info("User Successfully registered!! You can login!");
        return res.status(StatusCodes.CREATED).json({ message: "User Successfully registered!! You can login!" });
    }
    catch (error) {
        logger.error(error.message);
        return next(error);
    }
}


async function loginReq(req, res, next) {
    try {

        const { email, password } = req.body;
        const result = validationResult(req);
        
        if (!result.isEmpty()) {
            logger.error(`Form Validation Error Occured`);
            logger.error(result.array());
            return res.send(result.array());
        }

        const user = await User.findOne({ email: email });
        if (user) {
            const _id = user._id;
            const role = user.role;
            if (bcrypt.compareSync(password, user.password)) {
                const accessToken = jwt.sign({
                    _id, role
                }, process.env.SECRET_KEY, { expiresIn: 60 * 60 });

                // req.session.autherization = {
                //     accessToken, user
                // };

                return res.status(StatusCodes.OK).json({
                    "data": {
                        "accessToken": accessToken
                    },
                    message: "User Successfully logged In!!"
                });
            }
            else {
                throw new BadRequestError(
                    "Wrong Credentials!!!"
                );
            }
        }
        else {
            throw new UnauthenticatedError(
                "User is not Registered!"
            );
        }
    }
    catch (error) {
        logger.error(error.message);
        return next(error);
    }
}

function logOutReq(req, res, next) {
    if (req.session.autherization["accessToken"]) {
        req.session.autherization["accessToken"] = null;
        logger.info("User logged Out!");
        return res.status(200).json({ title: "Successful", message: "User logged Out!" });
    }
    else {
        logger.info("User is not loogged In, Login First");
        return res.status(StatusCodes.FORBIDDEN).json({ message: "User is not loogged In, Login First" });
    }
}


const sendResetPasswordMail = async (name, email, passResetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: process.env.HOST_EMAIL,
                pass: process.env.HOST_PASS
            }
        });

        // html: `<p> hi ${name}, Please copy the link <a href="http://127.0.0.1:3000/reset-password/${token}">Reset your password!</a>`
        // Change reset-password url for production level 
        const mailOptions = {
            from: "vishalprakash.maurya@w3villa.com",
            to: email,
            subject: "For Reset password",
            html: `<p> hi ${name}, Please copy the link <a href="https://task-management-api-t9qy.onrender.com/reset-password/${passResetToken}">Reset your password!</a>
             OR 
             If you are requesting from App then click here <a href="https://task-ui-green.vercel.app/reset-password/${passResetToken}">Reset your password!</a>
             `,
        }


        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return false;
            }

        })

        return true;
    }
    catch {
        (error) => {
            return false;
        }
    }
}


async function forgetPassword(req, res, next) {
    try {
        const email = req.body.email;
        const user = await User.find({ email: email });

        if (user.length > 0) {
            const passResetToken = randomstring.generate();
            const data = await User.updateOne({ email: email }, { $set: { passResetToken: passResetToken } });
            const isSendEmail = await sendResetPasswordMail(user[0].name, user[0].email, passResetToken);
            if (isSendEmail) {
                return res.status(201).json({ title: "Successful", message: "Please check your mail!!", "passResetToken": passResetToken });
            }
            else {
                throw new BadRequestError(
                    "Internal server error Occured!!"
                );
            }
        }
        else {
            throw new UnauthenticatedError(
                "User is not Registered!"
            );
        }
    }
    catch (error) {
        return next(error);
    }
}


async function resetPassword(req, res, next) {
    try {
        const passResetToken = req.params.token;
        const user = await User.find({ passResetToken: passResetToken });

        // 2a$10$rxcQ2WtyQkEC.HkponYqR.Q7P4yIGx5TGLVIEDfAc9qrVtlFb9gg2

        if (user.length > 0) {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(req.body.password, salt);

            const data = await User.updateOne({ passResetToken: passResetToken }, { $set: { password: hashPassword, passResetToken: null } });
            return res.status(StatusCodes.CREATED).json({ title: "Successful", message: "Password has been Successfully Updated!!" });
        }
        else {
            throw new BadRequestError(
                "Generated Token expired or invalid!"
            );
        }
    }
    catch (error) {
        return next(error);
    }
}




module.exports = {
    regReq,
    loginReq,
    logOutReq,
    forgetPassword,
    resetPassword
}