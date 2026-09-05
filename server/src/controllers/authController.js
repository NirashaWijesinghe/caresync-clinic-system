import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || "caresync_secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPhone = (phone) => {
  if (!phone || !phone.trim()) return true;
  return /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/.test(phone.trim());
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: "Full name must be at least 2 characters long." });
    }

    if (!isValidEmail(email.trim())) {
      return res.status(400).json({ message: "Please provide a valid email address (e.g., name@example.com)." });
    }

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({ message: "Please provide a valid phone number (e.g., 0771234567 or +94771234567)." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({ message: "An account with this email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedRole = role === "DOCTOR" || role === "ADMIN" ? role : "PATIENT";

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone ? phone.trim() : null,
        role: assignedRole,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true
      }
    });

    const token = generateToken(user.id);

    return res.status(201).json({
      message: "Registration successful",
      user,
      token
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Failed to register user", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        doctorProfile: {
          select: { id: true, specialtyId: true }
        }
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      doctorProfile: user.doctorProfile
    };

    return res.status(200).json({
      message: "Login successful",
      user: userProfile,
      token
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ message: "Failed to retrieve user profile" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, avatar, bio, hospital, consultationFee } = req.body;

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({ message: "Please provide a valid phone number (e.g., 0771234567 or +94771234567)." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name: name.trim() }),
        ...(phone !== undefined && { phone: phone ? phone.trim() : null }),
        ...(avatar && { avatar: avatar.trim() })
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        avatar: true,
        doctorProfile: {
          include: { specialty: true }
        }
      }
    });

    if (req.user.role === "DOCTOR" && (bio || hospital || consultationFee)) {
      await prisma.doctor.update({
        where: { userId },
        data: {
          ...(bio && { bio: bio.trim() }),
          ...(hospital && { hospital: hospital.trim() }),
          ...(consultationFee && { consultationFee: Number(consultationFee) })
        }
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};
