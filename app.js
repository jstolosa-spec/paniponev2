const firebaseConfig = {
  apiKey: "AIzaSy-PLACEHOLDER-KEY",
  authDomain: "panipuan-connect.firebaseapp.com",
  projectId: "panipuan-connect",
  storageBucket: "panipuan-connect.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
// Application State
const state = {
    user: null,
    role: 'guest',
    directory: [
        { id: '1', name: 'Panipuan Health Center', category: 'Health', address: 'Main St', phone: '045-123', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400' },
        { id: '2', name: 'Liza Sari-Sari Store', category: 'Retail', address: 'Purok 3', phone: '0912-345-6789', image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400' },
        { id: '3', name: 'J&J Water Refilling', category: 'Services', address: 'Purok 1', phone: '0917-555-0123', image: 'https://images.unsplash.com/photo-1548623963-8a30d1264379?w=400' },
        { id: '4', name: 'Panipuan Elementary School', category: 'Education', address: 'School Rd', phone: '045-987-6543', image: 'https://images.unsplash.com/photo-1523050335392-9bc5675309a8?w=400' }
    ],
    announcements: [
        { id: 'a1', title: 'Community Clean-up Drive', date: 'Nov 25, 2023', content: 'Join us this Saturday at 6:00 AM for our monthly barangay clean-up. Meet at the Plaza.', category: 'Event' },
        { id: 'a2', title: 'Free Polio Vaccination', date: 'Nov 28, 2023', content: 'The Health Center will be providing free vaccines for children aged 0-5. Please bring your health cards.', category: 'Health' },
        { id: 'a3', title: 'Barangay General Assembly', date: 'Dec 05, 2023', content: 'Discussing budget allocation for 2024. All heads of households are invited.', category: 'Governance' }
    ],
    officials: [
        { id: 'o1', name: 'Hon. Ricardo Santos', position: 'Punong Barangay', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400' },
        { id: 'o2', name: 'Hon. Elena Cruz', position: 'Barangay Kagawad', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400' },
        { id: 'o3', name: 'Hon. Mark Villanueva', position: 'Barangay Kagawad', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' }
    ],
    searchQuery: '',
    filterCategory: 'All',
    showAdminModal: false,
    activeAdminTab: 'directory'
};
// UI Templates
const views = {
    home: () => `
        <div class="animate-fade-in">
            <section class="bg-gradient-hero py-24 px-4 overflow-hidden relative">
                <div class="max-w-7xl mx-auto flex flex-col items-start gap-8 z-10 relative">
                    <span class="px-4 py-1.5 bg-sky-100 text-sky-600 rounded-full text-xs font-bold uppercase tracking-wider">Official Barangay Information System</span>
                    <h1 class="text-5xl md:text-8xl font-black text-slate-900 leading-[1.1] tracking-tighter">Connected <br/><span class="text-sky-500">Panipuan</span></h1>
                    <p class="text-xl text-slate-600 max-w-2xl leading-relaxed">The unified digital hub for residents of Barangay Panipuan. Access directory listings, official announcements, and emergency services instantly.</p>
                    <div class="flex flex-wrap gap-4 mt-4">
                        <a href="#directory" class="px-8 py-4 bg-sky-500 text-white rounded-2xl font-bold shadow-xl shadow-sky-200 hover:bg-sky-600 hover:-translate-y-1 transition-all">Local Directory</a>
                        <a href="#emergency" class="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-50 hover:-translate-y-1 transition-all">Emergency Contacts</a>
                    </div>
                </div>
            </section>
            <section class="max-w-7xl mx-auto px-4 py-24">
                <div class="flex justify-between items-end mb-16">
                    <div>
                        <h2 class="text-3xl font-black text-slate-900 mb-2">Community Updates</h2>
                        <p class="text-slate-500">Latest news and alerts from the Barangay Hall</p>
                    </div>
                    <a href="#announcements" class="text-sky-600 font-bold hover:underline">View All</a>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    ${state.announcements.map(a => `
                        <div class="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-soft hover:shadow-lg transition-all group">
                            <span class="px-3 py-1 bg-sky-50 text-sky-600 rounded-full text-[10px] font-bold uppercase mb-6 inline-block">${a.category}</span>
                            <h3 class="text-xl font-bold mb-4 group-hover:text-sky-600 transition-colors">${a.title}</h3>
                            <p class="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-3">${a.content}</p>
                            <div class="flex items-center justify-between pt-6 border-t border-slate-50">
                                <span class="text-xs text-slate-400 font-medium">${a.date}</span>
                                <i data-lucide="arrow-right" class="w-4 h-4 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        </div>
    `,
    directory: () => `
        <div class="max-w-7xl mx-auto px-4 py-20 animate-fade-in">
            <header class="mb-16 text-center max-w-2xl mx-auto">
                <h1 class="text-4xl font-black mb-4">Local Directory</h1>
                <p class="text-slate-500">Discover and support verified local businesses, skilled workers, and essential services within our community.</p>
            </header>
            <div class="sticky top-20 z-30 bg-slate-50/80 backdrop-blur-md py-4 mb-12">
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="relative flex-grow">
                        <i data-lucide="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"></i>
                        <input type="text" id="dir-search" placeholder="Search by name, category, or service..." class="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" value="${state.searchQuery}">
                    </div>
                    <select id="dir-filter" class="px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-700">
                        <option value="All">All Categories</option>
                        <option value="Health" ${state.filterCategory === 'Health' ? 'selected' : ''}>Health</option>
                        <option value="Retail" ${state.filterCategory === 'Retail' ? 'selected' : ''}>Retail</option>
                        <option value="Services" ${state.filterCategory === 'Services' ? 'selected' : ''}>Services</option>
                        <option value="Education" ${state.filterCategory === 'Education' ? 'selected' : ''}>Education</option>
                    </select>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                ${state.directory
                    .filter(i => (state.filterCategory === 'All' || i.category === state.filterCategory) && i.name.toLowerCase().includes(state.searchQuery.toLowerCase()))
                    .map(i => `
                    <div class="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-xl transition-all group">
                        <div class="aspect-square relative overflow-hidden">
                            <img src="${i.image}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute top-4 left-4">
                                <span class="px-3 py-1 bg-white/90 backdrop-blur-sm text-sky-600 rounded-lg text-[10px] font-bold uppercase shadow-sm">${i.category}</span>
                            </div>
                        </div>
                        <div class="p-6">
                            <h3 class="text-lg font-bold mb-1 text-slate-900">${i.name}</h3>
                            <p class="text-xs text-slate-400 mb-4 flex items-center gap-1.5"><i data-lucide="map-pin" class="w-3 h-3"></i> ${i.address}</p>
                            <a href="tel:${i.phone}" class="w-full py-3 bg-slate-50 text-slate-900 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-sky-500 hover:text-white transition-colors">
                                <i data-lucide="phone" class="w-4 h-4"></i> ${i.phone}
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    officials: () => `
        <div class="max-w-7xl mx-auto px-4 py-20 animate-fade-in">
            <h1 class="text-4xl font-black mb-4 text-center">Barangay Governance</h1>
            <p class="text-slate-500 text-center mb-20 max-w-xl mx-auto">Meet the dedicated leaders serving our community with transparency and integrity.</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                ${state.officials.map(o => `
                    <div class="text-center group">
                        <div class="w-64 h-64 mx-auto rounded-full overflow-hidden border-8 border-white shadow-xl mb-8 group-hover:scale-105 transition-all duration-500">
                            <img src="${o.image}" class="w-full h-full object-cover">
                        </div>
                        <h3 class="text-2xl font-black text-slate-900">${o.name}</h3>
                        <p class="text-sky-500 font-bold uppercase text-xs mt-3 tracking-widest">${o.position}</p>
                        <div class="flex justify-center gap-4 mt-6">
                            <button class="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-sky-500 transition-colors"><i data-lucide="mail" class="w-4 h-4"></i></button>
                            <button class="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-sky-500 transition-colors"><i data-lucide="facebook" class="w-4 h-4"></i></button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `,
    emergency: () => `
        <div class="max-w-7xl mx-auto px-4 py-20 animate-fade-in text-center">
            <div class="mb-16">
                <span class="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-xs font-bold uppercase mb-4">
                    <span class="w-2 h-2 bg-rose-600 rounded-full animate-pulse"></span> Emergency Hub
                </span>
                <h1 class="text-5xl font-black mb-4">Direct Lifelines</h1>
                <p class="text-slate-500 max-w-xl mx-auto">Immediate responders for police, fire, and medical emergencies in Panipuan.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div class="p-12 bg-rose-600 rounded-[3rem] text-white shadow-2xl shadow-rose-200 relative overflow-hidden group">
                    <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
                    <i data-lucide="alert-triangle" class="w-12 h-12 mb-6 opacity-80 mx-auto"></i>
                    <h3 class="text-4xl font-black mb-2 tracking-tighter">911</h3>
                    <p class="mb-10 text-rose-100 font-medium">National Emergency Hotline</p>
                    <a href="tel:911" class="block w-full py-5 bg-white text-rose-600 rounded-2xl font-black text-lg shadow-lg hover:bg-rose-50 transition-all">Emergency Call</a>
                </div>
                <div class="p-12 bg-slate-900 rounded-[3rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden group">
                    <i data-lucide="landmark" class="w-12 h-12 mb-6 opacity-50 mx-auto"></i>
                    <h3 class="text-4xl font-black mb-2 tracking-tighter">045-123-4567</h3>
                    <p class="mb-10 text-slate-400 font-medium">Barangay Hall Response Team</p>
                    <a href="tel:0451234567" class="block w-full py-5 bg-sky-500 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-sky-600 transition-all">Call Dispatch</a>
                </div>
            </div>
            <div class="mt-20 p-8 bg-sky-50 border border-sky-100 rounded-3xl inline-flex items-center gap-6 max-w-2xl mx-auto text-left">
                <div class="w-12 h-12 bg-sky-500 text-white rounded-2xl flex items-center justify-center shrink-0">
                    <i data-lucide="info" class="w-6 h-6"></i>
                </div>
                <p class="text-sm text-sky-800 leading-relaxed font-medium">For non-emergency inquiries or barangay clearances, please visit the Barangay Hall during office hours (Mon-Fri, 8AM - 5PM).</p>
            </div>
        </div>
    `,
    login: () => `
        <div class="max-w-md mx-auto py-32 px-4 animate-fade-in">
            <div class="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200">
                <h1 class="text-4xl font-black mb-2">Staff Login</h1>
                <p class="text-slate-400 mb-10 text-sm">Authorized personnel access only</p>
                <form id="login-form" class="space-y-6">
                    <div class="space-y-2">
                        <label class="text-xs font-black uppercase text-slate-400 ml-1">Email Address</label>
                        <input type="email" id="email" required class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none" placeholder="staff@panipuan.gov">
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-black uppercase text-slate-400 ml-1">Secure Password</label>
                        <input type="password" id="password" required class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all outline-none" placeholder="••••••••">
                    </div>
                    <button type="submit" class="w-full py-5 bg-sky-500 text-white rounded-2xl font-black shadow-xl shadow-sky-100 hover:bg-sky-600 transition-all">Unlock Dashboard</button>
                    <p class="text-center text-sm text-slate-500">New resident? <a href="#register" class="text-sky-500 font-bold">Registration Portal</a></p>
                </form>
            </div>
        </div>
    `,
    register: () => `
        <div class="max-w-xl mx-auto py-24 px-4 animate-fade-in">
            <div class="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200">
                <div class="text-center mb-10">
                    <h1 class="text-3xl font-black mb-2">Resident Enrollment</h1>
                    <p class="text-slate-400">Join the official digital community database</p>
                </div>
                <form id="register-form" class="space-y-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-xs font-black uppercase text-slate-400 ml-1">Full Name</label>
                            <input type="text" id="reg-name" required class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="Juan Dela Cruz">
                        </div>
                        <div class="space-y-2">
                            <label class="text-xs font-black uppercase text-slate-400 ml-1">Voters ID (Optional)</label>
                            <input type="text" id="reg-voters" class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="XXX-XXXX">
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-black uppercase text-slate-400 ml-1">Purok / Area</label>
                        <select class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none">
                            <option>Purok 1</option><option>Purok 2</option><option>Purok 3</option><option>Purok 4</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-black uppercase text-slate-400 ml-1">Email Contact</label>
                        <input type="email" id="reg-email" required class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="juan@email.com">
                    </div>
                    <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                        By registering, you agree to the Barangay Data Privacy Policy. Your information will only be used for official community services.
                    </div>
                    <button type="submit" class="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all">Submit Registration</button>
                    <p class="text-center text-sm text-slate-500">Authorized personnel? <a href="#login" class="text-sky-500 font-bold">Sign In</a></p>
                </form>
            </div>
        </div>
    `,
    admin: () => {
        if (!state.user) return `<div class="py-32 text-center"><p class="text-slate-400 mb-8">Unauthorized access attempt detected.</p><a href="#login" class="px-8 py-4 bg-sky-500 text-white rounded-2xl font-bold">Back to Login</a></div>`;
        return `
        <div class="max-w-7xl mx-auto px-4 py-20 animate-fade-in">
            <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                <div>
                    <h1 class="text-4xl font-black text-slate-900">Admin Dashboard</h1>
                    <p class="text-slate-500">Welcome back, ${state.user.email.split('@')[0]}</p>
                </div>
                <button id="btn-show-modal" class="px-8 py-4 bg-sky-500 text-white rounded-2xl font-black shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all flex items-center gap-2">
                    <i data-lucide="plus" class="w-5 h-5"></i> Add New Entry
                </button>
            </header>
            <div class="flex gap-4 mb-10 overflow-x-auto pb-2 no-scrollbar">
                <button class="px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${state.activeAdminTab === 'directory' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}" onclick="setAdminTab('directory')">Directory</button>
                <button class="px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${state.activeAdminTab === 'announcements' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}" onclick="setAdminTab('announcements')">Announcements</button>
                <button class="px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${state.activeAdminTab === 'officials' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-100'}" onclick="setAdminTab('officials')">Officials</button>
            </div>
            ${state.showAdminModal ? `
                <div class="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div class="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-scale-in">
                        <h2 class="text-3xl font-black mb-8">Add to ${state.activeAdminTab.charAt(0).toUpperCase() + state.activeAdminTab.slice(1)}</h2>
                        <form id="add-item-form" class="space-y-6">
                            <div class="space-y-2">
                                <label class="text-xs font-black uppercase text-slate-400">Title / Name</label>
                                <input type="text" id="item-name" placeholder="Enter name..." required class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <label class="text-xs font-black uppercase text-slate-400">Category / Role</label>
                                    <input type="text" id="item-category" placeholder="E.g. Health" required class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none">
                                </div>
                                <div class="space-y-2">
                                    <label class="text-xs font-black uppercase text-slate-400">Contact</label>
                                    <input type="text" id="item-phone" placeholder="Phone number" class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none">
                                </div>
                            </div>
                            <div class="space-y-2">
                                <label class="text-xs font-black uppercase text-slate-400">Location / Description</label>
                                <textarea id="item-address" placeholder="Additional details..." class="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none min-h-[100px]"></textarea>
                            </div>
                            <div class="flex gap-4 pt-6">
                                <button type="button" id="btn-close-modal" class="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button>
                                <button type="submit" class="flex-1 py-4 bg-sky-500 text-white rounded-2xl font-black shadow-lg">Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            ` : ''}
            <div class="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-soft">
                <table class="w-full text-left">
                    <thead class="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th class="px-8 py-5 font-black text-xs uppercase tracking-widest text-slate-400">Entry Name</th>
                            <th class="px-8 py-5 font-black text-xs uppercase tracking-widest text-slate-400">Category</th>
                            <th class="px-8 py-5 font-black text-xs uppercase tracking-widest text-slate-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                        ${state[state.activeAdminTab].map(i => `
                            <tr class="hover:bg-slate-50/30 transition-colors">
                                <td class="px-8 py-6">
                                    <p class="font-bold text-slate-900">${i.name || i.title}</p>
                                    <p class="text-xs text-slate-400 mt-0.5">${i.address || i.date || ''}</p>
                                </td>
                                <td class="px-8 py-6">
                                    <span class="px-3 py-1 bg-sky-50 text-sky-600 rounded-lg text-[10px] font-black uppercase">${i.category || i.position}</span>
                                </td>
                                <td class="px-8 py-6 text-right">
                                    <button class="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all" onclick="deleteEntry('${i.id}', '${state.activeAdminTab}')">
                                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                ${state[state.activeAdminTab].length === 0 ? `
                    <div class="py-20 text-center text-slate-400">
                        <i data-lucide="inbox" class="w-12 h-12 mx-auto mb-4 opacity-20"></i>
                        <p>No records found in this section.</p>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    }
};
// Global Helpers attached to window
window.deleteEntry = (id, tab) => {
    state[tab] = state[tab].filter(i => i.id !== id);
    render();
    showToast('Entry removed successfully');
};
window.setAdminTab = (tab) => {
    state.activeAdminTab = tab;
    render();
};
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl z-[200] animate-fade-in pointer-events-none';
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
// Router and Rendering Engine
function render() {
    const hash = window.location.hash.substring(1) || 'home';
    const appRoot = document.getElementById('app-root');
    const viewFn = views[hash] || (() => `<div class="py-32 text-center text-slate-400">View Not Found</div>`);
    appRoot.innerHTML = viewFn();
    window.scrollTo(0, 0);
    lucide.createIcons();
    // Attach Dynamic Listeners
    if (hash === 'login') {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            auth.signInAnonymously().then(() => {
                state.user = { email: email };
                window.location.hash = 'admin';
                showToast('Welcome to the Admin Portal');
            });
        });
    }
    if (hash === 'register') {
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Registration submitted for approval');
            setTimeout(() => window.location.hash = 'home', 1500);
        });
    }
    if (hash === 'directory') {
        const searchInput = document.getElementById('dir-search');
        const filterSelect = document.getElementById('dir-filter');
        searchInput.addEventListener('input', (e) => {
            state.searchQuery = e.target.value;
            const results = views.directory();
            appRoot.innerHTML = results;
            lucide.createIcons();
            document.getElementById('dir-search').focus();
            document.getElementById('dir-search').setSelectionRange(state.searchQuery.length, state.searchQuery.length);
        });
        filterSelect.addEventListener('change', (e) => {
            state.filterCategory = e.target.value;
            render();
        });
    }
    if (hash === 'admin' && state.user) {
        document.getElementById('btn-show-modal')?.addEventListener('click', () => {
            state.showAdminModal = true;
            render();
        });
        document.getElementById('btn-close-modal')?.addEventListener('click', () => {
            state.showAdminModal = false;
            render();
        });
        document.getElementById('add-item-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const newItem = {
                id: Date.now().toString(),
                name: document.getElementById('item-name').value,
                title: document.getElementById('item-name').value,
                category: document.getElementById('item-category').value,
                position: document.getElementById('item-category').value,
                address: document.getElementById('item-address').value,
                content: document.getElementById('item-address').value,
                phone: document.getElementById('item-phone').value,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: '2023' }),
                image: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=400'
            };
            state[state.activeAdminTab].unshift(newItem);
            state.showAdminModal = false;
            render();
            showToast('New entry recorded');
        });
    }
}
// Global Auth Observer
auth.onAuthStateChanged(user => {
    state.user = user;
    const navAuth = document.getElementById('nav-auth');
    if (user) {
        navAuth.innerHTML = `
            <div class="flex items-center gap-6">
                <a href="#admin" class="text-sm font-black text-sky-600 hover:text-sky-700">Admin Panel</a>
                <button onclick="firebase.auth().signOut().then(() => { window.location.hash = 'home'; showToast('Logged out'); })" class="text-slate-400 hover:text-rose-500 transition-colors">
                    <i data-lucide="log-out" class="w-5 h-5"></i>
                </button>
            </div>
        `;
    } else {
        navAuth.innerHTML = `
            <div class="flex items-center gap-6">
                <a href="#login" class="text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors">Staff Login</a>
                <a href="#register" class="text-sm font-black text-white bg-slate-900 px-6 py-3 rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-100 transition-all">Register</a>
            </div>
        `;
    }
    lucide.createIcons();
});
// Initialization
window.addEventListener('hashchange', render);
document.getElementById('year').textContent = new Date().getFullYear();
render();
// Remove Loader
const globalLoader = document.getElementById('global-loader');
if (globalLoader) {
    globalLoader.classList.add('opacity-0');
    setTimeout(() => globalLoader.remove(), 500);
}