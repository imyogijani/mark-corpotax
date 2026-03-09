import { 
  Building2, 
  Briefcase, 
  CreditCard, 
  Scale, 
  FileCheck, 
  ShieldCheck, 
  Coins, 
  TrendingUp,
  Receipt,
  FileSearch,
  Users,
  PieChart,
  Home,
  Landmark,
  Factory,
  GraduationCap,
  Percent,
  FileText,
  Gavel,
  Sparkles,
  Zap,
  Award
} from "lucide-react";

export interface Service {
  id: string;
  name: string;
  category: "Retail / Mortgage" | "SME / MSME Loans" | "Unsecured Loans" | "Taxation Division";
  description: string;
  features: string[];
  benefits: string[];
  icon: any;
  image: string;
}

export const servicesData: Service[] = [
  // --- Retail / Mortgage ---
  {
    id: "home-loan",
    name: "Home Loans",
    category: "Retail / Mortgage",
    description: "Expert guidance for securing the best mortgage rates for your dream home with minimum documentation.",
    features: [
      "Competitive interest rates from top banks",
      "Flexible repayment tenures up to 30 years",
      "Comprehensive guidance on home search",
      "Assistance in property legal verification"
    ],
    benefits: [
      "End-to-end documentation support",
      "Customized repayment plans",
      "Tax benefits under Section 80C and 24",
      "Fast-track processing for pre-approved properties"
    ],
    icon: Home,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "lap",
    name: "Loan Against Property",
    category: "Retail / Mortgage",
    description: "Unlock the value of your residential or commercial property to meet business or personal financial needs.",
    features: [
      "Loan up to 70-80% of property value",
      "Lower EMI compared to personal loans",
      "Longer tenure for easy repayment",
      "Simplified document processing"
    ],
    benefits: [
      "High loan amount availability",
      "Continued usage of the property",
      "Ideal for business expansion and bulk purchases",
      "Lower cost of capital"
    ],
    icon: Coins,
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "commercial-loan",
    name: "Commercial Loans",
    category: "Retail / Mortgage",
    description: "Tailored financial solutions for purchasing commercial properties, offices, or retail spaces at prime locations.",
    features: [
      "High funding for commercial asset purchase",
      "Dedicated commercial asset expert",
      "Balance transfer with top-up options",
      "Competitive yields and tenures"
    ],
    benefits: [
      "Grow your business footprint",
      "Easy approval for prime commercial zones",
      "Flexible moratorium periods",
      "Minimized processing fee"
    ],
    icon: Building2,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "industrial-loan",
    name: "Industrial Loans",
    category: "Retail / Mortgage",
    description: "Specialized funding for industrial plots, warehouses, and factory buildings with favorable repayment terms.",
    features: [
      "Customized for industrial zone regulations",
      "Large ticket size funding",
      "Support for warehouse construction",
      "Liaison with industrial development boards"
    ],
    benefits: [
      "Infrastructure development support",
      "Long-term capital security",
      "Favorable interest rates for manufacturing",
      "Compliance-ready processing"
    ],
    icon: Factory,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "balance-transfer",
    name: "Balance Transfer & Top Up",
    category: "Retail / Mortgage",
    description: "Switch your existing expensive loans to lower rates and get additional funding for your immediate needs.",
    features: [
      "Significant interest rate reduction",
      "Additional funds as top-up loan",
      "Consolidation of multiple high-interest debts",
      "Zero hidden costs during transition"
    ],
    benefits: [
      "Substantial monthly savings",
      "Reduced net interest outgo",
      "Quick disbursement of top-up amount",
      "Hassle-free digital migration"
    ],
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "education-loan",
    name: "Education Loan",
    category: "Retail / Mortgage",
    description: "Empowering students to achieve their global academic dreams with comprehensive financial support and easy repayment.",
    features: [
      "Coverage for intuition, stay and travel",
      "No security needed for certain limits",
      "Moratorium during study period",
      "Acceptance for top global universities"
    ],
    benefits: [
      "Financial independence for students",
      "Tax benefits under Section 80E",
      "Competitive forex rates integration",
      "Step-up repayment options"
    ],
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "lrd",
    name: "Lease Rental Discounting (LRD)",
    category: "Retail / Mortgage",
    description: "Leverage your future rental income to get immediate capital for business expansion or investments.",
    features: [
      "Loan based on discounted future rentals",
      "Tripartite agreement support",
      "Escrow account facility",
      "Higher eligibility based on lease quality"
    ],
    benefits: [
      "Immediate liquidity from fixed assets",
      "No disturbance to lease arrangements",
      "Self-liquidating loan through rentals",
      "Optimal wealth creation tool"
    ],
    icon: Receipt,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop"
  },

  // --- SME / MSME Loans ---
  {
    id: "msme-project-finance",
    name: "Project Finance",
    category: "SME / MSME Loans",
    description: "Strategic funding for new project setups, expansion, or infrastructure with end-to-end guidance.",
    features: [
      "Detailed project report (DPR) preparation",
      "Technical & financial feasibility analysis",
      "Debt-equity structure optimization",
      "Bank liaisoning at senior levels"
    ],
    benefits: [
      "Optimal capital mix",
      "Strategic financial structuring",
      "Expert navigation through bank policies",
      "Fastest turnaround for large projects"
    ],
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "working-capital",
    name: "Working Capital (CC/OD)",
    category: "SME / MSME Loans",
    description: "Fluid capital for daily operations, inventory, and trade cycles with CC limits and OD facilities.",
    features: [
      "Cash Credit (CC) limit advisory",
      "Overdraft (OD) facility for business",
      "Stock and debtors based limit setting",
      "Annual review and enhancement support"
    ],
    benefits: [
      "Zero operational friction",
      "Interest only on utilized amount",
      "Healthy cash flow management",
      "Enhanced vendor creditworthiness"
    ],
    icon: Percent,
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "lc",
    name: "Letter of Credit (LC)",
    category: "SME / MSME Loans",
    description: "Facilitate global and domestic trade with banking guarantees that ensure trust and timely delivery.",
    features: [
      "Import & Export LC advisory",
      "SBLC (Standby Letter of Credit)",
      "Vetting of LC terms for risk mitigation",
      "Discounting facilities integration"
    ],
    benefits: [
      "Elimination of non-payment risk",
      "Access to global sellers",
      "Improved negotiation power",
      "Cost-effective trade finance"
    ],
    icon: FileText,
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "bg",
    name: "Bank Guarantee (BG)",
    category: "SME / MSME Loans",
    description: "Secure government tenders and private contracts with performance or financial bank guarantees.",
    features: [
      "Performance and Financial BGs",
      "Tender and Bid-bond support",
      "Competitive commission rates",
      "Quick limit setup and issuance"
    ],
    benefits: [
      "Participation in large projects",
      "Liquidity preservation (no EMD lock)",
      "Stronger corporate reputation",
      "Standardized banking trust"
    ],
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "subsidies",
    name: "Government Subsidies",
    category: "SME / MSME Loans",
    description: "Unlock state and central government incentives including PMEGP, CMEGP, and sector-specific capital subsidies.",
    features: [
      "End-to-end subsidy application management",
      "Eligibility audit for PMEGP/CMEGP",
      "Central government TUFS and CLCSS support",
      "DIC & State department liaisoning"
    ],
    benefits: [
      "Significant reduction in project cost",
      "Non-refundable capital inject",
      "Interest subvention benefits",
      "Compliance-proof documentation"
    ],
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbdfbb5?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "machinery-loan",
    name: "Machinery Term Loan",
    category: "SME / MSME Loans",
    description: "Finance the purchase of high-tech production equipment and machinery with specialized asset funding.",
    features: [
      "Up to 80-90% funding on machinery cost",
      "Direct payment to vendors",
      "Fast approval based on asset quality",
      "No additional collateral in many cases"
    ],
    benefits: [
      "Technological upgradation",
      "Improved production efficiency",
      "Preservation of working capital",
      "Tax depreciation benefits"
    ],
    icon: Landmark,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop"
  },

  // --- Unsecured Loans ---
  {
    id: "personal-loan",
    name: "Personal Loans",
    category: "Unsecured Loans",
    description: "Instant unsecured funding for personal milestones, travel, or medical needs with minimal documentation.",
    features: [
      "No collateral required",
      "Instant disbursement for salary-based",
      "Flexible repayment up to 5 years",
      "Paperless digital process available"
    ],
    benefits: [
      "Immediate life-event funding",
      "No risk to assets",
      "Simplified compliance",
      "Debt consolidation options"
    ],
    icon: Users,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "business-loan",
    name: "Business Loans",
    category: "Unsecured Loans",
    description: "Unsecured capital for business expansion, hiring, or marketing without mortgaging business assets.",
    features: [
      "Loans without security for MSMEs",
      "Approval based on business turnover",
      "Fast processing within 3-4 days",
      "Tenures up to 3 years"
    ],
    benefits: [
      "Quick business scaling",
      "Asset-light balance sheet",
      "Emergency cash buffer",
      "Simplified document list"
    ],
    icon: CreditCard,
    image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=1000&auto=format&fit=crop"
  },

  // --- Taxation Division ---
  {
    id: "audit-assurance",
    name: "Audit & Assurance",
    category: "Taxation Division",
    description: "Professional statutory and internal audits provided by expert CAs to ensure financial integrity.",
    features: [
      "Statutory Audit & Tax Audit",
      "Internal Audit & Forensic Audit",
      "Management & Stock Audits",
      "Direct representation to boards"
    ],
    benefits: [
      "Regulatory compliance security",
      "High stakeholder confidence",
      "Identification of financial leakages",
      "Transparent corporate governance"
    ],
    icon: FileSearch,
    image: "https://images.unsplash.com/photo-1554224155-db674d29df45?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "income-tax",
    name: "Direct & Indirect Tax",
    category: "Taxation Division",
    description: "Strategic planning and compliance for Income Tax and other direct/indirect levies to minimize risk.",
    features: [
      "Tax planning for HNI & Corporates",
      "Advance tax & TDS management",
      "Appeal & Assessment representation",
      "International taxation support"
    ],
    benefits: [
      "Legal tax minimization",
      "Avoidance of costly notices",
      "Strategic wealth planning",
      "Seamless return filing"
    ],
    icon: Scale,
    image: "https://images.unsplash.com/photo-1554224155-db674d29df45?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "gst-compliance",
    name: "GST Compliance",
    category: "Taxation Division",
    description: "Comprehensive GST advisory including registration, return filing, and departmental audit support.",
    features: [
      "Registration & Revision support",
      "Monthly/Annual GST filings",
      "ITC reconciliation (2A/2B matching)",
      "Anti-evasion departmental support"
    ],
    benefits: [
      "Zero compliance penalties",
      "Maximized tax credit flow",
      "Standardized business accounts",
      "Audit-ready data systems"
    ],
    icon: FileCheck,
    image: "https://images.unsplash.com/photo-1586282391083-72575c51741b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "roc",
    name: "Corporate ROC Services",
    category: "Taxation Division",
    description: "Hassle-free MCA and ROC compliance, company registration, and statutory secretarial services.",
    features: [
      "Company & LLP Incorporation",
      "Annual returns (MGT-7, AOC-4)",
      "Director KYC & Modification BOC",
      "Corporate restructuring support"
    ],
    benefits: [
      "Legal existence security",
      "Transparent corporate record",
      "Shield against director disqualification",
      "Investor-ready statutory records"
    ],
    icon: Gavel,
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1000&auto=format&fit=crop"
  }
];
