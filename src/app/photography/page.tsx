"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Aperture,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  Upload,
  Trash2,
  Pencil,
  Save,
  ImageIcon,
  Lock,
} from "lucide-react";

interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  location?: string;
  camera?: string;
  aperture?: string;
  iso?: string;
  shutterSpeed?: string;
  date?: string;
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

const emptyForm: Omit<Photo, "id"> = {
  url: "",
  title: "",
  description: "",
  location: "",
  camera: "",
  aperture: "",
  iso: "",
  shutterSpeed: "",
  date: "",
  category: "landscape",
};

export default function PhotographyPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [backgroundPhoto, setBackgroundPhoto] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [settings, setSettings] = useState<PhotoSettings>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [adminPassword, setAdminPassword] = useState("");
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminMessage, setAdminMessage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formPhoto, setFormPhoto] = useState<Omit<Photo, "id">>(emptyForm);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  const filteredPhotos = useMemo(() => {
    return selectedCategory === "all"
      ? photos
      : photos.filter((photo) => photo.category === selectedCategory);
  }, [photos, selectedCategory]);

  // Get hero background - use category hero if category is selected, otherwise use general settings
  const heroBackground = useMemo(() => {
    if (selectedCategory !== "all" && settings.categoryHeroPhotos?.[selectedCategory]) {
      return settings.categoryHeroPhotos[selectedCategory];
    }
    return settings.photographyHeroBackground || settings.heroBackgroundUrl || backgroundPhoto || photos[0]?.url || null;
  }, [selectedCategory, settings, backgroundPhoto, photos]);

  useEffect(() => {
    let isMounted = true;

    const loadPhotos = async () => {
      try {
        const response = await fetch("/api/photos", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Failed to load photography data");
        }
        const data = (await response.json()) as PhotoPayload;
        if (!isMounted) return;
        setPhotos(data.photos || []);
        setSettings(data.settings || {});
        setCategories(data.categories || ["landscape", "portrait", "street", "nature", "urban"]);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Failed to load photos");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPhotos();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (event.key === "Escape") setSelectedPhoto(null);
      if (event.key === "ArrowLeft") navigatePhoto("prev");
      if (event.key === "ArrowRight") navigatePhoto("next");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto, currentIndex, filteredPhotos]);

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const navigatePhoto = (direction: "prev" | "next") => {
    if (filteredPhotos.length === 0) return;
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length
        : (currentIndex + 1) % filteredPhotos.length;
    setCurrentIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  const handleUpload = async (file: File) => {
    if (!adminAuthed || !adminPassword) {
      setAdminMessage("Enter password to upload");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAdminMessage("Please upload an image file");
      return;
    }

    setUploading(true);
    setAdminMessage(null);

    try {
      // Encode filename to base64 to avoid header encoding issues
      const encodedFileName = btoa(encodeURIComponent(file.name));
      
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "x-upload-password": adminPassword,
          "Content-Type": file.type,
          "x-file-name": encodedFileName,
        },
        body: file,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setFormPhoto((prev) => ({ ...prev, url: data.url }));
      setUploadUrl(data.url);
      setAdminMessage("Upload complete. Add details and save.");
    } catch (err) {
      setAdminMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const savePhoto = async () => {
    if (!adminAuthed) {
      setAdminMessage("Enter password to save");
      return;
    }

    if (!formPhoto.url || !formPhoto.title) {
      setAdminMessage("Photo URL and title are required");
      return;
    }

    setSaving(true);
    setAdminMessage(null);

    try {
      const response = await fetch("/api/photos", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-upload-password": adminPassword,
        },
        body: JSON.stringify({
          photo: editingId ? { id: editingId, ...formPhoto } : formPhoto,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save photo");
      }

      setPhotos(data.photos || []);
      setSettings(data.settings || {});
      setEditingId(null);
      setFormPhoto(emptyForm);
      setUploadUrl(null);
      setAdminMessage("Saved successfully.");
    } catch (err) {
      setAdminMessage(err instanceof Error ? err.message : "Failed to save photo");
    } finally {
      setSaving(false);
    }
  };

  const editPhoto = (photo: Photo) => {
    setEditingId(photo.id);
    const { id, ...rest } = photo;
    setFormPhoto(rest);
    setUploadUrl(photo.url);
    setAdminMessage(null);
  };

  const deletePhoto = async (id: string) => {
    if (!adminAuthed) {
      setAdminMessage("Enter password to delete");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/photos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-upload-password": adminPassword,
        },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete");
      }
      setPhotos(data.photos || []);
      setSettings(data.settings || {});
      if (editingId === id) {
        setEditingId(null);
        setFormPhoto(emptyForm);
        setUploadUrl(null);
      }
      setAdminMessage("Photo deleted.");
    } catch (err) {
      setAdminMessage(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    if (!adminAuthed) {
      setAdminMessage("Enter password to save settings");
      return;
    }

    setSaving(true);
    setAdminMessage(null);

    try {
      const response = await fetch("/api/photos", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-upload-password": adminPassword,
        },
        body: JSON.stringify({ settings }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setPhotos(data.photos || []);
      setSettings(data.settings || {});
      setAdminMessage("Settings saved.");
    } catch (err) {
      setAdminMessage(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-mono text-xs" style={{ color: "#8E8EA0" }}>
          Loading photography...
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen"
      style={{ backgroundColor: settings.pageBackground || "#050508" }}
    >
      {/* Manage Button */}
      <motion.a
        href="/manage"
        className="fixed top-8 right-8 z-50 px-6 py-3 rounded-full font-body flex items-center gap-2 backdrop-blur-sm transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: "rgba(0, 229, 255, 0.1)",
          border: "1px solid rgba(0, 229, 255, 0.3)",
          color: "#00E5FF",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        whileHover={{
          backgroundColor: "rgba(0, 229, 255, 0.2)",
        }}
      >
        <Lock size={16} />
        Manage
      </motion.a>

      {/* Hero Section */}
      <motion.section
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
        style={{ opacity: headerOpacity, y: headerY }}
      >
        <AnimatePresence mode="wait">
          {heroBackground ? (
            <motion.div
              key={heroBackground}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Image
                src={heroBackground}
                alt="Background"
                fill
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to bottom, ${
                    settings.heroTint || "rgba(5,5,8,0.2)"
                  } 0%, rgba(5,5,8,0.85) 70%, rgba(5,5,8,0.98) 100%)`,
                }}
              />
            </motion.div>
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at top, #0A0A12 0%, #050508 55%, #020205 100%)",
              }}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span
              className="font-mono text-xs uppercase tracking-[0.3em] px-4 py-2 rounded-full border"
              style={{
                color: "#00E5FF",
                borderColor: "rgba(0,229,255,0.3)",
                backgroundColor: "rgba(0,229,255,0.05)",
              }}
            >
              Photography
            </span>
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6"
            style={{ color: "#EDEDF0" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {settings.heroTitle || "Visual Stories"}
          </motion.h1>

          <motion.p
            className="font-body text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "#8E8EA0" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {settings.heroSubtitle ||
              "Capture moments through the lens. Build a curated gallery that feels like you."}
          </motion.p>

          <motion.div
            className="flex justify-center gap-8 md:gap-16 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { value: photos.length, label: "Photos" },
              { value: settings.heroBackgroundUrl ? "Custom" : "Auto", label: "Hero" },
              { value: "RAW", label: "Format" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="font-display text-2xl md:text-3xl font-bold"
                  style={{ color: "#00E5FF" }}
                >
                  {stat.value}
                </div>
                <div
                  className="font-mono text-xs uppercase tracking-wider mt-1"
                  style={{ color: "#5C5C6F" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {error && (
        <div className="max-w-4xl mx-auto px-4 mt-6">
          <div
            className="rounded-xl border px-4 py-3"
            style={{ borderColor: "#2A2A3C", color: "#EF4444" }}
          >
            {error}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <section
        className="sticky top-20 z-30 py-6 backdrop-blur-xl border-b"
        style={{ borderColor: "#161624", backgroundColor: "rgba(5,5,8,0.8)" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full font-body text-sm transition-all duration-300 ${
                selectedCategory === "all"
                  ? "bg-[#00E5FF] text-[#050508] font-medium"
                  : "text-[#8E8EA0] hover:text-[#EDEDF0] hover:bg-[#161624]"
              }`}
            >
              All Work
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-body text-sm transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[#00E5FF] text-[#050508] font-medium"
                    : "text-[#8E8EA0] hover:text-[#EDEDF0] hover:bg-[#161624]"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredPhotos.length === 0 ? (
            <div className="py-24 text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
                style={{ backgroundColor: "#10101C" }}
              >
                <ImageIcon size={28} style={{ color: "#5C5C6F" }} />
              </div>
              <h3
                className="font-display text-2xl mb-2"
                style={{ color: "#EDEDF0" }}
              >
                No photos yet
              </h3>
              <p className="font-body text-sm" style={{ color: "#8E8EA0" }}>
                Use the admin panel below to upload your first photo.
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              <AnimatePresence mode="popLayout">
                {filteredPhotos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => openLightbox(photo, index)}
                    onMouseEnter={() => setBackgroundPhoto(photo.url)}
                    onMouseLeave={() => setBackgroundPhoto(null)}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(5,5,8,0.95) 0%, rgba(5,5,8,0.5) 50%, transparent 100%)",
                      }}
                    />

                    <div className="absolute inset-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <span
                        className="font-mono text-[10px] uppercase tracking-wider mb-2"
                        style={{ color: "#00E5FF" }}
                      >
                        {photo.category}
                      </span>
                      <h3
                        className="font-display text-xl font-semibold mb-1"
                        style={{ color: "#EDEDF0" }}
                      >
                        {photo.title}
                      </h3>
                      <p
                        className="font-body text-sm mb-3"
                        style={{ color: "#8E8EA0" }}
                      >
                        {photo.description}
                      </p>
                      <div
                        className="flex flex-wrap items-center gap-4 text-xs font-mono"
                        style={{ color: "#5C5C6F" }}
                      >
                        {photo.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {photo.location}
                          </span>
                        )}
                        {photo.camera && (
                          <span className="flex items-center gap-1">
                            <Camera size={12} />
                            {photo.camera}
                          </span>
                        )}
                        {photo.aperture && (
                          <span className="flex items-center gap-1">
                            <Aperture size={12} />
                            {photo.aperture}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(5,5,8,0.98)" }}
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              className="absolute top-6 right-6 z-10 p-3 rounded-full transition-colors duration-200 hover:bg-[#161624]"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={24} style={{ color: "#EDEDF0" }} />
            </button>

            <button
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full transition-colors duration-200 hover:bg-[#161624]"
              onClick={(event) => {
                event.stopPropagation();
                navigatePhoto("prev");
              }}
            >
              <ChevronLeft size={24} style={{ color: "#EDEDF0" }} />
            </button>
            <button
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full transition-colors duration-200 hover:bg-[#161624]"
              onClick={(event) => {
                event.stopPropagation();
                navigatePhoto("next");
              }}
            >
              <ChevronRight size={24} style={{ color: "#EDEDF0" }} />
            </button>

            <motion.div
              key={selectedPhoto.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-6xl max-h-[80vh] w-full mx-4"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative aspect-[3/2] w-full">
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="mt-6 px-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2
                      className="font-display text-2xl font-semibold mb-1"
                      style={{ color: "#EDEDF0" }}
                    >
                      {selectedPhoto.title}
                    </h2>
                    <p className="font-body text-base mb-4" style={{ color: "#8E8EA0" }}>
                      {selectedPhoto.description}
                    </p>

                    <div
                      className="flex flex-wrap gap-4 text-sm font-mono"
                      style={{ color: "#5C5C6F" }}
                    >
                      {selectedPhoto.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {selectedPhoto.location}
                        </span>
                      )}
                      {selectedPhoto.camera && (
                        <span className="flex items-center gap-1">
                          <Camera size={14} />
                          {selectedPhoto.camera}
                        </span>
                      )}
                      {(selectedPhoto.aperture || selectedPhoto.iso || selectedPhoto.shutterSpeed) && (
                        <span className="flex items-center gap-1">
                          <Aperture size={14} />
                          {[selectedPhoto.aperture, selectedPhoto.iso && `ISO ${selectedPhoto.iso}`, selectedPhoto.shutterSpeed && `${selectedPhoto.shutterSpeed}s`].filter(Boolean).join(", ")}
                        </span>
                      )}
                      {selectedPhoto.date && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(selectedPhoto.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
