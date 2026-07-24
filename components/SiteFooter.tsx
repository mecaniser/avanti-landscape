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
              <li><a href="/services#lawn-care">Lawn Care</a></li>
              <li><a href="/services#landscaping">Landscaping</a></li>
              <li><a href="/services#hardscaping">Hardscaping</a></li>
              <li><a href="/services#maintenance">Lawn &amp; Landscape Maintenance</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/areas">Service Areas</a></li>
              <li><a href="/gallery">Gallery</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/contact">Contact</a></li>
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
          <span><a href="/contact">Request a Free Quote</a></span>
        </div>
      </div>
    </footer>
  );
}
