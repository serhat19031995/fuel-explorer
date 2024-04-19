'use client';
import { ToggleGroup } from '@fuels/ui';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export enum ViewModes {
  Simple = 'simple',
  Advanced = 'advanced',
}

export function ViewMode() {
  const { mode } = useParams<{ mode: ViewModes }>();

  return (
    <ToggleGroup type="single" defaultValue={mode} aria-label="View mode">
      <ToggleGroup.Item value="simple" aria-label="Simple view" asChild>
        <Link prefetch href={`./${ViewModes.Simple}`}>
          Simple
        </Link>
      </ToggleGroup.Item>
      <ToggleGroup.Item value="advanced" aria-label="Advanced view" asChild>
        <Link prefetch href={`./${ViewModes.Advanced}`}>
          Advanced
        </Link>
      </ToggleGroup.Item>
    </ToggleGroup>
  );
}
