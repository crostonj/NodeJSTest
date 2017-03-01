var express = require('express');
var dataRouter = express.Router();
var graphql = require("graphql");
var GrapQLHTTP = require('express-graphql');


  
var router = function (nav) {
    dataRouter.route('/data')
        .get(function(req, res){
        
    });
};

module.exports = router;