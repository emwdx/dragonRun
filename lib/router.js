Router.configure({ layoutTemplate: 'mainContent',
                 loadingTemplate: 'loading'});
Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {except:[ 'registrationForm','confirmationPage','paymentConfirmationFrontPage','runnerRegistrationSummary','officialRaceTime','loginForm']});

Router.map(function() {
      
      this.route('registrationForm', {path: '/'});
      this.route('registrationNotReady',{path:'/notReady/'});
      this.route('confirmationPage', { 
          path: '/registrationConfirmation/:_id/:code/',
          data: function() { return Runners.findOne({runnerRegistrationCode:this.params.code}); },
          waitOn: function() {return Meteor.subscribe('runners', {runnerRegistrationCode:this.params.code},{} )}
      });
      this.route('registrationList',{path: '/registrationList/',
                                    data: function() { return Runners.find()},
                                    waitOn: function() {return Meteor.subscribe('runners',{},{})}});
      this.route('registrationListDeleteEnabled',{path: '/registrationListDeleteEnabled/',
                                    data: function() { return Runners.find()},
                                    waitOn: function() {return Meteor.subscribe('runners',{},{})}});
      this.route('paymentConfirmationFrontPage',{path:'/HISDrag0nRuN2O14/paymentRegistrationConfirmation/',
                                                data: function() { return Runners.find()},
                                                 waitOn: function() {return Meteor.subscribe('runners',{},{})}});
      
      this.route('paymentConfirmationRunner',{path: '/paymentConfirmation/:id/',
                                              data: function() {return Runners.findOne({_id:this.params.id})},
                                              waitOn: function() { return Meteor.subscribe('runners',{},{})}});
      this.route('unpaidRunnerEmailList', {path: '/unpaidRunnerEmailList/',
                                          waitOn: function() { return Meteor.subscribe('runners',{},{})}});
      this.route('runnerRegistrationSummary',{path:'/registrationSummary/',
                                              data: function() {return Runners.find()},
                                              waitOn: function() {return Meteor.subscribe('runners',{},{})}});
      this.route('raceConfiguration',{path:'/raceCOnfiguration/',
                                     waitOn: function() { return Meteor.subscribe('runners',{},{})}}); 
      this.route('allActiveRunners',{path:'/allActiveRunners/',
                                      data: function() { return RaceRunners.find()}});
      this.route('stoppedRunners',{path:'/stoppedRunners/',
                                      data: function() { return RaceRunners.find()}});
      this.route('officialRaceTime',{path:'/officialRaceTime/'});
      this.route('flaggingRunners',{path:'/flaggingRunners7/',
                                    data:function(){return RaceRunners.find()}});
      this.route('flaggerPortal', {path:'/flaggerNumber/:flaggerIndex/',
                                   waitOn: function(){ Session.set("currentFlagIndex",this.params.flaggerIndex)}});
      this.route('registrationSorted5K',{path:'/registration5ksort/number/',
                                      waitOn: function(){ return Meteor.subscribe('runners',{},{})},
                                       data:function(){return Runners.find()}});
      this.route('registrationSorted1K',{path:'/registration1ksort/number/',
                                      waitOn: function(){ return Meteor.subscribe('runners',{},{})},
                                       data:function(){return Runners.find()}});
      this.route('loginForm',{path:'/login/'});
          
                                     
        
  });

function requireLogin(pause) { if (! Meteor.user()) {

Session.set('currentURL',Router.current().path);
if (Meteor.loggingIn()) this.render(this.loadingTemplate);
else Router.go('/login/');



 }
}
