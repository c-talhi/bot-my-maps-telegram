# bot-my-maps-telegram  
This repository contains the source code of my bot.  


---
<h1 align="center"><a href="https://telegram.me/MyMaps_bot">MyMaps_bot</a></h1>  
You can find my bot here: <a href="https://telegram.me/MyMaps_bot">@MyMaps_bot</a>  

### list of all command available:  
* /start  
* /help   
* /getpos 'address'  
* /jokes  
* /version  

## version  
V.0.000100  12 January 2021 12:42  

[ OpenStreetMap© contributors, ODbL 1.0. https://osm.org/copyright]  

This bot is running with https://script.google.com/, no data is saved from my script.  

## /help  
[BOT Chat]  
Use this format to get a position  
/getpos ADDRESS  
Where address is the street you want to search.  
Always try to specify the city and country.  

[Any Chat]
You can use it directly in any chat!(inline command)  
 '<a href="https://telegram.me/MyMaps_bot">@MyMaps_bot</a> address'  
Wait a moment for the request to be processed.  
If it's the position that you are looking for, then click on it!  
Otherwise, specify city and nation.  

## Source code:  
[**mymapsbot.gs**](https://github.com/c-talhi/bot-my-maps-telegram/blob/main/src/mymapsbot.gs)  

## how to implement for your bot:  
You have to first create your bot using <a href="https://telegram.me/BotFather">BotFather</a>, and set all comands as above (start, help, getpos, jokes, version)  

## 1 STEP  
Create a <a href="https://script.google.com/home">New Project</a> and rename it.

## 2 STEP  
copy [**mymapsbot.gs**](https://github.com/c-talhi/bot-my-maps-telegram/blob/main/src/mymapsbot.gs) and delete the generated file #.gs  

## 3 STEP  
Deploy your project.
Make a New Deployment, 
- select Web Application on "select type"(top left),  
- give a description name, I setted "v1".  
- on Run as set "me" 
- on Users authorized to access set "anyone"  
- after you deploy your project, you have to save your web application url. (it ends with /exec)  
   similar to this... https://script.google.com/macros/s/#ID_DEPLOYED_PROJECT_WEB_APP#/exec  


## 4 STEP 
You have to add your secret project properties. 
- In the old editor, Project property -> Script Property -> add "Service-URL" -> "value"
    where value is your web application url saved from the previous step.  

- In the old editor, Project property -> Script Property -> add "token" -> "value"
    where value is your telegram bot token id, you can get it going on your setting from the chat with <a href="https://telegram.me/BotFather">BotFather</a>  

- In the old editor, Project property -> Script Property -> add "myTelegramChatID" -> "value"
    where value is your telegram chat id

## FINAL STEP
In editor mode (new/old), select the script (mymapsbot.gs)  

and on top you have select setWebhook instead of doPost.  

- run it and it should give you in the log console:  
    {result=true, description=Webhook was set, ok=true}  

you have to try in telegram chat commands /start, /version, /help to check if everything is working as it should be.  

## considerations: 
I hope it will be useful to you  
I know it is possible to improve the code...  
future updates could be:
- the removal of the /jokes command (useless)  
- improved inline command showing more than 1 result (maybe even scrollable)  
- explore more openstreetmap parameters  
but I created it in my spare time just because I needed a bot to create a  quickly map in a group chat ...  
good luck using it!
---


---
Endorse my skills on (https://www.linkedin.com/in/chemsedintalhi/)  
  
You can find me on  
Instagram: <a href="https://www.instagram.com/chemsedintalhi/">chemsedintalhi</a>  
Twitter: <a href="https://twitter.com/wolfexfox">wolfexfox</a>  

---