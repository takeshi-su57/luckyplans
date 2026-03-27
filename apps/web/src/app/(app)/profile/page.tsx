'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-current-user';
import { AboutTab } from '@/components/profile/about-tab';
import { ProjectsTab } from '@/components/profile/projects-tab';
import { SkillsTab } from '@/components/profile/skills-tab';
import { ExperienceTab } from '@/components/profile/experience-tab';
import { EducationTab } from '@/components/profile/education-tab';
import { CertificationsTab } from '@/components/profile/certifications-tab';
import { LanguagesTab } from '@/components/profile/languages-tab';
import { AwardsTab } from '@/components/profile/awards-tab';
import { HobbiesTab } from '@/components/profile/hobbies-tab';
import { Button, Skeleton, Tabs } from '@heroui/react';
import {
  Award,
  Briefcase,
  Code,
  ExternalLink,
  FolderOpen,
  GraduationCap,
  Heart,
  Languages,
  Trophy,
  User,
} from 'lucide-react';

const tabConfig = [
  { key: 'About', icon: User },
  { key: 'Projects', icon: FolderOpen },
  { key: 'Skills', icon: Code },
  { key: 'Experience', icon: Briefcase },
  { key: 'Education', icon: GraduationCap },
  { key: 'Certifications', icon: Award },
  { key: 'Languages', icon: Languages },
  { key: 'Awards', icon: Trophy },
  { key: 'Hobbies', icon: Heart },
] as const;
const tabs = tabConfig.map((t) => t.key);
type TabKey = (typeof tabs)[number];

export default function ProfilePage() {
  const { user, isLoading } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<TabKey>('About');

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="mt-8 space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-[40px] font-bold text-[#37352f] leading-tight">
          <User className="size-5" />
          Profile
        </h1>
        <Link href={`/u/${user.userId}`}>
          <Button variant="outline" size="sm">
            <ExternalLink className="size-4" />
            View Public Profile
          </Button>
        </Link>
      </div>

      {/* Tab Navigation + Content */}
      <div className="mt-6">
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(key as TabKey)}
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Profile sections">
              {tabConfig.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <Tabs.Tab key={tab.key} id={tab.key}>
                    <TabIcon className="size-4" />
                    {tab.key}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                );
              })}
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel id="About">
            <AboutTab user={user} userId={user.userId} />
          </Tabs.Panel>
          <Tabs.Panel id="Projects">
            <ProjectsTab userId={user.userId} />
          </Tabs.Panel>
          <Tabs.Panel id="Skills">
            <SkillsTab userId={user.userId} />
          </Tabs.Panel>
          <Tabs.Panel id="Experience">
            <ExperienceTab userId={user.userId} />
          </Tabs.Panel>
          <Tabs.Panel id="Education">
            <EducationTab userId={user.userId} />
          </Tabs.Panel>
          <Tabs.Panel id="Certifications">
            <CertificationsTab userId={user.userId} />
          </Tabs.Panel>
          <Tabs.Panel id="Languages">
            <LanguagesTab userId={user.userId} />
          </Tabs.Panel>
          <Tabs.Panel id="Awards">
            <AwardsTab userId={user.userId} />
          </Tabs.Panel>
          <Tabs.Panel id="Hobbies">
            <HobbiesTab userId={user.userId} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
}
