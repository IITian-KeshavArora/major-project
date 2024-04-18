// WrapAsync is a better version of try-catch block. we will use it to check our server side form validations
module.exports = (fn) => {
    return (req,res,next) =>
    {
        fn(req,res,next).catch(next);
    }
}