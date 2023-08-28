const express = require("express");
const submissionController = require("../controllers/submissionController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/submit",
  authController.authToken,
  submissionController.submitAssignment
);
router.get(
  "/getSub",
  authController.authToken,
  submissionController.getAllSubmissions
);
router.put(
  "/grade/:submission_id",
  authController.authToken,
  submissionController.gradeSubmission
);

module.exports = router;
