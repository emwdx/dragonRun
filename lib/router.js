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
      this.route('registrationListDeleteEnabled',{path: '/registrationListDeleteEnabled/',
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
      this.route('runnerRegistrationSummary',{path:'/registrationSummary/',
                                              data: function() {return Runners.find()},
                                              waitOn: function() {return Meteor.subscribe('runners')}});
      this.route('raceConfiguration',{path:'/raceCOnfiguration/',
                                     waitOn: function() { return Meteor.subscribe('runners')}}); 
      this.route('allActiveRunners',{path:'/allActiveRunners/',
                                      data: function() { return RaceRunners.find()}});
      this.route('stoppedRunners',{path:'/stoppedRunners/',
                                      data: function() { return RaceRunners.find()}});
      this.route('officialRaceTime',{path:'/officialRaceTime/'});
      this.route('flaggingRunners',{path:'/flaggingRunners7/',
                                    data:function(){return RaceRunners.find()}});
      this.route('flaggerPortal', {path:'/flaggerNumber/:flaggerIndex/',
                                   waitOn: function(){ Session.set("currentFlagIndex",this.params.flaggerIndex)}});
          
                                     
        
  });