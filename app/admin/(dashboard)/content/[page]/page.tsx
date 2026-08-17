import Link from "next/link";
import type { ContentBlock } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { parseAreaList } from "@/lib/content";
import SubmitButton from "../../SubmitButton";
import { clearHeroVideo, clearHeroImage } from "../actions";
import { ContentSectionForm, ContentTextForm, ServiceAreaForm } from "../ContentForms";
import AdminUploadForm from "@/components/AdminUploadForm";
import DetailsCloseButton from "@/components/DetailsCloseButton";
import { SERVICE_CATEGORIES, categoryImageKey } from "@/lib/services";

// These fields belong to dedicated owner workflows, not this generic page editor.
const MANAGED_ELSEWHERE = new Set([
  "hero_video",
  "hero_image",
  "ba_before_image",
  "ba_after_image",
  "ba_caption_title",
  "ba_caption_sub",
  "phone",
  "phone_tel",
  "email",
  "hours",
  "facebook_url",
  "instagram_url",
  "card_lawncare_image",
  "card_landscaping_image",
  "card_hardscaping_image",
  "card_maintenance_image",
  ...SERVICE_CATEGORIES.map((cat) => categoryImageKey(cat.slug)),
]);

// The property-plan homepage intentionally supplies these pieces from its fixed design system.
const HOME_LEGACY_FIELDS = new Set([
  "hero_eyebrow",
  "hero_heading",
  "hero_paragraph",
  "services_heading",
  "services_paragraph",
]);

const ROUTE_IMAGES: { key: string; label: string; fallback: string }[] = [
  { key: "card_lawncare_image", label: "Lawn care", fallback: "/assets/img/card-lawncare.jpg" },
  { key: "card_landscaping_image", label: "Landscaping", fallback: "/assets/img/card-landscaping.jpg" },
  { key: "card_hardscaping_image", label: "Hardscaping", fallback: "/assets/img/gallery-drainage.jpg" },
  { key: "card_maintenance_image", label: "Maintenance", fallback: "/assets/img/card-maintenance.jpg" },
];

const CATEGORY_IMAGES: { key: string; label: string; fallback: string }[] = SERVICE_CATEGORIES.map((cat) => ({
  key: categoryImageKey(cat.slug),
  label: cat.label,
  fallback: cat.image,
}));

const PAGES = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "areas", label: "Areas" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
  { id: "global", label: "Shared" },
];

const LABELS: Record<string, string> = {
  hero_paragraph: "Page introduction",
  story_heading: "Story heading",
  story_paragraph_1: "First story paragraph",
  story_paragraph_2: "Second story paragraph",
  photo_image: "Feature image",
  about_heading: "About section heading",
  about_paragraph: "About section paragraph",
  about_teaser_image: "About section image",
  ba_heading: "Before & after heading",
  ba_paragraph: "Before & after paragraph",
  why_heading: "Why Avanti heading",
  why_paragraph: "Why Avanti paragraph",
  areas_heading: "Coverage heading",
  areas_paragraph: "Coverage paragraph",
  cta_heading: "Call to action heading",
  cta_paragraph: "Call to action paragraph",
};

function labelFor(key: string) {
  return LABELS[key] ?? key.replace(/_/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());
}

function groupFor(page: string, key: string) {
  if (key.startsWith("cta_")) return "Call to action";
  if (key === "hero_paragraph") return "Page introduction";
  if (page === "home") {
    if (key.startsWith("ba_")) return "Before & after";
    if (key.startsWith("why_")) return "Why Avanti";
    if (key.startsWith("areas_")) return "Service coverage";
    if (key.startsWith("about_")) return "About Avanti";
  }
  if (page === "about" && key.startsWith("story_")) return "Our story";
  if (page === "about" && key === "photo_image") return "Feature image";
  return "Page content";
}

function textareaFor(value: string) {
  return value.length > 100 || value.includes("\n");
}

