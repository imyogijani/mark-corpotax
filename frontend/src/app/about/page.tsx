"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  BarChart2,
  PieChart,
  CheckCircle,
  Briefcase,
  HandCoins,
  Target,
  Eye,
  Award,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MotionWrapper } from "@/components/MotionWrapper";
import Counter from "@/components/Counter";
import FloatingGraffiti from "@/components/FloatingGraffiti";
import { Card, CardContent } from "@/components/ui/card";

interface HeroData {
  title?: string;
  subtitle?: string;
}

interface MissionData {
  mission?: {
    title?: string;
    description?: string;
  };
  vision?: {
    title?: string;
    description?: string;
  };
}

interface StatsData {
  years_experience?: string;
  happy_clients?: string;
  projects_completed?: string;
  success_rate?: string;
}

interface SolutionsData {
  title?: string;
  description?: string;
  solution_1?: string;
  solution_2?: string;
  solution_3?: string;
  solution_4?: string;
}

interface ProcessData {
  title?: string;
  description?: string;
  step_1_title?: string;
  step_1_description?: string;
  step_2_title?: string;
  step_2_description?: string;
  step_3_title?: string;
  step_3_description?: string;
}

interface TeamData {
  tagline?: string;
  title?: string;
  member_1_name?: string;
  member_1_title?: string;
  member_2_name?: string;
  member_2_title?: string;
  member_3_name?: string;
  member_3_title?: string;
  member_4_name?: string;
  member_4_title?: string;
}

interface AboutPageContent {
  hero?: HeroData;
  mission?: MissionData;
  stats?: StatsData;
  solutions?: SolutionsData;
  process?: ProcessData;
  team?: TeamData;
}

const FinanceAvatar = () => (
  <div
    className="flex items-center justify-center w-24 h-24 rounded-full shadow-inner mb-4 relative overflow-hidden group-hover:scale-110 transition-transform duration-500"
    style={{
      background: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
    }}
  >
    <User className="w-10 h-10 text-blue-600 relative z-10" />
    <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  </div>
);

// Transform functions to handle flat keys
const transformSolutions = (data: SolutionsData): string[] => {
  const solutions: string[] = [];
  for (let i = 1; i <= 6; i++) {
    const key = `solution_${i}` as keyof SolutionsData;
    if (data[key]) {
      solutions.push(data[key] as string);
    }
  }
  return solutions;
};

const transformProcessSteps = (
  data: ProcessData,
): { title: string; description: string }[] => {
  const steps: { title: string; description: string }[] = [];
  for (let i = 1; i <= 5; i++) {
    const titleKey = `step_${i}_title` as keyof ProcessData;
    const descKey = `step_${i}_description` as keyof ProcessData;
    if (data[titleKey] || data[descKey]) {
      steps.push({
        title: (data[titleKey] as string) || "",
        description: (data[descKey] as string) || "",
      });
    }
  }
  return steps;
};

const transformTeamMembers = (
  data: TeamData,
): { name: string; title: string }[] => {
  const members: { name: string; title: string }[] = [];
  for (let i = 1; i <= 6; i++) {
    const nameKey = `member_${i}_name` as keyof TeamData;
    const titleKey = `member_${i}_title` as keyof TeamData;
    if (data[nameKey] || data[titleKey]) {
      members.push({
        name: (data[nameKey] as string) || "",
        title: (data[titleKey] as string) || "",
      });
    }
  }
  return members;
};

const processIcons = [
  <Briefcase key="briefcase" className="w-6 h-6 text-white" />,
  <HandCoins key="handcoins" className="w-6 h-6 text-white" />,
  <CheckCircle key="check" className="w-6 h-6 text-white" />,
  <TrendingUp key="trending" className="w-6 h-6 text-white" />,
  <Shield key="shield" className="w-6 h-6 text-white" />,
];

