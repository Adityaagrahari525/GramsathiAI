# GramSathi AI — Frontend Interaction Mapping
**Phase:** Phase 2 — Complete Frontend Functionality  
**Platform:** GramSathi AI  
**Scope:** Exhaustive catalog of interactive UI elements, triggers, state mutations, and outcomes  

---

## 1. Global Navigation & Accessibility Bar (All Pages)

| Element / Selector | Component | Trigger | Action / State Mutation | Visual & Functional Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **Language Switcher (मराठी / हिंदी / English)** | `TopBar.tsx`, `Navbar.tsx` | Click | `setCurrentLang(lang)` | Updates UI string labels across navigation and headers to chosen language. |
| **Font Size Controls (`A-`, `A`, `A+`)** | `TopBar.tsx` | Click | `onFontSizeChange(delta)` | Modifies root container rem/percentage scale within safe bounds (-2 to +3). |
| **Screen Reader Toggle** | `TopBar.tsx` | Click | Speech synthesis utterance | Reads current page context aloud using browser Web Speech API. |
| **Portal Identity Link ("GramSathi .AI")** | `Navbar.tsx`, `HomeNavbar.tsx` | Click | `navigate('/')` | Returns user directly to homepage hero section. |
| **Explore Schemes Link** | `Navbar.tsx` | Click | `navigate('/schemes')` | Navigates to full scheme directory. |
| **Find by Need Link** | `HomeNavbar.tsx` | Click | `navigate('/needs')` | Navigates to conversational query assistant. |
| **Saved Schemes Link** | `Navbar.tsx`, `HomeNavbar.tsx` | Click | `navigate('/saved')` | Opens user's saved schemes portfolio; displays live bookmark count badge. |
| **Tracker Link** | `Navbar.tsx`, `HomeNavbar.tsx` | Click | `navigate('/tracker')` | Opens 5-stage application workflow tracker. |
| **Synergy Link** | `HomeNavbar.tsx` | Click | `navigate('/synergy')` | Opens scheme combination and anti-double subsidy optimizer. |
| **Fraud Check Link** | `HomeNavbar.tsx` | Click | `navigate('/fraud-check')` | Opens fake message and scam verification tool. |
| **Citizen Sign In / Profile Link** | `Navbar.tsx`, `HomeNavbar.tsx` | Click | Conditional navigation | If logged in, routes to `/profile` with user first name; if logged out, routes to `/signin`. |
| **Toll-Free Helpline Buttons** | `Navbar.tsx`, `HomeNavbar.tsx` | Click | `tel:1800-123-4726` | Triggers mobile dialer with official toll-free civic helpline. |

---

## 2. Homepage (`/`)

| Element | Interaction | Action / Handler | Result |
| :--- | :--- | :--- | :--- |
| **Hero Search Bar** | Type + Enter / Click Search | `navigate('/schemes?q=' + query)` | Redirects to scheme directory with filter pre-applied. |
| **Quick Category Cards (Farmer, Women, Student)** | Click | `navigate('/schemes?sector=' + cat)` | Pre-filters scheme directory to targeted department. |
| **"Check My Eligibility" Hero Button** | Click | `navigate('/eligibility')` | Opens guided 4-step eligibility wizard. |
| **"Explore All 650+ Schemes" Button** | Click | `navigate('/schemes')` | Loads full directory catalog. |
| **Listen Audio Guide Button** | Click | Browser Speech API | Plays audio summary of portal capabilities. |
| **Mobile Drawer Hamburger** | Click | `setIsSidebarOpen(true)` | Slides open mobile navigation drawer from left. |

---

## 3. Scheme Discovery & Directory (`/schemes`)

