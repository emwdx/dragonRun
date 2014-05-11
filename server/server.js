  Meteor.startup(function () {
    // code to run on server at startup
    var numOfUsers = Meteor.users.find().count();
    if(numOfUsers==0){
        
     Accounts.createUser({username:"admin",password:"test1234!",email:"eweinberg@scischina.org"});   
        
    }
  });

    
Meteor.publish('runners', function(publishLimit,options) { 
    
    
    return Runners.find(publishLimit,options);
    
});

 Meteor.publish('systemVariables',function(){
     
  return systemVariables.find();   
     
 });   
    
 Meteor.publish('racerunners',function(){
     
  return RaceRunners.find();   
     
 });  
Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  },
    
  startRace: function(){
      this.unblock();
      var startTimeObject = {name:"raceStartTime",value:new Date().getTime()};
      var raceHasStartedObject = {name:"raceHasStarted",value:true};
      systemVariables.upsert({name:"raceStartTime"},{$set:startTimeObject});
      systemVariables.upsert({name:"raceHasStarted"},{$set:raceHasStartedObject});
      
  },
  stopRace: function(){
      this.unblock();
      var startTimeObject = {name:"raceStartTime",value:new Date()};
      var raceHasStoppedObject = {name:"raceHasStarted",value:false};
      systemVariables.update({name:"raceHasStarted"},{$set:raceHasStoppedObject});
      
      
  }
});

Runners.allow({
  update: function(){
      
  return Meteor.user();      
      
  },
  remove: function(){
  
  return Meteor.user();
      
  },
  insert: function(){
   
    return true;  
      
  }
});

RaceRunners.allow({
 update: function(){
      
  return true;      
      
  },
  remove: function(){
  
  return true;
      
  },
  insert: function(){
   
    return true;  
      
  }    
    
});