function fieldLabelFor(key: string, index: number) {
  if (key.endsWith("_heading")) return "Headline";
  if (key === "cta_paragraph") return "Supporting text";
  if (key.endsWith("_paragraph_1")) return "Opening paragraph";
  if (key.endsWith("_paragraph_2")) return "Second paragraph";
  if (key.endsWith("_paragraph")) return index === 0 ? "Copy" : "Supporting text";
  return labelFor(key);
}

function ContentBlockItem({ page, block, uploadsEnabled }: { page: string; block: ContentBlock; uploadsEnabled: boolean }) {
  const label = labelFor(block.key);

  if (block.type === "image") {
    return (
      <article className="content-admin-item content-admin-item--image">
        <div className="content-admin-item__summary">
          <div>
            <p className="content-admin-item__label">{label}</p>
            <p className="content-admin-item__preview">Current image shown on the public page.</p>
          </div>
          <img src={block.value} alt={`Current ${label.toLowerCase()}`} className="content-admin-item__thumb" />
        </div>
        {uploadsEnabled ? (
          <details className="content-admin-item__edit">
            <summary>Edit image</summary>
            <div className="content-admin-item__edit-body">
              <AdminUploadForm
                operation="content-image"
                statusId={`content-image-${block.id}`}
                submitLabel="Save image"
                processingLabel="Saving image…"
                className="admin-form"
              >
                <input type="hidden" name="page" value={page} />
                <input type="hidden" name="key" value={block.key} />
                <label htmlFor={`image-${block.id}`}>Choose replacement image</label>
                <input type="file" id={`image-${block.id}`} name="file" accept="image/*" required />
              </AdminUploadForm>
              <DetailsCloseButton>Close</DetailsCloseButton>
            </div>
          </details>
        ) : (
          <p className="content-admin-item__unavailable">Image replacement is unavailable until Cloudinary is configured.</p>
        )}
      </article>
    );
  }

  return (
    <article className="content-admin-item">
      <div className="content-admin-item__summary">
        <div>
          <p className="content-admin-item__label">{label}</p>
          <p className="content-admin-item__preview">{block.value}</p>
        </div>
        <details className="content-admin-item__edit">
          <summary>Edit text</summary>
          <div className="content-admin-item__edit-body">
            <ContentTextForm
              page={page}
              contentKey={block.key}
              blockId={block.id}
              type={block.type}
              label={label}
              value={block.value}
              multiline={textareaFor(block.value)}
            />
          </div>
        </details>
      </div>
    </article>
  );
}

function ContentSection({ page, title, blocks, uploadsEnabled }: { page: string; title: string; blocks: ContentBlock[]; uploadsEnabled: boolean }) {
  const groupedText = blocks.length > 1 && blocks.every((block) => block.type !== "image");

  return (
    <section className="admin-card content-admin-section">
      <h3>{title}</h3>
      {groupedText ? (
        <article className="content-admin-section__group">
          <div className="content-admin-section__preview">
            {blocks.map((block, index) => (
              <p key={block.id} className={block.key.endsWith("_heading") ? "content-admin-section__headline" : undefined}>{block.value}</p>
            ))}
          </div>
          <details className="content-admin-item__edit">
            <summary>Edit section</summary>
            <div className="content-admin-item__edit-body">
              <ContentSectionForm
                page={page}
                blocks={blocks.map((block, index) => ({
                  id: block.id,
                  key: block.key,
                  value: block.value,
                  label: fieldLabelFor(block.key, index),
                  multiline: textareaFor(block.value),
                }))}
              />
            </div>
          </details>
        </article>
      ) : (
        <div className="content-admin-section__list">
          {blocks.map((block) => <ContentBlockItem key={block.id} page={page} block={block} uploadsEnabled={uploadsEnabled} />)}
        </div>
      )}
    </section>
  );
}

