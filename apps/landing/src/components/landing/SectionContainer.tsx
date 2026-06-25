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
      className={['mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-20 md:px-8 md:py-28', className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </section>
  );
}
