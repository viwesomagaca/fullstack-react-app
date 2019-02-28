const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const cors = require('cors');

const API_PORT = 3001;
const app = express();
const router = express.Router();

const dbRoute = "mongodb://viwesomagaca:yolanda1995@ds151805.mlab.com:51805/jelotest";

mongoose.connect(
  dbRoute,
  { useNewUrlParser:true }
);

let db = mongoose.connection;
db.once('open', ()=> console.log('Connection to database is established'));

db.on('error', console.error.bind(console, "Database connection error"));

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

router.get('/getData', (req,res) =>{
  Data.find((err,data) =>{
    if(err) return res.json({ sucess: false, error: err });
    return res.json({ success: true, data: data });
    // console.log(data);
  });
});

router.post('/updateData', (req,res)=>{
  const { id, update } =req.body;
  Data.findOneAndUpdate(id,update, err => {
    if(err) return res.json({ sucess: false, error: err });
    return res.json({ sucess: true })
  });
});

router.delete('/deleteData', (req,res) =>{
  const { _id } = req.body;

  console.log("THIS IS THE ID", _id);
  
  Data.findByIdAndRemove(_id, err =>{
    if(err) return res.send(err);
    return res.json({ sucess: true, msg: "HOSH"});
  });
});

router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.use('/api', router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));