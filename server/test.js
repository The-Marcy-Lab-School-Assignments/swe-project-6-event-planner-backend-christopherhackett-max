// server/test.js — delete after testing
require('dotenv').config();
const eventModel = require('./models/eventModel');

const test = async () => {
    console.log(await eventModel.list());
    console.log(await eventModel.listByUser(4));
    console.log(await userModel.findByUsername('zane'));
    console.log(await userModel.create('chris', 'ffxiv'));
    console.log(await userModel.validatePassword('chris', 'ffxiv'));
    console.log(await userModel.update(6, 'finalFantasy'));
    console.log(await userModel.destroy(6));


    // more model methods...

    // Kill the process (the open pool connections) after running queries
    process.exit();
}
test();