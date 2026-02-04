let accounts = [];
let deletingId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadSavedTheme();
    loadAccounts();
    renderAccounts();
});

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('app-theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

function loadAccounts() {
    const saved = localStorage.getItem('portal-accounts');
    if (saved) {
        accounts = JSON.parse(saved);
    } else {
        accounts = [
            { id: 1, email: 'admin', password: 'admin', name: '관리자', type: 'admin' },
            { id: 2, email: 'user', password: '1234', name: '사용자', type: 'user' }
        ];
        saveAccounts();
    }
}

function saveAccounts() {
    localStorage.setItem('portal-accounts', JSON.stringify(accounts));
}

function renderAccounts() {
    const adminList = document.getElementById('adminList');
    const userList = document.getElementById('userList');
    const adminCount = document.getElementById('adminCount');
    const userCount = document.getElementById('userCount');

    const admins = accounts.filter(a => a.type === 'admin');
    const users = accounts.filter(a => a.type === 'user');

    adminCount.textContent = admins.length;
    userCount.textContent = users.length;

    adminList.innerHTML = admins.length ? admins.map(a => createAccountItem(a)).join('') : createEmptyState();
    userList.innerHTML = users.length ? users.map(a => createAccountItem(a)).join('') : createEmptyState();
}

function createAccountItem(account) {
    return `
        <div class="account-item">
            <div class="account-avatar">
                <svg viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
            </div>
            <div class="account-info">
                <div class="account-name">${account.name}</div>
                <div class="account-email">${account.email}</div>
            </div>
            <div class="account-actions">
                <button class="action-btn edit-btn" onclick="openEditModal(${account.id})" title="수정">
                    <svg viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <button class="action-btn delete-btn" onclick="openDeleteModal(${account.id})" title="삭제">
                    <svg viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

function createEmptyState() {
    return `
        <div class="empty-state">
            <svg viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            <p>등록된 계정이 없습니다</p>
        </div>
    `;
}

function openAddModal() {
    document.getElementById('formTitle').textContent = '계정 추가';
    document.getElementById('editingId').value = '';
    document.getElementById('accountEmail').value = '';
    document.getElementById('accountPassword').value = '';
    document.getElementById('accountName').value = '';
    document.getElementById('accountType').value = 'user';

    showModal('addAccountContent');
}

function openEditModal(id) {
    const account = accounts.find(a => a.id === id);
    if (!account) return;

    document.getElementById('formTitle').textContent = '계정 수정';
    document.getElementById('editingId').value = id;
    document.getElementById('accountEmail').value = account.email;
    document.getElementById('accountPassword').value = account.password;
    document.getElementById('accountName').value = account.name;
    document.getElementById('accountType').value = account.type;

    showModal('addAccountContent');
}

function saveAccount() {
    const id = document.getElementById('editingId').value;
    const email = document.getElementById('accountEmail').value.trim();
    const password = document.getElementById('accountPassword').value.trim();
    const name = document.getElementById('accountName').value.trim();
    const type = document.getElementById('accountType').value;

    if (!email || !password || !name) {
        alert('모든 필드를 입력해주세요.');
        return;
    }

    if (id) {
        const index = accounts.findIndex(a => a.id === parseInt(id));
        if (index !== -1) {
            accounts[index] = { ...accounts[index], email, password, name, type };
        }
    } else {
        const newId = accounts.length ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
        accounts.push({ id: newId, email, password, name, type });
    }

    saveAccounts();
    renderAccounts();
    closeModal();
}

function openDeleteModal(id) {
    deletingId = id;
    const account = accounts.find(a => a.id === id);
    if (account) {
        document.getElementById('deleteMsg').textContent = `"${account.name}" 계정을 삭제하시겠습니까?`;
    }
    showModal('deleteContent');
}

function confirmDelete() {
    if (deletingId) {
        accounts = accounts.filter(a => a.id !== deletingId);
        saveAccounts();
        renderAccounts();
        deletingId = null;
    }
    closeModal();
}

function showModal(contentId) {
    const modal = document.getElementById('modalOverlay');
    document.querySelectorAll('.alert-modal, .form-modal').forEach(el => el.style.display = 'none');
    modal.style.display = 'flex';
    document.getElementById(contentId).style.display = 'block';
}

function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

function logout() {
    showModal('logoutContent');
}

function confirmLogout() {
    closeModal();
    const overlay = document.getElementById('logoutOverlay');
    overlay.classList.add('active');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1800);
}