# BUSA Speaking Club - Reusable Components Library

A comprehensive collection of **fully responsive and modular** React components built with Tailwind CSS for the BUSA Speaking Club website.

## 🚀 Key Features

- **📱 Mobile-First Responsive** - All components work perfectly on any device
- **⚙️ Fully Modular** - Dynamic data injection through props
- **🎨 Multiple Variants** - Different styles for different use cases
- **🔧 Customizable** - Extensive prop-based customization
- **♿ Accessible** - ARIA labels and semantic HTML
- **⚡ Performance Optimized** - Clean React patterns

## Import Options

```javascript
// Individual imports (recommended)
import { Navbar, Footer, HeroSection, CallToAction } from '../components'

// Bulk import
import { Components } from '../components'
const { Navbar, Footer, HeroSection } = Components

// Direct imports
import Navbar from '../components/Navbar'
```

## Components

### 1. Layout Components

#### `<Navbar />` ✨ **Enhanced**
Fully responsive navigation bar with complete customization support.

```jsx
// Default usage
<Navbar />

// Fully customized
<Navbar
  navigationItems={[
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' }
  ]}
  brandName="Your Brand"
  tagline="Your Tagline"
  variant="transparent" // default, minimal, transparent
  position="fixed" // sticky, fixed, static
  ctaButton={{
    text: "Get Started",
    href: "/signup",
    show: true
  }}
  showBrandOnMobile={true}
  onItemClick={(item) => console.log('Clicked:', item)}
  className="custom-navbar"
/>
```

**Props:**
- `navigationItems` (array): Navigation menu items
- `logo` (object): Logo configuration
- `brandName` (string): Brand name text
- `tagline` (string): Brand tagline
- `variant` ("default" | "minimal" | "transparent"): Style variant
- `position` ("sticky" | "fixed" | "static"): Position type
- `ctaButton` (object): CTA button configuration
- `showBrandOnMobile` (boolean): Show brand on mobile
- `onItemClick` (function): Navigation click handler

#### `<Footer />` ✨ **Enhanced**
Responsive footer with modular content sections.

```jsx
// Default usage
<Footer />

// Customized footer
<Footer
  brandName="Your Brand"
  description="Your description"
  variant="minimal" // default, minimal, compact
  quickLinks={[
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' }
  ]}
  socialLinks={[
    {
      name: 'Twitter',
      href: 'https://twitter.com/yourbrand',
      icon: <TwitterIcon />
    }
  ]}
  contactInfo={[
    {
      icon: <EmailIcon />,
      text: "hello@yourbrand.com",
      href: "mailto:hello@yourbrand.com"
    }
  ]}
  showSocial={true}
  showQuickLinks={true}
  onLinkClick={(link) => console.log('Footer link:', link)}
/>
```

**Props:**
- `variant` ("default" | "minimal" | "compact"): Layout variant
- `brandName` (string): Brand name
- `description` (string): Brand description
- `quickLinks` (array): Quick navigation links
- `socialLinks` (array): Social media links
- `contactInfo` (array): Contact information
- `showSocial` (boolean): Show social media section
- `onLinkClick` (function): Link click handler

---

### 2. Page Section Components

#### `<HeroSection />` ✨ **Enhanced**
Fully customizable hero section with multiple variants and responsive design.

