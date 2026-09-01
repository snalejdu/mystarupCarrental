import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './AccordionGallery.css';

export interface AccordionGalleryItem {
  image: string;
  label?: string;
  link?: string;
  alt?: string;
}

export interface AccordionGalleryProps {
  items?: AccordionGalleryItem[];
  defaultIndex?: number;
  accentColor?: string;
  overlayColor?: string;
  textColor?: string;
  height?: number;
  gap?: number;
  radius?: number;
  expandRatio?: number;
  orientation?: 'horizontal' | 'vertical';
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  trigger?: 'hover' | 'click';
  showLabels?: boolean;
  grayscale?: boolean;
  bezelLess?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: AccordionGalleryItem[] = [
  { image: 'https://picsum.photos/id/1015/900/1200', label: 'Canyon', link: '#' },
  { image: 'https://picsum.photos/id/1018/900/1200', label: 'Ridgeline', link: '#' },
  { image: 'https://picsum.photos/id/1039/900/1200', label: 'Falls', link: '#' },
  { image: 'https://picsum.photos/id/1043/900/1200', label: 'Harbour', link: '#' },
  { image: 'https://picsum.photos/id/1044/900/1200', label: 'Skyline', link: '#' }
];

const AccordionGallery: React.FC<AccordionGalleryProps> = ({
  items = DEFAULT_ITEMS,
  defaultIndex = 2,
  accentColor = '#14b8a6',
  overlayColor = '#060010',
  textColor = '#ffffff',
  height = 460,
  gap = 10,
  radius = 16,
  expandRatio = 0.52,
  orientation = 'horizontal',
  duration = 0.75,
  ease = 'power2.out',
  parallax = 0.45,
  tilt = 6,
  stagger = 0.04,
  trigger = 'hover',
  showLabels = true,
  grayscale = false,
  bezelLess = false,
  className = ''
}) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLElement | null)[]>([]);
  const barRefs = useRef<(HTMLElement | null)[]>([]);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaSizeRef = useRef(320);

  const vertical = orientation === 'vertical';
  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));

  const prefersReduced =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  const applyLayout = useCallback(
    (animate: boolean, activeIdx: number) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const r = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (r * (count - 1)) / (1 - r) : 1;
      const mediaSize = mediaSizeRef.current;
      const dur = animate && !prefersReduced ? duration : 0;

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === activeIdx;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < activeIdx ? tilt : -tilt;
        const rotProp = vertical ? { rotateX: -rot } : { rotateY: rot };

        gsap.to(panel, {
          flexGrow: isActive ? grow : 1,
          ...rotProp,
          duration: dur,
          ease: 'power2.out',
          overwrite: 'auto',
          force3D: true
        });

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, activeIdx - i));
          const shift = drift * parallax * mediaSize * 0.06;
          const gray = grayscale ? (isActive ? 0 : 1) : 0;

          gsap.to(media, {
            xPercent: -50,
            yPercent: -50,
            x: vertical ? 0 : isActive ? 0 : shift,
            y: vertical ? (isActive ? 0 : shift) : 0,
            '--ag-gray': gray,
            '--ag-dim': isActive ? 0 : 0.35,
            duration: dur,
            ease: 'power2.out',
            overwrite: 'auto',
            force3D: true
          });
        }

        if (showLabels && bar && text) {
          if (isActive) {
            gsap.to([bar, text], {
              opacity: 1,
              x: 0,
              duration: dur * 0.8,
              ease: 'power2.out',
              stagger: prefersReduced ? 0 : stagger,
              overwrite: 'auto'
            });
          } else {
            gsap.to([bar, text], {
              opacity: 0,
              x: -12,
              duration: dur * 0.5,
              ease: 'power2.out',
              overwrite: 'auto'
            });
          }
        }
      });
    },
    [
      count,
      expandRatio,
      duration,
      vertical,
      tilt,
      parallax,
      grayscale,
      showLabels,
      stagger,
      prefersReduced
    ]
  );

  const applyLayoutRef = useRef(applyLayout);
  applyLayoutRef.current = applyLayout;

  // Measure element size once on mount / true resize only (Zero layout thrashing on hover)
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let lastWidth = 0;
    const measure = (entries?: ResizeObserverEntry[]) => {
      const entry = entries?.[0];
      const width = entry ? entry.contentRect.width : el.clientWidth;
      if (Math.abs(width - lastWidth) < 2 && lastWidth !== 0) return;
      lastWidth = width;

      const total = vertical ? el.clientHeight : width;
      const usable = Math.max(total - gap * (count - 1), 120);
      const size = Math.max(160, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.35);
      mediaSizeRef.current = size;
      el.style.setProperty('--ag-media-size', `${size}px`);
      applyLayoutRef.current(false, active);
    };

    measure();
    const ro = new ResizeObserver(entries => {
      window.requestAnimationFrame(() => measure(entries));
    });
    ro.observe(el);

    return () => ro.disconnect();
  }, [gap, count, expandRatio, vertical, active]);

  // Apply layout smoothly when active changes without triggering measure reflow
  useEffect(() => {
    applyLayout(true, active);
  }, [active, applyLayout]);

  const handleEnter = (i: number) => {
    if (trigger === 'hover' && i !== active) setActive(i);
  };

  const handleClick = (i: number, e: React.MouseEvent) => {
    if (i !== active) {
      e.preventDefault();
      setActive(i);
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i + 1) % count);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      className={`accordion-gallery${vertical ? ' accordion-gallery--vertical' : ''}${bezelLess ? ' accordion-gallery--bezel-less' : ''}${className ? ` ${className}` : ''}`}
      style={{
        '--ag-accent': accentColor,
        '--ag-overlay': overlayColor,
        '--ag-text': textColor,
        '--ag-gap': `${gap}px`,
        '--ag-radius': `${radius}px`,
        height: vertical ? `${Math.round(height * 1.6)}px` : `${height}px`
      } as React.CSSProperties}
      role="list"
      aria-label="Image accordion gallery"
    >
      {items.map((item, i) => {
        const isActive = i === active;
        const Tag = item.link ? 'a' : 'div';
        return (
          <Tag
            key={i}
            ref={(el: HTMLElement | null) => { panelRefs.current[i] = el; }}
            className={`ag-panel${isActive ? ' ag-panel--active' : ''}`}
            style={{ borderRadius: `${radius}px` }}
            href={item.link || undefined}
            onClick={e => handleClick(i, e)}
            onMouseEnter={() => handleEnter(i)}
            onFocus={() => setActive(i)}
            onKeyDown={e => handleKeyDown(i, e)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? 'true' : undefined}
            aria-label={item.label}
          >
            <span className="ag-panel__frame">
              <span className="ag-panel__media" ref={(el: HTMLElement | null) => { mediaRefs.current[i] = el; }}>
                <img src={item.image} alt={item.alt || item.label || ''} draggable="false" loading="lazy" decoding="async" />
              </span>
              <span className="ag-panel__overlay" aria-hidden="true" />
            </span>
            {showLabels && (
              <span className="ag-panel__label" aria-hidden="true">
                <span className="ag-panel__bar" ref={(el: HTMLElement | null) => { barRefs.current[i] = el; }} />
                <span className="ag-panel__text" ref={(el: HTMLElement | null) => { textRefs.current[i] = el; }}>
                  {item.label}
                </span>
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
};

export default AccordionGallery;
