import Link from 'next/link';

export default function CTAButton({ text, href, primary = true }) {
  const buttonClass = primary ? 'btn-primary' : 'btn-secondary';

  if (href.startsWith('http')) {
    return (
      <a
        href={href}
        className={buttonClass}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    );
  }

  return (
    <Link href={href} className={buttonClass}>
      {text}
    </Link>
  );
}
