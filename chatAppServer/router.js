const express = require('express');
const router = express.Router();

router.get('/', function(req,res){
    res.send("App is running");
})

module.exports = router;