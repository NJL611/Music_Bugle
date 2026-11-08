// next/link with prefetch off. Headless bots on residential proxies turned every page load into dozens of viewport prefetches.
// Every internal link imports this instead of next/link. Pages are edge-cached, so an unprefetched click still loads fast.

import NextLink from 'next/link';
import type { ComponentProps } from 'react';

export default function Link(props: ComponentProps<typeof NextLink>) {
  return <NextLink prefetch={false} {...props} />;
}
