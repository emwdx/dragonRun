
var currentAge = '-1';


if (Meteor.isClient) {
Session.set('selectedAge','-1');
Session.set("selectedRace",'');
Session.set("showSubmitButton","false");
Session.set("runnerAdditionalDonation","0");
Session.set("registrationComplete",'false');
Session.set("currentPaymentRegistrationCode",'');    
    
    
    
Meteor.setInterval(function () {
  Session.set('time', new Date());
}, 1000); 
Meteor.subscribe("systemVariables");
Meteor.subscribe("racerunners");    

    
    




    
Template.raceConfiguration.events({
   'click #raceStartButton': function(e){
    e.preventDefault();
    if($('#confirmStartRace').val()=='1'){
    Meteor.call('startRace');    
        
    }
    else{ alert('Confirm what you are doing!');}
       
   },
   'click #raceStopButton':function(e){
    e.preventDefault();
    Meteor.call('stopRace');
   },
    'click #addRunners':function(e){
 e.preventDefault();
 var allRunners = RaceRunners.find();
 allRunners.forEach(function(runner){
    
 RaceRunners.remove({_id:runner._id});   
    
    });
 //var allRunners = Runners.find({runnerHasPaid:'true'});
 
 var runnerNumber = 200;
 /*
 allRunners.forEach(function(runner){
 
 var raceRunnerObject = {
     
 runnerName: (runner.runnerFirstName + ' ' + runner.runnerLastName),
 runnerNumber: runnerNumber,
 runnerIsFlagged: false,
 runnerIsStopped:false,
 runnerFlagAssignment:"-1",
 runnerStopTime: 0
   
 }
 
 RaceRunners.insert(raceRunnerObject);     
 runnerNumber++;     
 });
 */
 for(i = runnerNumber;i<600;i++){
 var raceRunnerObject = {
     
 runnerName: ("Runner " + i),
 runnerNumber: runnerNumber,
 runnerIsFlagged: false,
 runnerIsStopped:false,
 runnerFlagAssignment:"-1",
 runnerStopTime: 0
   
 }
 
 RaceRunners.insert(raceRunnerObject);     
 runnerNumber++;     
     
     
 }
 var numOfSpotters = systemVariables.findOne({name:"numOfSpotters"})
 systemVariables.update({_id:numOfSpotters._id},{$set:{value:4}})
 var currentSpotterIndex = systemVariables.findOne({name:"currentSpotterIndex"})
 systemVariables.update({_id:currentSpotterIndex._id},{$set:{value:1}})
 
    
}
    
});
    
Template.raceConfiguration.helpers({
raceIsStarted: function(){
    var raceStarted = systemVariables.findOne({name:"raceHasStarted"})
    if(!raceStarted){return false;}
    return raceStarted.value
},
raceTime:function(){
var currentTime = Session.get('time');
var raceStartTime = systemVariables.findOne({name:"raceStartTime"});
if(!raceStartTime){return 'not found'}
var elapsedTime = (currentTime - raceStartTime.value);
minutes = Math.floor(elapsedTime/60000);
seconds = Math.floor(((elapsedTime/60000)-Math.floor(elapsedTime/60000))*60)
if(seconds<=9){var secondString = '0'+seconds.toFixed(0).toString()}
else{var secondString = seconds.toFixed(0).toString();}
if(minutes<9){var minuteString = '0'+minutes.toString()}
else{var minuteString = minutes.toString();}
return {minutes:minuteString,seconds:secondString};
},
connectedToServer:function(){
 return Meteor.status().status;
 }

});
Template.allActiveRunners.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerIsStopped:true},{sort:{runnerNumber:-1}}).fetch()    
 return runnersList;   
},
notStoppedRunners: function(){
 runnersList = RaceRunners.find({runnerIsStopped:false},{sort:{runnerNumber:-1}}).fetch()    
 return runnersList;   
},

numberStoppedRunners: function(){
return RaceRunners.find({runnerIsStopped:true}).count();
    
},
    
numberNotStopped: function(){
    
return RaceRunners.find({runnerIsStopped:false}).count();      
},
numberRegistered: function(){
    
 return RaceRunners.find().count();
    
}    
    
    
});
Template.stoppedRunners.helpers({
stoppedRunners: function(){
 runnersList = RaceRunners.find({runnerIsStopped:true},{sort:{runnerStopTime:1}}).fetch()    
 return runnersList;   
},
runnerStopTimeString: function(){
    
 var elapsedTime = this.runnerStopTime;
 minutes = Math.floor(elapsedTime/60000);
seconds = Math.floor(((elapsedTime/60000)-Math.floor(elapsedTime/60000))*60)
if(seconds<=9){var secondString = '0'+seconds.toFixed(0).toString()}
else{var secondString = seconds.toFixed(0).toString();}
if(minutes<9){var minuteString = '0'+minutes.toString()}
else{var minuteString = minutes.toString();}
return minuteString+":"+secondString;
 
    
}
});
      
