const firebaseConfig = {
  apiKey: "AIzaSy-PLACEHOLDER-KEY",
  authDomain: "panipuan-connect.firebaseapp.com",
  projectId: "panipuan-connect",
  storageBucket: "panipuan-connect.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const state = {
    user: null,
    role: 'guest',
    directory: [
        { id: '1', name: 'Panipuan Health Center', category: 'Health', address: 'Main St', phone: '045-123', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400' },
        { id: '2', name: 'Liza Sari-Sari', category: 'Retail', address: 'Purok 3', phone: '0912-345', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400' }
    ],
    announcements: [
        { id: 'a1', title: 'Clean-up Drive', date: '2023-11-25', content: 'Saturday 6AM.', category: 'Event' },
        { id: 'a2', title: 'Free Vaccines', date: '2023-11-28', content: 'Health Center.', category: 'Health' }
    ],
    officials: [
        { id: 'o1', name: 'Hon. Ricardo Santos', position: 'Punong Barangay', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400' }
    ],
    searchQuery: '',
    filterCategory: 'All',
    showAdminModal: false
};
const views = {
    home: () => `
        <div class="animate-fade-in">
            <section class="bg-gradient-hero py-20 px-4">
                <div class="max-w-7xl mx-auto flex flex-col items-start gap-8">
                    <span class="px-4 py-1.5 bg-sky-100 text-sky-600 rounded-full text-xs font-bold uppercase tracking-wider">Official Portal</span>
                    <h1 class="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">Welcome to <span class="text-sky-500">Panipuan</span></h1>
                    <p class="text-xl text-slate-600 max-w-2xl">Access essential services and community information at your fingertips.</p>
                    <div class="flex gap-4">
                        <a href="#directory" class="px-8 py-4 bg-sky-500 text-white rounded-xl font-bold shadow-lg hover:bg-sky-600 transition-all">Explore Directory</a>
                        <a href="#emergency" class="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all">Emergency Contacts</a>
                    </div>
                </div>
            </section>
            <section class="max-w-7xl mx-auto px-4 py-20">
                <h2 class="text-3xl font-bold mb-12">Latest Community Updates</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${state.announcements.map(a => `
                        <div class="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <span class="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-bold uppercase mb-4 inline-block">${a.category}</span>
                            <h3 class="text-xl font-bold mb-2">${a.title}</h3>
                            <p class="text-slate-500 text-sm mb-4">${a.content}</p>
                            <span class="text-xs text-slate-400">${a.date}</span>
                        </div>
                    `).join('')}
                </div>
            </section>
        </div>
    `,
    directory: () => `
        <div class="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
            <header class="mb-12">
                <h1 class="text-4xl font-black mb-4">Local Directory</h1>
                <p class="text-slate-500">Verified local businesses and skilled professionals.</p>
            </header>
            <div class="flex flex-col md:flex-row gap-4 mb-12">
                <input type="text" id="dir-search" placeholder="Search businesses..." class="flex-grow px-6 py-4 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-500" value="${state.searchQuery}">
                <select id="dir-filter" class="px-6 py-4 bg-white border border-slate-200 rounded-xl outline-none">
                    <option value="All" ${state.filterCategory === 'All' ? 'selected' : ''}>All Categories</option>
                    <option value="Health" ${state.filterCategory === 'Health' ? 'selected' : ''}>Health</option>
                    <option value="Retail" ${state.filterCategory === 'Retail' ? 'selected' : ''}>Retail</option>
                    <option value="Services" ${state.filterCategory === 'Services' ? 'selected' : ''}>Services</option>
                </select>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${state.directory
                    .filter(i => (state.filterCategory === 'All' || i.category === state.filterCategory) && i.name.toLowerCase().includes(state.searchQuery.toLowerCase()))
                    .map(i => `
                    <div class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                        <img src="${i.image}" class="w-full h-48 object-cover">
                        <div class="p-6">
                            <h3 class="text-xl font-bold mb-2">${i.name}</h3>
                            <p class="text-sm text-slate-500 mb-4">${i.category} • ${i.address}</p>
                            <a href="tel:${i.phone}" class="text-sky-600 font-bold text-sm flex items-center gap-2">
                                <i data-lucide="phone" class="w-4 h-4"></i> ${i.phone}
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    officials: () => `
        <div class="max-w-7xl mx-auto px-4 py-16 animate-fade-in">
            <h1 class="text-4xl font-black mb-16 text-center">Barangay Governance</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                ${state.officials.map(o => `
                    <div class="text-center">
                        <div class="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl mb-6">
                            <img src="${o.image}" class="w-full h-full object-cover">
                        </div>
                        <h3 class="text-xl font-bold">${o.name}</h3>
                        <p class="text-sky-600 font-bold uppercase text-xs mt-2">${o.position}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    emergency: () => `
        <div class="max-w-7xl mx-auto px-4 py-20 animate-fade-in text-center">
            <h1 class="text-5xl font-black mb-6">Emergency Hotlines</h1>
            <p class="text-slate-500 mb-16 max-w-xl mx-auto">Available 24/7 for the residents of Panipuan.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div class="p-10 bg-rose-600 rounded-3xl text-white shadow-xl">
                    <h3 class="text-3xl font-black mb-2">911</h3>
                    <p class="mb-8 opacity-80">National Emergency</p>
                    <a href="tel:911" class="block w-full py-4 bg-white text-rose-600 rounded-xl font-bold">Call Now</a>
                </div>
                <div class="p-10 bg-slate-900 rounded-3xl text-white shadow-xl">
                    <h3 class="text-3xl font-black mb-2">045-123-4567</h3>
                    <p class="mb-8 opacity-80">Barangay Hall Direct</p>
                    <a href="tel:0451234567" class="block w-full py-4 bg-sky-500 text-white rounded-xl font-bold">Call Hall</a>
                </div>
            </div>
        </div>
    `,
    login: () => `
        <div class="max-w-md mx-auto py-24 px-4 animate-fade-in">
            <div class="bg-white p-10 rounded-3xl border border-slate-100 shadow-2xl">
                <h1 class="text-3xl font-black mb-8">Sign In</h1>
                <form id="login-form" class="space-y-6">
                    <div>
                        <label class="block text-sm font-bold mb-2">Email</label>
                        <input type="email" id="email" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="admin@panipuan.gov.ph">
                    </div>
                    <div>
                        <label class="block text-sm font-bold mb-2">Password</label>
                        <input type="password" id="password" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="••••••••">
                    </div>
                    <button type="submit" class="w-full py-4 bg-sky-500 text-white rounded-xl font-black shadow-lg">Authenticate</button>
                    <p class="text-center text-sm text-slate-500">New resident? <a href="#register" class="text-sky-500 font-bold">Register here</a></p>
                </form>
            </div>
        </div>
    `,
    register: () => `
        <div class="max-w-md mx-auto py-24 px-4 animate-fade-in">
            <div class="bg-white p-10 rounded-3xl border border-slate-100 shadow-2xl">
                <h1 class="text-3xl font-black mb-8">Resident Registration</h1>
                <form id="register-form" class="space-y-6">
                    <div>
                        <label class="block text-sm font-bold mb-2">Full Name</label>
                        <input type="text" id="reg-name" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Juan Dela Cruz">
                    </div>
                    <div>
                        <label class="block text-sm font-bold mb-2">Email Address</label>
                        <input type="email" id="reg-email" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="juan@email.com">
                    </div>
                    <div>
                        <label class="block text-sm font-bold mb-2">Address / Purok</label>
                        <input type="text" id="reg-address" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Purok 1, Panipuan">
                    </div>
                    <button type="submit" class="w-full py-4 bg-emerald-500 text-white rounded-xl font-black shadow-lg">Create Account</button>
                    <p class="text-center text-sm text-slate-500">Already registered? <a href="#login" class="text-sky-500 font-bold">Sign In</a></p>
                </form>
            </div>
        </div>
    `,
    admin: () => {
        if (!state.user) return `<div class="py-24 text-center"><p class="text-slate-500">Access Denied. Please login.</p><a href="#login" class="text-sky-500 font-bold">Go to Login</a></div>`;
        return `
        <div class="max-w-7xl mx-auto px-4 py-12 animate-fade-in">
            <div class="flex justify-between items-center mb-12">
                <h1 class="text-3xl font-black">Admin Dashboard</h1>
                <button id="btn-show-modal" class="px-6 py-2 bg-sky-500 text-white rounded-lg font-bold">Add Directory Item</button>
            </div>
            ${state.showAdminModal ? `
                <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div class="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-scale-in">
                        <h2 class="text-2xl font-black mb-6">New Directory Item</h2>
                        <form id="add-item-form" class="space-y-4">
                            <input type="text" id="item-name" placeholder="Business Name" required class="w-full p-3 bg-slate-50 border rounded-xl">
                            <select id="item-category" class="w-full p-3 bg-slate-50 border rounded-xl">
                                <option>Retail</option>
                                <option>Health</option>
                                <option>Services</option>
                            </select>
                            <input type="text" id="item-address" placeholder="Address" required class="w-full p-3 bg-slate-50 border rounded-xl">
                            <input type="text" id="item-phone" placeholder="Phone" required class="w-full p-3 bg-slate-50 border rounded-xl">
                            <div class="flex gap-4 pt-4">
                                <button type="button" id="btn-close-modal" class="flex-1 py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
                                <button type="submit" class="flex-1 py-3 bg-sky-500 text-white rounded-xl font-bold">Save Item</button>
                            </div>
                        </form>
                    </div>
                </div>
            ` : ''}
            <div class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <table class="w-full text-left">
                    <thead class="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th class="px-6 py-4 font-bold text-sm">Name</th>
                            <th class="px-6 py-4 font-bold text-sm">Category</th>
                            <th class="px-6 py-4 font-bold text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.directory.map(i => `
                            <tr class="border-b border-slate-50">
                                <td class="px-6 py-4 font-medium">${i.name}</td>
                                <td class="px-6 py-4"><span class="px-2 py-1 bg-sky-50 text-sky-600 rounded-md text-xs font-bold uppercase">${i.category}</span></td>
                                <td class="px-6 py-4 text-right">
                                    <button class="text-rose-500 text-sm font-bold hover:underline" onclick="deleteItem('${i.id}')">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    }
};
window.deleteItem = (id) => {
    state.directory = state.directory.filter(i => i.id !== id);
    router();
};
function router() {
    const hash = window.location.hash.substring(1) || 'home';
    const appRoot = document.getElementById('app-root');
    const viewFn = views[hash] || (() => `<div class="py-24 text-center text-slate-400">View Not Found</div>`);
    appRoot.innerHTML = viewFn();
    window.scrollTo(0, 0);
    lucide.createIcons();
    if (hash === 'login') {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            auth.signInAnonymously().then(() => {
                state.user = { email: document.getElementById('email').value };
                window.location.hash = 'admin';
            });
        });
    }
    if (hash === 'register') {
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Registration request sent to Barangay Secretary!');
            window.location.hash = 'home';
        });
    }
    if (hash === 'directory') {
        const searchInput = document.getElementById('dir-search');
        const filterSelect = document.getElementById('dir-filter');
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            // Debounced render or immediate for vanilla
            const results = views.directory();
            appRoot.innerHTML = results;
            lucide.createIcons();
            // Refocus search input
            document.getElementById('dir-search').focus();
        });
        filterSelect.addEventListener('change', (e) => {
            state.filterCategory = e.target.value;
            router();
        });
    }
    if (hash === 'admin' && state.user) {
        document.getElementById('btn-show-modal')?.addEventListener('click', () => {
            state.showAdminModal = true;
            router();
        });
        document.getElementById('btn-close-modal')?.addEventListener('click', () => {
            state.showAdminModal = false;
            router();
        });
        document.getElementById('add-item-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const newItem = {
                id: Date.now().toString(),
                name: document.getElementById('item-name').value,
                category: document.getElementById('item-category').value,
                address: document.getElementById('item-address').value,
                phone: document.getElementById('item-phone').value,
                image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=400'
            };
            state.directory.unshift(newItem);
            state.showAdminModal = false;
            router();
        });
    }
}
auth.onAuthStateChanged(user => {
    state.user = user;
    const navAuth = document.getElementById('nav-auth');
    if (user) {
        navAuth.innerHTML = `
            <div class="flex items-center gap-4">
                <a href="#admin" class="text-sm font-bold text-sky-600">Admin</a>
                <button onclick="firebase.auth().signOut()" class="text-slate-400 hover:text-rose-500"><i data-lucide="log-out" class="w-5 h-5"></i></button>
            </div>
        `;
    } else {
        navAuth.innerHTML = `
            <div class="flex items-center gap-4">
                <a href="#login" class="text-sm font-bold text-slate-500 hover:text-sky-600">Sign In</a>
                <a href="#register" class="text-sm font-bold text-white bg-sky-500 px-4 py-2 rounded-lg hover:bg-sky-600">Register</a>
            </div>
        `;
    }
    lucide.createIcons();
});
window.addEventListener('hashchange', router);
document.getElementById('year').textContent = new Date().getFullYear();
router();