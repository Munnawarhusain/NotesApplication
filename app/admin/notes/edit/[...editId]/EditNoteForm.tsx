"use client";

import { useRouter } from "next/navigation";
import { updateNote } from "../../../dashboard/actions";
import { Button } from "@/components/ui/button";

// Define your categories here so they are easy to update in the future
const CATEGORIES = [
  "Math",
  "Dsa",
  "OS",
  "BEEE",
  "Physics",
  "IML",
  "ESE",
  "AADK",
  "DBMS",
  "CC",
];

export default function EditNoteForm({ note }: { note: any }) {
  const router = useRouter();

  async function clientAction(formData: FormData) {
    const success = await updateNote(note._id, formData);
    if (success) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      alert("Error updating note");
    }
  }

  return (
    <form
      action={clientAction}
      className="space-y-4 bg-white p-6 shadow rounded-lg border"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          name="title"
          defaultValue={note.title}
          className="w-full p-2 border border-slate-300 rounded mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Category
        </label>
        {/* Changed from input to select for specific options */}
        <select
          name="category"
          defaultValue={note.category}
          className="w-full p-2 border border-slate-300 rounded mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
          required
        >
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          name="description"
          defaultValue={note.description}
          className="w-full p-2 border border-slate-300 rounded mt-1 h-32 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="cursor-pointer"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
