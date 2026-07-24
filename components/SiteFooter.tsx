import Link from "next/link";
import { getGlobalContent } from "@/lib/content";

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
              <img src="/assets/logo.svg" alt="Avanti Landscaping logo" />
              <strong>Avanti Landscaping</strong>
            </div>
            <p>Locally owned lawn care, landscaping, and hardscaping serving Waxhaw, NC and the surrounding communities.</p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link href="/services#lawn-care">Lawn Care</Link></li>
              <li><Link href="/services#landscaping">Landscaping</Link></li>
              <li><Link href="/services#hardscaping">Hardscaping</Link></li>
              <li><Link href="/services#maintenance">Lawn &amp; Landscape Maintenance</Link></li>
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
            <Link href="/contact">Request a Free Quote</Link>
            <span style={{ margin: "0 10px", opacity: 0.4 }}>·</span>
            <Link href="/admin/login">Staff Login</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
