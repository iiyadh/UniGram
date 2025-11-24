const NotificationModel = require('../models/notificationCustom');

const createNotification = async (req, res) => {
    try {
        const { uid, message } = req.body;
        if (!uid || !message) {
            return res.status(400).json({ success: false, error: 'All required fields must be provided' });
        }

        const notification = await NotificationModel.createNotification(uid, message);
        res.status(201).json({ success: true, data: notification });
    } catch (err) {
        console.error('Error creating notification:', err);
        res.status(500).json({ success: false, error: 'Failed to create notification' });
    }
};

const getAllNotificationsByUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const notifications = await NotificationModel.getAllNotificationsByUser(uid);
        res.status(200).json({ success: true, data: notifications });
    } catch (err) {
        console.error('Error retrieving notifications:', err);
        res.status(500).json({ success: false, error: 'Failed to retrieve notifications' });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await NotificationModel.markNotificationAsRead(id);
        if (!updated) return res.status(404).json({ success: false, error: 'Notification not found' });

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error('Error marking notification as read:', err);
        res.status(500).json({ success: false, error: 'Failed to update notification' });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await NotificationModel.deleteNotification(id);
        if (!deleted) return res.status(404).json({ success: false, error: 'Notification not found' });

        res.status(200).json({ success: true, data: deleted });
    } catch (err) {
        console.error('Error deleting notification:', err);
        res.status(500).json({ success: false, error: 'Failed to delete notification' });
    }
};

module.exports = {
    createNotification,
    getAllNotificationsByUser,
    markNotificationAsRead,
    deleteNotification
};
