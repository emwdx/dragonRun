var currentQRCode = ReactiveVar(qrScanner.message());


Template.header.events({
    
'click .navbar-nav > li > a':function(e){
 
 $('.navbar-nav > li').removeClass('active');
 
 $(e.target).parent().addClass('active');
    
    
},
'change #selectLang':function(e){
    
 Session.set('selectedLanguage',$(e.target).val())   
    
}
    
    
});



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
        
    var registrationFee = 100;
        
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
    userEmail: function(){
     
    return Meteor.user().emails[0].address;    
        
    },
    userPhone: function(){
    
    return Meteor.user().profile.phone;    
        
    }
     

    
});

Template.registrationForm.events({
   
    'change #runnerAge': function(e){
        
     Session.set('selectedAge',$('#runnerAge').val());   
        
        
    },
    'click #submitRegistration':function(e){
        e.preventDefault();
        var textInputs = $('.form-control').select();
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
          
       
        var registrationObject = getNewRegistrationInfo();     
        console.log(registrationObject);
        Runners.insert(registrationObject,function(error,result){
        $('#submitRegistration').html('Submitting....');
            
        if(error==undefined){
            
           
        Router.go('/portal/');
        Session.set("registrationComplete",'true');    
        //sendConfirmationEmail(registrationObject.runnerFirstName + ' ' + registrationObject.runnerLastName, registrationObject.runnerEmail, registrationObject.runnerRegistrationCode,result); 
            
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
        
var payBoolean = $('#registrationMustPayToComplete').is(":checked");
        
var raceDisclaimerSelect = $('#raceDisclaimer').is(":checked");        
    if(payBoolean&raceDisclaimerSelect){
        Session.set('showSubmitButton','true');
        }
        else{
        Session.set('showSubmitButton','false');    
        }
        
    },
    'change #raceDisclaimerSelect':function(){
        
var payBoolean = $('#registrationMustPayToComplete').is(":checked");
        
var raceDisclaimerSelect = $('#raceDisclaimerSelect').is(":checked");        
    if(payBoolean&raceDisclaimerSelect){
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

Template.selectRace.events({
    
    'click .raceSelect': function(e){
    e.stopPropagation();
    var selectedRace = $(e.currentTarget).html();
    $('.raceSelect').removeClass('HISBlueSolid');
    $(e.currentTarget).addClass('HISBlueSolid');
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

Template.userPortal.helpers({
    
myRegistrations: function(){
var currentUserEmail = Meteor.user().emails[0].address;
var myregistrations = Runners.find({runnerEmail:currentUserEmail});
    
if(myregistrations){return myregistrations};

    return null;
    
},
myTotalPayment:function(){
var currentUserEmail = Meteor.user().emails[0].address;  
var fee = 0;
var myRunners = Runners.find({runnerEmail:currentUserEmail});
myRunners.forEach(function(r){

fee+=(100+parseFloat(r.runnerAdditionalDonation));    

});
    
return fee;
    
    
},
userEmail:function(){
return Meteor.user().emails[0].address;    
    
}
    
});

Template.myRegistrationItem.helpers({
runnerFullName: function(){
    
return (this.runnerFirstName +" "+ this.runnerLastName);    
},
    
runnerPaidStatus: function(){
    
if(this.runnerHasPaid){

return "<span class = 'text-success'>Paid</span>" ;   
    
}
else{

return "<span class = 'text-danger'>Not Paid</span>";
    
}
}
    
});

Template.myRegistrationItem.events({
'click .registrationDelete':function(e){
e.preventDefault();
var confirmDelete = confirm("Are you sure you want to delete this registration?");
if(confirmDelete){
Runners.remove({_id:this._id});    
    
}
    
}
    
});

Template.paymentOptions.events({
'click #setWeChatID':function(){
var id=$('#userWeChat').val();
Meteor.users.update({_id:Meteor.user()._id},{$set:{"profile.wechat":id}});
    
}    
});

Template.paymentOptions.helpers({
userWeChat:function(){
return Meteor.user().profile.wechat;    
}
    
});

Template.registrationEdit.helpers({
   
    runnerInformation: function(){
     return Runners.findOne({_id:this._id});   
        
    },
    registrationTotal:function(){
     var thisRunner = Runners.findOne({_id:this._id})   
     return 100 + parseFloat(thisRunner.runnerAdditionalDonation);   
    }
    
});

Template.registrationEdit.events({

'click #updateRegistration':function(e){
 e.preventDefault();
  var registrationObject = {
    runnerRaceSelected:$('#registrationEditFormContent').find('[name=runnerRaceSelected]').val(),
    runnerFirstName: $('#registrationEditFormContent').find('[name=runnerGivenName]').val(),
    runnerLastName: $('#registrationEditFormContent').find('[name=runnerFamilyName]').val(),
    runnerAge: $('#registrationEditFormContent').find('[name=runnerAge]').val(),
    runnerGender: $('#registrationEditFormContent').find('[name=runnerGender]').val(),
    runnerPhone: $('#registrationEditFormContent').find('[name=runnerPhone]').val(),
    runnerEmail: $('#registrationEditFormContent').find('[name=runnerEmail]').val(),
    runnerEmergencyName: $('#registrationEditFormContent').find('[name=runnerEmergencyName]').val(),
    runnerEmergencyPhone: $('#registrationEditFormContent').find('[name=runnerEmergencyPhone]').val(),
    runnerEstimatedTime: $('#registrationEditFormContent').find('[name=runnerEstimatedTime]').val(),
    runnerShirtSize: $('#registrationEditFormContent').find('[name=runnerShirtSize]').val()}
    
Runners.update({_id:this._id},{$set:registrationObject},function(error,result){
        $('#updateRegistration').html('Submitting....');
            
        if(error==undefined){
        
        Router.go('/portal/');
        
        };  
});
    
},
'click #runnerEmailEdit':function(e){
alert("This email is being used to group the registrations made by this user. If you would like to use a different email, please create a different account."); 
    
}    
});

Template.registrationEdit.rendered = function(){

console.log(this);    $('#registrationEditFormContent').find('[name=runnerAge]').val(this.data.runnerAge);
     $('#registrationEditFormContent').find('[name=runnerGender]').val(this.data.runnerGender);
 
 $('#registrationEditFormContent').find('[name=runnerEstimatedTime]').val(this.data.runnerEstimatedTime);
 $('#registrationEditFormContent').find('[name=runnerShirtSize]').val(this.data.runnerShirtSize);
 $('#registrationEditFormContent').find('[name=runnerRaceSelected]').val(this.data.runnerRaceSelected);       
}



Template.confirmationPage.events({
    
    'click #registerAnother': function(){
        
     Session.set("selectedRace","");
        
    }
    
});

Template.userPortal.events({
   
    'click #addRunnerRegistration':function(e){
     
    Router.go('/registration-temp/');    
        
    }
    
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
    
Template.runnerRegistrationSummary.helpers({
 totalMenPaid: function(){
 
 return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerGender: "M",runnerHasPaid:'true'}).count();      
},

totalMenUnpaid: function(){
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerGender: "M",runnerHasPaid:'false'}).count();   
    
},
    
totalMen: function(){
    
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerGender: "M"}).count();           
},
    
    
totalWomenPaid: function(){
 runnersList = Runners.find({runnerRaceSelected: "5K Dragon Run",runnerGender: "F",runnerHasPaid:'true'}).count();   
 return runnersList;   
},

totalWomenUnpaid: function(){
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerGender: "F",runnerHasPaid:'false'}).count();   
    
},
    
totalWomen: function(){
    
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerGender: "F"}).count();           
},
    
total1KPaid: function(){
 runnersList = Runners.find({runnerRaceSelected: "1K Fun Run",runnerHasPaid:'true'}).count();   
 return runnersList;   
},

total1KUnpaid: function(){
return Runners.find({runnerRaceSelected: "1K Fun Run",runnerHasPaid:'false'}).count();   
    
},
    
total1K: function(){
    
return Runners.find({runnerRaceSelected: "1K Fun Run"}).count();           
},

num5K110: function(){
    
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerShirtSize:"110",runnerHasPaid:'true'}).count();           
},
num5K120: function(){
    
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerShirtSize:"120",runnerHasPaid:'true'}).count();           
},
num5K130: function(){
    
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerShirtSize:"130",runnerHasPaid:'true'}).count();           
},
num5KXS: function(){
    
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerShirtSize:"XS",runnerHasPaid:'true'}).count();           
},
num5KS: function(){
    
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerShirtSize:"S",runnerHasPaid:'true'}).count();           
},
num5KM: function(){
    
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerShirtSize:"M",runnerHasPaid:'true'}).count();           
},
num5KL: function(){
    
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerShirtSize:"L",runnerHasPaid:'true'}).count();           
},
num5KXL: function(){
    
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerShirtSize:"XL",runnerHasPaid:'true'}).count();           
},  

