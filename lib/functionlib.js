Runners = new Meteor.Collection('runners');
systemVariables = new Meteor.Collection('systemVariables');
RaceRunners = new Meteor.Collection('racerunners');
Accounts.config({forbidClientAccountCreation: true}); 

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