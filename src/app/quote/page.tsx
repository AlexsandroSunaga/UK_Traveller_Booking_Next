import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ pickup?: string; dropoff?: string; [key: string]: string | undefined }>;
};

export default async function QuoteRedirectPage({ searchParams }: Props) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) qs.set(k, v);
  });
  redirect(`/book${qs.toString() ? `?${qs.toString()}` : ""}`);
}
