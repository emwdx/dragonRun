var Runners = new Meteor.Collection('runners');
systemVariables = new Meteor.Collection('systemVariables')

var currentAge = '-1';


if (Meteor.isClient) {
Meteor.setInterval(function () {
  Session.set('time', new Date);
}, 1000); 
Meteor.subscribe("systemVariables");
    
 Router.configure({ layoutTemplate: 'mainContent'});
    
  Router.map(function() {
      
      this.route('registrationForm', {path: '/'});
      this.route('registrationNotReady',{path:'/notReady/'});
      this.route('confirmationPage', { 
          path: '/registrationConfirmation/:_id/:code/',
          data: function() { return Runners.findOne({runnerRegistrationCode:this.params.code}); },
          waitOn: function() {return Meteor.subscribe('runners', {limit:this.params.code} )}
      });
      this.route('registrationList',{path: '/registrationList/',
                                    data: function() { return Runners.find()},
                                    waitOn: function() {return Meteor.subscribe('runners')}});
      this.route('paymentConfirmationFrontPage',{path:'/HISDrag0nRuN2O14/paymentRegistrationConfirmation/',
                                                data: function() { return Runners.find()},
                                                 waitOn: function() {return Meteor.subscribe('runners')}});
      
      this.route('paymentConfirmationRunner',{path: '/paymentConfirmation/:id/',
                                              data: function() {return Runners.findOne({_id:this.params.id})},
                                              waitOn: function() { return Meteor.subscribe('runners',{limit:this.params.id})}});
      this.route('unpaidRunnerEmailList', {path: '/unpaidRunnerEmailList/',
                                          waitOn: function() { return Meteor.subscribe('runners')}});
      this.route('raceConfiguration',{path:'/raceCOnfiguration/'}); 
        
  });
    
    
Session.set('selectedAge','-1');
Session.set("selectedRace",'');
Session.set("showSubmitButton","false");
Session.set("runnerAdditionalDonation","0");
Session.set("registrationComplete",'false');
Session.set("currentPaymentRegistrationCode",'');

Template.registrationForm.helpers({
    
   ageGroupSelected: function(){
    currentAge = Session.get('selectedAge');
    
    if(currentAge=="-1"){
        return false;
    }
    else{
        return true;
    }
       
       
   },
 
    registrationFee: function(){
    
    var age = Session.get('selectedAge');
    if(age=="1"){
        
     return 50;   
    }
    else{ return 100}; 
    },
    
    registrationTotal: function(){
        
    var registrationFee = getRegistrationFee();
    var additionalDonation = parseFloat(Session.get("runnerAdditionalDonation"));
    var runnerTotal = 0;
    if(!(additionalDonation=='')){
    runnerTotal = parseFloat(additionalDonation) + registrationFee;
    }
    else{
    runnerTotal = registrationFee; 
        
    }
    return runnerTotal;
        
        
    },
    
    raceSelected: function(){
        
     return(Session.get("selectedRace")!='');
        
    },
    
    funRunSelected: function(){
        
     return(Session.get("selectedRace")=='1K Fun Run');   
        
    },
    
    raceName: function(){
        
     if(Session.get("selectedRace")=='1K Fun Run'){
      return "1K Fun Run"   
     }
    else{
     
    return "5K Dragon Run"    
        
    }
    },
    showSubmitButton: function(){
        
     return (Session.get("showSubmitButton")=='true');   
        
    },
     

    
});

Template.registrationForm.events({
   
    'change #runnerAge': function(e){
        
     Session.set('selectedAge',$('#runnerAge').val());   
        
        
    },
    'click #submitRegistration':function(e){
        e.preventDefault();
        var textInputs = $('.textInput').select();
        var numOfBlank = 0;
        for(i=0;i<textInputs.length;i++){
            if($(textInputs[i]).val()==''){
                numOfBlank++;
            }
        }
        if(numOfBlank>0){
         alert("Please check that you have filled out all fields in the form.");
        }
        
        else{
          
       
        var registrationObject = getRegistrationInfo();     
        console.log(registrationObject);
        Runners.insert(registrationObject,function(error,result){
        $('#submitRegistration').html('Submitting....');
            
        if(error==undefined){
            
           Session.set('currentRegistrationCode',registrationObject.runnerRegistrationCode);
        var id = Runners.findOne({runnerRegistrationCode:registrationObject.runnerRegistrationCode})
        Router.go('/registrationConfirmation/'+result+'/'+registrationObject.runnerRegistrationCode+'/');
        Session.set("registrationComplete",'true');    
        sendConfirmationEmail(registrationObject.runnerFirstName + ' ' + registrationObject.runnerLastName, registrationObject.runnerEmail, registrationObject.runnerRegistrationCode,result); 
            
        }    
        });
        
       
          
        for(i=0;i<textInputs.length;i++){
            
        $(textInputs[i]).val('');
        $('#runnerAdditionalDonation').val("0");
            
            
        }
        $('#submitRegistration').html('Submit Registration');
        
        }
          
    },
    'change #registrationMustPayToComplete':function(){
        
        if($('#registrationMustPayToComplete').is(":checked")){
        Session.set('showSubmitButton','true');
        }
        else{
        Session.set('showSubmitButton','false');    
        }
        
    },
    
    'change #additionalDonation':function(){
     
    Session.set("runnerAdditionalDonation", $('#registrationFormContent').find('[name=runnerAdditionalDonation]').val());   
   
        
    },
    
   
});
Template.registrationList.helpers({

paidRunners: function(){
 runnersList = Runners.find({runnerHasPaid:'true'},{sort:{runnerLastName:-1}}).fetch()    
 return runnersList;   
},
notPaidRunners: function(){
 runnersList = Runners.find({runnerHasPaid:'false'},{sort:{runnerLastName:-1}}).fetch()    
 return runnersList;   
},

numberPaid: function(){
return Runners.find({runnerHasPaid:'true'},{sort:{runnerLastName:-1}}).count();
    
},
    
numberUnpaid: function(){
    
return Runners.find({runnerHasPaid:'false'},{sort:{runnerLastName:-1}}).count();        
},
numberRegistered: function(){
    
 return Runners.find().count();
    
}
});
Template.registrationListDeleteEnabled.helpers({

paidRunners: function(){
 runnersList = Runners.find({runnerHasPaid:'true'},{sort:{runnerLastName:-1}}).fetch()    
 return runnersList;   
},
notPaidRunners: function(){
 runnersList = Runners.find({runnerHasPaid:'false'},{sort:{runnerLastName:-1}}).fetch()    
 return runnersList;   
},

numberPaid: function(){
return Runners.find({runnerHasPaid:'true'},{sort:{runnerLastName:-1}}).count();
    
},
    
numberUnpaid: function(){
    
return Runners.find({runnerHasPaid:'false'},{sort:{runnerLastName:-1}}).count();        
},
numberRegistered: function(){
    
 return Runners.find().count();
    
}
});
Template.selectRace.events({
    
    'click .raceSelect': function(e){
    e.stopPropagation();
    var selectedRace = $(e.currentTarget).html();
    $('.raceSelect').removeClass('HISGoldSolid');
    $(e.currentTarget).addClass('HISGoldSolid');
    Session.set("selectedRace",selectedRace);
    
    }
    
});

Template.confirmationPage.helpers({
   
    ageGroup:function(){
     
        switch(parseFloat(this.runnerAge)){
            case 1:
            return "Lower School (Grades K - 5)";
            break;
            case 2: 
            return "Middle School (Grades 6 - 8) ";
            case 3:
            return "High School (Grades 9 - 12)";
            break;
            default:
            return "Adult";
            break;
        }      
    },
    
     runnerEstimatedFinishTime: function(){
         switch(parseFloat(this.runnerEstimatedTime)){
            case 1:
            return "Under 20 Minutes";
            break;
            case 2: 
            return "20 - 25 Minutes";
            case 3:
            return "25 - 30 Minutes";
            break;
            default:
            return "Over 30 Minutes";
            break;
        }  
           
         
     },
    
    runnerRegistrationFee: function(){
     var age = this.runnerAge;
     if(age=="1"){
         return 50
     }
     else{return 100;}
        
    },
    
    runnerTotalFee: function(){
        
     var age = this.runnerAge;
     
     if(age=="1"){
         age = 50;
     }
     else{age = 100;}
        
    
    var additional = parseFloat(this.runnerAdditionalDonation);
    return age + additional;
    },
    
    isFunRun: function(){
        
    return(this.runnerRaceSelected=='1K Fun Run');    
        
        
    },
    registrationComplete: function(){
        
     return(Session.get("registrationComplete")=='true');   
        
    }
        
    
    
    
});

Template.confirmationPage.events({
    
    'click #registerAnother': function(){
        
     Session.set("selectedRace","");
        
    }
    
});
      
Template.paymentConfirmationFrontPage.helpers({
    
    
retrievedRecords: function(){
 var currentCode = Session.get('currentPaymentRegistrationCode'); 
 var runnerRecord = Runners.find({runnerRegistrationCode:currentCode});
 //console.log(runnerRecord.runnerFirstName);
 return runnerRecord;   
    
  
}
    
    
});

Template.paymentConfirmationFrontPage.events({
   
    'click #submitRegistrationCode': function(e){
     if($('#paymentPassword').val()=='dragonRunMay17!'){
     e.preventDefault();
     var currentCode = $('#paymentRegistrationCode').val();    
     Session.set('currentPaymentRegistrationCode',currentCode);   
     }
    }
    
});

Template.paymentConfirmationRunner.events({
    
    
 'change #paymentHasBeenReceived': function(){
     
       
        if($('#paymentHasBeenReceived').is(":checked")){
        Session.set('currentSelectedRunnerHasPaid','true');
        }
        else{
        Session.set('currentSelectedRunnerHasPaid','false');
        }
     var currentID = Runners.findOne({runnerRegistrationCode:Session.get('currentPaymentRegistrationCode')})._id;
     var currentValue = Session.get('currentSelectedRunnerHasPaid');
     Runners.update({_id:currentID},{$set:{runnerHasPaid:currentValue,runnerPaidDate:new Date()}});
     
    
}
});
Template.paymentConfirmationRunner.helpers({
   
    isChecked: function(){
        
     var runnerHasPaid = (Runners.findOne({runnerRegistrationCode:Session.get('currentPaymentRegistrationCode')}).runnerHasPaid=='true');
     
     if(runnerHasPaid){
         return true;
     }
    else{ return false;}
    
   
        
    },
    
    runnerTotalFee: function(){
        
     var age = this.runnerAge;
     
     if(age=="1"){
         age = 50;
     }
     else{age = 100;}
        
    
    var additional = parseFloat(this.runnerAdditionalDonation);
    return age + additional;
    }
    
});

Template.unpaidRunnerEmailList.helpers({
   
    unpaidRunner: function(){
        
        return Runners.find({runnerHasPaid:'false'},{runnerEmail:1});
    }
    
});
    
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
}

    
});
}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
   
  });

    
