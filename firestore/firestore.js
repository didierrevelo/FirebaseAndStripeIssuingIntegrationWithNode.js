/**this is the firebase authentication module, its data is in a file called
 * '/config_stripe.json' where all the configuration to enter the database is secure. */
const admin = require('firebase-admin');
const serviceAccount = require('../config_stripe.json');
// Initializing db connection
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://bankity-stripe-issuing-default-rtdb.firebaseio.com"
});
const db = admin.firestore();


/**getBankityUsers bring all users saved in firestore database*/
exports.getBankityCardUsers = function(){
    var usersRef = db.collection('users');
    var query = usersRef.where("userID",">","").get().then(snapshot => {
        var allUsers = [];
        snapshot.forEach(doc => {
            const usr = doc.data()
            if(doc.id > ''){
                allUsers.push(usr)
            }
        });
        return allUsers;
    })
    .catch(err => {
        console.log('Error getting documents', err);
        return null;
    });
    return query;
}

// Saves all transactions from a user in batch in both /transactions and users/Transactions
exports.saveTransactions = function (userID, txs) {
    // For each transaction will create a get and a set if not created yet
    var arrayTXS = [];
    arrayTXS.push(txs)
    arrayTXS.forEach(tx => {
        const usertxRef = db.doc('users/' + userID + '/Transactions/' + tx.stripeIdTransac);
        const transaction = db.runTransaction(t => {
            return t.get(usertxRef)
            .then(doc => {
                if (!doc.exists) {
                    // Create a new transaction
                    txjson = tx.toJSON();
                    t.set(usertxRef, txjson);
                    console.log('NEW transaction created with ID:', tx.stripeIdTransac);
                } else {
                    console.log('Transaction already exists with ID:', tx.stripeIdTransac);
                }
            })
            .catch(err => {
                console.log('txRef.get failed!', err);
            });
        })
        .then()
        .catch(err => {
            console.log('runTransaction failed!', err);
        });
        arrayTXS.push(transaction)
    })
}

/**update users in firestore with the ID of their respective
 * user in stripe and add the ID of the card created for that user. */
exports.update = async function (userID, stripeId, cardID){
    const docRef = db.doc('users/' + userID)
    await docRef.update({
        stripeID: stripeId,
        cardID: cardID
})
}
