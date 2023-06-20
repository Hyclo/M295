var express = require('express');
var router = express.Router();
const {resolve} = require('path');

const absolutePath = resolve('./public/files/swagger-output.json');

/* GET home page. */
router.get('/', function (req, res, next) {
   res.render('index', { title: 'Express' });
});

router.get('/swagger', function(req,res, next) {
   res.sendFile(absolutePath)
});



module.exports = router;