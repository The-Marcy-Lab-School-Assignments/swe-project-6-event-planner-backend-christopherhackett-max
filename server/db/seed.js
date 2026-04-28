const bcrypt = require('bcrypt');
const pool = require('./pool');

const SALT_ROUNDS = 8;

const seed = async () => {
  await pool.query('DROP TABLE IF EXISTS rsvps');
  await pool.query('DROP TABLE IF EXISTS events');
  await pool.query('DROP TABLE IF EXISTS users');

  await pool.query(`
    CREATE TABLE users (
      user_id       SERIAL PRIMARY KEY,
      username      TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE events (
      event_id      SERIAL PRIMARY KEY,
      title         TEXT NOT NULL,
      description   TEXT,
      date          TEXT NOT NULL,
      location      TEXT NOT NULL,
      event_type    TEXT NOT NULL,
      max_capacity  INTEGER NOT NULL,
      user_id       INTEGER REFERENCES users(user_id) ON DELETE CASCADE
    )
  `);

  await pool.query(`
    CREATE TABLE rsvps (
      rsvp_id   SERIAL PRIMARY KEY,
      user_id   INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      event_id  INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
      UNIQUE(user_id, event_id)
    )
  `);

  // --- Users ---
  const insertUserSql =
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING user_id;';

  const [mayaRes, jojoRes, zaneRes, gabeRes, willRes] = await Promise.all([
    pool.query(insertUserSql, ['maya', await bcrypt.hash('sunflower99', SALT_ROUNDS)]),
    pool.query(insertUserSql, ['jojo', await bcrypt.hash('jojolionPeak', SALT_ROUNDS)]),
    pool.query(insertUserSql, ['zane', await bcrypt.hash('123455', SALT_ROUNDS)]),
    pool.query(insertUserSql, ['gabe', await bcrypt.hash('di00367', SALT_ROUNDS)]),
    pool.query(insertUserSql, ['will', await bcrypt.hash('marvelRivals', SALT_ROUNDS)]),
  ]);

  const mayaId = mayaRes.rows[0].user_id;
  const jojoId = jojoRes.rows[0].user_id;
  const zaneId = zaneRes.rows[0].user_id;
  const gabeId = gabeRes.rows[0].user_id;
  const willId = willRes.rows[0].user_id;

  const insertEventSql =
    'INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7)';

  await pool.query(insertEventSql, [
    'Design Systems Summit',
    'A day of talks on building scalable design systems across teams.',
    '2026-06-10',
    'City Arts Center',
    'conference',
    180,
    mayaId,
  ]);

  await pool.query(insertEventSql, [
    'Intro to Python Workshop',
    'Beginner-friendly session covering Python basics and mini projects.',
    '2026-06-17',
    'Public Library Room B',
    'workshop',
    25,
    jojoId,
  ]);

  await pool.query(insertEventSql, [
    'Rooftop Social Hour',
    'Casual evening hangout with drinks and city views.',
    '2026-06-21',
    'The Skyline Lounge',
    'social',
    60,
    zaneId,
  ]);

  await pool.query(insertEventSql, [
    'Founders Mixer',
    'Connect with early-stage founders and angel investors in the area.',
    '2026-06-28',
    'Venture Co-Working Space',
    'networking',
    45,
    mayaId,
  ]);

  await pool.query(insertEventSql, [
    'Jazz in the Park',
    'Live jazz performances from local artists on the main lawn.',
    '2026-07-05',
    'Riverside Park Pavilion',
    'concert',
    250,
    jojoId,
  ]);

  await pool.query(insertEventSql, [
    'Charity 5K Run',
    'Community fun run raising funds for local food banks.',
    '2026-07-12',
    'Lakeview Trail',
    'fundraiser',
    200,
    gabeId,
  ]);

  await pool.query(insertEventSql, [
    'Pickup Basketball League',
    'Casual weekly basketball games, all skill levels welcome.',
    '2026-07-19',
    'Recreation Center Gym',
    'sports',
    40,
    willId,
  ]);

  await pool.query(insertEventSql, [
    'Board Game Night',
    'Bring your favorite game or try something new from our library.',
    '2026-07-26',
    'The Common Table Cafe',
    'other',
    35,
    zaneId,
  ]);

  const insertRsvpSql = 'INSERT INTO rsvps (user_id, event_id) VALUES ($1, $2)';

  await pool.query(insertRsvpSql, [mayaId, 2]);
  await pool.query(insertRsvpSql, [mayaId, 5]);

  await pool.query(insertRsvpSql, [jojoId, 1]);
  await pool.query(insertRsvpSql, [jojoId, 3]);

  await pool.query(insertRsvpSql, [zaneId, 6]);
  await pool.query(insertRsvpSql, [zaneId, 7]);

  await pool.query(insertRsvpSql, [gabeId, 1]);
  await pool.query(insertRsvpSql, [gabeId, 4]);
  await pool.query(insertRsvpSql, [gabeId, 8]);

  await pool.query(insertRsvpSql, [willId, 3]);
  await pool.query(insertRsvpSql, [willId, 6]);

  console.log('Database seeded.');
};

seed()
  .catch((err) => {
    console.error('Error seeding database:', err);
    process.exit(1);
  })
  .finally(() => pool.end());