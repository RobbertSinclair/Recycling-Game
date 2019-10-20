const http = require('http');
const express = require("express");
const app = express();
const server = http.Server(app);
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const bodyParser = require("body-parser");
app.use(bodyParser());




app.all('/', function(req,res){
    const twiml = new VoiceResponse();
    const man = "man";
    const language = "en-UK"

    /*twiml.say({voice:man, language:language}, 'Hello Flat B. I hope you enjoy this sweet tune:')
    twiml.play({loop:1}, "https://patriarch-pigeon-9605.twil.io/assets/rick.mp3.mp3")
    twiml.say( "Welcome to the recycling game");
    twiml.say("This is where we test your knowledge on what to recycle.");
    twiml.say("Did you know that the average Brit throws away 400 kilograms of waste every year");
    twiml.play("https://patriarch-pigeon-9605.twil.io/assets/Dump_Truck-Mike_Koenig-2078569453.mp3")
    twiml.say("Almost the same as 4 Large Pandas");*/
    twiml.say("To start with can I have your name please?");
    const name = twiml.gather({input: 'speech', action:'/gatherName'}).toString();

    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
})



app.all('/gatherName', function(req,res){
    const twiml = new VoiceResponse();
    console.log(req);
    const name = req.body.SpeechResult;
    console.log(name);

    twiml.say(`So your name is: ${name}? Please enter yes or no.`)
    twiml.gather({input: 'speech', action:'/nameyesno'})
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
})

app.all('/nameyesno', function(req,res){
    const twiml = new VoiceResponse();
    const answer = req.body.SpeechResult;
    console.log(answer);
    if(answer == "Yes" || answer == "Yes." || answer == "Yeah." || answer.includes("Yes"))
    {
        twiml.say("OK we can continue");
        twiml.say("Question 1: True or False: Paper is Recyclable. Say yes for true. Say no for false");
        twiml.gather({input: 'Speech', action:'/q1answer'})
    }
    else
    {
        twiml.say("Please say your name again")
        twiml.gather({input: 'speech', action:'/gatherName'})
    }
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());


})

app.all('/q1answer', function(req, res) {
    const twiml = new VoiceResponse();
    const answer = req.body.SpeechResult;
    console.log(answer)
    if(answer.includes("yes") || answer.includes("true") || answer.includes("Yes"))
    {
        twiml.say("You selected true");
        twiml.say("You are correct");
        twiml.say("Paper can be recycled. However You cannot recycle shredded paper.");



    }
    else if (answer.includes("no") || answer.includes("false") || answer.includes("No"))
    {
       twiml.say("You selected false");
       twiml.play("https://patriarch-pigeon-9605.twil.io/assets/wrong-buzzer-sound-effect.mp3");
       twiml.say("You are incorrect");
       twiml.say("OK next question: ");
    }
    else
    {
        twiml.say("I'm sorry but I didn't quite get your answer. Please enter true or false")
        twiml.gather({input:'speech', action:'/q1answer'})
    }
    twiml.say("We are now ready for question 2");

    twiml.say("Question 2: What colour is the recycling bin?");
    twiml.say("Is it:")

    const answers = ["A: Green", "B: Red", "or C: Blue"];
    for(i = 0; i < answer.length; i++)
    {
        twiml.say(answers[i]);
    }
    function gather()
    {
        const answer = twiml.gather({numDigits: 1});
        answer.say("If you think the answer is A: Press 1. If you think the answer is B: Press 2. If you think the answer is C Press 3");



    }
    if(req.body.Digits) {
        switch(req.body.Digits){
            case '1':
                twiml.say("You selected A.");
                twiml.play("https://patriarch-pigeon-9605.twil.io/assets/wrong-buzzer-sound-effect.mp3");
                twiml.say("I'm sorry but that is not the case. The correct answer is C");
                break;
            case '2':
                twiml.say("You selected B.");
                twiml.play("https://patriarch-pigeon-9605.twil.io/assets/wrong-buzzer-sound-effect.mp3");
                twiml.say("I'm sorry but that is not the case. The correct answer is C");
                break;
            case '3':
                twiml.say("You selected C");
                twiml.say("You are correct");
                twiml.say("You put your recycling in the blue bin");
                break;
            default:
                twiml.say("I'm sorry but that is not a valid input");
                twiml.say("Please try again");
                gather();
                break;

        }

    }
    else
    {
        gather();
    }


    res.writeHead(200, {'Content-Type': 'text/xml'})
    res.end(twiml.toString());
})



server.listen(1337, '127.0.0.1')

console.log("TwiML server running at http://127.0.0.1:1337/");
