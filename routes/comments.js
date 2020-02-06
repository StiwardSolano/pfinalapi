const router = require('express').Router();
let Teacher = require('../models/teacher.model');
let Comment = require('../models/comment.model');
var mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');

router.route('/').get([
    check('teacherId')
    .not()
    .isEmpty()
    .withMessage('TeacherID required')
],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }else{
    Comment.find(
        {'teacherId':{$nin: [ null, ""]}} //not specified or doesnt exist
    )
    .then(subjects => res.json(subjects))
    .catch(err => res.status(400).json('Error: ' + err));
    console.log(res);
    }
});

router.route('/:id').get((req, res) => {
    const teacherId = req.params.id;
    
    console.log(teacherId);
    Comment.find({'teacherId': mongoose.Types.ObjectId(teacherId)})
        .then(comments => res.json(comments))
        .catch(err => res.status(400).json('Error: ' + err));
    console.log(res);
});

router.route('/add/:id').post([
    check('teacherId')
    .not()
    .isEmpty()
    .withMessage('TeacherID required')
],(req, res) => {
    //Teacher.findById(req.params.id)
    const errors = validationResult(req);

    const teacherId = req.body.teacherId;
    const name = req.body.name;
    const message = req.body.message;

    const newComment = new Comment({
        teacherId,
        name,
        message,
        });

    if (!errors.isEmpty()) {
        console.log('aqui el error')
        return res.status(422).json({ errors: errors.array() });
    }else{
        newComment.save()
        .then(() => res.json('Comment added!'))
        .catch(err => res.status(400).json('Error: ' + err));
    }
});

router.route('/:id').get((req, res) => {
    Teacher.findById(req.params.id)
      .then(teachers => res.json(teachers))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req, res) => {
    Teacher.findByIdAndDelete(req.params.id)
      .then(() => res.json('Teacher deleted.'))
      .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Teacher.findById(req.params.id)
      .then(teacher => {
        teacher.username = req.body.teachername;
  
        Teacher.save()
          .then(() => res.json('Teacher updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;