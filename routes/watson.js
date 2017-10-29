var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/isLoggedIn');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
var instance;
var { User, Text } = require('../models/user');

//MAKE SURE TO REPLACE THE USERNAME AND PASSWORD WITH ENVIRONMENT VARIABLES
var tone_analyzer = new ToneAnalyzerV3({
  username: 'a32ea9d2-b998-443b-87b7-6aef61ba95d3',
  password: 'A2gBtjiGnf0A',
  version_date: '2017-09-21'
});


/* This is just a basic hookup to connect to the Watson API  */


router.get('/', function(req, res, next) {
	//console.log(instance)
	res.json({text: instance});
	instance = undefined;
})

router.post('/', function(req, res, next) {
	//This is a copy of what was in the documentation for the watson-developer-cloud node module.
	tone_analyzer.tone({ text: req.body.text },
	  function(err, tone) {
	    if (err)
	      console.log(err);
	    else
	      //console.log(JSON.stringify(tone, null, 2));
	  	  instance = tone;
	});
});
//route to send saved text back to page
router.post('/list', function(req, res, next){
	Text.find({userId: req.body.user}, function(err, texts){
		if (err) return console.log(err);
		res.send(texts)
	});
});
//route to pull single wym for user to view again
router.post('/wym', function(req, res, next){
	Text.find({_id: req.body.id}, function(err, texts){
		if (err) return console.log(err);
		res.send(texts)
	});
});

router.post('/save', function(req, res, next){
	Text.create({
        userId: req.body.user.id,
				title: req.body.title,
    		content: req.body.content
    }, function(err, user) {
        if (err) {
            res.send(err.message)
        } else {
            req.flash('success', 'Welcome to your new account! You are logged in.');
        }
    });
})

module.exports = router;
