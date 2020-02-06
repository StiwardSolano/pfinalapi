const router = require('express').Router();
let Comment = require('../models/comment.model');

//get comment number by teacherId
//var topCommented = [{ $group: { _id: "$teacherId", total: {$sum: 1} } }];
//get comments number and associated info
var getTeacherName = [
    {$lookup: { 
        from: 'subjects', 
        localField: 'teacherId', 
        foreignField: '_id', 
        as: 'subjTests' 
        }
    },
    {$group: 
        {
        _id: "$teacherId",//actualy classID keep in mind
        total: {$sum: 1},
        coments: {
            $push: {
              message: "$message",
              description: "$subjTests.description",
              subjectId: "$subjTests.subjectId",
              teachername: "$subjTests.teachername"
            }
          }
        }
    },//, '_id coments.description coments.subjectId coments.teachername total'
    { $match: {"total": {$gte: 5} }}
];

var getTopRated = [
    {$lookup: { 
        from: 'subjects', 
        localField: 'teacherId', 
        foreignField: '_id', 
        as: 'subjTests' 
        }
    },{ $match: { "message": {$in: [/^buen/, /^Bue/, /^Exce/, /^Temp/, /^Chev/, /^Poca/, /^pocos/]} } 
    },
    {$group: 
        {
        _id: "$teacherId",//actualy classID keep in mind
        total: {$sum: 1},
        coments: {
            $push: {
              message: "$message",
              description: "$subjTests.description",
              subjectId: "$subjTests.subjectId",
              teachername: "$subjTests.teachername"
            }
          }
        }
    }
];

var getWorstRated = [
    {$lookup: { 
        from: 'subjects', 
        localField: 'teacherId', 
        foreignField: '_id', 
        as: 'subjTests' 
        }
    },{ $match: { "message": {$in: [/^mal/, /^Ma/,/^Pes/,/^Fal/, /^Horr/, /^Tard/, /^Baja/, /^Nada/]} } 
    },
    {$group: 
        {
        _id: "$teacherId",//actualy classID keep in mind
        total: {$sum: 1},
        coments: {
            $push: {
              message: "$message",
              description: "$subjTests.description",
              subjectId: "$subjTests.subjectId",
              teachername: "$subjTests.teachername"
            }
          }
        }
    }
];
//route to get top 5 most commented teachers -> alltime
//count total number and sort
router.route('/toprated').get((req, res) => {
    Comment.aggregate(getTeacherName)
    .sort({total: 'desc'})
    .limit(5)
    .then(subjects => {
            if(subjects){ res.json(subjects); }
            else{ res.status(404).json('No hay profesores con alta calificación'); }
        })
    .catch(err => res.status(400).json('Error: ' + err));
    console.log(res);
});
/////////////////////////////////////////////////////////

//testing route
//currently testing positive feedback
router.route('/test').get((req, res) => {
    Comment.aggregate(getTopRated)
    .sort({total: 'desc'})
    .limit(5)
    .then(subjects => res.json(subjects))
    .catch(err => res.status(400).json('Error: ' + err));
    console.log(res);
});

//only positive based on regex
router.route('/top').get((req, res) => {
    Comment.aggregate(getTopRated)
    .sort({total: 'desc'})
    .limit(5)
    .then(subjects => res.json(subjects))
    .catch(err => res.status(400).json('Error: ' + err));
    console.log(res);
});
//negative feedback based on regex
router.route('/worst').get((req, res) => {
    Comment.aggregate(getWorstRated)
    .sort({total: 'desc'})
    .limit(5)
    .then(subjects => res.json(subjects))
    .catch(err => res.status(400).json('Error: ' + err));
    console.log(res);
});

//all coments
router.route('/all').get((req, res) => {
    Comment.aggregate([
        {$lookup: { 
            from: 'subjects', 
            localField: 'teacherId', 
            foreignField: '_id', 
            as: 'subjTests' 
            }
        },
        {$group: 
            {
            _id: "$teacherId",//actualy classID keep in mind
            total: {$sum: 1},
            coments: {
                $push: {
                  message: "$message",
                  description: "$subjTests.description",
                  subjectId: "$subjTests.subjectId",
                  teachername: "$subjTests.teachername"
                }
              }
            }
    }])
    .sort({total: 'desc'})
    .limit(5)
    .then(subjects => res.json(subjects))
    .catch(err => res.status(400).json('Error: ' + err));
    console.log(res);
});

module.exports = router;