"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Copy, Check, ImageIcon, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface UploadResponse {
  success: boolean;
  filename: string;
  path: string;
  url: string;
  size: number;
}

export default function ImageUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setUploading(true);
    setError(null);
    setUploaded(null);

    try {
      // Encode filename to base64 to avoid header encoding issues
      const encodedFileName = btoa(encodeURIComponent(file.name));
      
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-upload-password": password,
          "Content-Type": file.type,
          "x-file-name": encodedFileName,
        },
        body: file,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setUploaded(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = async () => {
    if (uploaded?.url) {
      await navigator.clipboard.writeText(uploaded.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const reset = () => {
    setUploaded(null);
    setError(null);
    setCopied(false);
  };

  // Authentication step
  if (!authenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <div
          className="rounded-2xl border p-8"
          style={{ backgroundColor: "#0A0A12", borderColor: "#161624" }}
        >
          <div className="text-center mb-6">
            <div
              className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#161624" }}
            >
              <Lock className="w-6 h-6 text-[#00E5FF]" />
            </div>
            <h3
              className="font-display text-xl mb-2"
              style={{ color: "#EDEDF0" }}
            >
              Admin Upload
            </h3>
            <p className="font-body text-sm" style={{ color: "#8E8EA0" }}>
              Enter password to upload images
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && password) {
                    setAuthenticated(true);
                  }
                }}
                placeholder="Enter password"
                className="w-full px-4 py-3 pr-12 rounded-lg border bg-[#050508] font-body text-sm transition-colors duration-200 focus:outline-none focus:border-[#00E5FF]"
                style={{ borderColor: "#161624", color: "#EDEDF0" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors duration-200 hover:bg-[#161624]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-[#5C5C6F]" />
                ) : (
                  <Eye className="w-4 h-4 text-[#5C5C6F]" />
                )}
              </button>
            </div>

            <button
              onClick={() => password && setAuthenticated(true)}
              disabled={!password}
              className="w-full py-3 px-4 rounded-lg font-body text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: password ? "#00E5FF" : "#161624",
                color: password ? "#050508" : "#5C5C6F",
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {!uploaded ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`relative rounded-2xl border-2 border-dashed p-8 transition-all duration-300 ${
              dragActive
                ? "border-[#00E5FF] bg-[#00E5FF]/5"
                : "border-[#161624] hover:border-[#2A2A3C]"
            }`}
            style={{ backgroundColor: "#0A0A12" }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />

            <div className="text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300 ${
                  dragActive ? "bg-[#00E5FF]/20" : "bg-[#161624]"
                }`}
              >
                {uploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 border-2 border-[#00E5FF] border-t-transparent rounded-full"
                  />
                ) : (
                  <Upload
                    className={`w-6 h-6 transition-colors duration-300 ${
                      dragActive ? "text-[#00E5FF]" : "text-[#5C5C6F]"
                    }`}
                  />
                )}
              </div>

              <p
                className="font-display text-lg mb-2"
                style={{ color: "#EDEDF0" }}
              >
                {uploading ? "Uploading..." : "Drop image here"}
              </p>
              <p className="font-body text-sm" style={{ color: "#8E8EA0" }}>
                {uploading
                  ? "Uploading to R2..."
                  : "or click to browse (max 10MB)"}
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-lg text-center"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
              >
                <p className="font-body text-sm" style={{ color: "#EF4444" }}>
                  {error}
                </p>
              </motion.div>
            )}

            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="font-mono text-xs" style={{ color: "#5C5C6F" }}>
                Logged in
              </span>
              <button
                onClick={() => {
                  setAuthenticated(false);
                  setPassword("");
                }}
                className="font-mono text-xs text-[#00E5FF] hover:underline"
              >
                Logout
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-2xl border p-6"
            style={{ backgroundColor: "#0A0A12", borderColor: "#161624" }}
          >
            {/* Preview */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-[#050508]">
              <Image
                src={uploaded.url}
                alt={uploaded.filename}
                fill
                className="object-contain"
              />
            </div>

            {/* URL Display */}
            <div className="space-y-3">
              <div
                className="flex items-center gap-2 p-3 rounded-lg border"
                style={{ backgroundColor: "#050508", borderColor: "#161624" }}
              >
                <ImageIcon className="w-4 h-4 text-[#5C5C6F] shrink-0" />
                <code
                  className="font-mono text-xs truncate flex-1"
                  style={{ color: "#8E8EA0" }}
                >
                  {uploaded.url}
                </code>
                <button
                  onClick={copyUrl}
                  className="p-2 rounded-lg transition-colors duration-200 hover:bg-[#161624]"
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-[#5C5C6F]" />
                  )}
                </button>
              </div>

              {/* File Info */}
              <div
                className="flex items-center justify-between text-xs font-mono"
                style={{ color: "#5C5C6F" }}
              >
                <span>{uploaded.filename}</span>
                <span>{(uploaded.size / 1024).toFixed(1)} KB</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={reset}
                  className="flex-1 py-2 px-4 rounded-lg font-body text-sm transition-colors duration-200 hover:bg-[#161624]"
                  style={{ color: "#8E8EA0" }}
                >
                  Upload Another
                </button>
                <a
                  href={uploaded.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-4 rounded-lg font-body text-sm text-center transition-colors duration-200 hover:bg-[#00E5FF]/10"
                  style={{ color: "#00E5FF" }}
                >
                  View on R2
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
