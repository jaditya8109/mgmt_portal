var apiObj = null;

function StartMeeting(){
    const domain = 'meet.jit.si';

    //var roomName = 'newRoome_' + (new Date()).getTime();
    
    const options = {
        roomName: 'sdjbcasjcbaj',
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#jitsi-meet-conf-container'),
        userInfo: {
            displayName: 'ajjjj'
        },
    };
    apiObj = new JitsiMeetExternalAPI(domain, options);
};

async function output (){
    // await StartMeeting();
    var value =  apiObj.getNumberOfParticipants()
    var participant = apiObj.getParticipantsInfo();
    str = JSON.stringify(participant);
    console.log("!!!!!!!!!!! " + "  " + str);
} 