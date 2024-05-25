const { PrismaClient } = require("@prisma/client");
const { validateEmail, validatePassword } = require("../utils/validators");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const domain = process.env.DOMAIN;
const jwtSecret = process.env.JWT_SECRET;

const prisma = new PrismaClient();
const saltRounds = 10;

const registerHandler = async (req, res) => {
  const { name, email, password } = req.body;
  if (
    !name ||
    !email ||
    !password ||
    name.trim() == "" ||
    email.trim() == "" ||
    password.trim() == ""
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
      data: null,
    });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
      data: null,
    });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({
      success: false,
      message:
        "The password must contain 8 letters, with 1 symbol, 1 lower case character, 1 upper case character, and 1 number",
      data: null,
    });
  }
  const existingUser = await prisma.user.findFirst({ where: { email } });
  if (existingUser) {
    return res.status(403).json({
      success: false,
      message: "A user with this email already exists",
      data: null,
    });
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  var user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });
  user.password = undefined;
  const token = jwt.sign({ name, email, id: user.id }, jwtSecret);
  const url = `${domain}/auth/verify?token=${token}`;
  await sendEmail(
    email,
    "Verify",
    `<h1>Please verify</h1>
Please verify your account on API Gateway by clicking on this <a href="${url}">link</a>.
Alternatively, you can visit this URL: ${url}`
  );
  res.json({
    success: true,
    message:
      "Registered succesfully, please check your email inbox for verification",
    data: user,
  });
};

const verifyHandler = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).send("This URL is invalid");
  }
  var jwtUser;
  try {
    jwtUser = jwt.verify(token, jwtSecret);
  } catch (e) {
    return res.status(500).send("There was an error in verifying your account");
  }
  if (!jwtUser) {
    res.status(500).send("There was an error in verifying your account");
  }
  try {
    await prisma.user.update({
      where: { id: jwtUser.id, email: jwtUser.email },
      data: { isVerified: true },
    });
  } catch (e) {
    res.status(500).send("There was an error in verifying your account");
  }
  res.send(
    `Your account has been verified succesfully. Click <a href="${domain}">here</a> to go to API Gateway`
  );
};

const loginHandler = async (req, res) => {
  const { email, password } = req.body;
  
};

module.exports = {
  registerHandler,
  verifyHandler,
  loginHandler,
};