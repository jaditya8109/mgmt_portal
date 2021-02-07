const express = require('express');
var bodyParser = require('body-parser');
var CryptoJS = require("crypto-js");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine' , 'ejs');

//db.js

const mongoose = require('mongoose')

const url = `mongodb+srv://jaditya8109:admin@cluster0.dsozk.mongodb.net/MGMTportal?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })
//model
const meetingModel = require('./models/meeting');

//routes
app.get('/', (req,res)=>{
    res.render('enterRoomName');
})

// app.get('/index', (req,res)=>{
//     res.render('videoConference');
// })

app.post('/result', (req,res)=>{
    console.log(req.body);
    const roomname = req.body.roomName;
    const meetingStartedBy = req.body.displayName;
    const status = "active";
       
       let meet = new meetingModel ({
                        roomName : req.body.roomName,
                        meetingStartedBy :  req.body.displayName,
                        status : "active"
                       });
        console.log('saving = ' + meet);
        //save meeting
         meet.save()
               
    // Encrypt
    var hashedRoomName = CryptoJS.AES.encrypt(roomname , 'secret key 123').toString();
    console.log(hashedRoomName, meetingStartedBy);
    res.render('videoConference', {roomValue: hashedRoomName, nameValue: meetingStartedBy});
})

app.post('/result/endMeet', async function(req, res, next) {
    
    const  removeRoom = req.body.remove;
    // Decrypt
    var bytes  = CryptoJS.AES.decrypt(removeRoom, 'secret key 123');
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log(originalText); // 'my message'
    //update status
    // let meet = mongoose.model('meeting');
    let meetingData = await  meetingModel.findOne({roomName:originalText})
    meetingData.status = "inactive"
    await meetingData.save();

    // meetingModel.findOneAndUpdate(
    //     { 'roomName' : originalText }, // specifies the document to update
    //     {
    //       $set: {  "status" : "inactive" }
    //     }
    // )
    res.send("meeting ended bye bye hola!" + req.body.remove);
    console.log('updated');
});


app.listen( 1111, ()=>{
    console.log('connected successfully')
})




