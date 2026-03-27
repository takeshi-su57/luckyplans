'use client';

import { use } from 'react';
import Link from 'next/link';
import { AppProviders } from '@/providers/app-providers';
import { usePublicProfile } from '@/hooks/use-public-profile';
import { MediaCarousel } from '@/components/ui/media-carousel';
import { Avatar, Button, Card, Chip, Skeleton } from '@heroui/react';
import {
  Award,
  Briefcase,
  Code,
  ExternalLink,
  FolderOpen,
  Globe,
  GraduationCap,
  Heart,
  Languages,
  Link as LinkIcon,
  MapPin,
  Trophy,
  UserX,
} from 'lucide-react';

function PortfolioContent({ userId }: { userId: string }) {
  const { data, loading, error } = usePublicProfile(userId);
  const profile = data?.getPublicProfile;

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-8">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="mt-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-8">
        <Card className="bg-[#ffe2dd] shadow-none">
          <Card.Content>
            <p className="text-sm text-[#e03e3e]">Failed to load profile.</p>
          </Card.Content>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-10 text-center md:px-8">
        <UserX className="mx-auto size-10 text-[#a3a29e]" />
        <h1 className="mt-4 text-2xl font-bold text-[#37352f]">Profile not found</h1>
        <p className="mt-2 text-[#787774]">
          This user doesn&apos;t have a public profile yet.
        </p>
        <Link href="/">
          <Button className="mt-4">Go home</Button>
        </Link>
      </div>
    );
  }

  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Anonymous';
  const socialLinks = profile.socialLinks ?? [];

  const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    website: Globe,
    github: ExternalLink,
    linkedin: ExternalLink,
    twitter: ExternalLink,
    youtube: ExternalLink,
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 md:px-8">
      {/* Hero Section — Two-Column Split */}
      <Card className="border-[#e8e7e4] shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <Card.Content className="p-8">
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="flex flex-col items-center gap-4 md:items-start">
              <Avatar className="h-24 w-24 text-3xl ring-4 ring-white">
                {profile.avatarUrl ? (
                  <Avatar.Image src={`/uploads/${profile.avatarUrl}`} alt={displayName} />
                ) : null}
                <Avatar.Fallback>{displayName.charAt(0).toUpperCase()}</Avatar.Fallback>
              </Avatar>
              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link) => {
                    const PlatformIcon =
                      platformIcons[link.platform.toLowerCase()] || LinkIcon;
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.label || link.platform}
                      >
                        <Button isIconOnly variant="outline" size="sm">
                          <PlatformIcon className="size-4" />
                        </Button>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex-1 md:border-l-2 md:border-[#e8e7e4] md:pl-6">
              <h1 className="text-[30px] font-bold text-[#37352f]">{displayName}</h1>
              {profile.headline && (
                <p className="mt-1 text-[#787774]">{profile.headline}</p>
              )}
              {profile.location && (
                <p className="mt-1 flex items-center gap-1 text-sm text-[#a3a29e]">
                  <MapPin className="size-3.5" />
                  {profile.location}
                </p>
              )}
              {profile.bio && (
                <p className="mt-4 text-sm leading-relaxed text-[#37352f]">{profile.bio}</p>
              )}
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Projects Section */}
      {profile.projects.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#37352f]">
            <FolderOpen className="size-5" />
            Projects
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {profile.projects.map((project) => (
              <Card
                key={project.id}
                className="border-[#e8e7e4] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#fbfbfa]"
              >
                <Card.Content className="p-5">
                  {project.images.length > 0 && (
                    <div className="-mx-5 -mt-5 mb-3">
                      <MediaCarousel
                        items={project.images}
                        alt={project.title}
                        className="rounded-t-xl"
                      />
                    </div>
                  )}
                  <h3 className="font-medium text-[#37352f]">{project.title}</h3>
                  {project.description && (
                    <p className="mt-1 line-clamp-2 text-sm text-[#787774]">
                      {project.description}
                    </p>
                  )}
                  {project.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <Chip key={tag} size="sm">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex gap-3">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary hover:text-[#0b6e99]"
                      >
                        Live Demo
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-[#787774] hover:text-[#37352f]"
                      >
                        Source Code
                      </a>
                    )}
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Skills Section */}
      {profile.skills.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#37352f]">
            <Code className="size-5" />
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Chip key={skill.id} size="sm">
                {skill.name}
                {skill.category?.name && (
                  <span className="ml-1.5 text-xs text-[#a3a29e]">
                    {skill.category.name}
                  </span>
                )}
              </Chip>
            ))}
          </div>
        </section>
      )}

      {/* Experience Section */}
      {profile.experiences.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#37352f]">
            <Briefcase className="size-5" />
            Experience
          </h2>
          <div className="space-y-4">
            {profile.experiences.map((exp) => (
              <Card
                key={exp.id}
                className="border-[#e8e7e4] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#fbfbfa]"
              >
                <Card.Content className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-[#37352f]">{exp.role}</h3>
                      <p className="text-sm text-[#787774]">{exp.company}</p>
                    </div>
                    <span className="text-xs text-[#a3a29e]">
                      {new Date(exp.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                      {' - '}
                      {exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Present'}
                    </span>
                  </div>
                  {exp.description.length > 0 && (
                    <ul className="mt-2 list-disc space-y-0.5 pl-4">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-sm leading-relaxed text-[#787774]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card.Content>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      {profile.education.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#37352f]">
            <GraduationCap className="size-5" />
            Education
          </h2>
          <div className="space-y-4">
            {profile.education.map((edu) => (
              <Card
                key={edu.id}
                className="border-[#e8e7e4] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#fbfbfa]"
              >
                <Card.Content className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-[#37352f]">{edu.school}</h3>
                      {(edu.degree || edu.field) && (
                        <p className="text-sm text-[#787774]">
                          {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-[#a3a29e]">
                      {new Date(edu.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                      {' - '}
                      {edu.endDate
                        ? new Date(edu.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Present'}
                    </span>
                  </div>
                  {edu.description.length > 0 && (
                    <ul className="mt-2 list-disc space-y-0.5 pl-4">
                      {edu.description.map((item, i) => (
                        <li key={i} className="text-sm leading-relaxed text-[#787774]">
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card.Content>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Certifications Section */}
      {profile.certifications.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#37352f]">
            <Award className="size-5" />
            Certifications
          </h2>
          <div className="space-y-4">
            {profile.certifications.map((cert) => (
              <Card
                key={cert.id}
                className="border-[#e8e7e4] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#fbfbfa]"
              >
                <Card.Content className="p-5">
                  <h3 className="font-medium text-[#37352f]">{cert.name}</h3>
                  <p className="text-sm text-[#787774]">{cert.issuer}</p>
                  {(cert.issueDate || cert.expiryDate) && (
                    <span className="mt-1 text-xs text-[#a3a29e]">
                      {cert.issueDate
                        ? new Date(cert.issueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : ''}
                      {cert.issueDate && cert.expiryDate ? ' - ' : ''}
                      {cert.expiryDate
                        ? new Date(cert.expiryDate).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : ''}
                    </span>
                  )}
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-xs font-medium text-primary hover:text-[#0b6e99]"
                    >
                      View Credential
                    </a>
                  )}
                </Card.Content>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Languages Section */}
      {profile.languages.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#37352f]">
            <Languages className="size-5" />
            Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.languages.map((lang) => (
              <Chip key={lang.id} size="sm">
                {lang.name}
                {lang.proficiency && (
                  <span className="ml-1.5 text-xs font-medium text-[#0f7b6c]">
                    {lang.proficiency}
                  </span>
                )}
              </Chip>
            ))}
          </div>
        </section>
      )}

      {/* Awards Section */}
      {profile.awards.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#37352f]">
            <Trophy className="size-5" />
            Awards
          </h2>
          <div className="space-y-4">
            {profile.awards.map((award) => (
              <Card
                key={award.id}
                className="border-[#e8e7e4] shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#fbfbfa]"
              >
                <Card.Content className="p-5">
                  <h3 className="font-medium text-[#37352f]">{award.title}</h3>
                  {award.issuer && (
                    <p className="text-sm text-[#787774]">{award.issuer}</p>
                  )}
                  {award.date && (
                    <span className="mt-1 text-xs text-[#a3a29e]">
                      {new Date(award.date).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                  {award.description && (
                    <p className="mt-2 text-sm leading-relaxed text-[#787774]">
                      {award.description}
                    </p>
                  )}
                </Card.Content>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Hobbies Section */}
      {profile.hobbies.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#37352f]">
            <Heart className="size-5" />
            Hobbies
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.hobbies.map((hobby) => (
              <Chip
                key={hobby.id}
                size="sm"
                title={hobby.description ?? undefined}
              >
                {hobby.name}
                {hobby.description && (
                  <span className="ml-1.5 text-xs text-[#a3a29e]">
                    {hobby.description}
                  </span>
                )}
              </Chip>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);

  return (
    <AppProviders>
      <nav className="sticky top-0 z-50 border-b border-[#e8e7e4] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 md:px-8">
          <Link href="/" className="text-lg font-bold text-[#37352f]">
            Lucky<span className="text-primary">Plans</span>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </Link>
        </div>
      </nav>
      <PortfolioContent userId={userId} />
    </AppProviders>
  );
}
