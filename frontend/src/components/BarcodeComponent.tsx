// frontend/src/components/BarcodeComponent.tsx
import React, { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeComponentProps {
  value: string;
}

const BarcodeComponent: React.FC<BarcodeComponentProps> = ({ value }) => {
  const barcodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, { format: 'CODE128' });
    }
  }, [value]);

  return <canvas ref={barcodeRef} />;
};

export default BarcodeComponent;
