
// Analytics Utility

// ВАЖНО: Вставьте вашу ссылку Web App URL внутри кавычек ниже.
// Она должна начинаться с https://script.google.com/macros/s/...
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwV8HAj_DmDGP6VDfcD_t-eRZaLTmjt6m_TxgPmL5Cec8ZsTy4QKuTDvwqJnag7AghCBg/exec'; 

const STORAGE_KEY_HISTORY = 'hm_analytics_history';
const SESSION_KEY = 'hm_session_id';

const getSessionId = (): string => {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
};

export interface AnalyticsEvent {
  event_name: string;
  properties?: Record<string, any>;
  timestamp?: string;
  session_id?: string;
}

// Helper to save to local storage (backup)
const saveToLocalHistory = (event: any) => {
  try {
    const historyStr = localStorage.getItem(STORAGE_KEY_HISTORY);
    const history = historyStr ? JSON.parse(historyStr) : [];
    history.push(event);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.warn('Failed to save analytics locally', e);
  }
};

export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  const sessionId = getSessionId();
  
  const payload = {
    event: eventName,
    session_id: sessionId,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    properties: properties,
    user_agent: navigator.userAgent
  };

  // 1. Log to console
  console.log(`%c[Data Sent] ${eventName}`, 'color: #10b981; font-weight: bold;', payload);

  // 2. Save locally (backup)
  saveToLocalHistory(payload);

  // 3. SEND TO GOOGLE SHEETS
  // Проверяем, что ссылка вставлена (не пустая и не дефолтная фраза)
  if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith('http')) {
    try {
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(err => console.error('Google Sheets send failed:', err));
    } catch (e) {
      console.error('Analytics error:', e);
    }
  } else {
    // Если ссылка не вставлена, просто предупреждаем в консоли
    console.warn('Google Script URL не настроен в файле utils/analytics.ts');
  }
};

// Function to download collected data
export const downloadAnalyticsData = () => {
  const historyStr = localStorage.getItem(STORAGE_KEY_HISTORY);
  if (!historyStr) {
    alert('Нет данных для выгрузки');
    return;
  }

  const blob = new Blob([historyStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `humanity_map_data_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const clearAnalyticsData = () => {
    localStorage.removeItem(STORAGE_KEY_HISTORY);
    console.log('Analytics history cleared');
};

// Functions to keep compatibility if imported elsewhere, but they don't do anything now
export const getAnalyticsUrl = () => GOOGLE_SCRIPT_URL;
export const setAnalyticsUrl = (url: string) => {}; 
