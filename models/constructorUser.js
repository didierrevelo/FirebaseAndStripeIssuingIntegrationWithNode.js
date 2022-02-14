/**the CHConstructor class creates the proper
 * format of information to pass to the stripe
 * user creator. It was given a default billing
 * address to fill in the field but this can be
 * updated both manually and automatically by creating
 * the information in the bankity user in firebase */
module.exports  = class CHConstructor {
    constructor(id, name, email, phone_number, stripeId){
        this.idFBBanity = id;
        this.type = 'individual',
        this.name = name,
        this.email = email,
        this.phone_number = phone_number,
        this.billing = {address: {
            line1: '1234 Main Street',
            city: 'San Francisco',
            state: 'CA',
            country: 'US',
            postal_code: '94111'}},
        this.stripeId = stripeId;

    }

}
