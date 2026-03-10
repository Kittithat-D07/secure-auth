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
 *   description: Admin only endpoints (requires ADMIN role)
 */

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Stats }
 */
router.get("/stats", getStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (paginated)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: User list }
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
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: { type: string, enum: [USER, ADMIN] }
 *     responses:
 *       200: { description: Role updated }
 */
router.patch("/users/:id/role", updateUserRole);

/**
 * @swagger
 * /admin/users/{id}/status:
 *   patch:
 *     summary: Enable or disable user account
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Status toggled }
 */
router.patch("/users/:id/status", toggleUserStatus);

module.exports = router;
