import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Check if model already exists (important for Next.js hot reload)
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

export default Admin;