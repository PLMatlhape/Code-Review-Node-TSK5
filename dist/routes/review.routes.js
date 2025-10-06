"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const reviewController = new review_controller_1.ReviewController();
router.get('/my-reviews', auth_1.authenticate, reviewController.getMyReviews);
router.get('/:id', auth_1.authenticate, reviewController.getReview);
exports.default = router;
//# sourceMappingURL=review.routes.js.map