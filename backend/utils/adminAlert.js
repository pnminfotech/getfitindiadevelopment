// utils/adminAlert.js
import AdminAlert from '../models/AdminAlert.js';

export const createAdminAlert = async (payload) => {
  try { await AdminAlert.create(payload); }
  catch (e) { console.warn('AdminAlert create failed:', e?.message); }
};