num5KXXL: function(){
    
return Runners.find({runnerRaceSelected: "5K Dragon Run",runnerShirtSize:"XXL",runnerHasPaid:'true'}).count();           
},

num1K110: function(){
    
return Runners.find({runnerRaceSelected: "1K Fun Run",runnerShirtSize:"110",runnerHasPaid:'true'}).count();           
},
num1K120: function(){
    
return Runners.find({runnerRaceSelected: "1K Fun Run",runnerShirtSize:"120",runnerHasPaid:'true'}).count();           
},
num1K130: function(){
    
return Runners.find({runnerRaceSelected: "1K Fun Run",runnerShirtSize:"130",runnerHasPaid:'true'}).count();           
},
num1KXS: function(){
    
return Runners.find({runnerRaceSelected: "1K Fun Run",runnerShirtSize:"XS",runnerHasPaid:'true'}).count();           
},
num1KS: function(){
    
return Runners.find({runnerRaceSelected: "1K Fun Run",runnerShirtSize:"S",runnerHasPaid:'true'}).count();           
},
num1KM: function(){
    
return Runners.find({runnerRaceSelected: "1K Fun Run",runnerShirtSize:"M",runnerHasPaid:'true'}).count();           
},
num1KL: function(){
    
return Runners.find({runnerRaceSelected: "1K Fun Run",runnerShirtSize:"L",runnerHasPaid:'true'}).count();           
},
num1KXL: function(){
    
return Runners.find({runnerRaceSelected: "1K Fun Run",runnerShirtSize:"XL",runnerHasPaid:'true'}).count();           
},  

