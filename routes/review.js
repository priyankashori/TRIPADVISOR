const express = require("express");
const router = express.Router({ mergeParams: true });
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const { reviewSchema } = require("../Schema.js");
const { isLoggedIn, isReviewAuthor } = require("../middleware.js");


const reviewController = require("../controllers/reviews.js");


const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


router.post(
    "/",
    isLoggedIn,
    validateReview,
    WrapAsync(reviewController.createReview)
);


router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor, // this will need the review
    WrapAsync(reviewController.destroyReview)
);



module.exports = router;
