"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { contentService } from "@/lib/content-service";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  title: string;
  image?: string;
}

interface TeamSectionData {
  tagline?: string;
  title?: string;
  team_members?: TeamMember[];
}

// Static fallback content
const FALLBACK_TEAM: TeamSectionData = {
  tagline: "Our Team",
  title: "Meet Our Expert Team",
  team_members: [
    { name: "Mark Patel", title: "Founder & CEO", image: "/mark-patel.png" },
    { name: "Hitesh Shah", title: "Chief Financial Officer", image: "/hitesh-shah.png" },
    { name: "Priya Desai", title: "Senior Consultant", image: "/priya-desai.png" },
  ],
};

// Transform flat keys from database into the expected structure
// This merges individual keys (member_1_name) with existing arrays
function transformTeamData(data: Record<string, unknown>): TeamSectionData {
  const section = (data.team_section || {}) as Record<string, unknown>;

  // Start with existing team_members array or empty
  let teamMembers: TeamMember[] = Array.isArray(section.team_members)
    ? section.team_members.map((m: TeamMember) => ({ ...m }))
    : [];

  // Override with individual keys if they exist (editor saves these)
  for (let i = 1; i <= 10; i++) {
    const name = section[`member_${i}_name`] as string;
    const title = section[`member_${i}_title`] as string;
    const image = section[`member_${i}_image`] as string;

    if (name !== undefined || title !== undefined || image !== undefined) {
      // Ensure the array has enough elements
      while (teamMembers.length < i) {
        teamMembers.push({ name: "", title: "" });
      }
      // Update the member at position i-1
      if (name !== undefined && name !== "") {
        teamMembers[i - 1].name = name;
      }
      if (title !== undefined && title !== "") {
        teamMembers[i - 1].title = title;
      }
      if (image !== undefined && image !== "") {
        teamMembers[i - 1].image = image;
      }
    }
  }

  // Hardcode images if they don't have one and names match
  teamMembers = teamMembers.map(m => {
    if (m.name === "Mark Patel" && !m.image) {
      return { ...m, image: "/mark-patel.png" };
    }
    if (m.name === "Hitesh Shah" && !m.image) {
      return { ...m, image: "/hitesh-shah.png" };
    }
    if (m.name === "Priya Desai" && !m.image) {
      return { ...m, image: "/priya-desai.png" };
    }
    return m;
  });

  // Remove any members with empty name and title
  teamMembers = teamMembers.filter((m) => m.name || m.title);

  return {
    tagline: (section.tagline as string) || undefined,
    title: (section.title as string) || undefined,
    team_members: teamMembers.length > 0 ? teamMembers : undefined,
  };
}

