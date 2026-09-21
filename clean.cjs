const fs = require('fs');
let code = fs.readFileSync('src/components/screens/AdministrationScreen.jsx', 'utf8');

const correctTop = `import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Users, Shield, Settings, MapPin, Trophy, Calendar, Plus,
  Check, X, Edit, Bell, Lock, UserCheck, AlertTriangle
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { PageHeader, TabBar } from '../ui/PageHeader';
import { RoleBadge } from '../ui/Badge';
import { api } from '../../lib/api';
import SeasonMigrationTab from './SeasonMigrationTab';

const TABS = [
  { id: 'staff',      label: 'Staff & Users' },
  { id: 'migration',  label: 'Season Migration' },
  { id: 'system',     label: 'System & Settings' },
];

const ROLES = [
  'Super Admin',
  'District Admin',
  'Tournament Admin',
  'Scorer',
  'Selection Staff',
  'Other Staff'
];

const INITIAL_DISTRICTS = [
  { name: 'Jabalpur', code: 'JBP', grounds: 4, teams: 12, contact: 'Shri R. K. Tiwari', phone: '+91 94251 00001' },
  { name: 'Katni', code: 'KTN', grounds: 3, teams: 8, contact: 'Shri V. P. Patel', phone: '+91 94251 00002' },
  { name: 'Narsinghpur', code: 'NSP', grounds: 2, teams: 8, contact: 'Shri S. K. Dubey', phone: '+91 94251 00003' },
  { name: 'Seoni', code: 'SNI', grounds: 2, teams: 6, contact: 'Shri A. K. Shukla', phone: '+91 94251 00004' },
  { name: 'Mandla', code: 'MDL', grounds: 2, teams: 6, contact: 'Shri M. L. Yadav', phone: '+91 94251 00005' },
  { name: 'Balaghat', code: 'BGT', grounds: 3, teams: 8, contact: 'Shri D. C. Bisen', phone: '+91 94251 00006' },
  { name: 'Chhindwara', code: 'CDW', grounds: 3, teams: 10, contact: 'Shri P. N. Verma', phone: '+91 94251 00007' },
  { name: 'Dindori', code: 'DND', grounds: 1, teams: 4, contact: 'Shri B. S. Maravi', phone: '+91 94251 00008' },
  { name: 'Pandhurna', code: 'PDR', grounds: 2, teams: 6, contact: 'Shri S. R. Deshmukh', phone: '+91 94251 00009' },
];

const INITIAL_VENUES = [
  { name: 'Jabalpur Cricket Stadium (Wright Town)', district: 'Jabalpur', type: 'Stadium (Turf Pitch)', floodlights: 'Yes' },
  { name: 'Ranital Sports Complex', district: 'Jabalpur', type: 'Turf Pitch', floodlights: 'Yes' },
  { name: 'Katni District Sports Ground', district: 'Katni', type: 'Turf Pitch', floodlights: 'No' },
  { name: 'Narsinghpur Stadium Ground', district: 'Narsinghpur', type: 'Matting / Turf', floodlights: 'No' },
  { name: 'Seoni District Ground', district: 'Seoni', type: 'Turf Pitch', floodlights: 'No' },
  { name: 'Police Grounds Chhindwara', district: 'Chhindwara', type: 'Turf Pitch', floodlights: 'No' },
];

const INITIAL_FORMATS = [
  { name: 'T20 Match', overs: 20, ballsPerOver: 6, powerplayOvers: 6, maxBowlerOvers: 4 },
  { name: 'One Day (50 Overs)', overs: 50, ballsPerOver: 6, powerplayOvers: 10, maxBowlerOvers: 10 },
  { name: '40-Over Tournament', overs: 40, ballsPerOver: 6, powerplayOvers: 8, maxBowlerOvers: 8 },
  { name: 'Test / Days Match', overs: 'Multi-Day', ballsPerOver: 6, powerplayOvers: '-', maxBowlerOvers: 'Unlimited' },
];`;

let lines = code.split('\n');
let newCode = correctTop + '\n' + lines.slice(103).join('\n');
fs.writeFileSync('src/components/screens/AdministrationScreen.jsx', newCode);
console.log('Fixed file.');
