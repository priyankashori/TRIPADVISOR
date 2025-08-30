const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
// const WrapAsync = require("./utils/WrapAsync.js");
// const { saveRedirectUrl } = require("../middleware.js");
const passport = require("passport");
const flash = require("connect-flash");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");


router.route("/signup")
    .get(userController.renderSignup)
    .post(WrapAsync(userController.signup))



router.route("/login")
    .get(userController.renderLogin)
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.SubmitLogin);




router.get("/logout", userController.logout);


module.exports = router;