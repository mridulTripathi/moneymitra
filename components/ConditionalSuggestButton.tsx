'use client';
import { usePathname } from 'next/navigation';
import { SuggestToolButton } from './SuggestToolButton';

export function ConditionalSuggestButton() {
  const pathname = usePathname();
  if (pathname === '/') return null; // homepage has the section
  return <SuggestToolButton sourcePage={pathname} />;
}