function HeroBackgroundControl({
  imageBlock,
  videoBlock,
  uploadsEnabled,
}: {
  imageBlock: ContentBlock | undefined;
  videoBlock: ContentBlock | undefined;
  uploadsEnabled: boolean;
}) {
  return (
    <section className="admin-card content-admin-section content-admin-hero-video">
      <div className="content-admin-hero-video__head">
        <div>
          <h3>Hero background</h3>
          <p>Shown behind the homepage headline. Add a photo, a video, or both — the photo also serves as the video&apos;s poster and as the fallback whenever the video doesn&apos;t play.</p>
        </div>
      </div>

      <div className="content-admin-hero-bg__grid">
        <div className="content-admin-hero-bg__item">
          <div className="content-admin-hero-bg__item-head">
            <h4>Photo</h4>
            {imageBlock?.value && <span className="admin-badge admin-badge--active">Photo set</span>}
          </div>

          {imageBlock?.value ? (
            <>
              <img
                src={imageBlock.value}
                alt="Current hero background photo"
                className="content-admin-hero-video__preview"
                style={{ aspectRatio: "21 / 9", objectFit: "cover" }}
              />
              <details className="content-admin-item__edit">
                <summary>Replace or remove photo</summary>
                <div className="content-admin-item__edit-body content-admin-hero-video__actions">
                  {uploadsEnabled && (
                    <AdminUploadForm operation="hero-image" submitLabel="Replace photo" processingLabel="Saving photo…" className="admin-form">
                      <label htmlFor="hero-image-file">Choose replacement photo</label>
                      <input type="file" id="hero-image-file" name="file" accept="image/*" required />
                    </AdminUploadForm>
                  )}
                  <form action={clearHeroImage}>
                    <SubmitButton className="admin-btn admin-btn--danger" pendingLabel="Removing photo…">Remove photo</SubmitButton>
                  </form>
                  <DetailsCloseButton>Close</DetailsCloseButton>
                </div>
              </details>
            </>
          ) : uploadsEnabled ? (
            <details className="content-admin-item__edit">
              <summary>Add photo</summary>
              <div className="content-admin-item__edit-body content-admin-hero-video__actions">
                <AdminUploadForm operation="hero-image" submitLabel="Upload photo" processingLabel="Saving photo…" className="admin-form">
                  <label htmlFor="hero-image-file">Choose photo</label>
                  <input type="file" id="hero-image-file" name="file" accept="image/*" required />
                </AdminUploadForm>
                <DetailsCloseButton>Close</DetailsCloseButton>
              </div>
            </details>
          ) : (
            <p className="content-admin-item__unavailable">Photo upload is unavailable until Cloudinary is configured.</p>
          )}
        </div>

        <div className="content-admin-hero-bg__item">
          <div className="content-admin-hero-bg__item-head">
            <h4>Video</h4>
            {videoBlock?.value && <span className="admin-badge admin-badge--active">Video set</span>}
          </div>

          {videoBlock?.value ? (
            <>
              <video
                src={videoBlock.value}
                muted
                playsInline
                controls
                className="content-admin-hero-video__preview"
                style={{ aspectRatio: "21 / 9", objectFit: "cover" }}
              />
              <details className="content-admin-item__edit">
                <summary>Replace or remove video</summary>
                <div className="content-admin-item__edit-body content-admin-hero-video__actions">
                  {uploadsEnabled && (
                    <AdminUploadForm operation="hero-video" submitLabel="Replace video" processingLabel="Saving video…" className="admin-form">
                      <label htmlFor="hero-video-file">Choose replacement video</label>
                      <input type="file" id="hero-video-file" name="file" accept="video/*" required />
                    </AdminUploadForm>
                  )}
                  <form action={clearHeroVideo}>
                    <SubmitButton className="admin-btn admin-btn--danger" pendingLabel="Removing video…">Remove video</SubmitButton>
                  </form>
                  <DetailsCloseButton>Close</DetailsCloseButton>
                </div>
              </details>
            </>
          ) : uploadsEnabled ? (
            <details className="content-admin-item__edit">
              <summary>Add video</summary>
              <div className="content-admin-item__edit-body content-admin-hero-video__actions">
                <AdminUploadForm operation="hero-video" submitLabel="Upload video" processingLabel="Saving video…" className="admin-form">
                  <label htmlFor="hero-video-file">Choose MP4 video</label>
                  <input type="file" id="hero-video-file" name="file" accept="video/*" required />
                </AdminUploadForm>
                <DetailsCloseButton>Close</DetailsCloseButton>
              </div>
            </details>
          ) : (
            <p className="content-admin-item__unavailable">Video upload is unavailable until Cloudinary is configured. The homepage will use its background photo instead.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function ImageSetControl({
  title,
  description,
  operation,
  items,
  blocksByKey,
  uploadsEnabled,
  aspectRatio,
}: {
  title: string;
  description: string;
  operation: string;
  items: { key: string; label: string; fallback: string }[];
  blocksByKey: Record<string, ContentBlock | undefined>;
  uploadsEnabled: boolean;
  /** Matches the crop used on the public page, so the thumbnail previews what's actually being changed. */
  aspectRatio: string;
}) {
  return (
    <section className="admin-card content-admin-section content-admin-hero-video">
      <div className="content-admin-hero-video__head">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className="content-admin-hero-bg__grid content-admin-hero-bg__grid--4">
        {items.map((item) => {
          const src = blocksByKey[item.key]?.value || item.fallback;
          return (
            <div className="content-admin-hero-bg__item" key={item.key}>
              <div className="content-admin-hero-bg__item-head">
                <h4>{item.label}</h4>
              </div>
              <img
                src={src}
                alt={`Current ${item.label.toLowerCase()} photo`}
                className="content-admin-hero-video__preview"
                style={{ aspectRatio, objectFit: "cover" }}
              />
              {uploadsEnabled ? (
                <details className="content-admin-item__edit">
                  <summary>Replace photo</summary>
                  <div className="content-admin-item__edit-body content-admin-hero-video__actions">
                    <AdminUploadForm operation={operation} submitLabel="Replace photo" processingLabel="Saving photo…" className="admin-form">
                      <input type="hidden" name="key" value={item.key} />
                      <label htmlFor={`${item.key}-file`}>Choose replacement photo</label>
                      <input type="file" id={`${item.key}-file`} name="file" accept="image/*" required />
                    </AdminUploadForm>
                    <DetailsCloseButton>Close</DetailsCloseButton>
                  </div>
                </details>
              ) : (
                <p className="content-admin-item__unavailable">Photo upload is unavailable until Cloudinary is configured.</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SharedSettings({ areaList }: { areaList: ContentBlock | undefined }) {
  const areas = parseAreaList(areaList?.value);
  const lines = areas.map((area) => `${area.name}, ${area.state === "North Carolina" ? "NC" : "SC"}`).join("\n");

  return (
    <>
      <section className="admin-card content-admin-section">
        <h3>Business contact details</h3>
        <p className="content-admin-section__intro">Phone, public email, hours, and social links are managed together in Account settings.</p>
        <Link className="admin-btn admin-btn--ghost" href="/admin/account">Open business settings</Link>
      </section>
      <section className="admin-card content-admin-section">
        <h3>Service areas</h3>
        <p className="content-admin-section__intro">These places appear on the public service-area page and homepage coverage section.</p>
        <div className="content-admin-areas" aria-label="Current service areas">
          {areas.map((area) => <span key={`${area.name}-${area.state}`}>{area.name}, {area.state === "North Carolina" ? "NC" : "SC"}</span>)}
        </div>
        <details className="content-admin-item__edit">
          <summary>Edit service areas</summary>
          <div className="content-admin-item__edit-body">
            <ServiceAreaForm lines={lines} rows={Math.max(5, areas.length)} />
          </div>
        </details>
      </section>
    </>
  );
}

export default async function ContentEditorPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const allBlocks = await prisma.contentBlock.findMany({ where: { page }, orderBy: { key: "asc" } });
  const uploadsEnabled = isCloudinaryConfigured();
  const heroVideo = allBlocks.find((block) => block.key === "hero_video");
  const heroImage = allBlocks.find((block) => block.key === "hero_image");
  const areaList = allBlocks.find((block) => block.key === "area_list");
  const blockByKey = Object.fromEntries(allBlocks.map((block) => [block.key, block]));
  const routeImageBlocks = Object.fromEntries(ROUTE_IMAGES.map((item) => [item.key, blockByKey[item.key]]));
  const categoryImageBlocks = Object.fromEntries(CATEGORY_IMAGES.map((item) => [item.key, blockByKey[item.key]]));
  const blocks = allBlocks.filter((block) => {
    if (MANAGED_ELSEWHERE.has(block.key)) return false;
    if (page === "home" && HOME_LEGACY_FIELDS.has(block.key)) return false;
    if (page === "global" && block.key === "area_list") return false;
    return true;
  });
  const groupedBlocks = blocks.reduce<Record<string, ContentBlock[]>>((groups, block) => {
    const group = groupFor(page, block.key);
    (groups[group] ??= []).push(block);
    return groups;
  }, {});

  return (
    <section className="content-admin">
      <h2>Page Content</h2>
      <p className="subtitle">Review what customers see first, then open only the section you need to change.</p>

      <nav className="content-admin__tabs" aria-label="Choose page content to edit">
        {PAGES.map((item) => (
          <Link key={item.id} href={`/admin/content/${item.id}`} className={`admin-btn admin-btn--ghost${page === item.id ? " content-admin__tab--active" : ""}`}>
            {item.label}
          </Link>
        ))}
      </nav>

      {!uploadsEnabled && (
        <div className="admin-flash admin-flash--error">
          Photo and video uploads are unavailable until Cloudinary is configured. Text editing remains available.
        </div>
      )}

      {page === "home" && (
        <>
          <p className="content-admin__notice">Only content used by the current property-plan homepage is shown below. Gallery projects and service details have their own management pages.</p>
          <HeroBackgroundControl imageBlock={heroImage} videoBlock={heroVideo} uploadsEnabled={uploadsEnabled} />
          <ImageSetControl
            title="Property route photos"
            description="Shown one at a time as visitors switch between Lawn Care, Landscaping, Hardscaping, and Maintenance below the hero."
            operation="route-image"
            items={ROUTE_IMAGES}
            blocksByKey={routeImageBlocks}
            uploadsEnabled={uploadsEnabled}
            aspectRatio="4 / 5"
          />
        </>
      )}

      {page === "services" && (
        <ImageSetControl
          title="Service category photos"
          description="Shown on each category's page as the photo linking to the other three service categories."
          operation="category-image"
          items={CATEGORY_IMAGES}
          blocksByKey={categoryImageBlocks}
          uploadsEnabled={uploadsEnabled}
          aspectRatio="16 / 10"
        />
      )}

      {page === "global" ? (
        <SharedSettings areaList={areaList} />
      ) : page === "gallery" ? (
        <>
          {groupedBlocks["Page introduction"] && <ContentSection page={page} title="Page introduction" blocks={groupedBlocks["Page introduction"]} uploadsEnabled={uploadsEnabled} />}
          <section className="admin-card content-admin-section">
            <h3>Gallery projects</h3>
            <p className="content-admin-section__intro">Before-and-after projects and project photos are managed in Gallery.</p>
            <Link href="/admin/gallery" className="admin-btn admin-btn--ghost">Open gallery manager</Link>
          </section>
        </>
      ) : Object.keys(groupedBlocks).length === 0 ? (
        <p className="subtitle">No editable content is used on this page yet.</p>
      ) : (
        Object.entries(groupedBlocks).map(([title, group]) => <ContentSection key={title} page={page} title={title} blocks={group} uploadsEnabled={uploadsEnabled} />)
      )}
    </section>
  );
}
