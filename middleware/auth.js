
const poolPromise = require('../db'); // Import the database connection pool

const authorize = (roles) => {
    return async (req, res, next) => {
        try {
            // 1. Get the user's ID
            let userId;
             if (req.session && req.session.userId) {
                userId = req.session.userId;
            } else if (req.user && req.user.userId) {
                 userId = req.user.userId;
            }else {
                return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
            }

            // 2. Get the user's role from the database
            const pool = await poolPromise;
            const connection = await pool.getConnection();
            try {
                const [users] = await connection.query('SELECT role FROM users WHERE user_id = ?', [userId]);
                if (!users.length) {
                    return res.status(401).json({ error: 'Unauthorized: User not found' });
                }
                const userRole = users[0].role;

                // 3. Check if the user's role is allowed
                if (roles.includes(userRole)) {
                    next(); // User is authorized
                } else {
                    return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
                }
            } finally {
                 connection.release();
            }
        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

module.exports = {
    authorize,
};