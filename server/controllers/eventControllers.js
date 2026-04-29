const eventModel = require('../models/eventModel');

const listEvents = async (req, res, next) => {
    try {
        const events = await eventModel.list();
        res.send(events);
    } catch (err) {
        next(err);
    }
};

const listUserEvents = async (req, res, next) => {
    try {
        const user_id = Number(req.params.user_id);
        const events = await eventModel.listByUser(user_id);
        res.send(events);
    } catch (err) {
        next(err);
    }
};

const createEvent = async (req, res, next) => {
    try {
        const { title, description, date, location, event_type, max_capacity } =
            req.body;
        const event = await eventModel.create(
            title,
            description,
            date,
            location,
            event_type,
            max_capacity,
            req.session.userId,
        );
        res.status(201).send(event);
    } catch (err) {
        next(err);
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const eventId = Number(req.params.event_id);
        const existing = await eventModel.find(eventId);
        if (!existing) return res.status(404).send({ message: 'Event not found' });
        if (existing.user_id !== req.session.userId) {
            return res
                .status(403)
                .send({ message: 'You can only update your own events.' });
        }
        const { title, description, date, location, event_type, max_capacity } =
            req.body;
        const event = await eventModel.update(
            eventId,
            title,
            description,
            date,
            location,
            event_type,
            max_capacity,
        );
        res.send(event);
    } catch (err) {
        next(err);
    }
};

const deleteEvent = async (req, res, next) => {
    try {
        const eventId = Number(req.params.event_id);
        const existing = await eventModel.find(eventId);
        if (!existing) return res.status(404).send({ message: 'Event not found' });
        if (existing.user_id !== req.session.userId) {
            return res
                .status(403)
                .send({ message: 'You can only delete your own events.' });
        }
        const event = await eventModel.destroy(eventId);
        res.send(event);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    listEvents,
    listUserEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};