import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCitizenProfile } from '../context/CitizenProfileContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { TopBar } from '../components/TopBar';
import { Navbar } from '../components/Navbar';

export function CitizenProfilePage() {
  const navigate = useNavigate();
  const { profile, updateProfile, toggleFocusArea, selectAllFocusAreas, logout } = useCitizenProfile();
  const { showToast } = useToast();
  const { t } = useLanguage();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profile.name,
    mobile: profile.mobile,
    socialCategory: profile.socialCategory,
    occupation: profile.occupation,
    district: profile.district,
    taluka: profile.taluka,
    village: profile.village,
    pincode: profile.pincode
  });

  const handleSave = () => {
    updateProfile(editForm);
    setIsEditing(false);
    showToast(t('Citizen profile updated successfully'), 'success');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans">
      {/* ── 1. Top Civic Header Ribbon ── */}
      <TopBar />

      {/* ── 2. Civic Navbar ── */}
      <Navbar />

      {/* ── 3. Breadcrumb & Sync Status Bar ── */}
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="text-slate-500 font-medium">
            <span className="hover:text-blue-700 cursor-pointer" onClick={() => navigate('/')}>GramSathi AI</span>
            <span> / </span>
            <span className="hover:text-blue-700 cursor-pointer" onClick={() => navigate('/schemes')}>{t('Direct Benefits & Welfare')}</span>
            <span> / </span>
            <span className="text-slate-800 font-bold">{t('Citizen Services')}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            <span>{t('Demonstration Workflow • MahaDBT & PM-Kisan Model')}</span>
          </div>
        </div>
      </div>

      {/* ── 4. Main Body ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">

        {/* ── 4.1 Citizen Header Banner ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-[#0f3675] text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                RG
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                ✓
              </span>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black text-slate-900">{profile.name}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <span>✓</span>
                  <span>MahaDBT Active</span>
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1 flex-wrap">
                <span>📍 Resident of {profile.district}, Maharashtra</span>
                <span>•</span>
                <span>🔒 Aadhaar ({profile.aadhaarMasked})</span>
                <span>•</span>
                <span>Farmer ID: {profile.farmerId}</span>
              </div>
            </div>
          </div>

          {/* Right Actions & Sync Time */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start md:items-end lg:items-center gap-3">
            <div className="text-right text-[11px] text-slate-400 font-medium">
              <div>Last Profile Sync:</div>
              <div className="font-bold text-slate-700">12 Nov 2026, 14:32</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <span>✎</span>
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
              >
                <span>💾</span>
                <span>Save Changes</span>
              </button>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/signin');
                }}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors shadow-2xs flex items-center gap-1.5 active:scale-[0.98]"
                title="Sign out of Citizen Session"
              >
                <span>🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 4.2 Profile Completeness Bar ── */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold mb-2">
            <div className="flex items-center gap-2 text-slate-900">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">✓</span>
              <span>Profile Completeness: <strong className="text-[#1850b5]">85% Complete</strong></span>
            </div>
            <div className="text-slate-500 font-medium flex items-center gap-1">
              <span>ⓘ Complete bank account validation to unlock 1-click scheme filing.</span>
              <span className="text-[#1850b5] font-bold hover:underline cursor-pointer">Link Bank</span>
            </div>
          </div>

          {/* Progress Line */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
            <div className="bg-[#1850b5] h-full rounded-full transition-all duration-300" style={{ width: '85%' }} />
          </div>

          {/* 4 Completeness Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-semibold text-slate-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Personal: 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Location & 7/12: 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>Preferences: 90%</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-700">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>DBT Direct Account: Pending Validation</span>
            </div>
          </div>
        </div>

        {/* ── 4.3 Main 2-Column Content Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Left Column: Profile Settings & Location (8 Cols) ── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Card 1: Basic Profile Information */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">1. Basic Profile Information</h2>
                    <p className="text-[11px] text-slate-400">Basic demographic indicators verified via UIDAI & MahaDBT portal.</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Government Verified
                </span>
              </div>

              <div className="space-y-4">
                {/* Full Legal Name */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span>Full Legal Name (as per Aadhaar Card)</span>
                    <span className="text-[10px] text-slate-400 font-medium">🔒 Read-only via UIDAI</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 flex items-center justify-between">
                    <span>{profile.name}</span>
                    <span className="text-slate-400">📋</span>
                  </div>
                </div>

                {/* Mobile & Gender/Age Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Registered Mobile Number</span>
                      <span className="text-[10px] text-emerald-700 font-bold">✓ OTP Verified</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>{profile.mobile}</span>
                      <span className="text-xs text-[#1850b5] font-semibold hover:underline cursor-pointer">Change</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-1">Gender / Age</div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900">
                      {profile.gender}, {profile.age}
                    </div>
                  </div>
                </div>

                {/* Social Category & Primary Occupation Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-1">Social Category / Reservation Class</div>
                    <select
                      value={isEditing ? editForm.socialCategory : profile.socialCategory}
                      onChange={e => setEditForm(prev => ({ ...prev, socialCategory: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 disabled:opacity-90"
                    >
                      <option>OBC (Other Backward Classes) - Non-Creamy</option>
                      <option>SC (Scheduled Caste)</option>
                      <option>ST (Scheduled Tribe)</option>
                      <option>General / Open EBC</option>
                      <option>VJNT / NT-A</option>
                    </select>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-1">Primary Occupation & Landholding</div>
                    <select
                      value={isEditing ? editForm.occupation : profile.occupation}
                      onChange={e => setEditForm(prev => ({ ...prev, occupation: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 disabled:opacity-90"
                    >
                      <option>Farmer / Cultivator (Small Farmer, 2.5 Acres)</option>
                      <option>Marginal Farmer (&lt; 2.5 Acres)</option>
                      <option>Large Landholding Farmer (&gt; 5.0 Acres)</option>
                      <option>Rural Entrepreneur / MSME</option>
                    </select>
                  </div>
                </div>

                {/* DPDP Act Safeguard Box */}
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-start gap-2.5 text-xs text-slate-600 font-medium">
                  <span className="text-base">🛡</span>
                  <p className="leading-relaxed">
                    <strong className="text-blue-900 font-bold mr-1">DPDP Act Safeguard:</strong>
                    Your information is encrypted and strictly protected under the Digital Personal Data Protection Act, 2023. Only essential socio-economic criteria are processed to match and pre-verify your welfare eligibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Regional Location & Agro-Climatic Zone */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🗺</span>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">2. Regional Location & Agro-Climatic Zone</h2>
                    <p className="text-[11px] text-slate-400">Configures Gram Panchayat level notifications and district specific allocations.</p>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Taluka Sync Active</span>
                </span>
              </div>

              <div className="space-y-4">
                {/* State, District, Taluka Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-1">State</div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>{profile.state}</span>
                      <span className="text-slate-400 text-xs">🔒</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-1">District</div>
                    <select
                      value={isEditing ? editForm.district : profile.district}
                      onChange={e => setEditForm(prev => ({ ...prev, district: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 disabled:opacity-90"
                    >
                      <option>Pune</option>
                      <option>Ahmednagar</option>
                      <option>Nashik</option>
                      <option>Satara</option>
                      <option>Solapur</option>
                      <option>Kolhapur</option>
                    </select>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-700 mb-1">Taluka / Tehsil</div>
                    <select
                      value={isEditing ? editForm.taluka : profile.taluka}
                      onChange={e => setEditForm(prev => ({ ...prev, taluka: e.target.value }))}
                      disabled={!isEditing}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 disabled:opacity-90"
                    >
                      <option>Baramati</option>
                      <option>Indapur</option>
                      <option>Daund</option>
                      <option>Haveli</option>
                    </select>
                  </div>
                </div>

                {/* Village & PIN Code Row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <div className="sm:col-span-8">
                    <div className="text-xs font-bold text-slate-700 mb-1">Village / Gram Panchayat</div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 flex items-center justify-between">
                      <span>{profile.village}</span>
                      <span className="text-slate-400">✎</span>
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <div className="text-xs font-bold text-slate-700 mb-1">Postal PIN Code</div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900">
                      {profile.pincode}
                    </div>
                  </div>
                </div>

                {/* Agro-Climatic Zone Banner */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">🚜</span>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">
                        Agro-Climatic Zone: Western Maharashtra Scarcity Zone (Zone 6)
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                        Sub-basin: Nira River Catchment • Soil type: Medium Black Cotton
                      </div>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-[#1850b5] text-xs font-bold px-3 py-1 rounded-full border border-blue-200 shrink-0 self-start sm:self-auto">
                    Drip Subsidy Eligible
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 font-medium">
                  📍 Location parameters auto-filter seasonal subsidies released by the Maharashtra Department of Agriculture and Pune Zilla Parishad.
                </div>
              </div>
            </div>

            {/* Card 3: Welfare & Subsidy Focus Areas */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-5">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">3. Welfare & Subsidy Focus Areas</h2>
                    <p className="text-[11px] text-slate-400">Select interest sectors to personalize your GramSathi AI recommendation engine.</p>
                  </div>
                </div>
                <button
                  onClick={selectAllFocusAreas}
                  className="text-xs font-bold text-[#1850b5] hover:underline"
                >
                  Select All
                </button>
              </div>

              {/* 6 Grid Focus Tiles with Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { id: 'agri', icon: '💧', title: 'Agriculture & Irrigation', desc: 'Drip kits, wells, farm ponds' },
                  { id: 'solar', icon: '☀️', title: 'Solar Power & Feeders', desc: 'KUSUM-B pumps, agri feeders' },
                  { id: 'housing', icon: '🏠', title: 'Rural Housing & PMAY', desc: 'Gramin pucca housing grants' },
                  { id: 'cropInsurance', icon: '🛡', title: 'Crop Insurance & Relief', desc: 'PMFBY 1 Rupee crop shield' },
                  { id: 'dairy', icon: '🐄', title: 'Animal Husbandry & Dairy', desc: 'Cattle shed grants & fodder aid' },
                  { id: 'education', icon: '🎓', title: 'Education & Youth Stipends', desc: 'EBC scholarship & hostel aid' },
                ].map(item => (
                  <div
                    key={item.id}
                    onClick={() => toggleFocusArea(item.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      profile.focusAreas?.[item.id] ? 'bg-blue-50/50 border-blue-300' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.title}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{item.desc}</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!profile.focusAreas?.[item.id]}
                      onChange={() => toggleFocusArea(item.id)}
                      className="w-4 h-4 rounded text-[#1850b5] border-slate-300 pointer-events-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column: Saved Schemes, Document Vault & CSC Support (4 Cols) ── */}
          <div className="lg:col-span-4 space-y-6">

            {/* Card 1: Saved Schemes Shortcut */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm">
                  <span>🔖</span>
                  <span>Saved Schemes Shortcut</span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-[#1850b5]">
                  3 Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-4 leading-relaxed font-medium">
                Schemes you have bookmarked for active filing or eligibility monitoring.
              </p>

              <div className="space-y-3">
                {/* Item 1 */}
                <div
                  onClick={() => navigate('/schemes/saur-krushi-vahini')}
                  className="p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-200 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                    <span className="text-slate-500">Solar & Agri</span>
                    <span className="text-emerald-700">● 95% Match</span>
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 leading-snug">
                    Mukhyamantri Saur Krushi Vahini Yojana 2.0 (Solar Agri Pump)
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium mt-2 pt-2 border-t border-slate-200/60">
                    <span>📄 Stage 2: Documents</span>
                    <span className="font-bold text-amber-700">Due: 28 Nov</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div
                  onClick={() => navigate('/schemes')}
                  className="p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-200 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                    <span className="text-slate-500">Irrigation Grant</span>
                    <span className="text-blue-700">88% Match</span>
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 leading-snug">
                    Dr. Babasaheb Ambedkar Krishi Swavalamban Yojana
                  </h3>
                  <div className="text-[10px] text-amber-700 font-bold mt-2 pt-2 border-t border-slate-200/60">
                    ⚠ Criteria Verification Needed
                  </div>
                </div>

                {/* Item 3 */}
                <div
                  onClick={() => navigate('/schemes')}
                  className="p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-200 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1">
                    <span className="text-slate-500">Rural Housing</span>
                    <span className="text-slate-500">70% Match</span>
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-900 leading-snug">
                    Ramai Awas Gharkul Yojana (PMAY-G Allied)
                  </h3>
                  <div className="text-[10px] text-slate-400 font-medium mt-2 pt-2 border-t border-slate-200/60">
                    ⓘ Not Evaluated
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-center">
                <Link to="/schemes" className="text-xs font-bold text-[#1850b5] hover:underline flex items-center justify-center gap-1">
                  <span>View All Saved Schemes</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Card 2: Civic Document Vault */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center gap-2 font-extrabold text-slate-900 text-sm mb-1 pb-3 border-b border-slate-100">
                <span>📁</span>
                <span>Civic Document Vault</span>
              </div>
              <p className="text-[11px] text-slate-500 mb-4 leading-relaxed font-medium">
                Pre-fetched documents authenticated from DigiLocker & MahaBhumi repository.
              </p>

              <div className="space-y-2.5 text-xs">
                {/* Doc 1 */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="text-blue-600">📄</span>
                    <div>
                      <div className="font-bold text-slate-800 leading-tight">7/12 & 8-A Land Extract</div>
                      <div className="text-[10px] text-slate-400">Survey No. 112/2A • Baramati</div>
                    </div>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                </div>

                {/* Doc 2 */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <span className="text-blue-600">📄</span>
                    <div>
                      <div className="font-bold text-slate-800 leading-tight">Caste Certificate</div>
                      <div className="text-[10px] text-slate-400">Govt of MH • Verified 2021</div>
                    </div>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </span>
                </div>

                {/* Doc 3 (Upload Needed) */}
                <div className="flex items-center justify-between p-2.5 bg-amber-50/50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-2.5">
                    <span className="text-amber-600">🏦</span>
                    <div>
                      <div className="font-bold text-slate-800 leading-tight">Bank Passbook (DBT-Linked)</div>
                      <div className="text-[10px] text-amber-700 font-semibold">Validation Required</div>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('Simulated document upload: Please select your PDF or Photo of Bank Passbook', 'info')}
                    className="px-2.5 py-1 bg-[#1850b5] hover:bg-[#0f3675] text-white rounded-lg text-[10px] font-bold shadow-2xs"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Assistance & CSC Support */}
            <div className="bg-blue-50/70 border border-blue-200/90 rounded-2xl p-5">
              <div className="flex items-center gap-2 font-extrabold text-[#0f3675] text-sm mb-1">
                <span>🤝</span>
                <span>Assistance & CSC Support</span>
              </div>
              <p className="text-[11px] text-slate-600 mb-3.5 leading-relaxed font-medium">
                Need in-person assistance updating your profile or seeding your bank account?
              </p>

              <div className="space-y-2 text-xs font-semibold text-slate-800">
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <span>Toll-Free Helpline: <strong className="text-[#1850b5]">1800-123-GRAM (4726)</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span>🏢</span>
                  <span>Nearest Center: <strong>CSC Malegaon Gram Panchayat</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── 5. Civic Footer ── */}
      <footer className="bg-[#0f3675] text-white py-10 px-4 sm:px-6 lg:px-8 border-t border-blue-900 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-200">
          <div>
            <div className="text-base font-bold text-white mb-1">GramSathi AI — Government of Maharashtra</div>
            <div>Official civic profile and welfare entitlements vault for rural Maharashtra citizens.</div>
          </div>
          <div className="text-right space-y-1">
            <div>Helpline: <strong className="text-white">1800-123-GRAM</strong> | DigiLocker Connected</div>
            <div className="text-blue-300">© 2026 Government of Maharashtra, Rural Informatics Directorate.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default CitizenProfilePage;
