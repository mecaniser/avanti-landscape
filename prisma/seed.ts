import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const AREA_LIST = JSON.stringify([
  { name: "Waxhaw", state: "North Carolina" },
  { name: "Marvin", state: "North Carolina" },
  { name: "Weddington", state: "North Carolina" },
  { name: "Wesley Chapel", state: "North Carolina" },
  { name: "Matthews", state: "North Carolina" },
  { name: "Stallings", state: "North Carolina" },
  { name: "Pineville", state: "North Carolina" },
  { name: "Indian Land", state: "South Carolina" },
  { name: "Ballantyne", state: "North Carolina" },
]);

async function main() {
  // --- Admin user ---
  const adminEmail = process.env.ADMIN_EMAIL ?? "owner@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });

  // --- Content blocks ---
  const contentBlocks: {
    page: string;
    key: string;
    type: "text" | "richtext" | "image";
    value: string;
  }[] = [
    { page: "global", key: "area_list", type: "text", value: AREA_LIST },
    { page: "global", key: "phone", type: "text", value: "980-328-7141" },
    { page: "global", key: "phone_tel", type: "text", value: "9803287141" },
    { page: "global", key: "email", type: "text", value: "avantilandscaping1@gmail.com" },
    { page: "global", key: "hours", type: "text", value: "Mon–Sat: 8am–6pm" },
    { page: "global", key: "facebook_url", type: "text", value: "https://www.facebook.com/profile.php?id=61557549524255" },
    { page: "global", key: "instagram_url", type: "text", value: "https://www.instagram.com/avanti.landscaping.llc/" },

    // Home
    { page: "home", key: "hero_eyebrow", type: "text", value: "Waxhaw, NC & Surrounding Areas" },
    { page: "home", key: "hero_heading", type: "text", value: "Lawn Care & Landscaping You Can Count On" },
    { page: "home", key: "hero_paragraph", type: "text", value: "Fertilization, landscaping, hardscaping, and full-service maintenance for homes and businesses across the Waxhaw area — done right, every time." },
    { page: "home", key: "services_heading", type: "text", value: "Four Ways We Care For Your Property" },
    { page: "home", key: "services_paragraph", type: "text", value: "From weekly mowing to full backyard transformations, our crews handle it all." },
    { page: "home", key: "why_heading", type: "text", value: "Clean, Reliable, Detail-Focused Work" },
    { page: "home", key: "why_paragraph", type: "text", value: "We treat every property like it's our own — showing up on schedule and leaving things looking sharp." },
    { page: "home", key: "ba_heading", type: "text", value: "A real before & after" },
    { page: "home", key: "ba_paragraph", type: "text", value: "One Avanti project, shown before work and after installation." },
    { page: "home", key: "areas_heading", type: "text", value: "Proudly Serving the Waxhaw Area" },
    { page: "home", key: "areas_paragraph", type: "text", value: "Based in Waxhaw, NC and serving these nearby communities." },
    { page: "home", key: "about_heading", type: "text", value: "A Local Crew That Takes Pride In The Details" },
    { page: "home", key: "about_paragraph", type: "text", value: "Avanti Landscaping was built on a simple idea: give every lawn the same care and attention we'd want for our own. We specialize in tall fescue and Bermuda lawns suited to our local climate, backed by dependable, friendly service." },
    { page: "home", key: "cta_heading", type: "text", value: "Ready for a lawn you're proud of?" },
    { page: "home", key: "cta_paragraph", type: "text", value: "Get a free, no-pressure quote for your property today." },
    { page: "home", key: "card_lawncare_image", type: "image", value: "/assets/img/card-lawncare.jpg" },
    { page: "home", key: "card_landscaping_image", type: "image", value: "/assets/img/card-landscaping.jpg" },
    { page: "home", key: "card_maintenance_image", type: "image", value: "/assets/img/card-maintenance.jpg" },
    { page: "home", key: "about_teaser_image", type: "image", value: "/assets/img/about-crew.jpg" },

    // About
    { page: "about", key: "hero_paragraph", type: "text", value: "A local lawn care and landscaping team focused on quality, consistency, and honest service." },
    { page: "about", key: "story_heading", type: "text", value: "Built On Attention To Detail" },
    { page: "about", key: "story_paragraph_1", type: "text", value: "Avanti Landscaping got its start caring for lawns right here in Waxhaw, NC. We specialize in tall fescue and Bermuda lawns suited to our local climate, and we've grown by treating every yard — big or small — with the same level of care." },
    { page: "about", key: "story_paragraph_2", type: "text", value: "Today we offer lawn care, landscaping, hardscaping, and full property maintenance for homeowners, HOAs, and businesses across the greater Waxhaw area." },
    { page: "about", key: "photo_image", type: "image", value: "/assets/img/gallery-pruning.jpg" },
    { page: "about", key: "cta_heading", type: "text", value: "Let's talk about your property" },
    { page: "about", key: "cta_paragraph", type: "text", value: "Get a free, no-pressure estimate from our team." },

    // Areas
    { page: "areas", key: "hero_paragraph", type: "text", value: "Based in Waxhaw, NC, and proud to serve homeowners and businesses throughout these nearby communities." },
    { page: "areas", key: "cta_heading", type: "text", value: "We May Still Be Able to Help" },
    { page: "areas", key: "cta_paragraph", type: "text", value: "Give us a call — we regularly take on properties just outside our main service map." },

    // Services
    { page: "services", key: "hero_paragraph", type: "text", value: "Everything your lawn and landscape need — from routine care to full outdoor builds." },
    { page: "services", key: "cta_heading", type: "text", value: "Not sure what your property needs?" },
    { page: "services", key: "cta_paragraph", type: "text", value: "Tell us what you're looking for and we'll recommend the right services." },

    // Gallery
    { page: "gallery", key: "hero_paragraph", type: "text", value: "Real photos from real properties across the Waxhaw area." },

    // Contact
    { page: "contact", key: "hero_paragraph", type: "text", value: "Tell us a bit about your property and what you need — we'll follow up quickly." },
  ];

  for (const block of contentBlocks) {
    await prisma.contentBlock.upsert({
      where: { page_key: { page: block.page, key: block.key } },
      update: { value: block.value, type: block.type },
      create: block,
    });
  }

  // --- Services ---
  await prisma.service.deleteMany();
  const services: { category: string; name: string; description: string }[] = [
    // Lawn Care
    { category: "lawn-care", name: "Lawn Fertilization", description: "Season-long feeding programs that keep grass thick, green, and resilient." },
    { category: "lawn-care", name: "Weed Control", description: "Targeted treatments that knock out weeds without harming your turf." },
    { category: "lawn-care", name: "Core Aeration", description: "Relieves soil compaction so water, air, and nutrients reach the roots." },
    { category: "lawn-care", name: "Overseeding", description: "Fills in thin spots and thickens your lawn with fresh, healthy grass." },
    { category: "lawn-care", name: "Lime Treatments", description: "Balances soil pH so fertilizer and nutrients actually work." },
    { category: "lawn-care", name: "Brown Patch Control", description: "Preventive and curative treatment for fungal brown patch disease." },
    { category: "lawn-care", name: "Grub Control", description: "Protects your lawn's roots from grub damage before it starts." },
    // Landscaping
    { category: "landscaping", name: "Plantings & Softscapes", description: "Trees, shrubs, and beds designed to fit your home and climate." },
    { category: "landscaping", name: "Annual Flowers", description: "Seasonal color rotations that keep beds vibrant year-round." },
    { category: "landscaping", name: "Sod Installation", description: "Fresh sod for new lawns, repairs, or full yard makeovers." },
    { category: "landscaping", name: "New Lawn Seeding", description: "Professional seeding and soil prep for a strong lawn from day one." },
    { category: "landscaping", name: "Landscape Lighting", description: "Accent and pathway lighting that shows off your property at night." },
    { category: "landscaping", name: "Drainage & Grading", description: "Solves standing water and erosion issues with proper grading." },
    { category: "landscaping", name: "Rock Installation", description: "Decorative rock and stone for beds, borders, and drainage areas." },
    // Hardscaping
    { category: "hardscaping", name: "Patios", description: "Custom paver and stone patios built for everyday outdoor living." },
    { category: "hardscaping", name: "Retaining Walls", description: "Functional, good-looking walls that hold back soil and add structure." },
    { category: "hardscaping", name: "Fire Pits", description: "Custom fire pits and seating areas for cool-weather evenings outside." },
    { category: "hardscaping", name: "Walkways", description: "Paver and stone walkways that connect your property with style." },
    { category: "hardscaping", name: "Outdoor Steps", description: "Durable steps that tie together multi-level yards safely." },
    // Maintenance
    { category: "maintenance", name: "Lawn Mowing", description: "Reliable weekly or bi-weekly mowing, edging, and trimming." },
    { category: "maintenance", name: "Mulch Installation", description: "Fresh mulch delivery and installation in a variety of colors." },
    { category: "maintenance", name: "Leaf Removal", description: "Thorough seasonal leaf cleanup so your yard stays tidy." },
    { category: "maintenance", name: "Spring Yard Cleanup", description: "Get your property reset and ready after winter." },
    { category: "maintenance", name: "Fall Yard Cleanup", description: "Beds and lawns cleared and prepped before winter hits." },
    { category: "maintenance", name: "Overgrown Yard Cleanup", description: "Bring an overgrown or neglected yard back under control." },
    { category: "maintenance", name: "Landscape Bed Weed Control", description: "Keeps beds clear of weeds so plantings can shine." },
    { category: "maintenance", name: "Full-Service Maintenance Program", description: "One plan that covers mowing, beds, and seasonal cleanups all year." },
  ];
  await prisma.service.createMany({
    data: services.map((s, i) => ({ ...s, sortOrder: i })),
  });

  // --- Gallery images ---
  await prisma.galleryImage.deleteMany();
  const galleryImages = [
    { url: "/assets/img/gallery-mulch-action.jpg", caption: "Mulch Installation" },
    { url: "/assets/img/gallery-sod-wheelbarrow.jpg", caption: "Sod Installation" },
    { url: "/assets/img/gallery-drainage.jpg", caption: "Drainage Solutions" },
    { url: "/assets/img/gallery-lawncare-spreader.jpg", caption: "Lawn Fertilization" },
    { url: "/assets/img/gallery-mowing.jpg", caption: "Lawn Mowing" },
    { url: "/assets/img/gallery-pruning.jpg", caption: "Shrub & Tree Pruning" },
    { url: "/assets/img/gallery-soil-prep.jpg", caption: "Soil Preparation" },
    { url: "/assets/img/gallery-mulch-bed.jpg", caption: "Landscape Bed Care" },
    { url: "/assets/img/gallery-sod-closeup.jpg", caption: "New Lawn Installation" },
  ];
  await prisma.galleryImage.createMany({
    data: galleryImages.map((g, i) => ({ ...g, category: "project", sortOrder: i })),
  });

  // --- Before & After projects ---
  // Only seeds an empty table — the owner manages this list from the Gallery
  // admin screen, so a reseed must never clobber what they've added.
  if ((await prisma.beforeAfterProject.count()) === 0) {
    await prisma.beforeAfterProject.createMany({
      data: [
        {
          beforeUrl: "/assets/img/project-planting-before.jpg",
          afterUrl: "/assets/img/project-planting-after.jpg",
          caption: "Planting Bed Installation",
          subtext: "The same property before work began and after the new planting bed was installed",
          sortOrder: 0,
        },
      ],
    });
  }

  // --- Blog posts ---
  const posts = [
    {
      slug: "core-aeration",
      title: "5 Signs Your Lawn Needs Core Aeration",
      excerpt: "Compacted soil is a common, often invisible reason lawns struggle. Here are 5 signs your lawn needs core aeration.",
      coverImage: null,
      tag: "LAWN CARE",
      body: `<p>Compacted soil is one of the most common — and least obvious — reasons a lawn struggles, even with regular watering and fertilizing. Aeration relieves that compaction so water, air, and nutrients can actually reach the roots. Here's how to tell if your lawn needs it.</p>
<h2>1. Water Pools Instead of Soaking In</h2>
<p>If rain or sprinkler water sits on the surface instead of absorbing, compacted soil is likely blocking it from reaching the roots.</p>
<h2>2. The Lawn Feels Hard Underfoot</h2>
<p>Walk across your yard. If it feels more like a parking lot than a cushion, compaction is limiting root growth.</p>
<h2>3. Heavy Foot or Vehicle Traffic</h2>
<p>Play areas, dog runs, and spots where mowers or cars regularly pass compact faster than the rest of the yard.</p>
<h2>4. Thinning Grass Despite Regular Care</h2>
<p>If you're fertilizing and watering on schedule but the lawn still looks thin, compacted soil may be the real culprit.</p>
<h2>5. Visible Thatch Buildup</h2>
<p>A thick spongy layer of dead grass and roots at the soil surface often pairs with compaction and blocks new growth.</p>
<p>Core aeration is typically done once or twice a year and pairs well with overseeding for the best results. If any of this sounds familiar, we're happy to take a look at your lawn.</p>`,
    },
    {
      slug: "spring-vs-fall-cleanup",
      title: "Spring vs. Fall Cleanup: What Your Yard Actually Needs",
      excerpt: "Spring and fall yard cleanups serve different purposes. Here's what to prioritize in each season.",
      coverImage: "/assets/img/gallery-mulch-bed.jpg",
      tag: "MAINTENANCE",
      body: `<p>It's tempting to treat spring cleanup and fall cleanup as the same job on a different date. They're not. Each season sets your lawn up for what comes next, and skipping the wrong one can undo months of good care.</p>
<h2>Spring Cleanup: Waking the Lawn Up</h2>
<p>Spring is about clearing winter debris, cutting back dead growth, and getting ahead of early weeds before they take hold. It's also the right time for a first application of fertilizer and a close look at any bare or thin patches from winter.</p>
<h2>Fall Cleanup: Setting Up for Winter</h2>
<p>Fall cleanup is more about protection. Removing leaves before they smother the grass, aerating and overseeding while soil temperatures are ideal, and clearing beds so pests and disease have nowhere to hide over winter.</p>
<h2>Why Both Matter</h2>
<ul>
<li>Skipping spring cleanup lets weeds get a head start you'll fight all summer.</li>
<li>Skipping fall cleanup leaves your lawn more vulnerable to disease and winter damage.</li>
<li>Doing both on schedule means less reactive work — and cost — the rest of the year.</li>
</ul>
<p>If your yard hasn't had a proper cleanup in a while, an overgrown yard cleanup can reset things before you get back on a regular schedule.</p>`,
    },
    {
      slug: "tall-fescue-waxhaw",
      title: "Why Tall Fescue Is the Right Lawn for Waxhaw, NC",
      excerpt: "Waxhaw sits in a tricky transition climate zone. Here's why tall fescue tends to be the safer lawn choice.",
      coverImage: "/assets/img/blog-lawn-wide.jpg",
      tag: "LAWN CARE",
      body: `<p>Waxhaw sits in what's known as the "transition zone" — too hot in summer for cool-season grasses to thrive everywhere, but too cold in winter for warm-season grasses to stay green year-round. That in-between climate is exactly why tall fescue tends to be the safer, more forgiving choice for most yards here.</p>
<h2>It Handles Our Swings Better</h2>
<p>Tall fescue has a deep root system that helps it tolerate both summer heat and occasional winter cold better than many alternatives suited to more extreme climates.</p>
<h2>It Stays Greener, Longer</h2>
<p>Unlike some warm-season grasses that go dormant and brown in winter, tall fescue holds its color through most of the year with the right care.</p>
<h2>It's More Forgiving of Shade</h2>
<p>Many Waxhaw-area properties have mature trees. Tall fescue tolerates partial shade far better than Bermuda and other sun-hungry grasses.</p>
<h2>What It Needs From You</h2>
<ul>
<li>Regular overseeding, since tall fescue doesn't spread on its own like Bermuda does.</li>
<li>Core aeration to keep soil from compacting around its roots.</li>
<li>Seasonal fertilization and weed control to keep it thick and healthy.</li>
</ul>
<p>Not sure what's currently growing in your yard, or whether it's the right fit? We're happy to take a look and make a recommendation specific to your property.</p>`,
    },
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        tag: post.tag,
        body: post.body,
        coverImage: post.coverImage,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        tag: post.tag,
        body: post.body,
        coverImage: post.coverImage,
        publishedAt: new Date("2026-07-01T12:00:00Z"),
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
