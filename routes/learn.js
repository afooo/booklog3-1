var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next){
	res.render('learn');
});

router.get('/lessons', function(req, res, next){
	req.app.db.model.Learn
		.find({})
		.exec(function(err, lessons){
			res.send({
				lessons: lessons
			});
		});
});

router.get('/lessons/:id', function(req, res, next){
	if(req.params.id === 'add') {
		res.send({
			lesson: {}
		});
	}

	req.app.db.model.Learn
		.findOne({ _id: req.params.id })
		.exec(function(err, lesson){
			res.send({
				lesson: lesson
			});
		});
});

router.post('/lessons', function(req, res, next){
	var lesson = req.app.db.model.Learn;
	
	var doc = new lesson({
		lessonName: req.body.lessonName,
		lessonUrl: req.body.lessonUrl,
		lessonLearn: req.body.lessonLearn
	});
	console.log(doc);
	doc.save();

	res.end(console.log("it's saved"));
});

module.exports = router;