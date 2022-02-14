/**This constructor creates an array of transaction
 * objects, and an array with the transaction values
 * which are added with the sum function and proceeds
 * to save the result in spent. */
module.exports  = class user {
    constructor(stripeUId = '') {
        this.stripeUserId = stripeUId;
        this.transaction = [];
        this.amountsTrasactions = [];
        this.spent = 0;
        
    } 
    /**saves all transactions passed to it in the
     * transaction array "transaction". */
    set Transactions(transaction) {
        this.transaction.push(transaction);
    }
    /*set Spents(spent1) {
        this.spent.push(spent1);
        console.log(spent);
    }*/
    /**sum all the values of the transactions passed to the array */
    sum(arr) {
        //let allAmount = [];
        let total = 0;
        this.amountsTrasactions.push(arr);
        this.amountsTrasactions.forEach(function(a){total += a;});
        //allAmount.push(total);
        this.spent = total / 100;

    }
}
