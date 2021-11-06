const { NotFound } = require('http-errors');
const sgMail = require("@sendgrid/mail");

const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);

const sendMail = async (data) => {
    try {
        const mail = { ...data, from: "liliia.belei@gmail.com"};
        await sgMail.send(mail);
        return true;
    } catch (error) {
        throw new  NotFound(error.message)
    }
    
}

module.exports = sendMail;