| Element | Interaction | Action / Handler | Result |
| :--- | :--- | :--- | :--- |
| **Search Input Field** | Typing | `setSearchQuery(val)` | Real-time filter across scheme titles, descriptions, and benefits. |
| **Clear Search Button (`X`)** | Click | `setSearchQuery('')` | Clears query and resets card view. |
| **Sector Filter Tabs (Agri, Social, etc.)** | Click | `setActiveSector(id)` | Filters list by targeted sector and updates query param. |
| **Level of Govt Checkboxes** | Toggle | Updates `filters.levelGov` | Filters between Maharashtra State vs Central schemes. |
| **Beneficiary Category Checkboxes** | Toggle | Updates `filters.beneficiaryCat` | Filters by Small Farmer, Landless Laborer, Artisan, etc. |
| **Card Bookmark Icon (Heart/Ribbon)** | Click | `toggleSave(scheme.id)` | Adds/removes scheme from `SavedSchemesContext`, displays toast. |
| **"View Details" Button on Card** | Click | `navigate('/scheme/' + scheme.id)` | Opens comprehensive scheme detail factsheet. |
| **"Quick View" Button on Card** | Click | `setSelectedScheme(scheme)` | Opens interactive scheme modal overlay. |
| **Quick View Modal Close Button** | Click | `setSelectedScheme(null)` | Dismisses modal overlay. |
| **"Check Eligibility" Button on Card** | Click | `navigate('/eligibility')` | Directs citizen to eligibility questionnaire. |

---

## 4. Scheme Detail Page (`/scheme/:id`)

| Element | Interaction | Action / Handler | Result |
| :--- | :--- | :--- | :--- |
| **"Save Scheme" Button** | Click | `toggleSave(schemeId)` | Toggles saved state and updates button label with toast alert. |
| **"Print Factsheet" Button** | Click | `window.print()` | Opens print-optimized layout of official scheme guidelines. |
| **"Share Scheme" Button** | Click | `navigator.clipboard.writeText(...)` | Copies verified URL to clipboard with civic toast confirmation. |
| **Interactive Pump Calculator Dropdowns** | Change | `setLandHolding()`, `setCategory()` | Dynamically recalculates recommended pump HP (3/5/7.5 HP) and farmer copay. |
| **"Apply on Official Portal" Button** | Click | External link | Redirects safely in new tab to Mahavitaran Solar / MahaDBT official portal. |
| **Required Documents Preview Link** | Click | Scroll anchor | Smoothly scrolls user down to mandatory document checklist. |

---

## 5. Saved Schemes Portfolio (`/saved`)

| Element | Interaction | Action / Handler | Result |
| :--- | :--- | :--- | :--- |
| **Search Filter** | Typing | `setSearchQuery(e.target.value)` | Filters saved schemes in real time. |
| **Category Pill Filters** | Click | `setActiveCategory(cat)` | Filters saved cards by category. |
| **Status Filter (Eligible / Action Required)** | Click | `setStatusFilter(type)` | Narrows view to ready vs action-pending schemes. |
| **"Remove from Saved" Button** | Click | `removeSaved(scheme.id)` | Removes scheme from `localStorage` and updates counter. |
| **"Export List (PDF)" Button** | Click | `handleExportPdf()` | Displays toast alert and opens print preview dialog. |
| **"Share via WhatsApp" Button** | Click | `handleShareWhatsApp()` | Opens WhatsApp web/app with pre-filled message summary. |
| **"Start Journey / Dossier" Button** | Click | `navigate('/tracker')` | Opens 5-stage application tracker. |

---

## 6. Citizen Authentication & Registration (`/signin` & `/register`)

| Element | Interaction | Action / Handler | Result |
| :--- | :--- | :--- | :--- |
| **Auth Mode Radio (Mobile vs Aadhaar)** | Click | `setAuthMode(mode)` | Switches input mask between 10-digit mobile and 12-digit Aadhaar. |
| **"Get OTP on Mobile" Button** | Click | Input validation + timer | Dispatches simulated SMS OTP, starts 60s cooldown, focuses OTP input. |
| **6-Digit OTP Input Boxes** | Typing / Paste | Auto-tab logic | Moves cursor to next digit automatically on input. |
| **"Resend OTP via SMS" Button** | Click | Resets 60s cooldown | Re-simulates OTP delivery with civic toast notification. |
| **"Sign In to Citizen Dashboard" Button** | Click | Form validation + `login()` | Sets `profile.isLoggedIn = true` and navigates to `/profile`. |
| **3-Step Registration Step Indicators** | View | Progress bar | Visualizes step 1 (Identity), 2 (Location), 3 (Socio-Economic). |
| **District Dropdown in Registration** | Select | Cascading Taluka update | Updates available Talukas matching selected Maharashtra district. |
| **"Submit Registration" Button** | Click | `updateProfile(formData)` | Saves citizen profile to `CitizenProfileContext` and routes to dashboard. |

