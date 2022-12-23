// backend/routes/index.js
const express = require('express');
const router = express.Router();

const apiRouter = require('./api');

router.get("/", (req, res) => {
  res.status(200).json({
    message: "WOOOOO MY SERVER IS RUNNING!",
    statusCode: res.statusCode
  })
})

router.use('/api', apiRouter);

// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });

module.exports = router;
