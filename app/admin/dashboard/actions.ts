"use server";

import connectDB from "@/lib/mongodb";
import Note from "@/models/Notes";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary (Make sure these env variables are in your .env.local)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function updateNote(id: string, formData: FormData) {
  try {
    await connectDB();
    await Note.findByIdAndUpdate(id, {
      title: formData.get("title"),
      category: formData.get("category"),
      description: formData.get("description"),
    });
    // This refreshes the dashboard data
    revalidatePath("/admin/dashboard");
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function deleteNote(noteId: string, publicId: string) {
  try {
    await connectDB();

    // 1. Delete from Cloudinary 
    // If you used the 'image' resource_type workaround, keep this as 'image'
    const cloudinaryResponse = await cloudinary.uploader.destroy(publicId, { 
      resource_type: "image" 
    });

    if (cloudinaryResponse.result !== "ok" && cloudinaryResponse.result !== "not found") {
      throw new Error("Cloudinary deletion failed");
    }

    // 2. Delete from MongoDB
    await Note.findByIdAndDelete(noteId);

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete operation failed:", error);
    return { success: false };
  }
}

export async function getAllNotes() {
  try {
    await connectDB();
    const notes = await Note.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(notes));
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}

export async function getAdminNotes(adminId:string) {
  try {
    await connectDB();
    // Fetch all notes and convert MongoDB _id to string for the client
    const notes = await Note.find({uploadedBy: adminId}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(notes)); 
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
}