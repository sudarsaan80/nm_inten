// DOM Elements
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const mobileInput = document.getElementById('mobile');
const passwordInput = document.getElementById('password');
const registerBtn = document.getElementById('registerBtn');
const clearBtn = document.getElementById('clearBtn');
const togglePassword = document.getElementById('togglePassword');
const searchInput = document.getElementById('search');
const userTable = document.getElementById('userTable');

// Users array
let users = JSON.parse(localStorage.getItem('users')) || [];

// Initialize
function init() {
    renderUsers();
    updateUserCount();
}

// Render users
function renderUsers(filter = '') {
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase()) ||
        user.mobile.includes(filter)
    );

    userTable.innerHTML = '';

    if (filteredUsers.length === 0) {
        userTable.innerHTML = '<tr class="empty"><td colspan="5">No users found</td></tr>';
        return;
    }

    filteredUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.mobile}</td>
            <td class="actions">
                <button class="action-btn edit-btn" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="action-btn delete-btn" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;
        userTable.appendChild(row);
    });
}

// Add user
registerBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const mobile = mobileInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !email || !mobile || !password) {
        alert('Please fill all fields');
        return;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email');
        return;
    }

    if (!validateMobile(mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }

    const user = {
        id: Date.now(),
        name,
        email,
        mobile,
        password
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
    clearForm();
    alert('User added successfully!');
});

// Edit user
function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) return;

    nameInput.value = user.name;
    emailInput.value = user.email;
    mobileInput.value = user.mobile;
    passwordInput.value = user.password;

    registerBtn.innerHTML = '<i class="fas fa-save"></i> Update User';
    registerBtn.onclick = () => updateUser(id);
}

// Update user
function updateUser(id) {
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) return;

    users[userIndex] = {
        ...users[userIndex],
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        mobile: mobileInput.value.trim(),
        password: passwordInput.value.trim()
    };

    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
    clearForm();
    
    registerBtn.innerHTML = '<i class="fas fa-plus"></i> Add User';
    registerBtn.onclick = () => registerBtn.click();
    
    alert('User updated successfully!');
}

// Delete user
function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    users = users.filter(u => u.id !== id);
    localStorage.setItem('users', JSON.stringify(users));
    renderUsers();
    alert('User deleted successfully!');
}

// Clear form
clearBtn.addEventListener('click', clearForm);
function clearForm() {
    nameInput.value = '';
    emailInput.value = '';
    mobileInput.value = '';
    passwordInput.value = '';
    nameInput.focus();
    
    registerBtn.innerHTML = '<i class="fas fa-plus"></i> Add User';
    registerBtn.onclick = () => registerBtn.click();
}

// Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    togglePassword.innerHTML = type === 'password' ? 
        '<i class="fas fa-eye"></i>' : 
        '<i class="fas fa-eye-slash"></i>';
});

// Search users
searchInput.addEventListener('input', (e) => {
    renderUsers(e.target.value);
});

// Update user count
function updateUserCount() {
    const count = users.length;
    const countElement = document.querySelector('.table-header h2');
    countElement.innerHTML = `Users List <span style="font-size: 0.8em; color: #666;">(${count} users)</span>`;
}

// Validation functions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateMobile(mobile) {
    return /^[0-9]{10}$/.test(mobile);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

// Add sample data if empty
