require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const models = require("../models");
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
const tokenSecret = process.env.TOKEN_SECRET || "ljTZBnxfIXoELSH";
const authRepo = require("../repository/auth");

const requestLogin = async (req,res,next) => {
    let username = req.body.username;
    let password = req.body.password;

    if(typeof username !== "undefined" && typeof password !== "undefined" && username != "" && password != ""){
        try {
            const processLogin = await authRepo.checkLogin(username);
            if(processLogin.status === true){
                const passwordHash = processLogin.password;
                const match = await bcrypt.compare(password, passwordHash);
                if(match){
                    const data = {user_id:processLogin.user_id,name:processLogin.name,email:processLogin.email}
                    const getToken = generateAccessToken(data);

                    res.status(200).json({status:true,message:"login successfully",token:getToken});
                }else{
                    res.status(400).json({status:false,message:"wrong username or password"})
                }
            }else{
                res.status(400).json({status:false,message:"wrong username or password"})
            }
        } catch (error) {
            console.log("Error on login process");
            next(error);
        }
    }else{
        res.status(400).json({status:false,message:"username or password must be filled"})
    }
}

const generateAccessToken = (data) => {
    // 1h = 1 hours, 1d = 1 days
    return jwt.sign(data,tokenSecret, { expiresIn: '1d' });
}

const registerUsers = async (req,res,next) => {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;

    try {
        const dataUsers = {
            name:name,
            email:email,
            password:password,
        }

        const checkValid = checkValidasiUsers(dataUsers);
        if(checkValid){
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hashPassword) {
                    // Store hash in your password DB.
                    dataUsers.password = hashPassword;
                    models.User.create(dataUsers).then((result) => {
                        res.status(200).json({status:true,result,message:"register new users successfully"});
                    }).catch((error) => {
                        res.status(500).json({status:false,message:"register new users failed : " + error});
                    })
                });
            });
        }else{
            res.status(400).json({status:false,message:"all data must be filled"})
        }
    } catch (error) {
        console.log("Error on register new users");
        next(error);
    }
}

const checkValidasiUsers = (data) => {
    if(data.name !== "" && data.email !== "" && data.password !== ""){
        return true;
    }

    return false;
}

module.exports = {
    requestLogin,
    registerUsers
}
