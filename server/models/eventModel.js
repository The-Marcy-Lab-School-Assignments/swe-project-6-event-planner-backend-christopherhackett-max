const pool = require('../db/pool');

module.exports.list = async () => {
    const query = `
    SELECT events.*, username, COUNT(rsvps.user_id) AS rsvp_count 
    FROM events
    JOIN users ON events.user_id = users.user_id
    LEFT JOIN rsvps ON events.event_id = rsvps.event_id
    GROUP BY events.event_id, users.user_id
    ORDER BY events.event_id
  `;
    const { rows } = await pool.query(query);
    return rows;
};

module.exports.listByUser = async (user_id) => {
    const query = `
    SELECT *
    FROM events
    WHERE user_id = $1
    ORDER BY event_id
  `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
};

module.exports.create = async (title, description, date, location, event_type, max_capacity, user_id) => {
    const query = `
    INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
    const { rows } = await pool.query(query, [title, description, date, location, event_type, max_capacity, user_id,]);
    return rows[0];
};

module.exports.find = async (event_id) => {
    const query = 'SELECT * FROM events WHERE event_id = $1';
    const { rows } = await pool.query(query, [event_id]);
    return rows[0] || null;
};

module.exports.update = async (event_id, title, description, date, location, event_type, max_capacity) => {
    const query = `
    UPDATE events
    SET title = COALESCE($1, title),
    description = COALESCE($2, description),
    date = COALESCE($3, date),
    location = COALESCE($4, location),
    event_type = COALESCE($5, event_type),
    max_capacity = COALESCE($6, max_capacity)
    WHERE event_id = $7
    RETURNING *
  `;
    const { rows } = await pool.query(query, [title, description, date, location, event_type, max_capacity, event_id]);
    return rows[0] || null;
};

module.exports.destroy = async (event_id) => {
    const query = `
    DELETE FROM events
    WHERE event_id = $1
    RETURNING *
  `;
    const { rows } = await pool.query(query, [event_id]);
    return rows[0] || null;
};
