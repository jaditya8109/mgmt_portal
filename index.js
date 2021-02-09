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

const uri = `mongodb+srv://jaditya8109:admin@cluster0.dsozk.mongodb.net/MGMTportal?retryWrites=true&w=majority`;

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(uri,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })
//model
const meetingModel = require('./models/meeting');
const { request } = require('express');

//routes
app.get('/', (req,res)=>{
    res.render('landing');
})

app.get('/createMeet', (req,res)=>{
    res.render('enterRoomName');
})

app.post('/result', (req,res)=>{
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
    // var hashedRoomName = CryptoJS.AES.encrypt(roomname , 'secret key 123').toString();
    var hashedRoomName = Buffer.from(roomname).toString('base64');
    console.log('created roomname' + roomname);
    console.log('created hashed room' + hashedRoomName + " " + 'meeting started by:' + meetingStartedBy) ;
    res.render('videoConference', {roomValue: hashedRoomName, nameValue: meetingStartedBy});
})

app.post('/result/endMeet', async function(req, res, next) {
    
    const  removeRoom = req.body.remove;
    // Decrypt
    // var bytes  = CryptoJS.AES.decrypt(removeRoom, 'secret key 123');
    // var originalText = bytes.toString(CryptoJS.enc.Utf8);
    var originalText = Buffer.from(removeRoom, 'base64').toString();
    console.log(originalText); // 'my message'
    //update status
    let meetingData = await  meetingModel.findOne({roomName:originalText})
    meetingData.status = "inactive"
    await meetingData.save();

    res.send("meeting ended bye bye hola!" + req.body.remove);
    console.log('updated');
});

app.get('/activeMeetings' , function(req, res) {
    // mongoose operations are asynchronous, so you need to wait 
    meetingModel.find({}, function(err, data) {
        // note that data is an array of objects, not a single object!
        res.render('activeMeetings.ejs', {
            meetings: data
        });
    });
});

app.get('/joinMeet', (req,res)=>{
    let rname = req.query.mid ;
    console.log('joining meet with roomname = ' + rname);
    // Encrypt
    // var hashedRoomName = CryptoJS.AES.encrypt(rname , 'secret key 123').toString();
    // console.log('joining room hashed' + hashedRoomName);
    // res.render('joinMeet', {roomValue: hashedRoomName});

    res.render('joinParticipantName.ejs' , {roomName : rname});
})

app.post('/join', async function(req,res){
    let roomname = req.body.roomName;
    let meetingJoinedBy = req.body.displayName;
       
    //update status
    let meetingData = await  meetingModel.findOne({roomName: roomname});
    await meetingData.update({
        
            $push : {participants : {joinee : meetingJoinedBy}}
        
    })
    .catch(err => console.log(err));  ;
    // meetingData.participants += {meetingJoinedBy};
    
    meetingData.save();
    
    

    // Encrypt
    // var hashedRoomName = CryptoJS.AES.encrypt(roomname , 'secret key 123').toString();
    var hashedRoomName =Buffer.from(roomname).toString('base64');
    console.log('joining roomname' + roomname);
    console.log('joined hashed room' + hashedRoomName + " " + 'meeting joined by:' + meetingJoinedBy) ;
    res.render('joinMeet', {roomValue: hashedRoomName, nameValue: meetingJoinedBy});
})

app.listen( 1111, ()=>{
    console.log('connected successfully')
})




