const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const Notification = require('../models/notificationsModel');

// Add a notification
router.post('/notify', authMiddleware, async (req, res) => {
    try {
        const newNotification = new Notification(req.body);
        await newNotification.save();
        res.send({
            success: true,
            message: "Notification added successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// Get all notifications for a user
router.get('/get-all-notifications', authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.body.userId, }).sort({ createdAt: -1 });
        res.send({
            success: true,
            data: notifications,
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

// Mark all notifications as read
router.put('/read-all-notifications', authMiddleware, async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.body.userId, read:false},
             { $set: { read: true } });
        res.send({
            success: true,
            message: "All notifications read successfully",
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        });
    }
});

module.exports = router;
