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
    console.log("!!!!!!!!!!! api" + "  " + participant);
    console.log("!!!!!!!!!!! stringed api" + "  " + str);
    console.log("????? typeof participant is" + "  " + typeof participant);
    str2 = JSON.parse(str);
    console.log("!!!!!!!!!!! parsed stringed api " + "  " + str2);
    str1 = JSON.parse(participant);
    console.log("!!!!!!!!!!! parsed participant " + "  " + str1);
} 