import Head from 'next/head';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any>;
}

// SEO elements that can be used in _document.tsx (returns JSX without Head wrapper)
export function SEOElements({
  title = "Canna Blaze 360",
  description = "Canna Blaze 360™ is the all-in-one cannabis management ecosystem powering the future of legal cannabis. From cultivation, manufacturing, testing, transportation, and retail sales to medical prescriptions, pharmacy fulfillment, patient management, compliance, licensing, and government oversight, Canna Blaze 360 delivers complete seed-to-sale visibility. Built for operators, healthcare providers, researchers, and regulators, it transforms complexity into control, compliance, and growth.",
  image = "/og-image.png",
  url = "https://cannablaze360.com",
  type = "website",
  jsonLd,
}: SEOProps) {
  const defaultJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Canna Blaze 360",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "operatingSystem": "Web Browser",
    "description": description,
    "url": url,
    "image": image,
    "provider": {
      "@type": "Organization",
      "name": "Canna Blaze 360",
      "url": url
    }
  };

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Canna Blaze 360" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Canna Blaze 360" />
      <meta name="keywords" content="cannabis tracking, seed to sale, cannabis compliance, cannabis cultivation, cannabis retail, medical cannabis, cannabis ERP, cannabis software" />
      
      {/* Viewport and mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd || defaultJsonLd)
        }}
      />
    </>
  );
}

// Default SEO component for use in pages/_app.tsx or individual pages (uses next/head)
export function SEO(props: SEOProps) {
  return (
    <Head>
      <SEOElements {...props} />
    </Head>
  );
}