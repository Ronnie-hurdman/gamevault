import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';
import { Game, Platform } from '../types';

interface EditGameModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Game>) => void;
}

interface FormState {
  title: string;
  platform: Platform;
  price: string;
  rating: number;
  description: string;
  notes: string;
}

const platforms: Platform[] = ['Sony', 'Nintendo', 'Steam'];

function buildInitialState(game: Game): FormState {
  return {
    title: game.title || '',
    platform: game.platform,
    price: game.price || '',
    rating: game.rating || 0,
    description: game.description || '',
    notes: game.notes || '',
  };
}

export default function EditGameModal({ game, isOpen, onClose, onSave }: EditGameModalProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(game));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setForm(buildInitialState(game));
    }
  }, [game, isOpen]);

  const canSave = useMemo(() => form.title.trim().length > 0, [form.title]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return;

    onSave({
      title: form.title.trim(),
      platform: form.platform,
      price: form.price.trim(),
      rating: Math.max(0, Math.min(5, Number(form.rating) || 0)),
      description: form.description.trim(),
      notes: form.notes.trim(),
    });

    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="w-[min(94vw,52rem)] max-h-[88vh] overflow-hidden rounded-lg bg-black border-4 border-cyan-400 pixel-shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-4 border-pink-500 px-5 py-4">
              <h3 className="text-sm md:text-base pixel-heading text-white">Edit Game Details</h3>
              <button
                type="button"
                onClick={onClose}
                className="h-9 w-9 rounded-md border-2 border-pink-500 text-pink-400 hover:text-white hover:bg-pink-600/30 transition-colors flex items-center justify-center"
                aria-label="Close edit modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={submit} className="max-h-[calc(88vh-5.5rem)] overflow-y-auto p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="space-y-1.5">
                  <span className="text-[10px] pixel-heading text-pink-400">Title</span>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full rounded-md border-2 border-cyan-400 bg-black px-3 py-2 text-xs text-cyan-300 outline-none focus:border-pink-500"
                    required
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[10px] pixel-heading text-pink-400">Platform</span>
                  <select
                    value={form.platform}
                    onChange={(e) => setForm((prev) => ({ ...prev, platform: e.target.value as Platform }))}
                    className="w-full rounded-md border-2 border-cyan-400 bg-black px-3 py-2 text-xs text-cyan-300 outline-none focus:border-pink-500"
                  >
                    {platforms.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-[10px] pixel-heading text-pink-400">Price</span>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                    className="w-full rounded-md border-2 border-cyan-400 bg-black px-3 py-2 text-xs text-cyan-300 outline-none focus:border-pink-500"
                    placeholder="$59.99"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[10px] pixel-heading text-pink-400">Rating (0-5)</span>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    step={1}
                    value={form.rating}
                    onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
                    className="w-full rounded-md border-2 border-cyan-400 bg-black px-3 py-2 text-xs text-cyan-300 outline-none focus:border-pink-500"
                  />
                </label>
              </div>

              <label className="space-y-1.5 block">
                <span className="text-[10px] pixel-heading text-pink-400">Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-md border-2 border-cyan-400 bg-black px-3 py-2 text-xs text-cyan-300 outline-none focus:border-pink-500"
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-[10px] pixel-heading text-pink-400">Notes</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full rounded-md border-2 border-cyan-400 bg-black px-3 py-2 text-xs text-cyan-300 outline-none focus:border-pink-500"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 text-[10px] pixel-heading"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!canSave}
                  className="arcade-btn text-[10px] disabled:opacity-50 inline-flex items-center gap-2"
                >
                  <Save size={14} />
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  , document.body);
}
