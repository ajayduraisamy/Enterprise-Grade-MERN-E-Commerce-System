import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}

const SITE_NAME = "LuxeCart";
const DEFAULT_DESC = "Premium e-commerce platform for luxury products. Shop exclusive collections curated just for you.";
const DEFAULT_IMAGE = "/og-image.png";

export default function SEO({ title, description, image, url, type = "website" }: SEOProps) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Premium Shopping Experience`;
    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || DEFAULT_DESC} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || DEFAULT_DESC} />
            <meta property="og:image" content={image || DEFAULT_IMAGE} />
            <meta property="og:url" content={url || window.location.href} />
            <meta property="og:type" content={type} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || DEFAULT_DESC} />
            <meta name="twitter:image" content={image || DEFAULT_IMAGE} />
            <link rel="canonical" href={url || window.location.href} />
        </Helmet>
    );
}
