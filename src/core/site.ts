import { headers } from 'next/headers';
import type { Metadata } from 'next';
import config from './config';

// -----------------------------------------------------------------------------
// Interfaces & Types
// -----------------------------------------------------------------------------

export interface BrandConfig {
  name: string;
  logoUrl: string;
  faviconUrl: string;
  themeColor: string;
  appUrl: string;
  domain: string;
  siteDescription: string;
  logoText: string;
  maintenance: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  socialLinks: FooterLink[];
  legalLinks: FooterLink[];
  companyLinks: FooterLink[];
  quickLinks: FooterLink[];
  resources: FooterLink[];
  supportEmail: string;
  contactEmail: string;
  telegram: string;
  copyright: string;
}

export interface NavigationConfig {
  logo: string;
  sticky: boolean;
  showLogin: boolean;
  showRegister: boolean;
  showDashboard: boolean;
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  background: string;
  card: string;
  border: string;
  radius: string;
  animation: boolean;
}

export interface SupportConfig {
  supportEmail: string;
  telegram: string;
  responseTime: string;
}

export interface AnnouncementConfig {
  enabled: boolean;
  text: string;
  color: string;
}

// -----------------------------------------------------------------------------
// Domain & Naming Helpers
// -----------------------------------------------------------------------------

/**
 * Retrieves the current domain from request headers.
 */
export async function getDomain(): Promise<string> {
  try {
    const reqHeaders = await headers();
    const forwardedHost = reqHeaders.get('x-forwarded-host');
    const host = reqHeaders.get('host');
    
    return forwardedHost || host || config.DEFAULT_DOMAIN || 'localhost';
  } catch (error) {
    return config.DEFAULT_DOMAIN || 'localhost';
  }
}

/**
 * Generates the site name automatically based on the domain.
 * e.g., localhost -> ShortZlinks, example.com -> ShortZlinks.com
 */
export async function getSiteName(): Promise<string> {
  const domain = await getDomain();
  const cleanDomain = domain.split(':')[0].toLowerCase();

  if (cleanDomain === 'localhost' || cleanDomain === '127.0.0.1') {
    return 'ShortZlinks';
  }

  const parts = cleanDomain.split('.');
  if (parts.length > 1) {
    const extension = parts.slice(1).join('.');
    return `ShortZlinks.${extension}`;
  }

  return 'ShortZlinks';
}

/**
 * Generates a formatted page title.
 */
export async function getSiteTitle(pageName?: string): Promise<string> {
  const siteName = await getSiteName();
  return pageName ? `${pageName} | ${siteName}` : siteName;
}

/**
 * Generates dynamic copyright text.
 */
export async function getCopyrightText(): Promise<string> {
  const siteName = await getSiteName();
  const currentYear = new Date().getFullYear();
  return `© ${currentYear} ${siteName}. All rights reserved.`;
}

// -----------------------------------------------------------------------------
// Configuration Helpers
// -----------------------------------------------------------------------------

/**
 * Retrieves the branding configuration and dynamically determines the protocol.
 */
export async function getBrandConfig(): Promise<BrandConfig> {
  const siteName = await getSiteName();
  const domain = await getDomain();
  
  let protocol = 'https';
  try {
    const reqHeaders = await headers();
    const forwardedProto = reqHeaders.get('x-forwarded-proto');
    if (forwardedProto) {
      protocol = forwardedProto.split(',')[0].trim();
    } else if (domain.includes('localhost') || domain.includes('127.0.0.1')) {
      protocol = 'http';
    }
  } catch (error) {
    if (domain.includes('localhost') || domain.includes('127.0.0.1')) {
      protocol = 'http';
    }
  }

  const appUrl = `${protocol}://${domain}`;

  return {
    name: siteName,
    logoUrl: config.LOGO_URL || '/images/logo.png',
    faviconUrl: config.FAVICON_URL || '/favicon.ico',
    themeColor: config.THEME_COLOR || '#4F46E5',
    appUrl,
    domain,
    siteDescription: config.SITE_DESCRIPTION || `Shorten, manage, and track your links with ${siteName}.`,
    logoText: siteName,
    maintenance: config.MAINTENANCE_MODE ?? false,
  };
}

/**
 * Retrieves the footer configuration with default links.
 */
