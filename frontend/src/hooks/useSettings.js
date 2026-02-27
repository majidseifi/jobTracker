import { useState, useCallback } from 'react';

const STORAGE_KEY = 'jt-settings';

const DEFAULTS = {
  autoRefresh: true,
  refreshInterval: 120000,
  pageSize: 25,
  defaultStatusFilter: 'To-Do',
  weeklyTarget: 20,
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export default function useSettings() {
  const [settings, setSettings] = useState(loadSettings);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, updateSetting };
}
