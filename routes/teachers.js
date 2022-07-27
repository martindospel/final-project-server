const { Teacher } = require("../db");
const express = require("express");
const router = express.Router();

const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.SECRET_KEY,
});

// login one teacher
router.post("/login/:access_token", async (req, res) => {
  try {
    const response = await googleClient.getTokenInfo(req.params.access_token);
    const teacher = await Teacher.findOne({ email: response.email });
    if (!teacher) throw Error("No teacher found");
    res.send(teacher);
  } catch (error) {
    res.sendStatus(404);
  }
});

// signup one teacher
router.post("/signup/:access_token", async (req, res) => {
  try {
    const response = await googleClient.getTokenInfo(req.params.access_token);
    const teacher = await Teacher.create({
      teacherName: req.body.fullName,
      email: response.email,
    });
    res.send(teacher);
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
