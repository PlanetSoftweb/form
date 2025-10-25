import React, { useState, useEffect } from 'react';
import { Search, Command, Plus, Trash2, Copy, Save, Eye, Undo, Redo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onCommand,
}) => {
  const [search, setSearch] = useState('');

  const commands = [
    { id: 'add-text', label: 'Add Text Input', icon: Plus, keywords: ['text', 'input', 'add'] },
    { id: 'add-email', label: 'Add Email Input', icon: Plus, keywords: ['email', 'input', 'add'] },
    { id: 'delete', label: 'Delete Selected', icon: Trash2, keywords: ['delete', 'remove', 'trash'] },
    { id: 'duplicate', label: 'Duplicate Selected', icon: Copy, keywords: ['duplicate', 'copy', 'clone'] },
    { id: 'save', label: 'Save Form', icon: Save, keywords: ['save'] },
    { id: 'preview', label: 'Preview Form', icon: Eye, keywords: ['preview', 'view', 'show'] },
    { id: 'undo', label: 'Undo', icon: Undo, keywords: ['undo', 'back'] },
    { id: 'redo', label: 'Redo', icon: Redo, keywords: ['redo', 'forward'] },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        />

        {/* Command Palette */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Search */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search commands..."
              className="flex-1 bg-transparent text-lg focus:outline-none"
              autoFocus
            />
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded">
              ESC
            </kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No commands found</p>
              </div>
            ) : (
              <div className="p-2">
                {filteredCommands.map((cmd, index) => {
                  const Icon = cmd.icon;
                  return (
                    <motion.button
                      key={cmd.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => {
                        onCommand(cmd.id);
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Icon className="h-4 w-4 text-gray-600 group-hover:text-blue-600" />
                      </div>
                      <span className="flex-1 text-left font-medium text-gray-900">
                        {cmd.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Command className="h-3 w-3" />
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-200">⌘ K</kbd>
                <span>to open</span>
              </div>
              <span>{filteredCommands.length} commands</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
