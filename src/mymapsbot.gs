var token = PropertiesService.getScriptProperties().getProperty('token');
var myTelegramChatID = PropertiesService.getScriptProperties().getProperty('myTelegramChatID');
var version = "\nV.0.000100  12 January 2021 12:42\n";

function doPost(e) {
  // Make sure to only reply to json requests
  if(e.postData.type == "application/json") {
    var update = JSON.parse(e.postData.contents);
    // Instantiate our bot passing the update 
    var bot = new Bot(token, update);
    var bus;
    if (typeof(update["message"]) == 'undefined') {
      if(typeof(update["inline_query"]) != 'undefined'){
         bus = new InlineQueryBus();
         bus.on(/\w+/g, function(){
          var coords = getCoordsFromOSMaps(update.inline_query.query);
          if(coords){
            this.sendInlineVenue(parseFloat(coords.latitude), parseFloat(coords.longitude), '"'+coords.location.substring(1).split(",")[0]+" "+coords.location.split(",")[1]+'"',coords.location); 
          }else{
            this.sendInlineArticle("Location is not available.","Location is not available.");
          }
        }); 
      } 
    }else{
      // Building commands
      bus = new CommandBus();
      bus.on(/\/start/, function () {
        this.replyToSender("\uD83D\uDD39 Welcome "+this.update.message.from.first_name+"\uD83D\uDD39\n"+
                           "This bot helps you send positions to you or directly in a chat.\n"+
                           "I recommend to check the '/help ' command for new users.\n");
      });

      
      bus.on(/\/joke\s*([A-Za-z0-9_]+)?\s*([A-Za-z0-9_]+)?/, randomJoke);
      
      bus.on(/\/getpos/, function(){
        var text = this.update.message.text.substring(7).trim(); //remove '/getpos' and trim the message.
        if(text){
          var coords = getCoordsFromGMaps(text);
          if(coords){
            this.sendVenue(coords.latitude, coords.longitude, '"'+coords.location.substring(1).split(",")[0]+" "+coords.location.split(",")[1]+'"',coords.location);
          }else{
            this.replyToSender("Something is wrong with the request!\nTry again something like that\n/getpos ADDRESS\nwhere address is the street you want to search. Otherwise try to specify city, country.\n");
          }
        }else{
          this.replyToSender("Something is wrong with the request!\nTry again something like that\n/getpos ADDRESS\nwhere address is the street you want to search.");
        }
      });
      
      bus.on(/\/version/, function(){
        this.replyToSender(version+"\n[ OpenStreetMap© contributors, ODbL 1.0. https://osm.org/copyright]\n"
                                          +"\nThis bot is running with https://script.google.com/, no data is saved from my script.\n");
//      this.replyToSender(version+"\nGoogle Maps [spoiler update: implementation with OpenStreetMap]\n"
//                                         +"\nThis bot is running with https://script.google.com/, no data is saved from my script.\n");
      });
      
      bus.on(/\/help/,function(){
        this.
        replyToSender("[BOT Chat]\nUse this format to get a position\n/getpos ADDRESS\nWhere address is the street you want to search.\n"
                           +"Always try to specify the city and country.\n\n"
                           +"[Any Chat]\nYou can use it directly in any chat!(inline command)\n '@mymaps_bot address'\n"
                           +"Wait a moment for the request to be processed.\n"
                           +"If it's the position that you are looking for, then click on it!\nOtherwise, specify city and nation.");
      }); 
     }
    
    // Register the command bus
    bot.register(bus);
    // If the update is valid, process it
    if (update) {
      bot.process();
    }   
  }
}
function doGet(){
}

function setWebhook() {
  Logger.log(token);
  var bot = new Bot(token, {});
  var result = bot.request('setWebhook', {
    url: PropertiesService.getScriptProperties().getProperty('Service-URL')
  });
  Logger.log(result);
}

