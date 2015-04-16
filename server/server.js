  Meteor.startup(function () {
    // code to run on server at startup
    var numOfUsers = Meteor.users.find().count();
    if(numOfUsers==0){
        
     Accounts.createUser({username:"admin",password:"test1234!",email:"eweinberg@scischina.org"});   
        
    }
      
  var adminUser = Meteor.users.findOne({username:'admin'});

 if (Meteor.users.findOne(adminUser._id)){
            Roles.addUsersToRoles(adminUser._id, ['admin']);
     
 }

if(!Meteor.roles.findOne({name: "race-runner"}))
            Roles.createRole("race-runner");

        if(!Meteor.roles.findOne({name: "staff"}))
            Roles.createRole("staff");

        if(!Meteor.roles.findOne({name: "wechat"}))
            Roles.createRole("wechat");
      
      
  });


Meteor.publish('runners', function(publishLimit,options) { 
    
    return Runners.find({year:2015},options);
    
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
      systemVariables.update({name:"raceStartTime"},{$set:startTimeObject});
      systemVariables.update({name:"raceHasStarted"},{$set:raceHasStartedObject});
      
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
   
    return Meteor.user();  
      
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
systemVariables.allow({
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


Accounts.onCreateUser(function(options,user){
user.roles = ['race-runner'];    
return user;    
});
