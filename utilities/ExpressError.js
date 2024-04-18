// Here we will create our custom error messages for convenience.
class ExpressError extends Error 
{
    constructor(status, message)
    {
        super();
        this.status = status;
        this.message = message;
    }
}

module.exports = ExpressError;