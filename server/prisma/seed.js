import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Safely Seeding CareSync Healthcare Database (No Data Deletion)...");

  // 1. Create or Update Specialties (Upsert by name)
  const cardiology = await prisma.specialty.upsert({
    where: { name: "Cardiology" },
    update: {},
    create: {
      name: "Cardiology",
      description: "Heart and cardiovascular system care and disease management.",
      icon: "HeartPulse"
    }
  });

  const dermatology = await prisma.specialty.upsert({
    where: { name: "Dermatology" },
    update: {},
    create: {
      name: "Dermatology",
      description: "Skin, hair, nail treatments and cosmetic skincare.",
      icon: "Sparkles"
    }
  });

  const neurology = await prisma.specialty.upsert({
    where: { name: "Neurology" },
    update: {},
    create: {
      name: "Neurology",
      description: "Brain, spinal cord, and nervous system disorders.",
      icon: "Activity"
    }
  });

  const pediatrics = await prisma.specialty.upsert({
    where: { name: "Pediatrics" },
    update: {},
    create: {
      name: "Pediatrics",
      description: "Medical care for infants, children, and adolescents.",
      icon: "Baby"
    }
  });

  const orthopedics = await prisma.specialty.upsert({
    where: { name: "Orthopedics" },
    update: {},
    create: {
      name: "Orthopedics",
      description: "Bones, joints, ligaments, tendons, and muscles.",
      icon: "ShieldPlus"
    }
  });

  const generalMedicine = await prisma.specialty.upsert({
    where: { name: "General Medicine" },
    update: {},
    create: {
      name: "General Medicine",
      description: "Comprehensive primary healthcare and routine checkups.",
      icon: "Stethoscope"
    }
  });

  console.log("✅ Specialties verified & ready");

  // 2. Ensure Admin User Exists (Upsert by email)
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@caresync.com" },
    update: {},
    create: {
      name: "Dr. Kusal Perera (Admin)",
      email: "admin@caresync.com",
      password: adminPassword,
      role: "ADMIN",
      phone: "+94 77 123 4567",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256"
    }
  });

  // 3. Ensure Sample Patients Exist (Upsert by email)
  const patientPassword = await bcrypt.hash("patient123", 10);
  const patient1 = await prisma.user.upsert({
    where: { email: "kasun@test.com" },
    update: {},
    create: {
      name: "Kasun Silva",
      email: "kasun@test.com",
      password: patientPassword,
      role: "PATIENT",
      phone: "+94 71 888 9900",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256"
    }
  });

  const patient2 = await prisma.user.upsert({
    where: { email: "nethmi@test.com" },
    update: {},
    create: {
      name: "Nethmi Fernando",
      email: "nethmi@test.com",
      password: patientPassword,
      role: "PATIENT",
      phone: "+94 72 333 4455",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256"
    }
  });

  // 4. Ensure Initial Default Doctors Exist (Upsert by email & userId)
  const doctorPassword = await bcrypt.hash("doctor123", 10);

  // Doctor 1: Cardiologist
  const docUser1 = await prisma.user.upsert({
    where: { email: "dr.sarah@caresync.com" },
    update: {},
    create: {
      name: "Dr. Sarah Jayawardena",
      email: "dr.sarah@caresync.com",
      password: doctorPassword,
      role: "DOCTOR",
      phone: "+94 77 555 1001",
      avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256"
    }
  });

  const doctor1 = await prisma.doctor.upsert({
    where: { userId: docUser1.id },
    update: {},
    create: {
      userId: docUser1.id,
      specialtyId: cardiology.id,
      bio: "Senior Consultant Cardiologist with 12+ years of experience in cardiovascular interventions, ECG diagnosis, and hypertension management.",
      qualifications: "MBBS (Colombo), MD (Cardiology), MRCP (UK)",
      experienceYears: 12,
      consultationFee: 3500,
      workingDays: "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
      startTime: "09:00",
      endTime: "16:00",
      slotDurationMinutes: 30,
      rating: 5.0,
      hospital: "CareSync Central & National Hospital Colombo"
    }
  });

  // Doctor 2: Dermatologist
  const docUser2 = await prisma.user.upsert({
    where: { email: "dr.chamari@caresync.com" },
    update: {},
    create: {
      name: "Dr. Chamari Wijesinghe",
      email: "dr.chamari@caresync.com",
      password: doctorPassword,
      role: "DOCTOR",
      phone: "+94 77 555 1002",
      avatar: "/images/doctors/dr_chamari.jpg"
    }
  });

  const doctor2 = await prisma.doctor.upsert({
    where: { userId: docUser2.id },
    update: {},
    create: {
      userId: docUser2.id,
      specialtyId: dermatology.id,
      bio: "Specialist in clinical dermatology, laser skin therapy, acne treatments, and advanced aesthetic rejuvenation.",
      qualifications: "MBBS, MD (Dermatology), Board Certified Dermatologist",
      experienceYears: 8,
      consultationFee: 3000,
      workingDays: "Monday,Wednesday,Friday,Saturday",
      startTime: "10:00",
      endTime: "17:00",
      slotDurationMinutes: 30,
      rating: 5.0,
      hospital: "CareSync Aesthetics Wing, Colombo 03"
    }
  });

  // Doctor 3: Neurologist
  const docUser3 = await prisma.user.upsert({
    where: { email: "dr.ruwan@caresync.com" },
    update: {},
    create: {
      name: "Dr. Ruwan Wickramasinghe",
      email: "dr.ruwan@caresync.com",
      password: doctorPassword,
      role: "DOCTOR",
      phone: "+94 77 555 1003",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256"
    }
  });

  await prisma.doctor.upsert({
    where: { userId: docUser3.id },
    update: {},
    create: {
      userId: docUser3.id,
      specialtyId: neurology.id,
      bio: "Consultant Neurologist specializing in stroke rehabilitation, migraine disorders, epilepsy management, and neurological diagnostics.",
      qualifications: "MBBS, MD (Neurology), Fellowship in Neurophysiology (Singapore)",
      experienceYears: 15,
      consultationFee: 4000,
      workingDays: "Tuesday,Thursday,Saturday",
      startTime: "09:00",
      endTime: "15:00",
      slotDurationMinutes: 45,
      rating: 5.0,
      hospital: "CareSync Neuro Institute, Kandy"
    }
  });

  // Doctor 4: Pediatrician
  const docUser4 = await prisma.user.upsert({
    where: { email: "dr.anoma@caresync.com" },
    update: {},
    create: {
      name: "Dr. Anoma Senaratne",
      email: "dr.anoma@caresync.com",
      password: doctorPassword,
      role: "DOCTOR",
      phone: "+94 77 555 1004",
      avatar: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=256"
    }
  });

  await prisma.doctor.upsert({
    where: { userId: docUser4.id },
    update: {},
    create: {
      userId: docUser4.id,
      specialtyId: pediatrics.id,
      bio: "Dedicated pediatric specialist focusing on child growth monitoring, newborn care, immunization plans, and adolescent health.",
      qualifications: "MBBS, DCH, MD (Paediatrics), FRCPCH",
      experienceYears: 10,
      consultationFee: 2500,
      workingDays: "Monday,Tuesday,Wednesday,Thursday,Friday",
      startTime: "08:30",
      endTime: "14:00",
      slotDurationMinutes: 30,
      rating: 5.0,
      hospital: "Lady Ridgeway & CareSync Children's Care"
    }
  });

  console.log("✅ Core System Accounts & Doctors ready");

  // 5. Initial Sample Reviews (Only if not already present)
  const existingReviews = await prisma.review.count();
  if (existingReviews === 0) {
    await prisma.review.create({
      data: {
        patientId: patient1.id,
        doctorId: doctor1.id,
        rating: 5,
        comment: "Dr. Sarah is very thorough and reassuring. Explained the ECG report with great clarity."
      }
    });

    await prisma.review.create({
      data: {
        patientId: patient2.id,
        doctorId: doctor2.id,
        rating: 5,
        comment: "Excellent dermatologist! The prescribed topical cream cleared my skin rash in just 3 days."
      }
    });
    console.log("✅ Initial sample reviews added");
  }

  console.log("✨ CareSync Database is in Safe Mode. No user data will ever be wiped.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
