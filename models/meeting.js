const mongoose = require('mongoose')


const MeetingSchema = mongoose.Schema(
  {
    roomName: {
      type: String,
      required: true,
      trim:true
    },
    meetingStartedBy: {
      type: String,
      required: true,
      trim:true
    }
  }
);



module.exports = mongoose.model("meeting", MeetingSchema)