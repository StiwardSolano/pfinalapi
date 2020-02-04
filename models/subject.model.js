const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  teachername: { type: String},
  description: { type: String, required: true },
  subjectId: { 
    type: String, 
    required: true, 
    minlength: 3, 
    unique: true }, //siglas clase
}, {
  timestamps: true,
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;