num1KXXL: function(){
    
return Runners.find({runnerRaceSelected: "1K Fun Run",runnerShirtSize:"XXL",runnerHasPaid:'true'}).count();           
}
      
});


    
    
Template.registrationListDeleteEnabled.events({
  'click .deleteRunner': function(e){
   e.preventDefault();   
   var currentRunner = this;
   Runners.remove({_id:this._id});
      
  }
    
})

      
Template.paymentConfirmationFrontPage.helpers({
    
    
retrievedRecords: function(){
 var currentSearch = Session.get('currentSearchObject');
 if(currentSearch!=null){
 var runnerRecord = Runners.find(currentSearch);
 //console.log(runnerRecord.runnerFirstName);
 return runnerRecord;}
else{ return null;}
   
},
runnerPaidStatus: function(){
    
if(this.runnerHasPaid){

return "<span class = 'text-success'>Paid</span>" ;   
    
}
else{

return "<span class = 'text-danger'>Not Paid</span>";
    
}
},
runnerFee: function(){
return 100 + parseFloat(this.runnerAdditionalDonation);    
    
},
totalFee: function(){
var searchObject = Session.get('currentSearchObject');
if(searchObject){
var runners = Runners.find(searchObject)
var fee = 0;
runners.forEach(function(r){
fee += 100 + parseFloat(r.runnerAdditionalDonation);
});
return fee;
}
return null;
},
searchObject: function(){
    
return !(Session.equals('currentSearchObject',null));    
},
currentDate: function(){
var now = new Date();
return now.toLocaleDateString();
    
}
});

Template.paymentConfirmationFrontPage.rendered=function(){
    
   Session.set('currentSearchObject',null); 
};