Template.officialRaceTime.helpers({
raceTime:function(){
var currentTime = Session.get('time');
var raceStartTime = systemVariables.findOne({name:"raceStartTime"});
if(!raceStartTime){return 'not found'}
var elapsedTime = (currentTime - raceStartTime.value);
minutes = Math.floor(elapsedTime/60000);
seconds = Math.floor(((elapsedTime/60000)-Math.floor(elapsedTime/60000))*60)
if(seconds<=9){var secondString = '0'+seconds.toFixed(0).toString()}
else{var secondString = seconds.toFixed(0).toString();}
if(minutes<9){var minuteString = '0'+minutes.toString()}
else{var minuteString = minutes.toString();}
return {minutes:minuteString,seconds:secondString};
}
    
    
});
    
Template.flaggingRunners.events({
    
'submit form':function(e){
 e.preventDefault()
 var flaggedRunner = parseInt($('#flaggingRunnersInput').val())
 var flaggedRunnerEntry = RaceRunners.findOne({runnerNumber:flaggedRunner, runnerIsFlagged:false});
 var currentSpotterIndex = systemVariables.findOne({name:"currentSpotterIndex"});
 
 var numOfSpotters = parseInt(systemVariables.findOne({name:"numOfSpotters"}).value);   
 
 if(flaggedRunnerEntry&&(!flaggedRunnerEntry.runnerIsStopped)){
    RaceRunners.update({_id:flaggedRunnerEntry._id},{$set:{runnerIsFlagged:true,runnerFlagAssignment:(currentSpotterIndex.value+1)}})
    newSpotterIndex = ((currentSpotterIndex.value+1)%numOfSpotters);
     
    systemVariables.update({_id:currentSpotterIndex._id},{$set:{value:newSpotterIndex}});
 }
 else{alert("runnerNotFOund")};
 $('#flaggingRunnersInput').val('')    

}    
    
});


Template.flaggingRunners.helpers({
   
    numOfSpotters: function(){ 
     var numOfSpotters = systemVariables.findOne({name:"numOfSpotters"});   
     if(numOfSpotters){   
        return numOfSpotters.value;
     }
    else{ return null;}
    
    
    },
    currentSpotterIndex: function(){ 
        var currentSpotterIndex = systemVariables.findOne({name:"currentSpotterIndex"});
        if(currentSpotterIndex){
            return currentSpotterIndex.value+1;
        }
        else{ return null;}
    },
    spotter1Numbers: function(){
        
        return RaceRunners.find({runnerFlagAssignment:1,runnerIsStopped:false},{sort:{runnerNumber:-1}});
    },
    spotter2Numbers: function(){
        return RaceRunners.find({runnerFlagAssignment:2,runnerIsStopped:false},{sort:{runnerNumber:-1}});
        
    },
    spotter3Numbers: function(){
        
        return RaceRunners.find({runnerFlagAssignment:3,runnerIsStopped:false},{sort:{runnerNumber:-1}});
    },
    spotter4Numbers: function(){
         return RaceRunners.find({runnerFlagAssignment:4,runnerIsStopped:false},{sort:{runnerNumber:-1}});
        
    }
    
    
});
Template.flaggerPortal.helpers({

    flaggedRunnerNumbers: function(){
        
     var currentIndex = parseInt(Session.get("currentFlagIndex"));
     return RaceRunners.find({runnerIsFlagged:true,runnerFlagAssignment:currentIndex,runnerIsStopped:false});
        
        
    }
    
});
    
Template.flaggerPortal.events({
    
'click .flaggedRunnersButton':function(e){
    
 e.preventDefault();
 currentRunner = this;
 var currentTime = Session.get('time');
var raceStartTime = systemVariables.findOne({name:"raceStartTime"});
if(!raceStartTime){return 'not found'}
var elapsedTime = (currentTime - raceStartTime.value);
console.log(elapsedTime);
RaceRunners.update({_id:currentRunner._id},{$set:{runnerStopTime:elapsedTime,runnerIsStopped:true}});
}
    
    
    

    
});

}