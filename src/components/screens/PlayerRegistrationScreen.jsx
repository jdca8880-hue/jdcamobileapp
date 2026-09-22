import React, { useState } from 'react';
import { ArrowLeft, UserPlus, CheckCircle2, Shield, Calendar, MapPin, Activity, Award, Camera } from 'lucide-react';
import CloudinaryAvatar from '../ui/CloudinaryAvatar';
import { useCricket } from '../../context/CricketContext';
import { PlayerRegistrationSchema } from '../../engine/validationSchemas';

const JDCA_DISTRICTS = ['Jabalpur', 'Katni', 'Narsinghpur', 'Seoni', 'Mandla', 'Balaghat', 'Chhindwara', 'Dindori', 'Pandhurna'];
const AGE_CATEGORIES = ['Senior', 'Under-22', 'Under-18', 'Under-15', 'Under-13', "Women's Senior", "Women's Under-22", "Women's Under-18"];
const ROLES = ['Batter', 'Bowler', 'All-Rounder', 'Wicket Keeper'];
const BATTING_STYLES = ['Right-Hand Bat', 'Left-Hand Bat'];
const BOWLING_STYLES = ['None (Pure Batter)', 'Right-Arm Fast', 'Right-Arm Medium Fast', 'Right-Arm Off Spin', 'Right-Arm Leg Spin', 'Left-Arm Fast', 'Left-Arm Orthodox Spin', 'Left-Arm Chinaman'];

export default function PlayerRegistrationScreen() {
  const { registerPlayer, goBack } = useCricket();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Batter');
  const [battingStyle, setBattingStyle] = useState('Right-Hand Bat');
  const [bowlingStyle, setBowlingStyle] = useState('None (Pure Batter)');
  const [district, setDistrict] = useState('Jabalpur');
  const [category, setCategory] = useState('Senior');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Men');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80');
  const [formErrors, setFormErrors] = useState({});
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const avatarPresets = [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80'
  ];

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'jdcaunsignedupload');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/gglzv8pn/image/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setAvatar(data.secure_url);
      } else if (data.error) {
        alert(data.error.message || 'Failed to upload image.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});

    const formData = {
      name, role, battingStyle, bowlingStyle, district, category, dob, gender, avatar
    };

    const validation = PlayerRegistrationSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0];
        if (field) fieldErrors[field] = err.message;
      });
      setFormErrors(fieldErrors);
      return;
    }

    try {
      await registerPlayer(validation.data);
      setRegisteredSuccess(true);
      setTimeout(() => { goBack(); }, 1500);
    } catch (err) {
      // Error is alerted by context, but we prevent success UI
      console.error(err);
    }
  };

  return (
    <div className="pb-[100px] bg-slate-50 min-h-screen">
      <div className="bg-white px-4 pt-[60px] pb-6 border-b border-gray-100 relative shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <button
          onClick={goBack}
          className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-[#101827] active:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="text-center mt-6">
          <div className="w-12 h-12 bg-[#eef2fd] text-[#2457D6] rounded-full flex items-center justify-center mx-auto mb-3">
             <UserPlus size={24} />
          </div>
          <h1 className="text-[24px] font-black text-[#101827] leading-tight mb-1">New Player</h1>
          <p className="text-[13px] text-[#8a99b0] max-w-[250px] mx-auto">Register a cricketer into the JDCA Central Registry</p>
        </div>
      </div>

      {registeredSuccess && (
        <div className="m-4 p-4 rounded-[16px] bg-[#0FA968] text-white flex flex-col items-center text-center shadow-lg animate-slide-up">
          <CheckCircle2 size={32} className="mb-2" />
          <div className="font-black text-[16px]">Player Registered!</div>
          <div className="text-[12px] font-medium text-white/80">Redirecting to directory...</div>
        </div>
      )}

      {!registeredSuccess && (
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          
          {/* Photo & Basics */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-4 flex items-center gap-1.5"><Camera size={14}/> Identity</h2>
            
            <div className="flex flex-col items-center mb-6">
              <label className="relative mb-3 cursor-pointer group block">
                <CloudinaryAvatar src={avatar} alt="Preview" className={`w-24 h-24 rounded-full object-cover border-[3px] border-white shadow-md transition ${isUploading ? 'opacity-50' : 'group-hover:opacity-80'}`} />
                <div className="absolute bottom-0 right-0 w-7 h-7 bg-[#2457D6] rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                  {isUploading ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera size={12} />
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
              </label>
              <div className="flex gap-2">
                {avatarPresets.map((preset, idx) => (
                  <button key={idx} type="button" onClick={() => setAvatar(preset)} className={`w-8 h-8 rounded-full border-2 ${avatar === preset ? 'border-[#2457D6]' : 'border-transparent opacity-50'}`}>
                    <CloudinaryAvatar src={preset} alt="" className="w-full h-full rounded-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Full Name *</label>
                <input 
                  type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rahul Sharma"
                  className={`w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border focus:border-[#2457D6] ${formErrors.name ? 'border-[#F05A47]' : 'border-transparent'}`}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Date of Birth *</label>
                  <input 
                    type="date" required value={dob} onChange={e => setDob(e.target.value)}
                    className={`w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border focus:border-[#2457D6] ${formErrors.dob ? 'border-[#F05A47]' : 'border-transparent'}`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Gender *</label>
                  <select value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border border-transparent focus:border-[#2457D6] appearance-none">
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Affiliation */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-4 flex items-center gap-1.5"><MapPin size={14}/> Affiliation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">District Unit</label>
                <select value={district} onChange={e => setDistrict(e.target.value)} className="w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border border-transparent focus:border-[#2457D6] appearance-none">
                  {JDCA_DISTRICTS.map(d => <option key={d} value={d}>{d} District</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Age Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border border-transparent focus:border-[#2457D6] appearance-none">
                  {AGE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Specialisation */}
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-4 flex items-center gap-1.5"><Activity size={14}/> Specialisation</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Primary Role</label>
                <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border border-transparent focus:border-[#2457D6] appearance-none">
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Batting Style</label>
                  <select value={battingStyle} onChange={e => setBattingStyle(e.target.value)} className="w-full bg-slate-50 rounded-[12px] p-3 text-[12px] font-bold outline-none border border-transparent focus:border-[#2457D6] appearance-none">
                    {BATTING_STYLES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Bowling Style</label>
                  <select value={bowlingStyle} onChange={e => setBowlingStyle(e.target.value)} className="w-full bg-slate-50 rounded-[12px] p-3 text-[12px] font-bold outline-none border border-transparent focus:border-[#2457D6] appearance-none">
                    {BOWLING_STYLES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#2457D6] text-white rounded-[16px] py-4 font-bold text-[16px] shadow-md active:bg-[#1b41a8] transition-colors">
            Register Player
          </button>
        </form>
      )}
    </div>
  );
}
