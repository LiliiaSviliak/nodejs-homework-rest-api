const bcrypt = require("bcryptjs");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const { v4 } = require('uuid');

const {sendMail} =require('../../utils')
const HTTP_CODS = require("../../helpers/httpCodes");
const { User } = require("../../models");
const avatarDir = path.join (__dirname, "../../", "public/avatars");


const signup= async(req, res ) => {
    const {email, password} = req.body;
    const verifyToken = v4();
    const defaultAvatar = gravatar.url({email}, { s: 250 }, true);
    const user = await User.findOne({email});
    if (user) {
        return res.status(HTTP_CODS.CONFLICT)
            .json({
                status: "error",
                message: "Already registered"
        })
        
    }

    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const result = await User.create({email, avatar:`https:${defaultAvatar}`, password: hashPassword, verifyToken});
    const id = result._id.toString();
    const dirPath = path.join(avatarDir, id);
    await fs.mkdir(dirPath)

    const data = {
        to: email ,
        subject: "Confirm email",
        html:` <a href="http://localhost:3000/api/users/verify/${verifyToken}">Confirm email</a>`
        }
        await sendMail(data)

    res.status(HTTP_CODS.CREATED)
    .json({
        status: "success",
        code: 201,
        message: "Successfully registered"
    })
};

module.exports = signup;