
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


module.exports.createReview = async (req, res) => {
        let listing = await Listing.findById(req.params.id).populate({
            path: "reviews",
            populate: { path: "author", select: "username" }   // populate author with username
        })
            .populate("owner", "username");;
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        await newReview.populate("author", "username");
        req.flash("success", "New Review Created!");

        res.redirect(`/listings/${listing._id}`);
    };


    module.exports.destroyReview = async (req, res) => {
        let { id, reviewId } = req.params;

        // Remove review reference from the listing
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

        // Delete the review itself
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`);
    };