const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { verifyToken } = require("../middleware/auth.middleware");

const prisma = new PrismaClient();
router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile endpoints
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 */
router.get("/profile", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, avatar: true, createdAt: true },
    });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
});

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch("/profile", async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name },
      select: { id: true, email: true, name: true, role: true, avatar: true },
    });
    res.json({ success: true, message: "Profile updated", data: user });
  } catch (error) { next(error); }
});

/**
 * @swagger
 * /users/change-password:
 *   patch:
 *     summary: Change password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Password changed
 */
router.patch("/change-password", async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.password) return res.status(400).json({ success: false, message: "Account uses Google login" });
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(401).json({ success: false, message: "Current password is incorrect" });
    if (newPassword.length < 6) return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) { next(error); }
});

module.exports = router;
