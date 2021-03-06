const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
//'mongodb+srv://usertst:usertst@cluster0-mwkmh.mongodb.net/pfinal?retryWrites=true&w=majority'
const uri = process.env.ATLAS_URI || 'mongodb+srv://localhost:27017/pfinal';
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const subjectsRouter = require('./routes/subjects');
const teachersRouter = require('./routes/teachers');
const classRouter = require('./routes/class');
const commentsRouter = require('./routes/comments');
const ratingsRouter = require('./routes/ratings');

app.use('/subjects', subjectsRouter);
app.use('/teachers', teachersRouter);
app.use('/class', classRouter);
app.use('/comments', commentsRouter);
app.use('/rated', ratingsRouter)

app.get('/*', function(req, res) {
  res.send('Estas haciendo GET');
}); 

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