---

## 7. Citizen Profile Dashboard (`/profile`)

| Element | Interaction | Action / Handler | Result |
| :--- | :--- | :--- | :--- |
| **"Edit Profile Details" Button** | Click | `setIsEditing(true)` | Converts read-only demographic cards into editable form inputs. |
| **"Save Changes" Button** | Click | `handleSave()` | Commits edited details to `CitizenProfileContext` and shows success toast. |
| **"Cancel Editing" Button** | Click | `setIsEditing(false)` | Discards uncommitted form input changes. |
| **Focus Area Pills (Agri, Solar, Housing)** | Click | `toggleFocusArea(key)` | Toggles sector interest flag for personalized discovery. |
| **"Select All Focus Areas" Button** | Click | `selectAllFocusAreas()` | Enables all interest categories simultaneously. |
| **"Sign Out" Button** | Click | `logout()` | Clears active session and routes back to `/signin`. |

---

## 8. Eligibility Wizard & Results (`/eligibility` & `/eligibility/results`)

| Element | Interaction | Action / Handler | Result |
| :--- | :--- | :--- | :--- |
| **Wizard "Next Step" Buttons** | Click | Step validation | Validates current step inputs before advancing to steps 2, 3, or 4. |
| **Wizard "Previous Step" Buttons** | Click | `setCurrentStep(prev)` | Navigates back one step while preserving user selections. |
| **"Evaluate My Eligibility" Button** | Click | Evaluation engine | Passes inputs to `EligibilityService` and routes to `/eligibility/results`. |
| **"Audio Readout" Button** | Click | Web Speech API | Speaks eligibility determination in natural speech. |
| **"Download Dossier PDF" Button** | Click | `downloadDossier()` | Downloads structured application dossier and shows toast notification. |
| **"Proceed to Dossier & Tracker" Button** | Click | `navigate('/tracker')` | Transitions citizen straight into the 5-stage tracker. |

---

## 9. Scheme Journey Tracker (`/tracker`)

| Element | Interaction | Action / Handler | Result |
| :--- | :--- | :--- | :--- |
| **"Fetch from DigiLocker" Button** | Click | `syncDigiLocker()` | Triggers simulated 1-second Aadhaar e-KYC sync, marks 8-A ready, unlocks Stage 3. |
| **"Upload 8-A Land Extract" Button** | Click | `upload8A()` | Simulates local file upload, updates readiness to 100%, advances progress bar. |
| **Document "View" Buttons** | Click | `setActiveDocModal(docId)` | Opens document preview modal (7/12, Aadhaar, Caste Cert, Passbook). |
| **Modal "Close" / Backdrop Click** | Click | `setActiveDocModal(null)` | Dismisses document preview modal. |
| **"Download Ready Dossier (PDF)" Button**| Click | `downloadDossier()` | Downloads compiled dossier with all 6 verified attachments. |
| **Stage 1 Summary Accordion Header** | Click | `setIsStage1Open(!open)` | Expands/collapses completed eligibility assessment details. |

---

## 10. Synergy Optimizer & Fraud Checker (`/synergy` & `/fraud-check`)

| Element | Interaction | Action / Handler | Result |
| :--- | :--- | :--- | :--- |
| **Synergy Scheme Checkboxes** | Toggle | Selection state update | Recalculates combined benefits (₹2,45,000) and farmer copay in real-time. |
| **"Download Advisory PDF" Button** | Click | `window.print()` | Opens print-ready anti-double subsidy advisory document. |
| **Fraud Checker Preset Buttons** | Click | `handleApplyPreset(text)` | Populates suspicious message textarea with sample phishing text. |
| **"Analyze Message for Risk" Button** | Click | Risk evaluation parser | Displays 88% High Risk alert, highlights red flags (fake domain, fee request). |
| **"Dial Cyber Cell 1930" Button** | Click | `tel:1930` | Connects directly to Maharashtra Cyber Crime emergency helpline. |
| **"Lodge Tip to GramSathi" Button** | Click | Toast feedback | Logs suspicious message to civic phishing registry with confirmation toast. |
