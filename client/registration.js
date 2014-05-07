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

