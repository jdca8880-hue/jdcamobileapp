import React, { useMemo, useState } from 'react';
import { Copy, Share2, Check, MessageCircle, FileText } from 'lucide-react';
import { calculateMatchHighlights, generateMatchSummary, generateSocialCaption } from '../../engine/matchSummaryEngine';

export default function MatchMediaReport({ match }) {
  const [copied, setCopied] = useState(false);
  const highlights = useMemo(() => calculateMatchHighlights(match), [match]);
  const summary = useMemo(() => generateMatchSummary(match, highlights), [match, highlights]);
  const caption = useMemo(() => generateSocialCaption(match, highlights), [match, highlights]);
  const headline = match.mediaHeadline || `${match.teamA?.name || 'TBA'} vs ${match.teamB?.name || 'TBA'} — Official Match Report`;

  const copy = async (text = summary) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch {}
  };

  return (
    <div>
      <div className="bg-white border border-gray-200 shadow-sm rounded-[16px] overflow-hidden mb-6 relative">
        <div className="bg-[#101827] text-white p-5 text-center flex flex-col items-center justify-center">
          <img src="/jdca-logo.png" alt="JDCA Emblem" className="w-12 h-12 object-contain mb-2 drop-shadow-md" />
          <div className="text-xs font-bold tracking-widest uppercase text-white/60 mb-1">Jabalpur District Cricket Association</div>
          <div className="text-[14px] font-black uppercase tracking-wider text-white">Official Media Report</div>
        </div>
        
        <div className="p-5">
          <div className="text-xs font-bold tracking-widest uppercase text-[#ff6100] mb-2">{match.stage || match.tournament || 'JDCA FIXTURE'}</div>
          <h2 className="text-[20px] font-black text-[#101827] leading-tight mb-4">{headline}</h2>
          <p className="text-[14px] text-[#596579] leading-relaxed mb-6 font-medium bg-gray-50 p-4 rounded-xl italic">
            "{summary}"
          </p>

          <div className="flex items-center justify-center gap-4 py-4 border-t border-b border-gray-100 mb-6">
            <div className="text-right flex-1">
              <div className="text-[16px] font-bold text-[#101827]">{match.teamA?.name}</div>
              <div className="text-[24px] font-black text-[#2457D6] leading-none">{match.teamA?.score || '—'}</div>
            </div>
            <div className="text-xs font-black uppercase tracking-widest text-[#8a99b0]">VS</div>
            <div className="text-left flex-1">
              <div className="text-[16px] font-bold text-[#101827]">{match.teamB?.name}</div>
              <div className="text-[24px] font-black text-[#101827] leading-none">{match.teamB?.score || '—'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-[12px] mb-6">
            <div>
              <div className="font-bold text-[#8a99b0] uppercase tracking-wider mb-1">Result</div>
              <div className="font-bold text-[#101827]">{match.resultText || match.result || 'Official result'}</div>
            </div>
            <div>
              <div className="font-bold text-[#8a99b0] uppercase tracking-wider mb-1">Venue</div>
              <div className="font-bold text-[#101827]">{match.venue || 'JDCA Ground'}</div>
            </div>
            <div>
              <div className="font-bold text-[#8a99b0] uppercase tracking-wider mb-1">Top Batter</div>
              <div className="font-bold text-[#101827]">{highlights.topBatter?.name || '—'}</div>
            </div>
            <div>
              <div className="font-bold text-[#8a99b0] uppercase tracking-wider mb-1">Top Bowler</div>
              <div className="font-bold text-[#101827]">{highlights.topBowler?.name || '—'}</div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-[12px]">
            <div className="text-xs font-bold tracking-widest uppercase text-[#8a99b0] mb-2 flex items-center gap-1"><MessageCircle size={12}/> Social / WhatsApp Format</div>
            <pre className="text-[12px] text-[#596579] whitespace-pre-wrap font-sans leading-relaxed m-0">
              {caption}
            </pre>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => copy(summary)}
          className="bg-[#2457D6] text-white flex items-center justify-center gap-2 py-3 rounded-[12px] text-[13px] font-bold active:bg-[#1b41a8] transition-colors"
        >
          {copied ? <Check size={16}/> : <FileText size={16}/>} 
          {copied ? 'Copied' : 'Copy Report'}
        </button>
        <button 
          onClick={() => copy(caption)}
          className="bg-[#0FA968] text-white flex items-center justify-center gap-2 py-3 rounded-[12px] text-[13px] font-bold active:bg-[#0a7d4e] transition-colors"
        >
          <MessageCircle size={16}/> 
          Copy Social
        </button>
        <button 
          onClick={() => navigator.share ? navigator.share({title: headline, text: summary}) : copy(summary)}
          className="col-span-2 bg-white border border-gray-200 text-[#101827] flex items-center justify-center gap-2 py-3 rounded-[12px] text-[13px] font-bold active:bg-gray-50 transition-colors"
        >
          <Share2 size={16}/> Share
        </button>
      </div>
    </div>
  );
}
