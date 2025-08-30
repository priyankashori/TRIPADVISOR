const mongoose = require("mongoose");
// const {isOwner} = require("../middleware");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String, // lowercase to match your Joi and form
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now, // no parentheses
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

module.exports = mongoose.model("Review", reviewSchema);