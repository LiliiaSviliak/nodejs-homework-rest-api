const HTTP_CODS = require("../../helpers/httpCodes");

const { User } = require("../../models/users.schema");

const verify = async (req, res) => {
   
    const { verifyToken } = req.params;
    const user = await User.findOne({ verifyToken });
    if (!user) {
        return res.status(HTTP_CODS.NOT_FOUND)
            .json({
                message: "Not found"
            });
        }
        await User.findByIdAndUpdate(user._id, { verifyToken: null, verify: true });
    res.send("<h2>Confirmed email </h2>")
 
}

module.exports = verify;