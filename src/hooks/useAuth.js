import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import { db } from '../lib/db';

export function useAuth({ setActiveMatchId }) {
  const navigate = useNavigate();
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState('VIEWER'); // SUPER_ADMIN, DISTRICT_ADMIN, SCORER, SELECTOR, VIEWER
  const [userPermissions, setUserPermissions] = useState({ can_add: false, can_edit: false, can_delete: false });

  // Registered Users (Super Admin access)
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    if (userRole === 'SUPER_ADMIN' || userRole === 'DISTRICT_ADMIN') {
      const fetchProfiles = async () => {
        try {
          const profiles = await api.getProfiles();
          const mapped = profiles.map(p => ({
            id: p.id,
            name: p.full_name,
            email: p.email || 'N/A',
            role: p.role,
            can_view: p.can_view,
            can_add: p.can_add,
            can_edit: p.can_edit,
            can_delete: p.can_delete,
            status: p.is_active ? 'Active' : 'Inactive',
            district: p.district?.name || 'All Districts'
          }));
          setRegisteredUsers(mapped);
        } catch (e) {
          console.error('[useAuth] Failed to load profiles', e);
        }
      };
      fetchProfiles();
    }
  }, [userRole]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUserEmail('');
      setUserRole('VIEWER');
      setUserPermissions({ can_add: false, can_edit: false, can_delete: false });
      if (setActiveMatchId) setActiveMatchId(null);
      
      navigate('/');
      
      // Clear offline scoring state
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('jdca_')) {
          localStorage.removeItem(key);
        }
      });
      
      // Clear Dexie queues if available
      if (db.sync_queue) await db.sync_queue.clear();
      if (db.delivery_log) await db.delivery_log.clear();
      
    } catch (err) {
      console.error("Error during logout:", err);
      // Force UI state regardless
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  return {
    isAuthenticated, setIsAuthenticated,
    userEmail, setUserEmail,
    userName, setUserName,
    userId, setUserId,
    userRole, setUserRole,
    userPermissions, setUserPermissions,
    registeredUsers, setRegisteredUsers,
    logout
  };
}