function randomJoke(name, surname) {
  var firstName = this.update.message.from.first_name || null;
  var lastName = this.update.message.from.last_name || null;
  var url = 'http://api.icndb.com/jokes/random?escape=javascript';
  
  if (firstName) url += '&firstName=' + firstName;
  if (lastName) url += '&lastName=' + lastName;
  
  var data = JSON.parse(UrlFetchApp.fetch(url).getContentText());

  this.replyToSender(data.value.joke);
}
function sendLogUpdateInChat(update){
  var url = "https://api.telegram.org/bot"+token+"/sendMessage?chat_id="+myTelegramChatID+"&text=update_";
  var txt = encodeURIComponent(Utilities.jsonStringify(update));
  UrlFetchApp.fetch(url+txt).getAllHeaders();
}
function sendLogTextInChat(text){
  var url = "https://api.telegram.org/bot"+token+"/sendMessage?chat_id="+myTelegramChatID+"&text=update_";
  var txt = text;
  UrlFetchApp.fetch(url+txt).getAllHeaders();
}
//GOOGLE MAPS HTML REQUEST (NOT API)
function getCoordsFromGMaps(address){
  var query = address.replace(/\s/g, "+"); //convert spaces in '+'
  var url="https://maps.google.com/?q="+query; 
  
  //GET HTML from the url, with all content.
  var page = UrlFetchApp.fetch(url).getContentText();
  var firstSplit = page.split("https://www.google.com/maps/preview/place/")[1];
  if(firstSplit){
    var location = firstSplit.split("@")[0].replace(/[+\/]/g," ").trim();
    
    var coords = firstSplit.split("@")[1];
    return {"latitude":coords.split(",")[0],"longitude":coords.split(",")[1],"location":'"'+location+'"'};
  }
  return null;
}
//OPENSTREETMAPS  
function getCoordsFromOSMaps(address){
  var query = address.replace(/\s/g, "+"); //convert spaces in '+'
  var url="https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q="+query; 
  
  var data = JSON.parse(UrlFetchApp.fetch(url).getContentText());
  if(data){
    var location = data[0].address.road+", ";
    if(typeof(data[0].address.house_number) != 'undefined'){
      location += data[0].address.house_number+", ";
    }
    location += data[0].address.postcode+" "+data[0].address.city+" "+data[0].address.county+", "+data[0].address.country;
    return {"latitude":data[0].lat,"longitude":data[0].lon,"location":'"'+location+'"'};
  }
  return null;
}

function Bot (token, update) {
  this.token = token;
  this.update = update;
  this.handlers = [];
}

Bot.prototype.register = function ( handler) {
  this.handlers.push(handler);
}

Bot.prototype.process = function () {  
  for (var i in this.handlers) {
    var event = this.handlers[i];
    var result = event.condition(this);
    if (result) {
      return event.handle(this);
    }
  }
}

Bot.prototype.request = function (method, data) {
  var options = {
    'method' : 'post',
    'contentType': 'application/json',
    'payload' : JSON.stringify(data)
  };
  try{
  var response= UrlFetchApp.fetch('https://api.telegram.org/bot' + this.token + '/' + method, options);
  }catch(err){
    sendLogUpdateInChat(err);
  }
  if (response.getResponseCode() == 200) {
    return JSON.parse(response.getContentText());
  }
  
  return false;
}

Bot.prototype.replyToSender = function (text) {
  return this.request('sendMessage', {
    'chat_id': this.update.message.from.id,
    'text': text
  });
}

Bot.prototype.sendLocation = function(latitude, longitude){
  return this.request('sendLocation',{
    'chat_id': this.update.message.from.id,
    'latitude': latitude,
    'longitude': longitude
  });
} 

Bot.prototype.sendVenue = function(latitude, longitude, title, address){
  return this.request('sendVenue',{
    'chat_id': this.update.message.from.id,
    'latitude': latitude,
    'longitude': longitude,
    'title': title,
    'address': address
  });
}

Bot.prototype.sendInlineVenue = function(latitude, longitude, title, address){
  return this.request('answerInlineQuery',
                      {'inline_query_id':this.update.inline_query.id,
                        'results':[{
                              'type':'venue',
                              'id':'0',
                              'latitude':latitude,
                              'longitude':longitude,
                              'title':title,
                              'address':address
                          }]
                      });
}
Bot.prototype.sendInlineArticle=function(title,message_text){
  return this.request('answerInlineQuery',
                      {'inline_query_id':this.update.inline_query.id,
                      'results':[{
                              'type':'article',
                              'id':'0',
                              'title':title,
                              'message_text':message_text
                          }]
                      });
}
function CommandBus() {
  this.commands = [];
}

CommandBus.prototype.on = function (regexp, callback) {
  this.commands.push({'regexp': regexp, 'callback': callback});
}

CommandBus.prototype.condition = function (bot) {
  return bot.update.message.text.charAt(0) === '/' ;
}
CommandBus.prototype.handle = function (bot) { 
  for (var i in this.commands) {
    var cmd = this.commands[i];
    var tokens = cmd.regexp.exec(bot.update.message.text);
    if (tokens != null) {
      return cmd.callback.apply(bot, tokens.splice(1));
    }
  }
  return bot.replyToSender("Invalid command");
}
function InlineQueryBus(){
  this.commands = [];
}
InlineQueryBus.prototype.on = function (regexp, callback) {
  this.commands.push({'regexp': regexp, 'callback': callback});
}

InlineQueryBus.prototype.condition = function (bot) {
  return bot.update.inline_query.query;
}
InlineQueryBus.prototype.handle = function (bot) { 
  for (var i in this.commands) {
    var cmd = this.commands[i];
    var tokens = cmd.regexp.exec(bot.update.inline_query.query);
    if (tokens != null) {
      return cmd.callback.apply(bot, tokens.splice(1));
    }
  }
}