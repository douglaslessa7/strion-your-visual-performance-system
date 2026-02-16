import { useState, useRef } from "react";
import { Upload, Check, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PhotoSlot {
  key: string;
  label: string;
  required: boolean;
}

const PHOTO_SLOTS: PhotoSlot[] = [
  { key: "selfie_front", label: "Selfie — Front", required: true },
  { key: "selfie_side", label: "Selfie — Side", required: true },
  { key: "body_front", label: "Body — Front", required: true },
  { key: "body_side", label: "Body — Side", required: true },
  { key: "body_back", label: "Body — Back", required: false },
  { key: "selfie_side_alt", label: "Selfie — Alt Side", required: false },
  { key: "body_side_alt", label: "Body — Alt Side", required: false },
];

interface PhotoCaptureProps {
  onComplete: (photoSetId: string, photoUrls: Record<string, string>) => void;
}

const PhotoCapture = ({ onComplete }: PhotoCaptureProps) => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Record<string, File>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const requiredCount = PHOTO_SLOTS.filter((s) => s.required).length;
  const uploadedRequired = PHOTO_SLOTS.filter(
    (s) => s.required && photos[s.key]
  ).length;

  const handleFileSelect = (key: string, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are accepted");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB");
      return;
    }
    setPhotos((prev) => ({ ...prev, [key]: file }));
    const url = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [key]: url }));
  };

  const handleUploadAll = async () => {
    if (!user || uploadedRequired < requiredCount) return;
    setUploading(true);

    try {
      const photoUrls: Record<string, string> = {};

      for (const [key, file] of Object.entries(photos)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${user.id}/day-0/${key}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("user-photos")
          .upload(path, file, { upsert: true });

        if (uploadError) throw uploadError;
        photoUrls[`${key}_url`] = path;
      }

      const { data, error } = await supabase
        .from("photo_sets")
        .insert({
          user_id: user.id,
          checkpoint_day: 0,
          ...photoUrls,
        })
        .select("id")
        .single();

      if (error) throw error;
      onComplete(data.id, photoUrls);
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("Photo upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-1">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
          Step 1 of 3
        </p>
        <h2 className="text-lg font-semibold text-foreground">
          Photo Diagnostic
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload your baseline photos for structural analysis.
        </p>
      </div>

      <div className="flex items-center justify-center">
        <span className="text-xs font-medium text-muted-foreground">
          {uploadedRequired}/{requiredCount} required uploaded
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {PHOTO_SLOTS.map((slot) => {
          const hasPhoto = !!previews[slot.key];
          return (
            <button
              key={slot.key}
              type="button"
              onClick={() => fileInputRefs.current[slot.key]?.click()}
              className={`relative aspect-[3/4] rounded-lg border-2 transition-system flex flex-col items-center justify-center gap-2 overflow-hidden ${
                hasPhoto
                  ? "border-primary shadow-[0_0_12px_-2px_hsl(var(--index-glow)/0.4)]"
                  : "border-border hover:border-muted-foreground"
              } bg-card`}
            >
              {hasPhoto ? (
                <>
                  <img
                    src={previews[slot.key]}
                    alt={slot.label}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground text-center px-2">
                    {slot.label}
                  </span>
                </>
              )}
              {slot.required && !hasPhoto && (
                <span className="absolute bottom-2 text-[10px] font-medium text-primary">
                  Required
                </span>
              )}
              <input
                ref={(el) => (fileInputRefs.current[slot.key] = el)}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(slot.key, f);
                }}
              />
            </button>
          );
        })}
      </div>

      <Button
        onClick={handleUploadAll}
        disabled={uploadedRequired < requiredCount || uploading}
        className="w-full"
      >
        {uploading ? (
          <span className="flex items-center gap-2">
            <Upload className="w-4 h-4 animate-pulse" /> Uploading...
          </span>
        ) : (
          "Continue"
        )}
      </Button>
    </div>
  );
};

export default PhotoCapture;
