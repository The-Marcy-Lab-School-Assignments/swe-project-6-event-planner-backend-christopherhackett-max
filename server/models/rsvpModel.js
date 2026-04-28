const pool = require('../db/pool');

module.exports.rsvp = async (event_id, user_id) => {
    const query = `INSERT INTO rsvps (event_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *`;
    const { rows } = await pool.query(query, [event_id, user_id]);
    return rows[0] || null;
};

module.exports.unrsvp = async (event_id, user_id) => {
    const query = `DELETE FROM rsvps WHERE event_id = $1 AND user_id = $2 RETURNING *`;
    const { rows } = await pool.query(query, [event_id, user_id]);
    return rows[0] || null;
};

module.exports.rsvpsByUser = async (user_id) => {
    const query = `SELECT events.*, username, (SELECT COUNT(rsvp_id) FROM rsvps WHERE rsvps.event_id = events.event_id) AS rsvp_count FROM rsvps JOIN events ON rsvps.event_id = events.event_id JOIN users ON events.user_id = users.user_id WHERE rsvps.user_id = $1 ORDER BY events.event_id`;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
};