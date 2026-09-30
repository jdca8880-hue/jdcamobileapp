import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Info, Trophy, Newspaper, Radio } from 'lucide-react';
import { MatchStatusBadge } from './Badge';

export default function MatchFolder({ match, onOpen }) {
  const [open, setOpen] = useState(false);
  const live = match.status === 'LIVE' || match.status === 'IN_PROGRESS';
  const completed = match.status === 'COMPLETED' || match.status === 'FINISHED';
  const teamA = match.teamA?.name || 'Jabalpur XI';
  const teamB = match.teamB?.name || 'Katni XI';
  const scoreA = match.teamA?.score || '—';
  const scoreB = match.teamB?.score || '—';

  return (
    <section className={`match-folder-tile ${live ? 'match-folder-tile--live' : ''}`}>
      <button className="match-folder-tile__content" onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <div className="match-folder-tile__header">
          <MatchStatusBadge status={match.status} />
          <span className="match-folder-tile__icon">{live ? <Radio size={16} /> : <FileText size={16} />}</span>
        </div>
        
        <div className="match-folder-tile__details">
          <span className="match-folder-tile__eyebrow">{match.matchNumber || 'MATCH'} Â· {match.format || match.category || 'T20'}</span>
          <div className="match-folder-tile__teams">
            <div><strong>{teamA}</strong> <span>{scoreA}</span></div>
            <div className="vs">vs</div>
            <div><strong>{teamB}</strong> <span>{scoreB}</span></div>
          </div>
          <span className="match-folder-tile__meta">{match.venue || 'JDCA Ground'} Â· {match.date || 'Fixture'}</span>
        </div>
        
        <div className="match-folder-tile__footer">
          <span>{match.stage || match.tournament || 'Association Fixture'}</span>
          {open ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}
        </div>
      </button>

      {open && (
        <div className="match-folder-tile__actions">
          <button onClick={() => onOpen?.(match, 'information')}><Info size={16}/> Information</button>
          <button onClick={() => onOpen?.(match, 'scorecard')}><FileText size={16}/> Scorecard</button>
          <button onClick={() => onOpen?.(match, 'highlights')}><Trophy size={16}/> Highlights</button>
          {completed && <button onClick={() => onOpen?.(match, 'media')}><Newspaper size={16}/> Report</button>}
          {live && <button className="match-folder-tile__live-action" onClick={() => onOpen?.(match, 'live')}><Radio size={16}/> Live Scoring</button>}
        </div>
      )}
    </section>
  );
}
