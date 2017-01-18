"use strict";
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

var GAME_LENGTH = 10;  // The number of questions per trivia game.
var GAME_STATES = {
    TRIVIA: "_TRIVIAMODE", // Asking trivia questions.
    START: "_STARTMODE", // Entry point, start the game.
    HELP: "_HELPMODE" // The user is asking for help.
};

var numbers = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

var languageString = {
    "en-GB": {
        "translation": {
            "GAME_NAME" : "soccer team memory for the german bundesliga", // Be sure to change this for your skill.
            "HELP_MESSAGE": "I will give you up to %s different teams from the german bundesliga. You have to repeat them. " +
            "To start a new game at any time, say, start game. ",
            "REPEAT_QUESTION_MESSAGE": "To repeat the last team, say, repeat. ",
            "ASK_MESSAGE_START": "Would you like to start playing?",
            "HELP_REPROMPT": "To get to the next stage, repeat all the names of the teams I already gave to you. ",
            "STOP_MESSAGE": "Would you like to keep playing?",
            "CANCEL_MESSAGE": "Ok, let\'s play again soon.",
            "NO_MESSAGE": "Ok, we\'ll play another time. Goodbye!",
            "TRIVIA_UNHANDLED": "Try saying the name of the bundesliga teams",
            "HELP_UNHANDLED": "Say yes to continue, or no to end the game.",
            "START_UNHANDLED": "Say start to start a new game.",
            "NEW_GAME_MESSAGE": "Welcome to %s. ",
            "WELCOME_MESSAGE": "I will give you up to %s different teams from the german bundesliga. You have to repeat them. " +
            "Let\'s begin with level 1. ",
            "ANSWER_CORRECT_MESSAGE": "correct. ",
            "ANSWER_WRONG_MESSAGE": "wrong. ",
            "CORRECT_ANSWER_MESSAGE": "The correct team is %s. ",
            "ANSWER_IS_MESSAGE": "That answer is ",
            "TELL_QUESTION_MESSAGE": "Team %s. %s ",
            "GAME_OVER_MESSAGE": "You got %s out of %s teams correct. Thank you for playing!",
            "SCORE_IS_MESSAGE": "You remembered %s teams correctly",
            "NEXT_LEVEL_MESSAGE": "At the next level you have to remeber %s teams!"
        }
    },
    "en-US": {
        "translation": {
            "GAME_NAME" : "soccer team memory for the german bundesliga", // Be sure to change this for your skill.
            "HELP_MESSAGE": "I will give you up to %s different teams from the german bundesliga. You have to repeat them. " +
            "To start a new game at any time, say, start game. ",
            "REPEAT_QUESTION_MESSAGE": "To repeat the last team, say, repeat. ",
            "ASK_MESSAGE_START": "Would you like to start playing?",
            "HELP_REPROMPT": "To get to the next stage, repeat all the names of the teams I already gave to you. ",
            "STOP_MESSAGE": "Would you like to keep playing?",
            "CANCEL_MESSAGE": "Ok, let\'s play again soon.",
            "NO_MESSAGE": "Ok, we\'ll play another time. Goodbye!",
            "TRIVIA_UNHANDLED": "Try saying the name of the bundesliga teams",
            "HELP_UNHANDLED": "Say yes to continue, or no to end the game.",
            "START_UNHANDLED": "Say start to start a new game.",
            "NEW_GAME_MESSAGE": "Welcome to %s. ",
            "WELCOME_MESSAGE": "I will give you up to %s different teams from the german bundesliga. You have to repeat them. " +
            "Let\'s begin with level 1. ",
            "ANSWER_CORRECT_MESSAGE": "correct. ",
            "ANSWER_WRONG_MESSAGE": "wrong. ",
            "CORRECT_ANSWER_MESSAGE": "The correct teams are %s. ",
            "ANSWER_IS_MESSAGE": "That answer is ",
            "TELL_QUESTION_MESSAGE": "Team %s. %s ",
            "GAME_OVER_MESSAGE": "You got %s out of %s teams correct. Thank you for playing!",
            "SCORE_IS_MESSAGE": "You remembered %s teams correctly",
            "NEXT_LEVEL_MESSAGE": "At the next level you have to remember %s teams!"
        }
    },
    "de-DE": {
        "translation": {
            "GAME_NAME" : "Fußball Team Memory für die deutsche Bundesliga", // Be sure to change this for your skill.
            "HELP_MESSAGE": "Ich nenne dir bis zu %s verschiedene Teams aus der deutschen Bundesliga. Du musst diese wiederholen. " +
            "Um ein neues Spiel zu starten, sage einfach „Spiel starten“. ",
            "REPEAT_QUESTION_MESSAGE": "Wenn die letzte Frage wiederholt werden soll, sage „Wiederholen“ ",
            "ASK_MESSAGE_START": "Möchten Sie beginnen?",
            "HELP_REPROMPT": "Um in das nächste Level zu kommen, musst du alle Namen der Teams wiederholen, die ich dir genannt habe. ",
            "STOP_MESSAGE": "Möchtest du weiterspielen?",
            "CANCEL_MESSAGE": "OK, dann lass uns bald mal wieder spielen.",
            "NO_MESSAGE": "OK, spielen wir ein andermal. Auf Wiedersehen!",
            "TRIVIA_UNHANDLED": "Versuch dich an ein Team zu erinnern.",
            "HELP_UNHANDLED": "Sage ja, um fortzufahren, oder nein, um das Spiel zu beenden.",
            "START_UNHANDLED": "Du kannst jederzeit ein neues Spiel beginnen, sage einfach „Spiel starten“.",
            "NEW_GAME_MESSAGE": "Willkommen bei %s. ",
            "WELCOME_MESSAGE": "Ich nenne dir bis zu %s verschiedene Teams aus der deutschen Bundesliga. Du musst diese wiederholen.  " +
            "Lass uns mit Level eins starten. ",
            "ANSWER_CORRECT_MESSAGE": "richtig. ",
            "ANSWER_WRONG_MESSAGE": "falsch. ",
            "CORRECT_ANSWER_MESSAGE": "Die richtigen Teams waren %s. ",
            "ANSWER_IS_MESSAGE": "Die Antwort ist ",
            "TELL_QUESTION_MESSAGE": "Team %s. %s ",
            "GAME_OVER_MESSAGE": "Du hast dir %s von %s Teams richtig gemerkt. Danke fürs Spielen!",
            "SCORE_IS_MESSAGE": "Du hast dir %s Teams richtig gemerkt",
            "NEXT_LEVEL_MESSAGE": "Im nächsten Level musst du dir %s Teams merken!"
        }
    }
};

