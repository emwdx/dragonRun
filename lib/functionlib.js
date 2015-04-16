Runners = new Meteor.Collection('runners');
systemVariables = new Meteor.Collection('systemVariables');
RaceRunners = new Meteor.Collection('racerunners');

var mySubmitFunc = function(error, state){
  if (!error) {
    if (state === "signIn") {
      Router.go('/portal/');
    }
    if (state === "signUp") {
      Router.go('/registration-temp/');
    }
  }
};

//Accounts.config({forbidClientAccountCreation: true}); 

/*
var numOfSpotters = systemVariables.findOne({name:"numOfSpotters"})
if(!numOfSpotters){
systemVariables.insert({name:"numOfSpotters",value:4})
}


var currentSpotterIndex = systemVariables.findOne({name:"currentSpotterIndex"})
if(!currentSpotterIndex){
systemVariables.insert({name:"currentSpotterIndex",value:4})
}

*/


AccountsTemplates.configureRoute('signIn', {
    name: 'signIn',
    path: '/account',
    redirect: '/portal/'
});

AccountsTemplates.configureRoute('signUp', {
    name: 'signUp',
    redirect: '/registration-temp/'
});

AccountsTemplates.configureRoute('forgotPwd', {
    name: 'forgotPwd',
    redirect: '/forgot-password'
});

AccountsTemplates.configureRoute('forgotPwd', {
    name: 'resetPwd',
    redirect: '/reset-password/'
});



AccountsTemplates.configure({
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: true,
    lowercaseUsername: false,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: true,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',
    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Hooks
    //onLogoutHook: myLogoutFunc,
    onSubmitHook: mySubmitFunc,

    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Password",
          signUp: "Create an account for the Dragon Run:",
          signIn:"Please sign in to continue:"
      },
    },
});

