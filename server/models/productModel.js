const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    bidEndDate: {
        type: Date,
        required: true,
    },
    image: {
        type: String,
        required : false,
    },
    billAvailable: {
        type: Boolean,
        default: false,
        required: true,

    },
    warrantyAvailable: {
        type: Boolean,
        default: false,
        required: true,

    },
    boxAvailable: {
        type: Boolean,
        default: false,
        required: true,

    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
},
    { timestamps: true, }
);

const Product = mongoose.model("products",productSchema);
module.exports=Product;
