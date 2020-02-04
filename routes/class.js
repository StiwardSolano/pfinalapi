const router = require('express').Router();
let Subject = require('../models/subject.model');
let Teacher = require('../models/teacher.model');
const moment = require('moment');
const { check, validationResult } = require('express-validator');

//route used to asign teacher to class
var firstday = moment().startOf('day');//todayu
var lastday = moment().subtract(7, 'days').calendar();//7 days ago

let query = {'date': {$gte: lastday, $lte: firstday} };

router.route('/').get((req, res) => {
    Subject.find(
        {"teachername":{$nin: [ null, ""]}} //not specified or doesnt exist
    ).sort('subjectId')
      .then(subjects => res.json(subjects))
      .catch(err => res.status(400).json('Error: ' + err));
      console.log(res);
});
  
router.route('/add').post([
    check('teachername').not().isEmpty().withMessage('Teacher required')
],(req, res) => {

    const errors = validationResult(req);

    const teachername = req.body.teachername;
    const description = req.body.description;
    const subjectId = req.body.subjectId;
  
    const newSubject = new Subject({
      teachername,
      description,
      subjectId
    });

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }else{
        newSubject.save()
        .then(() => res.json('Subject added!'))
        .catch(err => res.status(400).json('Error: ' + err));
    }

});

//add new class
router.route('/test').post([
  check('teachername').not().isEmpty().withMessage('Teacher required'),
  check('description').not().isEmpty().withMessage('Description required')
],(req, res) => {

  const errors = validationResult(req);
  const teachername = req.body.teachername;
  const description = req.body.description;

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }else{
    console.log(teachername);
    console.log(description);
    console.log("________Find funct____");
  Subject.findOne({
    'description': description
  })
        .then(subject => {
        subject.teachername = teachername;
        //console.log(req.params.description);
        subject.save()
            .then(() => res.json('Class Added!'))
            .catch(err => res.status(400).json('Save Error: ' + err));
        })
        .catch(err => res.status(400).json('Catch Error: ' + err));
  }
});
  
router.route('/:id').get((req, res) => {
      Subject.findById(req.params.id)
        .then(subject => res.json(subject))
        .catch(err => res.status(400).json('Error: ' + err));
});
  
router.route('/:id').delete((req, res) => {
      Subject.findByIdAndDelete(req.params.id)
        .then(() => res.json('Subject deleted.'))
        .catch(err => res.status(400).json('Error: ' + err));
});
  
router.route('/update/:id').post((req, res) => {
    Subject.findById(req.params.id)
          .then(subject => {
          subject.teachername = req.body.teachername;
          subject.description = req.body.description;
          subject.subjectId = req.body.subjectId;
  
          subject.save()
              .then(() => res.json('Subject updated!'))
              .catch(err => res.status(400).json('Error: ' + err));
          })
          .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;