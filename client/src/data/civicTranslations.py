import re
from typing import Dict, List, Tuple

# Comprehensive translation dictionary mapping English phrases to Marathi and Hindi
CIVIC_TRANSLATIONS: Dict[str, Tuple[str, str]] = {
  # Common UI / Headers / Breadcrumbs
  "Government of Maharashtra Initiative": ("महाराष्ट्र शासन उपक्रम", "महाराष्ट्र शासन पहल"),
  "Aaple Sarkar / DigiGov Digital Civic Assistant": ("आपले सरकार / डिजीगोव्ह डिजिटल नागरिक मदतनीस", "आपले सरकार / डिजीगोव डिजिटल नागरिक सहायक"),
  "Screen Reader": ("स्क्रीन रीडर", "स्क्रीन रीडर"),
  "Digital Public Service Assistant": ("डिजिटल लोकसेवा सहाय्यक", "डिजिटल सार्वजनिक सेवा सहायक"),
  "Civic Demonstration Mode": ("नागरी प्रात्यक्षिक मोड", "नागरिक प्रदर्शन मोड"),
  "Demonstration Workflow • MahaDBT & PM-Kisan Model": ("प्रात्यक्षिक कार्यप्रवाह • महाडीबीटी आणि पीएम-किसान प्रारूप", "प्रदर्शन कार्यप्रवाह • महाडीबीटी और पीएम-किसान मॉडल"),
  "GramSathi AI / Direct Benefits & Welfare / Citizen Services": ("ग्रामसाथी AI / थेट लाभ आणि कल्याण / नागरिक सेवा", "ग्रामसाथी AI / प्रत्यक्ष लाभ एवं कल्याण / नागरिक सेवाएं"),
  "Direct Benefits & Welfare": ("थेट लाभ आणि जनकल्याण", "प्रत्यक्ष लाभ एवं जन कल्याण"),
  "Citizen Services": ("नागरिक सेवा", "नागरिक सेवाएं"),
  "Explore Schemes": ("योजना शोधा", "योजनाएं खोजें"),
  "Saved Schemes": ("जतन केलेल्या योजना", "सहेजी गई योजनाएं"),
  "AI Citizen Assistant": ("AI नागरिक सहाय्यक", "AI नागरिक सहायक"),
  "Eligibility Results": ("पात्रता निकाल", "पात्रता परिणाम"),
  "Scheme Journey & Tracker": ("अर्ज प्रवास व ट्रॅकर", "योजना यात्रा एवं ट्रैकर"),
  "Grievance / Helpdesk": ("तक्रार निवारण कक्ष", "शिकायत / हेल्पडेस्क"),
  "Citizen Profile": ("नागरिक प्रोफाइल", "नागरिक प्रोफाइल"),
  "Sign In": ("लॉगिन करा", "लॉगिन करें"),
  "Sign Out": ("बाहेर पडा", "लॉगआउट"),
  "Toll Free Call": ("मोफत हेल्पलाइन", "टोल फ्री कॉल"),
  "100% Free Public Service Platform": ("१००% मोफत सार्वजनिक सेवा मंच", "100% निःशुल्क सार्वजनिक सेवा मंच"),
  "Official State Gateways": ("अधिकृत राज्य पोर्टल्स", "आधिकारिक राज्य पोर्टल"),
  "Helpline & Grievances": ("हेल्पलाइन आणि तक्रार निवारण", "हेल्पलाइन एवं शिकायतें"),
  "Government of Maharashtra • GramSathi AI Rural Informatics Directorate": ("महाराष्ट्र शासन • ग्रामसाथी एआय ग्रामीण माहिती तंत्रज्ञान कक्ष", "महाराष्ट्र शासन • ग्रामसाथी एआई ग्रामीण सूचना प्रौद्योगिकी प्रकोष्ठ"),

  # NeedDiscoveryPage
  "Find Government Support by Your Need": ("आपल्या गरजेनुसार सरकारी मदत शोधा", "अपनी आवश्यकता अनुसार सरकारी सहायता खोजें"),
  "Select what assistance your household needs today. GramSathi AI automatically matches verified subsidies, grants, and civic schemes you qualify for.": (
    "तुमच्या कुटुंबाला आज कोणत्या मदतीची गरज आहे ते निवडा. ग्रामसाथी AI आपोआप तुम्ही पात्र असलेल्या प्रमाणित अनुदानांशी माहिती जुळवते.",
    "चुनें कि आपके परिवार को आज किस सहायता की आवश्यकता है। ग्रामसाथी AI स्वतः ही आपकी पात्रता अनुसार योजनाओं का मिलान करता है।"
  ),
  "Voice Search (बोलून शोधा)": ("आवाज शोध (बोलून शोधा)", "वॉयस सर्च (बोलकर खोजें)"),
  "Speak in Marathi, Hindi, or English": ("मराठी, हिंदी किंवा इंग्रजीत बोला", "मराठी, हिंदी या अंग्रेजी में बोलें"),
  "Describe what support you need (आपली गरज सांगा किंवा लिहा):": ("आपल्याला कोणत्या मदतीची गरज आहे ते सांगा किंवा लिहा:", "आपको किस सहायता की आवश्यकता है बताएं या लिखें:"),
  "Modular Rule-Based Intent Matching": ("नियम-आधारित अचूक हेतू जुळवणी", "नियम-आधारित सटीक उद्देश्य मिलान"),
  "e.g. I want financial support for farming, I want to start a small business, I am a member of a self-help group...": (
    "उदा. मला शेतीसाठी आर्थिक मदत हवी आहे, मला छोटा व्यवसाय सुरू करायचा आहे, मी बचत गटाची सदस्य आहे...",
    "उदा. मुझे खेती के लिए वित्तीय सहायता चाहिए, मैं छोटा व्यवसाय शुरू करना चाहता हूँ, मैं स्वयं सहायता समूह की सदस्य हूँ..."
  ),
  "Clear": ("साफ करा", "हटाएं"),
  "Popular Needs:": ("प्रसिद्ध गरजा:", "लोकप्रिय आवश्यकताएं:"),
  "Step 1: Choose Your Area of Need": ("टप्पा १: तुमच्या गरजेचा विभाग निवडा", "चरण १: अपनी आवश्यकता का क्षेत्र चुनें"),
  "Select a civic category to see tailored government programs": ("अनुकूलित सरकारी योजना पाहण्यासाठी एक प्रवर्ग निवडा", "अनुकूलित सरकारी योजनाएं देखने के लिए एक श्रेणी चुनें"),
  "Categories Available": ("उपलब्ध विभाग", "उपलब्ध श्रेणियां"),
  "Farming & Agriculture": ("शेती व कृषी", "खेती और कृषि"),
  "Solar pumps, micro-irrigation, seed grants, and machinery subsidies.": ("सौर कृषी पंप, ठिबक सिंचन, बियाणे अनुदान आणि कृषी यांत्रिकीकरण.", "सोलर पंप, सूक्ष्म सिंचाई, बीज अनुदान और कृषि उपकरण सब्सिडी।"),
  "Active Programs": ("सक्रिय योजना", "सक्रिय योजनाएं"),
  "Business & Self-Employment": ("उद्योग व स्वयंरोजगार", "व्यवसाय एवं स्वरोजगार"),
  "Mudra loans, PMEGP subsidized credit, and village enterprise grants.": ("मुद्रा कर्ज, पीएमईजीपी अनुदानित पतपुरवठा आणि ग्रामीण उद्योग सहाय्य.", "मुद्रा ऋण, पीएमईजीपी रियायती ऋण और ग्रामीण उद्यम सहायता।"),
  "Up to 35% Subsidy": ("३५% पर्यंत सरकारी अनुदान", "35% तक सरकारी सब्सिडी"),
  "Education & Scholarships": ("शिक्षण व शिष्यवृत्ती", "शिक्षा और छात्रवृत्ति"),
  "Fee waivers, Swadhar hostel aid, and ITI training stipends.": ("फी सवलत, स्वाधार वसतिगृह भत्ता आणि आयटीआय प्रशिक्षण विद्यावेतन.", "शुल्क माफी, स्वाधार छात्रावास सहायता और आईटीआई छात्रवृत्ति।"),
  "Full Fee Reimbursements": ("१००% शिक्षण शुल्क परतावा", "100% शिक्षण शुल्क प्रतिपूर्ति"),
  "Employment & Training": ("रोजगार व कौशल्य प्रशिक्षण", "रोजगार और कौशल प्रशिक्षण"),
  "MGNREGA wage employment and Yuva apprentice monthly stipends.": ("मनरेगा मजुरी हमी रोजगार आणि मुख्यमंत्री युवा कार्यप्रशिक्षण विद्यावेतन.", "मनरेगा मजदूरी रोजगार और युवा प्रशिक्षु मासिक वजीफा।"),
  "Guaranteed Work & Stipend": ("हमी रोजगार व विद्यावेतन", "गारंटीड कार्य और वजीफा"),
  "Women & Child Welfare": ("महिला व बालकल्याण", "महिला एवं बाल कल्याण"),
  "Ladki Bahin direct monthly benefit, SHG loans, and maternal aid.": ("लाडकी बहीण थेट मासिक मदत, बचत गट कर्ज आणि मातृत्व अनुदान.", "लाडली बहना प्रत्यक्ष मासिक सहायता, महिला स्वयं सहायता समूह ऋण।"),
  "₹1,500/month Direct Grant": ("दरमहा ₹१,५०० थेट खात्यात", "₹1,500/माह प्रत्यक्ष सहायता"),
  "Pensions & Housing Aid": ("निवृत्तीवेतन व घरकुल योजना", "पेंशन और आवास सहायता"),
  "Senior citizen pensions, disability allowances, and Gharkul housing.": ("ज्येष्ठ नागरिक पेन्शन, दिव्यांग भत्ता आणि रमाई/शबरी घरकुल निवारा.", "वृद्धावस्था पेंशन, दिव्यांग भत्ता और प्रधानमंत्री आवास योजना।"),
  "Social Safety Net": ("सामाजिक सुरक्षा संरक्षण", "सामाजिक सुरक्षा कवच"),
  "FILTER CATEGORY:": ("निवडलेला प्रवर्ग:", "चयनित श्रेणी:"),
  "Filter to Eligible Only (2.5 Acres)": ("फक्त पात्र योजना दाखवा (२.५ एकर धारणा)", "केवल पात्र योजनाएं दिखाएं (2.5 एकड़ भूमि)"),
  "Recommended Schemes": ("शिफारस केलेल्या योजना", "अनुशंसित योजनाएं"),
  "Matches Found": ("योजना सापडल्या", "योजनाएं मिलीं"),
  "Sort by:": ("क्रमवारी:", "क्रमबद्ध करें:"),
  "Highest Match Percentage": ("सर्वाधिक जुळणारे प्रथम", "उच्चतम मिलान प्रतिशत"),
  "Maximum Subsidy / Benefit": ("कमाल अनुदान / लाभ", "अधिकतम सब्सिडी / लाभ"),
  "Fewest Application Steps": ("कमीत कमी अर्ज टप्पे", "न्यूनतम आवेदन चरण"),
  "Apply / Track →": ("अर्ज करा / मागोवा →", "आवेदन करें / ट्रैक →"),
  "Scheme Details": ("सविस्तर माहिती", "योजना विवरण"),
  "Official Portal": ("अधिकृत पोर्टल", "आधिकारिक पोर्टल"),
  "Key Eligibility:": ("मुख्य पात्रता:", "प्रमुख पात्रता:"),
  "Profile Match": ("प्रोफाइल जुळवणी", "प्रोफाइल मिलान"),

  # BenefitSynergyPage
  "MULTI-SCHEME OPTIMIZATION & ANTI-DUPLICATION ENGINE": ("बहु-योजना समन्वय आणि डुप्लिकेशन प्रतिबंधक प्रणाली", "बहु-योजना समन्वय एवं दोहराव रोधी प्रणाली"),
  "Scheme Combination & Benefit Synergy Analysis": ("योजना संयोजन व लाभ समन्वय मूल्यांकन", "योजना संयोजन एवं लाभ समन्वय विश्लेषण"),
  "Evaluate how departmental agricultural, water, and energy schemes can be jointly utilized for your parcel without violating CAG double-subsidy prohibitions. Review compatibility rules, statutory exclusions, and separate survey mandates.": (
    "कॅगच्या दुहेरी अनुदान प्रतिबंधाचे उल्लंघन न करता तुमच्या जमिनीसाठी कृषी, जल आणि ऊर्जा योजनांचा एकत्र लाभ कसा घेता येईल याचे मूल्यांकन करा.",
    "सीएजी के दोहरे सब्सिडी निषेध का उल्लंघन किए बिना अपनी भूमि हेतु कृषि, जल और ऊर्जा योजनाओं के संयुक्त लाभ का मूल्यांकन करें।"
  ),
  "Download Advisory PDF": ("मार्गदर्शक प्रत (PDF) डाउनलोड करा", "परामर्श पत्र (PDF) डाउनलोड करें"),
  "महत्त्वाची वैधानिक सूचना (Statutory Public Advisory: Anti-Double Subsidy Rule)": ("महत्त्वाची वैधानिक सूचना: दुहेरी अनुदान प्रतिबंधक नियम", "महत्वपूर्ण वैधानिक सलाह: दोहरा अनुदान निषेध नियम"),
  "Government subsidies cannot be automatically bunched, co-funded on the same physical asset, or claimed through a single combined voucher. Each approved scheme requires an independent online application via official portals (MahaDBT / Mahavitaran), autonomous field survey, geo-tagged GPS photographs, and separate empanelled vendor billing. Claiming duplicate subsidies on the same physical machinery is a punishable civil offense under Maharashtra Audit Norms.": (
    "एकाच यंत्रावर किंवा मालमत्तेवर दोन वेगवेगळ्या योजनांतून अनुदान घेणे महाराष्ट्र लेखापरीक्षण नियमांनुसार कायदेशीर गुन्हा आहे. प्रत्येक योजनेसाठी महाडीबीटी पोर्टलवर स्वतंत्र अर्ज, प्रत्यक्ष स्थळ पाहणी आणि स्वतंत्र देयक आवश्यक असते.",
    "एक ही मशीन या संपत्ति पर दो अलग-अलग योजनाओं से सब्सिडी लेना लेखापरीक्षण नियमों के अनुसार कानूनन अपराध है। प्रत्येक योजना के लिए महाडीबीटी पोर्टल पर स्वतंत्र आवेदन और अलग बिलिंग अनिवार्य है।"
  ),
  "Analyzed Programs": ("विश्लेषण केलेल्या योजना", "विश्लेषित योजनाएं"),
  "Recommended Package": ("शिफारस केलेले संयोजन", "अनुशंसित पैकेज"),
  "Conflict Interceptions": ("प्रतिबंधित योजना संयोग", "निषेधित योजना टकराव"),
  "Combined Public Relief": ("एकत्रित संभाव्य लाभ", "संयुक्त संभावित लाभ"),
  "Maharashtra Civic Scheme Compatibility Index": ("महाराष्ट्र नागरी योजना सुसंगतता निर्देशांक", "महाराष्ट्र नागरिक योजना संगतता सूचकांक"),
  "Fully Compatible (Safe)": ("पूर्णपणे सुसंगत (सुरक्षित)", "पूर्णतः संगत (सुरक्षित)"),
  "Conditional (Clearance Needed)": ("सशर्त (परवानगी आवश्यक)", "सशर्त (अनुमति आवश्यक)"),
  "Mutually Exclusive (Illegal)": ("परस्पर विरोधी (अवैध)", "परस्पर विरोधी (अवैध)"),
  "Recommended Complementary Synergy (Safe to Combine)": ("शिफारस केलेले सुरक्षित योजना संयोजन", "अनुशंसित सुरक्षित योजना संयोजन"),
  "Prohibited Combinations (CAG Double Subsidy Conflict)": ("प्रतिबंधित योजना संयोजन (कॅग दुहेरी अनुदान बंदी)", "प्रतिबंधित संयोजन (सीएजी दोहराव रोक)"),

  # FraudCheckerPage
  "Fraud / Scam Scheme Detector": ("बनावट / फसवणूक योजना शोधक", "फर्जी / धोखाधड़ी योजना पहचान"),
  "Verify SMS, WhatsApp forwards, APK download links, and fake registration demands before paying any fee.": (
    "कोणतेही शुल्क भरण्यापूर्वी बनावट एसएमएस, व्हॉट्सअ‍ॅप संदेश आणि अनधिकृत ॲप लिंक्सची पडताळणी करा.",
    "कोई भी शुल्क देने से पहले फर्जी एसएमएस, व्हाट्सएप संदेश और अनधिकृत ऐप लिंक की प्रामाणिकता जांचें।"
  ),
  "PASTE SUSPICIOUS NOTIFICATION / SMS TO AUDIT:": ("तपासण्यासाठी संशयास्पद संदेश किंवा एसएमएस येथे टाका:", "जांच के लिए संदिग्ध संदेश या एसएमएस यहाँ पेस्ट करें:"),
  "Analyze Message for Fraud": ("फसवणूक तपासणी करा", "धोखाधड़ी की जांच करें"),
  "Auditing Threat Indicators...": ("धोकादायक बाबींची तपासणी सुरू आहे...", "सुरक्षा मानकों की जांच जारी है..."),
  "VERIFIED AUTHENTIC NOTICE": ("अधिकृत शासकीय सूचना प्रमाणित", "प्रमाणित आधिकारिक सूचना"),
  "CRITICAL PHISHING & SCAM DETECTED": ("धोकादायक सायबर फसवणूक आढळली!", "गंभीर साइबर धोखाधड़ी का पता चला!"),

  # CitizenProfilePage
  "Citizen Profile Dashboard": ("नागरिक प्रोफाइल डॅशबोर्ड", "नागरिक प्रोफाइल डैशबोर्ड"),
  "Review your household parameters, land titles, and linked DBT bank status": (
    "आपली कौटुंबिक माहिती, सातबारा जमीन नोंद आणि आधार संलग्न बँक खाते तपासा",
    "अपने पारिवारिक विवरण, 7/12 भूमि रिकॉर्ड और आधार लिंक बैंक स्थिति की समीक्षा करें"
  ),
  "Edit Profile": ("प्रोफाइल संपादित करा", "प्रोफाइल संपादित करें"),
  "Save Profile": ("प्रोफाइल जतन करा", "प्रोफाइल सहेजें"),
  "Personal & Household Identity": ("वैयक्तिक व कौटुंबिक माहिती", "व्यक्तिगत एवं पारिवारिक पहचान"),
  "Agricultural Landholding (7/12 Extract)": ("शेतजमीन माहिती (७/१२ उतारा)", "कृषि भूमि विवरण (7/12 खतौनी)"),
  "Direct Benefit Transfer (DBT) Bank Status": ("थेट बँक हस्तांतरण (DBT) बँक स्थिती", "प्रत्यक्ष लाभ अंतरण (DBT) बैंक स्थिति"),
  "Aadhaar NPCI Mapping Status": ("आधार NPCI मॅपर स्थिती", "आधार NPCI मैपर स्थिति"),
  "Active & Linked": ("सक्रिय व जोडलेले", "सक्रिय एवं लिंक"),
  "Selected Focus Areas": ("निवडलेली प्राधान्य क्षेत्रे", "चयनित प्राथमिकता क्षेत्र"),

  # EligibilityCheckerPage
  "Citizen Eligibility Wizard": ("नागरिक पात्रता चाचणी सहाय्यक", "नागरिक पात्रता जांच सहायक"),
  "Check eligibility for 33+ Maharashtra & Central Government Schemes": ("३३+ महाराष्ट्र व केंद्र सरकारच्या योजनांसाठी पात्रता तपासा", "33+ महाराष्ट्र और केंद्र सरकार की योजनाओं के लिए पात्रता जांचें"),
  "Step 1: Personal & Demographic Details": ("टप्पा १: वैयक्तिक व सामाजिक माहिती", "चरण १: व्यक्तिगत एवं सामाजिक विवरण"),
  "Step 2: Landholding & Water Resources": ("टप्पा २: शेतजमीन व सिंचन सुविधा", "चरण २: कृषि भूमि और सिंचाई संसाधन"),
  "Step 3: Household Income & Economic Criteria": ("टप्पा ३: कौटुंबिक उत्पन्न व आर्थिक वर्ग", "चरण ३: पारिवारिक आय एवं आर्थिक मानदंड"),
  "Step 4: Location & Verification": ("टप्पा ४: जिल्हा, तालुका व पडताळणी", "चरण ४: स्थान एवं अंतिम सत्यापन"),
  "Full Name": ("पूर्ण नाव", "पूरा नाम"),
  "Age (Years)": ("वय (वर्षे)", "आयु (वर्ष)"),
  "Gender": ("लिंग", "लिंग"),
  "Social Category / Caste": ("सामाजिक प्रवर्ग / जात", "सामाजिक श्रेणी / जाति"),
  "Cultivable Landholding (Acres)": ("एकूण वहिवाट शेतजमीन (एकर)", "कुल कृषि भूमि (एकड़)"),
  "Irrigation / Water Source": ("पाण्याचा स्त्रोत / सिंचन", "सिंचाई / जल स्रोत"),
  "Annual Family Income": ("वार्षिक कौटुंबिक उत्पन्न", "वार्षिक पारिवारिक आय"),
  "District": ("जिल्हा", "जिला"),
  "Taluka": ("तालुका", "तहसील / तालुका"),
  "Village": ("गाव", "गाँव"),
  "Previous": ("मागील", "पिछला"),
  "Next Step": ("पुढील टप्पा", "अगला चरण"),
  "Calculate My Eligible Schemes": ("माझ्या पात्र योजना शोधा", "मेरी पात्र योजनाएं खोजें"),

  # EligibilityResultsPage
  "Eligibility Evaluation Results": ("पात्रता मूल्यांकन निकाल", "पात्रता मूल्यांकन परिणाम"),
  "Based on your validated socio-economic profile and 2024-25 Maharashtra Government Gazettes": (
    "तुमच्या नोंदवलेल्या माहितीवर आणि महाराष्ट्र शासन राजपत्रावर आधारित",
    "आपके सत्यापित विवरण और महाराष्ट्र शासन राजपत्रों पर आधारित"
  ),
  "ELIGIBLE SCHEMES": ("पात्र योजना", "पात्र योजनाएं"),
  "NEEDS REVIEW / MISSING PREREQUISITES": ("पुनरावलोकन आवश्यक / कागदपत्रे अपूर्ण", "समीक्षा आवश्यक / दस्तावेज अपूर्ण"),
  "NOT ELIGIBLE": ("सध्या अपात्र", "वर्तमान में अपात्र"),
  "Download Eligibility Dossier": ("पात्रता अहवाल डाउनलोड करा", "पात्रता रिपोर्ट डाउनलोड करें"),
  "Start Official Application": ("अधिकृत अर्ज सुरू करा", "आधिकारिक आवेदन शुरू करें"),

  # TrackerPage
  "Scheme Journey Map & Application Tracker": ("योजना अर्ज प्रवास व मागोवा", "योजना आवेदन यात्रा एवं ट्रैकर"),
  "Stage 1: Eligibility": ("टप्पा १: पात्रता", "चरण १: पात्रता"),
  "Stage 2: Documents": ("टप्पा २: कागदपत्रे", "चरण २: दस्तावेज"),
  "Stage 3: Application": ("टप्पा ३: ऑनलाइन अर्ज", "चरण ३: ऑनलाइन आवेदन"),
  "Stage 4: Verification": ("टप्पा ४: शासकीय पडताळणी", "चरण ४: सत्यापन"),
  "Stage 5: Benefit": ("टप्पा ५: थेट बँक लाभ (DBT)", "चरण ५: प्रत्यक्ष लाभ (DBT)"),
  "Current Stage": ("सद्य स्थिती", "वर्तमान स्थिति"),
  "Action Checklist": ("आवश्यक कृती यादी", "कार्य सूची"),
  "Mandatory Documents Required": ("आवश्यक अनिवार्य कागदपत्रे", "अनिवार्य आवश्यक दस्तावेज"),
  "Official Direct Application Link": ("अधिकृत थेट अर्ज पोर्टल लिंक", "आधिकारिक सीधा आवेदन लिंक"),

  # SavedSchemesPage
  "Saved Welfare Schemes": ("जतन केलेल्या कल्याणकारी योजना", "सहेजी गई कल्याणकारी योजनाएं"),
  "Bookmark schemes to monitor application deadlines, review required documents, or compare benefits.": (
    "अर्जाची अंतिम मुदत, आवश्यक कागदपत्रे आणि लाभांची तुलना करण्यासाठी योजना जतन करा.",
    "आवेदन की अंतिम तिथि, आवश्यक दस्तावेज और लाभों की तुलना करने के लिए योजनाएं सहेजें।"
  ),
  "Compare Saved Schemes": ("जतन योजनांची तुलना करा", "सहेजी गई योजनाओं की तुलना करें"),
  "Share / Export Checklist": ("यादी शेअर / एक्सपोर्ट करा", "चेकलिस्ट साझा / निर्यात करें"),
  "No Saved Schemes Yet": ("अद्याप कोणतीही योजना जतन केलेली नाही", "अभी तक कोई योजना सहेजी नहीं गई"),
  "Browse schemes and click the bookmark icon to save them to your citizen profile.": (
    "योजना शोधा आणि आपल्या प्रोफाइलमध्ये सेव्ह करण्यासाठी बुकमार्क चिन्हावर क्लिक करा.",
    "योजनाएं ब्राउज़ करें और अपनी प्रोफ़ाइल में सहेजने के लिए बुकमार्क आइकन पर क्लिक करें।"
  ),
  "Browse Directory": ("योजना निर्देशिका पहा", "योजना निर्देशिका देखें")
}
