# Design Guidelines: Luxury Real Estate Platform

## Design Approach
**Reference-Based**: Drawing inspiration from high-end real estate platforms like Zillow Premium and Sotheby's International Realty, combined with modern luxury e-commerce aesthetics. The design emphasizes sophistication, trust, and premium feel through 3D depth effects and generous spacing.

## Typography
- **Single Font Family**: Inter (Google Fonts)
- **Heading Hierarchy**: 
  - Hero: 48-64px, bold (700), uppercase with subtle drop shadow
  - H1: 36-48px, bold (700)
  - H2: 28-36px, semibold (600)
  - H3: 20-24px, semibold (600)
- **Body Text**: 16-18px, regular (400), line-height 1.6
- **Small Text**: 14px for captions, labels

## Color Palette
- **Primary Background**: White (#FFFFFF)
- **Secondary Background**: Light gray (#F5F5F5, #EBEBEB)
- **Primary Accent**: Elegant blue (#2C5F8D, #4A90D9)
- **Secondary Accent**: Subtle gold (#D4AF37, #C9A961)
- **Navbar Scroll State**: Deep matte black (#111111) with 95% opacity
- **Text on Scroll**: White (#FFFFFF)
- **Overlays**: Black with 40% opacity for video backgrounds

## Layout System
- **Spacing Units**: Tailwind's 4, 8, 12, 16, 24, 32 units for consistent rhythm
- **Container Max-Width**: 1280px for main content areas
- **Generous Whitespace**: py-16 to py-32 between major sections
- **Card Padding**: p-6 to p-8
- **Grid Systems**: 
  - Property cards: 3 columns desktop, 2 tablet, 1 mobile
  - Agent listings: 4 columns desktop, 3 tablet, 2 mobile

## 3D Design Theme
- **Card Elevation**: Multiple shadow layers (shadow-lg, shadow-xl) for depth
- **Hover States**: Increase shadow and slight scale (1.02-1.05) with smooth transitions
- **Layering**: Overlapping elements with z-index variations
- **Button Depth**: Solid backgrounds with subtle inset shadows and elevated hover states
- **Blur Effects**: backdrop-blur on buttons over images

## Navigation
- **Initial State**: Transparent background, dark text
- **Scrolled State**: Solid deep matte black (#111111, 95% opacity), white text, smooth 300ms transition
- **Sticky Positioning**: Fixed top with z-index priority
- **Mobile**: Hamburger menu with slide-in drawer
- **Breadcrumbs**: On listings and detail pages with chevron separators

## Hero Section
- **Background**: Video element with semi-transparent dark overlay (black, 40% opacity)
- **Video Source**: Professional real estate footage (subtle, looping)
- **Text Overlay**: Large bold uppercase heading, center-aligned, white with drop shadow
- **CTA Buttons**: Two primary actions, blurred backgrounds, white text, hover elevation
- **Height**: 85-100vh for full viewport impact

## Component Library

### Property Cards
- 3D shadow effects with multiple layers
- Image carousel thumbnail with smooth slide transitions
- Price badge (gold accent)
- Property specs icons (bedrooms, bathrooms, area)
- Hover: Elevate with increased shadow and subtle scale

### Filter Sidebar
- Location autocomplete input
- Property type dropdown
- Dual-handle price range slider with live values
- Area range slider
- Bedroom/bathroom dropdowns (1-5+)
- Amenities checkboxes in scrollable container
- Apply/Clear filter buttons

### Image Carousels
- Full-width responsive slides
- Smooth slide transitions (300-500ms)
- Navigation arrows on hover
- Thumbnail strip below main image
- Zoom and fullscreen capabilities on detail pages

### Forms
- Floating labels with smooth transitions
- Focus states with blue accent borders
- Validation messages with icons
- Drag-and-drop image upload zones with preview grid
- Submit buttons with loading states

### Agent Contact Block
- Agent photo (circular, bordered)
- Name and credentials
- Contact information (phone, email)
- Schedule viewing button (gold accent)
- 3D card styling with elevation

### Testimonials
- Slider with fade transitions
- Client photos (circular)
- Quote text (italic, larger)
- Star ratings (gold)
- Navigation dots below

### Blog Cards
- Featured image with aspect ratio 16:9
- Category badge overlay
- Date and author information
- Excerpt text
- Read more link with arrow

## Animations
- **Page Transitions**: Soft fade (200ms)
- **Hover Effects**: Scale and shadow increase (300ms ease-in-out)
- **Carousel Slides**: Smooth slide (500ms)
- **Modal Entry**: Fade + slight scale from 0.95 to 1 (300ms)
- **Image Lazy Load**: Blur-up placeholder fade-in
- **Filter Updates**: Smooth opacity transitions on result grid

## Responsive Breakpoints
- Mobile: < 768px (single column, stacked elements)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3-4 columns)
- Large Desktop: > 1440px (max container width)

## Accessibility
- High contrast text on backgrounds (WCAG AA minimum)
- Focus indicators on all interactive elements
- Alt text for all images
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels for icons and interactive components

## Images
- **Hero Section**: Video background (professional real estate footage, looping)
- **Property Cards**: High-resolution property photos, lazy-loaded
- **Agent Profiles**: Professional headshots, circular crop
- **Blog Posts**: Featured images, 16:9 aspect ratio
- **Testimonials**: Client photos, circular with borders
- **Similar Properties**: Thumbnail carousels