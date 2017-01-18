"use strict";
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var GAME_LENGTH = 10;  // The number of questions per trivia game.
var GAME_STATES = {
    TRIVIA: "_TRIVIAMODE", // Asking trivia questions.
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

var numbers = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

//multilanguage support
var languageString = {
    "en-GB": {
        "translation": {
            "GAME_NAME" : "office supply memory", // Be sure to change this for your skill.
            "HELP_MESSAGE": "I will give you up to %s different office supplies. You have to repeat them. " +
            "To start a new game at any time, say, start game. ",
            "REPEAT_QUESTION_MESSAGE": "To repeat the last office supply, say, repeat. ",
            "ASK_MESSAGE_START": "Would you like to start playing?",
            "HELP_REPROMPT": "To get to the next stage, repeat all the supplies I already gave to you. ",
            "STOP_MESSAGE": "Would you like to keep playing?",
            "CANCEL_MESSAGE": "Ok, let\'s play again soon.",
            "NO_MESSAGE": "Ok, we\'ll play another time. Goodbye!",
            "TRIVIA_UNHANDLED": "Try saying the office supplies",
            "HELP_UNHANDLED": "Say yes to continue, or no to end the game.",
            "START_UNHANDLED": "Say start to start a new game.",
            "NEW_GAME_MESSAGE": "Welcome to %s. ",
            "WELCOME_MESSAGE": "I will give you up to %s different office supplies. You have to repeat them. " +
            "Let\'s begin with level 1. ",
            "ANSWER_CORRECT_MESSAGE": "correct. ",
            "ANSWER_WRONG_MESSAGE": "wrong. ",
            "CORRECT_ANSWER_MESSAGE": "The correct office supply is %s. ",
            "ANSWER_IS_MESSAGE": "That answer is ",
            "TELL_QUESTION_MESSAGE": "office supply %s. %s ",
            "GAME_OVER_MESSAGE": "You got %s out of %s office supplies correct. Thank you for playing!",
            "SCORE_IS_MESSAGE": "You remembered %s office supplies correctly",
            "NEXT_LEVEL_MESSAGE": "At the next level you have to remeber %s office supplies!"
        }
    },
    "en-US": {
        "translation": {
            "GAME_NAME" : "office supply memory", // Be sure to change this for your skill.
            "HELP_MESSAGE": "I will give you up to %s different office supplies. You have to repeat them. " +
            "To start a new game at any time, say, start game. ",
            "REPEAT_QUESTION_MESSAGE": "To repeat the last office supply, say, repeat. ",
            "ASK_MESSAGE_START": "Would you like to start playing?",
            "HELP_REPROMPT": "To get to the next stage, repeat all the supplies I already gave to you. ",
            "STOP_MESSAGE": "Would you like to keep playing?",
            "CANCEL_MESSAGE": "Ok, let\'s play again soon.",
            "NO_MESSAGE": "Ok, we\'ll play another time. Goodbye!",
            "TRIVIA_UNHANDLED": "Try saying the office supplies",
            "HELP_UNHANDLED": "Say yes to continue, or no to end the game.",
            "START_UNHANDLED": "Say start to start a new game.",
            "NEW_GAME_MESSAGE": "Welcome to %s. ",
            "WELCOME_MESSAGE": "I will give you up to %s different office supplies. You have to repeat them. " +
            "Let\'s begin with level 1. ",
            "ANSWER_CORRECT_MESSAGE": "correct. ",
            "ANSWER_WRONG_MESSAGE": "wrong. ",
            "CORRECT_ANSWER_MESSAGE": "The correct office supply is %s. ",
            "ANSWER_IS_MESSAGE": "That answer is ",
            "TELL_QUESTION_MESSAGE": "office supply %s. %s ",
            "GAME_OVER_MESSAGE": "You got %s out of %s office supplies correct. Thank you for playing!",
            "SCORE_IS_MESSAGE": "You remembered %s office supplies correctly",
            "NEXT_LEVEL_MESSAGE": "At the next level you have to remeber %s office supplies!"
        }
    },
    "de-DE": {
        "translation": {
            "GAME_NAME" : "Büroartikel Memory", // Be sure to change this for your skill.
            "HELP_MESSAGE": "Ich nenne dir bis zu %s verschiedene Büroartikel. Du musst diese wiederholen. " +
            "Um ein neues Spiel zu starten, sage einfach „Spiel starten“. ",
            "REPEAT_QUESTION_MESSAGE": "Wenn die letzte Frage wiederholt werden soll, sage „Wiederholen“ ",
            "ASK_MESSAGE_START": "Möchten Sie beginnen?",
            "HELP_REPROMPT": "Um in das nächste Level zu kommen, musst du alle Büroartikel wiederholen, die ich dir genannt habe. ",
            "STOP_MESSAGE": "Möchtest du weiterspielen?",
            "CANCEL_MESSAGE": "OK, dann lass uns bald mal wieder spielen.",
            "NO_MESSAGE": "OK, spielen wir ein andermal. Auf Wiedersehen!",
            "TRIVIA_UNHANDLED": "Versuch dich an ein Büroartikel zu erinnern.",
            "HELP_UNHANDLED": "Sage ja, um fortzufahren, oder nein, um das Spiel zu beenden.",
            "START_UNHANDLED": "Du kannst jederzeit ein neues Spiel beginnen, sage einfach „Spiel starten“.",
            "NEW_GAME_MESSAGE": "Willkommen bei %s. ",
            "WELCOME_MESSAGE": "Ich nenne dir bis zu %s verschiedene Büroartikel. Du musst diese wiederholen.  " +
            "Lass uns mit Level eins starten. ",
            "ANSWER_CORRECT_MESSAGE": "richtig. ",
            "ANSWER_WRONG_MESSAGE": "falsch. ",
            "CORRECT_ANSWER_MESSAGE": "Die richtigen Büroartikel waren %s. ",
            "ANSWER_IS_MESSAGE": "Die Antwort ist ",
            "TELL_QUESTION_MESSAGE": "Büroartikel %s. %s ",
            "GAME_OVER_MESSAGE": "Du hast dir %s von %s Büroartikel richtig gemerkt. Danke fürs Spielen!",
            "SCORE_IS_MESSAGE": "Du hast dir %s Büroartikel richtig gemerkt",
            "NEXT_LEVEL_MESSAGE": "Im nächsten Level musst du dir %s Büroartikel merken!"
        }
    }
};

var Alexa = require("alexa-sdk");
var APP_ID = undefined;

//entry point for handlers
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageString;
    alexa.registerHandlers(newSessionHandlers, startStateHandlers, triviaStateHandlers, helpStateHandlers);
    alexa.execute();
};

