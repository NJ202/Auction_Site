const router = require('express').Router();
const Bid = require('../models/bidModel');
const Notification = require('../models/notificationsModel'); // Ensure you have a Notification model
const Product = require('../models/productModel'); // Ensure you have a Product model
const authMiddleware = require('../middleware/authMiddleware');
const { response } = require('express');

// Place a new bid
router.post('/place-new-bid', authMiddleware, async (req, res) => {
    try {
        const { product, bidAmount, buyer } = req.body;

        // Validate input
        if (!product || !bidAmount || !buyer) {
            return res.status(400).send({
                success: false,
                message: 'Product, bid amount, and buyer ID are required',
            });
        }

        // Find the product
        const productDoc = await Product.findById(product);
        if (!productDoc) {
            return res.status(404).send({
                success: false,
                message: 'Product not found',
            });
        }

        // Find the current highest bid
        const highestBid = await Bid.findOne({ product }).sort({ bidAmount: -1 });

        // Create a new bid
        const newBid = new Bid({
            product,
            bidAmount,
            buyer,
        });
        await newBid.save();

        // Notify the previous highest bidder if the new bid is higher
        if (highestBid && bidAmount > highestBid.bidAmount) {
            const previousBidder = highestBid.buyer;

            const notification = new Notification({
                title: "Your bid has been outbid",
                message: `Your bid of Rs. ${highestBid.bidAmount} on the product ${productDoc.name} has been outbid by Rs.${bidAmount}.`,
                user: previousBidder,
                onclick: '/profile',
                read: false,
            });

            await notification.save();
        }

        res.send({
            success: true,
            message: 'Bid placed successfully',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

// Get all bids
router.get('/get-all-bids', authMiddleware, async (req, res) => {
    try {
        const { product, seller,buyer } = req.query;
        let filters = {};
        if (product) {
            filters.product = product;
        }
        if (seller) {
            filters.seller = seller;
        }
        if (buyer) {
            filters.buyer = buyer;
        }

        const bids = await Bid.find(filters).sort({ bidAmount: -1 }).populate("product").populate("buyer").populate("seller");
        res.send({ success: true, data: bids });
    } catch (error) {
        res.send({ success: false, message: error.message });
    }
});

module.exports = router;
