// Layout Components
export { default as Navbar } from './Navbar'
export { default as Footer } from './Footer'

// Page Components
export { default as HeroSection } from './HeroSection'
export { default as CallToAction } from './CallToAction'

// Card Components
export { default as SessionCard } from './SessionCard'
export { default as MentorCard } from './MentorCard'
export { default as TravelBoardCard } from './TravelBoardCard'

// Interactive Components
export { default as EventCalendar } from './EventCalendar'
export { default as EventModal } from './EventModal'
export { default as TravelBoard } from './TravelBoard'

// Stats & Display Components
export { default as SessionStats } from './SessionStats'

// Re-export all components as a single object for bulk imports
import Navbar from './Navbar'
import Footer from './Footer'
import HeroSection from './HeroSection'
import CallToAction from './CallToAction'
import SessionCard from './SessionCard'
import MentorCard from './MentorCard'
import TravelBoardCard from './TravelBoardCard'
import EventCalendar from './EventCalendar'
import EventModal from './EventModal'
import TravelBoard from './TravelBoard'
import SessionStats from './SessionStats'

export const Components = {
  // Layout
  Navbar,
  Footer,
  
  // Page Sections
  HeroSection,
  CallToAction,
  
  // Cards
  SessionCard,
  MentorCard,
  TravelBoardCard,
  
  // Interactive
  EventCalendar,
  EventModal,
  TravelBoard,
  
  // Display
  SessionStats
} 