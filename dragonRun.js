var Runners = new Meteor.Collection('runners');


var currentAge = '-1';


if (Meteor.isClient) {
 

    
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
        Runners.insert(registrationObject);
        for(i=0;i<textInputs.length;i++){
            
        $(textInputs[i]).val('');
        $('#runnerAdditionalDonation').val("0");
            
            
        }
        Session.set('currentRegistrationCode',registrationObject.runnerRegistrationCode);
        var id = Runners.findOne({runnerRegistrationCode:registrationObject.runnerRegistrationCode})
        Router.go('/registrationConfirmation/'+id+'/'+registrationObject.runnerRegistrationCode+'/');
        Session.set("registrationComplete",'true');
            
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
        
     Session.set("selectedRace","-1");
        
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

}
if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

    
Meteor.publish('runners', function(options) { 
    
    
    return Runners.find({},options);
    
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