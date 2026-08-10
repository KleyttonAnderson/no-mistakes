"use client";

import { useRef, useState } from "react";
import { useApp } from "@/lib/app-context";
import { CARD } from "@/lib/colors";

export function Avatar({
  studentId,
  avatarUrl,
  name,
  size = 36,
  statusDotColor,
  editable = true,
}: {
  studentId: string;
  avatarUrl: string | null;
  name: string;
  size?: number;
  statusDotColor?: string;
  editable?: boolean;
}) {
  const { uploadAvatar } = useApp();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      await uploadAvatar(studentId, file);
    } finally {
      setUploading(false);
    }
  }

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  return (
    <div
      onClick={(e) => {
        if (!editable) return;
        e.stopPropagation();
        inputRef.current?.click();
      }}
      onDragOver={(e) => {
        if (!editable) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (!editable) return;
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        overflow: "hidden",
        position: "relative",
        background: CARD,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: editable ? "pointer" : "default",
        outline: dragOver ? "2px dashed #ec3013" : "none",
        outlineOffset: 2,
      }}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: uploading ? 0.5 : 1 }} />
      ) : (
        <span style={{ fontSize: size * 0.35, fontWeight: 800, color: "rgba(243,242,242,0.55)" }}>
          {uploading ? "..." : initials}
        </span>
      )}
      {statusDotColor && (
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: "50%",
            background: statusDotColor,
            boxShadow: `0 0 6px ${statusDotColor}`,
            position: "absolute",
            bottom: -1,
            right: -1,
            border: "1.5px solid #1c1b1a",
          }}
        />
      )}
      {editable && (
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => handleFile(e.target.files?.[0])}
          style={{ display: "none" }}
        />
      )}
    </div>
  );
}
