"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getAdminNotes } from "./actions";
import { deleteNote } from "./actions";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      // Accessing session.user.id which we exposed in the NextAuth callback
      if (session?.user?.id) {
        const data = await getAdminNotes(session.user.id);
        setNotes(data);
        setLoadingNotes(false);
      }
    }
    fetchNotes();
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse font-medium text-slate-500">
          Loading session...
        </div>
      </div>
    );
  }

  const handleDelete = async (noteId: string, publicId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this note?");

    if (confirmDelete) {
      try {
        const result = await deleteNote(noteId, publicId);
        if (result.success) {
          alert("Note deleted successfully.");
        } else {
          // This is the error you saw
          alert("Failed to delete the note. Check server logs for details.");
        }
      } catch (err) {
        alert("An unexpected error occurred.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  /**
   * HELPERS FOR CLOUDINARY URLS (Assuming resource_type: "image")
   */

  // 1. View: Just use the original URL (Browsers render PDFs automatically if served as image)
  const viewPdf = (url: string) => url;

  // 2. Download: Inject 'fl_attachment' to force the "Save As" dialog
  const downloadPdf = (url: string) => {
    return url.replace("/upload/", "/upload/fl_attachment/");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 mt-1 text-sm md:text-base">
              Welcome back,{" "}
              <span className="font-semibold text-blue-600">
                {session?.user?.name}
              </span>
              !
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/notes/upload" className="flex-1 md:flex-none">
              <Button className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 shadow-sm transition-all">
                Upload Note
              </Button>
            </Link>
            <button
              onClick={handleLogout}
              className="cursor-pointer flex-1 md:flex-none px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Notes Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b bg-white flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-800">
              Your Uploaded Notes
            </h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {notes.length} Total
            </span>
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Note Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Uploaded At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loadingNotes ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-400 animate-pulse"
                    >
                      Fetching your notes...
                    </td>
                  </tr>
                ) : notes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-12 text-center text-slate-400 italic"
                    >
                      No notes found for this admin.
                    </td>
                  </tr>
                ) : (
                  notes.map((note: any) => (
                    <tr
                      key={note._id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {note.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                          {note.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <a
                          href={viewPdf(note.pdfUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-bold"
                        >
                          View
                        </a>
                        <Link
                          href={`/admin/notes/edit/${note._id}`}
                          className="text-amber-600 hover:text-amber-800 text-sm font-bold"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(note._id, note.publicId)}
                          className="text-rose-500 hover:text-rose-700 text-sm font-bold cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW */}
          <div className="md:hidden divide-y divide-slate-100">
            {notes.map((note: any) => (
              <div key={note._id} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 leading-tight">
                    {note.title}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase">
                    {note.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  UPLOADED: {new Date(note.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2 mt-1">
                  <a
                    href={viewPdf(note.pdfUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(note._id, note.publicId)}
                    className="text-rose-500 hover:text-rose-700 text-sm font-bold cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
