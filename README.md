# AmazonAlexaMemory
how to create an amazon alexa skill for a memory game

# prerequisites:
amazon developer account
amazon aws account

# lets get started
If you want to build your own amazon alexa skill based on this project, just follow these steps:

login to https://developer.amazon.com/ and add a new alexa skill

The skill type needs to be a Custom Interaction Model.
The language depends on in which country you want to publish your skill.
The name of the skill is just the display name, more important is the invocation name.
The invocation name is the name the user actually says to alexa. So it sould not be to complicated.

On the next card you have to add the intent schema, custom slot types and the sample utterances.
Just take the files from this project as an example.
The intent schema is the connection to the handlers that will be later on definced in the lambda function.
Here you define the inputs that the users can say for communicating with your skill.
There are predefined amazon data types available like numbers.
But you can also define your own data types. This you can do by using custom slot types.
It is not possible to define something like a free text, all text input from the user must be predefined.

Within the sample utterance section you can give alexa a schema for the text input that you expect.

The card for the Publishing Information and Privacy & Compliance can also be filled out right now. 
For the section Example Phrases and images you can also find a template in the sources.

Now you can start to add the functionality to your skill.
To do this, you have to login to the amazon aws console and create a new lambda function.
It is necessary that you choose the Alexa Skill SDK as a dependency.
In the src folder you can find the code that you can use as a template.
Just create the lambda function based on the template and copy the Lambda ARN to the clipboard.

Back in the skill configuration you can switch to the configuration card.
There you select AWS Lambda as a service endpoint, select the region where you created the lamda function and paste the ARN to into the edit field.

Now you can switch to the Test card and check if your skill is working.
If everything is saved, the skill is already available for your developer account.
You can test it with a virtual echo on echosim.io.
Create a new device with your developer account and test your skill.
If your tests are ok, you can submit your skill for certification.

Some days later you will get an answer from amazon if the skill has passed or not.
If it does, congratulations you have finished your first skill and it is available in the alexa skill shop.
