'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientSideOnlyProps {
  children: ReactNode;
}

export default function ClientSideOnly({ children }: ClientSideOnlyProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
} 