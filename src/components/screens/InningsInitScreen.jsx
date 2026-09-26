import React, { useState, useMemo } from 'react';
import { useCricket } from '../../context/CricketContext';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ChevronDown, Shield, Zap, Users, Check } from 'lucide-react';

/* ────────── Inline SVG Icons (cricket-themed) ────────── */
const BatIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21l4-4" />
    <path d="M7 17l8.5-8.5c1-1 2.5-1 3.5 0l.5.5c1 1 1 2.5 0 3.5L11 21" />
    <path d="M14 7l3 3" />
  </svg>
);

const BallIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 2.5C8 2.5 9.5 7 9.5 12S8 21.5 8 21.5" />
    <path d="M16 2.5C16 2.5 14.5 7 14.5 12S16 21.5 16 21.5" />
  </svg>
);

/* ────────── Role badge color map ────────── */
const roleColors = {
  'Batter':        'bg-cobalt-50 text-cobalt-700',
  'Batsman':       'bg-cobalt-50 text-cobalt-700',
  'Bowler':        'bg-jade-50 text-jade-700',
  'All-Rounder':   'bg-mango-50 text-mango-700',
  'All Rounder':   'bg-mango-50 text-mango-700',
  'Wicket Keeper': 'bg-coral-50 text-coral-700',
  'WK-Batter':     'bg-coral-50 text-coral-700',
};

const getRoleBadge = (role) => {
  const colorClasses = roleColors[role] || 'bg-ink-50 text-ink-600';
  return colorClasses;
};

