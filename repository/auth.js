const { QueryTypes } = require('sequelize');
const db = require("../models");

const checkLogin = async (username,password) => {
    let usernameFinal = "'"+username+"'";

    try {
        const processLogin = await db.sequelize.query('SELECT id,name,email,password FROM "Users" WHERE email='+usernameFinal,{type: QueryTypes.SELECT}).then((res) => {
            if(res.length > 0){
                return {
                    status:true,
                    user_id:res[0].id,
                    name:res[0].name,
                    email:res[0].email,
                    password:res[0].password
                };
            }else{
                return {
                    status:false
                }
            }
        }).catch((err) => {
            return {
                status:false
            }
        });

        return processLogin;
    } catch (error) {
        console.log("Error on [repository-auth] #check login : "+error);
        return {
            status:false
        }
    }
}

module.exports = {
    checkLogin
}
