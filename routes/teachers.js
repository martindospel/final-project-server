const { Teacher } = require("../db");
const express = require("express");
const router = express.Router();

const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.SECRET_KEY,
});

// googleClient.getTokenInfo("ya29.A0AVA9y1sbEbgxdoo0fBrLZG0cqCwFuWFnThNDEDzNzxLDWUjCz602H3t3BmWytTPOv-r_NTUI_HOPxdmys8I2Wf4LkWBFkkXGbHID_Z1LHjtxIwr2z3mCR_cSXikKZlaIUK-RyYUdGTjYfWDvk0kmUIUX1tE-qAYUNnWUtBVEFTQVRBU0ZRRTY1ZHI4SVkzV2Jjc0xXV2oyNXV0REJjeEM3Zw0165")
//   .then(response => console.log(response.em))

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
