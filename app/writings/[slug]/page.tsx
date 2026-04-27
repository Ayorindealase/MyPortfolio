import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

function formatPublishedDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.writing.findFirst({
    where: { slug, isPublished: true },
  });
  if (!article) notFound();
  if (article.type === 'gallery') notFound();
  if (article.type === 'external') redirect(article.content);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link
        href="/writings"
        className="inline-flex items-center gap-2 font-mono-hud text-[10px] tracking-[2px] text-[var(--text-dim)] hover:text-cyan transition-colors mb-8"
      >
        ← TRANSMISSIONS
      </Link>

      <div className="hud-card p-8 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-mono-hud text-[9px] tracking-[2px] text-cyan uppercase">{article.type}</span>
          <span className="font-mono-hud text-[9px] text-[var(--text-dim)]">{formatPublishedDate(article.publishedDate)}</span>
          {article.readingTime && (
            <span className="font-mono-hud text-[9px] text-[var(--text-dim)]">{article.readingTime} MIN READ</span>
          )}
        </div>
        <h1 className="font-oxanium text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
          {article.title}
        </h1>
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map((tag) => (
            <span key={tag} className="hud-tag" style={{ color: 'var(--text-dim)', borderColor: 'var(--glass-border)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="hud-card p-8 prose-custom">
        <div
          className="font-body text-[15px] leading-[1.8] text-[var(--text)]"
          dangerouslySetInnerHTML={{
            __html: article.content
              .trim()
              .split('\n')
              .map((line) => {
                if (line.startsWith('## ')) return `<h2 class="font-oxanium text-xl font-bold text-white mt-8 mb-4 uppercase tracking-[2px]">${line.slice(3)}</h2>`;
                if (line.startsWith('**') && line.endsWith('**')) return `<p class="font-body font-semibold text-white mt-4 mb-2">${line.slice(2, -2)}</p>`;
                if (line.startsWith('- ')) return `<li class="ml-4 mb-1">${line.slice(2)}</li>`;
                if (line.startsWith('\`\`\`')) return line === '\`\`\`' ? '</code></pre>' : `<pre class="bg-[rgba(0,243,255,0.05)] border border-[rgba(0,243,255,0.15)] rounded-sm p-4 my-4 overflow-x-auto font-mono-hud text-[12px] text-cyan"><code>`;
                if (line === '') return '<br/>';
                return `<p class="mb-3">${line}</p>`;
              })
              .join('')
          }}
        />
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/writings"
          className="font-mono-hud text-[9px] tracking-[2px] px-4 py-2 inline-block transition-all hover:bg-[rgba(0,243,255,0.08)]"
          style={{ color: 'var(--cyan)', border: '1px solid var(--cyan)', borderRadius: '2px' }}
        >
          ← BACK TO TRANSMISSIONS
        </Link>
      </div>
    </div>
  );
}
