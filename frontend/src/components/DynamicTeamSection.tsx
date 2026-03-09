"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { contentService } from "@/lib/content-service";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import { motion } from "framer-motion";

interface TeamMember {
  name: string;
  title: string;
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
    { name: "Mark Patel", title: "Founder & CEO" },
    { name: "Hitesh Shah", title: "Chief Financial Officer" },
    { name: "Priya Desai", title: "Senior Consultant" },
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

    if (name !== undefined || title !== undefined) {
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
    }
  }

  // Remove any members with empty name and title
  teamMembers = teamMembers.filter((m) => m.name || m.title);

  return {
    tagline: (section.tagline as string) || undefined,
    title: (section.title as string) || undefined,
    team_members: teamMembers.length > 0 ? teamMembers : undefined,
  };
}

const FinanceAvatar = () => (
  <motion.div
    className="flex items-center justify-center w-20 h-20 rounded-full mx-auto"
    style={{ backgroundColor: "#0b4c8020" }}
    whileHover={{ scale: 1.15, rotate: 5 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <motion.div
      initial={{ y: 0 }}
      whileInView={{ y: [0, -3, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      <User className="w-10 h-10" style={{ color: "#0b4c80" }} />
    </motion.div>
  </motion.div>
);

export function DynamicTeamSection() {
  const [teamSection, setTeamSection] =
    useState<TeamSectionData>(FALLBACK_TEAM);

  const fetchContent = useCallback(async () => {
    try {
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
    <section className="py-20 md:py-28 bg-secondary/30 relative overflow-hidden">
      <div className="container mx-auto px-4 mb-20">
        <div className="relative text-center max-w-4xl mx-auto">
          {/* Animated Watermark */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[5rem] md:text-[9rem] opacity-5 font-black text-slate-900 whitespace-nowrap select-none pointer-events-none tracking-tighter"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.05, scale: 1 }}
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
              <span className="text-sm font-bold uppercase tracking-widest text-[#0b4c80]">
                {teamSection?.tagline || "Our Team"}
              </span>
              <span className="w-8 h-[2px] bg-blue-600"></span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 text-slate-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
            >
              {teamSection?.title || "Meet Our Expert Team"}
            </motion.h2>

            <motion.p
              className="text-lg text-slate-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
            >
              Expert professionals dedicated to your success
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
              <Card className="relative text-center p-10 border-0 shadow-xl transition-all duration-500 rounded-[2rem] bg-white overflow-hidden group-hover:-translate-y-4 group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)]">
                {/* Decorative Gradient Background */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 rounded-full transition-all duration-500 transform group-hover:scale-150"></div>
                  <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                    <FinanceAvatar />
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-2 text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                  {member?.name}
                </h3>
                <p className="text-blue-500 font-bold uppercase tracking-widest text-xs">
                  {member?.title}
                </p>

                {/* Social Placeholder Dots */}
                <div className="flex justify-center gap-3 mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                      <div className="w-4 h-4 rounded-full bg-current opacity-20" />
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
