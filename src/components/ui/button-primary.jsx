'use client';

import Link from 'next/link';
import clsx from 'clsx';

export default function ButtonPrimary({ children, href, size = 'md', className = '', ...props }) {
  const sizeStyles = {
    xs: 'px-3 py-1 text-xs',
    sm: 'px-3 py-2 text-xs',
    md: 'px-4.5 py-4 text-xs',
    lg: 'px-5 py-4 text-sm',
    xl: 'px-6.5 py-5 text-sm',
  };

  const baseStyles =
    'inline-block cursor-pointer rounded-lg bg-slate-500 text-white uppercase shadow-xs hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 font-bold px-6 py-2 min-w-[10rem] text-center';

  const combinedClassName = clsx(baseStyles, sizeStyles[size], className);

  if (href) {
    return (
      <Link href={href} className={combinedClassName} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={combinedClassName} {...props}>
      {children}
    </button>
  );
}

