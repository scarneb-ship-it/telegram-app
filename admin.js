// Admin Configuration
const ADMIN_PASSWORD = 'Scarnep31';
// Use the production backend URL or localhost for development
const API_BASE_URL = 'https://tgplayhub.preview.emergentagent.com/api';

// Session management
let authToken = localStorage.getItem('adminToken');
let usersData = [];
let activityChart = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    if (authToken === ADMIN_PASSWORD) {
        showDashboard();
    } else {
        showLogin();
    }
    
    setupEventListeners();
});

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Broadcast form
    const broadcastForm = document.getElementById('broadcast-form');
    if (broadcastForm) {
        broadcastForm.addEventListener('submit', handleBroadcast);
    }
    
    // Add button functionality
    const addButtonBtn = document.getElementById('add-button-btn');
    if (addButtonBtn) {
        addButtonBtn.addEventListener('click', addButtonField);
    }
    
    // Remove button functionality
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-remove')) {
            e.target.closest('.button-input-group').remove();
        }
    });
    
    // Search functionality
    const searchInput = document.getElementById('user-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

// Login
function handleLogin(e) {
    e.preventDefault();
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('login-error');
    
    if (passwordInput.value === ADMIN_PASSWORD) {
        authToken = ADMIN_PASSWORD;
        localStorage.setItem('adminToken', authToken);
        errorMessage.classList.remove('show');
        showDashboard();
    } else {
        errorMessage.textContent = 'Неверный пароль';
        errorMessage.classList.add('show');
    }
}

// Logout
function handleLogout() {
    authToken = null;
    localStorage.removeItem('adminToken');
    showLogin();
}

// Show/Hide screens
function showLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-dashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    loadDashboardData();
}

// Load dashboard data
async function loadDashboardData() {
    try {
        // Load statistics
        const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            updateStats(stats);
        }
        
        // Load users
        const usersResponse = await fetch(`${API_BASE_URL}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (usersResponse.ok) {
            usersData = await usersResponse.json();
            displayUsers(usersData);
        }
        
        // Load activity data for chart
        const activityResponse = await fetch(`${API_BASE_URL}/admin/activity`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (activityResponse.ok) {
            const activityData = await activityResponse.json();
            createActivityChart(activityData);
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Ошибка загрузки данных', 'error');
    }
}

// Update statistics cards
function updateStats(stats) {
    document.getElementById('total-users').textContent = stats.total_users || 0;
    document.getElementById('active-today').textContent = stats.active_today || 0;
    document.getElementById('active-week').textContent = stats.active_week || 0;
    document.getElementById('total-games-opened').textContent = stats.total_games_opened || 0;
}

// Create activity chart
function createActivityChart(data) {
    const ctx = document.getElementById('activity-chart').getContext('2d');
    
    // Destroy existing chart if any
    if (activityChart) {
        activityChart.destroy();
    }
    
    activityChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels || [],
            datasets: [{
                label: 'Активные пользователи',
                data: data.values || [],
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderColor: '#667eea',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Inter',
                            size: 13,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: '600'
                    },
                    bodyFont: {
                        size: 13
                    },
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Display users in table
function displayUsers(users) {
    const tbody = document.getElementById('users-table-body');
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">Нет данных о пользователях</td></tr>';
        return;
    }
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.telegram_id}</td>
            <td>${user.first_name || '-'} ${user.last_name || ''}</td>
            <td>@${user.username || '-'}</td>
            <td>${user.games_opened || 0}</td>
            <td>${user.streak_days || 0}</td>
            <td>${user.friends_invited || 0}</td>
            <td>${formatDate(user.last_visit)}</td>
        </tr>
    `).join('');
}

// Search users
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    if (!searchTerm) {
        displayUsers(usersData);
        return;
    }
    
    const filteredUsers = usersData.filter(user => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
        const username = (user.username || '').toLowerCase();
        return fullName.includes(searchTerm) || username.includes(searchTerm);
    });
    
    displayUsers(filteredUsers);
}

// Add button field
function addButtonField() {
    const container = document.getElementById('buttons-container');
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-input-group';
    buttonGroup.innerHTML = `
        <input type="text" placeholder="Текст кнопки" class="btn-text-input">
        <input type="url" placeholder="URL кнопки" class="btn-url-input">
        <button type="button" class="btn-remove">✕</button>
    `;
    container.appendChild(buttonGroup);
}

// Handle broadcast
async function handleBroadcast(e) {
    e.preventDefault();
    
    const text = document.getElementById('broadcast-text').value;
    const imageUrl = document.getElementById('broadcast-image').value;
    const statusDiv = document.getElementById('broadcast-status');
    
    // Collect buttons
    const buttonGroups = document.querySelectorAll('.button-input-group');
    const buttons = [];
    
    buttonGroups.forEach(group => {
        const textInput = group.querySelector('.btn-text-input');
        const urlInput = group.querySelector('.btn-url-input');
        
        if (textInput.value && urlInput.value) {
            buttons.push({
                text: textInput.value,
                url: urlInput.value
            });
        }
    });
    
    try {
        statusDiv.textContent = 'Отправка...';
        statusDiv.className = 'status-message show';
        
        const response = await fetch(`${API_BASE_URL}/admin/broadcast`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                text: text,
                image_url: imageUrl || null,
                buttons: buttons
            })
        });
        
        if (response.ok) {
            const result = await response.json();
            statusDiv.textContent = `Рассылка отправлена успешно! (${result.sent_count} пользователей)`;
            statusDiv.className = 'status-message show success';
            
            // Clear form
            document.getElementById('broadcast-form').reset();
            document.getElementById('buttons-container').innerHTML = `
                <div class="button-input-group">
                    <input type="text" placeholder="Текст кнопки" class="btn-text-input">
                    <input type="url" placeholder="URL кнопки" class="btn-url-input">
                    <button type="button" class="btn-remove">✕</button>
                </div>
            `;
            
            showToast('Рассылка отправлена успешно!', 'success');
        } else {
            throw new Error('Failed to send broadcast');
        }
    } catch (error) {
        console.error('Broadcast error:', error);
        statusDiv.textContent = 'Ошибка при отправке рассылки';
        statusDiv.className = 'status-message show error';
        showToast('Ошибка при отправке рассылки', 'error');
    }
    
    // Hide status after 5 seconds
    setTimeout(() => {
        statusDiv.classList.remove('show');
    }, 5000);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Не был в сети';
    
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Сегодня';
    } else if (diffDays === 1) {
        return 'Вчера';
    } else if (diffDays < 7) {
        return `${diffDays} дней назад`;
    } else {
        return date.toLocaleDateString('ru-RU');
    }
}
