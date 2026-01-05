const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserRoleByEmail,
  getSingleUser,
} = require("../controllers/userController");

router.post("/users", createUser);

router.get("/users/role/:email", getUserRoleByEmail);

router.get("/users/:uid", getSingleUser);
router.put("/users/:uid", require("../controllers/userController").updateUser);

module.exports = router;
