const user = require("../models/users");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

//user sign up
router.post("/register", async (req, res) => {
  try {
    //user existance
    const user = await user.findOne({ email: req.body.email });
    if (user) {
      return res.send({
        success: false,
        message: "user already registered to sway",
      });
    }
    // registering the user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = new user(req.body);
    await newUser.save();
    res.send({
      sucess: true,
      message: "welcome to sway",
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

// user login

router.post("/login", async (req, res) => {
  try {
    const user = await user.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "you are not registered",
      });
    }
    //password authentication, if password is wrong/right
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.send({
        message: "invalid password",
        success: false,
      });
    }
    //create and assign a JWT token

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({
      message: error.message,
      success: false,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
