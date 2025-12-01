"use client";

import { useState, useEffect, useMemo } from "react";
import { contentService } from "@/lib/content-service";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

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
  <div
    className="flex items-center justify-center w-20 h-20 rounded-full mx-auto"
    style={{ backgroundColor: "#0d948820" }}
  >
    <User className="w-10 h-10" style={{ color: "#0d9488" }} />
  </div>
);

export function DynamicTeamSection() {
  const [teamSection, setTeamSection] =
    useState<TeamSectionData>(FALLBACK_TEAM);

  useEffect(() => {
    let mounted = true;

    const fetchContent = async () => {
      try {
        const teamContent = await contentService.getContentBySection(
          "home",
          "team"
        );
        if (mounted && teamContent?.team_section) {
          const transformed = transformTeamData(teamContent);
          setTeamSection(() => ({ ...FALLBACK_TEAM, ...transformed }));
        }
      } catch (error) {
        console.error("Error loading team content:", error);
      }
    };

    fetchContent();
    return () => {
      mounted = false;
    };
  }, []);

  // Memoize team members
  const teamMembers = useMemo(
    () => teamSection?.team_members || [],
    [teamSection]
  );

  return (
    <section className="py-16 md:py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {teamSection?.title || "Meet Our Team"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {teamSection?.tagline ||
              "Expert professionals dedicated to your success"}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center p-6 w-full sm:w-72">
              <div className="mb-4">
                <FinanceAvatar />
              </div>
              <h3 className="text-xl font-semibold mb-1">{member?.name}</h3>
              <p className="text-primary">{member?.title}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
