"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Lock, X, Edit2, Trash2, Eye, EyeOff, Plus, Settings, Image as ImageIcon, Star } from "lucide-react";
import Image from "next/image";

interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  location?: string;
  date?: string;
  camera?: string;
  aperture?: string;
  iso?: string;
  shutterSpeed?: string;
  category: string;
}

interface PhotoSettings {
  heroTitle?: string;
  heroSubtitle?: string;
  heroBackgroundUrl?: string;
  heroTint?: string;
  pageBackground?: string;
  homepageHeroBackground?: string;
  photographyHeroBackground?: string;
  categoryHeroPhotos?: Record<string, string>;
}

interface PhotoPayload {
  photos: Photo[];
  settings: PhotoSettings;
  categories: string[];
}

export default function ManagePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Data state
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [settings, setSettings] = useState<PhotoSettings>({});
  const [categories, setCategories] = useState<string[]>([]);
  
  // UI state
  const [uploading, setUploading] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategoryForHero, setSelectedCategoryForHero] = useState<string>("");
  const [selectingHeroFor, setSelectingHeroFor] = useState<string | null>(null);

  // Generate aperture options
  const apertureOptions = Array.from({ length: 50 }, (_, i) => {
    const value = i + 1;
    return value <= 22 ? value : value * 0.5;
  }).map(v => `f/${v}`);

  useEffect(() => {
    const storedToken = localStorage.getItem("upload_token");
    const storedPassword = localStorage.getItem("upload_password");
    
    if (storedToken && storedPassword) {
      setToken(storedToken);
      setPassword(storedPassword);
      setIsAuthenticated(true);
      loadData(storedToken);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      setToken(data.token);
      localStorage.setItem("upload_token", data.token);
      localStorage.setItem("upload_password", password);
      setIsAuthenticated(true);
      loadData(data.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (authToken: string) => {
    try {
      const response = await fetch("/api/photos", {
        headers: {
          "x-upload-token": authToken,
        },
      });

      if (response.ok) {
        const data: PhotoPayload = await response.json();
        console.log("Loaded data from API:", data);
        setPhotos(data.photos || []);
        setSettings(data.settings || {});
        setCategories(data.categories || ["landscape", "portrait", "street", "nature", "urban"]);
      }
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    setUploading(true);
    setError(null);

    try {
      console.log("[Upload] Starting upload for file:", file.name, file.size, "bytes");

      // Step 1: Get presigned URL from our API
      const presignedResponse = await fetch("/api/upload/presigned", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-upload-token": token,
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      const presignedData = await presignedResponse.json();

      if (!presignedResponse.ok) {
        throw new Error(presignedData.error || "Failed to get upload URL");
      }

      console.log("[Upload] Got presigned URL, uploading to R2...");

      // Step 2: Upload directly to R2 using presigned URL (bypasses Vercel limits!)
      const uploadResponse = await fetch(presignedData.presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to R2");
      }

      console.log("[Upload] File uploaded successfully to R2:", presignedData.publicUrl);

      // Open edit modal for the newly uploaded photo
      const newPhoto: Photo = {
        id: crypto.randomUUID(),
        url: presignedData.publicUrl,
        title: file.name.replace(/\.[^/.]+$/, ""),
        category: categories[0] || "landscape",
      };

      setEditingPhoto(newPhoto);
    } catch (err) {
      console.error("[Upload] Error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSavePhoto = async (photo: Photo) => {
    if (!token) return;
    
    setLoading(true);
    setError(null);

    try {
      const isNewPhoto = !photos.find(p => p.id === photo.id);
      console.log("[Save Photo] Starting:", { isNewPhoto, photo, currentPhotoCount: photos.length });
      
      const response = await fetch("/api/photos", {
        method: isNewPhoto ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`,
        },
        body: JSON.stringify({ photo }),
      });

      const data = await response.json();
      console.log("[Save Photo] Response:", { 
        ok: response.ok, 
        status: response.status,
        photoCount: data.photos?.length,
        categories: data.categories 
      });

      if (!response.ok) {
        console.error("[Save Photo] Error response:", data);
        throw new Error(data.error || "Failed to save photo");
      }

      console.log("[Save Photo] Updating local state with", data.photos?.length, "photos");
      setPhotos(data.photos || []);
      setCategories(data.categories || categories);
      setSettings(data.settings || settings);
      setEditingPhoto(null);
      
      // Small delay then reload to confirm
      setTimeout(() => {
        console.log("[Save Photo] Reloading data from server...");
        loadData(token);
      }, 500);
    } catch (err) {
      console.error("[Save Photo] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to save photo");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/photos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`,
        },
        body: JSON.stringify({ id: photoId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete photo");
      }

      setPhotos(data.photos || []);
      if (editingPhoto?.id === photoId) {
        setEditingPhoto(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete photo");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/photos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`,
        },
        body: JSON.stringify({ addCategory: newCategory.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to add category");
      }

      setCategories(data.categories || categories);
      setNewCategory("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (!confirm(`Delete category "${category}"?`)) return;
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/photos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`,
        },
        body: JSON.stringify({ deleteCategory: category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      setCategories(data.categories || categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const handleSetCategoryHero = async (category: string, photoUrl: string) => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const updatedSettings = {
        ...settings,
        categoryHeroPhotos: {
          ...(settings.categoryHeroPhotos || {}),
          [category]: photoUrl,
        },
      };

      const response = await fetch("/api/photos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`,
        },
        body: JSON.stringify({ settings: updatedSettings }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set hero photo");
      }

      setSettings(data.settings || updatedSettings);
      setSelectingHeroFor(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set hero photo");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/photos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${password}`,
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSettings(data.settings || settings);
      setShowSettings(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("upload_token");
    localStorage.removeItem("upload_password");
    setIsAuthenticated(false);
    setToken(null);
    setPassword("");
    setPhotos([]);
    setCategories([]);
    setSettings({});
  };

  const getCategoryHeroUrl = (category: string) => {
    return settings.categoryHeroPhotos?.[category];
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#030303" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-2xl"
          style={{ backgroundColor: "#0A0A0A", border: "1px solid #1A1A1A" }}
        >
          <div className="text-center mb-8">
            <Lock size={48} className="mx-auto mb-4" style={{ color: "#00E5FF" }} />
            <h1 className="text-2xl font-bold mb-2" style={{ color: "#FFFFFF" }}>
              Admin Access
            </h1>
            <p className="text-sm" style={{ color: "#8E8EA0" }}>
              Enter your password to manage photos
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-lg outline-none font-body"
                  style={{
                    backgroundColor: "#0F0F0F",
                    border: "1px solid #1A1A1A",
                    color: "#FFFFFF",
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#8E8EA0" }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg text-sm"
                style={{ backgroundColor: "#1A0000", color: "#FF4444" }}
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-body transition-all duration-200"
              style={{
                backgroundColor: "#00E5FF",
                color: "#030303",
                opacity: loading ? 0.5 : 1,
              }}
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: "#030303" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: "#FFFFFF" }}>
              Photo Management
            </h1>
            <p style={{ color: "#8E8EA0" }}>
              {photos.length} photos uploaded • {categories.length} categories
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 rounded-lg font-body transition-colors duration-200 flex items-center gap-2"
              style={{
                backgroundColor: "#1A1A1A",
                color: "#00E5FF",
                border: "1px solid #2A2A2A",
              }}
            >
              <Settings size={18} />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg font-body transition-colors duration-200"
              style={{
                backgroundColor: "#1A1A1A",
                color: "#8E8EA0",
                border: "1px solid #2A2A2A",
              }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-8 rounded-2xl"
          style={{ backgroundColor: "#0A0A0A", border: "1px solid #1A1A1A" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Upload size={24} style={{ color: "#00E5FF" }} />
            <h2 className="text-xl font-bold" style={{ color: "#FFFFFF" }}>
              Upload New Photo
            </h2>
          </div>

          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <div
              className="border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 hover:border-[#00E5FF]"
              style={{ borderColor: "#1A1A1A" }}
            >
              <Upload size={48} className="mx-auto mb-4" style={{ color: "#8E8EA0" }} />
              <p className="text-lg font-body mb-2" style={{ color: "#FFFFFF" }}>
                {uploading ? "Uploading..." : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm" style={{ color: "#8E8EA0" }}>
                PNG, JPG, WEBP up to 100MB
              </p>
            </div>
          </label>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg text-sm"
              style={{ backgroundColor: "#1A0000", color: "#FF4444" }}
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Categories Management with Hero Photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-2xl"
          style={{ backgroundColor: "#0A0A0A", border: "1px solid #1A1A1A" }}
        >
          <h3 className="text-lg font-bold mb-4" style={{ color: "#FFFFFF" }}>
            Categories & Hero Photos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {categories.map((category) => {
              const heroUrl = getCategoryHeroUrl(category);
              return (
                <div
                  key={category}
                  className="rounded-lg overflow-hidden"
                  style={{ backgroundColor: "#0F0F0F", border: "1px solid #1A1A1A" }}
                >
                  {heroUrl ? (
                    <div className="aspect-video relative">
                      <Image src={heroUrl} alt={category} fill className="object-cover" />
                      <div className="absolute top-2 right-2">
                        <Star size={20} className="text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center" style={{ backgroundColor: "#0A0A0A" }}>
                      <ImageIcon size={32} style={{ color: "#5C5C6F" }} />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium" style={{ color: "#FFFFFF" }}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className="text-red-500 hover:text-red-400"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => setSelectingHeroFor(category)}
                      className="w-full px-3 py-2 rounded-lg text-sm transition-colors duration-200"
                      style={{
                        backgroundColor: "#1A1A1A",
                        color: "#00E5FF",
                        border: "1px solid #2A2A2A",
                      }}
                    >
                      {heroUrl ? "Change Hero" : "Set Hero"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
              className="flex-1 px-4 py-2 rounded-lg outline-none"
              style={{
                backgroundColor: "#0F0F0F",
                border: "1px solid #1A1A1A",
                color: "#FFFFFF",
              }}
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <button
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
              className="px-4 py-2 rounded-lg flex items-center gap-2"
              style={{
                backgroundColor: "#00E5FF",
                color: "#030303",
                opacity: !newCategory.trim() ? 0.5 : 1,
              }}
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>
        </motion.div>

        {/* Photos Grid */}
        <div>
          <h3 className="text-lg font-bold mb-4" style={{ color: "#FFFFFF" }}>
            All Photos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {photos.map((photo) => {
                const isHero = Object.values(settings.categoryHeroPhotos || {}).includes(photo.url);
                return (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="rounded-xl overflow-hidden group relative"
                    style={{ backgroundColor: "#0A0A0A", border: "1px solid #1A1A1A" }}
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={photo.url}
                        alt={photo.title}
                        fill
                        className="object-cover"
                      />
                      {isHero && (
                        <div className="absolute top-2 right-2">
                          <Star size={20} className="text-yellow-400 fill-yellow-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => setEditingPhoto(photo)}
                          className="p-3 rounded-lg transition-all duration-200"
                          style={{ backgroundColor: "#00E5FF", color: "#030303" }}
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-3 rounded-lg transition-all duration-200"
                          style={{ backgroundColor: "#FF4444", color: "#FFFFFF" }}
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-body truncate font-medium" style={{ color: "#FFFFFF" }}>
                        {photo.title}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: "#8E8EA0" }}>
                        {photo.category}
                      </p>
                      {photo.description && (
                        <p className="text-sm mt-1 truncate" style={{ color: "#8E8EA0" }}>
                          {photo.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {photos.length === 0 && !uploading && (
            <div className="text-center py-16">
              <Upload size={64} className="mx-auto mb-4" style={{ color: "#8E8EA0" }} />
              <p className="text-lg" style={{ color: "#8E8EA0" }}>
                No photos yet. Upload your first photo to get started.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Select Hero Photo Modal */}
      <AnimatePresence>
        {selectingHeroFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            onClick={() => setSelectingHeroFor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl rounded-2xl overflow-hidden my-8"
              style={{ backgroundColor: "#0A0A0A", border: "1px solid #1A1A1A" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#1A1A1A" }}>
                <h2 className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>
                  Select Hero Photo for "{selectingHeroFor}"
                </h2>
                <button
                  onClick={() => setSelectingHeroFor(null)}
                  className="p-2 rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: "#1A1A1A", color: "#8E8EA0" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {photos.filter(p => p.category === selectingHeroFor).map((photo) => (
                    <button
                      key={photo.id}
                      onClick={() => handleSetCategoryHero(selectingHeroFor, photo.url)}
                      className="rounded-lg overflow-hidden transition-all duration-200 hover:scale-105"
                      style={{ border: "2px solid #1A1A1A" }}
                    >
                      <div className="aspect-square relative">
                        <Image src={photo.url} alt={photo.title} fill className="object-cover" />
                      </div>
                      <div className="p-2" style={{ backgroundColor: "#0F0F0F" }}>
                        <p className="text-sm truncate" style={{ color: "#FFFFFF" }}>
                          {photo.title}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                {photos.filter(p => p.category === selectingHeroFor).length === 0 && (
                  <div className="text-center py-16">
                    <ImageIcon size={64} className="mx-auto mb-4" style={{ color: "#8E8EA0" }} />
                    <p style={{ color: "#8E8EA0" }}>
                      No photos in this category yet. Upload some photos first.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Photo Modal */}
      <AnimatePresence>
        {editingPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            onClick={() => setEditingPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-6xl rounded-2xl overflow-hidden my-8"
              style={{ backgroundColor: "#0A0A0A", border: "1px solid #1A1A1A" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#1A1A1A" }}>
                <h2 className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>
                  {photos.find(p => p.id === editingPhoto.id) ? "Edit" : "Add"} Photo Details
                </h2>
                <button
                  onClick={() => setEditingPhoto(null)}
                  className="p-2 rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: "#1A1A1A", color: "#8E8EA0" }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Image Preview */}
                  <div className="aspect-square relative rounded-xl overflow-hidden">
                    <Image
                      src={editingPhoto.url}
                      alt={editingPhoto.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                        Title *
                      </label>
                      <input
                        type="text"
                        value={editingPhoto.title}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg outline-none"
                        style={{
                          backgroundColor: "#0F0F0F",
                          border: "1px solid #1A1A1A",
                          color: "#FFFFFF",
                        }}
                        placeholder="Photo title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                        Category *
                      </label>
                      <select
                        value={editingPhoto.category}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg outline-none"
                        style={{
                          backgroundColor: "#0F0F0F",
                          border: "1px solid #1A1A1A",
                          color: "#FFFFFF",
                        }}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                        Description
                      </label>
                      <textarea
                        value={editingPhoto.description || ""}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg outline-none resize-none"
                        style={{
                          backgroundColor: "#0F0F0F",
                          border: "1px solid #1A1A1A",
                          color: "#FFFFFF",
                        }}
                        placeholder="Describe your photo"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={editingPhoto.location || ""}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, location: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg outline-none"
                        style={{
                          backgroundColor: "#0F0F0F",
                          border: "1px solid #1A1A1A",
                          color: "#FFFFFF",
                        }}
                        placeholder="e.g., New York, USA"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                        Camera
                      </label>
                      <input
                        type="text"
                        value={editingPhoto.camera || ""}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, camera: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg outline-none"
                        style={{
                          backgroundColor: "#0F0F0F",
                          border: "1px solid #1A1A1A",
                          color: "#FFFFFF",
                        }}
                        placeholder="e.g., Canon EOS R5"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                          Aperture
                        </label>
                        <select
                          value={editingPhoto.aperture || ""}
                          onChange={(e) => setEditingPhoto({ ...editingPhoto, aperture: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg outline-none"
                          style={{
                            backgroundColor: "#0F0F0F",
                            border: "1px solid #1A1A1A",
                            color: "#FFFFFF",
                          }}
                        >
                          <option value="">Select</option>
                          {apertureOptions.map((ap) => (
                            <option key={ap} value={ap}>{ap}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                          ISO
                        </label>
                        <input
                          type="text"
                          value={editingPhoto.iso || ""}
                          onChange={(e) => setEditingPhoto({ ...editingPhoto, iso: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg outline-none"
                          style={{
                            backgroundColor: "#0F0F0F",
                            border: "1px solid #1A1A1A",
                            color: "#FFFFFF",
                          }}
                          placeholder="400"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                          Shutter
                        </label>
                        <input
                          type="text"
                          value={editingPhoto.shutterSpeed || ""}
                          onChange={(e) => setEditingPhoto({ ...editingPhoto, shutterSpeed: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg outline-none"
                          style={{
                            backgroundColor: "#0F0F0F",
                            border: "1px solid #1A1A1A",
                            color: "#FFFFFF",
                          }}
                          placeholder="1/250"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                        Date
                      </label>
                      <input
                        type="date"
                        value={editingPhoto.date || ""}
                        onChange={(e) => setEditingPhoto({ ...editingPhoto, date: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg outline-none"
                        style={{
                          backgroundColor: "#0F0F0F",
                          border: "1px solid #1A1A1A",
                          color: "#FFFFFF",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 rounded-lg text-sm"
                    style={{ backgroundColor: "#1A0000", color: "#FF4444" }}
                  >
                    {error}
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t" style={{ borderColor: "#1A1A1A" }}>
                <button
                  onClick={() => setEditingPhoto(null)}
                  className="px-6 py-2 rounded-lg font-body transition-colors duration-200"
                  style={{
                    backgroundColor: "#1A1A1A",
                    color: "#8E8EA0",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSavePhoto(editingPhoto)}
                  disabled={loading || !editingPhoto.title}
                  className="px-6 py-2 rounded-lg font-body transition-all duration-200"
                  style={{
                    backgroundColor: "#00E5FF",
                    color: "#030303",
                    opacity: loading || !editingPhoto.title ? 0.5 : 1,
                  }}
                >
                  {loading ? "Saving..." : "Save Photo"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl rounded-2xl overflow-hidden my-8"
              style={{ backgroundColor: "#0A0A0A", border: "1px solid #1A1A1A" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#1A1A1A" }}>
                <h2 className="text-2xl font-bold" style={{ color: "#FFFFFF" }}>
                  Site Settings
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 rounded-lg transition-colors duration-200"
                  style={{ backgroundColor: "#1A1A1A", color: "#8E8EA0" }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                    Homepage Hero Background URL
                  </label>
                  <input
                    type="url"
                    value={settings.homepageHeroBackground || ""}
                    onChange={(e) => setSettings({ ...settings, homepageHeroBackground: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg outline-none"
                    style={{
                      backgroundColor: "#0F0F0F",
                      border: "1px solid #1A1A1A",
                      color: "#FFFFFF",
                    }}
                    placeholder="https://... (Where 'Yash Singh' appears)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                    Photography Page Hero Background URL
                  </label>
                  <input
                    type="url"
                    value={settings.photographyHeroBackground || ""}
                    onChange={(e) => setSettings({ ...settings, photographyHeroBackground: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg outline-none"
                    style={{
                      backgroundColor: "#0F0F0F",
                      border: "1px solid #1A1A1A",
                      color: "#FFFFFF",
                    }}
                    placeholder="https://... (Photography page hero)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                    Photography Hero Title
                  </label>
                  <input
                    type="text"
                    value={settings.heroTitle || ""}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg outline-none"
                    style={{
                      backgroundColor: "#0F0F0F",
                      border: "1px solid #1A1A1A",
                      color: "#FFFFFF",
                    }}
                    placeholder="Visual Stories"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#8E8EA0" }}>
                    Photography Hero Subtitle
                  </label>
                  <textarea
                    value={settings.heroSubtitle || ""}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg outline-none resize-none"
                    style={{
                      backgroundColor: "#0F0F0F",
                      border: "1px solid #1A1A1A",
                      color: "#FFFFFF",
                    }}
                    rows={2}
                    placeholder="Capture moments through the lens..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t" style={{ borderColor: "#1A1A1A" }}>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2 rounded-lg font-body transition-colors duration-200"
                  style={{
                    backgroundColor: "#1A1A1A",
                    color: "#8E8EA0",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="px-6 py-2 rounded-lg font-body transition-all duration-200"
                  style={{
                    backgroundColor: "#00E5FF",
                    color: "#030303",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  {loading ? "Saving..." : "Save Settings"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
