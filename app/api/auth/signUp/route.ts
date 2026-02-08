import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({
        status: 400,
        message: "all credentials required",
      },{status:400});
    }

    const does_admin_Exists = await Admin.findOne({ email });
    if (does_admin_Exists) {
      return NextResponse.json({
        status: 400,
        message: "admin already exists",
      },{status:400});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      status: 201,
      message: "New admin created",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong", message: error },
      { status: 500 }
    );
  }
}