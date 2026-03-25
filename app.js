// Configuration with Fallback (Demo Mode)
const firebaseConfig = {
  apiKey: "AIzaSy-DEMO-KEY-PLACEHOLDER",
  authDomain: "panipuan-connect.firebaseapp.com",
  projectId: "panipuan-connect",
  storageBucket: "panipuan-connect.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef"
};
let db, auth;
let isDemoMode = false;
try {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
} catch (e) {
  console.warn("Firebase initialization failed. Switching to Local Demo Mode.");
  isDemoMode = true;
}
// Application State
const state = {
    user: null,
    isMobileMenuOpen: false,
    directory: [
        { id: '1', name: 'Panipuan Health Center', category: 'Health', address: 'Main St', phone: '045-123', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400' },
        { id: '2', name: 'Liza Sari-Sari Store', category: 'Retail', address: 'Purok 3', phone: '0912-345-6789', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400' },
        { id: '3', name: 'J&J Water Refilling', category: 'Services', address: 'Purok 1', phone: '0917-555-0123', image: 'https://images.unsplash.com/photo-1548623963-8a30d1264379?w=400' },
        { id: '4', name: 'Panipuan Elementary School', category: 'Education', address: 'School Rd', phone: '045-987-6543', image: 'https://images.unsplash.com/photo-1523050335392-9bc5675309a8?w=400' }
    ],
    announcements: [
        { id: 'a1', title: 'Community Clean-up Drive', date: 'Nov 25, 2023', content: 'Join us this Saturday at 6:00 AM for our monthly barangay clean-up.', category: 'Event' },
        { id: 'a2', title: 'Free Polio Vaccination', date: 'Nov 28, 2023', content: 'The Health Center will be providing free vaccines for children aged 0-5.', category: 'Health' }
    ],
    officials: [
        { id: 'o1', name: 'Hon. Ricardo Santos', position: 'Punong Barangay', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400' },
        { id: 'o2', name: 'Hon. Elena Cruz', position: 'Barangay Kagawad', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' }
    ],
    searchQuery: '',
    filterCategory: 'All',
    showAdminModal: false,
    activeAdminTab: 'directory'
};
// UI Engine
const views = {
    home: () => `
        <div class="animate-fade-in">
            <section class="bg-gradient-hero py-24 px-4 relative">
                <div class="max-w-7xl mx-auto flex flex-col items-start gap-8 z-10 relative">
                    <span class="px-4 py-1.5 bg-sky-100 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-widest">Panipuan Connect</span>
                    <h1 class="text-5xl md:text-8xl font-black text-slate-900 leading-[1.1] tracking-tighter">Unified <br/><span class="text-sky-500">Governance</span></h1>
                    <p class="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">The official digital portal for Barangay Panipuan. Modernizing community accessibility.</p>
                    <div class="flex flex-wrap gap-4 mt-4">
                        <a href="#directory" class="px-8 py-4 bg-sky-500 text-white rounded-2xl font-bold shadow-lg shadow-sky-100 hover:-translate-y-1 transition-all">Explore Directory</a>
                        <a href="#emergency" class="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 transition-all">Emergency Help</a>
                    </div>
                </div>
            </section>
            <section class="max-w-7xl mx-auto px-4 py-24">
                <div class="flex justify-between items-end mb-12">
                    <h2 class="text-3xl font-black">Latest Updates</h2>
                    <a href="#announcements" class="text-sky-500 font-bold text-sm">View All</a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${state.announcements.map(a => `
                        <div class="p-8 bg-white rounded-3xl border border-slate-100 shadow-soft hover:shadow-xl transition-all">
                            <span class="text-[10px] font-black text-sky-500 uppercase tracking-widest">${a.category}</span>
                            <h3 class="text-xl font-bold mt-4 mb-2">${a.title}</h3>
                            <p class="text-slate-500 text-sm leading-relaxed mb-6">${a.content}</p>
                            <span class="text-xs text-slate-300">${a.date}</span>
                        </div>
                    `).join('')}
                </div>
            </section>
        </div>
    `,
    directory: () => `
        <div class="max-w-7xl mx-auto px-4 py-20 animate-fade-in">
            <h1 class="text-4xl font-black mb-12">Local Directory</h1>
            <div class="flex flex-col md:flex-row gap-4 mb-12">
                <div class="relative flex-grow">
                    <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></i>
                    <input type="text" id="dir-search" placeholder="Search businesses..." class="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none" value="${state.searchQuery}">
                </div>
                <select id="dir-filter" class="px-6 py-4 bg-white border border-slate-100 rounded-2xl font-bold">
                    <option value="All">All Categories</option>
                    <option value="Health" ${state.filterCategory === 'Health' ? 'selected' : ''}>Health</option>
                    <option value="Retail" ${state.filterCategory === 'Retail' ? 'selected' : ''}>Retail</option>
                    <option value="Services" ${state.filterCategory === 'Services' ? 'selected' : ''}>Services</option>
                </select>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                ${state.directory
                    .filter(i => (state.filterCategory === 'All' || i.category === state.filterCategory) && i.name.toLowerCase().includes(state.searchQuery.toLowerCase()))
                    .map(i => `
                    <div class="bg-white rounded-[2rem] overflow-hidden border border-slate-50 shadow-soft group">
                        <div class="aspect-square relative overflow-hidden bg-slate-100">
                            <img src="${i.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                        </div>
                        <div class="p-6">
                            <span class="text-[9px] font-black text-sky-500 uppercase">${i.category}</span>
                            <h3 class="text-lg font-bold mt-1">${i.name}</h3>
                            <p class="text-xs text-slate-400 mt-2 mb-4"><i data-lucide="map-pin" class="w-3 h-3 inline mr-1"></i>${i.address}</p>
                            <a href="tel:${i.phone}" class="flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-xl text-xs font-bold hover:bg-sky-500 hover:text-white transition-all">
                                <i data-lucide="phone" class="w-4 h-4"></i> ${i.phone}
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    officials: () => `
        <div class="max-w-7xl mx-auto px-4 py-20 animate-fade-in text-center">
            <h1 class="text-4xl font-black mb-16">Barangay Council</h1>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                ${state.officials.map(o => `
                    <div class="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-soft">
                        <img src="${o.image}" class="w-40 h-40 mx-auto rounded-full object-cover border-8 border-slate-50 shadow-inner mb-6">
                        <h3 class="text-2xl font-bold">${o.name}</h3>
                        <p class="text-sky-500 font-black uppercase text-[10px] mt-2 tracking-widest">${o.position}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    emergency: () => `
        <div class="max-w-3xl mx-auto px-4 py-20 animate-fade-in text-center">
            <div class="p-12 bg-rose-600 rounded-[3rem] text-white shadow-2xl mb-8">
                <i data-lucide="shield-alert" class="w-16 h-16 mx-auto mb-6"></i>
                <h2 class="text-6xl font-black mb-2 tracking-tighter">911</h2>
                <p class="text-rose-100 font-bold opacity-80 mb-10 uppercase tracking-widest text-xs">National Emergency Line</p>
                <a href="tel:911" class="block w-full py-5 bg-white text-rose-600 rounded-2xl font-black shadow-lg">Immediate Call</a>
            </div>
            <div class="p-12 bg-slate-900 rounded-[3rem] text-white">
                <h3 class="text-3xl font-black mb-2 tracking-tighter">045-123-4567</h3>
                <p class="text-slate-500 font-bold text-xs uppercase tracking-widest mb-8">Barangay Response Center</p>
                <a href="tel:0451234567" class="block w-full py-5 bg-sky-500 text-white rounded-2xl font-black">Call Local Dispatch</a>
            </div>
        </div>
    `,
    login: () => `
        <div class="max-w-md mx-auto py-32 px-4 animate-fade-in">
            <div class="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl">
                <h1 class="text-3xl font-black mb-8">Staff Portal</h1>
                <form id="login-form" class="space-y-6">
                    <input type="email" id="email" required placeholder="Staff Email" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-sky-500">
                    <input type="password" id="password" required placeholder="Security Password" class="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-sky-500">
                    <button type="submit" class="w-full py-5 bg-sky-500 text-white rounded-2xl font-black shadow-lg">Authenticate</button>
                </form>
            </div>
        </div>
    `,
    admin: () => {
        if (!state.user) return `<div class="py-32 text-center"><p class="text-slate-400 mb-8">Session restricted.</p><a href="#login" class="px-8 py-4 bg-sky-500 text-white rounded-2xl font-bold">Sign In</a></div>`;
        return `
        <div class="max-w-7xl mx-auto px-4 py-20 animate-fade-in">
            <header class="flex justify-between items-center mb-16">
                <h1 class="text-4xl font-black">Management Hub</h1>
                <button id="btn-show-modal" class="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">+ New Record</button>
            </header>
            <div class="flex gap-4 mb-8">
                ${['directory', 'announcements', 'officials'].map(t => `
                    <button onclick="setAdminTab('${t}')" class="px-6 py-3 rounded-xl text-sm font-bold transition-all ${state.activeAdminTab === t ? 'bg-sky-500 text-white shadow-lg' : 'bg-white border text-slate-400'}">${t.charAt(0).toUpperCase() + t.slice(1)}</button>
                `).join('')}
            </div>
            ${state.showAdminModal ? `
                <div class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
                    <div class="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl">
                        <h2 class="text-2xl font-black mb-8">Add to ${state.activeAdminTab}</h2>
                        <form id="add-item-form" class="space-y-4">
                            <input type="text" id="item-name" placeholder="${state.activeAdminTab === 'announcements' ? 'Title' : 'Name'}" required class="w-full px-6 py-4 bg-slate-50 border rounded-2xl outline-none">
                            <input type="text" id="item-category" placeholder="${state.activeAdminTab === 'officials' ? 'Position' : 'Category'}" required class="w-full px-6 py-4 bg-slate-50 border rounded-2xl outline-none">
                            <textarea id="item-address" placeholder="Details/Address" class="w-full px-6 py-4 bg-slate-50 border rounded-2xl outline-none"></textarea>
                            <div class="flex gap-4 pt-4">
                                <button type="button" id="btn-close-modal" class="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button>
                                <button type="submit" class="flex-1 py-4 bg-sky-500 text-white rounded-2xl font-black">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            ` : ''}
            <div class="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
                <table class="w-full text-left">
                    <tbody class="divide-y">
                        ${state[state.activeAdminTab].map(i => `
                            <tr>
                                <td class="px-8 py-6 font-bold text-slate-900">${i.name || i.title}</td>
                                <td class="px-8 py-6 text-sm text-slate-400">${i.category || i.position}</td>
                                <td class="px-8 py-6 text-right">
                                    <button class="p-2 text-rose-500" onclick="deleteEntry('${i.id}', '${state.activeAdminTab}')"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
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
// State Modifiers
window.setAdminTab = (tab) => { state.activeAdminTab = tab; render(); };
window.deleteEntry = (id, tab) => { state[tab] = state[tab].filter(i => i.id !== id); render(); showToast('Entry deleted'); };
window.toggleMobileMenu = () => { state.isMobileMenuOpen = !state.isMobileMenuOpen; document.getElementById('mobile-menu').classList.toggle('hidden'); };
function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl z-[200] animate-fade-in';
    t.innerText = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}
// Router
function render() {
    const hash = window.location.hash.substring(1) || 'home';
    const appRoot = document.getElementById('app-root');
    appRoot.innerHTML = (views[hash] || views.home)();
    window.scrollTo(0, 0);
    lucide.createIcons();
    // Auth logic
    if (hash === 'login') {
        document.getElementById('login-form').onsubmit = (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            if (isDemoMode) {
              state.user = { email };
              window.location.hash = 'admin';
              showToast('Demo Access Granted');
            } else {
              auth.signInAnonymously().then(() => { state.user = { email }; window.location.hash = 'admin'; });
            }
        };
    }
    if (hash === 'directory') {
        const searchInput = document.getElementById('dir-search');
        searchInput.oninput = (e) => {
            state.searchQuery = e.target.value;
            render();
            document.getElementById('dir-search').focus();
            document.getElementById('dir-search').setSelectionRange(state.searchQuery.length, state.searchQuery.length);
        };
        document.getElementById('dir-filter').onchange = (e) => { state.filterCategory = e.target.value; render(); };
    }
    if (hash === 'admin' && state.user) {
        document.getElementById('btn-show-modal').onclick = () => { state.showAdminModal = true; render(); };
        document.getElementById('btn-close-modal').onclick = () => { state.showAdminModal = false; render(); };
        document.getElementById('add-item-form').onsubmit = (e) => {
            e.preventDefault();
            const n = {
                id: Date.now().toString(),
                name: document.getElementById('item-name').value,
                title: document.getElementById('item-name').value,
                category: document.getElementById('item-category').value,
                position: document.getElementById('item-category').value,
                address: document.getElementById('item-address').value,
                date: 'Nov 2023',
                image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=400'
            };
            state[state.activeAdminTab].unshift(n);
            state.showAdminModal = false;
            render();
            showToast('Saved successfully');
        };
    }
}
// Global Observers
if (auth) {
  auth.onAuthStateChanged(user => {
      state.user = user ? { email: user.email || 'Admin' } : null;
      const nav = document.getElementById('nav-auth');
      nav.innerHTML = user || state.user ? 
          `<button onclick="state.user=null;window.location.hash='home';showToast('Logged Out');" class="text-xs font-black text-rose-500">Sign Out</button>` : 
          `<a href="#login" class="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black">Login</a>`;
  });
}
window.addEventListener('hashchange', render);
document.getElementById('year').textContent = new Date().getFullYear();
render();
const loader = document.getElementById('global-loader');
if (loader) { loader.classList.add('opacity-0'); setTimeout(() => loader.remove(), 600); }