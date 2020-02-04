const router = require('express').Router();
let Teacher = require('../models/teacher.model');

router.route('/').get((req, res) => {
  Teacher.find().sort('teachername')
    .then(teachers => res.json(teachers))
    .catch(err => res.status(400).json('Error: ' + err));
  console.log(res);
});

router.route('/add').post((req, res) => {
  const teachername = req.body.teachername;
  const newTeacher = new Teacher({teachername});

  newTeacher.save()
    .then(() => res.json('Teacher added!'))
    .catch(err => res.status(400).json('Error: ' + err));
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