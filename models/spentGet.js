/**the Spent class helps us to calculate the total
 * value of all transactions made by the user */
module.exports  = class Spent {
    constructor(amount){
        this.amount = [];
        this.spent = 0;
    }
    set getAmount(amount){
        this.amount.push(amount);
    }
    sum(arr) {
        let total = 0;
        this.amount.push(arr);
        this.amount.forEach(function(a){total += a;});
        this.spent = total;

    }
}