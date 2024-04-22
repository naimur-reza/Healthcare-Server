import { userRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../src/app/shared/prisma";

const seedSuperAdmin = async () => {
  try {
    const isExistSuperAdmin = await prisma.user.findFirst({
      where: {
        role: userRole.SUPER_ADMIN,
      },
    });

    if (isExistSuperAdmin) {
      console.log("Super admin already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash("superadmin", 12);

    const superAdminData = await prisma.user.create({
      data: {
        email: "super@admin.com",
        password: hashedPassword,
        role: userRole.SUPER_ADMIN,
        admin: {
          create: {
            name: "Super Admin",
            //email: "super@admin.com",
            contactNumber: "01234567890",
          },
        },
      },
    });

    console.log("Super Admin Created Successfully!", superAdminData);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
