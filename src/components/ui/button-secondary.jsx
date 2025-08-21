'use client';

import Link from 'next/link';
import clsx from 'clsx';

export default function ButtonSecondary({ children, href, size = 'md', className = '', ...props }) {
  const sizeStyles = {
    xs: 'px-2 py-2 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm', // updated
    lg: 'px-5 py-3 text-base',
    xl: 'px-6 py-3 text-base',
  };

  const baseStyles =
    'inline-block cursor-pointer rounded-lg bg-slate-700 text-white font-semibold text-center shadow-sm hover:bg-slate-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700 min-w-[8rem]';

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
