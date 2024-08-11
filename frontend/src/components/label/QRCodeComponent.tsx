// frontend/src/components/QRCodeComponent.tsx
import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeComponentProps {
  value: string;
  size?: number;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ value, size = 128 }) => {
  return <QRCode value={value} size={size} level="H" includeMargin />;
};

export default QRCodeComponent;
