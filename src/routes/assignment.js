const express = require("express");
const assignmentController = require("../controllers/assignmentController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/create",
  authController.authToken,
  assignmentController.createAssignment
);
router.get(
  "/getAll",
  authController.authToken,
  assignmentController.getAllAssignments
);
router.put(
  "/update/:id",
  authController.authToken,
  assignmentController.updateAssignment
);
router.delete(
  "/delete/:id",
  authController.authToken,
  assignmentController.deleteAssignment
);

module.exports = router;
