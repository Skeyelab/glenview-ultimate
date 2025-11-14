import type {
  About,
  NavigationLink,
  Partner,
  ScheduleEvent,
  WebsiteSettings,
  WhatIsUltimateVideo,
} from "./directus";

export const FALLBACK_DESCRIPTION_PARAGRAPHS: string[] = [
  'Ultimate, also known as Ultimate Frisbee, is a non-contact team sport played with a flying disc (frisbee). It combines elements of soccer, basketball, and football, emphasizing sportsmanship and fair play through the "Spirit of the Game" philosophy.',
  "The sport is played on a field similar to a football field, with end zones at each end. Teams score by catching the disc in the opposing team's end zone. Players cannot run with the disc and must pass it to teammates to advance down the field.",
];

export const FALLBACK_ABOUT: About = {
  id: 1,
  club_description:
    "The Glenview Ultimate Frisbee Club is a community based & parent run youth sports program in Glenview Illinois. Started in 2026 by Colin Carrigan, his sister, and his father. We teach the basics of Ultimate Frisbee with a heavy emphasis on 'Spirit of The Game'.",
  what_kids_learn: ["Rules of Ultimate", "Proper way to throw a backhand & forehand", "How to run multiple types of offense & defense"],
};

export const FALLBACK_WEBSITE_SETTINGS: WebsiteSettings = {
  id: 1,
  site_name: "Glenview Ultimate",
  footer_text: null,
  hero_title: "The Fun Starts - Spring 2026",
  hero_subtitle: "Introducing Glenview's very first Youth Ultimate Frisbee Club",
  hero_tagline: "5th-8th Grade. Boys & Girls.",
  hero_message_primary: "Everyone is Welcome. Everyone Plays.",
  hero_message_secondary: "Come play with us. Join our team.",
  hero_cta_label: "Register",
  hero_cta_url: "/register",
  hero_pre_registration_text: "Pre-Registration is now open",
  description_paragraphs: FALLBACK_DESCRIPTION_PARAGRAPHS,
  register_heading: "Registration",
  register_intro: "Tell us about your family. You can add up to three kids.",
};

export const FALLBACK_NAV_LINKS: NavigationLink[] = [
  { id: 1, label: "Home", href: "/", order: 1, is_primary_cta: false },
  { id: 2, label: "About", href: "/about", order: 2, is_primary_cta: false },
  { id: 3, label: "What is Ultimate?", href: "/what-is-ultimate", order: 3, is_primary_cta: false },
  { id: 4, label: "News", href: "/news", order: 4, is_primary_cta: false },
  { id: 5, label: "Schedule", href: "/schedule", order: 5, is_primary_cta: false },
  { id: 6, label: "Register", href: "/register", order: 6, is_primary_cta: true },
];

export const FALLBACK_PARTNERS: Partner[] = [
  { id: 1, name: "Illinois Ultimate", url: "https://illinoisultimate.org" },
  { id: 2, name: "Chicago Union (UFA)", url: "https://watchufa.com/union" },
  { id: 3, name: "Glenview Park District", url: "https://glenviewparks.org" },
  { id: 4, name: "USA Ultimate", url: "https://usaultimate.org" },
  { id: 5, name: "Ultimate Chicago", url: "https://ultimatechicago.org" },
];

export const FALLBACK_WHAT_IS_ULTIMATE_VIDEOS: WhatIsUltimateVideo[] = [
  {
    id: 1,
    title: "Introduction to Ultimate",
    description: "A comprehensive introduction to the basics of Ultimate Frisbee",
    youtube_embed_id: null,
    video_url: null,
    sort: 1,
  },
  {
    id: 2,
    title: "Rules of the Game",
    description: "Learn the fundamental rules and how the game is played",
    youtube_embed_id: null,
    video_url: null,
    sort: 2,
  },
  {
    id: 3,
    title: "Basic Throwing Techniques",
    description: "Master the backhand and forehand throws",
    youtube_embed_id: null,
    video_url: null,
    sort: 3,
  },
  {
    id: 4,
    title: "Spirit of the Game",
    description: "Understanding the core values and sportsmanship in Ultimate",
    youtube_embed_id: null,
    video_url: null,
    sort: 4,
  },
];

export const FALLBACK_SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: 1,
    season_year: 2026,
    event_type: "registration_open",
    title: "Pre-Registration Opens",
    date: "2025-11-01T15:00:00.000Z",
    end_date: null,
    location: null,
    description: null,
    highlight: true,
  },
  {
    id: 2,
    season_year: 2026,
    event_type: "registration_close",
    title: "Registration & Uniform Orders Due",
    date: "2026-02-15T15:00:00.000Z",
    end_date: null,
    location: null,
    description: null,
    highlight: true,
  },
  {
    id: 3,
    season_year: 2026,
    event_type: "season_start",
    title: "Spring Season Kickoff Practice",
    date: "2026-03-01T21:30:00.000Z",
    end_date: null,
    location: "TBD",
    description: "Weekly practices begin (12 weeks). Time & location currently TBD.",
    highlight: true,
  },
  {
    id: 4,
    season_year: 2026,
    event_type: "practice",
    title: "Weekly Practices Continue",
    date: "2026-03-08T21:30:00.000Z",
    end_date: "2026-05-24T21:30:00.000Z",
    location: "TBD",
    description: "Skills, drills, and scrimmages.",
    highlight: null,
  },
  {
    id: 5,
    season_year: 2026,
    event_type: "tournament",
    title: "Tournament Opportunities",
    date: "2026-04-01T15:00:00.000Z",
    end_date: "2026-05-31T22:00:00.000Z",
    location: null,
    description: "Opportunity to attend 3-4 tournaments.",
    highlight: null,
  },
];

