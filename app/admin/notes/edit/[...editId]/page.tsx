import connectDB from "@/lib/mongodb";
import Note from "@/models/Notes";
import { notFound } from "next/navigation";
import EditNoteForm from "./EditNoteForm";

// In Next.js 15+, params is a Promise
export default async function EditPage({ 
  params 
}: { 
  params: Promise<{ editId: string[] }> 
}) {
  await connectDB();
  
  // Await params before accessing editId to fix the 'undefined' error
  const resolvedParams = await params;
  const noteId = resolvedParams.editId[0];
  
  const note = await Note.findById(noteId).lean();

  if (!note) return notFound();

  const plainNote = JSON.parse(JSON.stringify(note));

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Note Details</h1>
      <EditNoteForm note={plainNote} />
    </div>
  );
}