const express = require("express");
const userController = require("../controllers/userController");
const { verifyUser } = require("../middlewares/authMiddleware");
const taskController = require("../controllers/taskController");
const router = express.Router();

router.post("/createUser", userController.createUser);
router.post("/loginUser", userController.loginUser);
router.post("/verifyEmail", userController.verifyEmail);
router.post("/verifyOtp", userController.verifyOtp);
router.post("/passwordReset", userController.passwordReset);
router.get("/readUser", verifyUser, userController.readUser);
router.post("/updateUser", verifyUser, userController.updateUser);
router.post("/createTask", verifyUser, taskController.createTask);
router.get("/readTask", verifyUser, taskController.readTask);
router.post("/updateTask/:id", verifyUser, taskController.updateTask);
router.post(
  "/updateTaskStatus/:id",
  verifyUser,
  taskController.updateTaskStatus
);
router.delete("/deleteTask/:id", verifyUser, taskController.deleteTask);
router.get(
  "/selectTaskByStatus",
  verifyUser,
  taskController.selectTaskByStatus
);
router.get("/selectTaskByDate", verifyUser, taskController.selectTaskByDate);

module.exports = router;
