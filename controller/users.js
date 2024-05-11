const User = require("../models/users");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup");
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
};

module.exports.signUp = async (req, res,next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser,(err) =>{
            if(err){
                return next(err);
            }
            req.flash("success", "User Registered Successfully!");
            res.redirect("/listings");
        });
      
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signUp");
    }

};

module.exports.logInSuccess = async (req, res) => {
    req.flash("success","Welcome back to Airbnb!");
    let redirectUrll = res.locals.rurl || "/listings";
    res.redirect(redirectUrll);
};

module.exports.logOut = (req,res,next) => {
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","you are logged Out!");
        res.redirect("/listings");
    });
};