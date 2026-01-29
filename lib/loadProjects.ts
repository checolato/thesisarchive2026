import raw from "@/data/projects.json";

export type Project = {
  no: string;
  slug: string;
  project_name: string;
  year: string;
  author: string;
  category: string;
  type: string;
  link?: string;
  description?: string;
  image?: string;
};

export function getProjects(): Project[] {
  return raw as Project[];
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}
