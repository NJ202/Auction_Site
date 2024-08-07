const mongoose = require("mongoose");
const bidSchema = new mongoose.Schema({
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'products'
    },
    seller : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    buyer : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    bidAmount : {
        type : Number,
        required : true
    },
    topBidder: {
        type : Boolean,

    }
},{timestamps:true});

module.exports = mongoose.model('bids',bidSchema);
