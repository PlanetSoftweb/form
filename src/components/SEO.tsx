import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  formName?: string;
}

export const SEO = ({ 
  title = 'AI FormBuilder - Create Forms Instantly with AI',
  description = 'Revolutionary AI-powered form builder. Generate professional forms in seconds using AI or customize with our intuitive drag-and-drop builder. No coding required.',
  image = '/og-image.png',
  type = 'website',
  formName
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    const finalTitle = formName ? `${formName} | AI FormBuilder` : title;
    document.title = finalTitle;

    const metaTags = [
      { name: 'description', content: description },
      { property: 'og:title', content: finalTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: currentUrl },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: finalTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
      { name: 'keywords', content: 'AI form builder, AI-powered forms, form generator, smart forms, online forms, survey builder, AI formbuilder' },
      { name: 'author', content: 'PlanetSoftweb' },
      { name: 'robots', content: 'index, follow' }
    ];

    metaTags.forEach(({ name, property, content }) => {
      const attr = name ? 'name' : 'property';
      const value = name || property;
      let element = document.querySelector(`meta[${attr}="${value}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, value!);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    });

    const canonicalLink = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', currentUrl);
    if (!canonicalLink.parentNode) {
      document.head.appendChild(canonicalLink);
    }

  }, [title, description, image, type, currentUrl, formName]);

  return null;
};

export const updateFavicon = (text: string, bgColor: string = '#3B82F6') => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 64, 64);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const firstLetter = text.charAt(0).toUpperCase();
    ctx.fillText(firstLetter, 32, 32);
    
    const faviconUrl = canvas.toDataURL('image/png');
    
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconUrl;
  }
};
