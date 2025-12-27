import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import { X, Camera, AlertCircle } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string | null>(null);

  const { ref } = useZxing({
    onDecodeResult(result) {
      onScan(result.getText());
    },
    onError(error) {
      // Suppress standard scanning errors (no code found in frame) to avoid log spam
      if (error instanceof Error && error.name !== 'NotFoundException') {
        console.error(error);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-brand" />
            <h3 className="font-bold text-slate-900">Scan Barcode</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        {/* Camera Viewport */}
        <div className="relative aspect-square bg-black flex items-center justify-center overflow-hidden">
          {error ? (
            <div className="text-center p-8">
              <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
              <p className="text-white font-medium">{error}</p>
            </div>
          ) : (
            <>
              <video ref={ref} className="w-full h-full object-cover" />
              {/* Scan Overlay */}
              <div className="absolute inset-0 border-[40px] border-slate-900/50 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-40 border-2 border-brand/80 relative">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-brand"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-brand"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-brand"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-brand"></div>

                  {/* Scanning Animation */}
                  <div className="absolute left-0 right-0 h-0.5 bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-[scan_2s_ease-in-out_infinite] top-1/2"></div>
                </div>
              </div>
            </>
          )}

          <div className="absolute bottom-6 left-0 right-0 text-center">
            <span className="bg-slate-900/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10">
              Align barcode within frame
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            Supported formats: UPC-A, UPC-E, EAN-8, EAN-13, Code 128
          </p>
        </div>
      </div>
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-80px); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translateY(0); }
          90% { opacity: 1; }
          100% { transform: translateY(80px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};