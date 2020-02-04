const router = require('express').Router();
let Subject = require('../models/subject.model');

router.route('/').get((req, res) => {
  Subject.find().sort('subjectId')
    .then(subjects => res.json(subjects))
    .catch(err => res.status(400).json('Error: ' + err));
    console.log(res);
});

router.route('/add').post((req, res) => {
  //const teachername = req.body.teachername;
  const description = req.body.description;
  const subjectId = req.body.subjectId;

  const newSubject = new Subject({
    //teachername,
    description,
    subjectId
  });

  newSubject.save()
  .then(() => res.json('Subject added!'))
  .catch(err => res.status(400).json('Error: ' + err));
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
        //subject.teachername = req.body.teachername;
        subject.description = req.body.description;
        subject.subjectId = req.body.subjectId;

        subject.save()
            .then(() => res.json('Subject updated!'))
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;