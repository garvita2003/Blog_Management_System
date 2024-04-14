const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const config = require('../config/config');
const adminController = require('../controllers/adminController');

const sendResetPasswordEmail = async(name, email, token) => {
    try {
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587, // for TLS
            secure: false, // true for 465, false for other ports
            requireTLS: true,
            auth: {
                user: config.emailUser,
                pass: config.emailPassword
            }
        });

        const mailOptions = {
            from: config.emailUser,
            to: email,
            subject: 'Password Reset',
            html: `<p>Hi, `+name+`</p>
                  <p>Please click on the given link to reset your password <a href="https://127.0.0.1:3000/reset-password?token=${token}">Reset Password</a></p>
                  <p>This link is valid till 10 minutes from now</p>`
        }

        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error); 
            } else {
                console.log('Email has been send to:- ' + info.response);
            }
        });
    } 
    catch (error) {
        console.log(error.message);
    }
}

const loadLogin = async(req,res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if(passwordMatch)
            {
                req.session.user_id = userData._id;
                req.session.is_admin = userData.is_admin;
                if(userData.is_admin === 1){
                    res.redirect('/dashboard');
                }
                else{
                    res.render('/profile');
                }
            }
            else
            {
                res.render('login',{message: 'Password Incorrect'});
            }
        }
        else{
            res.render('login',{message:'Email or Password is incorrect'});
        }
    } catch (error) {
        console.log(error.message);
    }
}

const profile = async(req,res) => {
    try {
        res.render('Profile here');
    } catch (error) {
        console.log(error.message);
    }
}


const logout = async(req,res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
}


const forgotLoad = async(req,res)=>{
    try {
        res.render('forget-password');
    } catch (error) {
        console.log(error.message);
    }
}

const forgotPasswordVerify = async(req,res)=>{
   try {
      const email = req.body.email;
       const userData = await User.findOne({email:email});
       if(userData){
           const randomString = randomstring.generate();
           const updateData = await User.updateOne({email:email},{$set:{token:randomString}});
           sendResetPasswordEmail(userData.name,userData.email,randomString);
           res.render('forget-password',{message: 'Check your email to reset your password'});
        } 
        else{
            res.render('forget-password',{message: 'Email not registered'});
        }
    }
    catch (error) {
        console.log(error.message);
    }
        
}


const resetPasswordLoad = async(req,res)=>{
    try {
        const token = req.query.token;
        const tokenData = await User.findOne({token:token});
        if(tokenData){
            res.render('reset-password',{user_id:tokenData._id});
        }
        else{
            res.render('404');
        }
    } catch (error) {
        console.log(error.message);
    }   
}


const resetPassword = async(req,res)=>{
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;
        const securePassword = await adminController.securePassword(password);
        User.findByIdAndUpdate({_id:user_id},{$set:{password:securePassword,token:''}});
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
    
}

module.exports = {
    loadLogin, 
    verifyLogin, 
    profile,
    logout,
    forgotLoad,
    forgotPasswordVerify,
    resetPasswordLoad,
    resetPassword
 };