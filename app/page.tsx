"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getAllNotes } from "./admin/dashboard/actions";
import { FileText, Download, Eye, Search } from "lucide-react";

const CATEGORIES = [
  "All",
  "Math2",
  "Dsa",
  "OS",
  "BEEE",
  "Physics",
  "IML",
  "oops",
  "python",
  "Pyqs",
];

// Demo notes for preview - replace with your actual getAllNotes() server action
// const DEMO_NOTES = [
//   {
//     _id: "1",
//     title: "Dsa questions",
//     description: "previous year cycle test & exam questions",
//     category: "Dsa",
//     pdfUrl: "#",
//   },
//   {
//     _id: "2",
//     title: "Maths2 Unit-2",
//     description: "unit-2",
//     category: "Math2",
//     pdfUrl: "#",
//   },
//   {
//     _id: "3",
//     title: "Maths2 Unit-1",
//     description: "unit -1",
//     category: "Math2",
//     pdfUrl: "#",
//   },
//   {
//     _id: "4",
//     title: "Maths2 question papers",
//     description: "previous year cycle test and exam question papers",
//     category: "Math2",
//     pdfUrl: "#",
//   },
//   {
//     _id: "5",
//     title: "Wave Optics",
//     description: "Interference, diffraction, and polarization.",
//     category: "Physics",
//     pdfUrl: "#",
//   },
//   {
//     _id: "6",
//     title: "Decision Trees",
//     description: "Classification using decision trees and random forests.",
//     category: "IML",
//     pdfUrl: "#",
//   },
// ];

export default function Page() {
  const [notes, setNotes] = useState<any[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      const data = await getAllNotes();

      setNotes(data);

      setFilteredNotes(data);

      setLoading(false);
    }

    fetchNotes();
  }, []);

  // Filter Logic

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredNotes(notes);
    } else {
      setFilteredNotes(
        notes.filter((n: any) => n.category === selectedCategory),
      );
    }
  }, [selectedCategory, notes]);

  const downloadPdf = (url: string) => {
    // Uses the attachment flag to bypass browser preview

    return url.replace("/upload/", "/upload/fl_attachment/");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8fafc" }}>
      {/* Navbar */}
      <nav
        className="border-b sticky top-0 z-50"
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3 sm:px-6">
          <h1 className="text-xl font-bold" style={{ color: "#2563eb" }}>
            Notes App
          </h1>
          <Link href="/signIn">
            <Button
              size="sm"
              className="cursor-pointer"
              style={{ backgroundColor: "#0f172a", color: "#ffffff" }}
            >
              Admin Login
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-10">
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2
              className="text-3xl font-extrabold"
              style={{ color: "#0f172a" }}
            >
              Study Materials
            </h2>
            <p className="mt-1" style={{ color: "#64748b" }}>
              Access high-quality PDF notes for your subjects.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-bold" style={{ color: "#334155" }}>
              Select subject:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-lg shadow-sm outline-none cursor-pointer text-sm font-medium"
              style={{
                backgroundColor: "#ffffff",
                borderColor: "#e2e8f0",
                color: "#0f172a",
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes Grid - 3 columns */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2rem",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  aspectRatio: "1 / 1",
                  backgroundColor: "#e2e8f0",
                  borderRadius: "1rem",
                  animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                }}
              />
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div
            className="text-center py-20"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "1rem",
              border: "2px dashed #e2e8f0",
            }}
          >
            <Search
              className="mx-auto mb-4"
              style={{ width: 48, height: 48, color: "#cbd5e1" }}
            />
            <p className="font-medium" style={{ color: "#64748b" }}>
              No notes found in this category.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {filteredNotes.map((note: any) => (
              <div
                key={note._id}
                className="group"
                style={{
                  aspectRatio: "1 / 1",
                  backgroundColor: "#C0FAF7",
                  borderRadius: "1rem",
                  border: "1px solid #e2e8f0",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(0,0,0,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Top section */}
                <div>
                  {/* Header row */}
                  <div
                    className="flex items-start justify-between"
                    style={{ marginBottom: "1rem" }}
                  >
                    <div
                      style={{
                        padding: "0.625rem",
                        borderRadius: "0.75rem",
                        backgroundColor: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <FileText
                        style={{ width: 20, height: 20, color: "#15803d" }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        backgroundColor: "rgba(255,255,255,0.9)",
                        color: "#0f172a",
                        padding: "0.25rem 0.625rem",
                        borderRadius: "0.5rem",
                      }}
                    >
                      {note.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 600,
                      color: "#0f172a",
                      marginBottom: "0.5rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {note.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#64748b",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {note.description ||
                      "No description provided for this note."}
                  </p>
                </div>

                {/* Actions at bottom */}
                <div
                  className="flex"
                  style={{ gap: "0.75rem", paddingTop: "1rem" }}
                >
                  <a
                    href={note.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                    style={{
                      flex: 1,
                      gap: "0.375rem",
                      padding: "0.625rem",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      backgroundColor: "#ffffff",
                      color: "#15803d",
                      textDecoration: "none",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f0fdf4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    <Eye style={{ width: 16, height: 16 }} />
                    View
                  </a>

                  <a
                    href={downloadPdf(note.pdfUrl)}
                    className="flex items-center justify-center"
                    style={{
                      flex: 1,
                      gap: "0.375rem",
                      padding: "0.625rem",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      backgroundColor: "#ffffff",
                      color: "#15803d",
                      textDecoration: "none",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f0fdf4";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffffff";
                    }}
                  >
                    <Download style={{ width: 16, height: 16 }} />
                    Save
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
