const express = require('express');
var bodyParser = require('body-parser');
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
        console.log('Connected to database')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

//model
const meetingModel = require('./models/meeting');

//routes
app.get('/', (req,res)=>{
    res.render('landing');
})

app.get('/createMeet', (req,res)=>{
    res.render('enterRoomName');
})

app.post('/createMeet', function(req,res){
    const roomname = req.body.roomName;
    const meetingStartedBy = req.body.displayName;
       
    let meet = new meetingModel ({
                roomName : req.body.roomName,
                meetingStartedBy :  req.body.displayName,
                status : "active"
                });
    meet.save()
    
    var hashedRoomName = Buffer.from(roomname).toString('base64');
    res.render('videoConference', {roomValue: hashedRoomName, nameValue: meetingStartedBy});
})

app.post('/createMeet/endMeet', async function(req, res, next) {
    const  removeRoom = req.body.remove;
    var originalText = Buffer.from(removeRoom, 'base64').toString();
    //update status
    let meetingData = await  meetingModel.findOne({roomName:originalText})
    meetingData.status = "inactive"
    await meetingData.save();

    res.send("meeting ended bye bye hola!" + req.body.remove);
});

app.get('/activeMeetings' , function(req, res) {
    meetingModel.find({}, function(err, data) {
        res.render('activeMeetings.ejs', {
            meetings: data
        });
    });
});

app.get('/joinMeet', (req,res)=>{
    let rname = req.query.mid ;
    res.render('joinParticipantName.ejs' , {roomName : rname});
})

app.post('/joinMeet', async function(req,res){
    let roomname = req.body.roomName;
    let meetingJoinedBy = req.body.displayName;
    //update participants
    let meetingData = await  meetingModel.findOne({roomName: roomname});
    await meetingData.updateOne({
        $push : {participants : {joinee : meetingJoinedBy}}
    })
    .catch(err => console.log(err));  ;
    meetingData.save();
    
    var hashedRoomName =Buffer.from(roomname).toString('base64');
    res.render('joinMeet', {roomValue: hashedRoomName, nameValue: meetingJoinedBy});
})

app.get("/meetDetails" , (req,res)=>{
    let roomname = req.query.rname ;
    meetingModel.findOne({roomName: roomname}, function(err, data) {
        res.render('meetDetails.ejs' , {meetingData : data , roomname: roomname});
    });
})

app.post("/postMOM", async function(req,res){
    const mom = req.body.mom;
    const roomname = req.body.roomName;   
    //update mom
    let meetingData = await  meetingModel.findOne({roomName: roomname});
    await meetingData.updateOne({
        $set : {MOM : mom}
    })
    .catch(err => console.log(err));  ;
    await meetingData.save();
    res.send("mom saved!")
})


app.listen( 1111, ()=>{
    console.log('connected successfully')
})