var Alexa = require("alexa-sdk");
var APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageString;
    alexa.registerHandlers(newSessionHandlers, startStateHandlers, triviaStateHandlers, helpStateHandlers);
    alexa.execute();
};

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

var startStateHandlers = Alexa.CreateStateHandler(GAME_STATES.START, {
    "StartGame": function (newGame) {
        var speechOutput = newGame ? this.t("NEW_GAME_MESSAGE", this.t("GAME_NAME")) + this.t("WELCOME_MESSAGE", GAME_LENGTH.toString()) : "";
        // Select GAME_LENGTH questions for the game
        var soccerClubs = generateSoccerClubsOrdering();
        // Select and shuffle the answers for each question

        var currentClubIndex = 0;
        var spokenSoccerClub = soccerClubs[currentClubIndex];
        var repromptText = this.t("TELL_QUESTION_MESSAGE", "1", spokenSoccerClub);

        speechOutput += repromptText;

        Object.assign(this.attributes, {
            "speechOutput": repromptText,
            "repromptText": repromptText,
            "soccerClubs": soccerClubs,
            "score": 0,
            "currentTeamIndex": 0
        });

        // Set the current state to trivia mode. The skill will now use handlers defined in triviaStateHandlers
        this.handler.state = GAME_STATES.TRIVIA;
        this.emit(":askWithCard", speechOutput, repromptText, this.t("GAME_NAME"), repromptText);
    }
});

