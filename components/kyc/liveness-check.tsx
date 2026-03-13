import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import {
  ScanFace,
  Camera,
  RefreshCw,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/buttons/button';
import { toast } from 'sonner';
import Image from 'next/image';

interface LivenessCheckProps {
  isCompleted: boolean;
  onComplete: (status: boolean) => void;
}

export function LivenessCheck({ isCompleted, onComplete }: LivenessCheckProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: 'user',
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
      setIsCameraOpen(false);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setIsCameraOpen(true);
  };

  const uploadCapture = async () => {
    if (!capturedImage) return;

    try {
      setIsUploading(true);
      onComplete(true);
      toast.success('Liveness check completed!');
    } catch (error: unknown) {
      toast.error('Failed to complete liveness check');
    } finally {
      setIsUploading(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="rounded-2xl p-6 shadow-sm border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-900/10">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-700 dark:text-green-400">
              Verification Complete
            </h3>
            <p className="text-sm text-green-600 dark:text-green-500">
              Your liveness check has been verified successfully.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-border">
      <div className="flex flex-col gap-6">
        {!isCameraOpen && !capturedImage && (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3">
              <div className="aspect-square rounded-xl bg-muted flex flex-col items-center justify-center border-2 border-dashed border-border">
                <ScanFace
                  className="text-muted-foreground mb-2"
                  size={48}
                  strokeWidth={1.5}
                />
                <span className="text-xs text-muted-foreground font-medium">
                  Live Capture
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold font-sans mb-2 text-foreground">
                Liveness Check
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                {`To prevent fraud and ensure platform integrity, we need to verify that you are a real person. Please enable your camera to complete a quick face scan.`}
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsCameraOpen(true)}
                  className="bg-foreground text-background"
                >
                  <Camera className="mr-2 h-4 w-4" /> Start Camera
                </Button>
              </div>
            </div>
          </div>
        )}

        {isCameraOpen && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-primary/20">
              <Webcam
                audio={false}
                height={400}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={400}
                videoConstraints={videoConstraints}
                className="object-cover"
              />
              <div className="absolute inset-0 border-[3px] border-dashed border-white/50 rounded-full m-12 opacity-50 pointer-events-none"></div>
            </div>
            <p className="text-sm text-muted-foreground">
              Position your face within the frame
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setIsCameraOpen(false)}>
                Cancel
              </Button>
              <Button onClick={capture}>Capture Photo</Button>
            </div>
          </div>
        )}

        {capturedImage && (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-square w-[300px] border border-border">
              <Image
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={retake} disabled={isUploading}>
                <RefreshCw className="mr-2 h-4 w-4" /> Retake
              </Button>
              <Button onClick={uploadCapture} disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{' '}
                    Uploading...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" /> Submit Verification
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
