var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var dir = __dirname;
  var dirname = dir.replace('routes', 'pulic');
  res.sendfile(dirname + '/index.html');
});

module.exports = router;
