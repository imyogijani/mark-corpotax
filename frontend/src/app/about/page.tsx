"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

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
    className="flex items-center justify-center w-20 h-20 rounded-full"
    style={{ backgroundColor: "#0d948820" }}
  >
    <User className="w-10 h-10" style={{ color: "#0d9488" }} />
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
  data: ProcessData
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
  data: TeamData
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
  <Briefcase
    key="briefcase"
    className="w-8 h-8"
    style={{ color: "#0d9488" }}
  />,
  <HandCoins
    key="handcoins"
    className="w-8 h-8"
    style={{ color: "#0d9488" }}
  />,
  <CheckCircle key="check" className="w-8 h-8" style={{ color: "#0d9488" }} />,
  <TrendingUp
    key="trending"
    className="w-8 h-8"
    style={{ color: "#0d9488" }}
  />,
  <Shield key="shield" className="w-8 h-8" style={{ color: "#0d9488" }} />,
];

export default function AboutPage() {
  const [content, setContent] = useState<AboutPageContent>({});
  const [loading, setLoading] = useState(true);

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
      <div className="about-page-container animate-fade-in">
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-4">
              <div className="h-12 w-48 bg-gray-200 rounded mx-auto"></div>
              <div className="h-6 w-96 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="about-page-container animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            {hero.title || "About Us"}
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-6">
            {hero.subtitle ||
              "We deliver innovative financial solutions and expert consulting to help you achieve your business goals."}
          </p>

          {/* Stats Cards */}
          <div className="flex flex-wrap items-center gap-6 w-full justify-center mt-8">
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 gap-3 w-full max-w-[200px] hover:shadow-xl transition-shadow">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#0d948820" }}
              >
                <BarChart2 className="w-8 h-8" style={{ color: "#0d9488" }} />
              </div>
              <div className="text-center">
                <span
                  className="block text-3xl font-bold"
                  style={{ color: "#0d9488" }}
                >
                  {stats.years_experience || "12+"}
                </span>
                <span className="block text-sm text-muted-foreground">
                  Years Experience
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 gap-3 w-full max-w-[200px] hover:shadow-xl transition-shadow">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#0d948820" }}
              >
                <Users className="w-8 h-8" style={{ color: "#0d9488" }} />
              </div>
              <div className="text-center">
                <span
                  className="block text-3xl font-bold"
                  style={{ color: "#0d9488" }}
                >
                  {stats.happy_clients || "2500+"}
                </span>
                <span className="block text-sm text-muted-foreground">
                  Happy Clients
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 gap-3 w-full max-w-[200px] hover:shadow-xl transition-shadow">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#0d948820" }}
              >
                <Award className="w-8 h-8" style={{ color: "#0d9488" }} />
              </div>
              <div className="text-center">
                <span
                  className="block text-3xl font-bold"
                  style={{ color: "#0d9488" }}
                >
                  {stats.projects_completed || "5000+"}
                </span>
                <span className="block text-sm text-muted-foreground">
                  Projects Done
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 gap-3 w-full max-w-[200px] hover:shadow-xl transition-shadow">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#0d948820" }}
              >
                <TrendingUp className="w-8 h-8" style={{ color: "#0d9488" }} />
              </div>
              <div className="text-center">
                <span
                  className="block text-3xl font-bold"
                  style={{ color: "#0d9488" }}
                >
                  {stats.success_rate || "98%"}
                </span>
                <span className="block text-sm text-muted-foreground">
                  Success Rate
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "#0d948820" }}
                >
                  <Target className="w-7 h-7" style={{ color: "#0d9488" }} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  {mission.mission?.title || "Our Mission"}
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {mission.mission?.description ||
                  "To provide comprehensive financial solutions that empower businesses and individuals to achieve their financial goals. We are committed to delivering personalized service, transparent communication, and expert guidance at every step of your financial journey."}
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 shadow-lg border border-slate-100">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "#0d948820" }}
                >
                  <Eye className="w-7 h-7" style={{ color: "#0d9488" }} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  {mission.vision?.title || "Our Vision"}
                </h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {mission.vision?.description ||
                  "To be the most trusted financial partner for businesses across India, known for our integrity, expertise, and commitment to client success. We envision a future where every business has access to quality financial services."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              {solutions.title || "Solutions That Make a Difference"}
            </h2>
            <p className="text-lg text-muted-foreground">
              {solutions.description ||
                "We provide expert consulting, risk management, and strategic advice to help your business thrive in a changing world."}
            </p>
            <ul className="mt-6 space-y-4">
              {(solutionsList.length > 0
                ? solutionsList
                : [
                    "MSME Project Finance & Working Capital",
                    "Tax Planning & Compliance Services",
                    "Business Loan Advisory",
                    "Strategic Financial Consulting",
                  ]
              ).map((solution, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#0d948820" }}
                  >
                    <CheckCircle
                      className="h-5 w-5"
                      style={{ color: "#0d9488" }}
                    />
                  </div>
                  <span className="text-lg">{solution}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center gap-6">
            <div
              className="flex items-center justify-center h-64 w-full rounded-2xl shadow-lg"
              style={{ backgroundColor: "#0d948815" }}
            >
              <BarChart2 className="w-32 h-32" style={{ color: "#0d9488" }} />
            </div>
            <div
              className="flex items-center justify-center h-32 w-full rounded-2xl shadow-lg"
              style={{ backgroundColor: "#0d948815" }}
            >
              <PieChart className="w-20 h-20" style={{ color: "#0d9488" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-content">
            <h2 className="text-3xl md:text-4xl font-bold">
              {processContent.title || "Strategy is the Key to Success"}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {processContent.description ||
                "Our process is designed to ensure we understand your needs and deliver the best possible results."}
            </p>
            <div className="mt-8 space-y-6">
              {(processSteps.length > 0
                ? processSteps
                : [
                    {
                      title: "Fast Processing",
                      description:
                        "Fast and hassle-free loan processing with quick decision-making for timely funding.",
                    },
                    {
                      title: "Affordable Rates",
                      description:
                        "Lowest and affordable interest rates with transparent communication at every step.",
                    },
                    {
                      title: "Expert Guidance",
                      description:
                        "Strategic financial advice tailored to your business needs with dedicated support.",
                    },
                  ]
              ).map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-xl flex-shrink-0"
                    style={{ backgroundColor: "#0d948820" }}
                  >
                    {processIcons[index % processIcons.length]}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-8">
            <div
              className="flex items-center justify-center h-72 w-full rounded-2xl shadow-lg"
              style={{ backgroundColor: "#0d948815" }}
            >
              <PieChart className="w-40 h-40" style={{ color: "#0d9488" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="section-header text-center mb-12">
            <p
              className="text-sm font-semibold uppercase tracking-wider mb-2"
              style={{ color: "#0d9488" }}
            >
              {team.tagline || "Our Team"}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              {team.title || "Meet Our Expert Team"}
            </h2>
          </div>
          <div className="team-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(teamMembers.length > 0
              ? teamMembers
              : [
                  { name: "Finance Division", title: "MSME Project Finance" },
                  { name: "Taxation Division", title: "Tax & Accounting" },
                  { name: "Loan Advisory", title: "Working Capital Solutions" },
                  {
                    name: "Business Consultancy",
                    title: "Strategic Financial Planning",
                  },
                ]
            ).map((member, index) => (
              <Card
                key={index}
                className="team-member-card text-center bg-white border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-center h-48 w-full bg-slate-50">
                  <FinanceAvatar />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p style={{ color: "#0d9488" }}>{member.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
