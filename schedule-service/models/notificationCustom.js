const pool = require("../lib/db");

const createNotification = async (uid, message) => {
    try {
        const result = await pool.query(
            `INSERT INTO Notifications (uid, message) VALUES ($1, $2) RETURNING *`,
            [uid, message]
        );
        return result.rows[0];
    } catch (err) {
        console.log("Error in createNotification:", err);
    }
};

const getAllNotificationsByUser = async (uid) => {
    try {
        const result = await pool.query(
            `SELECT * FROM Notifications WHERE uid = $1 ORDER BY created_at DESC`,
            [uid]
        );
        return result.rows;
    } catch (err) {
        console.log("Error in getAllNotificationsByUser:", err);
    }
};

const markNotificationAsRead = async (id) => {
    try {
        const result = await pool.query(
            `UPDATE Notifications SET is_read = TRUE WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    } catch (err) {
        console.log("Error in markNotificationAsRead:", err);
    }
};

const deleteNotification = async (id) => {
    try {
        const result = await pool.query(
            `DELETE FROM Notifications WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    } catch (err) {
        console.log("Error in deleteNotification:", err);
    }
};

module.exports = {
    createNotification,
    getAllNotificationsByUser,
    markNotificationAsRead,
    deleteNotification
};