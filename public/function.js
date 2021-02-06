//function

var apiObj = null;

function StartMeeting(rn, dn){
    const domain = 'meet.jit.si';
    const options = {
        roomName: rn,
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#jitsi-meet-conf-container'),
        userInfo: {
            displayName: dn
        },
    };
    apiObj = new JitsiMeetExternalAPI(domain, options);
};

function output (){
    var value =  apiObj.getNumberOfParticipants()
    var participant = apiObj.getParticipantsInfo();
    str = JSON.stringify(participant);
    console.log("!!!!!!!!!!! " + "  " + str);
} 
