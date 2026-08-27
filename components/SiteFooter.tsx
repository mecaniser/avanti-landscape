import Link from "next/link";
import Image from "next/image";
import { getGlobalContent } from "@/lib/content";
import { SERVICE_CATEGORIES } from "@/lib/services";

export default async function SiteFooter() {
  const g = await getGlobalContent();
  const phone = g.phone ?? "980-328-7141";
  const phoneTel = g.phone_tel ?? "9803287141";
  const email = g.email ?? "avantilandscaping1@gmail.com";
  const facebook = g.facebook_url ?? "#";
  const instagram = g.instagram_url ?? "#";

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              <Image src="/assets/avanti-wordmark.png" alt="Avanti Lawn & Landscaping"
                width={146} height={68} sizes="146px" />
            </div>
            <p>Locally owned lawn care, landscaping, and hardscaping serving Waxhaw, NC and the surrounding communities.</p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              {SERVICE_CATEGORIES.map((cat) => (
                <li key={cat.slug}><Link href={`/services/${cat.slug}`}>{cat.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/areas">Service Areas</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href={`tel:${phoneTel}`}>{phone}</a></li>
              <li><a href={`mailto:${email}`}>{email}</a></li>
              <li>Waxhaw, NC</li>
              <li>
                <a href={facebook} target="_blank" rel="noopener">Facebook</a> ·{" "}
                <a href={instagram} target="_blank" rel="noopener">Instagram</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Avanti Landscaping LLC. All rights reserved.</span>
          <span>
            <Link href="/privacy">Privacy</Link>
            <span className="footer-separator">·</span>
            <Link href="/terms">Terms</Link>
            <span className="footer-separator">·</span>
            <Link href="/contact">Request a Free Quote</Link>
            <span className="footer-separator">·</span>
            <a href="/admin/login" rel="nofollow">Staff Login</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