/* ────────── Custom Select Component ────────── */
function PlayerSelect({ id, icon: Icon, label, sublabel, value, onChange, players, disabledIds = [], completed }) {
  const [open, setOpen] = useState(false);
  const selectedPlayer = players.find(p => String(p.id) === String(value));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative"
    >
      <div className={`
        rounded-2xl border-2 transition-all duration-300 overflow-hidden
        ${completed 
          ? 'border-jade/30 bg-jade-50/40 shadow-[0_0_20px_rgba(15,169,104,0.08)]' 
          : open 
            ? 'border-cobalt/50 bg-white shadow-lg shadow-cobalt/5' 
            : 'border-ink-100/60 bg-white shadow-sm hover:border-ink-300/50 hover:shadow-md'
        }
      `}>
        {/* Label Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300
            ${completed 
              ? 'bg-jade text-white' 
              : 'bg-ink-50 text-ink-300'
            }
          `}>
            {completed ? <Check size={18} strokeWidth={3} /> : <Icon className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-300">{label}</div>
            <div className="text-[10px] text-ink-300/70 mt-0.5">{sublabel}</div>
          </div>
          {selectedPlayer?.isCaptain && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-mango-50 text-mango-700 px-2 py-0.5 rounded-full">C</span>
          )}
        </div>

        {/* Select Trigger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 pb-4 pt-1 text-left group"
        >
          <span className={`text-[15px] font-semibold truncate ${selectedPlayer ? 'text-ink' : 'text-ink-300'}`}>
            {selectedPlayer 
              ? (selectedPlayer.name || selectedPlayer.full_name)
              : '— Select Player —'
            }
          </span>
          <div className="flex items-center gap-2">
            {selectedPlayer?.role && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRoleBadge(selectedPlayer.role)}`}>
                {selectedPlayer.role}
              </span>
            )}
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={16} className="text-ink-300" />
            </motion.div>
          </div>
        </button>

        {/* Dropdown Panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-ink-100/40 max-h-52 overflow-y-auto">
                {players.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-ink-300">No players available</div>
                )}
                {players.map(p => {
                  const isDisabled = disabledIds.includes(String(p.id));
                  const isSelected = String(p.id) === String(value);
                  const displayName = p.name || p.full_name;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        onChange(String(p.id));
                        setOpen(false);
                      }}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 text-left transition-colors
                        ${isSelected 
                          ? 'bg-cobalt-50 text-cobalt-700' 
                          : isDisabled 
                            ? 'opacity-35 cursor-not-allowed bg-ink-50/30' 
                            : 'hover:bg-ink-50/60 active:bg-ink-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`
                          w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black
                          ${isSelected ? 'bg-cobalt text-white' : 'bg-ink-50 text-ink-300'}
                        `}>
                          {displayName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="truncate">
                          <span className={`text-[14px] font-medium ${isSelected ? 'text-cobalt-700' : 'text-ink'}`}>
                            {displayName}
                          </span>
                          {p.isCaptain && <span className="ml-1.5 text-[10px] font-black text-mango">(C)</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {p.role && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRoleBadge(p.role)}`}>
                            {p.role}
                          </span>
                        )}
                        {isSelected && <Check size={14} strokeWidth={3} className="text-cobalt" />}
                        {isDisabled && !isSelected && (
                          <span className="text-[9px] font-bold text-ink-300 uppercase">Selected</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ────────── Main Component ────────── */
export default function InningsInitScreen({ battingXI, bowlingXI }) {
  const { replaceStriker, replaceBatter, replaceBowler, startInnings, matchSetup } = useCricket();
  
  const [selectedStriker, setSelectedStriker] = useState('');
  const [selectedNonStriker, setSelectedNonStriker] = useState('');
  const [selectedBowler, setSelectedBowler] = useState('');

  const isAllSelected = selectedStriker && selectedNonStriker && selectedBowler;
  const hasDuplicate = selectedStriker && selectedNonStriker && selectedStriker === selectedNonStriker;
  const canStart = isAllSelected && !hasDuplicate;
  const insufficientBatters = battingXI.length < 2;
  const insufficientBowlers = bowlingXI.length < 1;

  // Compute disabled IDs for each dropdown to prevent duplicates
  const strikerDisabledIds = useMemo(() => selectedNonStriker ? [selectedNonStriker] : [], [selectedNonStriker]);
  const nonStrikerDisabledIds = useMemo(() => selectedStriker ? [selectedStriker] : [], [selectedStriker]);

  const completionCount = [selectedStriker, selectedNonStriker, selectedBowler].filter(Boolean).length;

  const handleStartInnings = () => {
    if (!canStart) return;

    const s = battingXI.find(p => String(p.id) === String(selectedStriker));
    const ns = battingXI.find(p => String(p.id) === String(selectedNonStriker));
    const b = bowlingXI.find(p => String(p.id) === String(selectedBowler));

    if (s && ns && b) {
      if (window.confirm("You are about to start live scoring. Are you sure?")) {
        replaceStriker({ ...s, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.0' });
        replaceBatter(false, { ...ns, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.0' });
        replaceBowler(b);
        startInnings();
      }
    } else {
      alert(`Error finding players. Please re-select and try again.`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cloud via-white to-cobalt-50/30 flex flex-col">
      {/* ───── Decorative Background Patterns ───── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-cobalt/[0.03] rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-jade/[0.04] rounded-full blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col max-w-md mx-auto w-full px-5 pt-16 pb-8">
        {/* ───── Header ───── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl bg-cobalt/10 flex items-center justify-center">
              <Shield size={20} className="text-cobalt" />
            </div>
            <div>
              <h2 className="text-xl font-black text-ink tracking-tight leading-tight">
                Innings Setup
              </h2>
              <p className="text-xs text-ink-300 mt-0.5">
                Select openers & bowler to begin
              </p>
            </div>
          </div>

          {/* ───── Progress Dots ───── */}
          <div className="flex items-center gap-2 mt-4">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i < completionCount ? 'bg-jade' : 'bg-ink-100'
                }`}
                animate={{ width: i < completionCount ? 40 : 24 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            ))}
            <span className="text-[11px] font-bold text-ink-300 ml-2">{completionCount}/3</span>
          </div>
        </motion.div>

        {/* ───── Insufficient Players Warning ───── */}
        {(insufficientBatters || insufficientBowlers) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 p-4 rounded-2xl bg-mango-50 border border-mango-400/30 flex items-start gap-3"
          >
            <AlertTriangle size={18} className="text-mango shrink-0 mt-0.5" />
            <div>
              <div className="text-[13px] font-bold text-mango-700">Insufficient Playing XI</div>
              <p className="text-[11px] text-mango-700/70 mt-1 leading-relaxed">
                {insufficientBatters && (
                  <>Batting side has only <strong>{battingXI.length}</strong> player{battingXI.length !== 1 ? 's' : ''} — need at least 2 openers. </>
                )}
                {insufficientBowlers && (
                  <>Bowling side has <strong>{bowlingXI.length}</strong> player{bowlingXI.length !== 1 ? 's' : ''} — need at least 1 bowler. </>
                )}
                Go back to <strong>Match Setup</strong> to add more players to the Playing XI.
              </p>
            </div>
          </motion.div>
        )}

        {/* ───── Selection Cards ───── */}
        <div className="flex flex-col gap-4 flex-1">
          <PlayerSelect
            id="select-striker"
            icon={BatIcon}
            label="Striker"
            sublabel="Opening batter on strike"
            value={selectedStriker}
            onChange={setSelectedStriker}
            players={battingXI}
            disabledIds={strikerDisabledIds}
            completed={!!selectedStriker}
          />

          <PlayerSelect
            id="select-non-striker"
            icon={BatIcon}
            label="Non-Striker"
            sublabel="Opening batter at non-striker end"
            value={selectedNonStriker}
            onChange={setSelectedNonStriker}
            players={battingXI}
            disabledIds={nonStrikerDisabledIds}
            completed={!!selectedNonStriker}
          />

          <PlayerSelect
            id="select-bowler"
            icon={BallIcon}
            label="Opening Bowler"
            sublabel="First over bowler"
            value={selectedBowler}
            onChange={setSelectedBowler}
            players={bowlingXI}
            disabledIds={[]}
            completed={!!selectedBowler}
          />
        </div>

        {/* ───── Duplicate Warning ───── */}
        <AnimatePresence>
          {hasDuplicate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 px-4 py-3 rounded-xl bg-coral-50 border border-coral-400/30 flex items-center gap-2"
            >
              <AlertTriangle size={14} className="text-coral shrink-0" />
              <span className="text-[12px] font-semibold text-coral-700">Striker and Non-Striker cannot be the same player.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ───── Start Button ───── */}
        <motion.button
          onClick={handleStartInnings}
          disabled={!canStart}
          whileTap={canStart ? { scale: 0.97 } : {}}
          className={`
            relative w-full mt-8 py-4.5 rounded-2xl font-black text-[15px] uppercase tracking-wider
            transition-all duration-400 overflow-hidden
            ${canStart
              ? 'bg-jade text-white shadow-lg shadow-jade/25 active:shadow-md'
              : 'bg-ink-100 text-ink-300 cursor-not-allowed'
            }
          `}
        >
          {/* Animated shine effect */}
          {canStart && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
              animate={{ x: ['-150%', '250%'] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
            />
          )}
          <span className="relative flex items-center justify-center gap-2.5">
            <Zap size={16} strokeWidth={3} className={canStart ? 'text-white' : 'text-ink-300'} />
            Start Scoring
          </span>
        </motion.button>

        {/* ───── Bottom Info ───── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[10px] text-ink-300/60 text-center mt-4 leading-relaxed"
        >
          Once started, ball-by-ball scoring begins. You can undo actions during the match.
        </motion.p>
      </div>
    </div>
  );
}
