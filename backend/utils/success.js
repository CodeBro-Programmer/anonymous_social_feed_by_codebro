const success = (res, status, message)=>{
    res.status(status).json({
        success: true,
        message: message
    });
};

module.exports = success;