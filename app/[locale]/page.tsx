import HomePage from "@/components/home/HomePage";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: Props) {
  const { locale } = await params;
  return <HomePage locale={locale} />;
}
