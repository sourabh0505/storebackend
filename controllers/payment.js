const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "n3kdw97pgzzt243g",
  publicKey: "b5xdzwnj8mhggxn9",
  privateKey: "003430fa5b863f4208feb7c370c9d64f"
});


exports.getToken = (req,res) => {
    gateway.clientToken.generate({}, (err, response) => {
        if(err){
            res.status(500).send(err)
        }else{
            res.send(response)
        }
      });
}

exports.processPayment = (req,res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req .body.amount;
    
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
        if(err) {
            res.status(500).send(err);
        }else{
          //console.log(result);
            res.json(result);
        }
      });
}