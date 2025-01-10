import React from 'react'

export default function Chip({ text }: { text: string }) {
  return (
    <div className="p-2 px-3 border border-border rounded-full text-sm">{text}</div>
  );
}
