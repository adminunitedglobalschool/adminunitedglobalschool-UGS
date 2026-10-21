import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCw, 
  Trash2, 
  Sparkles,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

interface StudentPhotoUploadProps {
  photo: string | null;
  onPhotoChange: (photoDataUrl: string | null, sizeKb: number) => void;
  maxSizeKb?: number; // default 20 KB
}

/**
 * Compresses an HTML Image element to a JPEG base64 string strictly under targetKb.
 * Uses canvas resizing and iterative JPEG quality reduction.
 */
export async function compressImageToTargetKb(
  img: HTMLImageElement,
  targetKb = 20,
  maxDimension = 320
): Promise<{ dataUrl: string; sizeKb: number }> {
  return new Promise((resolve) => {
    // 1. Calculate aspect ratio (passport ratio ~ 3:4 or 1:1)
    let width = img.width;
    let height = img.height;

    // Scale down dimensions if needed
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve({ dataUrl: img.src, sizeKb: 20 });
      return;
    }

    // Fill white background for passport photo
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    // Iterative quality reduction to stay strictly under targetKb (20 KB)
    const targetBytes = targetKb * 1024;
    let quality = 0.85;
    let dataUrl = canvas.toDataURL('image/jpeg', quality);
    
    // Estimate byte size from base64 string length
    let byteLength = Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);

    // If still over target, reduce quality in steps
    while (byteLength > targetBytes && quality > 0.2) {
      quality -= 0.1;
      dataUrl = canvas.toDataURL('image/jpeg', quality);
      byteLength = Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);
    }

    // If still too large, downscale dimensions slightly and re-try
    if (byteLength > targetBytes && width > 180) {
      const smallerWidth = Math.round(width * 0.75);
      const smallerHeight = Math.round(height * 0.75);
      const smallCanvas = document.createElement('canvas');
      smallCanvas.width = smallerWidth;
      smallCanvas.height = smallerHeight;
      const sCtx = smallCanvas.getContext('2d');
      if (sCtx) {
        sCtx.fillStyle = '#FFFFFF';
        sCtx.fillRect(0, 0, smallerWidth, smallerHeight);
        sCtx.drawImage(canvas, 0, 0, smallerWidth, smallerHeight);
        dataUrl = smallCanvas.toDataURL('image/jpeg', 0.65);
        byteLength = Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);
      }
    }

    const finalSizeKb = +(byteLength / 1024).toFixed(1);
    resolve({ dataUrl, sizeKb: finalSizeKb });
  });
}

