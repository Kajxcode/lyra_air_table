import BaseClient from "./base-client";

export default async function BasePage({
  params,
}: {
  params: Promise<{ baseId: string }>;
}) {
  const { baseId } = await params;
  return <BaseClient baseId={baseId} />;
}