```jsx
// Simple hero
<HeroSection
  title="Welcome to Our Platform"
  subtitle="Build amazing things"
  variant="minimal"
/>

// Full-featured hero
<HeroSection
  title="Custom Title: Amazing Subtitle"
  subtitle="Your compelling message here"
  variant="default" // default, simple, minimal
  height="min-h-screen" // custom height
  showCarousel={true}
  showStats={true}
  carouselImages={[
    { url: "/image1.jpg", alt: "Image 1", caption: "Innovation" },
    { url: "/image2.jpg", alt: "Image 2", caption: "Excellence" }
  ]}
  primaryButton={{
    text: "Get Started",
    action: "link", // scroll, link, function
    target: "/signup"
  }}
  secondaryButton={{
    text: "Learn More",
    action: "scroll",
    scrollToId: "about-section"
  }}
  stats={[
    { value: "1000+", label: "Happy Users" },
    { value: "5★", label: "Rating" }
  ]}
  onPrimaryButtonClick={(e) => console.log('Primary clicked')}
/>

// Background variants
<HeroSection
  backgroundVideo="/video.mp4" // Video background
  backgroundColor="bg-gradient-to-r from-blue-600 to-purple-700" // Solid
  backgroundGradient="from-green-500/80 to-blue-600/80" // Custom gradient
/>
```

**Props:**
- `title` (string): Main headline
- `subtitle` (string): Subtitle text
- `variant` ("default" | "simple" | "minimal"): Layout variant
- `height` (string): Section height classes
- `showCarousel` (boolean): Enable image carousel
- `showStats` (boolean): Show statistics
- `showScrollIndicator` (boolean): Show scroll arrow
- `carouselImages` (array): Custom images
- `backgroundVideo` (string): Video background source
- `backgroundColor` (string): Solid background
- `primaryButton` / `secondaryButton` (object): Button configuration
- `stats` (array): Statistics to display
- `onPrimaryButtonClick` / `onSecondaryButtonClick` (function): Click handlers

#### `<CallToAction />` ✨ **New**
Flexible call-to-action section with multiple variants.

```jsx
// Simple CTA
<CallToAction />

// Advanced CTA
<CallToAction
  title="Ready to Get Started?"
  description="Join thousands of satisfied users"
  variant="gradient" // default, gradient, minimal, centered
  primaryButton={{
    text: "Sign Up Now",
    href: "/signup"
  }}
  secondaryButton={{
    text: "View Pricing",
    href: "/pricing"
  }}
  showStats={true}
  stats={[
    { value: "99%", label: "Satisfaction" },
    { value: "24/7", label: "Support" }
  ]}
  maxWidth="max-w-6xl"
/>
```

**Props:**
- `title` (string): CTA headline
- `description` (string): CTA description
- `variant` ("default" | "gradient" | "minimal" | "centered"): Style variant
- `primaryButton` / `secondaryButton` (object): Button configuration
- `showStats` (boolean): Show statistics
- `stats` (array): Statistics array
- `maxWidth` (string): Container max width

---

### 3. Card Components

#### `<MentorCard />` ✨ **Enhanced**
Highly customizable mentor profile card with multiple layouts.

```jsx
// Default mentor card
<MentorCard
  mentor={{
    name: "John Doe",
    role: "Senior Developer",
    university: "MIT",
    major: "Computer Science",
    bio: "Experienced mentor with 5+ years...",
    email: "john@example.com",
    linkedin: "linkedin.com/in/johndoe",
    photo: "/john.jpg"
  }}
/>

// Compact horizontal layout
<MentorCard
  mentor={mentor}
  variant="horizontal" // default, compact, horizontal
  size="small" // default, small, large
  showBio={false}
  showMajor={false}
  maxBioLines={1}
  onClick={(mentor) => console.log('Clicked mentor:', mentor)}
  onContactClick={(type, value, mentor) => {
    console.log(`${type} clicked for ${mentor.name}`)
  }}
/>

// Customized display
<MentorCard
  mentor={mentor}
  variant="compact"
  showRole={true}
  showUniversity={true}
  showContact={true}
  imageSize="w-20 h-20" // custom image size
  className="custom-mentor-card"
/>
```

**Props:**
- `mentor` (object): Mentor data
- `variant` ("default" | "compact" | "horizontal"): Layout variant
- `size` ("default" | "small" | "large"): Size variant
- `showBio` / `showContact` / `showUniversity` / `showMajor` / `showRole` (boolean): Control visibility
- `maxBioLines` (number): Bio truncation
- `onClick` (function): Card click handler
- `onContactClick` (function): Contact click handler
- `imageSize` (string): Custom image size
- `className` (string): Additional CSS classes

