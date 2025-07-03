
import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

async function removeBackgroundFromImage(file: File): Promise<string | null> {
  // Placeholder: Implement ML model in the future. For now, just return the image URL.
  return URL.createObjectURL(file);
}

export default function RemoveBackgroundForm() {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      setFile(f);
      setOriginalUrl(URL.createObjectURL(f));
      setResultUrl(null);
    }
  };

  const handleRemoveBackground = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);

    // Remove background (dummy - you can plug ML model here!)
    const resultSrc = await removeBackgroundFromImage(file);

    if (!resultSrc) {
      toast.error("Failed to process image.");
      setUploading(false);
      return;
    }
    setResultUrl(resultSrc);

    // Store processing metadata in Supabase
    const { error } = await supabase.from("product_inquiries").insert([
      {
        inquiry_type: "remove-background",
        status: "completed",
        specifications: { fileName: file.name },
      },
    ]);
    if (error) {
      toast.error("Could not save info to backend.");
    } else {
      toast.success("Background removed! (Demo)");
    }
    setUploading(false);
  };

  return (
    <form className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow space-y-4" onSubmit={handleRemoveBackground}>
      <h2 className="text-2xl font-semibold mb-2">Remove Background from Photo</h2>
      <Input type="file" accept="image/*" onChange={handleFileChange} />
      {originalUrl && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
          <div>
            <div className="font-medium text-xs text-zinc-500 mb-1">Original</div>
            <img src={originalUrl} className="max-w-xs max-h-48 rounded shadow" />
          </div>
          {resultUrl && (
            <div>
              <div className="font-medium text-xs text-zinc-500 mb-1">Result</div>
              <img src={resultUrl} className="max-w-xs max-h-48 rounded shadow border-2 border-green-600" />
            </div>
          )}
        </div>
      )}
      <InteractiveHoverButton
        type="submit"
        text={uploading ? "Processing..." : "Remove Background"}
        disabled={uploading || !file}
      />
    </form>
  );
}
