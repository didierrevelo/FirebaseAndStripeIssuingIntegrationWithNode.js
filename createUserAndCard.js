//the login is done in stripe, with the private key found in the stripe account.;
require('dotenv').config();
const stripe = require(process.env.DB_NAME)(process.env.DB_PASSWORD)
//this object creates the user with a specific format. search in /models/BCTransaction.js.
const user = require('./models/BCTransaction.js');
//this object creates the transactions with a specific format. search in /models/transactionByUser.js.
const CHConstructor = require('./models/constructorUser.js')
//file needed to connect to firebase and firestore database.
const firestore = require('./firestore/firestore.js');
//const ConnectionTokens = require('stripe/lib/resources/Terminal/ConnectionTokens');
//const BCTransaction = require('../models/transactionByUser.js')

/** some parts of the code are commented because they are
 * fractions that serve to carry out the work from a different
 * approach or because they can be used later for references or improvements*/


/**getUserStripe fetches a list of users through an asynchronous function */
async function getUserStripe() {
    let cardholders
    let others
    try {
        cardholders = await stripe.issuing.cardholders.list();
        return  others, cardholders;
    } catch (e) {   
        console.error('error get UserStripe');
    } 
} getUserStripe().then(response =>  usersGetForCreate(response));

/**usersGetForCreate brings the information of all users
 * contained in firebase for comparison with stripe user
 *  data and thus know if individual user creation should
 * be executed or not. */
function usersGetForCreate(dataStripe){
    let list = {};
    var getPromise = new Promise((resolve, reject) => {
        firestore.getBankityCardUsers().then(function(values) {
            values.forEach(function(item, index, array) {
                try {
                    list[item.userID] = new CHConstructor(item.userID, item.firstName +' '+ item.lastName, item.email, item.cellphone, item.stripeID);
                } catch (e) {   
                    console.error('error get user');
                }
                if (index === array.length - 1) resolve()
            });

        }, function(error) {
            reject();
        });
    
    });

    getPromise.then(() => {
        compareUserSwB(list, dataStripe)
    });
    
} 

/**compareUserSwB compares the information from the
 * previous functions and makes the decision to create
 * or not the users, the creation depends on whether or
 * not it exists in the databases. */
function compareUserSwB(listBankityUsers, listStripeUser) {
    let listOfUserToCreate = [];
    const copyList = listStripeUser.data;
    var getUpdate = new Promise((resolve, reject) => {
        Object.values(listBankityUsers).forEach(function(item, index, array) {
            copyList.forEach(result => {
                if (item.stripeId === result.id){
                    console.log('this user exist in stripe')
                    return 0;
                } else {
                    listOfUserToCreate.push(item)
                }
                if (index === array.length - 1) resolve()
            })

        }, function(error) {
            reject();
        });
    
    });

    getUpdate.then(() => {
        createCardHolders(listOfUserToCreate)
    });

/**create CardHolders this function gives way to the creation of each
 * carholder in stripe according to the parameters received in the
 * previous functions. */
function createCardHolders(data){
    data.forEach(async item =>{
        if (item.stripeId) {
            return 0;
        } else {
        const cardholder = await stripe.issuing.cardholders.create({
            type: item.type,
            name: item.name,
            email: item.email,
            phone_number: item.phone_number,
            billing: item.billing
        });
        createCard(item.idFBBanity, cardholder);
        return cardholder;
    }
    })
}

/**createCard, as its name implies, creates a card
 * per user, this function is not called if the user
 * already exists in stripe, which allows no more than
 * one card to be created per user. */
async function createCard(idFBBanity, cardholder){
    if (!cardholder.cardID){
    //try {
    const card = await stripe.issuing.cards.create({
        cardholder: cardholder.id,
        currency: 'usd',
        type: 'virtual',
        status: 'active',
        spending_controls: {
            spending_limits: [monthly],
            spending_limits_currency: 'usd'
        }
    });
    updateFirestore(idFBBanity, cardholder, card)
    return card;
    } else {
        console.log('this card has already been created')
}
}

/**updateFirestore more than a function is a call to a function
 * found in the path ../firestore/firestore.js that updates the
 * users in firestore with the data obtained from its creation,
 * this data is the user's id in stripe and the id of the card
 * for future consultations, with the existence of these two data
 * depends on the flow of the rest of the functions in this file,
 * so the user who does not have it will not be created by default
 * with their respective card.*/
async function updateFirestore(idFBBanity, cardholder, card) {
    console.log(card)
    await firestore.update(idFBBanity, cardholder.id, card.id)
}
} 