Template.paymentConfirmationFrontPage.events({
   
    'click #submitCodeSearch': function(e){
     
     e.preventDefault();
     var currentCode = $('#paymentByCode').val();    
var searchObject = {runnerRegistrationCode:currentCode};     Session.set('currentSearchObject',searchObject);   
    $('#paymentByEmail').val('');
    $('#paymentByWeChat').val('');
    },
    'click #submitEmailSearch': function(e){
     
     e.preventDefault();
     var currentEmail = $('#paymentByEmail').val();
        
        var searchObject = {runnerEmail:currentEmail};              Session.set('currentSearchObject',searchObject);   
        $('#paymentByCode').val('');
    $('#paymentByWeChat').val('');     
    },
    'click #submitWeChatSearch': function(e){
     
     e.preventDefault();
     var WeChat = $('#paymentByWeChat').val();
    var currUser = Meteor.users.findOne({"profile.wechat":WeChat});
var searchObject = {runnerEmail:currUser.emails[0].address};    Session.set('currentSearchObject',searchObject);   
    $('#paymentByEmail').val('');
    $('#paymentByCode').val(''); 
    },
    'click .paidToggle':function(e){
        
     var newValue = !(this.runnerHasPaid);
     var paidDate = $('#paymentDate').val();
     Runners.update({_id:this._id},{$set:{runnerHasPaid:newValue,runnerPaidDate:paidDate}});
        
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
     var currentRunner = Runners.findOne({runnerRegistrationCode:Session.get('currentPaymentRegistrationCode')});
     var currentValue = Session.get('currentSelectedRunnerHasPaid');
     if(currentRunner.runnerRaceSelected=="5K Dragon Run"){
         var nextRegistrationNumber = Runners.find({runnerRaceSelected:"5K Dragon Run"},{sort:{runnerBibNumber:-1}}).fetch()[0].runnerBibNumber+1;
         Runners.update({_id:currentRunner._id},{$set:{runnerHasPaid:currentValue,runnerPaidDate:(new Date()),runnerBibNumber:nextRegistrationNumber}});
         alert("This runner is Runner #"+nextRegistrationNumber+".");
     }
     else if(currentRunner.runnerRaceSelected=="1K Fun Run"){
         var nextRegistrationNumber = Runners.find({runnerRaceSelected:"1K Fun Run",runnerBibNumber:{$gt:0}},{sort:{runnerBibNumber:1}}).fetch()[0].runnerBibNumber-1;
     Runners.update({_id:currentRunner._id},{$set:{runnerHasPaid:currentValue,runnerPaidDate:(new Date()),runnerBibNumber:nextRegistrationNumber}});
         alert("This runner is Runner #"+nextRegistrationNumber+".");
     }
     
     
    
}
});
Template.paymentConfirmationRunner.helpers({
   
    isChecked: function(){
        
     var runner = (Runners.findOne({runnerRegistrationCode:Session.get('currentPaymentRegistrationCode')}));
     if(runner){
     if(runner.runnerHasPaid=='true'){
         return true;
     }
    else{ return false;}
     }
   
        
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

Template.registrationSorted5K.helpers({
   runners: function(){return Runners.find({runnerRaceSelected:"5K Dragon Run",runnerHasPaid:'true'},{sort:{runnerBibNumber:1}})},
   runnerAgeGroup: function(){
       
    var runnerAgeValue = this.runnerAge;
    if(runnerAgeValue=='1'){
     return 'LS';   
        
    }
    else if(runnerAgeValue=='2'){
     return 'MS';   
    }
    else if(runnerAgeValue =='3'){
     return 'HS';
    }
    else{ return 'A'}
       
   }
    
    
});
Template.registrationSorted1K.helpers({
   runners: function(){return Runners.find({runnerRaceSelected:"1K Fun Run",runnerHasPaid:'true'},{sort:{runnerBibNumber:-1}})},
   runnerAgeGroup: function(){
       
    var runnerAgeValue = this.runnerAge;
    if(runnerAgeValue=='1'){
     return 'LS';   
        
    }
    else if(runnerAgeValue=='2'){
     return 'MS';   
    }
    else if(runnerAgeValue =='3'){
     return 'HS';
    }
    else{ return 'A'}
       
   }
    
    
});





var getNewRegistrationInfo = function(){
    
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
    runnerAdditionalDonation: parseFloat($('#registrationFormContent').find('[name=runnerAdditionalDonation]').val()),
    runnerHasPaid: false,
    runnerBibNumber: 0,
    runnerRaceSelected: Session.get("selectedRace"),
    runnerRegistrationCode: generateRaceCode(),
    runnerRegistrationDate: new Date(),
    year:2015
    
        
    };
    if(Meteor.user().profile==null){
    var userProfile = {
    phone:registrationObject.runnerPhone, emergencyPhone:registrationObject.runnerEmergencyPhone,
emergencyContact:registrationObject.runnerEmergencyName,
    };
        
    Meteor.users.update({_id:Meteor.user()._id},{$set:{profile:userProfile}});
    }
    
    return registrationObject;
    
}

function getRegistrationFee(){
    
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

sendRunnerNumberEmail = function(name, email, number, id){
    
var sendRunnerNumberEmailString = "Dear " + name + ",\nWe hope you are excited about the Dragon Run/Fun Run this Saturday. On behalf of the committee, I want to thank you for participating.\n\n Your official runner number for this year's event is "+ number + ". \n\nYou will be able to pick up your registration bag on Saturday between 7:00 and 7:30 AM. The race will start promptly at 8:00 AM.\n\n The bags will be given out according to this runner number, so please have it available when you arrive on Saturday. We will also have lists available for looking up your number if you forget.\n\nSee you on Saturday! \n\n Evan\n Dragon Run Registration Team"

var sendRunnerNumberSubject = 'Dragon Run/Fun Run: Runner Number '+ number;

Meteor.call('sendEmail',email,'eweinberg@scischina.org',sendRunnerNumberSubject,sendRunnerNumberEmailString);

}