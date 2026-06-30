export interface PublishedReflection {
  id: string;
  title: string;
  body: string;
  date: string;
  provider: string | null;
}

export function buildArtifactsUrl(base: string): string;

export function mapArtifactsToReflections(artifacts: unknown): PublishedReflection[];
