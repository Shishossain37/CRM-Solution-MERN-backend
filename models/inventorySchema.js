const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    pName: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true,
        trim: true
    },
    spd: {
        type: Date,
        required: true
    }
    ,

    profile: {
        type: String,
        required: true,
    },

    datecreated: Date,
    dateUpdated: Date
});

// model
const inventory = new mongoose.model("inventory", inventorySchema);

module.exports = inventory;