#### `<SessionCard />` ✨ **Enhanced**
Session display card with responsive design.

```jsx
<SessionCard
  session={{
    type: "zoom", // or "offline"
    date: "2024-12-15T14:00:00",
    topic: "Advanced Speaking Techniques",
    platform: "Zoom", // or venue for offline
    summary: "Learn advanced techniques...",
    attendance: 45,
    duration: "90 minutes",
    rating: 5,
    photos: true
  }}
  onClick={(session) => setSelectedSession(session)}
/>
```

---

### 4. Interactive Components

#### `<EventCalendar />` ✨ **New**
Interactive calendar with full event management.

```jsx
<EventCalendar
  events={eventsArray}
  onDateClick={(date, events) => handleDateClick(date, events)}
  onEventClick={(event) => setSelectedEvent(event)}
  selectedDate={selectedDate}
  onDateChange={setSelectedDate}
  variant="compact" // default, compact, minimal
  showLegend={true}
  className="custom-calendar"
/>
```

**Props:**
- `events` (array): Event data array
- `onDateClick` / `onEventClick` (function): Interaction handlers
- `selectedDate` (Date): Currently selected date
- `onDateChange` (function): Date change handler
- `variant` ("default" | "compact" | "minimal"): Calendar variant
- `showLegend` (boolean): Show calendar legend

#### `<EventModal />`
Modal for displaying event details.

```jsx
<EventModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  event={selectedEvent}
/>
```

#### `<TravelBoard />`
Full travel coordination board.

```jsx
<TravelBoard
  event={offlineEvent}
  isVisible={showBoard}
  onToggle={() => setShowBoard(!showBoard)}
/>
```

---

### 5. Display Components

#### `<SessionStats />` ✨ **Enhanced**
Responsive statistics display with mobile horizontal scrolling.

```jsx
// Default stats
<SessionStats />

// Custom stats
<SessionStats
  stats={[
    {
      value: "500+",
      label: "Active Users",
      subtitle: "and growing",
      icon: <UsersIcon />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    }
  ]}
/>
```

---

## 📱 Responsive Design Features

### Mobile-First Approach
All components are built mobile-first with responsive breakpoints:

```jsx
// Example responsive props
<Navbar
  showBrandOnMobile={true}
  showTaglineOnMobile={false}
/>

<MentorCard
  variant="horizontal" // Switches to vertical on mobile
  size="small" // Responsive sizing
/>

<HeroSection
  variant="minimal" // Optimized for mobile
  height="min-h-[60vh] md:min-h-screen" // Responsive height
/>
```

### Responsive Grid Layouts
Components automatically adjust their layout:

```jsx
// Desktop: 4 columns, Tablet: 2 columns, Mobile: 1 column
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {mentors.map(mentor => (
    <MentorCard key={mentor.id} mentor={mentor} variant="compact" />
  ))}
</div>
```

### Mobile Horizontal Scrolling
For mobile-optimized lists:

```jsx
<div className="md:hidden">
  <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
    {items.map(item => (
      <div key={item.id} className="min-w-[280px] flex-shrink-0">
        <Card item={item} />
      </div>
    ))}
  </div>
</div>
```

## 🎨 Variant System

### Consistent Variants Across Components
- **Default**: Full-featured, standard spacing
- **Minimal**: Clean, reduced content
- **Compact**: Dense layout, smaller elements
- **Horizontal**: Side-by-side layout (where applicable)

### Size System
- **Small**: Reduced spacing and typography
- **Default**: Standard sizing
- **Large**: Increased spacing and typography

## 📊 Usage Examples

