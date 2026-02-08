import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <div>This is your uploaded notes-</div>
      <div className="mt-14">
          <Link href="/admin/notes/upload">
            <Button className="text-sm md:text-base cursor-pointer">
              Upload Note
            </Button>
          </Link>
        </div>
    </div>
  );
};

export default page;
