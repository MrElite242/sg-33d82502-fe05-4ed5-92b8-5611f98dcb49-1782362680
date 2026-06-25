import { cn } from "@/lib/utils";
import { Html, Head, Main, NextScript } from "next/document";
import { SEOElements } from "@/components/SEO";

export default function Document() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Canna Blaze 360",
    "description": "All-in-one cannabis management ecosystem powering the future of legal cannabis",
    "url": "https://canablaze360.softgen.ai",
    "logo": "https://canablaze360.softgen.ai/canna-blaze-360-logo.png",
    "foundingDate": "2026",
    "industry": [
      "Cannabis Technology",
      "Healthcare Technology",
      "Supply Chain Management"
    ],
    "areaServed": "International",
    "serviceType": [
      "Cannabis Cultivation Management",
      "Medical Cannabis Prescription Management",
      "Pharmacy Fulfillment",
      "Compliance & Licensing",
      "Seed-to-Sale Tracking"
    ]
  };

  return (
    <Html lang="en">
      <Head>
        <SEOElements />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/*
          CRITICAL: DO NOT REMOVE THIS SCRIPT
          The Softgen AI monitoring script is essential for core app functionality.
          The application will not function without it.
        */}
        <script
          src="https://cdn.softgen.ai/script.js"
          async
          data-softgen-monitoring="true"
        />
      </Head>
      <body
        className={cn(
          "min-h-screen w-full scroll-smooth bg-background text-foreground antialiased"
        )}
      >
        <Main />
        <NextScript />

        {/* Visual Editor Script */}
        {process.env.NODE_ENV === "development" && (
          <script
            src="https://cdn.softgen.dev/visual-editor.min.js"
            async
            data-softgen-visual-editor="true"
          />
        )}
      </body>
    </Html>
  );
}
