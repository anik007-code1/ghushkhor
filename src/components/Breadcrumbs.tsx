import { useEffect } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { BreadcrumbItem } from '../types.ts';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (url: string) => void;
}

export default function Breadcrumbs({ items, onNavigate }: BreadcrumbsProps) {
  // Inject Schema.org BreadcrumbList JSON-LD into head
  useEffect(() => {
    const origin = window.location.origin;
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${origin}${item.url}`,
      })),
    };

    const scriptId = 'schema-breadcrumb-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schema);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, [items]);

  return (
    <nav aria-label="ব্রেডক্রাম্বস" className="py-2.5 px-3 bg-stone-100/80 rounded-lg text-sm text-stone-600 mb-6 border border-stone-200">
      <ol className="flex items-center flex-wrap gap-1.5 list-none m-0 p-0">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.url + idx} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" aria-hidden="true" />}
              {idx === 0 && <Home className="w-3.5 h-3.5 text-stone-500 mr-0.5 inline" aria-hidden="true" />}
              {isLast ? (
                <span className="font-semibold text-stone-900 line-clamp-1 max-w-xs md:max-w-md" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate(item.url)}
                  className="hover:text-red-700 hover:underline transition-colors focus:outline-none focus:ring-1 focus:ring-red-600 rounded px-1"
                >
                  {item.name}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
