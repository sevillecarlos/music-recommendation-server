const router = require("express").Router();
const User = require("../models/User");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUpValidate = Joi.object({
  fullName: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(255).required(),
});

const signInValidate = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

//register
router.post("/signup", async (req, res) => {
  const { error } = signUpValidate.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    password: password,
  });

  const existEmail = await User.findOne({ email: req.body.email });

  if (existEmail) {
    return res.status(400).json({ error: "Email already exist" });
  }

  try {
    const newUser = await user.save();

    res.json({
      data: {
        email: newUser.email,
        fullName: newUser.fullName,
        msg: "Registration Completed Successfully",
      },
    });
  } catch (err) {
    res.status(400).json({ err });
  }
});

//login
router.post("/signin", async (req, res) => {
  const { error } = signInValidate.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "User don't exist" });

  const confirmPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!confirmPassword)
    return res.status(400).json({ error: "Incorrect password" });

  const jwtToken = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    process.env.TOKEN_SECRET
  );

  console.log();

  res.header("auth-token", jwtToken).json({
    data: {
      userEmail: user.email,
      userName: user.fullName,
      userID: user._id,
      jwtToken,
    },
  });
});

router.post("/get-user", async (req, res) => {
  const user = await User.findOne({ _id: req.body._id });
  console.log(user)
  try {
    res.json({
      email: user.email,
      name: user.fullName,
    });
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;
