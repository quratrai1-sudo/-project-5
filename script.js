document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initValidation();
    initScrollToTop();
    initNavigation();
});

/* ==========================================================================
   1. PAGE NAVIGATION & HAMBURGER MENU
   ========================================================================== */
function switchPage(pageId) {
    const pages = document.querySelectorAll('.page-section');
    const navItems = document.querySelectorAll('.nav-item');

    pages.forEach(page => page.classList.remove('active-page'));
    navItems.forEach(item => item.classList.remove('active'));

    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active-page');
    }

    const activeNav = document.querySelector(`.nav-item[href="#${pageId}"]`);
    if (activeNav) activeNav.classList.add('active');

    document.getElementById('nav-links').classList.remove('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
}

/* ==========================================================================
   2. LIGHT / DARK MODE TOGGLE
   ========================================================================== */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'light';

    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

/* ==========================================================================
   3. LOGIN & PASSWORD VALIDATION
   ========================================================================== */
function initValidation() {
    const emailInput = document.getElementById('email');
    const pwdInput = document.getElementById('password');
    const togglePwd = document.getElementById('toggle-password');

    togglePwd.addEventListener('click', () => {
        const type = pwdInput.getAttribute('type') === 'password' ? 'text' : 'password';
        pwdInput.setAttribute('type', type);
        togglePwd.classList.toggle('fa-eye-slash');
    });

    // Email Check
    emailInput.addEventListener('input', () => {
        const val = emailInput.value.trim();
        const emailErr = document.getElementById('email-error');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (val.length > 0 && !emailRegex.test(val) && !val.includes('2024')) {
            emailErr.textContent = 'Please enter a valid Gmail or Student ID format.';
        } else {
            emailErr.textContent = '';
        }
    });

    // Password Check
    pwdInput.addEventListener('input', () => {
        const val = pwdInput.value;
        const hasLength = val.length >= 8;
        const hasNumber = /\d/.test(val);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(val);

        updateRequirement('req-length', hasLength);
        updateRequirement('req-num', hasNumber);
        updateRequirement('req-spec', hasSpecial);

        let score = 0;
        if (hasLength) score++;
        if (hasNumber) score++;
        if (hasSpecial) score++;

        const bar = document.getElementById('strength-bar');
        if (score === 1) {
            bar.style.width = '33%';
            bar.style.backgroundColor = '#e63946';
        } else if (score === 2) {
            bar.style.width = '66%';
            bar.style.backgroundColor = '#ffb703';
        } else if (score === 3) {
            bar.style.width = '100%';
            bar.style.backgroundColor = '#2ec4b6';
        } else {
            bar.style.width = '0%';
        }
    });
}

function updateRequirement(elementId, isValid) {
    const el = document.getElementById(elementId);
    const icon = el.querySelector('i');
    if (isValid) {
        el.classList.add('valid');
        icon.className = 'fa-solid fa-circle-check';
    } else {
        el.classList.remove('valid');
        icon.className = 'fa-solid fa-circle-xmark';
    }
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email) {
        document.getElementById('email-error').textContent = 'Email or Username is required.';
        return;
    }

    if (password.length < 8) {
        document.getElementById('password-error').textContent = 'Password must be at least 8 characters.';
        return;
    }

    alert('Login Successful! Welcome to Minhaj University Portal.');
    document.getElementById('logout-btn').style.display = 'block';
    switchPage('dashboard');
}

function logout() {
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('login-form').reset();
    switchPage('login');
}

function showPasswordReminder() {
    alert('Password Requirement Rules:\n\n1. At least 8 characters long\n2. At least 1 number (0-9)\n3. At least 1 special character (@, #, $, etc.)');
}

/* ==========================================================================
   4. DYNAMIC COURSE LOADER & ASSIGNMENT UPLOADER
   ========================================================================== */
function openCourseDetails(code, title, teacher, email) {
    document.getElementById('active-course-code').textContent = `${code} - ${title}`;
    document.getElementById('info-course-title').textContent = `${code} - ${title}`;
    document.getElementById('active-teacher-name').textContent = teacher;
    document.getElementById('active-teacher-email').textContent = `Email: ${email}`;
    switchPage('courses');
}

function showFileName(input) {
    const fileName = input.files[0] ? input.files[0].name : "No file chosen";
    document.getElementById('selected-file-name').textContent = `Selected: ${fileName}`;
}

function handleAssignmentUpload(e) {
    e.preventDefault();
    const fileInput = document.getElementById('assignment-file');
    if (fileInput.files.length > 0) {
        alert(`Success! File "${fileInput.files[0].name}" uploaded successfully.`);
        fileInput.value = "";
        document.getElementById('selected-file-name').textContent = "No file chosen";
    }
}

function openTab(evt, tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}

function toggleAccordion(header) {
    const body = header.nextElementSibling;
    const isVisible = body.style.display === 'block';
    document.querySelectorAll('.accordion-body').forEach(b => b.style.display = 'none');
    if (!isVisible) body.style.display = 'block';
}

function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        scrollTopBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