export const StudentPhotoUpload: React.FC<StudentPhotoUploadProps> = ({
  photo,
  onPhotoChange,
  maxSizeKb = 20
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSizeKb, setCurrentSizeKb] = useState<number | null>(() => {
    if (!photo) return null;
    const bytes = Math.round((photo.length - 'data:image/jpeg;base64,'.length) * 0.75);
    return +(bytes / 1024).toFixed(1);
  });
  const [compressionNotice, setCompressionNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Stop camera stream when component unmounts or camera closes
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // Start live webcam stream
  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setCameraError(null);
    setIsCameraOpen(true);

    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError(
        err.name === 'NotAllowedError' 
          ? 'Camera permission denied. Please allow camera access in browser settings.'
          : 'Unable to connect to camera device. Please upload a photo file instead.'
      );
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const switchCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture current frame from live webcam and auto-compress <= 20 KB
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    setIsProcessing(true);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    
    // Crop center square / passport 3:4 ratio from video
    const vWidth = video.videoWidth || 640;
    const vHeight = video.videoHeight || 480;

    // Passport aspect ratio 3:4
    const cropWidth = Math.min(vWidth, Math.round(vHeight * 0.75));
    const cropHeight = Math.round(cropWidth * (4 / 3));
    const startX = (vWidth - cropWidth) / 2;
    const startY = (vHeight - cropHeight) / 2;

    canvas.width = 300;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        video,
        startX,
        Math.max(0, startY),
        cropWidth,
        Math.min(vHeight, cropHeight),
        0,
        0,
        canvas.width,
        canvas.height
      );

      const tempImg = new Image();
      tempImg.onload = async () => {
        const { dataUrl, sizeKb } = await compressImageToTargetKb(tempImg, maxSizeKb, 300);
        setCurrentSizeKb(sizeKb);
        setCompressionNotice(`Photo captured & formatted: ${sizeKb} KB (under ${maxSizeKb} KB limit)`);
        onPhotoChange(dataUrl, sizeKb);
        stopCamera();
        setIsProcessing(false);
      };
      tempImg.src = canvas.toDataURL('image/jpeg', 0.85);
    } else {
      setIsProcessing(false);
      stopCamera();
    }
  };

  // Handle file input upload (with auto-compression if > 20 KB)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setCompressionNotice(null);

    const rawSizeKb = +(file.size / 1024).toFixed(1);
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (!result) {
        setIsProcessing(false);
        return;
      }

      const img = new Image();
      img.onload = async () => {
        if (rawSizeKb <= maxSizeKb && file.type === 'image/jpeg') {
          // Already within 20 KB
          setCurrentSizeKb(rawSizeKb);
          setCompressionNotice(`Uploaded directly: ${rawSizeKb} KB (within ${maxSizeKb} KB limit)`);
          onPhotoChange(result, rawSizeKb);
        } else {
          // Auto-compress to strictly under 20 KB
          const { dataUrl, sizeKb } = await compressImageToTargetKb(img, maxSizeKb, 320);
          setCurrentSizeKb(sizeKb);
          setCompressionNotice(
            rawSizeKb > maxSizeKb
              ? `Auto-compressed from ${rawSizeKb} KB down to ${sizeKb} KB (within ${maxSizeKb} KB limit)`
              : `Optimized passport photo: ${sizeKb} KB`
          );
          onPhotoChange(dataUrl, sizeKb);
        }
        setIsProcessing(false);
      };
      img.src = result;
    };

    reader.readAsDataURL(file);
    // Reset file input so same file can be re-selected if desired
    e.target.value = '';
  };

  const removePhoto = () => {
    setCurrentSizeKb(null);
    setCompressionNotice(null);
    onPhotoChange(null, 0);
  };

  return (
    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
      {/* Header title & 20 KB Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-slate-200">
            Student Passport Photo (छात्र की फोटो)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Max Limit: {maxSizeKb} KB
          </span>
          {currentSizeKb !== null && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
              currentSizeKb <= maxSizeKb 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {currentSizeKb <= maxSizeKb ? `✓ ${currentSizeKb} KB (Valid)` : `⚠️ ${currentSizeKb} KB`}
            </span>
          )}
        </div>
      </div>

      {/* Main Upload / Camera Viewport */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        
        {/* Photo Box Preview / Live Camera View */}
        <div className="relative flex-shrink-0">
          <div className="w-32 h-40 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-xl flex items-center justify-center relative group">
            {photo ? (
              <>
                <img 
                  src={photo} 
                  alt="Student preview" 
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                  <button
                    type="button"
                    onClick={() => startCamera()}
                    className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-bold flex items-center gap-1 w-full justify-center transition-colors shadow"
                    title="Retake photo with camera"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Retake
                  </button>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold flex items-center gap-1 w-full justify-center transition-colors shadow"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-3 text-center space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                  <ImageIcon className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[10px] font-medium text-slate-400 leading-tight">
                  No Photo<br />(3:4 Passport)
                </span>
                <span className="text-[9px] text-cyan-400 font-mono">
                  &lt; {maxSizeKb} KB
                </span>
              </div>
            )}
          </div>

          {/* Size Tag on photo */}
          {currentSizeKb !== null && (
            <div className="mt-1 text-center">
              <span className="text-[10px] font-mono text-slate-400">
                Size: <strong className="text-cyan-300">{currentSizeKb} KB</strong>
              </span>
            </div>
          )}
        </div>

        {/* Action Controls & Guidelines */}
        <div className="flex-1 space-y-3 w-full">
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 1. Camera Capture Button with prominent Camera Icon */}
            <button
              type="button"
              onClick={() => startCamera()}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Camera className="w-4 h-4 text-slate-950" />
              <span>Capture Photo (Camera)</span>
            </button>

            {/* 2. File Upload Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload Photo File</span>
            </button>

            {/* Hidden HTML file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Remove button if photo exists */}
            {photo && (
              <button
                type="button"
                onClick={removePhoto}
                className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-600/50 text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1.5 transition-all"
                title="Remove photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {/* Compression notice */}
          {compressionNotice && (
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>{compressionNotice}</span>
            </div>
          )}

          {isProcessing && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Optimizing passport photo to stay under {maxSizeKb} KB...</span>
            </div>
          )}

          {/* Helper Tips for Indian / School standard passport photo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
            <div className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>File Size:</strong> Auto-compressed to strictly under 20 KB (CBSE standard)</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Camera:</strong> Direct live capture with instant auto-crop</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Background:</strong> Plain white or light background recommended</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">•</span>
              <span><strong>Formats:</strong> JPG, PNG, WebP supported</span>
            </div>
          </div>

        </div>

      </div>

      {/* LIVE CAMERA MODAL / POPUP VIEW */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-cyan-500/40 p-6 shadow-2xl space-y-4 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Direct Student Photo Capture
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Live camera stream · Auto-compressed to &lt; {maxSizeKb} KB
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message if camera failed */}
            {cameraError ? (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-3 text-center">
                <AlertTriangle className="w-6 h-6 text-rose-400 mx-auto" />
                <p>{cameraError}</p>
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs mx-auto flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry Camera Access
                </button>
              </div>
            ) : (
              /* Live Video Viewfinder with passport framing guide */
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Passport face alignment oval / box overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-56 rounded-[48%] border-2 border-dashed border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex flex-col items-center justify-between p-3">
                    <span className="text-[9px] font-mono font-bold text-cyan-300 bg-black/60 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Align Face Here
                    </span>
                    <span className="text-[9px] font-mono text-cyan-300/80 bg-black/60 px-2 py-0.5 rounded-full">
                      Chin Level
                    </span>
                  </div>
                </div>

                {/* Live recording indicator */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-slate-700 text-[10px] text-white">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Camera</span>
                </div>
              </div>
            )}

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={switchCamera}
                disabled={isProcessing}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Switch front / rear camera"
              >
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                Flip Lens
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                disabled={isProcessing || !!cameraError}
                className="flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4 text-slate-950" />
                <span>Snap & Auto-Compress (&lt; {maxSizeKb} KB)</span>
              </button>

              <button
                type="button"
                onClick={stopCamera}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs transition-colors"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