Meteor.publish('runners', function(options) { 
    
    
    return Runners.find({},options);
    
});

 Meteor.publish('systemVariables',function(){
     
  return systemVariables.find();   
     
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
}

var getRegistrationInfo = function(){
    
    registrationObject = {
    
    runnerFirstName: $('#registrationFormContent').find('[name=runnerGivenName]').val(),
    runnerLastName: $('#registrationFormContent').find('[name=runnerFamilyName]').val(),
    runnerAge: $('#registrationFormContent').find('[name=runnerAge]').val(),
    runnerGender: $('#registrationFormContent').find('[name=runnerGender]').val(),
    runnerPhone: $('#registrationFormContent').find('[name=runnerPhone]').val(),
    runnerEmail: $('#registrationFormContent').find('[name=runnerEmail]').val(),
    runnerEmergencyName: $('#registrationFormContent').find('[name=runnerEmergencyName]').val(),
    runnerEmergencyPhone: $('#registrationFormContent').find('[name=runnerEmergencyPhone]').val(),
    runnerEstimatedTime: $('#registrationFormContent').find('[name=runnerEstimatedTime]').val(),
    runnerShirtSize: $('#registrationFormContent').find('[name=runnerShirtSize]').val(),
    runnerAdditionalDonation: $('#registrationFormContent').find('[name=runnerAdditionalDonation]').val(),
    runnerHasPaid: 'false',
    runnerBibNumber: 0,
    runnerRaceSelected: Session.get("selectedRace"),
    runnerRegistrationCode: generateRaceCode(),
    runnerRegistrationDate: new Date(),
    
    
        
    };
        
    
    
    
    return registrationObject;
    
}

var getRegistrationFee = function(){
    
 var age = Session.get('selectedAge');
    if(age=="1"){
        
     return 50;   
    }
    else{ return 100}; 
    
    
}
var generateRaceCode=function(){
var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

a = Math.floor(10*Math.random()).toString();
b = characters[Math.floor(characters.length*Math.random())];
c = characters[Math.floor(characters.length*Math.random())];
d = Math.floor(10*Math.random()).toString();

return a+b+c+d;
    
}

var sendConfirmationEmail = function(name, email, registrationCode, id){
 
var emailString = "Dear " + name +",\n Thank you for submitting your information through the Dragon Run/ Fun Run website. \n\n Your registration is not complete. You must print out your form and bring it in to the HIS office, along with your registration fee. \n\n You can access the link to your form at: \n http://dragonrun.meteor.com/registrationConfirmation/"+id+"/"+registrationCode+"/  \n\n Please email eweinberg@scischina.org for any questions about registration. \n\nThanks! \n\n Evan\n Dragon Run Registration Team"
    
    
 Meteor.call('sendEmail',
            email,
            'eweinberg@scischina.org',
            'Dragon Run/Fun Run Registration Information Received',
            emailString);
        
           
    
    
}

