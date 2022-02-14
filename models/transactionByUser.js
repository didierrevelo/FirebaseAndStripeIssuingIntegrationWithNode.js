/**the BCTransaccion class allows you to format the transactions
 * and then be saved in the firebase database */
module.exports  = class BCTransaction {
    constructor(id, txDate, amount, item, type, stripeUserID, cardNo, requestTime) {
        this.stripeIdTransac = id;
        this.dateAPI = (txDate*1000);     // Save original date for future reference
        this.amountAPI = amount.toString(); // Save original amount for future reference
        this.itemAPI = item;     // Save original item for future reference
        this.type = 1;        // Withdrawal, purchase, income, transfer, etc
        this.stripeUserID = stripeUserID;    // Bankity userID
        this.userID = '';
        this.cardNo = cardNo;    // Card Number
        this.bankID = 100;       // bankID = 100 for Bankity Card
        //this.amountsTrasactions = [];
        //this.spent = 0;

         // Methods to clean transaction data
        this.date = requestTime;
        this.savedDate = this.date;
        this.item = this.cleanItem(this.itemAPI);
        let txData = this.cleanAmount(this.amountAPI);
        this.amount = txData.amount;
        this.movementType = txData.movementType;
        this.display = true;
        this.categoryCode = 0;
        
        // For backend transactions a special treatment is required
        //this.editBackendTransaction();
        // At last a unique ID is created
        //this.id = this.createId(this);
    }
    toJSON() {
        // Do not send the cardNo (card number)
        return {
            id: this.stripeIdTransac,
            date: this.date,
            savedDate: this.savedDate,
            dateAPI: this.dateAPI,
            amount: this.amount,
            amountAPI: this.amountAPI,
            item: this.item,
            itemAPI: this.itemAPI,
            type: this.type,
            userID: this.userID,
            bankID: this.bankID,
            categoryCode: this.categoryCode,
            //movementType: this.movementType,
            //display: this.display,
            //status: "",
        };
    
    }
    // Parse the amount to float and retains the sign in a different field
    cleanAmount(amount) {
        let sign = 0;
        let new_amount = Number.parseFloat(amount);
        if (!Number.isNaN(new_amount)) {
            sign = Math.sign(new_amount);
            new_amount = Math.abs(new_amount);
        }

        return {
            amount: new_amount,
            movementType: sign
        };
    }
    /**remove unnecessary symbols in transmitted values */
    cleanItem(item) {
        // Check type before using 'match' function
        if (typeof item !== 'string') return item;

        // Any character until the first digit
        const regex = /[^\d]+/;
        let new_item = item.match(regex);
        // if match found a pattern, returns an array
        (Array.isArray(new_item)) ? new_item = new_item[0].trim() : new_item = item;

        return new_item;
    }

}
