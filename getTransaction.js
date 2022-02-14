//the login is done in stripe, with the private key found in the stripe account.
require('dotenv').config();
const stripe = require(process.env.DB_NAME)(process.env.DB_PASSWORD)
//this object creates the user with a specific format. search in /models/BCTransaction.js.
const user = require('./models/BCTransaction.js');
//this object creates the transactions with a specific format. search in /models/transactionByUser.js.
const BCTransaction = require('./models/transactionByUser.js')
//file needed to connect to firebase and firestore database.
const firestore = require('./firestore/firestore.js')


/**This is an asynchronous function, with which we have a list of transactions,
 * from the app stripe, this information allows us to corroborate the existence
 * of transactions on behalf of a cardholder */
async function getAllTransctions() {
    let transactionsList;
    try {
        transactionsList = await stripe.issuing.transactions.list();
        return transactionsList;
    } catch (e) {   
        console.error('error get transactions');
    } 
} getAllTransctions().then(response => createUsers(response)); /**this line allows me to pass a 
resolved promise to another function since unresolved promises do not show information. */

/**createUsers is a function that goes through the information
 * delivered by the asynchronous function getAllTransctions (),
 * allowing to capture said information and create an array of
 * users that contains user ID, an array of transactions, an array
 * of values of said transactions and a spend that adds up all values
 * to give a total. */
function createUsers(transactions){
    let users = {};
    const arr = transactions.data;
    arr.forEach(item => {
        if (item.cardholder in users) {
            users[item.cardholder].Transactions = item;
            users[item.cardholder].sum(item.amount);
        } else {
            users[item.cardholder] = new user(item.cardholder);
            users[item.cardholder].Transactions = item;
            users[item.cardholder].sum(item.amount);
        }
        
    }); // console.log(Object.values(users));
    create(users);
};

/**create formats the transactions taken from the API so that 
 * they can be put in the format that the Bankity app uses in
 * firebase, in this way it resembles the format in production.
 * To keep in mind, this is also an asynchronous function so special
 * attention must be paid to awaits since they will delay the result until
 * the required information is not available. */
async function create(users){
    let transactionsFormat = [];
    const requestTime = Date.now();
    Object.values(users).forEach(async useritem => {
        //console.log(item);
        const transaction = useritem.transaction;
        //console.log(transaction);
        let response = await transaction.forEach(item => {
            //console.log(item);
            let formatTransaction = new BCTransaction(item.id, item.created, item.amount, item.merchant_data.name, item.type, item.cardholder, item.card, requestTime);    
            transactionsFormat.push(formatTransaction);
        });
    }); 
    //console.log(transactionsFormat);
    usersAuth(transactionsFormat)
};

/**usersAuth compares the information obtained from the database in 
 * firestore with that provided by stripe in order to connect the
 * transactions with each user. */
function usersAuth(transactionsList){
    //console.log(transactionsList)
        transactionsList.forEach(getTra => {
            firestore.getBankityCardUsers().then(response => response.forEach(item =>{
                if (item.stripeID == getTra.stripeUserID) {
                    getTra.userID =  item.userID;
                    firestore.saveTransactions(item.userID, getTra)
                } else {
                    return 1;
                }
                
            }))
        })
}
