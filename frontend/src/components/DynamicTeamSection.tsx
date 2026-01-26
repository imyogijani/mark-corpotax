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
        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              transition={{ delay: index * 0.1 }}
              className="w-full sm:w-72"
            >
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 rounded-2xl bg-white overflow-hidden group">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-[#0b4c80] opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300 transform scale-125"></div>
                  <FinanceAvatar />
                </div>
                <h3 className="text-xl font-bold mb-1 text-slate-800 group-hover:text-[#0b4c80] transition-colors">
                  {member?.name}
                </h3>
                <p className="text-slate-500 font-medium">{member?.title}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
