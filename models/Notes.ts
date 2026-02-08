import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Math2', 'Dsa', 'OS', 'BEEE', 'Physics', 'IML', 'oops', 'python','Pyqs'],
  },
  pdfUrl: {
    type: String,
    required: [true, 'PDF URL is required'],
  },
  publicId: {
    type: String,
    required: [true, 'Cloudinary public ID is required'],
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
}, {
  timestamps: true,  // Automatically adds createdAt and updatedAt
});

// Check if model already exists (important for Next.js hot reload)
const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);

export default Note;