import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Save,
  RotateCcw,
  Upload,
  Plus,
  Trash2,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  Sparkles,
  Download,
  FileJson,
  Check,
  Clock,
  ChevronRight,
  Sliders,
  Compass,
} from 'lucide-react';
import { ExperienceConfig, MemoryData, InterludeData } from '../types';
import { calculateElapsedTime } from '../utils/time';
import { soundManager } from '../audio/soundManager';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: ExperienceConfig;
  onSave: (newConfig: ExperienceConfig) => void;
  onReset: () => void;
}

type TabType = 'DATE' | 'MEMORIES' | 'INTERLUDES' | 'CLIMAX' | 'DATA';

export const UniverseEditorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('MEMORIES');
  const [draftConfig, setDraftConfig] = useState<ExperienceConfig>(() =>
    JSON.parse(JSON.stringify(config))
  );
  const [selectedWorldIdx, setSelectedWorldIdx] = useState<number>(0);
  const [selectedInterludeIdx, setSelectedInterludeIdx] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync draft when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setDraftConfig(JSON.parse(JSON.stringify(config)));
    }
  }, [isOpen, config]);

  // Live calculation of elapsed time for preview
  const liveElapsed = useMemo(() => {
    try {
      return calculateElapsedTime(draftConfig.meetingDate);
    } catch {
      return null;
    }
  }, [draftConfig.meetingDate]);

  if (!isOpen) return null;

  const handleSave = () => {
    soundManager.playCelestialChime(700);
    onSave(draftConfig);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  // Image Upload handler (converts uploaded file to base64 DataURL)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, worldIdx: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setDraftConfig((prev) => {
          const next = JSON.parse(JSON.stringify(prev));
          next.memories[worldIdx].photos.push(dataUrl);
          return next;
        });
        soundManager.playClick();
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = (worldIdx: number, photoIdx: number) => {
    soundManager.playClick();
    setDraftConfig((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      next.memories[worldIdx].photos.splice(photoIdx, 1);
      return next;
    });
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(draftConfig, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'anniversary_universe_custom.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.memories && imported.meetingDate) {
          setDraftConfig(imported);
          soundManager.playCelestialChime(600);
        }
      } catch (err) {
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const currentMemory = draftConfig.memories[selectedWorldIdx];
  const currentInterlude = draftConfig.interludes[selectedInterludeIdx];

  const navigationItems = [
    { id: 'MEMORIES', label: 'Five Memory Worlds', desc: 'Photos & story chapters', icon: Compass },
    { id: 'DATE', label: 'Meeting Timestamp', desc: 'Starting point for clock', icon: Calendar },
    { id: 'INTERLUDES', label: 'Intermission Letters', desc: 'Four deep thoughts', icon: BookOpen },
    { id: 'CLIMAX', label: '05:00 Climax', desc: 'Final reveal & letter', icon: Sparkles },
    { id: 'DATA', label: 'Backup & Reset', desc: 'Export or restore template', icon: FileJson },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-5xl h-[92vh] max-h-[850px] rounded-3xl border border-white/10 bg-[#0a0a14] shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col md:flex-row overflow-hidden"
      >
        {/* ================= LEFT SIDEBAR ================= */}
        <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/[0.08] bg-white/[0.015] flex flex-col justify-between p-5 shrink-0">
          <div>
            {/* Header / Brand */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500/20 to-purple-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300">
                  <Sliders size={16} />
                </div>
                <div>
                  <h2 className="font-cinzel text-sm font-bold text-white tracking-[0.08em]">
                    Universe Studio
                  </h2>
                  <p className="font-tech text-[10px] text-neutral-400 tracking-wider">
                    Content Customization
                  </p>
                </div>
              </div>

              {/* Mobile Close Button */}
              <button
                onClick={onClose}
                className="md:hidden p-1.5 text-neutral-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1.5">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      soundManager.playClick();
                      setActiveTab(item.id as TabType);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all ${
                      isActive
                        ? 'bg-rose-500/10 text-white border border-rose-500/25 shadow-sm'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon
                      size={17}
                      className={isActive ? 'text-rose-400' : 'text-neutral-500'}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`font-cinzel text-xs tracking-wider ${isActive ? 'font-bold text-white' : ''}`}>
                        {item.label}
                      </div>
                      <div className="font-tech text-[10px] text-neutral-500 truncate mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions inside Sidebar */}
          <div className="pt-4 border-t border-white/[0.06] space-y-2 hidden md:block">
            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-tech text-xs tracking-widest uppercase transition-all shadow-[0_4px_20px_rgba(244,63,94,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              {saveSuccess ? (
                <>
                  <Check size={14} />
                  <span>Changes Saved!</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save & Apply</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-center text-xs font-tech text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Close Editor
            </button>
          </div>
        </div>

        {/* ================= RIGHT CONTENT AREA ================= */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#070710]/70 overflow-hidden">
          {/* Top Bar for Desktop */}
          <div className="flex items-center justify-between px-8 py-4 border-b border-white/[0.06] bg-black/20">
            <div className="font-tech text-xs tracking-[0.2em] text-neutral-400 uppercase">
              {navigationItems.find((n) => n.id === activeTab)?.label}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500 text-white font-tech text-xs"
              >
                <Save size={13} />
                <span>Save</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-8">
            {/* ================= TAB: FIVE WORLDS ================= */}
            {activeTab === 'MEMORIES' && currentMemory && (
              <div className="space-y-8 max-w-3xl">
                {/* World Selector Tabs */}
                <div>
                  <label className="block font-tech text-[10px] text-neutral-400 tracking-[0.25em] uppercase mb-3">
                    Select World To Customize
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {draftConfig.memories.map((mem, idx) => {
                      const isSelected = selectedWorldIdx === idx;
                      return (
                        <button
                          key={mem.id}
                          onClick={() => {
                            soundManager.playClick();
                            setSelectedWorldIdx(idx);
                          }}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                            isSelected
                              ? 'bg-rose-500/15 border-rose-500/40 text-white shadow-lg shadow-rose-950/20'
                              : 'bg-white/[0.02] border-white/[0.06] text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                          }`}
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full mb-1.5 shadow-sm"
                            style={{ backgroundColor: mem.planetColor }}
                          />
                          <span className="font-cinzel text-xs font-semibold tracking-wider">
                            World 0{idx + 1}
                          </span>
                          <span className="font-tech text-[9px] text-neutral-500 mt-0.5">
                            {mem.photos.length} photos
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* World Identity Card */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
                    <span className="font-cinzel text-sm font-bold text-white tracking-wide">
                      Chapter Identity
                    </span>
                    <span
                      className="text-xs font-tech px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${currentMemory.accentColor}20`,
                        color: currentMemory.accentColor,
                      }}
                    >
                      World 0{selectedWorldIdx + 1}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block font-tech text-[10px] text-neutral-400 tracking-[0.2em] uppercase mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        value={currentMemory.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraftConfig((prev) => {
                            const next = JSON.parse(JSON.stringify(prev));
                            next.memories[selectedWorldIdx].title = val;
                            return next;
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-cinzel text-sm focus:border-rose-400/60 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-tech text-[10px] text-neutral-400 tracking-[0.2em] uppercase mb-1.5">
                        Date Display
                      </label>
                      <input
                        type="text"
                        value={currentMemory.date}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraftConfig((prev) => {
                            const next = JSON.parse(JSON.stringify(prev));
                            next.memories[selectedWorldIdx].date = val;
                            return next;
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-tech text-xs focus:border-rose-400/60 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-tech text-[10px] text-neutral-400 tracking-[0.2em] uppercase mb-1.5">
                        Theme Tag
                      </label>
                      <input
                        type="text"
                        value={currentMemory.theme}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraftConfig((prev) => {
                            const next = JSON.parse(JSON.stringify(prev));
                            next.memories[selectedWorldIdx].theme = val;
                            return next;
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-tech text-xs focus:border-rose-400/60 focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block font-tech text-[10px] text-neutral-400 tracking-[0.2em] uppercase mb-1.5">
                        Subtitle Quote
                      </label>
                      <input
                        type="text"
                        value={currentMemory.subtitle}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraftConfig((prev) => {
                            const next = JSON.parse(JSON.stringify(prev));
                            next.memories[selectedWorldIdx].subtitle = val;
                            return next;
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-editorial text-xs italic focus:border-rose-400/60 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Photos Gallery Card */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
                    <div>
                      <span className="font-cinzel text-sm font-bold text-white tracking-wide">
                        Photo Gallery
                      </span>
                      <p className="font-editorial text-xs text-neutral-400 mt-0.5">
                        Shown in world reader and embedded into the final particle 5
                      </p>
                    </div>

                    {/* Upload from device button */}
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-200 font-tech text-xs tracking-wider uppercase transition-all hover:scale-105 active:scale-95 shadow-sm">
                      <Upload size={14} />
                      <span>Upload Picture</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, selectedWorldIdx)}
                      />
                    </label>
                  </div>

                  {/* Image Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {currentMemory.photos.map((src, pIdx) => (
                      <div
                        key={pIdx}
                        className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/60 shadow-md transition-all hover:border-rose-400/50"
                      >
                        <img
                          src={src}
                          alt="Photo thumbnail"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <button
                          onClick={() => handleRemovePhoto(selectedWorldIdx, pIdx)}
                          title="Remove photo"
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-rose-600 text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}

                    {/* Upload Slot Box */}
                    <label className="cursor-pointer aspect-video rounded-xl border border-dashed border-white/15 hover:border-rose-400/50 bg-white/[0.01] hover:bg-rose-500/5 flex flex-col items-center justify-center text-neutral-400 hover:text-rose-300 transition-all p-3 text-center">
                      <Plus size={18} className="mb-1" />
                      <span className="font-tech text-[10px] tracking-wider uppercase">
                        Add Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, selectedWorldIdx)}
                      />
                    </label>
                  </div>
                </div>

                {/* Story Paragraphs Card */}
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
                    <div>
                      <span className="font-cinzel text-sm font-bold text-white tracking-wide">
                        Story Paragraphs
                      </span>
                      <p className="font-editorial text-xs text-neutral-400 mt-0.5">
                        The memory narrative displayed when the user enters this world
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setDraftConfig((prev) => {
                          const next = JSON.parse(JSON.stringify(prev));
                          next.memories[selectedWorldIdx].message.push('New paragraph...');
                          return next;
                        });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-neutral-200 font-tech text-xs tracking-wider uppercase transition-colors"
                    >
                      <Plus size={13} />
                      <span>Add Paragraph</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-1">
                    {currentMemory.message.map((para, pIdx) => (
                      <div
                        key={pIdx}
                        className="flex gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] transition-all"
                      >
                        <span className="font-tech text-xs text-neutral-500 pt-1 shrink-0">
                          0{pIdx + 1}
                        </span>
                        <textarea
                          rows={3}
                          value={para}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraftConfig((prev) => {
                              const next = JSON.parse(JSON.stringify(prev));
                              next.memories[selectedWorldIdx].message[pIdx] = val;
                              return next;
                            });
                          }}
                          className="flex-1 bg-transparent text-white font-editorial text-sm leading-relaxed focus:outline-none resize-none"
                        />
                        <button
                          onClick={() => {
                            setDraftConfig((prev) => {
                              const next = JSON.parse(JSON.stringify(prev));
                              next.memories[selectedWorldIdx].message.splice(pIdx, 1);
                              return next;
                            });
                          }}
                          className="p-1.5 text-neutral-500 hover:text-rose-400 self-start transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: MEETING DATE ================= */}
            {activeTab === 'DATE' && (
              <div className="space-y-6 max-w-2xl">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-5">
                  <div className="pb-3 border-b border-white/[0.05]">
                    <span className="font-cinzel text-sm font-bold text-white tracking-wide">
                      Origin Timestamp
                    </span>
                    <p className="font-editorial text-xs text-neutral-400 mt-1">
                      Sets the exact meeting moment used by the mechanical clock and timer
                    </p>
                  </div>

                  <div>
                    <label className="block font-tech text-[10px] text-neutral-400 tracking-[0.2em] uppercase mb-2">
                      ISO 8601 Meeting Date & Time
                    </label>
                    <input
                      type="text"
                      value={draftConfig.meetingDate}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, meetingDate: e.target.value })
                      }
                      placeholder="2026-04-30T00:00:00+05:30"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-tech text-sm focus:border-rose-400/60 focus:outline-none transition-colors"
                    />
                    <p className="font-editorial text-xs text-neutral-400 mt-2">
                      Format: <code className="text-rose-300">YYYY-MM-DDTHH:mm:ss+Timezone</code>
                    </p>
                  </div>

                  {/* Live Calculation Preview Card */}
                  {liveElapsed && (
                    <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-2">
                      <div className="flex items-center gap-2 text-rose-400 font-tech text-xs tracking-wider uppercase">
                        <Clock size={14} className="animate-spin-slow" />
                        <span>Live Timer Calculation</span>
                      </div>
                      <div className="font-cinzel text-xl text-white font-bold tracking-wider">
                        {liveElapsed.days}{' '}
                        <span className="text-xs font-light text-rose-300 tracking-widest uppercase">
                          Days
                        </span>{' '}
                        {liveElapsed.formattedHours}:{liveElapsed.formattedMinutes}:{liveElapsed.formattedSeconds}
                      </div>
                      <p className="text-[11px] font-editorial text-neutral-400">
                        This is the exact number currently ticking on the mechanical clock face.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ================= TAB: 4 LETTERS ================= */}
            {activeTab === 'INTERLUDES' && currentInterlude && (
              <div className="space-y-6 max-w-2xl">
                {/* Selector pills */}
                <div className="flex items-center gap-2 pb-2 overflow-x-auto">
                  {draftConfig.interludes.map((int, idx) => (
                    <button
                      key={int.id}
                      onClick={() => {
                        soundManager.playClick();
                        setSelectedInterludeIdx(idx);
                      }}
                      className={`px-4 py-2 rounded-xl font-cinzel text-xs tracking-wider uppercase transition-all ${
                        selectedInterludeIdx === idx
                          ? 'bg-purple-500/20 text-purple-200 border border-purple-500/40 font-bold'
                          : 'bg-white/[0.03] text-neutral-400 hover:text-white border border-white/[0.05]'
                      }`}
                    >
                      Letter 0{idx + 1}
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-5">
                  <div className="pb-3 border-b border-white/[0.05]">
                    <span className="font-cinzel text-sm font-bold text-white tracking-wide">
                      Intermission Letter 0{selectedInterludeIdx + 1}
                    </span>
                    <p className="font-editorial text-xs text-neutral-400 mt-1">
                      Revealed sentence-by-sentence in deep space between worlds
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-tech text-[10px] text-neutral-400 tracking-[0.2em] uppercase mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        value={currentInterlude.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraftConfig((prev) => {
                            const next = JSON.parse(JSON.stringify(prev));
                            next.interludes[selectedInterludeIdx].title = val;
                            return next;
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-cinzel text-sm focus:border-rose-400/60 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-tech text-[10px] text-neutral-400 tracking-[0.2em] uppercase mb-1.5">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={currentInterlude.subtitle || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraftConfig((prev) => {
                            const next = JSON.parse(JSON.stringify(prev));
                            next.interludes[selectedInterludeIdx].subtitle = val;
                            return next;
                          });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-tech text-xs focus:border-rose-400/60 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-tech text-[10px] text-neutral-400 tracking-[0.2em] uppercase mb-2">
                      Paragraphs (Presented one-by-one)
                    </label>
                    <div className="space-y-3">
                      {currentInterlude.paragraphs.map((p, pIdx) => (
                        <div
                          key={pIdx}
                          className="flex gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.05]"
                        >
                          <span className="font-tech text-xs text-neutral-500 pt-1 shrink-0">
                            0{pIdx + 1}
                          </span>
                          <textarea
                            rows={2}
                            value={p}
                            onChange={(e) => {
                              const val = e.target.value;
                              setDraftConfig((prev) => {
                                const next = JSON.parse(JSON.stringify(prev));
                                next.interludes[selectedInterludeIdx].paragraphs[pIdx] = val;
                                return next;
                              });
                            }}
                            className="flex-1 bg-transparent text-white font-editorial text-sm leading-relaxed focus:outline-none resize-none"
                          />
                          <button
                            onClick={() => {
                              setDraftConfig((prev) => {
                                const next = JSON.parse(JSON.stringify(prev));
                                next.interludes[selectedInterludeIdx].paragraphs.splice(pIdx, 1);
                                return next;
                              });
                            }}
                            className="p-1.5 text-neutral-500 hover:text-rose-400 self-start transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: CLIMAX ================= */}
            {activeTab === 'CLIMAX' && (
              <div className="space-y-6 max-w-2xl">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-5">
                  <div className="pb-3 border-b border-white/[0.05]">
                    <span className="font-cinzel text-sm font-bold text-white tracking-wide">
                      Lead-in Lines (Timed Sequence)
                    </span>
                    <p className="font-editorial text-xs text-neutral-400 mt-1">
                      Appears right after the particle numeral 5 forms
                    </p>
                  </div>

                  <div className="space-y-3">
                    {draftConfig.finalSequence.leadIn.map((line, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-3">
                        <span className="font-tech text-xs text-neutral-500 w-6">
                          0{lIdx + 1}
                        </span>
                        <input
                          type="text"
                          value={line}
                          onChange={(e) => {
                            const val = e.target.value;
                            setDraftConfig((prev) => {
                              const next = JSON.parse(JSON.stringify(prev));
                              next.finalSequence.leadIn[lIdx] = val;
                              return next;
                            });
                          }}
                          className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-cinzel text-sm focus:border-rose-400/60 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-5">
                  <div className="pb-3 border-b border-white/[0.05]">
                    <span className="font-cinzel text-sm font-bold text-white tracking-wide">
                      Anniversary Letter
                    </span>
                    <p className="font-editorial text-xs text-neutral-400 mt-1">
                      The core emotional letter displayed on the final black screen
                    </p>
                  </div>

                  <div className="space-y-3">
                    {draftConfig.finalSequence.mainMessage.map((p, pIdx) => (
                      <textarea
                        key={pIdx}
                        rows={3}
                        value={p}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDraftConfig((prev) => {
                            const next = JSON.parse(JSON.stringify(prev));
                            next.finalSequence.mainMessage[pIdx] = val;
                            return next;
                          });
                        }}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white font-editorial text-sm leading-relaxed focus:border-rose-400/60 focus:outline-none resize-none"
                      />
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="block font-tech text-[10px] text-neutral-400 tracking-[0.2em] uppercase mb-1.5">
                      Signature Tag
                    </label>
                    <input
                      type="text"
                      value={draftConfig.finalSequence.signature}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          finalSequence: {
                            ...draftConfig.finalSequence,
                            signature: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-rose-300 font-cinzel text-sm font-bold focus:border-rose-400/60 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= TAB: BACKUP & RESET ================= */}
            {activeTab === 'DATA' && (
              <div className="space-y-6 max-w-2xl">
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-4">
                  <div className="pb-3 border-b border-white/[0.05]">
                    <span className="font-cinzel text-sm font-bold text-white tracking-wide">
                      Export / Import JSON Data
                    </span>
                    <p className="font-editorial text-xs text-neutral-400 mt-1">
                      Download your customizations as a file or restore from a previously exported universe
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={handleExportJSON}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-tech text-xs tracking-wider uppercase transition-all"
                    >
                      <Download size={15} />
                      <span>Download JSON File</span>
                    </button>

                    <label className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white font-tech text-xs tracking-wider uppercase transition-all">
                      <Upload size={15} />
                      <span>Import JSON File</span>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImportJSON}
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.03] p-6 space-y-4">
                  <div className="pb-3 border-b border-rose-500/20">
                    <span className="font-cinzel text-sm font-bold text-rose-300 tracking-wide">
                      Restore Initial Universe Template
                    </span>
                    <p className="font-editorial text-xs text-neutral-400 mt-1">
                      Wipes local browser edits and restores all original placeholder content
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Restore the default universe template? All custom text and photos will be reset.')) {
                        onReset();
                        onClose();
                      }
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 font-tech text-xs tracking-wider uppercase transition-all"
                  >
                    <RotateCcw size={14} />
                    <span>Reset All to Defaults</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
