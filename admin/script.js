const SUPABASE_URL = 'https://ВАШ_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'ВАШ_ANON_KEY';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

// ========== Аутентификация ==========
async function signIn() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    document.getElementById('auth-error').textContent = error.message;
    return;
  }
  currentUser = data.user;
  document.getElementById('auth-container').style.display = 'none';
  document.getElementById('admin-panel').style.display = 'block';
  loadStats();
  loadBroadcastHistory();
}

async function signOut() {
  await supabase.auth.signOut();
  location.reload();
}

// Проверка сессии при загрузке
window.addEventListener('DOMContentLoaded', async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    currentUser = user;
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    loadStats();
    loadBroadcastHistory();
  }
});

// ========== Переключение вкладок ==========
document.querySelectorAll('.tab-button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab + '-tab').classList.add('active');
  });
});

// ========== Статистика ==========
async function loadStats() {
  // Общее количество пользователей
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });
  document.getElementById('total-users').textContent = totalUsers ?? 0;

  // Новые и повторные за сегодня
  const today = new Date().toISOString().slice(0, 10);
  const { data: todayVisits, error } = await supabase
    .from('visits')
    .select('is_first_visit')
    .eq('visit_date', today);

  if (error) console.error(error);
  else {
    const newCount = todayVisits.filter(v => v.is_first_visit).length;
    const returnCount = todayVisits.length - newCount;
    document.getElementById('new-today').textContent = newCount;
    document.getElementById('return-today').textContent = returnCount;
  }

  // Данные для графика (последние 30 дней)
  const since = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const { data: daily, error: dailyError } = await supabase
    .from('visits')
    .select('visit_date, is_first_visit')
    .gte('visit_date', since)
    .order('visit_date');

  if (dailyError) {
    console.error(dailyError);
    return;
  }

  const dates = [...new Set(daily.map(d => d.visit_date))].sort();
  const newPerDay = dates.map(date =>
    daily.filter(d => d.visit_date === date && d.is_first_visit).length
  );
  const returnPerDay = dates.map(date =>
    daily.filter(d => d.visit_date === date && !d.is_first_visit).length
  );

  const ctx = document.getElementById('visitsChart').getContext('2d');
  if (window.visitsChartInstance) window.visitsChartInstance.destroy();
  window.visitsChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        { label: 'Новые', data: newPerDay, borderColor: '#667eea', backgroundColor: 'rgba(102,126,234,0.1)', fill: true },
        { label: 'Повторные', data: returnPerDay, borderColor: '#00b09b', backgroundColor: 'rgba(0,176,155,0.1)', fill: true },
      ]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });

  // Последние пользователи
  const { data: recentUsers } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  const tbody = document.querySelector('#recent-users tbody');
  tbody.innerHTML = recentUsers.map(u =>
    `<tr><td>${u.user_id}</td><td>${u.first_name || ''}</td><td>@${u.username || ''}</td><td>${new Date(u.created_at).toLocaleDateString()}</td></tr>`
  ).join('');
}

// ========== Рассылка ==========
document.getElementById('broadcast-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = document.getElementById('bc-text').value;
  const photoUrl = document.getElementById('bc-photo').value;
  const buttonText = document.getElementById('bc-button-text').value;
  const buttonUrl = document.getElementById('bc-button-url').value;

  const resultDiv = document.getElementById('broadcast-result');
  resultDiv.textContent = 'Отправка...';

  // Вызов Edge Function send-broadcast (URL замените на свой)
  const functionUrl = 'https://ВАШ_PROJECT.supabase.co/functions/v1/send-broadcast';
  const { data: { session } } = await supabase.auth.getSession();
  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({ text, photoUrl, buttonText, buttonUrl })
  });
  const result = await response.json();
  if (response.ok) {
    resultDiv.textContent = `Рассылка завершена. Отправлено: ${result.totalSent}`;
    loadBroadcastHistory();
  } else {
    resultDiv.textContent = 'Ошибка: ' + (result.error || 'неизвестная ошибка');
  }
});

async function loadBroadcastHistory() {
  const { data: broadcasts } = await supabase
    .from('broadcasts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);
  const tbody = document.querySelector('#broadcast-history tbody');
  tbody.innerHTML = broadcasts.map(b =>
    `<tr><td>${b.id}</td><td>${new Date(b.created_at).toLocaleString()}</td><td>${b.text.substring(0, 50)}</td><td>${b.total_sent}</td><td>${b.status}</td></tr>`
  ).join('');
}
