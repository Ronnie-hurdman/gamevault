import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Save } from 'lucide-react';
import { Game, Platform, PlayedStatus } from '../types';

interface EditGameModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Game>) => void;
}

interface FormState {
  title: string;
  platform: Platform;
  playedStatus: PlayedStatus;
  isFavorite: boolean;
  price: string;
  rating: number;
  description: string;
  notes: string;
  dateStarted: string;
  dateFinished: string;
  completionPercentage: number;
  hoursPlayed: number;
}

const platforms: Platform[] = ['Sony', 'Nintendo', 'Steam'];
const playedStatuses: PlayedStatus[] = ['Unplayed', 'Playing', 'Played'];

function buildInitialState(game: Game): FormState {
  return {
    title: game.title || '',
    platform: game.platform,
    playedStatus: game.playedStatus,
    isFavorite: !!game.isFavorite,
    price: game.price || '',
    rating: game.rating || 0,
    description: game.description || '',
    notes: game.notes || '',
    dateStarted: game.dateStarted || '',
    dateFinished: game.dateFinished || '',
    completionPercentage: game.completionPercentage || 0,
    hoursPlayed: game.hoursPlayed || 0,
  };
}

export default function EditGameModal({ game, isOpen, onClose, onSave }: EditGameModalProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialState(game));

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
      playedStatus: form.playedStatus,
      isFavorite: form.isFavorite,
      price: form.price.trim(),
      rating: Math.max(0, Math.min(5, Number(form.rating) || 0)),
      description: form.description.trim(),
      notes: form.notes.trim(),
      dateStarted: form.dateStarted || undefined,
      dateFinished: form.dateFinished || undefined,
      completionPercentage: Math.max(0, Math.min(100, Number(form.completionPercentage) || 0)),
      hoursPlayed: Math.max(0, Number(form.hoursPlayed) || 0),
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="w-full max-w-2xl rounded-lg bg-black border-4 border-cyan-400 pixel-shadow"
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

            <form onSubmit={submit} className="p-5 space-y-4">
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
                  <span className="text-[10px] pixel-heading text-pink-400">Played Status</span>
                  <select
                    value={form.playedStatus}
                    onChange={(e) => setForm((prev) => ({ ...prev, playedStatus: e.target.value as PlayedStatus }))}
                    className="w-full rounded-md border-2 border-cyan-400 bg-black px-3 py-2 text-xs text-cyan-300 outline-none focus:border-pink-500"
                  >
                    {playedStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
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

                <label className="space-y-1.5">
                  <span className="text-[10px] pixel-heading text-pink-400">Hours Played</span>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.hoursPlayed}
                    onChange={(e) => setForm((prev) => ({ ...prev, hoursPlayed: Number(e.target.value) }))}
                    className="w-full rounded-md border-2 border-cyan-400 bg-black px-3 py-2 text-xs text-cyan-300 outline-none focus:border-pink-500"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[10px] pixel-heading text-pink-400">Completion %</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={form.completionPercentage}
                    onChange={(e) => setForm((prev) => ({ ...prev, completionPercentage: Number(e.target.value) }))}
                    className="w-full rounded-md border-2 border-cyan-400 bg-black px-3 py-2 text-xs text-cyan-300 outline-none focus:border-pink-500"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[10px] pixel-heading text-pink-400">Date Started</span>
                  <input
                    type="date"
                    value={form.dateStarted}
                    onChange={(e) => setForm((prev) => ({ ...prev, dateStarted: e.target.value }))}
                    className="w-full rounded-md border-2 border-cyan-400 bg-black px-3 py-2 text-xs text-cyan-300 outline-none focus:border-pink-500"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-[10px] pixel-heading text-pink-400">Date Finished</span>
                  <input
                    type="date"
                    value={form.dateFinished}
                    onChange={(e) => setForm((prev) => ({ ...prev, dateFinished: e.target.value }))}
                    className="w-full rounded-md border-2 border-cyan-400 bg-black px-3 py-2 text-xs text-cyan-300 outline-none focus:border-pink-500"
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 rounded-md border-2 border-cyan-400 bg-black/70 px-3 py-2">
                <input
                  type="checkbox"
                  checked={form.isFavorite}
                  onChange={(e) => setForm((prev) => ({ ...prev, isFavorite: e.target.checked }))}
                  className="h-4 w-4 accent-pink-500"
                />
                <span className="text-[10px] pixel-heading text-cyan-300">Favorite</span>
              </label>

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
  );
}
