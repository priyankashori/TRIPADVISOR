const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

const { listingSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");

const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

router
    .route("/")
    .get(WrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, WrapAsync(listingController.createListing));




// New Route (must be before the show route)
router.get("/new", isLoggedIn, listingController.renderNewForm);


router
    .route("/:id")
    .get(WrapAsync(listingController.showListings))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, WrapAsync(listingController.updateListings))
    .delete(isLoggedIn, isOwner, WrapAsync(listingController.destroyListings));




// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, WrapAsync(listingController.renderEditForm));



router.get("/", async (req, res) => {
    const query = req.query.q || "";
    let listings;

    if (query) {
        // case-insensitive search in multiple fields
        listings = await Listing.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { location: { $regex: query, $options: "i" } },
                { country: { $regex: query, $options: "i" } }
            ]
        });
    } else {
        listings = await Listing.find({});
    }

    res.render("listings/index", { listings, query: query || "" });
});


module.exports = router;
