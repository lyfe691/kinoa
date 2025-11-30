"use client";

import * as React from "react";
import Cropper, { Area } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import getCroppedImg from "@/lib/image-crop";
import { Loader2, ZoomIn, ZoomOut, Crop } from "lucide-react";

interface ImageCropperDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  fileType?: string;
  onCropComplete: (croppedBlob: Blob) => Promise<void>;
  aspect?: number;
}

export function ImageCropperDialog({
  open,
  onOpenChange,
  imageSrc,
  fileType = "image/jpeg",
  onCropComplete,
  aspect = 1,
}: ImageCropperDialogProps) {
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = React.useState<Area | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropAreaChange = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsLoading(true);
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        0,
        undefined,
        fileType,
      );
      if (croppedImage) {
        await onCropComplete(croppedImage);
        onOpenChange(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl gap-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crop className="w-5 h-5" /> Crop Profile Picture
          </DialogTitle>
          <DialogDescription>
            Drag to position and use the slider to zoom.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="relative h-80 w-full overflow-hidden rounded-xl border bg-muted/50 shadow-inner ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropAreaChange}
                showGrid={false}
                cropShape="round"
                classes={{
                  containerClassName: "bg-muted/50",
                  mediaClassName: "",
                }}
              />
            )}
          </div>

          <div className="flex items-center justify-center gap-4 px-4">
            <ZoomOut className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              className="max-w-[60%] flex-1 cursor-pointer"
            />
            <ZoomIn className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Done"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
