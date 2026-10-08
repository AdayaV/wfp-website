const RESPONSIVE_WIDTHS = [480, 768, 1200, 1600];
const MACHINE_IMAGE_SIZES = '(max-width: 760px) calc(100vw - 32px), (max-width: 1100px) 48vw, 580px';

export interface MachineImageAttributes {
  src: string;
  srcset?: string;
  sizes?: string;
}

// Transform only the microCMS image CDN. External and local image URLs stay intact.
export function getMachineImageAttributes(source: string): MachineImageAttributes {
  let url: URL;
  try {
    url = new URL(source);
  } catch {
    return { src: source };
  }
  if (url.protocol !== 'https:' || url.hostname !== 'images.microcms-assets.io') return { src: source };

  const atWidth = (width: number) => {
    const imageUrl = new URL(url);
    // Keep any existing crop, focal point, quality and other unrelated parameters.
    imageUrl.searchParams.set('auto', 'compress');
    imageUrl.searchParams.set('fm', 'webp');
    imageUrl.searchParams.set('w', String(width));
    return imageUrl.toString();
  };

  return {
    src: atWidth(1440),
    srcset: RESPONSIVE_WIDTHS.map((width) => `${atWidth(width)} ${width}w`).join(', '),
    sizes: MACHINE_IMAGE_SIZES,
  };
}
