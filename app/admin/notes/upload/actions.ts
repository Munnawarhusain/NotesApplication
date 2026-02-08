"use server";

import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/mongodb"; // Adjust based on your actual file name
import Note from "@/models/Notes";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadNoteAction(formData: FormData, adminId: string) {
  try {
    await connectDB();

    const file = formData.get("pdf") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;

    if (!file) throw new Error("No file uploaded");

    // Convert file to Buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          resource_type: "image", // PDFs are often treated as raw files
          folder: "admin_notes",
          format: "pdf"
        },
        (error , result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // Save to MongoDB using your schema
    await Note.create({
      title,
      description,
      category,
      pdfUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      uploadedBy: adminId, // Passed from your session logic
    });

    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Upload Error:", error);
    return { success: false, error: error.message };
  }
}