var triviaStateHandlers = Alexa.CreateStateHandler(GAME_STATES.TRIVIA, {
    "TeamIntent": function () {
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

function handleUserGuess(userGaveUp) {

    var speechOutput = "";
    var speechOutputAnalysis = "";

    var soccerClubs = this.attributes.soccerClubs;
    var currentScore = parseInt(this.attributes.score);
    var currentTeamIndex = parseInt(this.attributes.currentTeamIndex);
    var repromptText = this.attributes.repromptText;
    var spokenSoccerClub = "";
    var correctSoccerTeams = "";
    var newQuestions = false;

    console.log("guessedsoccerClub: " + this.event.request.intent.slots["Team"].value.toLowerCase());
    console.log("wantedsoccerClub: " + soccerClubs[currentTeamIndex].toLowerCase());
    var ok =  this.event.request.intent.slots["Team"].value.toLowerCase() == soccerClubs[currentTeamIndex].toLowerCase();

    console.log("ok: " + ok);

    // check if user says right order
    if ( ok ) {

        if (currentTeamIndex == currentScore) {
            currentScore++;
            newQuestions = true;
        }
        else {
            currentTeamIndex++;
        }

        speechOutputAnalysis = this.t("ANSWER_CORRECT_MESSAGE");
        console.log("currentTeamIndex: " + currentTeamIndex);
        console.log("currentScore: " + currentScore);
    } else {
        if (!userGaveUp) {
            speechOutputAnalysis = this.t("ANSWER_WRONG_MESSAGE");
        }

        for (var i = 0; (i < currentScore + 1); i++){
            correctSoccerTeams += soccerClubs[i] + " and ";
        }

        speechOutputAnalysis += this.t("CORRECT_ANSWER_MESSAGE", correctSoccerTeams);
        console.log("speechOutputAnalysis: " + speechOutputAnalysis);
        console.log("currentTeamIndex: " + currentTeamIndex);
        console.log("currentScore: " + currentScore);
    }

    // Check if we can exit the game session after we reached GAME_LENGTH
    if (currentScore == GAME_LENGTH || !ok) {
        speechOutput = (userGaveUp || !ok) ? "" : this.t("ANSWER_IS_MESSAGE");
        speechOutput += speechOutputAnalysis + this.t("GAME_OVER_MESSAGE", currentScore.toString(), GAME_LENGTH.toString());
        console.log("currentScore == GAME_LENGTH: " + speechOutput);
        this.emit(":tell", speechOutput);
    } else {

        // game has not finished yet, so we have to give new clubs to the user
        if (newQuestions) {
            speechOutput += speechOutputAnalysis + this.t("SCORE_IS_MESSAGE", currentScore.toString()) + " " + this.t("NEXT_LEVEL_MESSAGE", currentScore + 1);

            soccerClubs = generateSoccerClubsOrdering();
            for (var i = 0; (i < currentScore + 1); i++){
                spokenSoccerClub += soccerClubs[i] + " ";
            }

            repromptText = spokenSoccerClub;

            speechOutput += " " + spokenSoccerClub;

            Object.assign(this.attributes, {
                "speechOutput": repromptText,
                "repromptText": repromptText,
                "soccerClubs": soccerClubs,
                "score": currentScore,
                "currentTeamIndex": 0
            });
            console.log("currentTeamIndex == currentScore: " + speechOutput);
            this.emit(":askWithCard", speechOutput, repromptText, this.t("GAME_NAME"), repromptText);
        }
        else {
            console.log("currentTeamIndex != currentScore: " + speechOutput);
            Object.assign(this.attributes, {
                "speechOutput": repromptText,
                "repromptText": repromptText,
                "soccerClubs": soccerClubs,
                "score": currentScore,
                "currentTeamIndex": currentTeamIndex
            });
            speechOutput += speechOutputAnalysis;
            this.emit(":askWithCard", speechOutput, speechOutput, this.t("GAME_NAME"), speechOutput);
        }

    }
}

function generateSoccerClubsOrdering() {
    var soccerClubs = [];
    var indexList = ["FC Augsburg",
        "Hertha BSC",
        "Werder Bremen",
        "SV Darmstadt 98",
        "Borussia Dortmund",
        "Eintracht Frankfurt",
        "SC Freiburg",
        "Hamburger SV",
        "TSG 1899 Hoffenheim",
        "FC Ingolstadt 04",
        "1. FC Köln",
        "RB Leipzig",
        "Bayer Leverkusen",
        "FSV Mainz 05",
        "Borussia Mönchengladbach",
        "FC Bayern München",
        "FC Schalke 04",
        "VfL Wolfsburg"];

    var index = GAME_LENGTH;

    // Pick GAME_LENGTH random questions from the list to ask the user, make sure there are no repeats.
    for (var j = 0; j < GAME_LENGTH; j++){
        var rand = Math.floor(Math.random() * index);
        index -= 1;

        var temp = indexList[index];
        indexList[index] = indexList[rand];
        indexList[rand] = temp;
        soccerClubs.push(indexList[index]);
    }

    return soccerClubs;
}