const IllustratedAvatar = ({ index, type }: { index: number; type: string }) => {
  const variant = index % 3;
  const isTax = type.toLowerCase().includes("tax");
  
  // High-end color palette
  const primary = isTax ? "#059669" : "#0b4c80";
  const accent = isTax ? "#10b981" : "#2563eb";
  const bgGradient = isTax ? "from-emerald-50 to-white" : "from-blue-50 to-white";

  return (
    <motion.div
      className="relative w-40 h-40 mx-auto flex items-center justify-center group"
      whileHover={{ y: -5 }}
    >
      {/* Premium Background Container */}
      <div className={`absolute inset-2 bg-gradient-to-br ${bgGradient} rounded-[3rem] border border-slate-100 shadow-2xl transition-all duration-500 group-hover:shadow-blue-200/50 group-hover:border-blue-100`} />
      
      <svg
        viewBox="0 0 120 120"
        className="w-36 h-36 relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={`avatar-clip-v5-${index}`}>
            <rect x="10" y="10" width="100" height="100" rx="35" />
          </clipPath>
          <linearGradient id={`skin-v5-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#fde68a" />
          </linearGradient>
          <linearGradient id={`hair-grad-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4B2C20" />
            <stop offset="100%" stopColor="#2D1F17" />
          </linearGradient>
        </defs>

        <g clipPath={`url(#avatar-clip-v5-${index})`}>
          {variant === 0 && ( // Variant 1: Premium Professional Man (CEO)
            <>
              {/* Suit and Tie */}
              <path d="M20 95C20 80 35 72 60 72C85 72 100 80 100 95V115H20V95Z" fill={primary} />
              <path d="M60 72L45 95H75L60 72Z" fill="white" />
              <path d="M60 72L58 85L60 92L62 85L60 72Z" fill={accent} />
              {/* Head */}
              <rect x="52" y="60" width="16" height="15" fill="#fde68a" />
              <circle cx="60" cy="42" r="24" fill="url(#skin-v5-0)" />
              {/* Modern Hair */}
              <path d="M36 38C36 22 50 16 65 16C82 16 86 32 84 48L78 42C78 42 70 38 60 40C50 42 38 42 36 38Z" fill="#1e293b" />
              {/* Face */}
              <g opacity="0.9">
                <circle cx="50" cy="45" r="2" fill="#0f172a" />
                <circle cx="70" cy="45" r="2" fill="#0f172a" />
                <path d="M54 58C54 58 57 61 60 61C63 61 66 58 66 58" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
              </g>
            </>
          )}

          {variant === 1 && ( // Variant 2: Premium Professional Man (Modern Specialist)
            <>
              {/* Smart Casual Outfit */}
              <path d="M20 95C20 82 35 75 60 75C85 75 100 82 100 95V115H20V95Z" fill="#334155" />
              <path d="M60 75L50 115H70L60 75Z" fill={accent} opacity="0.8" />
              {/* Head */}
              <rect x="52" y="65" width="16" height="12" fill="#fde68a" />
              <circle cx="60" cy="45" r="24" fill="url(#skin-v5-1)" />
              {/* Smart Hair */}
              <path d="M36 45V35C36 20 50 18 60 18C70 18 84 20 84 35V45H36Z" fill="#475569" />
              {/* Glasses */}
              <g stroke="#0f172a" strokeWidth="1.2">
                <rect x="46" y="42" width="12" height="10" rx="3" fill="none" />
                <rect x="62" y="42" width="12" height="10" rx="3" fill="none" />
                <path d="M58 47H62" />
                <path d="M55 60C55 60 58 63 60 63C62 63 65 60 65 60" strokeLinecap="round" />
              </g>
            </>
          )}

          {variant === 2 && ( // Variant 3: Ultra-Luxe & Stunning Professional Woman (Premium Masterpiece Style)
            <>
              {/* Designer Professional Outfit */}
              <path d="M15 100C15 82 35 72 60 72C85 72 105 82 105 100V120H15V100Z" fill={isTax ? "#064e3b" : "#1e40af"} />
              <path d="M60 72L52 95H68L60 72Z" fill="white" />
              {/* Silk Scarf / Detail */}
              <path d="M52 72C52 72 56 82 60 82C64 82 68 72 68 72" fill={accent} opacity="0.6" />
              <path d="M45 75L35 100M75 75L85 100" stroke="white" strokeWidth="0.5" opacity="0.4" />
              
              {/* Gorgeous Silk Hair (Back Layer with Depth) */}
              <path d="M22 40C22 12 40 8 60 8C85 8 98 25 98 65V100H22V40Z" fill="#3D2B1F" />
              <path d="M98 60C98 80 92 95 85 105" stroke="#2D1F17" strokeWidth="4" strokeLinecap="round" />
              
              {/* Head and Neck */}
              <rect x="54" y="60" width="12" height="15" fill="#fde68a" />
              <circle cx="60" cy="40" r="23" fill="url(#skin-v5-2)" />
              
              {/* Stunning Face (Fine Details) */}
              <g>
                {/* Beautiful Eyes (High Detail) */}
                <path d="M48 39C48 39 50 37 54 37.5" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M66 37.5C66 37.5 70 37 72 39" stroke="#0f172a" strokeWidth="1.2" strokeLinecap="round" />
                {/* Lashes */}
                <path d="M47 41L45 40M73 41L75 40" stroke="#0f172a" strokeWidth="0.5" />
                {/* Eye Sparkle & Iris */}
                <circle cx="52" cy="44" r="3" fill="#5C4033" opacity="0.3" />
                <circle cx="68" cy="44" r="3" fill="#5C4033" opacity="0.3" />
                <circle cx="52" cy="44.5" r="2" fill="#0f172a" />
                <circle cx="68" cy="44.5" r="2" fill="#0f172a" />
                <circle cx="52.8" cy="43.5" r="0.8" fill="white" />
                <circle cx="68.8" cy="43.5" r="0.8" fill="white" />
                
                {/* Perfect Professional Smile */}
                <path d="M54 58C54 58 58 63 60 63C62 63 66 58 66 58" fill="#f43f5e" opacity="0.15" />
                <path d="M55 58C55 58 58 62 60 62C62 62 65 58 65 58" stroke="#be123c" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Soft Elegance Makeup */}
                <circle cx="45" cy="52" r="4" fill="#fda4af" opacity="0.2" />
                <circle cx="75" cy="52" r="4" fill="#fda4af" opacity="0.2" />
                
                {/* Luxury Diamond Studs */}
                <circle cx="36" cy="52" r="1.5" fill="white" shadow-xl="true" />
                <circle cx="36" cy="52" r="2" stroke="white" strokeWidth="0.5" opacity="0.4" />
                <circle cx="84" cy="52" r="1.5" fill="white" shadow-xl="true" />
                <circle cx="84" cy="52" r="2" stroke="white" strokeWidth="0.5" opacity="0.4" />
              </g>

              {/* Front Hair (Layered Silky Highlights) */}
              <path d="M36 35C36 15 50 10 65 10C85 10 92 25 90 50C90 60 85 75 80 95" stroke="#3D2B1F" strokeWidth="9" strokeLinecap="round" />
              <path d="M35 35C30 45 28 60 30 85" stroke="#3D2B1F" strokeWidth="7" strokeLinecap="round" />
              {/* Silk Highlights */}
              <path d="M62 13C75 13 85 25 85 45" stroke="#5C4033" strokeWidth="2.5" opacity="0.4" strokeLinecap="round" />
              <path d="M38 32C35 42 35 55 38 72" stroke="#5C4033" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
            </>
          )}
        </g>
      </svg>

      {/* Decorative Floating Accent */}
      <motion.div
        className="absolute -top-1 -right-1 w-8 h-8 rounded-2xl bg-white shadow-lg border border-slate-50 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
      </motion.div>
    </motion.div>
  );
};

