/**
 * Firebase Firestore Content Seeding Script
 *
 * This script seeds the website content to Firebase Firestore.
 * Run with: node scripts/seed-firestore-content.js
 *
 * Make sure serviceAccountKey.json is placed in backend/src/ folder
 */

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Initialize Firebase with service account
const possiblePaths = [
  path.join(__dirname, "../src/serviceAccountKey.json"),
  path.join(__dirname, "../serviceAccountKey.json"),
  path.join(process.cwd(), "src/serviceAccountKey.json"),
  path.join(process.cwd(), "serviceAccountKey.json"),
];

let serviceAccountPath = "";
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    serviceAccountPath = p;
    break;
  }
}

if (!serviceAccountPath) {
  console.error("❌ serviceAccountKey.json not found!");
  console.error("Expected at one of these locations:");
  possiblePaths.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = admin.firestore();

// ============================================
// WEBSITE CONTENT DATA
// ============================================
const websiteContent = [
  // ==========================================
  // HOMEPAGE CONTENT
  // ==========================================

  // Homepage Hero Section
  {
    page: "home",
    section: "hero",
    type: "object",
    key: "hero_main",
    value: {
      tagline: "Mark Corpotax",
      title: "Shaping Financial Success in the AI Era",
      description:
        "Comprehensive financial and legal solutions designed to address the unique requirements of our clients. Backed by experienced professionals, we specialize in guiding individuals and businesses towards sustainable financial growth, security, and long-term success.",
      cta_primary: {
        text: "Get Started",
        link: "/contact",
      },
      phone: {
        number: "97120 67891",
        help_text: "Need help?",
      },
      hero_images: {
        image_1:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop&crop=faces",
        image_2:
          "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=600&fit=crop&crop=faces",
      },
      experience_badge: {
        years: "12",
        text: "Years Of experience",
      },
    },
    isActive: true,
  },

  // Homepage Experience Section
  {
    page: "home",
    section: "experience",
    type: "object",
    key: "experience_section",
    value: {
      tagline: "OUR EXPERTISE",
      title: "Comprehensive Financial Solutions",
      description:
        "We specialize in assisting businesses by arranging bank financing for acquisition of new plant and machinery, as well as providing working capital solutions. We collaborate with Government Banks, Private Banks, NBFCs, and Co-operative Banks.",
      features: [
        {
          title: "MSME Project Finance",
          description:
            "Startup India MSME financing with government subsidy benefits.",
          icon: "CheckCircle",
        },
        {
          title: "Working Capital Solutions",
          description:
            "Cash Credit, Overdraft, Bank Guarantee, and Bill Discounting.",
          icon: "CheckCircle",
        },
      ],
      cta_button: {
        text: "Learn more",
        link: "/services",
      },
      manager: {
        name: "MARK Team",
        title: "Financial Consultants",
      },
    },
    isActive: true,
  },

  // Homepage Team Section
  {
    page: "home",
    section: "team",
    type: "object",
    key: "team_section",
    value: {
      tagline: "OUR TEAM MEMBER",
      title: "Invest in your future with us",
      team_members: [
        {
          name: "Andi Lane",
          title: "Founder",
        },
        {
          name: "John Smith",
          title: "Co-Founder",
        },
        {
          name: "Jane Doe",
          title: "Manager",
        },
        {
          name: "Chris Green",
          title: "Designer",
        },
      ],
    },
    isActive: true,
  },

  // Homepage Wealth Section
  {
    page: "home",
    section: "wealth",
    type: "object",
    key: "wealth_section",
    value: {
      tagline: "OUR COMPANY LAYOUT",
      title: "Building wealth together",
      tabs: ["Business", "Consulting", "Legal", "Global"],
    },
    isActive: true,
  },

  // Homepage Process Section
  {
    page: "home",
    section: "process",
    type: "object",
    key: "process_section",
    value: {
      tagline: "OUR PROCESS",
      title: "Where your financial dreams become reality",
      process_steps: [
        {
          title: "Insurance covers",
          description:
            "Our insurance covers offer comprehensive protection for your assets and peace of mind for your future.",
          icon: "FileText",
        },
        {
          title: "Risk management",
          description:
            "We identify, assess, and mitigate risks to protect your business and assets.",
          icon: "Briefcase",
        },
        {
          title: "Result on time",
          description:
            "We are committed to delivering exceptional results within the agreed-upon timeframe.",
          icon: "CheckCircle",
        },
        {
          title: "Global management",
          description:
            "Our global management services provide you with expert oversight and strategic direction for your international operations.",
          icon: "Users",
        },
      ],
    },
    isActive: true,
  },

  // Homepage Video Section
  {
    page: "home",
    section: "video",
    type: "object",
    key: "video_section",
    value: {
      title: "We are a team of dedicated financial experts",
      video_thumbnail:
        "https://images.unsplash.com/photo-1489980557514-251d61e3e841?q=80&w=2670&auto=format&fit=crop",
    },
    isActive: true,
  },

  // Homepage Hardworking Members Section
  {
    page: "home",
    section: "hardworking_members",
    type: "object",
    key: "hardworking_members_section",
    value: {
      tagline: "SHOP PROJECT",
      title: "Our extreme hardworking Member",
      featured_members: [
        {
          name: "Andi Lane",
          title: "Founder",
        },
        {
          name: "John Smith",
          title: "Co-Founder",
        },
        {
          name: "Jane Doe",
          title: "Manager",
        },
      ],
    },
    isActive: true,
  },

  // Homepage Testimonials Section
  {
    page: "home",
    section: "testimonials",
    type: "object",
    key: "testimonials_section",
    value: {
      tagline: "TESTIMONIAL",
      title: "Your trusted financial advisor",
      testimonials: [
        {
          quote:
            "FinWeb Dynamic has been instrumental in my financial success. Their personalized approach and expert advice have made all the difference.",
          name: "Alex Johnson",
          title: "CEO, Tech Innovators",
        },
        {
          quote:
            "The team at FinWeb Dynamic is incredibly knowledgeable and supportive. I feel confident knowing my financial future is in good hands.",
          name: "Sarah Lee",
          title: "Founder, Creative Solutions",
        },
      ],
    },
    isActive: true,
  },

  // Homepage Stats Section
  {
    page: "home",
    section: "stats",
    type: "object",
    key: "stats_section",
    value: {
      stats: [
        {
          number: "64+",
          label: "Years of experience",
        },
        {
          number: "38+",
          label: "Satisfied clients",
        },
        {
          number: "29+",
          label: "Finished Offices",
        },
        {
          number: "26+",
          label: "Award Winner",
        },
      ],
    },
    isActive: true,
  },

  // Homepage Get in Touch Section
  {
    page: "home",
    section: "get_in_touch",
    type: "object",
    key: "get_in_touch_section",
    value: {
      tagline: "GET IN TOUCH",
      title: "Don't be shy, just say hi!",
      description:
        "We are here to help you with any questions you may have. Feel free to reach out to us.",
      form_fields: ["Your Name", "Your Email", "Your Message"],
      cta_button: "Send Message",
    },
    isActive: true,
  },

  // Homepage Blog Section
  {
    page: "home",
    section: "blog",
    type: "object",
    key: "blog_section",
    value: {
      tagline: "OUR BLOG",
      title: "Secure your Financial future with us",
      blog_posts: [
        {
          category: "Business",
          title: "7 tips for interesting your business",
        },
        {
          category: "Business",
          title: "8 tips for interesting your business",
        },
        {
          category: "Business",
          title: "9 tips for interesting your business",
        },
      ],
    },
    isActive: true,
  },

  // Homepage CTA Section
  {
    page: "home",
    section: "cta",
    type: "object",
    key: "cta_section",
    value: {
      logoText: "Mark Corpotax",
      title: "A financial partner you can trust",
      description: "www.markcorpotax.com",
      buttonText: "Subscribe",
    },
    isActive: true,
  },

  // ==========================================
  // ABOUT PAGE CONTENT
  // ==========================================

  // About Page Hero Section
  {
    page: "about",
    section: "hero",
    type: "object",
    key: "about_hero",
    value: {
      title: "About Mark Corpotax",
      description:
        "Founded in 2012 in Surat, Gujarat, Mark Corpotax is dedicated to delivering comprehensive financial and legal solutions designed to address the unique requirements of our clients. Backed by a team of experienced professionals, we specialize in guiding individuals and businesses towards sustainable financial growth, security, and long-term success.",
      stats: [
        {
          number: "12+",
          label: "Years of Experience",
          icon: "BarChart2",
        },
        {
          number: "2500+",
          label: "Satisfied Clients",
          icon: "PieChart",
        },
      ],
    },
    isActive: true,
  },

  // About Page Solutions Section
  {
    page: "about",
    section: "solutions",
    type: "object",
    key: "solutions_section",
    value: {
      title: "Our Vision & Mission",
      description:
        "To be the most trusted partner in providing innovative loan consultancy and financial solutions, enabling businesses across industries to access funding, achieve expansion, and unlock sustainable growth.",
      mission:
        "Our mission is to empower businesses to achieve their growth ambitions by providing expert, client-focused loan consultancy and financial solutions. We simplify the process of securing term loans, project financing, and working capital.",
      features: [
        "Transparent Services",
        "Expert Consultancy",
        "Client-Focused Approach",
        "Reliable Support",
      ],
    },
    isActive: true,
  },

  // About Page Process Section
  {
    page: "about",
    section: "process",
    type: "object",
    key: "about_process_section",
    value: {
      title: "Why Choose Mark Corpotax",
      description:
        "Over 12 years of association with leading Government Banks, Private Sector Banks, and Co-operative Banks. We are committed to transparency, trust, and integrity.",
      process_steps: [
        {
          title: "Fast Processing",
          description:
            "Fast and hassle-free loan processing with quick decision-making for timely funding.",
          icon: "Briefcase",
        },
        {
          title: "Affordable Rates",
          description:
            "Lowest and affordable interest rates with clear and transparent communication at every step.",
          icon: "HandCoins",
        },
        {
          title: "Expert Guidance",
          description:
            "Strategic financial advice tailored to your business needs with dedicated support.",
          icon: "CheckCircle",
        },
      ],
    },
    isActive: true,
  },

  // About Page Team Section
  {
    page: "about",
    section: "team",
    type: "object",
    key: "about_team_section",
    value: {
      title: "Leading the way in business transformation",
      team_members: [
        {
          name: "Albert Flores",
          title: "Designer",
        },
        {
          name: "Kathryn Murphy",
          title: "Developer",
        },
        {
          name: "Marvin McKinney",
          title: "Finance Developer",
        },
        {
          name: "Leslie Alexander",
          title: "Backend Developer",
        },
      ],
    },
    isActive: true,
  },

  // ==========================================
  // SERVICES PAGE CONTENT
  // ==========================================

  // Services Page Hero
  {
    page: "services",
    section: "hero",
    type: "object",
    key: "services_hero",
    value: {
      title: "Our Financial Services",
      description:
        "Comprehensive financial and legal solutions tailored for businesses across diverse industries, from startup financing to working capital solutions.",
    },
    isActive: true,
  },

  // Services List
  {
    page: "services",
    section: "services_list",
    type: "list",
    key: "services_list",
    value: [
      {
        slug: "msme-project-finance",
        title: "MSME Project Finance",
        description:
          "Start-up India MSME Project Finance & Working Capital Finance with MSME Machinery Loan and government subsidy benefits.",
        icon: "Landmark",
      },
      {
        slug: "working-capital-solutions",
        title: "Working Capital Solutions",
        description:
          "Cash Credit (CC), Overdraft (OD), Dropline Overdraft (DOD), Bank Guarantee (BG), and Bill Discounting solutions.",
        icon: "PiggyBank",
      },
      {
        slug: "home-mortgage-loans",
        title: "Home & Mortgage Loans",
        description:
          "Home Loan, Industrial Construction Loan, Loan on Open Plot, Loan Against Property (LAP), and Balance Transfer services.",
        icon: "HandCoins",
      },
      {
        slug: "taxation-accounting",
        title: "Taxation & Accounting",
        description:
          "Complete Accounting, Auditing, GST Advisory, Tax Planning, ROC Compliances, and CFO Services.",
        icon: "FileText",
      },
      {
        slug: "government-schemes",
        title: "Government Schemes & Subsidies",
        description:
          "Capital Investment Subsidy, Interest Subsidy, SGST & EPF Reimbursement, and various government support programs.",
        icon: "ShieldHalf",
      },
      {
        slug: "industry-funding",
        title: "Industries Funding Solutions",
        description:
          "Tailored funding for Textile, Diamond & Jewellery, Packaging, Chemical, Solar Energy, Food & Beverage industries.",
        icon: "University",
      },
    ],
    isActive: true,
  },

  // ==========================================
  // CONTACT PAGE CONTENT
  // ==========================================

  // Contact Page Hero
  {
    page: "contact",
    section: "hero",
    type: "object",
    key: "contact_hero",
    value: {
      title: "Contact",
      breadcrumb: "Home > Contact",
    },
    isActive: true,
  },

  // Contact Page Content
  {
    page: "contact",
    section: "content",
    type: "object",
    key: "contact_content",
    value: {
      title: "Get in touch",
      description:
        "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
      contact_info: {
        address: {
          title: "Address",
          details:
            "705, 7th Floor, APMC Building\nKrushi Bazar, Sahara Darwaja\nRing Road, Surat - 395003",
        },
        email: {
          title: "Email Us",
          general: "markcorpotax@gmail.com",
          support: "markcorpotax@gmail.com",
        },
        phone: {
          title: "Telephone",
          main: "97120 67891",
          support: "97738 22604",
        },
      },
      form_fields: [
        {
          name: "name",
          label: "Full Name",
          type: "text",
          placeholder: "Your full name",
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          placeholder: "your.email@example.com",
        },
        {
          name: "subject",
          label: "Subject",
          type: "text",
          placeholder: "What's this about?",
        },
        {
          name: "message",
          label: "Message Form",
          type: "textarea",
          placeholder: "Tell us how we can help you...",
        },
      ],
      newsletter: {
        title: "Get notified about the event!",
        description: "Subscribe today",
        placeholder: "Enter your email",
        cta: "Subscribe",
      },
    },
    isActive: true,
  },

  // ==========================================
  // GLOBAL SETTINGS
  // ==========================================

  // Header Settings (for site-builder page)
  {
    page: "settings",
    section: "header",
    type: "string",
    key: "company_name",
    value: "Mark Corpotax",
    isActive: true,
  },
  {
    page: "settings",
    section: "header",
    type: "string",
    key: "company_tagline",
    value: "Financial & Legal Solutions",
    isActive: true,
  },
  {
    page: "settings",
    section: "header",
    type: "string",
    key: "show_phone",
    value: "true",
    isActive: true,
  },
  {
    page: "settings",
    section: "header",
    type: "string",
    key: "phone_display",
    value: "97120 67891",
    isActive: true,
  },
  {
    page: "settings",
    section: "header",
    type: "string",
    key: "cta_text",
    value: "Get a Quote",
    isActive: true,
  },
  {
    page: "settings",
    section: "header",
    type: "string",
    key: "cta_link",
    value: "/appointment",
    isActive: true,
  },

  // Navigation Settings
  {
    page: "settings",
    section: "navigation",
    type: "string",
    key: "nav_1_label",
    value: "Home",
    isActive: true,
  },
  {
    page: "settings",
    section: "navigation",
    type: "string",
    key: "nav_1_link",
    value: "/",
    isActive: true,
  },
  {
    page: "settings",
    section: "navigation",
    type: "string",
    key: "nav_2_label",
    value: "About",
    isActive: true,
  },
  {
    page: "settings",
    section: "navigation",
    type: "string",
    key: "nav_2_link",
    value: "/about",
    isActive: true,
  },
  {
    page: "settings",
    section: "navigation",
    type: "string",
    key: "nav_3_label",
    value: "Services",
    isActive: true,
  },
  {
    page: "settings",
    section: "navigation",
    type: "string",
    key: "nav_3_link",
    value: "/services",
    isActive: true,
  },
  {
    page: "settings",
    section: "navigation",
    type: "string",
    key: "nav_4_label",
    value: "Blog",
    isActive: true,
  },
  {
    page: "settings",
    section: "navigation",
    type: "string",
    key: "nav_4_link",
    value: "/blog",
    isActive: true,
  },
  {
    page: "settings",
    section: "navigation",
    type: "string",
    key: "nav_5_label",
    value: "Contact",
    isActive: true,
  },
  {
    page: "settings",
    section: "navigation",
    type: "string",
    key: "nav_5_link",
    value: "/contact",
    isActive: true,
  },

  // Contact Settings
  {
    page: "settings",
    section: "contact",
    type: "string",
    key: "phone_finance",
    value: "97120 67891",
    isActive: true,
  },
  {
    page: "settings",
    section: "contact",
    type: "string",
    key: "phone_taxation",
    value: "97738 22604",
    isActive: true,
  },
  {
    page: "settings",
    section: "contact",
    type: "string",
    key: "email",
    value: "markcorpotax@gmail.com",
    isActive: true,
  },
  {
    page: "settings",
    section: "contact",
    type: "string",
    key: "address",
    value:
      "705, 7th Floor, APMC Building, Krushi Bazar, Sahara Darwaja, Ring Road, Surat - 395003",
    isActive: true,
  },

  // Footer Settings
  {
    page: "settings",
    section: "footer",
    type: "string",
    key: "company_description",
    value:
      "Founded in 2012 in Surat, Gujarat. Delivering comprehensive financial and legal solutions designed to address the unique requirements of our clients.",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer",
    type: "string",
    key: "copyright_text",
    value: "© 2025 Mark Corpotax. All Rights Reserved.",
    isActive: true,
  },

  // Social Media Settings
  {
    page: "settings",
    section: "social",
    type: "string",
    key: "facebook",
    value: "https://facebook.com/markcorpotax",
    isActive: true,
  },
  {
    page: "settings",
    section: "social",
    type: "string",
    key: "twitter",
    value: "https://twitter.com/markcorpotax",
    isActive: true,
  },
  {
    page: "settings",
    section: "social",
    type: "string",
    key: "linkedin",
    value: "https://linkedin.com/company/markcorpotax",
    isActive: true,
  },
  {
    page: "settings",
    section: "social",
    type: "string",
    key: "instagram",
    value: "https://instagram.com/markcorpotax",
    isActive: true,
  },

  // Footer Quick Links
  {
    page: "settings",
    section: "footer_links",
    type: "string",
    key: "link_1_label",
    value: "About Us",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_links",
    type: "string",
    key: "link_1_url",
    value: "/about",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_links",
    type: "string",
    key: "link_2_label",
    value: "Services",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_links",
    type: "string",
    key: "link_2_url",
    value: "/services",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_links",
    type: "string",
    key: "link_3_label",
    value: "Blog",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_links",
    type: "string",
    key: "link_3_url",
    value: "/blog",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_links",
    type: "string",
    key: "link_4_label",
    value: "Contact",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_links",
    type: "string",
    key: "link_4_url",
    value: "/contact",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_links",
    type: "string",
    key: "link_5_label",
    value: "Appointments",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_links",
    type: "string",
    key: "link_5_url",
    value: "/appointment",
    isActive: true,
  },

  // Footer Service Links
  {
    page: "settings",
    section: "footer_services",
    type: "string",
    key: "service_1_label",
    value: "MSME Project Finance",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_services",
    type: "string",
    key: "service_1_url",
    value: "/services/msme-project-finance",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_services",
    type: "string",
    key: "service_2_label",
    value: "Working Capital",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_services",
    type: "string",
    key: "service_2_url",
    value: "/services/working-capital",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_services",
    type: "string",
    key: "service_3_label",
    value: "Home & Mortgage Loans",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_services",
    type: "string",
    key: "service_3_url",
    value: "/services/home-mortgage-loans",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_services",
    type: "string",
    key: "service_4_label",
    value: "Taxation Services",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_services",
    type: "string",
    key: "service_4_url",
    value: "/services/tax-planning",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_services",
    type: "string",
    key: "service_5_label",
    value: "Business Loans",
    isActive: true,
  },
  {
    page: "settings",
    section: "footer_services",
    type: "string",
    key: "service_5_url",
    value: "/services/business-loans",
    isActive: true,
  },

  // Global Site Settings
  {
    page: "global",
    section: "site_settings",
    type: "object",
    key: "site_info",
    value: {
      site_name: "Mark Corpotax",
      tagline: "Shaping Financial Success in the AI Era",
      company_name: "Mark Corpotax",
      description:
        "Comprehensive financial and legal solutions designed to address the unique requirements of our clients since 2012.",
      colors: {
        primary: "#004D6E",
        secondary: "#00ACCC",
      },
    },
    isActive: true,
  },

  // Navigation Settings
  {
    page: "global",
    section: "navigation",
    type: "list",
    key: "main_navigation",
    value: [
      {
        title: "Home",
        link: "/",
        order: 1,
      },
      {
        title: "About",
        link: "/about",
        order: 2,
      },
      {
        title: "Services",
        link: "/services",
        order: 3,
      },
      {
        title: "Contact",
        link: "/contact",
        order: 4,
      },
      {
        title: "Blog",
        link: "/blog",
        order: 5,
      },
      {
        title: "Admin",
        link: "/admin",
        order: 6,
      },
    ],
    isActive: true,
  },

  // Footer Content
  {
    page: "global",
    section: "footer",
    type: "object",
    key: "footer_content",
    value: {
      company_info: {
        name: "Mark Corpotax",
        description:
          "Professional financial services and consulting to help you achieve your business goals.",
        address:
          "705, 7th Floor, APMC Building, Krushi Bazar, Sahara Darwaja, Ring Road, Surat - 395003",
        phone: "97120 67891",
        email: "markcorpotax@gmail.com",
      },
      quick_links: [
        {
          title: "Services",
          links: [
            {
              name: "MSME Project Finance",
              url: "/services/msme-project-finance",
            },
            {
              name: "Working Capital",
              url: "/services/working-capital-solutions",
            },
            {
              name: "Home & Mortgage Loans",
              url: "/services/home-mortgage-loans",
            },
            {
              name: "Taxation & Accounting",
              url: "/services/taxation-accounting",
            },
          ],
        },
        {
          title: "Company",
          links: [
            { name: "About Us", url: "/about" },
            { name: "Contact", url: "/contact" },
            { name: "Blog", url: "/blog" },
            { name: "Privacy Policy", url: "/privacy-policy" },
            { name: "Terms of Service", url: "/terms-of-service" },
          ],
        },
      ],
      social_media: [
        { name: "Facebook", url: "https://facebook.com", icon: "Facebook" },
        { name: "Twitter", url: "https://twitter.com", icon: "Twitter" },
        { name: "LinkedIn", url: "https://linkedin.com", icon: "LinkedIn" },
        { name: "Instagram", url: "https://instagram.com", icon: "Instagram" },
      ],
      copyright: "© 2025 Mark Corpotax. All rights reserved.",
    },
    isActive: true,
  },
];

// ============================================
// SEED FUNCTION
// ============================================
async function seedContent() {
  try {
    console.log("🔥 Connected to Firebase Firestore");
    console.log(`📁 Project ID: ${serviceAccount.project_id}`);
    console.log(`📄 Service Account: ${serviceAccountPath}\n`);

    // Ask user if they want to clear existing content
    const collectionRef = db.collection("pageContent");
    const existingDocs = await collectionRef.get();

    if (!existingDocs.empty) {
      console.log(`⚠️  Found ${existingDocs.size} existing content items.`);
      console.log("   Clearing existing content...\n");

      // Delete in batches
      const batch = db.batch();
      existingDocs.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      console.log("✅ Cleared existing content\n");
    }

    // Insert new content
    console.log("📝 Seeding content...\n");

    let successCount = 0;
    const contentSummary = {};

    for (const content of websiteContent) {
      try {
        await collectionRef.add({
          ...content,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        const key = `${content.page}/${content.section}`;
        contentSummary[key] = (contentSummary[key] || 0) + 1;
        successCount++;

        console.log(`   ✅ ${content.page}/${content.section}/${content.key}`);
      } catch (error) {
        console.error(
          `   ❌ Failed: ${content.page}/${content.section}/${content.key}`,
          error.message
        );
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("📊 SEEDING SUMMARY");
    console.log("=".repeat(50));
    console.log(
      `Total items seeded: ${successCount}/${websiteContent.length}\n`
    );

    console.log("Content by page/section:");
    Object.entries(contentSummary).forEach(([key, count]) => {
      console.log(`   ${key}: ${count} item(s)`);
    });

    console.log("\n✨ Content seeding completed successfully!");
    console.log("\n💡 You can now edit this content in the Admin Panel:");
    console.log("   1. Start the backend: npm run dev");
    console.log("   2. Start the frontend: npm run dev");
    console.log("   3. Go to: http://localhost:3000/admin/content");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding content:", error);
    process.exit(1);
  }
}

// Run the seed function
seedContent();
