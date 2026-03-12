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
    description: "Navigate the complex landscape of home financing with our expert advisory. We secure the most competitive mortgage rates across India's leading financial institutions for your primary residence or investment property.",
    features: [
      "Preferential rates from 15+ Top-tier Banks",
      "Loan tenure up to 30 years with flexible EMI",
      "Pre-legal and technical valuation support",
      "Digital-first application for faster processing"
    ],
    benefits: [
      "Zero hidden administrative charges",
      "Maximization of PMAY subsidy benefits",
      "High-value eligibility for NRIs and PIOs",
      "Doorstep documentation and advisory"
    ],
    icon: Home,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "lap",
    name: "Loan Against Property",
    category: "Retail / Mortgage",
    description: "Leverage the equity in your residential, commercial, or industrial assets to unlock liquidity. Our LAP solutions offer lower interest rates than personal loans, making them ideal for long-term business capital.",
    features: [
      "LTV ratios up to 75% of market value",
      "Funding for both residential & commercial assets",
      "Overdraft and Term Loan variants available",
      "Simplified proof-of-income requirements"
    ],
    benefits: [
      "Lower cost of capital for business expansion",
      "Tax deductions on utilized interest",
      "Retain full possession of your asset",
      "Consolidation of unsecured high-cost debt"
    ],
    icon: Coins,
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "commercial-loan",
    name: "Commercial Loans",
    category: "Retail / Mortgage",
    description: "Invest in high-yield commercial real estate. We provide specialized consulting for purchasing office spaces, retail outlets, and warehouses at prime business districts with high investment potential.",
    features: [
      "High-ticket size funding up to 50 Cr",
      "Strategic LRD (Lease Rental Discounting) integration",
      "Balance transfer with significant top-up",
      "Flexible moratorium and grace periods"
    ],
    benefits: [
      "Build a tangible corporate asset portfolio",
      "Approval for upcoming prime commercial zones",
      "Minimized processing timelines",
      "Consultative approach to yield analysis"
    ],
    icon: Building2,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "industrial-loan",
    name: "Industrial Loans",
    category: "Retail / Mortgage",
    description: "Custom-fitted financial structures for industrial units, manufacturing plants, and logistics hubs. We bridge the gap between industrial vision and banking compliance.",
    features: [
      "Funding for specialized industrial constructions",
      "Liaisoning with GIDC/MIDC/Industrial Boards",
      "Term loans for civil and MEP infrastructure",
      "Strategic alignment with state industrial policies"
    ],
    benefits: [
      "Secured long-term capital for manufacturing",
      "Scale operations with specialized infra",
      "Preferential rates for MSME manufacturing units",
      "Expert audit of industrial board compliances"
    ],
    icon: Factory,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "balance-transfer",
    name: "Balance Transfer & Top Up",
    category: "Retail / Mortgage",
    description: "Don't let high interest rates stagnate your growth. Migrate your current debt to banks offering premium benefits and lower spreads, with additional 'Top-Up' funding for immediate expansion.",
    features: [
      "Savings analysis of current vs. new EMI",
      "Quick sanction of additional Top-Up capital",
      "Minimal documentation for existing loan holders",
      "No foreclosure penalties in most cases"
    ],
    benefits: [
      "Substantial reduction in net interest outgo",
      "Fresh liquidity for business or personal use",
      "Unified single-window debt management",
      "Improved credit score through structured debt"
    ],
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "education-loan",
    name: "Education Loan",
    category: "Retail / Mortgage",
    description: "Investing in global excellence. We offer comprehensive education finance covering tuition, living expenses, and travel for students aspiring to study at top-ranked universities worldwide.",
    features: [
      "Unsecured loans up to 40 Lakhs for top institutes",
      "Acceptance for 500+ premium global universities",
      "Comprehensive insurance and forex support",
      "Flexible grace period post-course completion"
    ],
    benefits: [
      "Tax benefits under IT Act Section 80E",
      "Moratorium period for financial ease",
      "Building a global credit profile for students",
      "End-to-end foreign exchange advisory"
    ],
    icon: GraduationCap,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "lrd",
    name: "Lease Rental Discounting (LRD)",
    category: "Retail / Mortgage",
    description: "Convert your future lease receivables into immediate capital. Ideal for owners of properties leased to blue-chip companies, supermarkets, or multinational banks.",
    features: [
      "Discounting of multi-year lease agreements",
      "Tripartite agreement with bank and lessee",
      "Escrow account mechanism for repayments",
      "High loan amounts based on lease strength"
    ],
    benefits: [
      "No burden on current operating cash flow",
      "Self-liquidating loan structure",
      "Lowest interest rates in the commercial segment",
      "Immediate capital for new asset acquisitions"
    ],
    icon: Receipt,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop"
  },

  // --- SME / MSME Loans ---
  {
    id: "msme-project-finance",
    name: "Project Finance",
    category: "SME / MSME Loans",
    description: "Holistic advisory for greenfield and brownfield projects. From preparing Bankable Detailed Project Reports (DPR) to senior-level bank liaisoning, we ensure your project gets the capital it deserves.",
    features: [
      "Feasibility and TEV (Techno-Economic Viability)",
      "Financial modeling and projections for 10 years",
      "Strategic debt-equity ratio planning",
      "Liaison with PSU and Private Sector Banks"
    ],
    benefits: [
      "Optimized interest rates for long-term projects",
      "Strategic financial structuring to avoid risk",
      "Fastest sanction through expert channeling",
      "Expert navigation of complex bank policies"
    ],
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "working-capital",
    name: "Working Capital (CC/OD)",
    category: "SME / MSME Loans",
    description: "Power your daily operations and handle inventory cycles without friction. We setup Cash Credit and Overdraft limits tailored to your specific business turnover and debtor cycles.",
    features: [
      "Advisory on CMA (Credit Monitoring Arrangement)",
      "Overdraft limits on property and FD assets",
      "Stock and Debtors statement support",
      "Annual review and limit enhancement advisory"
    ],
    benefits: [
      "Pay interest only on the utilized amount",
      "Manage peak-season inventory demand",
      "Stronger vendor negotiation through liquidity",
      "Maintain a healthy current ratio"
    ],
    icon: Percent,
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "lc",
    name: "Letter of Credit (LC)",
    category: "SME / MSME Loans",
    description: "Trust but verify. Our Trade Finance advisory covers Letters of Credit (LC) and SBLC, enabling you to trade securely with global suppliers while optimizing your bank limits.",
    features: [
      "Import/Export LCs and SBLC advisory",
      "Bill Discounting and Usance LC support",
      "Risk vetting of complex trade documents",
      "Integration with FEMA compliance"
    ],
    benefits: [
      "Build global supplier trust instantly",
      "Access international markets safely",
      "Optimize cash flow through LC discounting",
      "Avoid non-payment risks in export trade"
    ],
    icon: FileText,
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "bg",
    name: "Bank Guarantee (BG)",
    category: "SME / MSME Loans",
    description: "Competing at the highest level requires strong banking backing. We facilitate Performance and Financial Bank Guarantees for government tenders and corporate contracts.",
    features: [
      "Performance, Financial, and Tender BGs",
      "Bid-bond support for global tenders",
      "Strategic reduction of cash margin requirements",
      "Swift issuance for urgent contract deadlines"
    ],
    benefits: [
      "Qualify for large-scale infrastructure projects",
      "Protect liquidity (Avoid EMD lockups)",
      "Stronger corporate reputation with vendors",
      "Globally accepted banking trust instruments"
    ],
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "subsidies",
    name: "Government Subsidies",
    category: "SME / MSME Loans",
    description: "We help you unlock the true potential of government incentives. Strategic advisory for PMEGP, CMEGP, ATUFS, and various state-level capital and interest subsidies.",
    features: [
      "Audit of eligibility for Central & State schemes",
      "Application filing and departmental liaisoning",
      "Assistance in DIC and MSME registrations",
      "Interest Subvention & CLCSS capital subsidy"
    ],
    benefits: [
      "Massive reduction in effective project cost",
      "Access non-refundable government grants",
      "Lowest effective interest rates through subvention",
      "Full compliance with government audit norms"
    ],
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1526304640581-d334cdbdfbb5?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "machinery-loan",
    name: "Machinery Term Loan",
    category: "SME / MSME Loans",
    description: "Upgrade your production line. Specialized term loans for modern CNC, Industrial automation, and heavy machinery with asset-based security and customized repayment.",
    features: [
      "Funding up to 85% of machinery cost",
      "Vendor payment directly from the bank",
      "Quick sanction based on proforma invoice",
      "Alignment with CGTMSE for collateral-free"
    ],
    benefits: [
      "Immediate technological edge in manufacturing",
      "Preserve working capital for raw materials",
      "Depreciation tax benefits on and machinery",
      "Improved precision and production volume"
    ],
    icon: Landmark,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1000&auto=format&fit=crop"
  },

  // --- Unsecured Loans ---
  {
    id: "personal-loan",
    name: "Personal Loans",
    category: "Unsecured Loans",
    description: "Instant capital for life's important moments. We offer priority processing for salaried professionals and business owners for medical, marriage, or travel needs.",
    features: [
      "Zero collateral or security requirements",
      "Sanction within 24 hours for top companies",
      "Digital-only process for minimal friction",
      "Tenure options from 12 to 60 months"
    ],
    benefits: [
      "Immediate liquidity for emergencies",
      "No risk to personal property assets",
      "Simplified KYC and credit assessment",
      "Debt consolidation for higher savings"
    ],
    icon: Users,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "business-loan",
    name: "Business Loans",
    category: "Unsecured Loans",
    description: "Scale without mortgaging your future. Unsecured business capital for MSMEs to handle marketing, hiring, or immediate stock purchases based on GST and turnover.",
    features: [
      "Unsecured limits up to 1 Crore",
      "Approval based on banking and GST history",
      "3-day turnaround from login to funding",
      "Flexible usage with no asset hypothecation"
    ],
    benefits: [
      "Rapid scaling of business operations",
      "Maintain an asset-light balance sheet",
      "Emergency cash buffer for trade cycles",
      "Minimum documentation for growing firms"
    ],
    icon: CreditCard,
    image: "https://images.unsplash.com/photo-1520333789090-1afc82db536a?q=80&w=1000&auto=format&fit=crop"
  },

  // --- Taxation Division ---
  {
    id: "audit-assurance",
    name: "Audit & Assurance",
    category: "Taxation Division",
    description: "Providing legal integrity and financial transparency. Our expert CAs perform comprehensive audits to ensure your business stays ahead of regulatory requirements.",
    features: [
      "Statutory Audit & Companies Act Compliance",
      "Internal and Forensic Financial Auditing",
      "Tax Audit under Income Tax Act Section 44AB",
      "Stock and Fixed Asset verification audits"
    ],
    benefits: [
      "Full protection from statutory penalties",
      "Enhanced credibility with bankers/investors",
      "Identification of operational leakages",
      "Strategic insights into financial health"
    ],
    icon: FileSearch,
    image: "https://images.unsplash.com/photo-1554224155-db674d29df45?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "income-tax",
    name: "Direct & Indirect Tax",
    category: "Taxation Division",
    description: "Strategic tax planning for HNI, Corporate, and SME clients. We ensure you stay compliant while legally minimizing your tax liabilities through expert planning.",
    features: [
      "Tax Planning and Wealth Management",
      "Representation in Assessment & Appeals",
      "TDS, TCS, and Advance Tax management",
      "Search-Seizure & Survey representation"
    ],
    benefits: [
      "Legal and efficient tax minimization",
      "Peace of mind from tax notices/litigation",
      "Strategic allocation of capital for growth",
      "Seamless and accurate return filing"
    ],
    icon: Scale,
    image: "https://images.unsplash.com/photo-1554224155-db674d29df45?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "gst-compliance",
    name: "GST Compliance",
    category: "Taxation Division",
    description: "Mastering the GST landscape. From registration to complex annual reconciliation and departmental audit support, we handle the complexity while you handle your business.",
    features: [
      "Monthly GSTR-1 & GSTR-3B Filing",
      "Annual Return GSTR-9 and 9C Reconciliation",
      "Departmental Audit & Show Cause Notice support",
      "ITC (Input Tax Credit) Optimization audit"
    ],
    benefits: [
      "Zero penalty from compliance defaults",
      "Optimized cash flow through max ITC",
      "Standardized error-free accounting systems",
      "Audit-proof data and documentation"
    ],
    icon: FileCheck,
    image: "https://images.unsplash.com/photo-1586282391083-72575c51741b?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: "roc",
    name: "Corporate ROC Services",
    category: "Taxation Division",
    description: "Ensuring your corporate identity remains impeccable. We handle all MCA filings, ROC compliances, and secretarial audits for Private Limited companies and LLPs.",
    features: [
      "New Company and LLP Incorporation",
      "Annual Filing (MGT-7, AOC-4) management",
      "Director KYC, DIN, and DSC services",
      "Company strike-off and liquidation support"
    ],
    benefits: [
      "Preserve the legal status of your entity",
      "Transparent and investor-ready records",
      "Avoidance of heavy ROC late filing fees",
      "Protection from Director disqualifications"
    ],
    icon: Gavel,
    image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1000&auto=format&fit=crop"
  }
];
