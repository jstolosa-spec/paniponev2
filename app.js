const firebaseConfig = {
  apiKey: "AIzaSy-PLACEHOLDER-KEY",
  authDomain: "panipuan-connect.firebaseapp.com",
  projectId: "panipuan-connect",
  storageBucket: "panipuan-connect.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
// Initialize Firebase (Compatibility Mode)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
// Application State
const state = {
    user: null,
    role: 'guest',
    isLoading: true
};
const views = {
    home: () => `
        <section class="bg-gradient-hero py-20 overflow-hidden relative">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div class="max-w-3xl animate-fade-in">
                    <span class="inline-block px-4 py-1.5 bg-sky-100 text-sky-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">Official Community Portal</span>
                    <h1 class="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">Welcome to the future of <span class="text-sky-500">Panipuan</span></h1>
                    <p class="text-xl text-slate-600 leading-relaxed mb-10">Access local services, connect with businesses, and stay informed with the official PanipOne digital repository.</p>
                    <div class="flex flex-wrap gap-4">
                        <a href="#directory" class="px-8 py-4 bg-sky-500 text-white rounded-xl font-bold text-lg hover:bg-sky-600 transition-all shadow-xl shadow-sky-500/25">Explore Directory</a>
                        <a href="#emergency" class="px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">Emergency Contacts</a>
                    </div>
                </div>
            </div>
        </section>
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div class="flex justify-between items-end mb-12">
                <div>
                    <h2 class="text-3xl font-bold text-slate-900">Latest Updates</h2>
                    <p class="text-slate-500">Stay informed about your community.</p>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <span class="px-3 py-1 bg-amber-100 text-amber-600 rounded-full text-2xs font-bold uppercase mb-4 inline-block">Event</span>
                    <h3 class="text-xl font-bold mb-4">Monthly Clean-up Drive</h3>
                    <p class="text-slate-500 text-sm leading-relaxed mb-6">Join your neighbors this Saturday at 6:00 AM for our Purok 3 beautification project.</p>
                    <div class="text-xs text-slate-400 font-medium">Nov 25, 2023</div>
                </div>
                <div class="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <span class="px-3 py-1 bg-sky-100 text-sky-600 rounded-full text-2xs font-bold uppercase mb-4 inline-block">Notice</span>
                    <h3 class="text-xl font-bold mb-4">Road Maintenance Alert</h3>
                    <p class="text-slate-500 text-sm leading-relaxed mb-6">Scheduled asphalt repairs on Panipuan Main Road starting Monday. Plan alternate routes.</p>
                    <div class="text-xs text-slate-400 font-medium">Nov 20, 2023</div>
                </div>
                <div class="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all">
                    <span class="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-2xs font-bold uppercase mb-4 inline-block">Health</span>
                    <h3 class="text-xl font-bold mb-4">Free Vaccination Day</h3>
                    <p class="text-slate-500 text-sm leading-relaxed mb-6">The Barangay Health Center will be providing free flu shots for seniors and children next week.</p>
                    <div class="text-xs text-slate-400 font-medium">Nov 15, 2023</div>
                </div>
            </div>
        </section>
    `,
    directory: () => `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 class="text-4xl font-black mb-4">Local Directory</h1>
            <p class="text-lg text-slate-500 mb-12">Connect with verified Panipuan businesses and services.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
                    <div class="h-48 bg-slate-200 overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold mb-2">Panipuan Health Center</h3>
                        <p class="text-sm text-slate-500 mb-4">Public health services and primary medical care.</p>
                        <div class="flex items-center gap-2 text-xs text-sky-600 font-bold uppercase tracking-wider">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            (045) 123-4567
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    emergency: () => `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="text-center mb-16">
                <span class="px-4 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-bold uppercase mb-4 inline-block">24/7 Response</span>
                <h1 class="text-5xl font-black text-slate-900 mb-6">Emergency Portal</h1>
                <p class="text-lg text-slate-500 max-w-2xl mx-auto">Help is one call away. These lifelines are available round-the-clock for Panipuan residents.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="p-8 bg-rose-600 rounded-3xl text-white shadow-xl shadow-rose-600/20">
                    <h3 class="text-2xl font-black mb-2">911</h3>
                    <p class="text-rose-100 text-sm mb-6">National Hotline</p>
                    <a href="tel:911" class="block w-full py-3 bg-white text-rose-600 text-center rounded-xl font-bold">Call Now</a>
                </div>
                <div class="p-8 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-900/20">
                    <h3 class="text-2xl font-black mb-2">Brgy Hall</h3>
                    <p class="text-slate-400 text-sm mb-6">Direct Response</p>
                    <a href="tel:0451234567" class="block w-full py-3 bg-sky-500 text-white text-center rounded-xl font-bold">Call Hall</a>
                </div>
            </div>
        </div>
    `,
    officials: () => `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 class="text-4xl font-black mb-12 text-center">Governance Roster</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div class="text-center group">
                    <div class="w-48 h-48 mx-auto bg-sky-50 rounded-full mb-6 overflow-hidden border-4 border-white shadow-xl">
                        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" class="w-full h-full object-cover">
                    </div>
                    <h3 class="text-xl font-bold">Hon. Ricardo Santos</h3>
                    <p class="text-sky-600 font-bold uppercase text-xs tracking-widest mt-2">Punong Barangay</p>
                </div>
            </div>
        </div>
    `,
    login: () => `
        <div class="max-w-md mx-auto py-24 px-4">
            <div class="bg-white p-10 rounded-3xl border border-slate-100 shadow-2xl">
                <h1 class="text-3xl font-black mb-2">Sign In</h1>
                <p class="text-slate-500 mb-8">Access PanipOne Admin Portal</p>
                <form id="login-form" class="space-y-6">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Email</label>
                        <input type="email" id="email" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all" placeholder="admin@panipuan.gov.ph">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">Password</label>
                        <input type="password" id="password" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all" placeholder="••••••••">
                    </div>
                    <button type="submit" class="w-full py-4 bg-sky-500 text-white rounded-xl font-black shadow-xl shadow-sky-500/20 hover:bg-sky-600 transition-all">Authenticate</button>
                </form>
            </div>
        </div>
    `,
    register: () => `
        <div class="max-w-md mx-auto py-24 px-4">
            <div class="bg-white p-10 rounded-3xl border border-slate-100 shadow-2xl text-center">
                <div class="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600 mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                </div>
                <h1 class="text-3xl font-black mb-4">Join the Community</h1>
                <p class="text-slate-500 mb-8">Register on PanipOne for verified resident access.</p>
                <div class="space-y-4">
                    <button class="w-full py-4 bg-sky-50 text-sky-600 rounded-xl font-bold border border-sky-100 hover:bg-sky-100 transition-all">I am a Resident</button>
                    <button class="w-full py-4 bg-emerald-50 text-emerald-600 rounded-xl font-bold border border-emerald-100 hover:bg-emerald-100 transition-all">I am a Skilled Worker</button>
                </div>
            </div>
        </div>
    `
};
function router() {
    const hash = window.location.hash.substring(1) || 'home';
    const appRoot = document.getElementById('app-root');
    // Highlight active nav links
    document.querySelectorAll('#nav-links a').forEach(link => {
        const linkHash = link.getAttribute('href').substring(1);
        if (linkHash === hash) {
            link.classList.add('text-sky-600');
            link.classList.remove('text-slate-600');
        } else {
            link.classList.remove('text-sky-600');
            link.classList.add('text-slate-600');
        }
    });
    if (views[hash]) {
        appRoot.innerHTML = views[hash]();
        window.scrollTo(0, 0);
        // Bind events for specific pages
        if (hash === 'login') bindLogin();
    } else {
        appRoot.innerHTML = `<div class="py-24 text-center font-bold text-slate-400">Page Not Found</div>`;
    }
}
function bindLogin() {
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Authenticating with Firebase... (Redirecting to Home)');
            window.location.hash = 'home';
        });
    }
}
// Initial Navigation
document.getElementById('year').textContent = new Date().getFullYear();
window.addEventListener('hashchange', router);
router();
// Firebase Auth Listener Stub
auth.onAuthStateChanged(user => {
    state.user = user;
    if (user) {
        document.getElementById('nav-auth').innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                    <div class="text-xs font-bold text-slate-900">${user.email}</div>
                    <div class="text-2xs text-slate-400 uppercase tracking-tighter">Member</div>
                </div>
                <button onclick="firebase.auth().signOut()" class="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
            </div>
        `;
    } else {
        document.getElementById('nav-auth').innerHTML = `
            <a href="#login" class="text-sm font-bold text-sky-600 px-4 py-2 hover:bg-sky-50 rounded-lg transition-colors">Sign In</a>
            <a href="#register" class="text-sm font-bold bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 shadow-lg shadow-sky-500/20 transition-all">Join</a>
        `;
    }
});