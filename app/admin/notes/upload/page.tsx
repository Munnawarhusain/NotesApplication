"use client";

import { useEffect, useState } from "react";
import { uploadNoteAction } from "./actions";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function UploadNotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();

  // Note: You should get the actual adminId from your Auth session (e.g., NextAuth)
  const adminId: string = session?.user?.id || "";
  console.log(adminId);

  async function clientAction(formData: FormData) {
    setLoading(true);
    const result = await uploadNoteAction(formData, adminId);
    setLoading(false);

    if (result.success) {
      alert("Note uploaded and saved successfully!");
      (document.getElementById("upload-form") as HTMLFormElement).reset();
      router.push("/admin/dashboard");
    } else {
      alert("Error: " + result.error);
      router.push("/admin/admin/notes/upload");
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Upload New Note (Admin)</h1>

      <form
        id="upload-form"
        action={clientAction}
        className="space-y-4 bg-slate-50 p-6 rounded-lg border"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            type="text"
            required
            className="w-full p-2 border rounded"
            placeholder="Title of the note"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            required
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Brief summary of the note..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="category"
            required
            className="w-full p-2 cursor-pointer border rounded"
          >
            <option value="">Select Category</option>
            {[
              "Math2",
              "Dsa",
              "OS",
              "BEEE",
              "Physics",
              "IML",
              "oops",
              "python",
              "Pyqs",
            ].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">PDF File</label>
          <input
            name="pdf"
            type="file"
            accept="application/pdf"
            required
            className="w-full p-2 border rounded cursor-pointer bg-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition"
        >
          {loading ? "Processing Upload..." : "Upload Note"}
        </button>
      </form>
    </div>
  );
}