export async function getFooterConfig(): Promise<FooterConfig> {
  const copyright = await getCopyrightText();
  
  return {
    socialLinks: config.SOCIAL_LINKS || [
      { label: 'Twitter', href: '#' },
      { label: 'Facebook', href: '#' },
    ],
    legalLinks: config.LEGAL_LINKS || [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Cookies', href: '/cookies' },
    ],
    companyLinks: config.COMPANY_LINKS || [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    quickLinks: config.QUICK_LINKS || [
      { label: 'Home', href: '/' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Create Link', href: '/dashboard/create' },
      { label: 'Analytics', href: '/dashboard/analytics' },
      { label: 'Withdraw', href: '/dashboard/wallet' },
    ],
    resources: config.RESOURCES_LINKS || [
      { label: 'API Docs', href: '/api-docs' },
      { label: 'Support', href: '/support' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Blog', href: '/blog' },
      { label: 'Status', href: '/status' },
    ],
    supportEmail: config.SUPPORT_EMAIL || 'support@localhost',
    contactEmail: config.CONTACT_EMAIL || 'contact@localhost',
    telegram: config.TELEGRAM_URL || 'https://t.me/shortzlinks',
    copyright,
  };
}

/**
 * Retrieves the navigation settings.
 */
export async function getNavigationConfig(): Promise<NavigationConfig> {
  return {
    logo: config.LOGO_URL || '/images/logo.png',
    sticky: config.NAV_STICKY ?? true,
    showLogin: config.NAV_SHOW_LOGIN ?? true,
    showRegister: config.NAV_SHOW_REGISTER ?? true,
    showDashboard: config.NAV_SHOW_DASHBOARD ?? true,
  };
}

/**
 * Retrieves the UI theme configuration.
 */
export async function getThemeConfig(): Promise<ThemeConfig> {
  return {
    primaryColor: config.THEME_PRIMARY || '#4F46E5',
    secondaryColor: config.THEME_SECONDARY || '#6B7280',
    accentColor: config.THEME_ACCENT || '#3B82F6',
    background: config.THEME_BACKGROUND || '#FFFFFF',
    card: config.THEME_CARD || '#F9FAFB',
    border: config.THEME_BORDER || '#E5E7EB',
    radius: config.THEME_RADIUS || '0.5rem',
    animation: config.THEME_ANIMATION ?? true,
  };
}

/**
 * Retrieves the support configuration.
 */
export async function getSupportConfig(): Promise<SupportConfig> {
  return {
    supportEmail: config.SUPPORT_EMAIL || 'support@localhost',
    telegram: config.TELEGRAM_URL || 'https://t.me/shortzlinks',
    responseTime: config.SUPPORT_RESPONSE_TIME || '24-48 hours',
  };
}

/**
 * Retrieves the announcement banner configuration.
 */
export async function getAnnouncementConfig(): Promise<AnnouncementConfig> {
  return {
    enabled: config.ANNOUNCEMENT_ENABLED ?? false,
    text: config.ANNOUNCEMENT_TEXT || 'Welcome to our updated platform!',
    color: config.ANNOUNCEMENT_COLOR || '#3B82F6',
  };
}

/**
 * Generates strict Next.js App Router Metadata.
 */
export async function getMetaData(
  pageTitle?: string,
  description?: string,
  keywords?: string[]
): Promise<Metadata> {
  const brand = await getBrandConfig();
  const title = pageTitle ? `${pageTitle} | ${brand.name}` : brand.name;
  const finalDescription = description || brand.siteDescription;

  return {
    title,
    description: finalDescription,
    applicationName: brand.name,
    creator: brand.name,
    publisher: brand.name,
    category: 'URL Shortener',
    keywords: keywords || ['url shortener', 'link management', 'short links', brand.name],
    metadataBase: new URL(brand.appUrl),
    openGraph: {
      title,
      description: finalDescription,
      siteName: brand.name,
      url: brand.appUrl,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: finalDescription,
    },
    icons: {
      icon: brand.faviconUrl,
      shortcut: brand.faviconUrl,
      apple: config.APPLE_ICON_URL || '/apple-touch-icon.png',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: brand.appUrl,
    },
    manifest: '/site.webmanifest',
  };
}
