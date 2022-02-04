<h1 align="center"> Bankity Stripe </h1>
<p> Our company is growing every day, so our infrastructure, speed and security must keep pace. 
Thanks to that we are implementing a new technology that will give us better performance and connection with our customers. </p>


## Technology 
Stripe is a platform that allows individuals and businesses to receive secure online payments in the style of other platforms, such as PayPal. Stripe was born in 2011 and is based in San Francisco (USA).

## Table of Content
* [Installation](#installation)
* [Documentation](#documentation)
* [File Descriptions](#file-descriptions)
* [Authors](#authors)
* [License](#license)
* [Acknowledgment](#Acknowledgment)

## Installation
- [Nodejs](http://nodejs.org/es/ "Nodejs")
- [Firebase](http:firebase.google.com/docs/firestore/quickstart?hl=es-419 "Firebase")
- [Stripe](http://stripe.com/es-us/reports/idc-whitepaper-2018 "Stripe")

## Documentation
- [Nodejs](http://nodejs.org/es/docs/ "Nodejs Docs.")
- [Firebase](http://firebase.google.com/docs?gclid=CjwKCAjwn6GGBhADEiwAruUcKq0AG0-A_obGNyx5OXbnzYf7JXnfJxV8ZDY4ZO3CETQghmW64xtdpBoChl8QAvD_BwE&gclsrc=aw.ds "Firebase Docs.")
- [Strype](https://stripe.com/docs "Strype Docs.")

## File Description
[getTransaction](getTransaction.js) - getTransaction contains code that helps us call user transactions from the stripe API.:
* `getAllTransctions` - This is an asynchronous function, with which we have a list of transactions, from the app stripe, this information allows us to corroborate the existence of transactions on behalf of a cardholder.
* `createUsers` - createUsers is a function that goes through the information delivered by the asynchronous function getAllTransctions (), allowing to capture said information and create an array of users that contains user ID, an array of transactions, an array of values of said transactions and a spend that adds up all values to give a total. 
* `create` - create formats the transactions taken from the API so that they can be put in the format that the Bankity app uses in firebase, in this way it resembles the format in production. To keep in mind, this is also an asynchronous function so special attention must be paid to awaits since they will delay the result until the required information is not available.
* `usersAuth` - usersAuth compares the information obtained from the database in firestore with that provided by stripe in order to connect the transactions with each user

[createUserAndCard](createUserAndCard.js) - createUserAndCard create data in our database in firestore:
* `getUserStripe` - fetches a list of users through an asynchronous function.
* `usersGetForCreate` - usersGetForCreate brings the information of all users contained in firebase for comparison with stripe user data and thus knows if individual user creation should be executed or not.
* `compareUserSwB` - compares the information from the previous functions and makes the decision to create or not the users, the creation depends on whether or not it exists in the databases.
* `createCardHolders` - this function gives way to the creation of each carholder in stripe according to the parameters received in the previous functions.
* `createCard` - as its name implies, creates a card per user, this function is not called if the user already exists in stripe, which allows no more than one card to be created per user.
* `updateFirestore` - more than a function is a call to a function found in the path ../firestore/firestore.js that updates the users in firestore with the data obtained from its creation, this data is the user's id in stripe and the id of the card for future consultations, with the existence of these two data depends on the flow of the rest of the functions in this file, so the user who does not have it will not be created by default with their respective card.

### `models/`  directory contains classes used for this project:
[BCTransaction](/models/BCTransaction.js) - 
* `class user` - This constructor creates an array of transaction objects, and an array with the transaction values which are added with the sum function and proceeds to save the result in spent.

[constructorUser](/models/constructorUser.js) - 



[spentGet](/models/spentGet.js) - 



[transactionByUser](/models/transactionByUser.js) - 



### `firestore/` directory contains ... :
[firestore](/models/firestore.js) - 



## Authors
- [Didier Revelo](http://github.com/didierrevelo "Didier Revelo")
- [Jhon Alex Freyre](http://github.com/Jhonalex1199 "Jhon Alex Freyre")
- [Gustavo Tovar](http://github.com/tao08 "Gustavo Tovar")

## Acknowledgment
 - [Holberton School](http://www.holbertonschool.com/co/es "Holberton School")
 -  [Bankity](http://www.bankity.com/ "Bankity")
