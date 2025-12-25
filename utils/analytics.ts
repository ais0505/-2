
// Analytics & Database Utility

// ВСТАВЬТЕ СЮДА ВАШ URL ИЗ GOOGLE APPS SCRIPT
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwnnqJHY7I7uv22mr6fHmVMeVYfctjMh2nJUPMcmZakM5pl6zGcQ8lIVipqdPzizaSWQw/exec'; 

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
  event: string;
  properties: Record<string, any>;
  timestamp: string;
  session_id: string;
}

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
    properties: properties,
  };

  // Всегда логируем в консоль для проверки
  console.log(`%c[Analytics] ${eventName}`, 'color: #8b5cf6; font-weight: bold;', payload);

  // Всегда сохраняем в локальную историю браузера
  saveToLocalHistory(payload);

  // В GOOGLE SHEETS ОТПРАВЛЯЕМ ТОЛЬКО ФИНАЛЬНЫЙ ОТЧЕТ
  // Это предотвращает появление множества неполных строк в таблице
  const isFinalReport = eventName === 'game_complete_sheet';

  if (isFinalReport && GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.startsWith('http')) {
    try {
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Оставляем no-cors для Google Scripts
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).then(() => {
        console.log('%c[DB Sync] Final data sent to Google Sheets', 'color: #10b981; font-weight: bold;');
      }).catch(err => console.error('Database sync failed:', err));
    } catch (e) {
      console.error('Analytics error:', e);
    }
  }
};

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
  a.download = `humanity_db_export_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