export function DynamicTeamSection() {
  const [teamSection, setTeamSection] =
    useState<TeamSectionData>(FALLBACK_TEAM);
  const [division, setDivision] = useState<string>("finance");

  const fetchContent = useCallback(async () => {
    try {
      const savedDivision = localStorage.getItem("user_division");
      if (savedDivision) setDivision(savedDivision);

      const teamContent = await contentService.getContentBySection(
        "home",
        "team",
      );
      if (teamContent?.team_section) {
        const transformed = transformTeamData(teamContent);
        setTeamSection(() => ({ ...FALLBACK_TEAM, ...transformed }));
      }
    } catch (error) {
      console.error("Error loading team content:", error);
    }
  }, []);

  useEffect(() => {
    fetchContent();

    // Subscribe to cache invalidation events
    const unsubscribe = contentService.onCacheInvalidated(() => {
      fetchContent();
    });

    return () => {
      unsubscribe();
    };
  }, [fetchContent]);

  // Memoize team members
  const teamMembers = useMemo(
    () => teamSection?.team_members || [],
    [teamSection],
  );

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Background Decorative Element - Light Theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(1000px_circle_at_center,rgba(37,99,235,0.03),transparent_100%)] -z-10" />

      <div className="container mx-auto px-4 mb-12">
        <div className="relative text-center max-w-4xl mx-auto">
          {/* Animated Watermark - Light Theme */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[5rem] md:text-[9rem] opacity-[0.08] font-black text-slate-200 whitespace-nowrap select-none pointer-events-none tracking-tighter uppercase"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.15, scale: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 1 }}
          >
            EXPERTS
          </motion.div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="inline-flex items-center gap-2 mb-4"
            >
              <span className="w-8 h-[2px] bg-blue-600"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600">
                {teamSection?.tagline || "Our Team"}
              </span>
              <span className="w-8 h-[2px] bg-blue-600"></span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-black mb-6 text-slate-900 uppercase tracking-tighter"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              {division === "taxation" ? "Taxation Experts" : (teamSection?.title || "Meet Our Expert Team")}
            </motion.h2>

            <motion.p
              className="text-lg text-slate-600 max-w-2xl mx-auto font-medium"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
            >
              {division === "taxation"
                ? "Qualified legal professionals and tax consultants at your service."
                : (teamSection?.tagline || "Expert professionals dedicated to your success")}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-10">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="w-full sm:w-80 group"
            >
              <Card className="relative text-center p-10 border border-slate-100 shadow-[0_15px_40px_rgba(0,0,0,0.02)] transition-all duration-500 rounded-[2.5rem] bg-white overflow-hidden group-hover:-translate-y-4 group-hover:shadow-[0_45px_100px_rgba(37,99,235,0.1)] group-hover:border-blue-100">
                {/* Decorative Brand Accent - Light Theme */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-500 opacity-80" />

                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-blue-100 opacity-0 group-hover:opacity-40 rounded-full transition-all duration-500 transform group-hover:scale-150 blur-xl"></div>
                  <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                    {member.image ? (
                      <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                        <div className={`absolute inset-2 bg-gradient-to-br ${member.title.toLowerCase().includes("tax") ? "from-emerald-50 to-white" : "from-blue-50 to-white"} rounded-[3rem] border border-slate-100 shadow-2xl transition-all duration-500 group-hover:shadow-blue-200/50 group-hover:border-blue-100`} />
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-36 h-36 object-cover rounded-[2rem] relative z-10"
                        />
                      </div>
                    ) : (
                      <IllustratedAvatar index={index} type={member.title} />
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-2 text-slate-800 group-hover:text-blue-600 transition-colors tracking-tight uppercase">
                  {member?.name}
                </h3>
                <p className="text-blue-600 font-black uppercase tracking-widest text-[10px]">
                  {member?.title}
                </p>

              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
