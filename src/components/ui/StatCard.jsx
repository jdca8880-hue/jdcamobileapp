import React from 'react';

/**
 * JDCA StatCard — for dashboard stat strips and player profiles
 * Clean UI styling with subtle solid accents
 */
const SOLID_THEMES = {
  lime: {
    bg: 'bg-white dark:bg-[#262B30] border-l-4 border-l-[#A3E635] border-slate-200 dark:border-white/10 shadow-sm',
    iconBg: 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30',
    val: 'text-slate-900 dark:text-[#F3F4F6]',
    lbl: 'text-slate-500 dark:text-[#64748B]',
    sub: 'text-slate-400 dark:text-[#64748B]',
  },
  blue: {
    bg: 'bg-white dark:bg-[#262B30] border-l-4 border-l-[#A3E635] border-slate-200 dark:border-white/10 shadow-sm',
    iconBg: 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30',
    val: 'text-slate-900 dark:text-[#F3F4F6]',
    lbl: 'text-slate-500 dark:text-[#64748B]',
    sub: 'text-slate-400 dark:text-[#64748B]',
  },
  emerald: {
    bg: 'bg-white dark:bg-[#262B30] border-l-4 border-l-emerald-500 border-slate-200 dark:border-white/10 shadow-sm',
    iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    val: 'text-slate-900 dark:text-[#F3F4F6]',
    lbl: 'text-slate-500 dark:text-[#64748B]',
    sub: 'text-slate-400 dark:text-[#64748B]',
  },
  amber: {
    bg: 'bg-white dark:bg-[#262B30] border-l-4 border-l-amber-500 border-slate-200 dark:border-white/10 shadow-sm',
    iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    val: 'text-slate-900 dark:text-[#F3F4F6]',
    lbl: 'text-slate-500 dark:text-[#64748B]',
    sub: 'text-slate-400 dark:text-[#64748B]',
  },
  purple: {
    bg: 'bg-white dark:bg-[#262B30] border-l-4 border-l-purple-500 border-slate-200 dark:border-white/10 shadow-sm',
    iconBg: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
    val: 'text-slate-900 dark:text-[#F3F4F6]',
    lbl: 'text-slate-500 dark:text-[#64748B]',
    sub: 'text-slate-400 dark:text-[#64748B]',
  },
  rose: {
    bg: 'bg-white dark:bg-[#262B30] border-l-4 border-l-[#EF4444] border-slate-200 dark:border-white/10 shadow-sm',
    iconBg: 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30',
    val: 'text-slate-900 dark:text-[#F3F4F6]',
    lbl: 'text-slate-500 dark:text-[#64748B]',
    sub: 'text-slate-400 dark:text-[#64748B]',
  },
  cyan: {
    bg: 'bg-white dark:bg-[#262B30] border-l-4 border-l-cyan-500 border-slate-200 dark:border-white/10 shadow-sm',
    iconBg: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    val: 'text-slate-900 dark:text-[#F3F4F6]',
    lbl: 'text-slate-500 dark:text-[#64748B]',
    sub: 'text-slate-400 dark:text-[#64748B]',
  },
  orange: {
    bg: 'bg-white dark:bg-[#262B30] border-l-4 border-l-[#F97316] border-slate-200 dark:border-white/10 shadow-sm',
    iconBg: 'bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30',
    val: 'text-slate-900 dark:text-[#F3F4F6]',
    lbl: 'text-slate-500 dark:text-[#64748B]',
    sub: 'text-slate-400 dark:text-[#64748B]',
  },
};

const TONE_MAP = {
  primary: 'lime',
  success: 'emerald',
  warning: 'orange',
  info: 'cyan',
  danger: 'rose',
};

const THEME_KEYS = ['blue', 'emerald', 'amber', 'purple', 'rose', 'cyan', 'orange'];

export function StatCard({
  value,
  label,
  subtext,
  icon: Icon,
  tone,
  color,
  accent,
  bg,
  size = 'md',
  className = '',
  index = 0
}) {
  const sizes = {
    sm: { val: 'text-xl font-bold', lbl: 'text-xs', pad: 'p-3.5', icon: 16 },
    md: { val: 'text-2xl font-black', lbl: 'text-xs', pad: 'p-4', icon: 18 },
    lg: { val: 'text-3xl font-black', lbl: 'text-sm', pad: 'p-5', icon: 20 },
  };
  const s = sizes[size] || sizes.md;

  const selectedThemeKey = color || (tone && TONE_MAP[tone]) || THEME_KEYS[index % THEME_KEYS.length];
  const theme = SOLID_THEMES[selectedThemeKey] || SOLID_THEMES.blue;

  return (
    <div
      className={`rounded-2xl ${s.pad} flex flex-col justify-between border hover:shadow-md transition-all duration-300 ${theme.bg} ${className}`}
      style={bg ? { background: bg } : undefined}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`${s.lbl} font-bold uppercase tracking-wider ${theme.lbl}`}>
          {label}
        </span>
        {Icon && (
          <div className={`p-1.5 rounded-xl ${theme.iconBg}`}>
            <Icon size={s.icon} strokeWidth={2.4} />
          </div>
        )}
      </div>

      <div className={`${s.val} font-tabular tracking-tight leading-none ${theme.val}`}>
        {value}
      </div>

      {subtext && (
        <div className={`text-xs font-medium mt-1.5 ${theme.sub}`}>
          {subtext}
        </div>
      )}
    </div>
  );
}

/**
 * StatStrip — horizontal row of stats with solid colored cards
 */
export function StatStrip({ stats, className = '' }) {
  return (
    <div className={`grid gap-3 ${className}`} style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}>
      {stats.map((stat, i) => (
        <StatCard
          key={i}
          index={i}
          value={stat.value}
          label={stat.label}
          subtext={stat.subtext}
          icon={stat.icon}
          tone={stat.tone}
          color={stat.color}
          accent={stat.accent}
          size={stat.size || 'sm'}
        />
      ))}
    </div>
  );
}

export default StatCard;