### Complete Responsive Page
```jsx
import React, { useState } from 'react'
import { 
  Navbar, 
  HeroSection, 
  SessionStats, 
  MentorCard,
  CallToAction, 
  Footer 
} from '../components'

const ResponsivePage = () => {
  const [selectedMentor, setSelectedMentor] = useState(null)

  return (
    <div className="min-h-screen">
      {/* Responsive Navigation */}
      <Navbar
        variant="default"
        showBrandOnMobile={true}
        onItemClick={(item) => console.log('Nav:', item)}
      />
      
      {/* Mobile-optimized Hero */}
      <HeroSection
        title="Welcome: Mobile-First Design"
        variant="default"
        height="min-h-[70vh] md:min-h-screen"
        showCarousel={true}
      />
      
      {/* Responsive Stats */}
      <SessionStats />
      
      {/* Responsive Mentor Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map(mentor => (
              <MentorCard
                key={mentor.id}
                mentor={mentor}
                onClick={setSelectedMentor}
              />
            ))}
          </div>
          
          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden">
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
              {mentors.map(mentor => (
                <div key={mentor.id} className="min-w-[280px] flex-shrink-0">
                  <MentorCard
                    mentor={mentor}
                    variant="compact"
                    onClick={setSelectedMentor}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Responsive CTA */}
      <CallToAction
        variant="gradient"
        title="Ready to Join?"
        maxWidth="max-w-4xl"
      />
      
      {/* Responsive Footer */}
      <Footer
        variant="default"
        showSocial={true}
        onLinkClick={(link) => console.log('Footer:', link)}
      />
    </div>
  )
}
```

### Mobile-First Event Calendar
```jsx
const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showMobileCalendar, setShowMobileCalendar] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Mobile Calendar Toggle */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setShowMobileCalendar(!showMobileCalendar)}
          className="w-full btn-primary"
        >
          {showMobileCalendar ? 'Hide Calendar' : 'Show Calendar'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar - Hidden on mobile unless toggled */}
        <div className={`lg:col-span-2 ${showMobileCalendar ? 'block' : 'hidden md:block'}`}>
          <EventCalendar
            events={events}
            onEventClick={setSelectedEvent}
            variant="default"
            showLegend={true}
          />
        </div>
        
        {/* Event List - Always visible */}
        <div className="space-y-4">
          {upcomingEvents.map(event => (
            <SessionCard
              key={event.id}
              session={event}
              onClick={setSelectedEvent}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
```

## 🛠 Best Practices

### 1. Always Use Props for Dynamic Data
```jsx
// ✅ Good - Dynamic and reusable
<MentorCard
  mentor={mentorData}
  variant="compact"
  onClick={handleMentorClick}
/>

// ❌ Bad - Hardcoded data
<div className="mentor-card">
  <h3>John Doe</h3>
  <p>Developer</p>
</div>
```

### 2. Responsive Design Patterns
```jsx
// ✅ Good - Mobile-first responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Component />
</div>

// ✅ Good - Conditional mobile layout
<div className="hidden md:block">Desktop Layout</div>
<div className="md:hidden">Mobile Layout</div>
```

### 3. Event Handling
```jsx
// ✅ Good - Proper event handling
<MentorCard
  mentor={mentor}
  onClick={(mentor) => setSelectedMentor(mentor)}
  onContactClick={(type, value) => handleContact(type, value)}
/>
```

### 4. Accessibility
```jsx
// ✅ Good - Accessible
<button
  onClick={handleClick}
  aria-label="Close modal"
  className="focus:ring-2 focus:ring-primary-500"
>
  <CloseIcon />
</button>
```

## 🎯 Performance Tips

1. **Lazy Loading**: Use React.lazy for large components
2. **Memoization**: Use React.memo for expensive renders
3. **Image Optimization**: Use proper image sizes and formats
4. **Bundle Splitting**: Import only needed components

```jsx
// Efficient imports
import { Navbar, Footer } from '../components'

// Lazy loading for heavy components
const EventCalendar = React.lazy(() => import('../components/EventCalendar'))
```

All components are now **fully responsive**, **completely modular**, and ready for **dynamic data injection** through props! 🚀 