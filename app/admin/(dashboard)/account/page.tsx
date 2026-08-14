import { prisma } from "@/lib/db";
import AccountSettings from "./AccountSettings";

export const dynamic = "force-dynamic";

const DEFAULTS = {
  phone: "980-328-7141",
  email: "avantilandscaping1@gmail.com",
  hours: "Mon–Sat: 8am–6pm",
  facebookUrl: "https://www.facebook.com/profile.php?id=61557549524255",
  instagramUrl: "https://www.instagram.com/avanti.landscaping.llc/",
};

export default async function AccountPage() {
  const blocks = await prisma.contentBlock.findMany({ where: { page: "global" } });
  const values = Object.fromEntries(blocks.map((block) => [block.key, block.value]));

  return (
    <AccountSettings
      settings={{
        phone: values.phone ?? DEFAULTS.phone,
        email: values.email ?? DEFAULTS.email,
        hours: values.hours ?? DEFAULTS.hours,
        facebookUrl: values.facebook_url ?? DEFAULTS.facebookUrl,
        instagramUrl: values.instagram_url ?? DEFAULTS.instagramUrl,
      }}
    />
  );
}
