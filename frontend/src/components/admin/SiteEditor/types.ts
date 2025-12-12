// Types for the Site Editor

export interface ContentItem {
  id?: string;
  page: string;
  section: string;
  key: string;
  value: any;
  type: "text" | "array" | "object" | "image" | "link";
  isActive: boolean;
}

export interface SectionConfig {
  id: string; // Must match the section name in the database
  name: string;
  description: string;
  fields: FieldConfig[];
}

export interface FieldConfig {
  key: string; // Key within the section (no section prefix needed)
  label: string;
  type:
    | "text"
    | "textarea"
    | "richtext"
    | "image"
    | "link"
    | "array"
    | "object"
    | "number";
  placeholder?: string;
  required?: boolean;
  nestedFields?: FieldConfig[];
}

export interface PageConfig {
  id: string;
  name: string;
  path: string;
  sections: SectionConfig[];
}

// Page configurations - Section IDs must match database section names exactly
export const PAGE_CONFIGS: PageConfig[] = [
  {
    id: "home",
    name: "Home Page",
    path: "/",
    sections: [
      {
        id: "hero_main",
        name: "Hero Section",
        description: "Main banner section at the top of the homepage",
        fields: [
          {
            key: "tagline",
            label: "Tagline",
            type: "text",
            placeholder: "MARK GROUP",
          },
          {
            key: "title",
            label: "Main Title",
            type: "text",
            placeholder: "Shaping Financial Success...",
          },
          {
            key: "description",
            label: "Description",
            type: "textarea",
            placeholder: "Comprehensive financial and legal solutions...",
          },
          {
            key: "cta_primary.text",
            label: "Primary Button Text",
            type: "text",
            placeholder: "Get Started",
          },
          {
            key: "cta_primary.link",
            label: "Primary Button Link",
            type: "text",
            placeholder: "/appointment",
          },
          {
            key: "phone.number",
            label: "Phone Number",
            type: "text",
            placeholder: "+91 97120 67891",
          },
          {
            key: "phone.help_text",
            label: "Phone Help Text",
            type: "text",
            placeholder: "Need help?",
          },
          {
            key: "experience_badge.years",
            label: "Experience Years",
            type: "text",
            placeholder: "12+",
          },
          {
            key: "experience_badge.text",
            label: "Experience Text",
            type: "text",
            placeholder: "Years of Excellence",
          },
        ],
      },
      {
        id: "about",
        name: "About Section",
        description: "About company overview on homepage",
        fields: [
          {
            key: "about_section.tagline",
            label: "Tagline",
            type: "text",
            placeholder: "About Us",
          },
          {
            key: "about_section.title",
            label: "Title",
            type: "text",
            placeholder: "Your Trusted Partner for Financial Growth",
          },
          {
            key: "about_section.description",
            label: "Description",
            type: "textarea",
            placeholder: "With over 15 years of experience...",
          },
          {
            key: "about_section.highlight_1",
            label: "Highlight 1",
            type: "text",
            placeholder: "Trusted by 10,000+ satisfied customers",
          },
          {
            key: "about_section.highlight_2",
            label: "Highlight 2",
            type: "text",
            placeholder: "Quick loan approvals within 24-48 hours",
          },
          {
            key: "about_section.highlight_3",
            label: "Highlight 3",
            type: "text",
            placeholder: "Competitive interest rates with flexible repayment",
          },
          {
            key: "about_section.highlight_4",
            label: "Highlight 4",
            type: "text",
            placeholder: "Dedicated relationship managers",
          },
          {
            key: "about_section.highlight_5",
            label: "Highlight 5",
            type: "text",
            placeholder: "100% transparent process",
          },
          {
            key: "about_section.stat_1_value",
            label: "Stat 1 Value",
            type: "text",
            placeholder: "15+",
          },
          {
            key: "about_section.stat_1_label",
            label: "Stat 1 Label",
            type: "text",
            placeholder: "Years Experience",
          },
          {
            key: "about_section.stat_2_value",
            label: "Stat 2 Value",
            type: "text",
            placeholder: "10K+",
          },
          {
            key: "about_section.stat_2_label",
            label: "Stat 2 Label",
            type: "text",
            placeholder: "Happy Customers",
          },
          {
            key: "about_section.stat_3_value",
            label: "Stat 3 Value",
            type: "text",
            placeholder: "₹500Cr+",
          },
          {
            key: "about_section.stat_3_label",
            label: "Stat 3 Label",
            type: "text",
            placeholder: "Loans Disbursed",
          },
          {
            key: "about_section.stat_4_value",
            label: "Stat 4 Value",
            type: "text",
            placeholder: "98%",
          },
          {
            key: "about_section.stat_4_label",
            label: "Stat 4 Label",
            type: "text",
            placeholder: "Success Rate",
          },
          {
            key: "about_section.cta.text",
            label: "CTA Button Text",
            type: "text",
            placeholder: "Learn More",
          },
          {
            key: "about_section.cta.link",
            label: "CTA Button Link",
            type: "text",
            placeholder: "/about",
          },
        ],
      },
      {
        id: "process",
        name: "Process Section",
        description: "Our working process steps",
        fields: [
          {
            key: "process_section.tagline",
            label: "Tagline",
            type: "text",
            placeholder: "How It Works",
          },
          {
            key: "process_section.title",
            label: "Title",
            type: "text",
            placeholder: "Simple Steps to Financial Success",
          },
          {
            key: "process_section.step_1_title",
            label: "Step 1 Title",
            type: "text",
            placeholder: "Submit Application",
          },
          {
            key: "process_section.step_1_description",
            label: "Step 1 Description",
            type: "textarea",
            placeholder: "Fill out our simple online application...",
          },
          {
            key: "process_section.step_2_title",
            label: "Step 2 Title",
            type: "text",
            placeholder: "Document Verification",
          },
          {
            key: "process_section.step_2_description",
            label: "Step 2 Description",
            type: "textarea",
            placeholder: "Our team reviews your documents...",
          },
          {
            key: "process_section.step_3_title",
            label: "Step 3 Title",
            type: "text",
            placeholder: "Quick Approval",
          },
          {
            key: "process_section.step_3_description",
            label: "Step 3 Description",
            type: "textarea",
            placeholder: "Get fast approval within 24-48 hours...",
          },
          {
            key: "process_section.step_4_title",
            label: "Step 4 Title",
            type: "text",
            placeholder: "Disbursement",
          },
          {
            key: "process_section.step_4_description",
            label: "Step 4 Description",
            type: "textarea",
            placeholder: "Funds are transferred directly to your account...",
          },
        ],
      },
      {
        id: "services",
        name: "Services Preview",
        description: "Services showcase on homepage",
        fields: [
          {
            key: "services_section.tagline",
            label: "Tagline",
            type: "text",
            placeholder: "Our Services",
          },
          {
            key: "services_section.title",
            label: "Title",
            type: "text",
            placeholder: "Comprehensive Financial Solutions",
          },
          {
            key: "services_section.description",
            label: "Description",
            type: "textarea",
            placeholder: "We offer a wide range of services...",
          },
        ],
      },
      {
        id: "testimonials",
        name: "Testimonials Section",
        description: "Client testimonials",
        fields: [
          {
            key: "testimonials_section.tagline",
            label: "Tagline",
            type: "text",
            placeholder: "Client Success Stories",
          },
          {
            key: "testimonials_section.title",
            label: "Title",
            type: "text",
            placeholder: "What Our Clients Say",
          },
          // Testimonial 1
          {
            key: "testimonials_section.testimonial_1_quote",
            label: "Testimonial 1 - Quote",
            type: "textarea",
            placeholder: "Enter the client's testimonial...",
          },
          {
            key: "testimonials_section.testimonial_1_name",
            label: "Testimonial 1 - Client Name",
            type: "text",
            placeholder: "John Doe",
          },
          {
            key: "testimonials_section.testimonial_1_title",
            label: "Testimonial 1 - Client Title",
            type: "text",
            placeholder: "CEO, Company Inc.",
          },
          // Testimonial 2
          {
            key: "testimonials_section.testimonial_2_quote",
            label: "Testimonial 2 - Quote",
            type: "textarea",
            placeholder: "Enter the client's testimonial...",
          },
          {
            key: "testimonials_section.testimonial_2_name",
            label: "Testimonial 2 - Client Name",
            type: "text",
            placeholder: "Jane Smith",
          },
          {
            key: "testimonials_section.testimonial_2_title",
            label: "Testimonial 2 - Client Title",
            type: "text",
            placeholder: "CFO, Business Corp.",
          },
          // Testimonial 3
          {
            key: "testimonials_section.testimonial_3_quote",
            label: "Testimonial 3 - Quote",
            type: "textarea",
            placeholder: "Enter the client's testimonial...",
          },
          {
            key: "testimonials_section.testimonial_3_name",
            label: "Testimonial 3 - Client Name",
            type: "text",
            placeholder: "Robert Johnson",
          },
          {
            key: "testimonials_section.testimonial_3_title",
            label: "Testimonial 3 - Client Title",
            type: "text",
            placeholder: "Director, Enterprise LLC",
          },
        ],
      },
      {
        id: "cta",
        name: "CTA Section",
        description: "Call to action / Newsletter section",
        fields: [
          {
            key: "cta_section.logoText",
            label: "Logo Text",
            type: "text",
            placeholder: "Mark Corpotax",
          },
          {
            key: "cta_section.title",
            label: "Title",
            type: "text",
            placeholder: "A financial partner you can trust",
          },
          {
            key: "cta_section.description",
            label: "Website URL / Description",
            type: "text",
            placeholder: "www.markcorpotax.com",
          },
          {
            key: "cta_section.buttonText",
            label: "Button Text",
            type: "text",
            placeholder: "Subscribe",
          },
        ],
      },
      {
        id: "team",
        name: "Team Section",
        description: "Team members showcase",
        fields: [
          {
            key: "team_section.tagline",
            label: "Tagline",
            type: "text",
            placeholder: "Our Team",
          },
          {
            key: "team_section.title",
            label: "Title",
            type: "text",
            placeholder: "Meet Our Expert Team",
          },
          {
            key: "team_section.description",
            label: "Description",
            type: "textarea",
            placeholder: "Our experienced team of financial professionals...",
          },
          // Team Member 1
          {
            key: "team_section.member_1_name",
            label: "Member 1 - Name",
            type: "text",
            placeholder: "John Doe",
          },
          {
            key: "team_section.member_1_title",
            label: "Member 1 - Title",
            type: "text",
            placeholder: "CEO & Founder",
          },
          // Team Member 2
          {
            key: "team_section.member_2_name",
            label: "Member 2 - Name",
            type: "text",
            placeholder: "Jane Smith",
          },
          {
            key: "team_section.member_2_title",
            label: "Member 2 - Title",
            type: "text",
            placeholder: "Financial Advisor",
          },
          // Team Member 3
          {
            key: "team_section.member_3_name",
            label: "Member 3 - Name",
            type: "text",
            placeholder: "Mike Johnson",
          },
          {
            key: "team_section.member_3_title",
            label: "Member 3 - Title",
            type: "text",
            placeholder: "Investment Specialist",
          },
          // Team Member 4
          {
            key: "team_section.member_4_name",
            label: "Member 4 - Name",
            type: "text",
            placeholder: "Sarah Williams",
          },
          {
            key: "team_section.member_4_title",
            label: "Member 4 - Title",
            type: "text",
            placeholder: "Tax Consultant",
          },
        ],
      },
    ],
  },
  {
    id: "about",
    name: "About Page",
    path: "/about",
    sections: [
      {
        id: "hero",
        name: "Page Header",
        description: "About page header section",
        fields: [
          {
            key: "title",
            label: "Page Title",
            type: "text",
            placeholder: "About Us",
          },
          {
            key: "subtitle",
            label: "Subtitle",
            type: "textarea",
            placeholder:
              "We deliver innovative financial solutions and expert consulting to help you achieve your business goals.",
          },
        ],
      },
      {
        id: "stats",
        name: "Statistics",
        description: "Company statistics and achievements",
        fields: [
          {
            key: "years_experience",
            label: "Years of Experience",
            type: "text",
            placeholder: "12+",
          },
          {
            key: "happy_clients",
            label: "Happy Clients",
            type: "text",
            placeholder: "2500+",
          },
          {
            key: "projects_completed",
            label: "Projects Completed",
            type: "text",
            placeholder: "5000+",
          },
          {
            key: "success_rate",
            label: "Success Rate",
            type: "text",
            placeholder: "98%",
          },
        ],
      },
      {
        id: "mission",
        name: "Mission & Vision",
        description: "Company mission and vision",
        fields: [
          {
            key: "mission.title",
            label: "Mission Title",
            type: "text",
            placeholder: "Our Mission",
          },
          {
            key: "mission.description",
            label: "Mission Description",
            type: "textarea",
            placeholder:
              "To provide comprehensive financial solutions that empower businesses and individuals to achieve their financial goals.",
          },
          {
            key: "vision.title",
            label: "Vision Title",
            type: "text",
            placeholder: "Our Vision",
          },
          {
            key: "vision.description",
            label: "Vision Description",
            type: "textarea",
            placeholder:
              "To be the most trusted financial partner for businesses across India.",
          },
        ],
      },
      {
        id: "solutions",
        name: "Solutions Section",
        description: "Solutions that make a difference",
        fields: [
          {
            key: "title",
            label: "Section Title",
            type: "text",
            placeholder: "Solutions That Make a Difference",
          },
          {
            key: "description",
            label: "Section Description",
            type: "textarea",
            placeholder:
              "We provide expert consulting, risk management, and strategic advice to help your business thrive.",
          },
          {
            key: "solution_1",
            label: "Solution 1",
            type: "text",
            placeholder: "MSME Project Finance & Working Capital",
          },
          {
            key: "solution_2",
            label: "Solution 2",
            type: "text",
            placeholder: "Tax Planning & Compliance Services",
          },
          {
            key: "solution_3",
            label: "Solution 3",
            type: "text",
            placeholder: "Business Loan Advisory",
          },
          {
            key: "solution_4",
            label: "Solution 4",
            type: "text",
            placeholder: "Strategic Financial Consulting",
          },
        ],
      },
      {
        id: "process",
        name: "Process Section",
        description: "Strategy and process steps",
        fields: [
          {
            key: "title",
            label: "Section Title",
            type: "text",
            placeholder: "Strategy is the Key to Success",
          },
          {
            key: "description",
            label: "Section Description",
            type: "textarea",
            placeholder:
              "Our process is designed to ensure we understand your needs and deliver the best possible results.",
          },
          {
            key: "step_1_title",
            label: "Step 1 Title",
            type: "text",
            placeholder: "Fast Processing",
          },
          {
            key: "step_1_description",
            label: "Step 1 Description",
            type: "textarea",
            placeholder:
              "Fast and hassle-free loan processing with quick decision-making for timely funding.",
          },
          {
            key: "step_2_title",
            label: "Step 2 Title",
            type: "text",
            placeholder: "Affordable Rates",
          },
          {
            key: "step_2_description",
            label: "Step 2 Description",
            type: "textarea",
            placeholder:
              "Lowest and affordable interest rates with transparent communication at every step.",
          },
          {
            key: "step_3_title",
            label: "Step 3 Title",
            type: "text",
            placeholder: "Expert Guidance",
          },
          {
            key: "step_3_description",
            label: "Step 3 Description",
            type: "textarea",
            placeholder:
              "Strategic financial advice tailored to your business needs with dedicated support.",
          },
        ],
      },
      {
        id: "team",
        name: "Team Section",
        description: "Team information",
        fields: [
          {
            key: "tagline",
            label: "Tagline",
            type: "text",
            placeholder: "Our Team",
          },
          {
            key: "title",
            label: "Title",
            type: "text",
            placeholder: "Meet Our Expert Team",
          },
          {
            key: "member_1_name",
            label: "Member 1 Name",
            type: "text",
            placeholder: "Finance Division",
          },
          {
            key: "member_1_title",
            label: "Member 1 Title",
            type: "text",
            placeholder: "MSME Project Finance",
          },
          {
            key: "member_2_name",
            label: "Member 2 Name",
            type: "text",
            placeholder: "Taxation Division",
          },
          {
            key: "member_2_title",
            label: "Member 2 Title",
            type: "text",
            placeholder: "Tax & Accounting",
          },
          {
            key: "member_3_name",
            label: "Member 3 Name",
            type: "text",
            placeholder: "Loan Advisory",
          },
          {
            key: "member_3_title",
            label: "Member 3 Title",
            type: "text",
            placeholder: "Working Capital Solutions",
          },
          {
            key: "member_4_name",
            label: "Member 4 Name",
            type: "text",
            placeholder: "Business Consultancy",
          },
          {
            key: "member_4_title",
            label: "Member 4 Title",
            type: "text",
            placeholder: "Strategic Financial Planning",
          },
        ],
      },
    ],
  },
  {
    id: "services",
    name: "Services Page",
    path: "/services",
    sections: [
      {
        id: "hero",
        name: "Page Header",
        description: "Services page header",
        fields: [
          {
            key: "title",
            label: "Page Title",
            type: "text",
            placeholder: "Our Financial Services",
          },
          {
            key: "subtitle",
            label: "Subtitle",
            type: "textarea",
            placeholder:
              "A complete suite of financial solutions designed to help you achieve your goals at every stage of life.",
          },
        ],
      },
      {
        id: "stats",
        name: "Statistics",
        description: "Hero section statistics with icons",
        fields: [
          {
            key: "stat_1_icon",
            label: "Stat 1 Icon",
            type: "text",
            placeholder: "Briefcase",
          },
          {
            key: "stat_1_value",
            label: "Stat 1 Value",
            type: "text",
            placeholder: "500+",
          },
          {
            key: "stat_1_label",
            label: "Stat 1 Label",
            type: "text",
            placeholder: "Projects Funded",
          },
          {
            key: "stat_2_icon",
            label: "Stat 2 Icon",
            type: "text",
            placeholder: "HandCoins",
          },
          {
            key: "stat_2_value",
            label: "Stat 2 Value",
            type: "text",
            placeholder: "₹50Cr+",
          },
          {
            key: "stat_2_label",
            label: "Stat 2 Label",
            type: "text",
            placeholder: "Loans Facilitated",
          },
          {
            key: "stat_3_icon",
            label: "Stat 3 Icon",
            type: "text",
            placeholder: "ShieldHalf",
          },
          {
            key: "stat_3_value",
            label: "Stat 3 Value",
            type: "text",
            placeholder: "100%",
          },
          {
            key: "stat_3_label",
            label: "Stat 3 Label",
            type: "text",
            placeholder: "Client Satisfaction",
          },
        ],
      },
      {
        id: "services_intro",
        name: "Services Introduction",
        description: "Introduction to services section",
        fields: [
          {
            key: "tagline",
            label: "Tagline",
            type: "text",
            placeholder: "What We Offer",
          },
          {
            key: "title",
            label: "Title",
            type: "text",
            placeholder: "Professional Financial Services",
          },
          {
            key: "description",
            label: "Description",
            type: "textarea",
            placeholder:
              "We provide a comprehensive range of financial services tailored to meet your unique needs.",
          },
        ],
      },
      {
        id: "services_list",
        name: "Services List",
        description: "Individual service items",
        fields: [
          // Service 1
          {
            key: "service_1_slug",
            label: "Service 1 - URL Slug",
            type: "text",
            placeholder: "msme-project-finance",
          },
          {
            key: "service_1_icon",
            label: "Service 1 - Icon",
            type: "text",
            placeholder: "Building2",
          },
          {
            key: "service_1_title",
            label: "Service 1 - Title",
            type: "text",
            placeholder: "MSME Project Finance",
          },
          {
            key: "service_1_description",
            label: "Service 1 - Description",
            type: "textarea",
            placeholder:
              "Complete project financing solutions for small and medium enterprises.",
          },
          // Service 2
          {
            key: "service_2_slug",
            label: "Service 2 - URL Slug",
            type: "text",
            placeholder: "working-capital",
          },
          {
            key: "service_2_icon",
            label: "Service 2 - Icon",
            type: "text",
            placeholder: "TrendingUp",
          },
          {
            key: "service_2_title",
            label: "Service 2 - Title",
            type: "text",
            placeholder: "Working Capital Solutions",
          },
          {
            key: "service_2_description",
            label: "Service 2 - Description",
            type: "textarea",
            placeholder:
              "Flexible working capital loans to manage day-to-day operations.",
          },
          // Service 3
          {
            key: "service_3_slug",
            label: "Service 3 - URL Slug",
            type: "text",
            placeholder: "home-mortgage-loans",
          },
          {
            key: "service_3_icon",
            label: "Service 3 - Icon",
            type: "text",
            placeholder: "Landmark",
          },
          {
            key: "service_3_title",
            label: "Service 3 - Title",
            type: "text",
            placeholder: "Home & Mortgage Loans",
          },
          {
            key: "service_3_description",
            label: "Service 3 - Description",
            type: "textarea",
            placeholder:
              "Affordable home loans with competitive interest rates.",
          },
          // Service 4
          {
            key: "service_4_slug",
            label: "Service 4 - URL Slug",
            type: "text",
            placeholder: "tax-planning",
          },
          {
            key: "service_4_icon",
            label: "Service 4 - Icon",
            type: "text",
            placeholder: "Calculator",
          },
          {
            key: "service_4_title",
            label: "Service 4 - Title",
            type: "text",
            placeholder: "Taxation Services",
          },
          {
            key: "service_4_description",
            label: "Service 4 - Description",
            type: "textarea",
            placeholder: "Expert tax planning and compliance services.",
          },
          // Service 5
          {
            key: "service_5_slug",
            label: "Service 5 - URL Slug",
            type: "text",
            placeholder: "business-loans",
          },
          {
            key: "service_5_icon",
            label: "Service 5 - Icon",
            type: "text",
            placeholder: "CreditCard",
          },
          {
            key: "service_5_title",
            label: "Service 5 - Title",
            type: "text",
            placeholder: "Business Loans",
          },
          {
            key: "service_5_description",
            label: "Service 5 - Description",
            type: "textarea",
            placeholder: "Quick and hassle-free business loans.",
          },
          // Service 6
          {
            key: "service_6_slug",
            label: "Service 6 - URL Slug",
            type: "text",
            placeholder: "government-schemes",
          },
          {
            key: "service_6_icon",
            label: "Service 6 - Icon",
            type: "text",
            placeholder: "ShieldHalf",
          },
          {
            key: "service_6_title",
            label: "Service 6 - Title",
            type: "text",
            placeholder: "Government Schemes",
          },
          {
            key: "service_6_description",
            label: "Service 6 - Description",
            type: "textarea",
            placeholder:
              "Assistance with government loan schemes and subsidies.",
          },
        ],
      },
      {
        id: "why_choose",
        name: "Why Choose Us",
        description: "Benefits section",
        fields: [
          {
            key: "tagline",
            label: "Tagline",
            type: "text",
            placeholder: "Why Choose Us",
          },
          {
            key: "title",
            label: "Title",
            type: "text",
            placeholder: "Benefits of Working With Us",
          },
          {
            key: "description",
            label: "Description",
            type: "textarea",
            placeholder:
              "We provide exceptional financial services with a commitment to your success.",
          },
          // Benefit 1
          {
            key: "benefit_1_title",
            label: "Benefit 1 - Title",
            type: "text",
            placeholder: "Fast Processing",
          },
          {
            key: "benefit_1_description",
            label: "Benefit 1 - Description",
            type: "textarea",
            placeholder:
              "Quick loan approvals within 24-48 hours with minimal documentation.",
          },
          // Benefit 2
          {
            key: "benefit_2_title",
            label: "Benefit 2 - Title",
            type: "text",
            placeholder: "Competitive Rates",
          },
          {
            key: "benefit_2_description",
            label: "Benefit 2 - Description",
            type: "textarea",
            placeholder:
              "Best interest rates in the market with flexible repayment options.",
          },
          // Benefit 3
          {
            key: "benefit_3_title",
            label: "Benefit 3 - Title",
            type: "text",
            placeholder: "Expert Guidance",
          },
          {
            key: "benefit_3_description",
            label: "Benefit 3 - Description",
            type: "textarea",
            placeholder:
              "Dedicated relationship managers to guide you through the process.",
          },
          // Benefit 4
          {
            key: "benefit_4_title",
            label: "Benefit 4 - Title",
            type: "text",
            placeholder: "100% Transparency",
          },
          {
            key: "benefit_4_description",
            label: "Benefit 4 - Description",
            type: "textarea",
            placeholder:
              "No hidden charges with complete transparency in all transactions.",
          },
        ],
      },
    ],
  },
  {
    id: "settings",
    name: "Site Settings",
    path: "/",
    sections: [
      {
        id: "company",
        name: "Company Information",
        description: "Basic company details used across the site",
        fields: [
          {
            key: "company_name",
            label: "Company Name",
            type: "text",
            placeholder: "Mark Group",
          },
          {
            key: "company_tagline",
            label: "Company Tagline",
            type: "text",
            placeholder: "Shaping Financial Success in the AI Era",
          },
          {
            key: "company_description",
            label: "Company Description",
            type: "textarea",
            placeholder: "Founded in 2012, Mark Group is dedicated to...",
          },
        ],
      },
      {
        id: "contact",
        name: "Contact Details",
        description: "Contact information used in header/footer",
        fields: [
          {
            key: "phone_finance",
            label: "Finance Phone",
            type: "text",
            placeholder: "+91 97120 67891",
          },
          {
            key: "phone_taxation",
            label: "Taxation Phone",
            type: "text",
            placeholder: "+91 97738 22604",
          },
          {
            key: "email",
            label: "Email Address",
            type: "text",
            placeholder: "markcorpotax@gmail.com",
          },
          {
            key: "address",
            label: "Office Address",
            type: "textarea",
            placeholder: "705, 7th Floor, APMC Building...",
          },
        ],
      },
      {
        id: "social",
        name: "Social Media Links",
        description: "Social media profile URLs",
        fields: [
          {
            key: "facebook",
            label: "Facebook URL",
            type: "text",
            placeholder: "https://facebook.com/markgroup",
          },
          {
            key: "twitter",
            label: "Twitter URL",
            type: "text",
            placeholder: "https://twitter.com/markgroup",
          },
          {
            key: "linkedin",
            label: "LinkedIn URL",
            type: "text",
            placeholder: "https://linkedin.com/company/markgroup",
          },
          {
            key: "instagram",
            label: "Instagram URL",
            type: "text",
            placeholder: "https://instagram.com/markgroup",
          },
        ],
      },
    ],
  },
  {
    id: "blog",
    name: "Blog Page",
    path: "/blog",
    sections: [
      {
        id: "hero",
        name: "Page Header",
        description: "Blog page header section",
        fields: [
          {
            key: "title",
            label: "Page Title",
            type: "text",
            placeholder: "Blog & Insights",
          },
          {
            key: "subtitle",
            label: "Subtitle",
            type: "textarea",
            placeholder:
              "Stay updated with the latest insights, trends, and news in the world of finance and business.",
          },
        ],
      },
      {
        id: "stats",
        name: "Statistics",
        description: "Hero section statistics",
        fields: [
          {
            key: "stat_1_value",
            label: "Stat 1 Value",
            type: "text",
            placeholder: "50+",
          },
          {
            key: "stat_1_label",
            label: "Stat 1 Label",
            type: "text",
            placeholder: "Articles Published",
          },
          {
            key: "stat_2_value",
            label: "Stat 2 Value",
            type: "text",
            placeholder: "10K+",
          },
          {
            key: "stat_2_label",
            label: "Stat 2 Label",
            type: "text",
            placeholder: "Monthly Readers",
          },
          {
            key: "stat_3_value",
            label: "Stat 3 Value",
            type: "text",
            placeholder: "Weekly",
          },
          {
            key: "stat_3_label",
            label: "Stat 3 Label",
            type: "text",
            placeholder: "Fresh Content",
          },
        ],
      },
      {
        id: "sidebar",
        name: "Sidebar Content",
        description: "Sidebar titles and CTA content",
        fields: [
          {
            key: "categories_title",
            label: "Categories Section Title",
            type: "text",
            placeholder: "Categories",
          },
          {
            key: "recent_posts_title",
            label: "Recent Posts Section Title",
            type: "text",
            placeholder: "Recent Posts",
          },
          {
            key: "tags_title",
            label: "Tags Section Title",
            type: "text",
            placeholder: "Tags",
          },
          {
            key: "cta_title",
            label: "CTA Card Title",
            type: "text",
            placeholder: "Work with us",
          },
          {
            key: "cta_description",
            label: "CTA Card Description",
            type: "textarea",
            placeholder:
              "All your business solutions and consulting needs in one convenient, accessible place",
          },
          {
            key: "cta_button",
            label: "CTA Button Text",
            type: "text",
            placeholder: "Contact us",
          },
        ],
      },
      {
        id: "categories",
        name: "Blog Categories",
        description: "Categories displayed in sidebar",
        fields: [
          {
            key: "category_1_name",
            label: "Category 1 Name",
            type: "text",
            placeholder: "Business",
          },
          {
            key: "category_1_count",
            label: "Category 1 Count",
            type: "text",
            placeholder: "12",
          },
          {
            key: "category_2_name",
            label: "Category 2 Name",
            type: "text",
            placeholder: "Finance",
          },
          {
            key: "category_2_count",
            label: "Category 2 Count",
            type: "text",
            placeholder: "8",
          },
          {
            key: "category_3_name",
            label: "Category 3 Name",
            type: "text",
            placeholder: "Tax Planning",
          },
          {
            key: "category_3_count",
            label: "Category 3 Count",
            type: "text",
            placeholder: "15",
          },
          {
            key: "category_4_name",
            label: "Category 4 Name",
            type: "text",
            placeholder: "Loans",
          },
          {
            key: "category_4_count",
            label: "Category 4 Count",
            type: "text",
            placeholder: "10",
          },
          {
            key: "category_5_name",
            label: "Category 5 Name",
            type: "text",
            placeholder: "Investment",
          },
          {
            key: "category_5_count",
            label: "Category 5 Count",
            type: "text",
            placeholder: "6",
          },
        ],
      },
      {
        id: "tags",
        name: "Blog Tags",
        description: "Tags displayed in sidebar",
        fields: [
          {
            key: "tag_1",
            label: "Tag 1",
            type: "text",
            placeholder: "Finance",
          },
          {
            key: "tag_2",
            label: "Tag 2",
            type: "text",
            placeholder: "Business",
          },
          {
            key: "tag_3",
            label: "Tag 3",
            type: "text",
            placeholder: "Tax Planning",
          },
          {
            key: "tag_4",
            label: "Tag 4",
            type: "text",
            placeholder: "Loans",
          },
          {
            key: "tag_5",
            label: "Tag 5",
            type: "text",
            placeholder: "Investment",
          },
          {
            key: "tag_6",
            label: "Tag 6",
            type: "text",
            placeholder: "MSME",
          },
          {
            key: "tag_7",
            label: "Tag 7",
            type: "text",
            placeholder: "Strategy",
          },
          {
            key: "tag_8",
            label: "Tag 8",
            type: "text",
            placeholder: "Growth",
          },
        ],
      },
      {
        id: "posts",
        name: "Blog Posts",
        description: "Manage blog posts displayed on this page",
        fields: [], // Special section - handled by custom component
      },
    ],
  },
  {
    id: "contact",
    name: "Contact Page",
    path: "/contact",
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        description: "Contact page header with stats cards",
        fields: [
          {
            key: "title",
            label: "Page Title",
            type: "text",
            placeholder: "Contact Us",
          },
          {
            key: "subtitle",
            label: "Subtitle",
            type: "textarea",
            placeholder:
              "Get in touch with our experts to discuss your financial needs and discover how we can help you achieve your goals.",
          },
          {
            key: "stat_1_value",
            label: "Card 1 Value",
            type: "text",
            placeholder: "24/7",
          },
          {
            key: "stat_1_label",
            label: "Card 1 Label",
            type: "text",
            placeholder: "Support Available",
          },
          {
            key: "stat_2_value",
            label: "Card 2 Value",
            type: "text",
            placeholder: "<24hrs",
          },
          {
            key: "stat_2_label",
            label: "Card 2 Label",
            type: "text",
            placeholder: "Response Time",
          },
          {
            key: "stat_3_value",
            label: "Card 3 Value",
            type: "text",
            placeholder: "Surat",
          },
          {
            key: "stat_3_label",
            label: "Card 3 Label",
            type: "text",
            placeholder: "Head Office",
          },
        ],
      },
      {
        id: "form",
        name: "Contact Form",
        description: "Form section titles and labels",
        fields: [
          {
            key: "form_title",
            label: "Form Title",
            type: "text",
            placeholder: "Get in touch",
          },
          {
            key: "form_subtitle",
            label: "Form Subtitle",
            type: "text",
            placeholder: "We are here for you! How can we help?",
          },
          {
            key: "name_label",
            label: "Name Field Label",
            type: "text",
            placeholder: "Your Name",
          },
          {
            key: "email_label",
            label: "Email Field Label",
            type: "text",
            placeholder: "Email Here",
          },
          {
            key: "message_label",
            label: "Message Field Label",
            type: "text",
            placeholder: "Message Here",
          },
          {
            key: "subject_label",
            label: "Subject Field Label",
            type: "text",
            placeholder: "Subject",
          },
          {
            key: "submit_button",
            label: "Submit Button Text",
            type: "text",
            placeholder: "Submit",
          },
        ],
      },
      {
        id: "info",
        name: "Contact Information",
        description: "Address, email, and phone details",
        fields: [
          {
            key: "address_title",
            label: "Address Title",
            type: "text",
            placeholder: "Address",
          },
          {
            key: "address_line_1",
            label: "Address Line 1",
            type: "text",
            placeholder: "705, 7th Floor, APMC Building,",
          },
          {
            key: "address_line_2",
            label: "Address Line 2",
            type: "text",
            placeholder: "Krushi Bazar, Sahara Darwaja,",
          },
          {
            key: "address_line_3",
            label: "Address Line 3",
            type: "text",
            placeholder: "Ring Road, Surat - 395003",
          },
          {
            key: "email_title",
            label: "Email Section Title",
            type: "text",
            placeholder: "Mail Us",
          },
          {
            key: "email_1",
            label: "Primary Email",
            type: "text",
            placeholder: "markcorpotax@gmail.com",
          },
          {
            key: "email_2",
            label: "Secondary Email",
            type: "text",
            placeholder: "info@markcorpotax.com",
          },
          {
            key: "phone_title",
            label: "Phone Section Title",
            type: "text",
            placeholder: "Telephone",
          },
          {
            key: "phone_1_label",
            label: "Phone 1 Label",
            type: "text",
            placeholder: "Finance Division:",
          },
          {
            key: "phone_1_number",
            label: "Phone 1 Number",
            type: "text",
            placeholder: "+91 97120 67891",
          },
          {
            key: "phone_2_label",
            label: "Phone 2 Label",
            type: "text",
            placeholder: "Taxation Division:",
          },
          {
            key: "phone_2_number",
            label: "Phone 2 Number",
            type: "text",
            placeholder: "+91 97738 22604",
          },
        ],
      },
    ],
  },
  {
    id: "appointment",
    name: "Appointment Page",
    path: "/appointment",
    sections: [
      {
        id: "hero",
        name: "Hero Section",
        description: "Appointment page header with stats",
        fields: [
          {
            key: "title",
            label: "Page Title",
            type: "text",
            placeholder: "Book an Appointment",
          },
          {
            key: "subtitle",
            label: "Subtitle",
            type: "textarea",
            placeholder:
              "Schedule a consultation with our financial experts to discuss your goals and create a personalized plan.",
          },
          {
            key: "stat_1_value",
            label: "Stat 1 Value",
            type: "text",
            placeholder: "30+",
          },
          {
            key: "stat_1_label",
            label: "Stat 1 Label",
            type: "text",
            placeholder: "Expert Advisors",
          },
          {
            key: "stat_2_value",
            label: "Stat 2 Value",
            type: "text",
            placeholder: "15min",
          },
          {
            key: "stat_2_label",
            label: "Stat 2 Label",
            type: "text",
            placeholder: "Avg. Response",
          },
          {
            key: "stat_3_value",
            label: "Stat 3 Value",
            type: "text",
            placeholder: "Free",
          },
          {
            key: "stat_3_label",
            label: "Stat 3 Label",
            type: "text",
            placeholder: "Consultation",
          },
        ],
      },
      {
        id: "form",
        name: "Booking Form",
        description: "Form labels and placeholders",
        fields: [
          {
            key: "form_title",
            label: "Form Title",
            type: "text",
            placeholder: "Schedule Your Consultation",
          },
          {
            key: "form_subtitle",
            label: "Form Subtitle",
            type: "text",
            placeholder: "Fill in the details below to book your appointment",
          },
          {
            key: "name_label",
            label: "Name Field Label",
            type: "text",
            placeholder: "Full Name",
          },
          {
            key: "email_label",
            label: "Email Field Label",
            type: "text",
            placeholder: "Email Address",
          },
          {
            key: "phone_label",
            label: "Phone Field Label",
            type: "text",
            placeholder: "Phone Number",
          },
          {
            key: "service_label",
            label: "Service Field Label",
            type: "text",
            placeholder: "Select Service",
          },
          {
            key: "date_label",
            label: "Date Field Label",
            type: "text",
            placeholder: "Preferred Date",
          },
          {
            key: "time_label",
            label: "Time Field Label",
            type: "text",
            placeholder: "Preferred Time",
          },
          {
            key: "notes_label",
            label: "Notes Field Label",
            type: "text",
            placeholder: "Additional Notes",
          },
          {
            key: "submit_button",
            label: "Submit Button Text",
            type: "text",
            placeholder: "Book Appointment",
          },
        ],
      },
      {
        id: "info",
        name: "Info Section",
        description: "Side information and benefits",
        fields: [
          {
            key: "info_title",
            label: "Info Section Title",
            type: "text",
            placeholder: "Why Book With Us?",
          },
          {
            key: "benefit_1",
            label: "Benefit 1",
            type: "text",
            placeholder: "Expert Financial Advisors",
          },
          {
            key: "benefit_2",
            label: "Benefit 2",
            type: "text",
            placeholder: "Personalized Solutions",
          },
          {
            key: "benefit_3",
            label: "Benefit 3",
            type: "text",
            placeholder: "Flexible Scheduling",
          },
          {
            key: "benefit_4",
            label: "Benefit 4",
            type: "text",
            placeholder: "Confidential Consultation",
          },
          {
            key: "contact_title",
            label: "Contact Section Title",
            type: "text",
            placeholder: "Need Help?",
          },
          {
            key: "contact_phone",
            label: "Contact Phone",
            type: "text",
            placeholder: "+91 97120 67891",
          },
          {
            key: "contact_email",
            label: "Contact Email",
            type: "text",
            placeholder: "appointments@markcorpotax.com",
          },
        ],
      },
    ],
  },
];
