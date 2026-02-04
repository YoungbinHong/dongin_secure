(function() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('from') === 'logout') {
        document.querySelector('.wave-wrapper').classList.add('from-logout');
        document.querySelector('.login-wrapper').classList.add('from-logout');
        history.replaceState(null, '', 'login.html');
    }
})();

function checkLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.querySelector('button');

    const accounts = JSON.parse(localStorage.getItem('portal-accounts') || '[]');
    let account = accounts.find(a => a.email === email && a.password === password);

    if (!account && email === 'user' && password === '1234') {
        account = { type: 'user' };
    }
    if (!account && email === 'admin' && password === '1234') {
        account = { type: 'admin' };
    }

    if (account) {
        const errorBox = document.getElementById('errorBox');
        errorBox.classList.remove('show');
        btn.classList.add('loading');

        const targetPage = account.type === 'admin' ? 'management.html' : 'menu.html';

        setTimeout(() => {
            btn.classList.remove('loading');
            btn.classList.add('success-btn');

            setTimeout(() => {
                document.querySelector('.wave-wrapper').classList.add('success');
                document.querySelector('.login-wrapper').classList.add('success');

                setTimeout(() => {
                    window.location.href = targetPage;
                }, 1000);
            }, 1000);
        }, 800);
    } else {
        const errorBox = document.getElementById('errorBox');
        errorBox.classList.remove('show');
        void errorBox.offsetWidth;
        errorBox.classList.add('show');
    }
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        document.getElementById('errorBox').classList.remove('show');
    });
});

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkLogin();
    }
});
