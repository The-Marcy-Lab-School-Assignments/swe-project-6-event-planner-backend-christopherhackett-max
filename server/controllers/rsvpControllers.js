const rsvpModel = require('../models/rsvpModel');

const confirmRsvp = async (req, res, next) => {
    try {
        const eventId = req.params.event_id;
        const confirmation = await rsvpModel.rsvp(eventId, req.session.userId);
        if (!confirmation) return res.status(200).send(true);
        res.status(201).send(true);
    } catch (err) {
        next(err);
    }
};

const cancelRsvp = async (req, res, next) => {
    try {
        const eventId = req.params.event_id;
        await rsvpModel.unrsvp(eventId, req.session.userId);
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

const listConfirmedRsvps = async (req, res, next) => {
    try {
        const userId = req.params.user_id;
        const rsvps = await rsvpModel.rsvpsByUser(userId);
        res.send(rsvps);
    } catch (err) {
        next(err);
    }
};

module.exports = { confirmRsvp, cancelRsvp, listConfirmedRsvps };