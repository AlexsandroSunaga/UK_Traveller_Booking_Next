import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageLayout } from "@/components/pages/PageLayout";
import { getPageContent, getAllPagePaths } from "@/lib/pages";
import { normalizeSlug } from "@/lib/paths";
import { SITE } from "@/lib/constants";

export const dynamicParams = false;
export const revalidate = 86400;
type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateStaticParams() {
  return getAllPagePaths().map((path) => ({
    slug: path.split("/"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug = [] } = await params;
  const path = normalizeSlug(slug);
  const page = getPageContent(path);

  if (!page) return { title: "Page Not Found" };

  return {
    title: `${page.title} | ${SITE.name}`,
    description: page.metaDescription,
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug = [] } = await params;
  const path = normalizeSlug(slug);
  const page = getPageContent(path);

  if (!page) notFound();

  return <PageLayout page={page} />;
}
