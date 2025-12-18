import { useState, useEffect } from 'react';
import './SlidesPage.css';

interface Slide {
  title: string;
  content: string;
  type: 'title' | 'content' | 'two-column' | 'three-column';
}

export default function SlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load and parse both markdown files
    Promise.all([
      fetch('/slides/SLIDES.md').then(res => res.text()),
      fetch('/slides/GOOGLE_SLIDES_CONTENT.md').then(res => res.text()),
    ])
      .then(([slidesContent, googleContent]) => {
        const parsedSlides = parseSlides(slidesContent, googleContent);
        setSlides(parsedSlides);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading slides:', error);
        setLoading(false);
      });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Home') {
        setCurrentSlide(0);
      } else if (e.key === 'End') {
        setCurrentSlide(slides.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slides.length]);

  const parseSlides = (slidesContent: string, googleContent: string): Slide[] => {
    const parsed: Slide[] = [];

    // Parse SLIDES.md first (preferred source)
    const slidesMatches = Array.from(slidesContent.matchAll(/## Slide \d+: (.+?)(?=## Slide \d+:|$)/gs));
    
    if (slidesMatches.length > 0) {
      for (let i = 0; i < slidesMatches.length; i++) {
        const match = slidesMatches[i];
        const slideContent = match[1].trim();
        
        // Extract title
        let title = 'Untitled';
        const titleMatch = slideContent.match(/### Title: \*\*(.+?)\*\*/);
        if (titleMatch) {
          title = titleMatch[1];
        }
        
        // Determine slide type
        let type: Slide['type'] = 'content';
        if (i === 0 && (slideContent.includes('Introduction') || slideContent.includes('Title'))) {
          type = 'title';
        } else if (slideContent.includes('Two Agent Cards') || (slideContent.includes('Left') && slideContent.includes('Right'))) {
          type = 'two-column';
        } else if (slideContent.includes('Three') && slideContent.includes('Column')) {
          type = 'three-column';
        }

        parsed.push({
          title,
          content: slideContent,
          type,
        });
      }
    } else {
      // Fallback to GOOGLE_SLIDES_CONTENT.md
      const googleMatches = Array.from(googleContent.matchAll(/## SLIDE \d+: (.+?)(?=## SLIDE \d+:|$)/gs));
      
      for (let i = 0; i < googleMatches.length; i++) {
        const match = googleMatches[i];
        const slideContent = match[1].trim();
        
        // Extract title
        let title = 'Untitled';
        const titleMatch = slideContent.match(/\*\*Title \(.+?\):\*\*\s*```\s*(.+?)\s*```/s);
        if (titleMatch) {
          title = titleMatch[1].trim();
        } else {
          // Try alternative title format
          const altTitleMatch = slideContent.match(/### Layout: (.+?)\n\n\*\*Title/);
          if (altTitleMatch) {
            const titleBlock = slideContent.match(/\*\*Title[^*]+\*\*/);
            if (titleBlock) {
              title = titleBlock[0].replace(/\*\*/g, '').replace(/Title \(.+?\):\s*/, '').trim();
            }
          }
        }
        
        // Determine slide type
        let type: Slide['type'] = 'content';
        if (slideContent.includes('Title Only') || slideContent.includes('Title Slide')) {
          type = 'title';
        } else if (slideContent.includes('Two Content') || (slideContent.includes('Left Column') && slideContent.includes('Right Column'))) {
          type = 'two-column';
        } else if (slideContent.includes('Three Columns') || (slideContent.includes('Column 1') && slideContent.includes('Column 2') && slideContent.includes('Column 3'))) {
          type = 'three-column';
        }

        parsed.push({
          title,
          content: slideContent,
          type,
        });
      }
    }

    return parsed;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const formatContent = (content: string): string => {
    if (!content) return '';
    
    // Remove markdown metadata lines
    let cleaned = content
      .replace(/### (?:Title|Layout):.*?\n/g, '')
      .replace(/\*\*Title.*?\*\*/g, '')
      .replace(/```[\s\S]*?```/g, (match) => {
        // Keep code blocks but clean them
        const code = match.replace(/```/g, '').trim();
        // Remove language identifiers
        return `\n<pre><code>${code.replace(/^\w+\n/, '')}</code></pre>\n`;
      });

    // Convert markdown to HTML
    let formatted = cleaned
      // Bold text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Inline code (after code blocks are processed)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Headers
      .replace(/^### (.+?)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+?)$/gm, '<h2>$1</h2>')
      // Bullet points (various formats)
      .replace(/^[-•*]\s+(.+?)$/gm, '<li>$1</li>')
      // Numbered lists
      .replace(/^\d+\.\s+(.+?)$/gm, '<li>$1</li>')
      // Checkmarks
      .replace(/✅/g, '<span class="checkmark">✓</span>')
      // Emojis and special formatting
      .replace(/([🤖🛒🎯📊📚🛍️⚖️🧪🛡️🔒🔄⚡🎯📊🌐])/g, '<span class="emoji">$1</span>');

    // Wrap consecutive list items in ul/ol
    formatted = formatted.replace(/(<li>.*?<\/li>(?:\s*<li>.*?<\/li>)*)/gs, (match) => {
      if (!match.includes('<ul>') && !match.includes('<ol>')) {
        return `<ul>${match}</ul>`;
      }
      return match;
    });

    // Convert line breaks (but preserve pre blocks)
    const parts = formatted.split(/(<pre>[\s\S]*?<\/pre>)/);
    formatted = parts.map((part) => {
      if (part.startsWith('<pre>')) {
        return part;
      }
      return part.replace(/\n/g, '<br />');
    }).join('');

    // Clean up multiple br tags
    formatted = formatted.replace(/(<br \/>\s*){3,}/g, '<br /><br />');

    return formatted;
  };

  const extractColumnContent = (content: string, columnLabel: string): string => {
    const regex = new RegExp(`${columnLabel}[\\s\\S]*?(?=${columnLabel}|$)`, 'i');
    const match = content.match(regex);
    if (match) {
      // Remove the label and clean up
      return match[0]
        .replace(new RegExp(`^${columnLabel}[^:]*:`, 'i'), '')
        .trim();
    }
    return '';
  };

  const renderSlide = (slide: Slide) => {
    if (slide.type === 'title') {
      // Extract subtitle and key points for title slide
      const subtitleMatch = slide.content.match(/(?:Subtitle|### Subtitle):\s*\*\*(.+?)\*\*/);
      const subtitle = subtitleMatch ? subtitleMatch[1] : '';
      const keyPointsMatch = slide.content.match(/\*\*Key Points:\*\*([\s\S]*?)(?=\*\*Visual:|$)/);
      const keyPoints = keyPointsMatch ? keyPointsMatch[1] : '';
      
      return (
        <div className="slide-title">
          <h1>{slide.title}</h1>
          {subtitle && <h2 className="slide-subtitle">{subtitle}</h2>}
          {keyPoints && (
            <div className="slide-key-points" dangerouslySetInnerHTML={{ __html: formatContent(keyPoints) }} />
          )}
          <div className="slide-title-content" dangerouslySetInnerHTML={{ __html: formatContent(slide.content) }} />
        </div>
      );
    }

    if (slide.type === 'two-column') {
      // Try to extract left and right column content
      const leftContent = extractColumnContent(slide.content, '(?:Left (?:Side|Column)|Left Column)') || 
                         extractColumnContent(slide.content, 'Left');
      const rightContent = extractColumnContent(slide.content, '(?:Right (?:Side|Column)|Right Column)') ||
                          extractColumnContent(slide.content, 'Right');
      
      // If extraction failed, try splitting by common patterns
      let left = leftContent;
      let right = rightContent;
      
      if (!left && !right) {
        // Try splitting by agent cards or other patterns
        const parts = slide.content.split(/(?:General Info Agent|Order Agent|🛒|📚)/);
        if (parts.length >= 3) {
          left = parts[1] + (parts[0].includes('General') ? parts[0] : '');
          right = parts[2] + (parts[0].includes('Order') ? parts[0] : '');
        }
      }
      
      // Fallback: split content in half
      if (!left && !right) {
        const lines = slide.content.split('\n').filter(l => l.trim() && !l.match(/^#|^###|^\*\*Title/));
        const mid = Math.ceil(lines.length / 2);
        left = lines.slice(0, mid).join('\n');
        right = lines.slice(mid).join('\n');
      }

      return (
        <div className="slide-two-column">
          <h2>{slide.title}</h2>
          <div className="slide-columns">
            <div className="slide-column" dangerouslySetInnerHTML={{ __html: formatContent(left) }} />
            <div className="slide-column" dangerouslySetInnerHTML={{ __html: formatContent(right) }} />
          </div>
        </div>
      );
    }

    if (slide.type === 'three-column') {
      const col1 = extractColumnContent(slide.content, 'Column 1') || extractColumnContent(slide.content, '(?:Column 1|1\\.)');
      const col2 = extractColumnContent(slide.content, 'Column 2') || extractColumnContent(slide.content, '(?:Column 2|2\\.)');
      const col3 = extractColumnContent(slide.content, 'Column 3') || extractColumnContent(slide.content, '(?:Column 3|3\\.)');
      
      // Fallback: split into three parts
      if (!col1 && !col2 && !col3) {
        const lines = slide.content.split('\n').filter(l => l.trim() && !l.match(/^#|^###|^\*\*Title/));
        const third = Math.ceil(lines.length / 3);
        const col1Content = lines.slice(0, third).join('\n');
        const col2Content = lines.slice(third, third * 2).join('\n');
        const col3Content = lines.slice(third * 2).join('\n');
        
        return (
          <div className="slide-three-column">
            <h2>{slide.title}</h2>
            <div className="slide-columns">
              <div className="slide-column" dangerouslySetInnerHTML={{ __html: formatContent(col1Content) }} />
              <div className="slide-column" dangerouslySetInnerHTML={{ __html: formatContent(col2Content) }} />
              <div className="slide-column" dangerouslySetInnerHTML={{ __html: formatContent(col3Content) }} />
            </div>
          </div>
        );
      }

      return (
        <div className="slide-three-column">
          <h2>{slide.title}</h2>
          <div className="slide-columns">
            <div className="slide-column" dangerouslySetInnerHTML={{ __html: formatContent(col1) }} />
            <div className="slide-column" dangerouslySetInnerHTML={{ __html: formatContent(col2) }} />
            <div className="slide-column" dangerouslySetInnerHTML={{ __html: formatContent(col3) }} />
          </div>
        </div>
      );
    }

    return (
      <div className="slide-content">
        <h2>{slide.title}</h2>
        <div className="slide-body" dangerouslySetInnerHTML={{ __html: formatContent(slide.content) }} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="slides-loading">
        <div className="loading-spinner"></div>
        <p>Loading slides...</p>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="slides-error">
        <p>No slides found. Please ensure the slide files are in the /slides folder.</p>
      </div>
    );
  }

  return (
    <div className="slides-container">
      <div className="slide-wrapper">
        {renderSlide(slides[currentSlide])}
      </div>

      <div className="slides-navigation">
        <button
          className="slide-nav-btn prev"
          onClick={prevSlide}
          disabled={currentSlide === 0}
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="slide-counter">
          {currentSlide + 1} / {slides.length}
        </div>

        <button
          className="slide-nav-btn next"
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          aria-label="Next slide"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="slides-progress">
        <div
          className="slides-progress-bar"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        />
      </div>

      <div className="slides-hint">
        <span>Use arrow keys to navigate</span>
      </div>
    </div>
  );
}

