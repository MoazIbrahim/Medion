const Payment = require('./models/payments');

module.exports.isLoggedIn = function(req,res,next) {
    if(!req.isAuthenticated()){
        req.flash('error' , ' You must be signed in ');
        return res.redirect('/loginscreen');
       
    }
    next();
};
module.exports.isPaidUp = async function(req, res, next) {
    try {
     
      const userPayments = await Payment.find({ user: req.user._id });
      const allPaymentsPaid = userPayments.every(payment => payment.paidPayment === payment.requiredPayment);
      if (!allPaymentsPaid) {
        req.flash('error', 'You need to pay the tuition fees to gain access to university materials.');
        return res.redirect('/payment'); 
      }
      next(); 
    } catch (error) {
      console.error(error);
      req.flash('error', 'An error occurred while checking payments.');
      res.redirect('/'); 
    }
  };