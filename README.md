# Remulate
An application to assist blind people in navigating their environment, built for the WaffleHacks hackathon

[![Remulate](http://img.youtube.com/vi/Nu9RKQFHPl8/0.jpg)](http://www.youtube.com/watch?v=Nu9RKQFHPl8 "Remulate")

[Devpost](https://devpost.com/software/remulate)

# Inspiration
We as a team wanted to improve on how the blind were unable to detect objects in the environment around them by providing access to the blind and we aim to do that by emulating the reality that they could never access

# What it does
This created product is able to describe the scene around a blind person using the phone’s camera and a text to speech feature. The phone’s camera takes a picture of the surroundings, and the data is sent to various APIs to create a description of the image. The entire interface relies on tapping anywhere on the screen for input, and audio for output, to make it accessible for blind people.

# How we built it
The technologies utilized in this product were quite substantial. We first used react native to make a cross platform app for both iOS and Android, which also allows using Javascript and React components and various familiar node libraries. We then used Expo that provides various frameworks for react and an easy way to debug the application. To describe the image in tags, we used the Imagga API. The result from this API is then passed to OpenAI’s GPT3 API to describe the scene in a sentence.

# Challenges we ran into
We faced various challenges when making this product: We had some technical issues using native APIs with expo, but overcame them all after some research. Finding a good quality and free API to do the image captioning was also a challenge.

# Accomplishments that we're proud of
Using react native for the first time and finding libraries that work with Expo for all our tasks Integrating two APIs together with multiple requests in the application Creating the product with time constraints and technical issues Coming up with innovative ideas for the app and how the UI should function

# What we learned
We learned how to integrate the AI into our product which was something we had never done before, especially in a hackathon

# What's next for Remulate

Adding the panorama feature which detects everything in the environment around them and provides a description for each intricate feature
Decrease  the latency so as to improve the usability of the product and thus to enhance the user experience
