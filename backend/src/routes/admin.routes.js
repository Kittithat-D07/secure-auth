const express = require("express");
const router = express.Router();
const { getStats, getAllUsers, updateUserRole, toggleUserStatus } = require("../controllers/admin.controller");
const { verifyToken, checkRole } = require("../middleware/auth.middleware");

router.use(verifyToken);
router.use(checkRole("ADMIN"));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin only endpoints
 */

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats data
 */
router.get("/stats", getStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Change user role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch("/users/:id/role", updateUserRole);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Toggle user status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Status toggled
 */
router.patch("/users/:id/status", toggleUserStatus);

module.exports = router;