//basic handlers
var newSessionHandlers = {
    "LaunchRequest": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", true);
    },
    "AMAZON.StartOverIntent": function() {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", true);
    },
    "AMAZON.HelpIntent": function() {
        this.handler.state = GAME_STATES.HELP;
        this.emitWithState("helpTheUser", true);
    },
    "Unhandled": function () {
        var speechOutput = this.t("START_UNHANDLED");
        this.emit(":ask", speechOutput, speechOutput);
    }
};

//start handler for starting the skill
var startStateHandlers = Alexa.CreateStateHandler(GAME_STATES.START, {
    "StartGame": function (newGame) {
        var speechOutput = newGame ? this.t("NEW_GAME_MESSAGE", this.t("GAME_NAME")) + this.t("WELCOME_MESSAGE", GAME_LENGTH.toString()) : "";
        
        //generate memory list
        var officeSupplies = generateOfficeSuppliesOrdering();
        
        // build up text for alexa
        var currentSupplyIndex = 0;
        var spokenOfficeSupply = officeSupplies[currentSupplyIndex];
        var repromptText = this.t("TELL_QUESTION_MESSAGE", "1", spokenOfficeSupply);

        speechOutput += repromptText;

        Object.assign(this.attributes, {
            "speechOutput": repromptText,
            "repromptText": repromptText,
            "officeSupplies": officeSupplies,
            "score": 0,
            "currentSupplyIndex": 0
        });

        // Set the current state to trivia mode. The skill will now use handlers defined in triviaStateHandlers
        this.handler.state = GAME_STATES.TRIVIA;
        this.emit(":askWithCard", speechOutput, repromptText, this.t("GAME_NAME"), repromptText);
    }
});

