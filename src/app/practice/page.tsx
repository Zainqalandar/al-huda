import Link from 'next/link';
import { Wrench } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PracticePage() {
  return (
    <div className="pb-16 pt-10" data-slot="page-shell">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-3xl font-display">
            <Wrench className="size-6 text-[var(--color-accent)]" /> Practice Sandbox
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-[var(--color-muted-text)]">
          <p>
            This route is reserved for local experimentation and not part of the core
            Islamic product experience.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Return to home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
