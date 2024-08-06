// frontend/src/components/BarcodeComponent.tsx
import React, { useRef, useEffect } from 'react';
import JsBarcode from 'jsbarcode';
import { scaleStyle } from '../util/styled';

interface BarcodeComponentProps {
  value: string;
  factor?: number;
  width?: number;
  height?: number;
  fontSize?: number;
}

const BarcodeComponent: React.FC<BarcodeComponentProps> = ({ value, factor=1, width=2.7, height=65, fontSize=20 }) => {
  const barcodeRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, { format: 'CODE128', width: width * factor, height: height * factor, fontSize: fontSize * factor });
    }
  }, [value]);

  return <canvas ref={barcodeRef} />;
};

export default BarcodeComponent;