//proxy for handlers
var triviaStateHandlers = Alexa.CreateStateHandler(GAME_STATES.TRIVIA, {
    "SupplyIntent": function () {
        handleUserGuess.call(this, false);
    },
    "AMAZON.StartOverIntent": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", false);
    },
    "AMAZON.RepeatIntent": function () {
        this.emit(":ask", this.attributes["speechOutput"], this.attributes["repromptText"]);
    },
    "AMAZON.HelpIntent": function () {
        this.handler.state = GAME_STATES.HELP;
        this.emitWithState("helpTheUser", false);
    },
    "AMAZON.StopIntent": function () {
        this.handler.state = GAME_STATES.HELP;
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.CancelIntent": function () {
        this.emit(":tell", this.t("CANCEL_MESSAGE"));
    },
    "Unhandled": function () {
        var speechOutput = this.t("TRIVIA_UNHANDLED");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in trivia state: " + this.event.request.reason);
    }
});

//handlers for help
var helpStateHandlers = Alexa.CreateStateHandler(GAME_STATES.HELP, {
    "helpTheUser": function (newGame) {
        var askMessage = newGame ? this.t("ASK_MESSAGE_START") : this.t("REPEAT_QUESTION_MESSAGE") + this.t("STOP_MESSAGE");
        var speechOutput = this.t("HELP_MESSAGE", GAME_LENGTH) + askMessage;
        var repromptText = this.t("HELP_REPROMPT") + askMessage;
        this.emit(":ask", speechOutput, repromptText);
    },
    "AMAZON.StartOverIntent": function () {
        this.handler.state = GAME_STATES.START;
        this.emitWithState("StartGame", false);
    },
    "AMAZON.RepeatIntent": function () {
        var newGame = (this.attributes["speechOutput"] && this.attributes["repromptText"]) ? false : true;
        this.emitWithState("helpTheUser", newGame);
    },
    "AMAZON.HelpIntent": function() {
        var newGame = (this.attributes["speechOutput"] && this.attributes["repromptText"]) ? false : true;
        this.emitWithState("helpTheUser", newGame);
    },
    "AMAZON.YesIntent": function() {
        if (this.attributes["speechOutput"] && this.attributes["repromptText"]) {
            this.handler.state = GAME_STATES.TRIVIA;
            this.emitWithState("AMAZON.RepeatIntent");
        } else {
            this.handler.state = GAME_STATES.START;
            this.emitWithState("StartGame", false);
        }
    },
    "AMAZON.NoIntent": function() {
        var speechOutput = this.t("NO_MESSAGE");
        this.emit(":tell", speechOutput);
    },
    "AMAZON.StopIntent": function () {
        var speechOutput = this.t("STOP_MESSAGE");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "AMAZON.CancelIntent": function () {
        this.handler.state = GAME_STATES.TRIVIA;
        this.emitWithState("AMAZON.RepeatIntent");
    },
    "Unhandled": function () {
        var speechOutput = this.t("HELP_UNHANDLED");
        this.emit(":ask", speechOutput, speechOutput);
    },
    "SessionEndedRequest": function () {
        console.log("Session ended in help state: " + this.event.request.reason);
    }
});

//handler for answers
function handleUserGuess(userGaveUp) {

    var speechOutput = "";
    var speechOutputAnalysis = "";

    var officeSupplies = this.attributes.officeSupplies;
    var currentScore = parseInt(this.attributes.score);
    var currentSupplyIndex = parseInt(this.attributes.currentSupplyIndex);
    var repromptText = this.attributes.repromptText;
    var spokenOfficeSupply = "";
    var correctOfficeSupplies = "";
    var newQuestions = false;

    var ok =  this.event.request.intent.slots["Supply"].value.toLowerCase() == officeSupplies[currentSupplyIndex].toLowerCase();

    // check if user says right order
    if ( ok ) {

        if (currentSupplyIndex == currentScore) {
            currentScore++;
            newQuestions = true;
        }
        else {
            currentSupplyIndex++;
        }

        speechOutputAnalysis = this.t("ANSWER_CORRECT_MESSAGE");
    } else {
        if (!userGaveUp) {
            speechOutputAnalysis = this.t("ANSWER_WRONG_MESSAGE");
        }

        for (var i = 0; (i < currentScore + 1); i++){
            correctOfficeSupplies += officeSupplies[i] + " and ";
        }

        speechOutputAnalysis += this.t("CORRECT_ANSWER_MESSAGE", correctOfficeSupplies);

    }

    // Check if we can exit the game session after we reached GAME_LENGTH
    if (currentScore == GAME_LENGTH || !ok) {
        speechOutput = (userGaveUp || !ok) ? "" : this.t("ANSWER_IS_MESSAGE");
        speechOutput += speechOutputAnalysis + this.t("GAME_OVER_MESSAGE", currentScore.toString(), GAME_LENGTH.toString());
        this.emit(":tell", speechOutput);
    } else {

        // game has not finished yet, so we have to give new supplies to the user
        if (newQuestions) {
            speechOutput += speechOutputAnalysis + this.t("SCORE_IS_MESSAGE", currentScore.toString()) + " " + this.t("NEXT_LEVEL_MESSAGE", currentScore + 1);

            officeSupplies = generateOfficeSuppliesOrdering();
            for (var i = 0; (i < currentScore + 1); i++){
                spokenOfficeSupply += officeSupplies[i] + " ";
            }

            repromptText = spokenOfficeSupply;

            speechOutput += " " + spokenOfficeSupply;

            Object.assign(this.attributes, {
                "speechOutput": repromptText,
                "repromptText": repromptText,
                "officeSupplies": officeSupplies,
                "score": currentScore,
                "currentSupplyIndex": 0
            });
            this.emit(":askWithCard", speechOutput, repromptText, this.t("GAME_NAME"), repromptText);
        }
        else {
            Object.assign(this.attributes, {
                "speechOutput": repromptText,
                "repromptText": repromptText,
                "officeSupplies": officeSupplies,
                "score": currentScore,
                "currentSupplyIndex": currentSupplyIndex
            });
            speechOutput += speechOutputAnalysis;
            this.emit(":askWithCard", speechOutput, speechOutput, this.t("GAME_NAME"), speechOutput);
        }

    }
}

//gerate the list for memory game
function generateOfficeSuppliesOrdering() {
    var officeSupplies = [];
    var indexList = [
        "stapler",
        "staple",
        "binder clip",
        "paper clip",
        "scissor",
        "ruler",
        "index card",
        "staple remover",
        "paper trimmer",
        "clipboard",
        "pen",
        "notebook",
        "copy paper",
        "ink cartridge",
        "toner cartridge",
        "diary",
        "journal",
        "calender",
        "marker",
        "eraser",
        "binder",
        "file folder",
        "file storage",
        "report covers",
        "accordion folder"
    ];

    var index = GAME_LENGTH;

    // Pick GAME_LENGTH random questions from the list to ask the user, make sure there are no repeats.
    for (var j = 0; j < GAME_LENGTH; j++){
        var rand = Math.floor(Math.random() * index);
        index -= 1;

        var temp = indexList[index];
        indexList[index] = indexList[rand];
        indexList[rand] = temp;
        officeSupplies.push(indexList[index]);
    }

    return officeSupplies;
}
