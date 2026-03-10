const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalAdmins, activeUsers, newToday] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
    ]);
    res.json({ success: true, data: { totalUsers, totalAdmins, activeUsers, newToday } });
  } catch (error) { next(error); }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = search ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] } : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: parseInt(limit), select: { id: true, email: true, name: true, role: true, isActive: true, isEmailVerified: true, createdAt: true }, orderBy: { createdAt: "desc" } }),
      prisma.user.count({ where }),
    ]);

    res.json({ success: true, data: users, meta: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) { next(error); }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["USER", "ADMIN"].includes(role)) return res.status(400).json({ success: false, message: "Invalid role" });
    const user = await prisma.user.update({ where: { id }, data: { role }, select: { id: true, email: true, role: true } });
    res.json({ success: true, data: user });
  } catch (error) { next(error); }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const updated = await prisma.user.update({ where: { id }, data: { isActive: !user.isActive }, select: { id: true, email: true, isActive: true } });
    res.json({ success: true, data: updated });
  } catch (error) { next(error); }
};

module.exports = { getStats, getAllUsers, updateUserRole, toggleUserStatus };
