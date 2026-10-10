import React, { useMemo, useState } from 'react';
import { Copy, Share2, Check, MessageCircle, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { calculateMatchHighlights, generateMatchSummary, generateSocialCaption } from '../../engine/matchSummaryEngine';
import { shareResultCardImage } from '../../lib/share';

export default function MatchMediaReport({ match = {} }) {
  const [copied, setCopied] = useState(false);
  const [imgBusy, setImgBusy] = useState(false);
  const highlights = useMemo(() => calculateMatchHighlights(match), [match]);
  const summary = useMemo(() => generateMatchSummary(match, highlights), [match, highlights]);
  const caption = useMemo(() => generateSocialCaption(match, highlights), [match, highlights]);
  const homeName = match?.home_team?.name || match?.home_team?.short_name || 'Home';
  const awayName = match?.away_team?.name || match?.away_team?.short_name || 'Away';
  const headline = match?.mediaHeadline || `${homeName} vs ${awayName} — Official Match Report`;

  const copy = async (text = summary) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  };

  const shareImage = async () => {
    if (imgBusy) return;
    setImgBusy(true);
    try {
      await shareResultCardImage({ ...match, resultText: match?.resultText || match?.result_text || match?.result }, highlights);
    } catch (err) {
      console.error('Result image failed', err);
      alert('Could not generate the result image. Please try again.');
    } finally {
      setImgBusy(false);
    }
  };

  return (
    <div>
      <div className="bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 shadow-sm rounded-[16px] overflow-hidden mb-6 relative">
        <div className="bg-[#101827] dark:bg-[#14171A] text-white p-5 text-center flex flex-col items-center justify-center border-b border-transparent dark:border-white/10">
          <img src="/jdca-logo.png" alt="JDCA Emblem" className="w-12 h-12 object-contain mb-2 drop-shadow-md" />
          <div className="text-xs font-bold tracking-widest uppercase text-white/60 mb-1">Jabalpur District Cricket Association</div>
          <div className="text-[14px] font-black uppercase tracking-wider text-white">Official Media Report</div>
        </div>
        
        <div className="p-5">
          <div className="text-xs font-bold tracking-widest uppercase text-[#F97316] mb-2">{match?.stage || match?.tournament || 'JDCA FIXTURE'}</div>
          <h2 className="text-[20px] font-black text-[#101827] dark:text-[#F3F4F6] leading-tight mb-4">{headline}</h2>
          <p className="text-[14px] text-[#596579] dark:text-[#CBD5E1] leading-relaxed mb-6 font-medium bg-gray-50 dark:bg-[#14171A] dark:border dark:border-white/10 p-4 rounded-xl italic">
            "{summary}"
          </p>

          <div className="flex items-center justify-center gap-4 py-4 border-t border-b border-gray-100 dark:border-white/10 mb-6">
            <div className="text-right flex-1">
              <div className="text-[16px] font-bold text-[#101827] dark:text-[#F3F4F6]">{match?.home_team?.name}</div>
              <div className="text-[24px] font-black text-[#2457D6] dark:text-[#A3E635] leading-none">{match?.home_team?.score || '—'}</div>
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-[#8a99b0] dark:text-slate-400">VS</div>
            <div className="text-left flex-1">
              <div className="text-[16px] font-bold text-[#101827] dark:text-[#F3F4F6]">{match?.away_team?.name}</div>
              <div className="text-[24px] font-black text-[#101827] dark:text-[#F3F4F6] leading-none">{match?.away_team?.score || '—'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[12px] mb-6">
            <div>
              <div className="font-bold text-[#8a99b0] dark:text-slate-400 uppercase tracking-wider mb-1">Result</div>
              <div className="font-bold text-[#101827] dark:text-[#F3F4F6]">{match?.resultText || match?.result || 'Official result'}</div>
            </div>
            <div>
              <div className="font-bold text-[#8a99b0] dark:text-slate-400 uppercase tracking-wider mb-1">Venue</div>
              <div className="font-bold text-[#101827] dark:text-[#F3F4F6]">{match?.venue || 'JDCA Ground'}</div>
            </div>
            <div>
              <div className="font-bold text-[#8a99b0] dark:text-slate-400 uppercase tracking-wider mb-1">Top Batter</div>
              <div className="font-bold text-[#101827] dark:text-[#F3F4F6]">{highlights.topBatter?.name || '—'}</div>
            </div>
            <div>
              <div className="font-bold text-[#8a99b0] dark:text-slate-400 uppercase tracking-wider mb-1">Top Bowler</div>
              <div className="font-bold text-[#101827] dark:text-[#F3F4F6]">{highlights.topBowler?.name || '—'}</div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#14171A] dark:border dark:border-white/10 p-4 rounded-[12px]">
            <div className="text-xs font-bold tracking-widest uppercase text-[#8a99b0] dark:text-slate-400 mb-2 flex items-center gap-1"><MessageCircle size={12}/> Social / WhatsApp Format</div>
            <pre className="text-[12px] text-[#596579] dark:text-[#CBD5E1] whitespace-pre-wrap font-sans leading-relaxed m-0">
              {caption}
            </pre>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => copy(summary)}
          className="bg-[#2457D6] dark:bg-[#A3E635] text-white dark:text-[#0A0A0A] flex items-center justify-center gap-2 py-3 rounded-[12px] text-[13px] font-bold active:opacity-90 transition-colors cursor-pointer"
        >
          {copied ? <Check size={16}/> : <FileText size={16}/>} 
          {copied ? 'Copied' : 'Copy Report'}
        </button>
        <button 
          onClick={() => copy(caption)}
          className="bg-[#0FA968] text-white flex items-center justify-center gap-2 py-3 rounded-[12px] text-[13px] font-bold active:opacity-90 transition-colors cursor-pointer"
        >
          <MessageCircle size={16}/> 
          Copy Social
        </button>
        <button
          onClick={shareImage}
          disabled={imgBusy}
          className="col-span-2 bg-[#101827] dark:bg-[#14171A] text-white flex items-center justify-center gap-2 py-3 rounded-[12px] text-[13px] font-bold active:opacity-90 transition-colors cursor-pointer disabled:opacity-60 border border-transparent dark:border-white/10"
        >
          {imgBusy ? <Loader2 size={16} className="animate-spin"/> : <ImageIcon size={16}/>}
          {imgBusy ? 'Preparing image…' : 'Share Result Image'}
        </button>
        <button
          onClick={() => navigator.share ? navigator.share({title: headline, text: summary}).catch(() => {}) : copy(summary)}
          className="col-span-2 bg-white dark:bg-[#181A1D] border border-gray-200 dark:border-white/10 text-[#101827] dark:text-[#F3F4F6] flex items-center justify-center gap-2 py-3 rounded-[12px] text-[13px] font-bold active:bg-gray-50 dark:active:bg-[#262B30] transition-colors cursor-pointer"
        >
          <Share2 size={16}/> Share Text
        </button>
      </div>
    </div>
  );
}
