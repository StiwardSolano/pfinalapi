const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher', 
        required: true},
  name: { type: String, minlength: 3 ,required: true},//Commenter Name
  message: { 
      type: String, 
      required: true,
      minlength: 3, 
      unique: true },
  //date: { type: Date, required: true },
  }, {
    timestamps: true,
  });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;