export default function AboutPage() {
  const [content, setContent] = useState<AboutPageContent>({});
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const API_BASE =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${API_BASE}/content/about`);
        const data = await response.json();
        if (data.success && data.data) {
          setContent(data.data);
        }
      } catch (error) {
        console.error("Error loading about page content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const hero = content.hero || {};
  const mission = content.mission || {};
  const stats = content.stats || {};
  const solutions = content.solutions || {};
  const processContent = content.process || {};
  const team = content.team || {};

  const solutionsList = transformSolutions(solutions);
  const processSteps = transformProcessSteps(processContent);
  const teamMembers = transformTeamMembers(team);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Experience...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="about-page-wrapper overflow-hidden bg-slate-50">
      {/* Hero Section */}
      <section
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50/30"
        style={{
          background:
            "linear-gradient(to bottom right, #f8fafc, #f1f5f9, #0b4c8010)",
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-4 h-4 rounded-full opacity-60 bg-[#0b4c80]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl mix-blend-multiply animate-pulse delay-1000"></div>
          <FloatingGraffiti />

          {/* Decorative grid pattern */}
          <div className="absolute bottom-32 right-32 grid grid-cols-6 gap-1 opacity-20">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-slate-400 rounded-full"></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <MotionWrapper direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-blue-600 text-sm font-medium mb-6 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Discover Our Story</span>
            </div>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={0.2}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-slate-900">
              {hero.title || "About Us"}
            </h1>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={0.3}>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              {hero.subtitle ||
                "We deliver innovative financial solutions and expert consulting to help you achieve your business goals."}
            </p>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={0.4}>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-[#0b4c80] to-[#0d5ea0] text-white rounded-full font-semibold shadow-lg shadow-[#0b4c80]/30 transition-all flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Floating Stats Section */}
      <section className="relative -mt-20 z-20 pb-20">
        <div className="container mx-auto px-4">
          <MotionWrapper direction="up" delay={0.5}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
              {[
                {
                  icon: BarChart2,
                  value: stats.years_experience || "12",
                  label: "Years Experience",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: Users,
                  value: stats.happy_clients || "2500",
                  label: "Happy Clients",
                  color: "text-emerald-500",
                  bg: "bg-emerald-50",
                },
                {
                  icon: Layers,
                  value: stats.projects_completed || "5000",
                  label: "Projects Done",
                  color: "text-purple-500",
                  bg: "bg-purple-50",
                },
                {
                  icon: Award,
                  value: stats.success_rate || "98",
                  suffix: "%",
                  label: "Success Rate",
                  color: "text-orange-500",
                  bg: "bg-orange-50",
                },
              ].map((stat, index) => (
                <div key={index} className="text-center group">
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${stat.bg}`}
                  >
                    <stat.icon
                      className={`w-6 h-6 md:w-8 md:h-8 ${stat.color}`}
                    />
                  </div>
                  <div
                    className={`text-2xl md:text-4xl font-bold mb-1 ${stat.color}`}
                  >
                    <Counter
                      to={parseInt(stat.value.replace(/\D/g, ""))}
                      suffix={stat.suffix || "+"}
                    />
                  </div>
                  <p className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Mission & Vision - Glassmorphism Style */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50 to-transparent -z-10"></div>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <MotionWrapper direction="right" delay={0.2} className="h-full">
              <div className="h-full bg-white/60 backdrop-blur-md rounded-[2rem] p-8 md:p-12 border border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-500 group">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform duration-500">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">
                  {mission.mission?.title || "Our Mission"}
                </h2>
                <div className="h-1 w-12 bg-blue-600 rounded-full mb-6 group-hover:w-20 transition-all duration-300"></div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {mission.mission?.description ||
                    "To provide comprehensive financial solutions that empower businesses and individuals to achieve their financial goals. We are committed to delivering personalized service, transparent communication, and expert guidance at every step of your financial journey."}
                </p>
              </div>
            </MotionWrapper>

            <MotionWrapper direction="left" delay={0.4} className="h-full">
              <div className="h-full bg-gradient-to-br from-[#0b4c80] to-[#0d5ea0] rounded-[2rem] p-8 md:p-12 text-white shadow-2xl hover:shadow-[#0b4c80]/30 transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-colors duration-500"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                    <Eye className="w-8 h-8 text-blue-100" />
                  </div>
                  <h2 className="text-3xl font-bold mb-6 text-white">
                    {mission.vision?.title || "Our Vision"}
                  </h2>
                  <div className="h-1 w-12 bg-blue-300 rounded-full mb-6 group-hover:w-20 transition-all duration-300"></div>
                  <p className="text-lg text-blue-50 leading-relaxed">
                    {mission.vision?.description ||
                      "To be the most trusted financial partner for businesses across India, known for our integrity, expertise, and commitment to client success. We envision a future where every business has access to quality financial services."}
                  </p>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* Solutions - Asymmetric Layout */}
      <section className="py-20 bg-slate-50 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <MotionWrapper direction="right" className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>

                <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-6 rounded-2xl">
                      <BarChart2 className="w-10 h-10 text-blue-600 mb-4" />
                      <div className="h-2 w-full bg-slate-200 rounded-full mb-2"></div>
                      <div className="h-2 w-2/3 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-2xl mt-8">
                      <PieChart className="w-10 h-10 text-blue-600 mb-4" />
                      <div className="h-2 w-full bg-blue-200/50 rounded-full mb-2"></div>
                      <div className="h-2 w-2/3 bg-blue-200/50 rounded-full"></div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl">
                      <TrendingUp className="w-10 h-10 text-blue-600 mb-4" />
                      <div className="h-2 w-full bg-slate-200 rounded-full mb-2"></div>
                      <div className="h-2 w-2/3 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="bg-blue-600 p-6 rounded-2xl mt-8">
                      <Shield className="w-10 h-10 text-white mb-4" />
                      <div className="h-2 w-full bg-white/30 rounded-full mb-2"></div>
                      <div className="h-2 w-2/3 bg-white/30 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </MotionWrapper>

            <div className="lg:w-1/2">
              <MotionWrapper direction="left">
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                  {solutions.title || "Solutions That Make a Difference"}
                </h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  {solutions.description ||
                    "We provide expert consulting, risk management, and strategic advice to help your business thrive in a changing world."}
                </p>

                <motion.ul
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={containerVariants}
                  className="space-y-4"
                >
                  {(solutionsList.length > 0
                    ? solutionsList
                    : [
                        "MSME Project Finance & Working Capital",
                        "Tax Planning & Compliance Services",
                        "Business Loan Advisory",
                        "Strategic Financial Consulting",
                      ]
                  ).map((solution, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                        <CheckCircle className="h-5 w-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                      </div>
                      <span className="text-lg font-medium text-slate-700">
                        {solution}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </MotionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Timeline Style */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <MotionWrapper direction="up" className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              {processContent.title || "Strategy is the Key to Success"}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {processContent.description ||
                "Our process is designed to ensure we understand your needs and deliver the best possible results."}
            </p>
          </MotionWrapper>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
            >
              {(processSteps.length > 0
                ? processSteps
                : [
                    {
                      title: "Fast Processing",
                      description:
                        "Fast and hassle-free loan processing with quick decision-making.",
                    },
                    {
                      title: "Affordable Rates",
                      description:
                        "Lowest and affordable interest rates with transparent communication.",
                    },
                    {
                      title: "Expert Guidance",
                      description:
                        "Strategic financial advice tailored to your business needs.",
                    },
                  ]
              ).map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative group"
                >
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0b4c80] to-[#0d5ea0] flex items-center justify-center mb-6 shadow-lg shadow-blue-900/10 group-hover:scale-110 transition-transform duration-300">
                      {processIcons[index % processIcons.length]}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.description}
                    </p>

                    <div className="absolute -bottom-2 opacity-0 group-hover:bottom-2 group-hover:opacity-100 transition-all duration-300">
                      <ArrowRight className="text-blue-600 w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <MotionWrapper direction="up" className="text-center mb-16">
            <span className="text-blue-600 font-semibold tracking-wider uppercase text-sm mb-4 block">
              {team.tagline || "Our Team"}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900">
              {team.title || "Meet Our Expert Team"}
            </h2>
          </MotionWrapper>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {(teamMembers.length > 0
              ? teamMembers
              : [
                  { name: "Finance Division", title: "MSME Project Finance" },
                  { name: "Taxation Division", title: "Tax & Accounting" },
                  { name: "Loan Advisory", title: "Working Capital Solutions" },
                  { name: "Business Consultancy", title: "Strategic Planning" },
                ]
            ).map((member, index) => (
              <motion.div key={index} variants={itemVariants}>
                <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100">
                  <div className="p-8 flex flex-col items-center">
                    <FinanceAvatar />
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-slate-500 text-center">
                      {member.title}
                    </p>
                  </div>
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Expert
                    </span>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                      <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
