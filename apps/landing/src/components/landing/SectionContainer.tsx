import { ReactNode } from 'react';

interface SectionContainerProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export function SectionContainer({ children, id, className }: SectionContainerProps) {
  return (
    <section
      id={id}
      className={[
        'mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-18 md:px-8 md:py-24 xl:max-w-7xl',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </section>
  );
}
