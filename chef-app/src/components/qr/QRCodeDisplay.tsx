"use client";

import { QRCodeSVG } from "qrcode.react";

export function QRCodeDisplay({
  value,
  size = 240,
}: {
  value: string;
  size?: number;
}) {
  return (
    <div className="flex items-center justify-center rounded-2xl bg-white p-4 shadow-sm">
      <QRCodeSVG value={value} size={size} level="M" />
    </div>
  );
}
