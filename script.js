// --- START OF FILE script.js ---

        document.getElementById('currentYear').textContent = new Date().getFullYear();

        let navigationHistory = [];
        let currentPage = 'home';
        let allProductsData = [];
        let cart = [];
        let orders = [];
        let currentFilteredProducts = [];
        let isLoadingProducts = false;

        const domElements = {
            cartCount: document.getElementById('cartCount'),
            cartIcon: document.getElementById('cartIcon'),
            cartModal: document.getElementById('cartModal'),
            cartClose: document.getElementById('cartClose'),
            cartItemsDisplay: document.getElementById('cartItemsDisplay'),
            emptyCartMsg: document.getElementById('emptyCartMsg'),
            cartTotalValue: document.getElementById('cartTotalValue'),
            checkoutBtnCart: document.getElementById('checkoutBtnCart'),
            fabContainer: document.getElementById('fabContainer'),
            contactFabMain: document.getElementById('contactFabMain'),
            toast: document.getElementById('toast'),
            menuIcon: document.getElementById('menuIcon'),
            allProductsIcon: document.getElementById('allProductsIcon'),
            ordersIcon: document.getElementById('ordersIcon'),
            ordersNotification: document.getElementById('ordersNotification'),
            mainFooter: document.getElementById('mainFooter'),
            header: document.querySelector('.header'),
            pages: {
                home: document.getElementById('homePage'),
                products: document.getElementById('productsPage'),
                productDetail: document.getElementById('productDetailPage'),
                cart: document.getElementById('cartPage'),
                checkout: document.getElementById('checkoutPage'),
                orderConfirmation: document.getElementById('orderConfirmationPage'),
                about: document.getElementById('aboutPage'),
                orders: document.getElementById('ordersPage'),
                terms: document.getElementById('termsPage'),
                privacy: document.getElementById('privacyPage'),
                refund: document.getElementById('refundPage')
            },
            checkoutForm: document.getElementById('checkoutForm'),
            allProductsGrid: document.getElementById('allProductsGrid'),
            noProductsMessage: document.getElementById('noProductsMessage'),
            orderItemsCheckout: document.getElementById('orderItemsCheckout'),
            orderTotalCheckout: document.getElementById('orderTotalCheckout'),
            searchInput: document.getElementById('searchInput'),
            desktopSearchButton: document.getElementById('desktopSearchButton'),
            mobileHeaderSearchIcon: document.getElementById('mobileHeaderSearchIcon'),
            mobileSearchInput: document.getElementById('mobileSearchInput'),
            mobileBoxSearchButton: document.getElementById('mobileBoxSearchButton'),
            mobileSearchContainer: document.querySelector('.mobile-search-container'),
            productsPageTitle: document.getElementById('productsPageTitle'),
            featuredCoursesGrid: document.getElementById('featuredCoursesGrid'),
            popularSubscriptionsGrid: document.getElementById('popularSubscriptionsGrid'),
            topSoftwareGrid: document.getElementById('topSoftwareGrid'),
            latestEbooksGrid: document.getElementById('latestEbooksGrid'),
            ordersListContainer: document.getElementById('ordersListContainer'),
            noOrdersMessage: document.getElementById('noOrdersMessage'),
            offCanvasMenu: document.getElementById('offCanvasMenu'),
            offCanvasOverlay: document.getElementById('offCanvasOverlay'),
            offCanvasClose: document.getElementById('offCanvasClose'),
            cartPageContent: document.getElementById('cartPageContent'),
            emptyCartPage: document.getElementById('emptyCartPage')
        };

        let initialLoadPending = true;
        let currentNavigationContext = { id: null, searchTerm: null };

        function createSlug(name) {
            if (!name) return '';
            return name.toString().toLowerCase()
                .replace(/\s+/g, '-')           // Replace spaces with -
                .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
                .replace(/\-\-+/g, '-')         // Replace multiple - with single -
                .replace(/^-+/, '')             // Trim - from start of text
                .replace(/-+$/, '');            // Trim - from end of text
        }

        function getProductBySlug(category, slug) {
            const productsToSearch = (allProductsData && allProductsData.length > 0) ? allProductsData : generateDemoProducts();
            return productsToSearch.find(p => p.category === category && p.slug === slug);
        }

        function startGuaranteedSkeletonDisplay() {
            showGuaranteedSkeletonForHomepage();
            const bannerImageContainer = document.querySelector('#homePage .banner-image-container');
            if (bannerImageContainer) {
                const skeleton = bannerImageContainer.querySelector('.skeleton');
                if (skeleton) skeleton.style.display = 'block';
                const img = bannerImageContainer.querySelector('img.image-fade-in');
                if (img) img.classList.remove('loaded');
            }
        }

        function showGuaranteedSkeletonForHomepage() {
            const gridsToSkeletonize = [
                domElements.featuredCoursesGrid, domElements.popularSubscriptionsGrid,
                domElements.topSoftwareGrid, domElements.latestEbooksGrid
            ];
            gridsToSkeletonize.forEach(grid => {
                if (grid) {
                    const existingContent = grid.querySelectorAll('.product-card:not(.skeleton-card)');
                    existingContent.forEach(content => content.style.display = 'none');
                    showSkeletonCards(grid, window.innerWidth <= 768 ? 2 : 3, true);
                }
            });
        }

        function displayActualContent() {
            const gridsToUpdate = [
                domElements.featuredCoursesGrid, domElements.popularSubscriptionsGrid,
                domElements.topSoftwareGrid, domElements.latestEbooksGrid
            ];
            gridsToUpdate.forEach(grid => {
                if (grid) {
                    removeSkeletonCards(grid);
                    const hiddenContent = grid.querySelectorAll('.product-card:not(.skeleton-card)');
                    hiddenContent.forEach(content => content.style.display = 'flex');
                }
            });

            if (allProductsData && allProductsData.length > 0) {
                populateFeaturedProducts();
            } else {
                populateFeaturedProducts();
            }

            const bannerImg = document.querySelector('#homePage .banner-image-container img.image-fade-in');
            if (bannerImg) {
                setupSingleImageLoading(bannerImg, () => {
                    const bannerContainer = bannerImg.closest('.banner-image-container');
                    if (bannerContainer) {
                        const skeleton = bannerContainer.querySelector('.skeleton');
                        if (skeleton) skeleton.style.display = 'none';
                    }
                });
            } else {
                const bannerImageContainer = document.querySelector('#homePage .banner-image-container');
                if (bannerImageContainer) {
                    const skeleton = bannerImageContainer.querySelector('.skeleton');
                    if (skeleton) skeleton.style.display = 'none';
                    const placeholder = bannerImageContainer.querySelector('.image-placeholder-text');
                    if (placeholder) placeholder.style.display = 'block';
                }
            }
        }

        function generateDemoProducts() {
            return [

              // নতুন কার্ড add 👇👇
              {
    id: 1,
    name: `CAPCUT PRO (pc version)`,
    description: `Watermark ছাড়া Full HD/4K Export, আনলকড প্রিমিয়াম ফিচার, Smooth Slow Motion, এবং আরো অনেক কিছু!`,
    longDescription: `
    🔥 প্রো-লেভেলের ভিডিও এডিটিং এখন আরও সহজ ও স্মার্ট!

আপনি কি আপনার ভিডিও এডিটিং স্কিলকে আরও এক ধাপ এগিয়ে নিতে চান?
CapCut Pro নিয়ে এসেছে প্রিমিয়াম সব ফিচার, যা দেবে আপনাকে একদম প্রফেশনাল এবং হাই-কোয়ালিটি এডিটিং অভিজ্ঞতা — দ্রুত, সহজ, এবং watermark ছাড়া।
✅ আমাদের থেকে কেন CapCut Pro নেবেন?

✔ LIFETIME সাপোর্ট
✔ একসাথে পাবেন ইন্সটলেশন গাইডলাইন ভিডিও
✔ অসংখ্য প্রিমিয়াম টেম্পলেট ব্যবহারের সুবিধা
✔ তাৎক্ষণিক সমস্যা সমাধানের জন্য রেসপন্স
✔ কাজ না করলে বা সমস্যার সমাধান না পেলে ১০০% মানিব্যাক গ্যারান্টি

🎁 সীমিত সময়ের জন্য বিশেষ অফার চলছে!
এখনই অর্ডার করুন এবং উপভোগ করুন প্রিমিয়াম ফিচারসমূহ:

✨ CapCut Pro এর ফিচার সমূহ

✔ Watermark ছাড়া Full HD ও 4K Export
✔ আনলকড সমস্ত Premium Effects, Transitions ও Templates
✔ Auto Caption + AI Voice Sync
✔ Smooth Slow Motion এবং Speed Ramping
✔ No Ads ও Ultra-Fast Rendering
✔ ১০০% নিরাপদ

📦 অর্ডার করার পর আপনি কীভাবে এক্সেস পাবেন?

👉 অর্ডার কনফার্ম করার সর্বোচ্চ ১৫ মিনিটের মধ্যে, আপনার প্রদানকৃত ইমেইল অ্যাড্রেসে একটি কনফার্মেশন মেইল পাঠানো হবে।

✉️ ঐ মেইলের মধ্যে থাকবে:

    ✅ CapCut Pro Access Link
    ✅ Extension Setup Guide (ভিডিওসহ)
    ✅ প্রয়োজনীয় তথ্য ও নির্দেশনা

⏱ যদি নির্ধারিত সময়ের মধ্যে মেইল না পান, তাহলে দ্রুত আমাদের WhatsApp এ যোগাযোগ করুন।

`,
    category: "software",
    price: 249,
    image: "product_images/CAPCUT PRO.png",
    isFeatured: true
},
// ⬇️ Add new product object below this line, inside the array ⬇️


{
    id: 4,
    name: `CANVA PRO (official)`,
    description: `আপনার ডিজাইনের মুক্ত জগতে প্রবেশ করুন!
Watermark ছাড়া HD এক্সপোর্ট, হাজারো প্রিমিয়াম টেমপ্লেট, Background Remover, Magic Resize সহ অসাধারণ সব ফিচারে`,
    longDescription: ` আপনার ডিজাইনিং অভিজ্ঞতাকে করে আরও সহজ, স্মার্ট এবং প্রফেশনাল।

🎨 প্রিমিয়াম ডিজাইন রিসোর্স

    ✅ ১০০ মিলিয়নেরও বেশি Premium Photos, Videos, Graphics & Elements
    ✅ হাজার হাজার Pro Templates (Social Media, Presentation, Resume, Poster, Logo, etc.)

🚀 অ্যাডভান্সড ডিজাইন টুলস

    ✅ Background Remover – মাত্র এক ক্লিকে ছবি থেকে ব্যাকগ্রাউন্ড রিমুভ
    ✅ Magic Resize – এক ক্লিকে ডিজাইনকে বিভিন্ন সোশ্যাল মিডিয়া সাইজে রিসাইজ
    ✅ Brand Kit – নিজের ব্র্যান্ডের লোগো, কালার, ফন্ট এক জায়গায় সংরক্ষণ
    ✅ Content Planner – সময় অনুযায়ী পোস্ট শিডিউল করে অটোমেটিক পাবলিশ

🎞️ ভিডিও এডিটিং ফিচারস

    ✅ Drag & Drop Video Editor
    ✅ Pre-built Video Templates
    ✅ Smooth Animation, Transitions, & Effects
    ✅ Stock Videos + Audio Library

📦 এক্সপোর্ট এবং আউটপুট অপশন

    ✅ Watermark ছাড়া High-Resolution Download (PNG, JPG, PDF, MP4)
    ✅ Transparent Background Export
    ✅ Animation Video Export

🔒 অতিরিক্ত সুবিধাসমূহ

    ✅ No Ads – সম্পূর্ণ বিজ্ঞাপন মুক্ত অভিজ্ঞতা
    ✅ Cloud Storage – ডিজাইন সংরক্ষণের জন্য পর্যাপ্ত জায়গা
    ✅ Cross Device Access – মোবাইল, ট্যাব ও পিসিতে একই অ্যাকাউন্টে কাজ করুন

⭐ বিশেষভাবে উপকারী:

    • সোশ্যাল মিডিয়া মার্কেটার
    • ডিজাইনার
    • অনলাইন বিজনেস ও ব্র্যান্ড
    • ফ্রিল্যান্সার ও প্রেজেন্টেশন নির্মাতা
    • ইউটিউবার এবং কনটেন্ট ক্রিয়েটরদের জন্য

📦 অর্ডার করার পর Canva Pro অ্যাক্সেস কীভাবে পাবেন?

আমাদের কাছ থেকে Canva Pro সাবস্ক্রিপশন অর্ডার করার পর, খুব সহজেই আপনার এক্সেস পেয়ে যাবেন মাত্র কয়েকটি ধাপে।

🕒 ⏳ ডেলিভারি টাইম

আপনার অর্ডার কনফার্ম হওয়ার সর্বোচ্চ ১৫ মিনিটের মধ্যে আমরা আপনার প্রদানকৃত ইমেইলে একটি কনফার্মেশন মেইল পাঠিয়ে দেব।

🔐 Canva Pro Access Formats (আমরা যেভাবে অ্যাক্সেস দিই):
🅰️ Team Invite (Personal Email দিয়ে এক্সেস)

    • আপনি আপনার ব্যক্তিগত ইমেইল (যেটা Canva অ্যাকাউন্টে ব্যবহৃত) আমাদের দিবেন।
    • আমরা আপনাকে Canva Pro Team-এ ইনভাইট করবো।
    • আপনি মেইলে একটি Team Invite Link পাবেন।
    • লিংকে ক্লিক করে Team-এ Join করলেই আপনার ফ্রি অ্যাকাউন্টটি আপগ্রেড হয়ে যাবে Canva Pro এ।

🛡️ নিরাপত্তা ও মানিব্যাক গ্যারান্টি

    • এক্সেস না পেলে বা সমস্যা সমাধান সম্ভব না হলে ১০০% মানিব্যাক গ্যারান্টি।
    • আমরা প্রতিটি অর্ডার হাতে ধরে সাপোর্ট দিয়ে থাকি যাতে আপনি নিশ্চিন্তে প্রোডাক্ট ব্যবহার `,
    category: "subscription",
    price: 0,
    image: "product_images/CANVAPRO.png",
    isFeatured: true,
    durations: [
        { label: `6 MONTH`, price: 49 },
        { label: `1 YEAR`, price: 99 },
        { label: `3 YEARS`, price: 149 }
    ]
},
// ⬇️ Add new product object below this line, inside the array ⬇️

{
    id: 6,
    name: `CHAT-GPT (personal)`,
    description: `GPT‑4o, 4.1, 4.5 সহ আনলিমিটেড প্রিমিয়াম ফিচার
আগে এক্সেস দেখে নিন, তারপর পেমেন্ট!`,
    longDescription: `💡আপনি এখন পাচ্ছেন ChatGPT‑র সর্বশেষ ও সবচেয়ে পাওয়ারফুল ভার্সন –
GPT‑4o, GPT‑4.1, এবং GPT‑4.5 সহ ফুল ফিচার আনলকড!

🔍 বিশেষ সুবিধা – আগে এক্সেস দেখে নিন, তারপর পেমেন্ট!

আমরা আপনাকে পেমেন্টের আগে একটি লাইভ Access Preview দেখার সুযোগ দিচ্ছি।
যাতে আপনি নিজেই দেখে নিতে পারেন, আপনি ঠিক কী পাচ্ছেন।

📲 Access চেক করতে আমাদের Whatsapp support এ যোগাযোগ করুন।

✅ আপনি যা যা পাচ্ছেন:

    • GPT-4o, 4.1, 4.5 – আনলিমিটেড এক্সেস
    • PDF, Docs, Google Drive, Dropbox, GitHub কানেক্ট
    • Custom GPT, Canvas, Task, Project Tool
    • AI Agents (Research Mode, Codex)
    • নিজের ইমেইলে Access
    • ২৪/৭ Fast Support

💰 মূল্য:

📆 ১ মাস (৩০ দিন): মাত্র ৪৯৯ টাকা
🧾 একবার পেমেন্ট → ফুল প্রিমিয়াম এক্সেস

🛡️ নিরাপত্তা:

    • আগে Access দেখুন → তারপর পেমেন্ট
    • মানিব্যাক গ্যারান্টি
    • ১৫ মিনিটের মধ্যে ইমেইলে ডেলিভারি`,
    category: "subscription",
    price: 0,
    image: "product_images/Chatgpt1.png",
    isFeatured: true,
    durations: [
        { label: `1 MONTH`, price: 499 }
    ]
},
// ⬇️ Add new product object below this line, inside the array ⬇️




{
    id: 11,
    name: `WASENDER (official licensekey)`,
    description: `WhatsApp Marketing Software – আপনার বিক্রি বাড়ানোর সহজ সমাধান!
দৈনিক ১২০০+ ইউজারকে ফ্রি মেসেজ সেন্ড, টার্গেটেড নাম্বার ও ইমেইল কালেক্ট, এক ক্লিকে গ্রুপ মেম্বার বের করা, শিডিউল মেসেজ, এন্টি ব্লকিংসহ ২০+ স্মার্ট টুলস।`,
    longDescription: `✅ WhatsApp Marketing Software কেন ব্যবহার করবেন?

🔹 ১২০০+ ইউজারকে একদিনেই ফ্রি মেসেজ করুন!
আপনি প্রতিদিন সম্পূর্ণ ফ্রি-তে ১২০০+ মানুষকে হোয়াটসঅ্যাপে প্রোমোশনাল মেসেজ পাঠাতে পারবেন – টেক্সট, ছবি, ভিডিও বা অডিওসহ।

🔹 টার্গেটেড অডিয়েন্স তৈরি করুন একদম ফ্রি!
Google, Facebook, Instagram, LinkedIn, TikTok এবং Telegram থেকে আপনার কাঙ্ক্ষিত অডিয়েন্সের মোবাইল নম্বর ও ইমেইল সংগ্রহ করুন যে কোনো দেশের, যে কোনো শহরের জন্য।

🔹 মার্কেটিং খরচ কমান, বিক্রি বাড়ান!
ফ্রি প্রোমোশনাল মেসেজ সেন্ড করে কোনো খরচ ছাড়াই আপনার পণ্য বা সার্ভিসের সেল বৃদ্ধি করুন।

🔹 ২০+ স্মার্ট টুলস একসাথে!
১ ক্লিকে শত শত ইউজারকে গ্রুপে জয়েন করানো, যে কোনো হোয়াটসঅ্যাপ গ্রুপ থেকে মেম্বারদের নম্বর বের করা, অটোমেটিক নাম্বার জেনারেশন, অটো বট সেটআপসহ থাকছে ২০টিরও বেশি প্রয়োজনীয় ফিচার।

🔹 অ্যাকশন বাটন – বিক্রির জন্যে তৈরি!
লিংক বা ফোন নম্বর দিয়ে সহজেই Buy Now এবং Call Us বাটন যোগ করুন।

🔹 নাম্বার ফিল্টার ও শিডিউল সেন্ডিং!
কোন নাম্বার হোয়াটসঅ্যাপে একটিভ তা ফিল্টার করুন, প্রযোজনীয় নাম্বারগুলো একসাথে ডাউনলোড করুন ও শিডিউল করে মেসেজ সেন্ড করুন।

🔹 এন্টি ব্লকিং টেকনোলজি ও মাল্টি একাউন্ট!
হোয়াটসঅ্যাপে নিরাপদে মেসেজ পাঠাতে এন্টি ব্লকিং সিস্টেম আছে, চাইলে একাধিক হোয়াটসঅ্যাপ একাউন্ট থেকেও মেসেজ করতে পারবেন।
📌 আমাদের থেকে কেন নিবেন?

✅ প্রফেশনাল টিম:
আমাদের এক্সপার্ট ডেভেলপার এবং সাপোর্ট টিম সবসময় প্রস্তুত যে কোনো সমস্যার দ্রুত সমাধান দিতে।

✅ সহজ গাইডলাইন:
আপনাকে হোয়াটসঅ্যাপের গাইডলাইন অনুযায়ী বাল্ক মেসেজিং শেখাই, সফটওয়্যার একটিভ ও ইনস্টল করে দেই, সবকিছু সহজে বুঝিয়ে দেই এবং কিছু ফ্রি ট্রিক্সও শিখিয়ে দেই।

✅ লাইফটাইম সাপোর্ট:
কোনো সমস্যা হলে লাইফটাইম সাপোর্ট পাবেন – কোনো ঝামেলা নেই!


⚙️ ব্যবহার সংক্রান্ত শর্তাবলী:

✅ সফটওয়্যারটি শুধু Windows PC তে চলবে।
✅ ১টি কম্পিউটারের জন্য ১টি লাইসেন্স – ১টি লাইসেন্স দিয়ে ১টি কম্পিউটারে ব্যবহার করতে পারবেন।

আপনার হোয়াটসঅ্যাপ মার্কেটিংকে এক ধাপ এগিয়ে নিতে আজই আমাদের সাথে যুক্ত হোন! 🚀📈`,
    category: "subscription",
    price: 0,
    image: "product_images/WASENDERR.png",
    isFeatured: true,
    durations: [
        { label: `6 MONTH`, price: 699 },
        { label: `1 YEAR`, price: 999 },
        { label: `LIFETIME`, price: 1999 }
    ]
},
// ⬇️ Add new product object below this line, inside the array ⬇️


{
    id: 21,
    name: `WINDOWS 7 PRODUCT KEY`,
    description: `💻 Windows 7 লাইসেন্স কী – 100% জেনুইন ও আজীবনের এক্টিভেশন!
Microsoft-এর অফিসিয়াল Activation Key, ইমেইলে ডেলিভারি। একবার এক্টিভ করলে আজীবন ব্যবহার করুন। Windows 7-এর সকল প্রিমিয়াম ফিচার আনলক হবে। প্রয়োজন হলে রিমোট সাপোর্ট পাওয়া যাবে।`,
    longDescription: `আজীবনের পার্মানেন্ট এক্টিভেশন


✅ আপনি যা পাচ্ছেন:

🔹 Microsoft Windows 7-এর অফিশিয়াল Activation/Product Key
🔹 “Activate Windows” লেখা থেকে মুক্তি এবং সকল প্রিমিয়াম ফিচার আনলক
🔹 এক্সক্লুসিভ পার্মানেন্ট এক্টিভেশন (একটি পিসির জন্য)
🔹 ডেলিভারি হবে কেবল ইমেইলের মাধ্যমে – কোনো DVD, পেনড্রাইভ বা বক্স নয়


🔧 এক্টিভেশন প্রক্রিয়া:

✔ নতুন করে Windows ইনস্টল না দিয়েও Activation Key বসিয়ে সরাসরি এক্টিভ করা যাবে
✔ Settings > Activation > Change Product Key থেকে কী বসিয়ে দিন
✔ এক্টিভেশন মুহূর্তের মধ্যে সম্পন্ন হবে
✔ নতুন করে Windows ইনস্টল বা রিসেট দিলেও আবার কী দিয়ে এক্টিভ করা যাবে
✔ মাদারবোর্ড পরিবর্তন না করলে এক্টিভেশন লাইফটাইম থাকবে


📩 ডেলিভারি ও সাপোর্ট:

📧 অর্ডার করার পর ১০-৩০ মিনিটের মধ্যে আপনার ইমেইলে দেওয়া হবে:
• Activation Key
• বিস্তারিত এক্টিভেশন টিউটোরিয়াল (ভিডিও)
• Microsoft-এর অফিসিয়াল Windows 7 ISO ডাউনলোড লিংক

🕘 সাপোর্ট সময়: সকাল ১০টা – রাত ১২টা
🕚 রাত ১২টার পর অর্ডার করলে পরের দিন সকাল ১০টার পরে ডেলিভারি দেওয়া হবে

❗ ডেলিভারি বা Activation-এ সমস্যা হলে WhatsApp সাপোর্টে যোগাযোগ করুন:
👉 https://wa.me/8801645431905


🛠️ সহায়তা ও গ্যারান্টি:

🖥️ Activation সমস্যা হলে আমরা রিমোট সাপোর্ট প্রদান করি
⚠️ নতুন Windows ইনস্টল বা সেটআপ নিজ দায়িত্বে করতে হবে, আমরা Official ISO লিংক দিয়ে সহায়তা করব
🔒 হার্ডওয়্যার পরিবর্তন না হলে একবার এক্টিভেশন হলেই আজীবনের জন্য সাপোর্ট থাকবে
🔒 ১ বছরের রিফান্ড গ্যারান্টি (শর্ত প্রযোজ্য)`,
    category: "subscription",
    price: 0,
    image: "product_images/windows7pro.png",
    isFeatured: false,
    durations: [
        { label: `Windows 7 Home Basic Key`, price: 299 },
        { label: `Windows 7 Home Premium Key`, price: 349 },
        { label: `Windows 7 Ultimate Key`, price: 299 },
        { label: `Windows 7 Professional Key`, price: 349 }
    ]
},
// ⬇️ Add new product object below this line, inside the array ⬇️


{
    id: 22,
    name: `WINDOWS 8 PRODUCT KEY`,
    description: `💻 Windows 8 লাইসেন্স কী – 100% জেনুইন ও আজীবনের এক্টিভেশন!
Microsoft-এর অফিসিয়াল Activation Key, ইমেইলে ডেলিভারি। একবার এক্টিভ করলে আজীবন ব্যবহার করুন। Windows 8-এর সকল প্রিমিয়াম ফিচার আনলক হবে। প্রয়োজন হলে রিমোট সাপোর্ট পাওয়া যাবে।`,
    longDescription: `আজীবনের পার্মানেন্ট এক্টিভেশন


✅ আপনি যা পাচ্ছেন:

🔹 Microsoft Windows 8-এর অফিশিয়াল Activation/Product Key
🔹 “Activate Windows” লেখা থেকে মুক্তি এবং সকল প্রিমিয়াম ফিচার আনলক
🔹 এক্সক্লুসিভ পার্মানেন্ট এক্টিভেশন (একটি পিসির জন্য)
🔹 ডেলিভারি হবে কেবল ইমেইলের মাধ্যমে – কোনো DVD, পেনড্রাইভ বা বক্স নয়


🔧 এক্টিভেশন প্রক্রিয়া:

✔ নতুন করে Windows ইনস্টল না দিয়েও Activation Key বসিয়ে সরাসরি এক্টিভ করা যাবে
✔ Settings > Activation > Change Product Key থেকে কী বসিয়ে দিন
✔ এক্টিভেশন মুহূর্তের মধ্যে সম্পন্ন হবে
✔ নতুন করে Windows ইনস্টল বা রিসেট দিলেও আবার কী দিয়ে এক্টিভ করা যাবে
✔ মাদারবোর্ড পরিবর্তন না করলে এক্টিভেশন লাইফটাইম থাকবে


📩 ডেলিভারি ও সাপোর্ট:

📧 অর্ডার করার পর ১০-৩০ মিনিটের মধ্যে আপনার ইমেইলে দেওয়া হবে:
• Activation Key
• বিস্তারিত এক্টিভেশন টিউটোরিয়াল (ভিডিও)
• Microsoft-এর অফিসিয়াল Windows 8 ISO ডাউনলোড লিংক

🕘 সাপোর্ট সময়: সকাল ১০টা – রাত ১২টা
🕚 রাত ১২টার পর অর্ডার করলে পরের দিন সকাল ১০টার পরে ডেলিভারি দেওয়া হবে

❗ ডেলিভারি বা Activation-এ সমস্যা হলে WhatsApp সাপোর্টে যোগাযোগ করুন:
👉 https://wa.me/8801645431905


🛠️ সহায়তা ও গ্যারান্টি:

🖥️ Activation সমস্যা হলে আমরা রিমোট সাপোর্ট প্রদান করি
⚠️ নতুন Windows ইনস্টল বা সেটআপ নিজ দায়িত্বে করতে হবে, আমরা Official ISO লিংক দিয়ে সহায়তা করব
🔒 হার্ডওয়্যার পরিবর্তন না হলে একবার এক্টিভেশন হলেই আজীবনের জন্য সাপোর্ট থাকবে
🔒 ১ বছরের রিফান্ড গ্যারান্টি (শর্ত প্রযোজ্য)`,
    category: "subscription",
    price: 0,
    image: "product_images/windows8pro.png",
    isFeatured: false,
    durations: [
        { label: `Windows 8 Professional Key`, price: 299 },
        { label: `Windows 8.1 Professional Key`, price: 349 }
    ]
},
// ⬇️ Add new product object below this line, inside the array ⬇️



{
    id: 23,
    name: `WINDOWS 10 PRODUCT KEY`,
    description: `💻 Windows 10 লাইসেন্স কী – 100% জেনুইন ও আজীবনের এক্টিভেশন!
Microsoft-এর অফিসিয়াল Activation Key, ইমেইলে ডেলিভারি। একবার এক্টিভ করলে আজীবন ব্যবহার করুন। Windows 10-এর সকল প্রিমিয়াম ফিচার আনলক হবে। প্রয়োজন হলে রিমোট সাপোর্ট পাওয়া যাবে।`,
    longDescription: `আজীবনের পার্মানেন্ট এক্টিভেশন


✅ আপনি যা পাচ্ছেন:

🔹 Microsoft Windows 10-এর অফিশিয়াল Activation/Product Key
🔹 “Activate Windows” লেখা থেকে মুক্তি এবং সকল প্রিমিয়াম ফিচার আনলক
🔹 এক্সক্লুসিভ পার্মানেন্ট এক্টিভেশন (একটি পিসির জন্য)
🔹 ডেলিভারি হবে কেবল ইমেইলের মাধ্যমে – কোনো DVD, পেনড্রাইভ বা বক্স নয়


🔧 এক্টিভেশন প্রক্রিয়া:

✔ নতুন করে Windows ইনস্টল না দিয়েও Activation Key বসিয়ে সরাসরি এক্টিভ করা যাবে
✔ Settings > Activation > Change Product Key থেকে কী বসিয়ে দিন
✔ এক্টিভেশন মুহূর্তের মধ্যে সম্পন্ন হবে
✔ নতুন করে Windows ইনস্টল বা রিসেট দিলেও আবার কী দিয়ে এক্টিভ করা যাবে
✔ মাদারবোর্ড পরিবর্তন না করলে এক্টিভেশন লাইফটাইম থাকবে


📩 ডেলিভারি ও সাপোর্ট:

📧 অর্ডার করার পর ১০-৩০ মিনিটের মধ্যে আপনার ইমেইলে দেওয়া হবে:
• Activation Key
• বিস্তারিত এক্টিভেশন টিউটোরিয়াল (ভিডিও)
• Microsoft-এর অফিসিয়াল Windows 10 ISO ডাউনলোড লিংক

🕘 সাপোর্ট সময়: সকাল ১০টা – রাত ১২টা
🕚 রাত ১২টার পর অর্ডার করলে পরের দিন সকাল ১০টার পরে ডেলিভারি দেওয়া হবে

❗ ডেলিভারি বা Activation-এ সমস্যা হলে WhatsApp সাপোর্টে যোগাযোগ করুন:
👉 https://wa.me/8801645431905


🛠️ সহায়তা ও গ্যারান্টি:

🖥️ Activation সমস্যা হলে আমরা রিমোট সাপোর্ট প্রদান করি
⚠️ নতুন Windows ইনস্টল বা সেটআপ নিজ দায়িত্বে করতে হবে, আমরা Official ISO লিংক দিয়ে সহায়তা করব
🔒 হার্ডওয়্যার পরিবর্তন না হলে একবার এক্টিভেশন হলেই আজীবনের জন্য সাপোর্ট থাকবে
🔒 ১ বছরের রিফান্ড গ্যারান্টি (শর্ত প্রযোজ্য)`,
    category: "subscription",
    price: 0,
    image: "product_images/windows10pro.png",
    isFeatured: false,
    durations: [
        { label: `Windows 10 Pro Key`, price: 399 },
        { label: `Windows 10 Home Key`, price: 399 },
        { label: `Windows 10 Enterprise Key`, price: 449 }
    ]
},
// ⬇️ Add new product object below this line, inside the array ⬇️



{
    id: 24,
    name: `WINDOWS 11 PRODUCT KEY`,
    description: `💻 Windows 11 লাইসেন্স কী – 100% জেনুইন ও আজীবনের এক্টিভেশন!
Microsoft-এর অফিসিয়াল Activation Key, ইমেইলে ডেলিভারি। একবার এক্টিভ করলে আজীবন ব্যবহার করুন। Windows 11-এর সকল প্রিমিয়াম ফিচার আনলক হবে। প্রয়োজন হলে রিমোট সাপোর্ট পাওয়া যাবে।`,
    longDescription: `আজীবনের পার্মানেন্ট এক্টিভেশন


✅ আপনি যা পাচ্ছেন:

🔹 Microsoft Windows 11-এর অফিশিয়াল Activation/Product Key
🔹 “Activate Windows” লেখা থেকে মুক্তি এবং সকল প্রিমিয়াম ফিচার আনলক
🔹 এক্সক্লুসিভ পার্মানেন্ট এক্টিভেশন (একটি পিসির জন্য)
🔹 ডেলিভারি হবে কেবল ইমেইলের মাধ্যমে – কোনো DVD, পেনড্রাইভ বা বক্স নয়


🔧 এক্টিভেশন প্রক্রিয়া:

✔ নতুন করে Windows ইনস্টল না দিয়েও Activation Key বসিয়ে সরাসরি এক্টিভ করা যাবে
✔ Settings > Activation > Change Product Key থেকে কী বসিয়ে দিন
✔ এক্টিভেশন মুহূর্তের মধ্যে সম্পন্ন হবে
✔ নতুন করে Windows ইনস্টল বা রিসেট দিলেও আবার কী দিয়ে এক্টিভ করা যাবে
✔ মাদারবোর্ড পরিবর্তন না করলে এক্টিভেশন লাইফটাইম থাকবে


📩 ডেলিভারি ও সাপোর্ট:

📧 অর্ডার করার পর ১০-৩০ মিনিটের মধ্যে আপনার ইমেইলে দেওয়া হবে:
• Activation Key
• বিস্তারিত এক্টিভেশন টিউটোরিয়াল (ভিডিও)
• Microsoft-এর অফিসিয়াল Windows 11 ISO ডাউনলোড লিংক

🕘 সাপোর্ট সময়: সকাল ১০টা – রাত ১২টা
🕚 রাত ১২টার পর অর্ডার করলে পরের দিন সকাল ১০টার পরে ডেলিভারি দেওয়া হবে

❗ ডেলিভারি বা Activation-এ সমস্যা হলে WhatsApp সাপোর্টে যোগাযোগ করুন:
👉 https://wa.me/8801645431905


🛠️ সহায়তা ও গ্যারান্টি:

🖥️ Activation সমস্যা হলে আমরা রিমোট সাপোর্ট প্রদান করি
⚠️ নতুন Windows ইনস্টল বা সেটআপ নিজ দায়িত্বে করতে হবে, আমরা Official ISO লিংক দিয়ে সহায়তা করব
🔒 হার্ডওয়্যার পরিবর্তন না হলে একবার এক্টিভেশন হলেই আজীবনের জন্য সাপোর্ট থাকবে
🔒 ১ বছরের রিফান্ড গ্যারান্টি (শর্ত প্রযোজ্য)`,
    category: "subscription",
    price: 0,
    image: "product_images/WINDOWS11pro.png",
    isFeatured: false,
    durations: [
        { label: `Windows 11 Pro Key`, price: 499 },
        { label: `Windows 11 Home Key`, price: 499 },
        { label: `Windows 11 Enterprise Key`, price: 549 }
    ]
},
// ⬇️ Add new product object below this line, inside the array ⬇️



























































            // নতুন কার্ড add  👆👆


            ];
        }

        async function fetchProducts(forceRefresh = false) {
            if (isLoadingProducts || (allProductsData.length > 0 && !forceRefresh && !initialLoadPending)) { return; }
            isLoadingProducts = true;
            try {
                allProductsData = generateDemoProducts().map(p => ({...p, slug: createSlug(p.name)}));
                if (!Array.isArray(allProductsData)) { throw new Error("Invalid product data format."); }
                updateCategoryCountsInDOM();
                if (currentPage === 'home') { displayActualContent(); }
                if (domElements.pages.products.classList.contains('active')) { filterProducts(currentNavigationContext?.id || 'all', currentNavigationContext?.searchTerm); }
            } catch (error) {
                console.error("Could not load products:", error); allProductsData = []; showToast('Error loading products.', 'error critical');
                const gridsToClearOnError = [ domElements.featuredCoursesGrid, domElements.popularSubscriptionsGrid, domElements.topSoftwareGrid, domElements.latestEbooksGrid, domElements.allProductsGrid ];
                gridsToClearOnError.forEach(grid => { if(grid) removeSkeletonCards(grid); });
                allProductsData = generateDemoProducts().map(p => ({...p, slug: createSlug(p.name)})); // Fallback
                if (currentPage === 'home') { displayActualContent(); }
            } finally { isLoadingProducts = false; if (initialLoadPending) initialLoadPending = false; }
        }

        function createSkeletonCard(isFeaturedCard = false) {
            const skeletonCard = document.createElement('div'); skeletonCard.className = 'skeleton-card'; skeletonCard.setAttribute('data-skeleton', 'true');
            let buttonsHTML = isFeaturedCard ? `<div class="skeleton-card-button skeleton-loading full-width"></div>` : `<div class="skeleton-card-button skeleton-loading"></div><div class="skeleton-card-button skeleton-loading"></div>`;
            skeletonCard.innerHTML = `<div class="skeleton-card-image"><div class="skeleton-loading"></div></div><div class="skeleton-card-content"><div class="skeleton-card-title skeleton-loading"></div><div class="skeleton-card-description skeleton-loading"></div><div class="skeleton-card-description skeleton-loading"></div><div class="skeleton-card-price skeleton-loading"></div><div class="skeleton-card-buttons">${buttonsHTML}</div></div>`;
            return skeletonCard;
        }
        function showSkeletonCards(container, count = 6, isFeaturedCard = false) { if (!container) return; removeSkeletonCards(container); for (let i = 0; i < count; i++) { container.appendChild(createSkeletonCard(isFeaturedCard)); } }
        function removeSkeletonCards(container) { if (!container) return; container.querySelectorAll('[data-skeleton="true"]').forEach(card => card.remove()); }
        function showSkeletonForProductsPage() { if (isLoadingProducts || !domElements.allProductsGrid) return; showSkeletonCards(domElements.allProductsGrid, window.innerWidth <= 768 ? 6 : 9, false); if (domElements.noProductsMessage) domElements.noProductsMessage.style.display = 'none'; }
        function getProductById(id) { const productsToSearch = (allProductsData && allProductsData.length > 0) ? allProductsData : generateDemoProducts(); return productsToSearch.find(product => product.id === parseInt(id, 10)); }

        function addToCart(productData) {
            if (!productData || typeof productData.id === 'undefined') { console.error("Invalid product data to addToCart:", productData); showToast('Invalid product.', 'error'); return; }
            let priceToAdd = parseFloat(productData.price); let selectedDurationLabel = null;
            const detailDurationSelector = document.getElementById(`duration-detail-${productData.id}`);
            if (detailDurationSelector && detailDurationSelector.value) { const selectedOption = detailDurationSelector.options[detailDurationSelector.selectedIndex]; priceToAdd = parseFloat(selectedOption.value); selectedDurationLabel = selectedOption.text.split(' - ')[0];
            } else if (productData.currentSelectedPrice) { priceToAdd = parseFloat(productData.currentSelectedPrice); if (Array.isArray(productData.durations)) { const durationInfo = productData.durations.find(d => parseFloat(d.price) === priceToAdd); if (durationInfo) selectedDurationLabel = durationInfo.label; } }
            const existingItem = cart.find(item => item.id === productData.id && parseFloat(item.price) === priceToAdd && (item.selectedDurationLabel || null) === (selectedDurationLabel || null) );
            if (existingItem) { existingItem.quantity = (existingItem.quantity || 1) + 1; showToast(`${productData.name}${selectedDurationLabel ? ` (${selectedDurationLabel})` : ''} quantity updated!`, 'info');
            } else { cart.push({ ...productData, price: priceToAdd, quantity: 1, selectedDurationLabel: selectedDurationLabel }); showToast(`${productData.name}${selectedDurationLabel ? ` (${selectedDurationLabel})` : ''} added to cart!`, 'success'); }
            updateCart();
        }

        function updateCart() { updateCartCount(); updateCheckoutPageOrderSummary(); updateCartPage(); saveCartToLocalStorage(); }
        function updateCartCount() { if (!domElements.cartCount) return; domElements.cartCount.textContent = cart.reduce((sum, item) => sum + (item.quantity || 1), 0); domElements.cartCount.style.display = parseInt(domElements.cartCount.textContent) > 0 ? 'flex' : 'none'; }

        function updateCartPage() {
            if (!domElements.cartPageContent || !domElements.emptyCartPage) return;
            if (cart.length === 0) { domElements.cartPageContent.innerHTML = ''; domElements.cartPageContent.style.display = 'none'; domElements.emptyCartPage.style.display = 'flex'; return; }
            domElements.emptyCartPage.style.display = 'none'; domElements.cartPageContent.style.display = 'block'; let total = 0;
            domElements.cartPageContent.innerHTML = `<h2 class="section-title">Your Shopping Cart</h2><div class="cart-items-list" id="cartPageItemsList"></div><div class="cart-summary"><div class="cart-total-row"><span>Total Amount:</span><span id="cartPageTotal">৳0.00</span></div></div><div class="cart-actions"><button class="cart-checkout-btn" id="cartPageCheckoutBtn"><i class="fas fa-credit-card"></i> Proceed to Checkout</button><button class="continue-shopping" onclick="navigateTo('products', 'all')"><i class="fas fa-store"></i> Continue Shopping</button></div>`;
            const cartItemsListElement = document.getElementById('cartPageItemsList');
            cart.forEach(item => {
                const itemTotal = parseFloat(item.price) * (item.quantity || 1);
                const displayName = item.selectedDurationLabel ? `${item.name} (${item.selectedDurationLabel})` : item.name;
                const itemRow = document.createElement('div'); itemRow.className = 'cart-item-row';
                itemRow.innerHTML = `<div class="cart-item-details"><div class="cart-item-name">${displayName}</div><div class="cart-item-price">৳${parseFloat(item.price).toFixed(2)} each</div><div class="quantity-controls"><button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, -1, ${item.price}, '${item.selectedDurationLabel || ''}')"><i class="fas fa-minus"></i></button><span class="quantity-display">${item.quantity || 1}</span><button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, 1, ${item.price}, '${item.selectedDurationLabel || ''}')"><i class="fas fa-plus"></i></button></div></div><div class="cart-item-actions"><div style="font-weight:600;margin-bottom:1rem;color:var(--primary-color);">৳${itemTotal.toFixed(0)}</div><button class="remove-item-btn" onclick="removeFromCart(${item.id}, ${item.price}, '${item.selectedDurationLabel || ''}')"><i class="fas fa-trash"></i> Remove</button></div>`;
                cartItemsListElement.appendChild(itemRow); total += itemTotal;
            });
            document.getElementById('cartPageTotal').textContent = `৳${total.toFixed(2)}`;
            const cartPageCheckoutBtn = document.getElementById('cartPageCheckoutBtn');
            if (cartPageCheckoutBtn) { cartPageCheckoutBtn.addEventListener('click', () => { if (cart.length > 0) { navigateTo('checkout', null, null, true); } else { showToast("Your cart is empty.", 'error'); } }); }
        }

        function updateCartItemQuantity(productId, change, itemPrice, itemDurationLabel) {
            const durationToMatch = itemDurationLabel === 'null' || itemDurationLabel === '' ? null : itemDurationLabel;
            const itemIndex = cart.findIndex(item => item.id === productId && parseFloat(item.price) === parseFloat(itemPrice) && (item.selectedDurationLabel || null) === durationToMatch);
            if (itemIndex > -1) { cart[itemIndex].quantity = Math.max(1, (cart[itemIndex].quantity || 1) + change); updateCart(); const displayName = cart[itemIndex].selectedDurationLabel ? `${cart[itemIndex].name} (${cart[itemIndex].selectedDurationLabel})` : cart[itemIndex].name; showToast(`${displayName} quantity ${change > 0 ? 'increased' : 'decreased'}!`, 'info'); }
        }
        function removeFromCart(productId, itemPrice, itemDurationLabel) {
            const durationToMatch = itemDurationLabel === 'null' || itemDurationLabel === '' ? null : itemDurationLabel;
            const itemIndex = cart.findIndex(item => item.id === productId && parseFloat(item.price) === parseFloat(itemPrice) && (item.selectedDurationLabel || null) === durationToMatch);
            if (itemIndex > -1) { const itemName = cart[itemIndex].name; const itemDuration = cart[itemIndex].selectedDurationLabel; cart.splice(itemIndex, 1); updateCart(); const displayName = itemDuration ? `${itemName} (${itemDuration})` : itemName; showToast(`${displayName} removed from cart.`, 'info'); }
        }

        function saveCartToLocalStorage() { localStorage.setItem('thinkPlusBDCart', JSON.stringify(cart)); }
        function loadCartFromLocalStorage() { const storedCart = localStorage.getItem('thinkPlusBDCart'); if (storedCart) { try { cart = JSON.parse(storedCart); if (!Array.isArray(cart)) cart = []; } catch (e) { console.error("Error parsing cart:", e); cart = []; } } updateCart(); }
        function loadOrdersFromLocalStorage() { const storedOrders = localStorage.getItem('thinkPlusBDLocalOrders'); if (storedOrders) { try { orders = JSON.parse(storedOrders); if (!Array.isArray(orders)) orders = []; orders = orders.map(o => ({ ...o, viewed: o.viewed === true, timestamp: o.timestamp || new Date(0).toISOString() })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5); } catch (e) { console.error("Error parsing orders:", e); orders = []; localStorage.removeItem('thinkPlusBDLocalOrders'); } } else { orders = []; } updateOrdersNotification(); }
        function saveOrdersToLocalStorage() { orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); if (orders.length > 5) { orders = orders.slice(0, 5); } localStorage.setItem('thinkPlusBDLocalOrders', JSON.stringify(orders)); updateOrdersNotification(); }
        function saveUpdatedOrdersToLocalStorage(updatedServerOrders) { const serverOrdersMap = new Map(updatedServerOrders.map(so => [so.id, so])); let processedOrders = orders.map(localOrder => { const serverOrder = serverOrdersMap.get(localOrder.id); if (serverOrder) { return { ...localOrder, ...serverOrder, viewed: localOrder.viewed || (serverOrder.status && serverOrder.status.toLowerCase() !== 'pending') }; } return localOrder; }); updatedServerOrders.forEach(serverOrder => { if (!processedOrders.some(po => po.id === serverOrder.id)) { processedOrders.push({ ...serverOrder, viewed: (serverOrder.status && serverOrder.status.toLowerCase() !== 'pending') }); } }); processedOrders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); if (processedOrders.length > 5) { processedOrders = processedOrders.slice(0, 5); } localStorage.setItem('thinkPlusBDLocalOrders', JSON.stringify(processedOrders)); orders = JSON.parse(JSON.stringify(processedOrders)); updateOrdersNotification(); }
        function updateOrdersNotification() { const unreadCount = orders.filter(order => order.viewed === false).length; const displayCount = unreadCount > 9 ? '9+' : unreadCount.toString(); [domElements.ordersNotification, document.getElementById('bottomNavOrdersNotification')].forEach(el => { if (el) { el.style.display = unreadCount > 0 ? 'flex' : 'none'; if (unreadCount > 0) el.textContent = displayCount; } }); }
        function markAllOrdersAsViewed() { let changed = false; orders = orders.map(order => { if (order.viewed === false) { changed = true; return { ...order, viewed: true }; } return order; }); if (changed) { saveOrdersToLocalStorage(); } else { updateOrdersNotification(); } }
        function handleSearch(term) { const lowerCaseTerm = term.toLowerCase().trim(); const body = document.body; if (lowerCaseTerm === "") { if (body.classList.contains('show-mobile-search')) { body.classList.remove('show-mobile-search'); } if (currentPage === 'products') { filterProducts(currentNavigationContext?.id || 'all', null); } return; } navigateTo('products', 'all', lowerCaseTerm); if (window.innerWidth <= 768 && body.classList.contains('show-mobile-search')) { body.classList.remove('show-mobile-search'); } }
        function updateBodyClassForSearchVisibility(pageName) { const body = document.body; body.classList.remove('on-home-page', 'on-products-page', 'on-product-detail-page'); if (pageName === 'home') body.classList.add('on-home-page'); else if (pageName === 'products') body.classList.add('on-products-page'); else if (pageName === 'productDetail') body.classList.add('on-product-detail-page'); const searchableMobilePages = ['home', 'products']; if (!searchableMobilePages.includes(pageName) && body.classList.contains('show-mobile-search')) { body.classList.remove('show-mobile-search'); } }
        function openOffCanvasMenu() { if(domElements.offCanvasMenu) domElements.offCanvasMenu.classList.add('active'); if(domElements.offCanvasOverlay) domElements.offCanvasOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
        function closeOffCanvasMenu() { if(domElements.offCanvasMenu) domElements.offCanvasMenu.classList.remove('active'); if(domElements.offCanvasOverlay) domElements.offCanvasOverlay.classList.remove('active'); document.body.style.overflow = ''; }
        function updateCategoryCountsInDOM() { const dataToUse = (allProductsData && allProductsData.length > 0) ? allProductsData : generateDemoProducts(); const categoryCounts = { course: 0, subscription: 0, software: 0, ebook: 0 }; dataToUse.forEach(product => { if (categoryCounts.hasOwnProperty(product.category)) { categoryCounts[product.category]++; } }); const categoryDisplayMap = { course: { id: 'category-count-course', singular: 'Premium Course', plural: 'Premium Courses' }, subscription: { id: 'category-count-subscription', singular: 'Premium Service', plural: 'Premium Services' }, software: { id: 'category-count-software', singular: 'Bundle Package', plural: 'Bundle Packages' }, ebook: { id: 'category-count-ebook', singular: 'Digital Guide', plural: 'Digital Guides' } }; for (const key in categoryCounts) { const element = document.getElementById(categoryDisplayMap[key].id); if (element) { const count = categoryCounts[key]; element.textContent = `${count} ${count === 1 ? categoryDisplayMap[key].singular : categoryDisplayMap[key].plural}`; } } }
        function setupSingleImageLoading(imgElement, onImageLoadCallback) { if (!imgElement) return; const container = imgElement.closest('.banner-image-container, .product-card-image-container, .product-detail-main-image-container, .related-product-image-container'); if (!container) { if (imgElement.complete && imgElement.naturalHeight !== 0) { imgElement.classList.add('loaded'); } else { imgElement.onload = () => imgElement.classList.add('loaded'); } if (typeof onImageLoadCallback === 'function') { onImageLoadCallback(); } return; } const skeleton = container.querySelector('.skeleton'); const placeholderText = container.querySelector('.image-placeholder-text'); const handleLoad = () => { if (skeleton) { skeleton.style.display = 'none'; } imgElement.classList.add('loaded'); if (placeholderText) placeholderText.style.display = 'none'; if (typeof onImageLoadCallback === 'function') { onImageLoadCallback(); } }; const handleError = () => { if (skeleton) { skeleton.style.display = 'none'; } imgElement.style.display = 'none'; if (placeholderText) placeholderText.style.display = 'block'; if (typeof onImageLoadCallback === 'function') { onImageLoadCallback(); } }; if (imgElement.complete && imgElement.naturalHeight !== 0) { handleLoad(); } else { imgElement.onload = handleLoad; imgElement.onerror = handleError; if (imgElement.complete && imgElement.naturalHeight !== 0) { handleLoad(); } } }
        function setupImageLoading() { document.querySelectorAll('img.image-fade-in').forEach(img => setupSingleImageLoading(img)); }

        function setupEventListeners() {
            if (domElements.cartIcon) { domElements.cartIcon.addEventListener('click', () => { navigateTo('cart'); }); }
            if (domElements.cartClose) { domElements.cartClose.addEventListener('click', () => { domElements.cartModal.style.display = 'none'; }); }
            if (domElements.checkoutBtnCart) { domElements.checkoutBtnCart.addEventListener('click', () => { if (cart.length === 0) { showToast('Your cart is empty! Cannot proceed to checkout.', 'error'); return; } domElements.cartModal.style.display = 'none'; navigateTo('checkout'); }); }
            window.addEventListener('click', (event) => { if (domElements.cartModal && event.target === domElements.cartModal) { domElements.cartModal.style.display = 'none'; } });
            if (domElements.contactFabMain) { domElements.contactFabMain.addEventListener('click', (e) => { e.stopPropagation(); domElements.fabContainer.classList.toggle('active'); }); }
            document.addEventListener('click', (e) => { if (domElements.fabContainer && !domElements.fabContainer.contains(e.target) && domElements.fabContainer.classList.contains('active')) { domElements.fabContainer.classList.remove('active'); } });
            if (domElements.menuIcon) domElements.menuIcon.addEventListener('click', openOffCanvasMenu);
            if (domElements.offCanvasClose) domElements.offCanvasClose.addEventListener('click', closeOffCanvasMenu);
            if (domElements.offCanvasOverlay) domElements.offCanvasOverlay.addEventListener('click', closeOffCanvasMenu);
            if (domElements.allProductsIcon) { domElements.allProductsIcon.addEventListener('click', () => navigateTo('products', 'all')); }
            if (domElements.ordersIcon) { domElements.ordersIcon.addEventListener('click', () => navigateTo('orders')); }
            window.addEventListener('resize', () => { updateBodyClassForSearchVisibility(getPageName()); if (getPageName() === 'home') { showGuaranteedSkeletonForHomepage(); displayActualContent(); } if (window.innerWidth > 768 && document.body.classList.contains('show-mobile-search')) { document.body.classList.remove('show-mobile-search'); } });
            if (domElements.desktopSearchButton && domElements.searchInput) { domElements.desktopSearchButton.addEventListener('click', () => { handleSearch(domElements.searchInput.value); }); }
            if (domElements.searchInput) { domElements.searchInput.addEventListener('keypress', function(event) { if (event.key === 'Enter') { event.preventDefault(); handleSearch(this.value); } }); }
            if (domElements.mobileHeaderSearchIcon && domElements.mobileSearchContainer) { domElements.mobileHeaderSearchIcon.addEventListener('click', () => { const body = document.body; const searchableMobilePages = ['home', 'products']; if (searchableMobilePages.includes(getPageName())) { body.classList.toggle('show-mobile-search'); if (body.classList.contains('show-mobile-search') && domElements.mobileSearchInput) { domElements.mobileSearchInput.focus(); } } else { showToast("Search is available on Home and Products pages.", "info"); body.classList.remove('show-mobile-search'); } }); }
            if (domElements.mobileBoxSearchButton && domElements.mobileSearchInput) { domElements.mobileBoxSearchButton.addEventListener('click', () => { handleSearch(domElements.mobileSearchInput.value); }); }
            if (domElements.mobileSearchInput) { domElements.mobileSearchInput.addEventListener('keypress', function(event) { if (event.key === 'Enter') { event.preventDefault(); handleSearch(this.value); this.blur(); } }); }
            if (domElements.checkoutForm) { domElements.checkoutForm.addEventListener('submit', (event) => { event.preventDefault(); placeOrder(); }); }
            setupEnglishCheckoutForm();
            setupImageLoading();
        }

        function showToast(message, type = 'info', duration = 3000) { const toastElement = domElements.toast; if (!toastElement) return; if (toastElement.timerId) { clearTimeout(toastElement.timerId); } toastElement.textContent = message; toastElement.className = 'toast show'; if (type === 'success') toastElement.classList.add('success'); else if (type === 'error') toastElement.classList.add('error'); else if (type === 'error critical') toastElement.classList.add('error', 'critical'); else if (type === 'info') toastElement.classList.add('info'); toastElement.offsetHeight; toastElement.timerId = setTimeout(() => { toastElement.className = 'toast'; toastElement.timerId = null; }, duration); }

        function getPageName() {
            const path = window.location.pathname;
            const page = path.split("/").pop();
            if (page === '' || page === 'index.html') return 'home';
            if (page === 'products.html') return 'products';
            if (page === 'product-detail.html') return 'product';
            if (page === 'cart.html') return 'cart';
            if (page === 'checkout.html') return 'checkout';
            if (page === 'order-confirmation.html') return 'orderConfirmation';
            if (page === 'about.html') return 'about';
            if (page === 'orders.html') return 'orders';
            if (page === 'terms.html') return 'terms';
            if (page === 'privacy.html') return 'privacy';
            if (page === 'refund.html') return 'refund';
            return 'home'; // Default to home
        }

        function navigateTo(pageName, context = null, searchTerm = null) {
            let url = '';
            switch (pageName) {
                case 'home': url = 'index.html'; break;
                case 'products': url = 'products.html'; break;
                case 'product': url = 'product-detail.html'; break;
                case 'cart': url = 'cart.html'; break;
                case 'checkout': url = 'checkout.html'; break;
                case 'orderConfirmation': url = 'order-confirmation.html'; break;
                case 'about': url = 'about.html'; break;
                case 'orders': url = 'orders.html'; break;
                case 'terms': url = 'terms.html'; break;
                case 'privacy': url = 'privacy.html'; break;
                case 'refund': url = 'refund.html'; break;
                default: url = 'index.html';
            }

            const params = new URLSearchParams();
            if (context) {
                if (pageName === 'products') {
                    params.set('category', context);
                } else if (pageName === 'product') {
                    params.set('product', context);
                }
            }
            if (searchTerm) {
                params.set('search', searchTerm);
            }

            const queryString = params.toString();
            if (queryString) {
                url += '?' + queryString;
            }

            window.location.href = url;
        }

        function renderProductCard(product, isFeaturedCard = false) {
            if (!product || typeof product.id === 'undefined') { console.error("Invalid product data for card:", product); const e = document.createElement('div'); e.innerHTML = "<p>Err</p>"; return e; }
            const card = document.createElement('div'); card.className = 'product-card'; card.setAttribute('data-id', product.id);
            const imageContainer = document.createElement('div'); imageContainer.className = 'product-card-image-container';
            const skeletonDiv = document.createElement('div'); skeletonDiv.className = 'skeleton'; imageContainer.appendChild(skeletonDiv);
            const placeholderTextSpan = document.createElement('span'); placeholderTextSpan.className = 'image-placeholder-text'; placeholderTextSpan.style.display = 'none'; placeholderTextSpan.textContent = `Image for ${product.name}`; imageContainer.appendChild(placeholderTextSpan);
            if (product.image && product.image !== 'path/to/default-product-image.jpg') { const img = document.createElement('img'); img.src = product.image; img.alt = product.name; img.className = 'image-fade-in'; imageContainer.appendChild(img); setupSingleImageLoading(img); } else { skeletonDiv.style.display = 'none'; placeholderTextSpan.style.display = 'block'; }
            let buttonsHTML = isFeaturedCard ? `<button class="view-details-card full-width-button">View Details</button>` : `<button class="buy-now-card">Buy Now</button><button class="view-details-card">View Details</button>`;

            let priceToDisplayNum;
            if (product.category === 'subscription' && Array.isArray(product.durations) && product.durations.length > 0) {
                priceToDisplayNum = Math.min(...product.durations.map(d => parseFloat(d.price)));
            } else {
                priceToDisplayNum = parseFloat(product.price);
            }
            const formattedPrice = Math.floor(priceToDisplayNum);
            let priceDisplay = `৳${formattedPrice}`;

            const durationInfoHTML = ''; const tempDiv = document.createElement('div'); tempDiv.appendChild(imageContainer);
            card.innerHTML = `${tempDiv.innerHTML}<div class="product-card-content"><div class="product-card-header"><h3>${product.name || 'Unnamed Product'}</h3></div><p class="description">${product.description || 'No description available.'}</p>${durationInfoHTML}<div class="price">${priceDisplay}</div><div class="product-actions">${buttonsHTML}</div></div>`;
            const buyNowButton = card.querySelector('.buy-now-card'); if (buyNowButton) { buyNowButton.addEventListener('click', (e) => { e.stopPropagation(); handleProductCardBuyNow(product.id); }); }
            const viewDetailsButton = card.querySelector('.view-details-card'); if (viewDetailsButton) { viewDetailsButton.addEventListener('click', (e) => { e.stopPropagation(); navigateTo('product', `${product.category}/${product.slug}`); }); }
            const titleElement = card.querySelector('h3'); if (titleElement) { titleElement.addEventListener('click', (e) => { e.stopPropagation(); navigateTo('product', `${product.category}/${product.slug}`); }); }
            const cardImageContainerInCard = card.querySelector('.product-card-image-container'); if (cardImageContainerInCard) { cardImageContainerInCard.addEventListener('click', (e) => { e.stopPropagation(); navigateTo('product', `${product.category}/${product.slug}`); }); }
            return card;
        }

        function populateFeaturedProducts() {
            const dataToUse = (allProductsData && allProductsData.length > 0) ? allProductsData : generateDemoProducts();
            if (!dataToUse || dataToUse.length === 0) { const grids = [domElements.featuredCoursesGrid, domElements.popularSubscriptionsGrid, domElements.topSoftwareGrid, domElements.latestEbooksGrid]; grids.forEach(grid => { if (grid) { removeSkeletonCards(grid); grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#999;">No featured products.</p>'; } }); return; }
            const featuredConfigs = { course: { grid: domElements.featuredCoursesGrid, limit: 3, mobileLimit: 2 }, subscription: { grid: domElements.popularSubscriptionsGrid, limit: 3, mobileLimit: 2 }, software: { grid: domElements.topSoftwareGrid, limit: 3, mobileLimit: 2 }, ebook: { grid: domElements.latestEbooksGrid, limit: 3, mobileLimit: 2 } };
            for (const category in featuredConfigs) { const config = featuredConfigs[category]; if (config.grid) { removeSkeletonCards(config.grid); config.grid.innerHTML = ''; const productsForCategory = dataToUse.filter(p => p.category === category && p.isFeatured); const limit = window.innerWidth <= 768 ? config.mobileLimit : config.limit; const displayedProducts = productsForCategory.slice(0, limit); if (displayedProducts.length > 0) { displayedProducts.forEach(product => config.grid.appendChild(renderProductCard(product, true))); } else { config.grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#999;">No featured ${category}s.</p>`; } } }
            setupImageLoading();
        }

        function filterProducts(category, searchTerm = null) {
            const grid = domElements.allProductsGrid; const noProductsMsg = domElements.noProductsMessage; if (!grid || !noProductsMsg) return;
            removeSkeletonCards(grid); grid.innerHTML = ''; const dataToUse = (allProductsData && allProductsData.length > 0) ? allProductsData : generateDemoProducts();
            if ((!dataToUse || dataToUse.length === 0) && !isLoadingProducts) { noProductsMsg.textContent = 'Products unavailable.'; noProductsMsg.style.display = 'block'; return; }
            if (isLoadingProducts) { showSkeletonForProductsPage(); return; }
            let tempFilteredProducts;
            if (category === 'all') { tempFilteredProducts = [...dataToUse]; if(domElements.productsPageTitle) domElements.productsPageTitle.textContent = "All Our Products"; } else { tempFilteredProducts = dataToUse.filter(p => p.category === category); if(domElements.productsPageTitle) domElements.productsPageTitle.textContent = `Our ${category.charAt(0).toUpperCase() + category.slice(1)}s`; }
            if (searchTerm && searchTerm.trim() !== "") { const lowerCaseSearchTerm = searchTerm.toLowerCase().trim(); tempFilteredProducts = tempFilteredProducts.filter(product => (product.name && product.name.toLowerCase().includes(lowerCaseSearchTerm)) || (product.description && product.description.toLowerCase().includes(lowerCaseSearchTerm)) || (product.category && product.category.toLowerCase().includes(lowerCaseSearchTerm)) ); }
            currentFilteredProducts = [...tempFilteredProducts];
            if (tempFilteredProducts.length === 0) { noProductsMsg.textContent = 'No products found.'; noProductsMsg.style.display = 'block'; } else { noProductsMsg.style.display = 'none'; tempFilteredProducts.forEach(product => grid.appendChild(renderProductCard(product, false))); }
            setupImageLoading();
        }

        function showProductDetail(productId) {
            let product = getProductById(productId); const detailPageElement = domElements.pages.productDetail; if (!product || !detailPageElement) { console.error(`Product ${productId} not found or detail page missing.`); showToast('Product details unavailable.', 'error'); navigateTo('products', 'all'); return; }
            product = { ...product }; delete product.currentSelectedPrice;
            const imageContainer = document.createElement('div'); imageContainer.className = 'product-detail-main-image-container'; const skeletonDiv = document.createElement('div'); skeletonDiv.className = 'skeleton'; imageContainer.appendChild(skeletonDiv); const placeholderTextSpan = document.createElement('span'); placeholderTextSpan.className = 'image-placeholder-text'; placeholderTextSpan.style.display = 'none'; placeholderTextSpan.textContent = `Image for ${product.name}`; imageContainer.appendChild(placeholderTextSpan);
            if (product.image && product.image !== 'path/to/default-product-image.jpg') { const img = document.createElement('img'); img.src = product.image; img.alt = product.name; img.className = 'image-fade-in'; imageContainer.appendChild(img); setupSingleImageLoading(img); } else { skeletonDiv.style.display = 'none'; placeholderTextSpan.style.display = 'block'; }
            let durationSelectorHTML = ''; let currentPrice = parseFloat(product.price);
            if (product.category === 'subscription' && Array.isArray(product.durations) && product.durations.length > 0) { currentPrice = parseFloat(product.durations[0].price); durationSelectorHTML = `<div class="duration-selector" style="margin-bottom:0.75rem;display:block;"><label for="duration-detail-${product.id}" style="font-weight:600;margin-bottom:0.5rem;display:block;">Select Duration:</label><select id="duration-detail-${product.id}" data-product-id="${product.id}" style="width:100%;padding:0.7rem;border:1px solid #ccc;border-radius:6px;font-size:1rem;">${product.durations.map(d => `<option value="${parseFloat(d.price)}" ${parseFloat(d.price) === currentPrice ? 'selected' : ''}>${d.label} - ৳${parseFloat(d.price).toFixed(2)}</option>`).join('')}</select></div>`; }
            const relatedProductsHTML = renderRelatedProductsSection(product.id, product.category);
            const tempImageDiv = document.createElement('div'); tempImageDiv.appendChild(imageContainer);
            detailPageElement.innerHTML = `<div class="product-detail-container"><div class="product-detail-images">${tempImageDiv.innerHTML}</div><div class="product-detail-info"><h2 class="product-detail-title">${product.name || 'N/A'}</h2><p class="product-detail-description">${product.longDescription || product.description || 'An exceptional digital product.'}</p><div class="product-detail-price">৳${currentPrice.toFixed(2)}</div>${durationSelectorHTML}<div class="product-detail-actions"><button class="buy-now-detail" data-id="${product.id}"><i class="fas fa-bolt"></i> Buy Now</button><button class="add-to-cart-detail" data-id="${product.id}"><i class="fas fa-cart-plus"></i> Add to Cart</button></div></div></div>${relatedProductsHTML}`;
            const detailDurationSelector = detailPageElement.querySelector(`#duration-detail-${product.id}`); if (detailDurationSelector) { detailDurationSelector.addEventListener('change', (e) => { const newPrice = parseFloat(e.target.value); const priceElement = detailPageElement.querySelector('.product-detail-price'); if (priceElement) priceElement.textContent = `৳${newPrice.toFixed(2)}`; }); }
            const buyNowDetailButton = detailPageElement.querySelector('.buy-now-detail'); if (buyNowDetailButton) { buyNowDetailButton.addEventListener('click', (e) => { const productId = parseInt(e.currentTarget.dataset.id); const productForCart = getProductById(productId); if (productForCart) { const productToBuy = { ...productForCart }; const durationSel = document.getElementById(`duration-detail-${productId}`); if (durationSel && durationSel.value) { const selectedOption = durationSel.options[durationSel.selectedIndex]; productToBuy.price = parseFloat(selectedOption.value); productToBuy.selectedDurationLabel = selectedOption.text.split(' - ')[0]; } else if (Array.isArray(productToBuy.durations) && productToBuy.durations.length > 0) { productToBuy.price = parseFloat(productToBuy.durations[0].price); productToBuy.selectedDurationLabel = productToBuy.durations[0].label; } cart = [{ ...productToBuy, quantity: 1 }]; updateCart(); navigateTo('checkout', null, null, true); } }); }
            const addToCartDetailButton = detailPageElement.querySelector('.add-to-cart-detail'); if (addToCartDetailButton) { addToCartDetailButton.addEventListener('click', (e) => { const productId = parseInt(e.currentTarget.dataset.id); const productForCart = getProductById(productId); if(productForCart) { const productToAdd = { ...productForCart }; const durationSel = document.getElementById(`duration-detail-${productId}`); if (durationSel && durationSel.value) { const selectedOption = durationSel.options[durationSel.selectedIndex]; productToAdd.price = parseFloat(selectedOption.value); } else if (Array.isArray(productToAdd.durations) && productToAdd.durations.length > 0) { productToAdd.price = parseFloat(productToAdd.durations[0].price); } addToCart(productToAdd); } }); }
            setupRelatedProductImages();
        }

        function getRelatedProducts(currentProductId, category, limit = 4) { const dataToUse = (allProductsData && allProductsData.length > 0) ? allProductsData : generateDemoProducts(); if (!dataToUse || dataToUse.length === 0) return []; const relatedProducts = dataToUse.filter(product => product.category === category && product.id !== currentProductId); const shuffled = relatedProducts.sort(() => Math.random() - 0.5); return shuffled.slice(0, limit); }
        function renderRelatedProductsSection(currentProductId, category) {
            const relatedProducts = getRelatedProducts(currentProductId, category, window.innerWidth <= 768 ? 2 : 3); if (relatedProducts.length === 0) return '';
            const relatedProductsHTML = relatedProducts.map(product => { let price = parseFloat(product.price); if (product.category === 'subscription' && Array.isArray(product.durations) && product.durations.length > 0) { price = parseFloat(product.durations[0].price); } const formattedPrice = !isNaN(price) ? `৳${Math.floor(price)}` : 'Price unavailable'; const imageSrc = product.image && product.image !== 'path/to/default-product-image.jpg' ? product.image : ''; return `<div class="related-product-card" data-id="${product.id}" onclick="navigateTo('product', '${product.category}/${product.slug}')"><div class="related-product-image-container"><div class="skeleton"></div>${imageSrc ? `<img src="${imageSrc}" alt="${product.name || 'Product Image'}" class="image-fade-in" />` : ''}<span class="image-placeholder-text" style="display:${imageSrc ? 'none' : 'block'};">Image for ${product.name || 'Product'}</span></div><div class="related-product-content"><h4 class="related-product-title">${product.name || 'N/A'}</h4><p class="related-product-description">${product.description || ''}</p><div class="related-product-price">${formattedPrice}</div></div></div>`; }).join('');
            return `<div class="related-products-section"><div class="related-products-header"><h3 class="related-products-title">Related Products</h3></div><div class="related-products-grid">${relatedProductsHTML}</div></div>`;
        }
        function setupRelatedProductImages() { const relatedImages = document.querySelectorAll('.related-product-image-container img.image-fade-in'); relatedImages.forEach(img => { setupSingleImageLoading(img); }); }
        function handleProductCardBuyNow(productId) { const product = getProductById(productId); if (product) { const productForCart = { ...product }; if (product.category === 'subscription' && Array.isArray(product.durations) && product.durations.length > 0) { productForCart.price = parseFloat(product.durations[0].price); productForCart.selectedDurationLabel = product.durations[0].label; } else { productForCart.price = parseFloat(product.price); delete productForCart.selectedDurationLabel; } delete productForCart.currentSelectedPrice; cart = [{ ...productForCart, quantity: 1 }]; updateCart(); navigateTo('checkout', null, null, true); } }

        function updateCheckoutPageOrderSummary() {
            const orderItemsElement = domElements.orderItemsCheckout; const orderTotalElement = domElements.orderTotalCheckout; const submitButton = domElements.checkoutForm ? domElements.checkoutForm.querySelector('.submit-btn') : null;
            if (!orderItemsElement || !orderTotalElement) return;
            orderItemsElement.innerHTML = ''; let total = 0;
            if (cart.length === 0) { orderItemsElement.innerHTML = "<p>Your cart is empty.</p>"; orderTotalElement.textContent = `৳0.00`; if (submitButton) submitButton.disabled = true; return; }
            if (submitButton) submitButton.disabled = false;
            cart.forEach(item => { const itemDiv = document.createElement('div'); itemDiv.className = 'summary-item'; const itemTotal = parseFloat(item.price) * (item.quantity || 1); const displayName = item.selectedDurationLabel ? `${item.name} (${item.selectedDurationLabel})` : item.name; itemDiv.innerHTML = `<span>${displayName} (x${item.quantity || 1})</span><span>৳${itemTotal.toFixed(2)}</span>`; orderItemsElement.appendChild(itemDiv); total += itemTotal; });
            orderTotalElement.textContent = `৳${total.toFixed(2)}`;
            document.querySelectorAll('#payment-instructions .dynamic-amount').forEach(span => { span.textContent = `৳${total.toFixed(2)}`; });
        }
        function updateOrderConfirmationMessage(orderId) { const orderIdDisplayElement = document.getElementById('orderIdDisplay'); if (orderIdDisplayElement) { orderIdDisplayElement.textContent = orderId; } }
        async function placeOrder() {
            const form = domElements.checkoutForm; if (!form) { showToast('Checkout form unavailable.', 'error'); return; }
            const nameInput = form.querySelector('#name'); const emailInput = form.querySelector('#email'); const phoneInput = form.querySelector('#number'); const trxIdInput = form.querySelector('#transactionId');
            if (!nameInput || !emailInput || !phoneInput || !trxIdInput) { showToast('Form fields missing.', 'error'); return; }
            const name = nameInput.value.trim(); const email = emailInput.value.trim(); const phone = phoneInput.value.trim(); const transactionId = trxIdInput.value.trim();
            if (!name || !email || !phone || !transactionId) { showToast('Please fill all fields.', 'error'); return; }
            if (!/\S+@\S+\.\S+/.test(email)) { showToast('Invalid email.', 'error'); emailInput.focus(); return; }
            if (!/^01[3-9]\d{8}$/.test(phone)) { showToast('Invalid phone number.', 'error'); phoneInput.focus(); return; }
            if (transactionId.length < 5) { showToast('Invalid TrxID.', 'error'); trxIdInput.focus(); return; }
            if (cart.length === 0) { showToast('Cart is empty.', 'error'); navigateTo('products', 'all'); return; }
            const selectedPaymentMethodRadio = form.querySelector('input[name="paymentMethod"]:checked'); if (!selectedPaymentMethodRadio) { showToast('Select payment method.', 'error'); const paymentTrigger = document.querySelector('.custom-select-trigger'); if (paymentTrigger) paymentTrigger.focus(); return; }
            const paymentMethod = selectedPaymentMethodRadio.value; const orderId = 'TPBD-' + Math.floor(100000 + Math.random() * 900000);
            const orderPayload = { id: orderId, customer: { name: name, email: email, phone: phone, address: 'N/A' }, items: JSON.parse(JSON.stringify(cart.map(item => ({ id: item.id, name: item.name, price: parseFloat(item.price), quantity: item.quantity || 1, selectedDurationLabel: item.selectedDurationLabel || null })))), totalAmount: cart.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0), paymentMethod: paymentMethod, status: 'Pending', timestamp: new Date().toISOString(), transactionId: transactionId, viewed: false };
            showToast('Submitting order...', 'info', 7000);
            try {
                const response = await fetch('save_order.php', { method: 'POST', headers: { 'Content-Type': 'application/json', }, body: JSON.stringify(orderPayload), });
                const result = await response.json(); const finalOrderId = result.orderId || orderId;
                if (response.ok && result.success) { showToast(`Order ${finalOrderId} saved!`, 'success'); console.log('Order Placed (server & local):', finalOrderId); loadOrdersFromLocalStorage(); orders.unshift({ ...orderPayload, id: finalOrderId }); saveOrdersToLocalStorage(); updateOrderConfirmationMessage(finalOrderId); navigateTo('orderConfirmation'); }
                else { showToast(`Order ${orderId} saved locally. Server: ${result.message || 'error'}`, 'error critical'); console.error('Server save fail:', result.message); loadOrdersFromLocalStorage(); orders.unshift(orderPayload); saveOrdersToLocalStorage(); updateOrderConfirmationMessage(orderId); navigateTo('orderConfirmation'); }
            } catch (error) { showToast(`Order ${orderId} saved locally. Network error.`, 'error critical'); console.error('Network/server error:', error); loadOrdersFromLocalStorage(); orders.unshift(orderPayload); saveOrdersToLocalStorage(); updateOrderConfirmationMessage(orderId); navigateTo('orderConfirmation'); }
            finally { if (typeof form.reset === 'function') form.reset(); const selectedPaymentText = document.getElementById('selected-payment-method-text'); if(selectedPaymentText) { selectedPaymentText.textContent = "Select payment gateway"; selectedPaymentText.classList.remove('selected'); } const paymentDetailsArea = document.getElementById('payment-details-area'); if(paymentDetailsArea) paymentDetailsArea.style.display = 'none'; document.querySelectorAll('.custom-option.selected-option-highlight').forEach(opt => opt.classList.remove('selected-option-highlight')); cart = []; updateCart(); }
        }

        async function displayOrdersPage() {
            const container = domElements.ordersListContainer; const noOrdersMsg = domElements.noOrdersMessage;
            if (!container || !noOrdersMsg) return; container.innerHTML = ''; loadOrdersFromLocalStorage();
            if (orders.length === 0) { noOrdersMsg.style.display = 'block'; container.style.display = 'none'; markAllOrdersAsViewed(); return; }
            noOrdersMsg.style.display = 'none'; container.style.display = 'block';
            const localOrderIds = orders.map(o => o.id);
            if (localOrderIds.length > 0) { try { const response = await fetch('fetch_user_orders_status.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_ids: localOrderIds }) }); const serverData = await response.json(); if (response.ok && serverData.success && Array.isArray(serverData.orders)) { saveUpdatedOrdersToLocalStorage(serverData.orders); } else if (!serverData.success) { console.warn("Server status fetch fail:", serverData.message); } } catch (error) { console.error('Error fetching statuses:', error); } }
            const sortedOrdersToDisplay = [...orders].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
            sortedOrdersToDisplay.forEach(order => { const orderCard = document.createElement('div'); orderCard.className = 'order-card'; const itemsHTML = (Array.isArray(order.items) ? order.items : []).map(item => { const displayName = item.selectedDurationLabel ? `${item.name} (${item.selectedDurationLabel})` : item.name; return `<li>${displayName} (x${item.quantity || 1}) - ৳${(parseFloat(item.price) * (item.quantity || 1)).toFixed(2)}</li>`; }).join(''); let statusClass = `status-${(order.status || 'unknown').toLowerCase().replace(/\s+/g, '-')}`; if (statusClass === 'status-canceled') statusClass = 'status-cancelled'; if (!['status-pending', 'status-confirmed', 'status-cancelled'].includes(statusClass)) { statusClass = 'status-unknown'; } let displayDate = order.timestamp ? new Date(order.timestamp) : new Date(0); let dateLabel = "Placed:"; if (order.status && order.status.toLowerCase() === 'confirmed' && order.confirmed_at) { displayDate = new Date(order.confirmed_at); dateLabel = "Confirmed:"; } else if (order.status && order.status.toLowerCase() === 'cancelled' && order.cancelled_at) { displayDate = new Date(order.cancelled_at); dateLabel = "Cancelled:"; } const formattedDate = displayDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + displayDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); orderCard.innerHTML = `<div class="order-header"><div><span class="order-id">Order ID: ${order.id}</span><span class="order-date">${dateLabel} ${formattedDate}</span></div><span class="order-status ${statusClass}">${order.status || 'Unknown'}</span></div><div class="order-body"><p><strong>Customer:</strong> ${order.customer && order.customer.name ? order.customer.name : 'N/A'}</p><p><strong>Payment Method:</strong> ${order.paymentMethod || 'N/A'}</p>${order.transactionId ? `<p><strong>TrxID:</strong> ${order.transactionId}</p>` : ''}<p><strong>Items:</strong></p><ul class="order-items-list">${itemsHTML}</ul></div><div class="order-footer"><span>Total Amount:</span><span class="order-total-amount">৳${parseFloat(order.totalAmount || 0).toFixed(2)}</span></div>`; container.appendChild(orderCard); });
            markAllOrdersAsViewed();
        }

        function setupEnglishCheckoutForm() {
            const paymentDetailsArea = document.getElementById('payment-details-area'); const recipientNumberDisplay = document.getElementById('recipient-number-display'); const paymentInstructionsDiv = document.getElementById('payment-instructions'); const orderTotalElement = document.getElementById('orderTotalCheckout');
            const selectWrapper = document.querySelector('.custom-select-wrapper.payment-gateway-select'); const selectTrigger = selectWrapper ? selectWrapper.querySelector('.custom-select-trigger') : null; const selectedTextElement = selectWrapper ? selectWrapper.querySelector('#selected-payment-method-text') : null; const customOptionsContainer = selectWrapper ? selectWrapper.querySelector('.custom-options') : null; const customOptions = customOptionsContainer ? Array.from(customOptionsContainer.querySelectorAll('.custom-option')) : [];
            if (!selectWrapper || !selectTrigger || !selectedTextElement || !customOptionsContainer || customOptions.length === 0) { console.error("Checkout custom select elements not found."); return; }
            const recipientNumber = "01757204719"; const shieldIconSVG = `<svg class="instruction-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .9l-9 4v6.375c0 5.637 3.838 10.825 9 11.813 5.162-.988 9-6.176 9-11.812V4.9L12 .9zm0 2.113l7 3.111v5.251c0 3.938-2.588 7.938-7 8.938-4.413-1-7-5-7-8.938V6.125l7-3.111zm0 0"/></svg>`;
            function createInstructionListHTML(title, steps) { let html = `<h3 class="instruction-title">${shieldIconSVG} ${title}</h3><ul>`; steps.forEach(step => html += `<li>${step}</li>`); html += `</ul>`; return html; }
            function getPaymentInstructions() { const currentTotalAmountText = orderTotalElement ? orderTotalElement.textContent : '৳0.00'; return { bkash: { title: "bKash Instructions", steps: [`Open bKash & select <strong class="highlight">'Send Money'</strong>.`, `Amount: <strong class="highlight"><span class="dynamic-amount">${currentTotalAmountText}</span></strong> to <strong class="highlight">${recipientNumber}</strong>.`, `Copy <strong class="highlight">TrxID</strong> & enter below.`] }, nagad: { title: "Nagad Instructions", steps: [`Open Nagad & select <strong class="highlight">'Send Money'</strong>.`, `Amount: <strong class="highlight"><span class="dynamic-amount">${currentTotalAmountText}</span></strong> to <strong class="highlight">${recipientNumber}</strong>.`, `Copy <strong class="highlight">TrxID</strong> & enter below.`] }, rocket: { title: "Rocket Instructions", steps: [`Dial <strong class="highlight">*322#</strong> or use App for <strong class="highlight">'Send Money'</strong>.`, `Amount: <strong class="highlight"><span class="dynamic-amount">${currentTotalAmountText}</span></strong> to <strong class="highlight">${recipientNumber}</strong>.`, `Copy <strong class="highlight">TrxID</strong> & enter below.`] }, upay: { title: "Upay Instructions", steps: [`Open Upay & select <strong class="highlight">'Send Money'</strong>.`, `Amount: <strong class="highlight"><span class="dynamic-amount">${currentTotalAmountText}</span></strong> to <strong class="highlight">${recipientNumber}</strong>.`, `Copy <strong class="highlight">TrxID</strong> & enter below.`] } }; }
            selectTrigger.addEventListener('click', () => selectWrapper.classList.toggle('open'));
            selectTrigger.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectWrapper.classList.toggle('open'); } else if (e.key === "Escape" && selectWrapper.classList.contains('open')) { selectWrapper.classList.remove('open'); } });
            customOptions.forEach(option => { option.addEventListener('click', function() { const value = this.dataset.value; const instructionType = this.dataset.instructionType; const textNode = Array.from(this.childNodes).find(node => node.nodeType === Node.TEXT_NODE); const displayText = textNode ? textNode.textContent.trim() : this.textContent.trim(); const radioButton = document.getElementById(`${value}_radio`); if (radioButton) radioButton.checked = true; selectedTextElement.textContent = displayText; selectedTextElement.classList.add('selected'); selectWrapper.classList.remove('open'); customOptions.forEach(o => o.classList.remove('selected-option-highlight')); this.classList.add('selected-option-highlight'); if (recipientNumberDisplay) { const numberSpan = recipientNumberDisplay.querySelector('#payment-number-text'); if(numberSpan) numberSpan.textContent = recipientNumber; } const allInstructions = getPaymentInstructions(); const selectedInstructionData = allInstructions[instructionType]; if (selectedInstructionData && paymentInstructionsDiv) { paymentInstructionsDiv.innerHTML = createInstructionListHTML(selectedInstructionData.title, selectedInstructionData.steps); } else if (paymentInstructionsDiv) { paymentInstructionsDiv.innerHTML = "<p>Select payment method for instructions.</p>"; } if (paymentDetailsArea) paymentDetailsArea.style.display = 'block'; }); });
            document.addEventListener('click', (e) => { if (!selectWrapper.contains(e.target)) { selectWrapper.classList.remove('open'); } });
            const copyButton = document.getElementById('copy-payment-number'); if (copyButton) { copyButton.addEventListener('click', function() { const numberTextElement = document.getElementById('payment-number-text'); if (numberTextElement) { const numberToCopy = numberTextElement.textContent; navigator.clipboard.writeText(numberToCopy).then(() => { showToast('Number copied!', 'success'); }, () => { showToast('Copy failed.', 'error'); }); } }); }
        }

        function handleHashChange(isInitialLoad = false) {
            const hash = window.location.hash.substring(1); if (!hash) { if (currentPage !== 'home' || isInitialLoad) { navigateTo('home', null, null, false); } return; }
            const hashParts = hash.split('?'); const pathParts = hashParts[0].split('/'); const pageName = pathParts[0]; const context = pathParts.slice(1).join('/'); let searchTerm = null;
            if (hashParts.length > 1) { const queryParams = new URLSearchParams(hashParts[1]); searchTerm = queryParams.get('search'); }

            const validPages = ['home', 'products', 'product', 'cart', 'checkout', 'orderConfirmation', 'about', 'orders', 'terms', 'privacy', 'refund'];

            if (!validPages.includes(pageName)) {
                console.warn(`Page "${pageName}" from hash not found.`); showToast(`Content for "${pageName}" not found.`, 'info');
                navigateTo('home', null, null, false);
                if (history.replaceState) { history.replaceState({ page: 'home', context: null, searchTerm: null }, null, '#home'); } else { window.location.hash = '#home'; }
                return;
            }

            if (isInitialLoad || currentPage !== (pageName === 'product' ? 'productDetail' : pageName) || currentNavigationContext?.id !== context || currentNavigationContext?.searchTerm !== searchTerm) {
                navigateTo(pageName, context || null, searchTerm, false);
            }
        }

        function updateBottomNavActiveState(activePage) {
            const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
            bottomNavItems.forEach(item => { item.classList.remove('active'); if (item.dataset.page === activePage || (activePage === 'productDetail' && item.dataset.page === 'products') || (activePage === 'cart' && item.dataset.page === 'products') ) { item.classList.add('active'); } });
        }

        document.addEventListener('DOMContentLoaded', async function() {
            console.log('DOM fully loaded and parsed');
            setupEventListeners();
            loadCartFromLocalStorage();
            loadOrdersFromLocalStorage();
            await fetchProducts(true);
            handleHashChange(true);
            updateOrdersNotification();
            window.addEventListener('hashchange', () => handleHashChange(false));
        });
