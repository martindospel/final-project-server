require('dotenv').config();
const cors = require('cors')
const express = require('express');
const app = express();
const { studentRouter, teacherRouter, classRouter } = require('./routes');
const { OAuth2Client } = require('google-auth-library')

const googleClient = new OAuth2Client({ 
  clientId: process.env.CLIENT_ID, 
  clientSecret: process.env.SECRET_KEY,
})

googleClient.getTokenInfo("ya29.A0AVA9y1sbEbgxdoo0fBrLZG0cqCwFuWFnThNDEDzNzxLDWUjCz602H3t3BmWytTPOv-r_NTUI_HOPxdmys8I2Wf4LkWBFkkXGbHID_Z1LHjtxIwr2z3mCR_cSXikKZlaIUK-RyYUdGTjYfWDvk0kmUIUX1tE-qAYUNnWUtBVEFTQVRBU0ZRRTY1ZHI4SVkzV2Jjc0xXV2oyNXV0REJjeEM3Zw0165")
  .then(response => console.log(response))

app.use(express.json());
app.use(cors());

app.get('/', (_, res) => res.send('Server is listening...'));

app.use('/api/students', studentRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/classes', classRouter);

if (!module.parent) {
  app.listen(process.env.PORT || 4321, () => console.log('server running on port: ', process.env.PORT || 4321));
};

module.exports = app;
