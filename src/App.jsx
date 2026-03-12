import { useState, useRef, useMemo, useEffect, useCallback } from "react";

if (!document.getElementById("sxsw-gf")) {
  const l = Object.assign(document.createElement("link"), {
    id: "sxsw-gf", rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600&display=swap"
  });
  document.head.appendChild(l);
}

const T = {
  bg: "#BFD4AB", sage: "#B5C9A1", sageDark: "#8BA87A",
  cream: "#F8F6F0", white: "#FFFFFF",
  pink: "#F2A8BC", pinkDark: "#E0809A", pinkSoft: "#FBE8EE",
  black: "#1A1A1A", ink: "#2C2C2C", muted: "#7A7A7A", border: "#E0DDD6",
};

// Event venue colors
const EV_C = {
  "Inc. Founders House":    ["#C4855A", "#FBF0E8"],
  "B2B HAUS":               ["#7C5EA8", "#F0EBF8"],
  "AdWeek House":           ["#4A8FC4", "#E8F2FB"],
  "Non-Obvious House":      ["#5A9E7C", "#E8F5EE"],
  "Create & Cultivate":     ["#C45A8A", "#FBE8F2"],
  "Wolf Connect":           ["#C4A24A", "#FBF6E8"],
  "Midwest House":          ["#5A6EC4", "#E8EBF8"],
  "Superhuman Breakfast":   ["#4AACBA", "#E8F5F8"],
  "Swift Fit Recovery":     ["#7AAF4E", "#EBF5DF"],
  "Chief Suite":            ["#A8527C", "#F8E8F0"],
  "Populous House":         ["#6E6EC4", "#EEEEF8"],
  "Yahoo at SXSW":          ["#C44A4A", "#F8EAEA"],
  "Creator Gold":           ["#C4A24A", "#FBF6E0"],
  "Cherub / Founder Heaven":["#E07A3A", "#FBF0E0"],
  "Coffee Talk":            ["#8B6E4A", "#F5EEE0"],
  "ManyChat":               ["#2A8FC4", "#E0F0FB"],
  "Buggg Party":            ["#E04A7A", "#FBE0EC"],
  "Tech Carnival":          ["#6E4AC4", "#EEE0FB"],
  "Made in Austin":         ["#4A6EC4", "#E0EEFB"],
  "Breathwork / Fitness":   ["#5AAF7A", "#E0F5E8"],
  "Creator Mixer":          ["#C4826A", "#FBF0E8"],
  "Restore & Rest":         [T.sageDark, "#EDF5E8"],
  "Free Food Stop":         ["#C4A24A", "#FBF6E8"],
};

// RSVP / registration URLs per venue (venue-level) + per-session overrides (id-level)
const EV_URL = {
  "Inc. Founders House":     "https://events.inc.com/inc-founders-house-2026-austin/attendee-plus-one?i=v8qVq-cbQ71U08Is7ZXBA5zRnz3jFu7y",
  "B2B HAUS":                "https://b2bhaus.com/",
  "AdWeek House":            "https://event.adweek.com/awh-austin-2026/personal_info?uid=6995ecb86cb36",
  "Non-Obvious House":       "https://lu.ma/nonobvious-sxsw-2026",
  "Create & Cultivate":      "https://www.createcultivate.com/futuresummit",
  "Wolf Connect":            "https://lu.ma/wolf-connect-sxsw-2026",
  "Midwest House":           "https://lu.ma/midwest-house-sxsw-2026",
  "Superhuman Breakfast":    "https://lu.ma/superhuman-startups-sxsw",
  "Swift Fit Recovery":      "https://lu.ma/swiftfit-recovery-sxsw-2026",
  "Chief Suite":             "https://chief.com/events",
  "Populous House":          "https://populous.com/me-to-we",
  "Yahoo at SXSW":           "https://yahoo.com/sxsw",
  "Creator Gold":            "https://lu.ma/creator-gold-sxsw-2026",
  "Cherub / Founder Heaven": "https://www.cherub.co/events",
  "Coffee Talk":             "https://lu.ma/coffeetalk-sxsw-2026",
  "ManyChat":                "https://get.manychat.com/events/sxsw/get-your-badge",
  "Buggg Party":             "https://partiful.com/e/9vBsuvSNiXpzkiqvUCBW",
  "Tech Carnival":           "https://lu.ma/tech-carnival-sxsw-2026",
  "Made in Austin":          "https://lu.ma/made-in-austin-sxsw-2026",
  "Breathwork / Fitness":    "https://lu.ma/breathwork-sxsw-2026",
  "Creator Mixer":           "https://partiful.com/e/creator-mixer-austin-2026",
};

// Per-session URL overrides for sessions with unique signup links
const SESSION_URL = {
  3:  "https://luma.com/mbbx3bai",                               // Live Podcast: Future of Live Event Operations
  63: "https://www.createcultivate.com/futuresummit",          // C&C full day
  89: "https://partiful.com/e/creator-mixer-austin-2026",      // Creator Mixer
  47: "https://lu.ma/nonobvious-sxsw-2026",                    // Non-Obvious VIP lunch
  90: "https://lu.ma/nonobvious-sxsw-2026",                    // Non-Obvious Female Founders Breakfast
};

const GOALS = [
  { id: "networking",         label: "Networking",         e: "🤝" },
  { id: "brand",              label: "Brand Building",     e: "📣" },
  { id: "community",          label: "Community",          e: "🌱" },
  { id: "creators",           label: "IRL Creators",       e: "🎥" },
  { id: "thought_leadership", label: "Thought Leadership", e: "💡" },
  { id: "fundraising",        label: "Fundraising",        e: "💰" },
  { id: "ai",                 label: "AI & Tech",          e: "🤖" },
  { id: "fun",                label: "Fun & Social",       e: "🎉" },
  { id: "women",              label: "Female Founders",    e: "♀️" },
  { id: "fitness",            label: "Fitness & Wellness", e: "🏃" },
  { id: "food",               label: "Free Food",          e: "🍽" },
];

const TOPICS = [
  { id: "all",              label: "All Events",           e: "✦",  color: "#1A1A1A" },
  { id: "brand-marketing",  label: "Brand & Marketing",    e: "📣",  color: "#C4855A" },
  { id: "creator-economy",  label: "Creator Economy",      e: "🎥",  color: "#C45A8A" },
  { id: "tech-ai",          label: "Tech & AI",            e: "🤖",  color: "#4A8FC4" },
  { id: "startups",         label: "Startups & Founders",  e: "🚀",  color: "#7C5EA8" },
  { id: "culture-community",label: "Culture & Community",  e: "🌱",  color: "#5A9E7C" },
  { id: "female-founders",  label: "Female Founders",      e: "♀️",  color: "#A8527C" },
  { id: "health-wellness",  label: "Health & Wellness",    e: "🏃",  color: "#7AAF4E" },
  { id: "food-drinks",      label: "Food & Drinks",        e: "🍽",  color: "#C4A24A" },
  { id: "music",            label: "Music & Entertainment",e: "🎵",  color: "#C44A4A" },
  { id: "social-parties",   label: "Social & Parties",     e: "🎉",  color: "#E04A7A" },
  { id: "networking",       label: "Networking",           e: "🤝",  color: "#4AACBA" },
];

function getTopics(s) {
  const t = new Set();
  const ti = s.title.toLowerCase();
  const g = s.g;
  if (g.includes("ai") || ti.includes("ai ") || ti.includes("tech") || ti.includes("agentic")) t.add("tech-ai");
  if (g.includes("brand") || ti.includes("brand") || ti.includes("marketing") || ti.includes("narrative") || ti.includes("storytelling") || ti.includes("copywriting")) t.add("brand-marketing");
  if (g.includes("creators") || ti.includes("creator") || ti.includes("creator economy") || ti.includes("content")) t.add("creator-economy");
  if (g.includes("fundraising") || ti.includes("capital") || ti.includes("vc") || ti.includes("invest") || ti.includes("pitch") || ti.includes("funding") || ti.includes("founder") || s.ev.includes("Founder") || s.ev.includes("Haus") || s.ev.includes("HAUS")) t.add("startups");
  if (g.includes("fitness") || s.cat === "fitness") t.add("health-wellness");
  if (s.cat === "food" || g.includes("food") || ti.includes("food") || ti.includes("coffee") || ti.includes("breakfast") || ti.includes("lunch") || ti.includes("taco") || ti.includes("margarita")) t.add("food-drinks");
  if (g.includes("women") || s.ev.includes("Chief") || s.ev.includes("Cultivate") || ti.includes("female founder") || ti.includes("women")) t.add("female-founders");
  if (g.includes("community") || g.includes("networking") || ti.includes("community") || ti.includes("connection") || ti.includes("network")) t.add("culture-community");
  if (ti.includes("music") || ti.includes("dj ") || ti.includes("concert") || ti.includes("showcase") || ti.includes("live from") || ti.includes("festival") || ti.includes("jazz") || ti.includes("playlist")) t.add("music");
  if (s.cat === "social" || g.includes("fun") || ti.includes("party") || ti.includes("happy hour") || ti.includes("reception") || ti.includes("mixer") || ti.includes("meetup") || ti.includes("after")) t.add("social-parties");
  if (g.includes("networking") || ti.includes("network") || ti.includes("meetup") || ti.includes("mixer")) t.add("networking");
  return t.size ? [...t] : ["culture-community"];
}

// CATS kept for internal legacy reference only
const CATS = [
  { id: "all", label: "All Events", e: "✦" },
  { id: "sessions", label: "Sessions", e: "🎙" },
  { id: "social", label: "Social", e: "🎉" },
  { id: "fitness", label: "Fitness", e: "🏃" },
  { id: "food", label: "Food", e: "🍽" },
];

const DAYS = ["Thursday", "Friday", "Saturday", "Sunday", "Monday"];
const DD = { Thursday: "Mar 12", Friday: "Mar 13", Saturday: "Mar 14", Sunday: "Mar 15", Monday: "Mar 16" };

function tm(t) {
  if (!t) return 9999;
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 9999;
  let h = +m[1], min = +m[2];
  if (m[3].toUpperCase() === "PM" && h !== 12) h += 12;
  if (m[3].toUpperCase() === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

// ─── FULL REAL DATABASE ───────────────────────────────────────────────
const DB = [
  // ══ THURSDAY MAR 12 ══
  { id: 1,  day: "Thursday", t: "9:00 AM",  e2: "10:30 AM", title: "Breathwork for the Human Side of Innovation", ev: "Breathwork / Fitness", v: "Zilker Metropolitan Park · Austin TX", sp: [], g: ["fitness","community","networking"], cat: "fitness", food: false, free: true, badge: false },
  { id: 2,  day: "Thursday", t: "3:00 PM",  e2: "5:00 PM",  title: "Made in Austin Creative Hackathon — Build with AI & Live Events", ev: "Made in Austin", v: "Zilker Brewing Co. · 1701 E 6th St", sp: ["Steven Tran — CTO, Soundcheck","Ben Ikwuagwu — CEO, Soundcheck"], g: ["ai","community","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 3,  day: "Thursday", t: "5:00 PM",  e2: "6:00 PM",  title: "Live Podcast: The Future of Live Event Operations & AI", ev: "Made in Austin", v: "Zilker Brewing Co. · 1701 E 6th St", sp: ["Ben Ikwuagwu — CEO, Soundcheck","Eric Sims — Host, The Cowboy Experience"], g: ["ai","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 4,  day: "Thursday", t: "4:00 PM",  e2: "7:00 PM",  title: "Cherub Founder Heaven — Panels, Investor Meet & Greets, Open Bar", ev: "Cherub / Founder Heaven", v: "Holiday · 5020 E 7th St, Austin TX", sp: ["Alex Chung — Goodword","Jaclyn Johnson — Co-Founder, Cherub","Caroline Dell — Co-Founder, Goodword"], g: ["fundraising","networking","community"], cat: "social", food: true, free: false, badge: false },
  { id: 5,  day: "Thursday", t: "7:00 PM",  e2: "11:00 PM", title: "Made in Austin Official SXSW Showcase (Live Music)", ev: "Made in Austin", v: "Zilker Brewing Co. · 1701 E 6th St", sp: ["Grandmaster","Tomar and the FCs","Lew Apollo","Grace Sorensen"], g: ["fun","community","creators"], cat: "social", food: false, free: true, badge: false },

  // ══ FRIDAY MAR 13 ══
  { id: 10, day: "Friday",   t: "10:00 AM", e2: "10:25 AM", title: "Inc. Founders House Opens — Complimentary Texas Breakfast Tacos", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: [], g: ["networking","food"], cat: "food", food: true, free: true, badge: false },
  { id: 11, day: "Friday",   t: "10:25 AM", e2: "10:30 AM", title: "Welcome Remarks", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Mike Hofman — Editor in Chief, Inc.","Kirk Watson — Mayor, City of Austin"], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 12, day: "Friday",   t: "10:30 AM", e2: "11:00 AM", title: "How to Invest Smart Now: Building Enduring Value Beyond the Exit", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Daniel Lubetzky — Founder, Camino Partners","Elle Lanning — President of Investments, Camino Partners","Bonny Ghosh — Inc. (mod)"], g: ["fundraising","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 13, day: "Friday",   t: "11:15 AM", e2: "11:45 AM", title: "Female Founders: Unlocking New Paths to Capital", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Tiffany Dufu — Tory Burch Foundation","Natalie Holloway — Co-founder, Bala","Jaclyn Johnson — Founder, Create & Cultivate","Rebecca Minkoff (mod)"], g: ["women","fundraising","networking"], cat: "sessions", food: false, free: true, badge: false },
  { id: 14, day: "Friday",   t: "12:00 PM", e2: "12:20 PM", title: "Reinventing Support: How Evelyn & Bobbie Built the First Real Bra Innovation in 100 Years", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Bree McKeen — Founder & CEO, Evelyn & Bobbie"], g: ["thought_leadership","brand"], cat: "sessions", food: false, free: true, badge: false },
  { id: 15, day: "Friday",   t: "12:20 PM", e2: "12:50 PM", title: "Female Founders Meetup", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Rebecca Minkoff — Female Founders Collective","Ali Wyatt — Female Founders Collective"], g: ["women","networking"], cat: "social", food: false, free: true, badge: false },
  { id: 16, day: "Friday",   t: "12:30 PM", e2: "1:00 PM",  title: "Complimentary Lunch", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: [], g: ["food","networking"], cat: "food", food: true, free: true, badge: false },
  { id: 17, day: "Friday",   t: "12:50 PM", e2: "1:20 PM",  title: "Scaling to $1 Billion — and Everything That Breaks Along the Way", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Ben Lamm — Colossal Biosciences","Suneera Madhani — Worth AI","Bonny Ghosh — Inc. (mod)"], g: ["thought_leadership","fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 18, day: "Friday",   t: "1:35 PM",  e2: "2:05 PM",  title: "How AI Is Transforming Consumer Behavior", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Arthur Leopold — Agentio","John Imah — Spree AI","Rob Verger — Inc. (mod)"], g: ["ai","brand","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 19, day: "Friday",   t: "2:15 PM",  e2: "2:45 PM",  title: "How to Disrupt a Big Industry", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Omar Bailey — Fctry Lab","Julia Reichelstein — Vaulted Deep","Eric Liedtke — Under Armour"], g: ["thought_leadership","brand"], cat: "sessions", food: false, free: true, badge: false },
  { id: 20, day: "Friday",   t: "2:55 PM",  e2: "3:25 PM",  title: "The Art of Founder Storytelling", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Bruno Solari — SolComms","Kim Vaccarella — Bogg","Nadya Okamoto — August"], g: ["brand","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 21, day: "Friday",   t: "3:35 PM",  e2: "4:05 PM",  title: "Narrative Strategy as Competitive Edge", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Morgan Seamark — Triggers® Brand Consulting","Shannon Watkins — Watkins Brand Advisors","Kimberly Storin — CMO, Zoom"], g: ["brand","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 22, day: "Friday",   t: "4:15 PM",  e2: "4:45 PM",  title: "Built on Points: How Brian Kelly Turned His Passion Into a Powerhouse", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Brian Kelly — The Points Guy","Stephanie Mehta — CEO, Mansueto Ventures (mod)"], g: ["brand","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 23, day: "Friday",   t: "5:00 PM",  e2: "5:30 PM",  title: "In Conversation with Mark Cuban", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Mark Cuban — Entrepreneur & Co-Founder, Cost Plus Drugs","Mike Hofman — Editor in Chief, Inc. (mod)"], g: ["thought_leadership","fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 24, day: "Friday",   t: "5:30 PM",  e2: "7:00 PM",  title: "Miles & Margaritas Happy Hour (Capital One Business)", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: [], g: ["networking","fun","food"], cat: "social", food: true, free: true, badge: false },
  // Midwest House Friday
  { id: 25, day: "Friday",   t: "12:00 PM", e2: "3:00 PM",  title: "Cool Ass Midwest Food Fair with Here Here Market (FREE)", ev: "Midwest House", v: "Inn Cahoots · 1221 E 6th St (Austin Garden)", sp: ["Disha Gulati — Here Here Market"], g: ["food","community","fun"], cat: "food", food: true, free: true, badge: false },
  { id: 26, day: "Friday",   t: "12:00 PM", e2: "3:00 PM",  title: "Midwest Creative Tech Meetup (with 2112)", ev: "Midwest House", v: "Inn Cahoots · 1221 E 6th St (Roof Top)", sp: [], g: ["networking","community","ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 27, day: "Friday",   t: "1:00 PM",  e2: "1:30 PM",  title: "The Business of Belonging: From Pop-Up to Powerhouse", ev: "Midwest House", v: "Inn Cahoots · Garden Stage", sp: ["Disha Gulati — Here Here Market","Billy Zureikat — Tripping Billy Z's","Anthony Ivy — Uncle May's Produce"], g: ["community","brand"], cat: "sessions", food: false, free: true, badge: false },
  { id: 28, day: "Friday",   t: "2:00 PM",  e2: "2:30 PM",  title: "Yes, Chef: Building Community through Food", ev: "Midwest House", v: "Inn Cahoots · Garden Stage", sp: ["Chef Cliff Rome","Chef CJ Jacobson","Nirali Shah — Obama Foundation (mod)"], g: ["community","food"], cat: "sessions", food: false, free: true, badge: false },
  { id: 29, day: "Friday",   t: "3:00 PM",  e2: "5:00 PM",  title: "Black Tech Week Meetup at Midwest House", ev: "Midwest House", v: "Inn Cahoots · Austin Garden", sp: [], g: ["networking","community","ai"], cat: "social", food: false, free: true, badge: false },
  { id: 30, day: "Friday",   t: "4:00 PM",  e2: "6:00 PM",  title: "5x5 Pitch Competition (Start Garden & Venture 313)", ev: "Midwest House", v: "Inn Cahoots · Roof Top", sp: [], g: ["fundraising","networking"], cat: "sessions", food: false, free: true, badge: false },
  { id: 31, day: "Friday",   t: "6:00 PM",  e2: "8:00 PM",  title: "Heated Rivalry 313 Day Party — Detroit vs Chicago (DJ Heather & DJ Holographic)", ev: "Midwest House", v: "Inn Cahoots · 1221 E 6th St", sp: ["DJ Heather (Chicago)","DJ Holographic (Detroit)"], g: ["fun","community","networking"], cat: "social", food: false, free: true, badge: false },
  { id: 32, day: "Friday",   t: "8:00 PM",  e2: "11:00 PM", title: "Midwest vs the Rest Fest", ev: "Midwest House", v: "Inn Cahoots · 1221 E 6th St", sp: ["Curls of Oz (Headline)"], g: ["fun","community"], cat: "social", food: false, free: true, badge: false },

  // ══ SATURDAY MAR 14 ══
  { id: 40, day: "Saturday", t: "8:30 AM",  e2: "11:30 AM", title: "Coffee Talk @ SXSW — Open Tab, Coffee's on Us (Sponsored by Clapper)", ev: "Coffee Talk", v: "Jo's Coffee Downtown · 242 W 2nd St", sp: ["Gigi Robinson — Gen Z Creator Strategist","Victoria Mariscal — Founder, Front Desk"], g: ["networking","creators","food"], cat: "food", food: true, free: true, badge: false },
  { id: 41, day: "Saturday", t: "9:00 AM",  e2: "2:00 PM",  title: "Swift Fit Recovery Lounge — IV Therapy, Massage, Acupuncture, Coffee, Smoothies", ev: "Swift Fit Recovery", v: "916 Congress Ave · Austin TX (OUTDOORS)", sp: ["DJ D Spark 9am–11:30am","DJ Diggy Dutch 11:30am–2pm"], g: ["fitness","networking","community"], cat: "fitness", food: true, free: true, badge: false },
  { id: 42, day: "Saturday", t: "10:00 AM", e2: "10:25 AM", title: "Inc. Founders House Opens — Complimentary Breakfast", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: [], g: ["networking","food"], cat: "food", food: true, free: true, badge: false },
  { id: 43, day: "Saturday", t: "10:30 AM", e2: "11:00 AM", title: "The Power of a Smart Pivot", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Julia Hartz — Co-founder & CEO, Eventbrite","Ben Van Leeuwen — Co-founder & CEO, Van Leeuwen Ice Cream"], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 44, day: "Saturday", t: "11:15 AM", e2: "11:45 AM", title: "Authenticity Matters: Transparent Data & Sustainable Commerce", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Kyle Bowman — Amazon Climate Pledge Friendly","Vivian Tai — GS1 US"], g: ["thought_leadership","brand"], cat: "sessions", food: false, free: true, badge: false },
  { id: 45, day: "Saturday", t: "12:00 PM", e2: "12:30 PM", title: "Finding the Human Advantage Through Today's AI (Daymond John)", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Daymond John — Founder & CEO, FUBU","Brandon Sawalich — President & CEO, Starkey"], g: ["ai","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 46, day: "Saturday", t: "12:30 PM", e2: "1:00 PM",  title: "Complimentary Lunch — Inc. Founders House", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: [], g: ["food","networking"], cat: "food", food: true, free: true, badge: false },
  { id: 47, day: "Saturday", t: "12:30 PM", e2: "1:00 PM",  title: "Non-Obvious VIP Speakers Lunch (Application Required)", ev: "Non-Obvious House", v: "Secret Location · Austin TX", sp: ["Rohit Bhargava — Non-Obvious Company"], g: ["networking","thought_leadership"], cat: "social", food: true, free: false, badge: false },
  { id: 48, day: "Saturday", t: "1:00 PM",  e2: "1:30 PM",  title: "From Reach to Revenue: The Business of Owning Your Audience", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Tyler Denk — Co-Founder & CEO, Beehiiv","Courtney Johnson — Creator, Level Up on LinkedIn"], g: ["creators","brand","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 49, day: "Saturday", t: "1:40 PM",  e2: "2:10 PM",  title: "Under the Hood of Building Rivian: A Conversation with RJ Scaringe", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["RJ Scaringe — Founder & CEO, Rivian"], g: ["thought_leadership","ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 50, day: "Saturday", t: "2:20 PM",  e2: "2:50 PM",  title: "The People Imperative: Leadership Strategies for the Next Era of Talent", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Amy Cunningham — Republic Capital Group","Maria Jugin — HR Consultant, Insperity"], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 51, day: "Saturday", t: "3:00 PM",  e2: "3:30 PM",  title: "Term Sheet Confidential: What We Learned Raising Capital", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Chad Janis — Founder & CEO, Grüns","Ashley Tyrner-Dolce — HLM Platforms"], g: ["fundraising","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 52, day: "Saturday", t: "3:00 PM",  e2: "7:00 PM",  title: "ManyChat Hub @ SXSW — Free Matcha, Food, Drinks + Product Demos", ev: "ManyChat", v: "Daydreamer · 1708 East 6th St", sp: [], g: ["networking","ai","food"], cat: "food", food: true, free: true, badge: false },
  { id: 53, day: "Saturday", t: "3:40 PM",  e2: "4:10 PM",  title: "Emma Grede: Why Being in the Room Still Matters", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Emma Grede — Founder & Serial Entrepreneur","Lauryn Bosstick — The Skinny Confidential","Michael Bosstick — Dear Media"], g: ["brand","creators","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 54, day: "Saturday", t: "4:20 PM",  e2: "4:50 PM",  title: "How Travel Fuels Innovation (IHG Hotels & Resorts)", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Lynnwood 'Woody' Bibbens — ReachTV","Jimmy Carroll — Pelorus","Ryan Plemmons — VP Sales, IHG"], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 55, day: "Saturday", t: "5:00 PM",  e2: "5:30 PM",  title: "Rebooting the Internet: Alexis Ohanian & Russell Wilson", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Alexis Ohanian — Founder, Seven Seven Six","Russell Wilson — Entrepreneur, Good Man Brand"], g: ["thought_leadership","community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 56, day: "Saturday", t: "6:00 PM",  e2: "10:00 PM", title: "Buggg App Launch Party — Open Bar, DJ Wyldflower, Photo Ops, Surprises (18+)", ev: "Buggg Party", v: "RichesArt Gallery · East Austin", sp: ["DJ Wyldflower"], g: ["fun","networking","community"], cat: "social", food: true, free: true, badge: false },
  { id: 57, day: "Saturday", t: "7:00 PM",  e2: "11:00 PM", title: "ManyChat Club @ SXSW — DJ Switch, Disco Ball, Vibes (Capacity 150)", ev: "ManyChat", v: "Daydreamer · 1708 East 6th St", sp: [], g: ["fun","networking"], cat: "social", food: true, free: true, badge: false },
  { id: 58, day: "Saturday", t: "8:00 PM",  e2: "11:59 PM", title: "Jessie Murph Live @ Yahoo SXSW — Doors 8 PM (21+)", ev: "Yahoo at SXSW", v: "Historic Scoot Inn · Austin TX", sp: ["Jessie Murph"], g: ["fun","creators"], cat: "social", food: false, free: false, badge: false },

  // ══ SUNDAY MAR 15 ══
  { id: 60, day: "Sunday",   t: "8:00 AM",  e2: "9:30 AM",  title: "Saddle Up & Sculpt with Jenna Palek — Morning Barre Class", ev: "Yahoo at SXSW", v: "Historic Scoot Inn · Austin TX", sp: ["Jenna Palek — Fitness Instructor"], g: ["fitness","fun"], cat: "fitness", food: false, free: false, badge: false },
  { id: 61, day: "Sunday",   t: "10:00 AM", e2: "11:15 AM", title: "Superhuman for Startups — Breakfast Mixer (Free Coffee, Barista Bar & Brunch)", ev: "Superhuman Breakfast", v: "Antone's Nightclub · 305 E 5th St", sp: [], g: ["networking","ai","food"], cat: "food", food: true, free: true, badge: false },
  { id: 62, day: "Sunday",   t: "10:00 AM", e2: "10:25 AM", title: "Inc. Founders House Opens — Breakfast", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: [], g: ["networking","food"], cat: "food", food: true, free: true, badge: false },
  { id: 63, day: "Sunday",   t: "10:00 AM", e2: "6:00 PM",  title: "Create & Cultivate Future Summit — Full Day (Codie Sanchez, Hayley Williams, Jonathan Van Ness, Vivian Tu)", ev: "Create & Cultivate", v: "Assembly Hall · 1121 E 7th St", sp: ["Jonathan Van Ness","Codie Sanchez","Hayley Williams","Vivian Tu"], g: ["women","creators","brand","community","thought_leadership"], cat: "sessions", food: true, free: false, badge: false },
  { id: 64, day: "Sunday",   t: "10:30 AM", e2: "11:00 AM", title: "How We Sold Our Company for $1.9 Billion — Poppi Founders", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Allison Ellsworth — Co-founder, Poppi","Stephen Ellsworth — Co-founder, Poppi"], g: ["thought_leadership","fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 65, day: "Sunday",   t: "11:00 AM", e2: "11:40 AM", title: "LinkedIn 2026: What Actually Matters Now", ev: "B2B HAUS", v: "The RSRV · 3415 E 7th St (PREVIEW — full event Mon Mar 16)", sp: ["Molly Godfrey","Nicole Ramirez"], g: ["creators","brand","thought_leadership"], cat: "sessions", food: false, free: false, badge: false },
  { id: 66, day: "Sunday",   t: "11:00 AM", e2: "11:20 AM", title: "Is Our Performance Measurement System Sick? — AI & Marketing Analytics", ev: "AdWeek House", v: "Accenture Austin · 323 Congress Ave", sp: ["Gozde Dinc — Director, Strategic Partnerships","Eugene Lee — COO","Tara Sparks — Director, Media"], g: ["ai","brand"], cat: "sessions", food: false, free: true, badge: false },
  { id: 67, day: "Sunday",   t: "11:15 AM", e2: "12:15 PM", title: "Rebuilding Startup OS with AI (Panel: Vercel, Function Health, Shipwell)", ev: "Superhuman Breakfast", v: "Antone's Nightclub · 305 E 5th St", sp: ["Alana Ackerson — Co-Founder, Figure","Alex Cohen — CEO, Hello Patient","Aryaman Khandelwal — Head of Product, V0 at Vercel","Pranitha Patil — Co-Founder, Function Health"], g: ["ai","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 68, day: "Sunday",   t: "11:15 AM", e2: "11:45 AM", title: "Winning at IRL Experiences", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["David Lafitte — CEO, Tecovas","Kim Malek — Co-Founder & CEO, Salt & Straw"], g: ["community","brand"], cat: "sessions", food: false, free: true, badge: false },
  { id: 69, day: "Sunday",   t: "11:25 AM", e2: "11:55 AM", title: "The Comeback of Marketing Basics — Mark Ritson", ev: "AdWeek House", v: "Accenture Austin · 323 Congress Ave", sp: ["Mark Ritson — Founder, MiniMBA"], g: ["brand","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 70, day: "Sunday",   t: "12:00 PM", e2: "12:30 PM", title: "Going Platinum: Hayley Williams & Brian O'Connor — Good Dye Young", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Hayley Williams — Co-Founder, Good Dye Young","Brian O'Connor — Co-Founder, Good Dye Young"], g: ["brand","creators","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 71, day: "Sunday",   t: "12:00 PM", e2: "12:20 PM", title: "When Brands Become Cultural Characters", ev: "AdWeek House", v: "Accenture Austin · 323 Congress Ave", sp: ["Kyle Cooke — Founder & CEO","Marissa Eddings — Head of Brand"], g: ["brand","community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 72, day: "Sunday",   t: "12:30 PM", e2: "1:00 PM",  title: "Complimentary Lunch — Inc. Founders House", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: [], g: ["food","networking"], cat: "food", food: true, free: true, badge: false },
  { id: 73, day: "Sunday",   t: "12:30 PM", e2: "12:50 PM", title: "How Creators Are Rewriting the Indie Film Playbook", ev: "AdWeek House", v: "Accenture Austin · 323 Congress Ave", sp: ["Aidan Gallagher — Creator @valspirefamily","Max Reisinger — Co-Founder & CEO, Creator Camp","Taylor K. Shaw-Omachonu — Head of Film"], g: ["creators","brand"], cat: "sessions", food: false, free: true, badge: false },
  { id: 74, day: "Sunday",   t: "12:55 PM", e2: "1:40 PM",  title: "Culture Moves Fast — Can Brands Keep Up Without AI? (Group Chat)", ev: "AdWeek House", v: "Accenture Austin · 323 Congress Ave", sp: ["Attica Alexis Jaques — CMO U.S., Ancestry","Kimberly Storin — CMO, Zoom","Wesley ter Haar — Co-Founder & Chief AI Officer","Will Lee — CEO"], g: ["ai","brand","creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 75, day: "Sunday",   t: "1:00 PM",  e2: "1:30 PM",  title: "Community as a Growth Engine: How Founders Nurture Connections at Scale", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Lanny Smith — Founder, Actively Black","Alphonzo Terrell — Co-Founder & CEO, SPILL"], g: ["community","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 76, day: "Sunday",   t: "2:00 PM",  e2: "2:20 PM",  title: "From Personalized to Personal: Creating Emotional Connections in an Automated World", ev: "AdWeek House", v: "Accenture Austin · 323 Congress Ave", sp: ["Laura Kowalski — SVP, Strategy","Steve Slivka — Chief Innovation Officer"], g: ["ai","brand"], cat: "sessions", food: false, free: true, badge: false },
  { id: 77, day: "Sunday",   t: "2:25 PM",  e2: "2:45 PM",  title: "Elyse Myers: Building Trust at Internet Scale", ev: "AdWeek House", v: "Accenture Austin · 323 Congress Ave", sp: ["Elyse Myers — Comedian, Content Creator & NYT Bestselling Author"], g: ["creators","brand","community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 78, day: "Sunday",   t: "2:30 PM",  e2: "2:50 PM",  title: "Protecting Your Vision and Mission with Ben Cohen", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Ben Cohen — Co-Founder, Ben & Jerry's"], g: ["thought_leadership","community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 79, day: "Sunday",   t: "3:00 PM",  e2: "5:00 PM",  title: "Yahoo at SXSW — Open All Day: Frito Pies, Margaritas, Horseshoes, Scout Shop", ev: "Yahoo at SXSW", v: "Historic Scoot Inn · Austin TX", sp: [], g: ["fun","food","networking"], cat: "food", food: true, free: false, badge: false },
  { id: 80, day: "Sunday",   t: "3:00 PM",  e2: "5:00 PM",  title: "Line Dancing Happy Hour @ Yahoo SXSW (Music, Margaritas)", ev: "Yahoo at SXSW", v: "Historic Scoot Inn · Austin TX", sp: [], g: ["fun","community"], cat: "social", food: true, free: false, badge: false },
  { id: 81, day: "Sunday",   t: "3:10 PM",  e2: "3:40 PM",  title: "Agentic AI in Action: Turning Autonomous Systems Into Real Business Value", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Amy Errett — CEO & Founder, Madison Reed"], g: ["ai","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 82, day: "Sunday",   t: "3:15 PM",  e2: "4:00 PM",  title: "Brands in the Experience Economy (Group Chat)", ev: "AdWeek House", v: "Accenture Austin · 323 Congress Ave", sp: ["Judy Lee — Global Brand & Creative","Brandon Lentino — Chief Creative Officer","Ty Stafford — Founder & CEO"], g: ["brand","community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 83, day: "Sunday",   t: "3:50 PM",  e2: "4:20 PM",  title: "Secrets of Great Challenger Brands", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Marty Bell — Co-Founder, Vacation","Jen Zeszut — Co-Founder & CEO, GOODLES"], g: ["brand","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 84, day: "Sunday",   t: "4:30 PM",  e2: "4:55 PM",  title: "Beyond the Credits: Scaling Entertainment IP From Animation to Imagination", ev: "AdWeek House", v: "Accenture Austin · 323 Congress Ave", sp: ["Justin Barnes — Executive Creative Director","Ian Mallitz — Director, Creative Marketing, Walt Disney Studios"], g: ["brand","creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 85, day: "Sunday",   t: "4:30 PM",  e2: "5:00 PM",  title: "The Next Chapter of BÉIS — A Conversation with Shay Mitchell", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: ["Shay Mitchell — Founder & CCO, BÉIS"], g: ["brand","creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 86, day: "Sunday",   t: "5:00 PM",  e2: "6:30 PM",  title: "Inc. Founders House Happy Hour (IHG Hotels & Resorts)", ev: "Inc. Founders House", v: "Foxy's Proper Pub · 201 Brazos St", sp: [], g: ["networking","fun","food"], cat: "social", food: true, free: true, badge: false },
  { id: 87, day: "Sunday",   t: "12:00 PM", e2: "5:30 PM",  title: "Creator Gold Live at SXSW — Creator Economy Panels, Networking & Brand Activations", ev: "Creator Gold", v: "Hotel Ella · 1900 Rio Grande St", sp: ["Monica Khan — Co-Founder, Creator Gold","France Tantiado — Co-Founder, Creator Gold"], g: ["creators","brand","networking","community"], cat: "sessions", food: true, free: true, badge: false },
  { id: 88, day: "Sunday",   t: "7:00 PM",  e2: "11:00 PM", title: "Tech Carnival — Startup Booths, Games, Food & Drinks (Bulletpitch × Antler)", ev: "Tech Carnival", v: "Inn Cahoots · 1221 E 6th St", sp: [], g: ["networking","fundraising","fun","food"], cat: "social", food: true, free: false, badge: false },
  { id: 89, day: "Sunday",   t: "7:00 PM",  e2: "11:00 PM", title: "Austin Creator Mixer — Music, Pickleball, Food & Drinks (Karat, Epidemic Sound, Uscreen — 21+ Invite Only)", ev: "Creator Mixer", v: "Bouldin Acres · 2027 S Lamar Blvd", sp: [], g: ["creators","networking","fun","food"], cat: "social", food: true, free: true, badge: false },

  // ══ MONDAY MAR 16 ══
  { id: 90, day: "Monday",   t: "8:30 AM",  e2: "10:00 AM", title: "Non-Obvious Female Founders Breakfast Meetup (Application Required)", ev: "Non-Obvious House", v: "Secret Location · Near ACC, Austin", sp: ["Rohit Bhargava — Founder, Non-Obvious Company"], g: ["women","networking","food"], cat: "food", food: true, free: true, badge: false },
  { id: 91, day: "Monday",   t: "9:00 AM",  e2: "10:00 AM", title: "B2B HAUS Welcome Breakfast & Open Networking", ev: "B2B HAUS", v: "The RSRV · 3415 E 7th St", sp: [], g: ["networking","food"], cat: "food", food: true, free: true, badge: false },
  { id: 92, day: "Monday",   t: "10:00 AM", e2: "11:00 AM", title: "Chief Suite: Community as an Accelerator — Tiffany Dufu in The Power Seat", ev: "Chief Suite", v: "Bayberry Room @ Thompson Austin", sp: ["Tiffany Dufu — President, Tory Burch Foundation","Alison Moore — CEO, Chief"], g: ["women","community","thought_leadership"], cat: "sessions", food: false, free: false, badge: false },
  { id: 93, day: "Monday",   t: "10:15 AM", e2: "10:50 AM", title: "Community as Currency: Building Ecosystems That Convert ✦ Umama Speaking", ev: "B2B HAUS", v: "The RSRV · 3415 E 7th St", sp: ["Umama Kibria — Director of Marketing, Pie / Founder, PLAY Social Club","Jordyn Weaver","AJ Eckstein"], g: ["community","brand","networking"], cat: "sessions", food: false, free: true, badge: false },
  { id: 94, day: "Monday",   t: "11:00 AM", e2: "11:40 AM", title: "LinkedIn 2026: What Actually Matters Now", ev: "B2B HAUS", v: "The RSRV · 3415 E 7th St", sp: ["Molly Godfrey","Nicole Ramirez"], g: ["creators","brand"], cat: "sessions", food: false, free: true, badge: false },
  { id: 95, day: "Monday",   t: "11:30 AM", e2: "12:30 PM", title: "Chief Suite: Pivot with Purpose — Amy Errett in The Power Seat", ev: "Chief Suite", v: "Bayberry Room @ Thompson Austin", sp: ["Amy Errett — CEO, Madison Reed","Trey Boynton — Chief D&P Officer, Chief"], g: ["women","thought_leadership"], cat: "sessions", food: false, free: false, badge: false },
  { id: 96, day: "Monday",   t: "11:45 AM", e2: "12:15 PM", title: "From Idea to Infrastructure: Turning Vision Into a Real Business", ev: "B2B HAUS", v: "The RSRV · 3415 E 7th St", sp: ["Alisha Pennington","Jacqueline Corbelli"], g: ["thought_leadership","fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 97, day: "Monday",   t: "12:00 PM", e2: "3:00 PM",  title: "Non-Obvious Futurist VIP Lunch Gathering", ev: "Non-Obvious House", v: "Secret Location · Near ACC, Austin", sp: ["Rohit Bhargava — Non-Obvious Company"], g: ["thought_leadership","networking","food"], cat: "food", food: true, free: true, badge: false },
  { id: 98, day: "Monday",   t: "12:15 PM", e2: "12:45 PM", title: "B2B HAUS Lunch + Open Networking", ev: "B2B HAUS", v: "The RSRV · 3415 E 7th St", sp: [], g: ["networking","food"], cat: "food", food: true, free: true, badge: false },
  { id: 99, day: "Monday",   t: "12:45 PM", e2: "1:15 PM",  title: "Personal Branding for Introverts: Building Authority Without Performing", ev: "B2B HAUS", v: "The RSRV · 3415 E 7th St", sp: ["Goldie Chan"], g: ["brand","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 100,day: "Monday",   t: "1:00 PM",  e2: "5:00 PM",  title: "Wolf Connect: Culture, Connection & Growth (FREE — No Badge Required)", ev: "Wolf Connect", v: "Umlauf Sculpture Garden · 605 Azie Morton Rd", sp: [], g: ["community","networking","fun"], cat: "social", food: true, free: true, badge: false },
  { id: 101,day: "Monday",   t: "1:30 PM",  e2: "2:15 PM",  title: "Wolf Connect — Brands Panel (Good Good, Springland, Bejou)", ev: "Wolf Connect", v: "Umlauf Sculpture Garden · Wolf Garden Stage", sp: ["Michelle Breyer — CMO, SKU (host)","Gardar — Founder & CEO, Good Good","Shannon — Founder & CEO, Springland"], g: ["brand","community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 102,day: "Monday",   t: "1:30 PM",  e2: "2:15 PM",  title: "Unapologetic Authority: The Business of Being Yourself", ev: "B2B HAUS", v: "The RSRV · 3415 E 7th St", sp: ["Jayde I. Powell","Tameka Bazile"], g: ["brand","creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 103,day: "Monday",   t: "2:00 PM",  e2: "3:00 PM",  title: "Chief Suite: Power Networking — Big Talk, Real Connection", ev: "Chief Suite", v: "Bayberry Room @ Thompson Austin", sp: ["Kalina Silverman — Big Talk Creator"], g: ["women","networking","community"], cat: "social", food: false, free: false, badge: false },
  { id: 104,day: "Monday",   t: "2:15 PM",  e2: "3:00 PM",  title: "Wolf Connect — Art, Culture & Community Panel: From URL to IRL", ev: "Wolf Connect", v: "Umlauf Sculpture Garden · Wolf Garden Stage", sp: ["Mir Hwang — Founder, GigFinesse (host)","Jacob — Founder, Flighthouse Media","Chris — Co-Founder, Tinder / Clique Social"], g: ["creators","community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 105,day: "Monday",   t: "2:30 PM",  e2: "3:00 PM",  title: "State of VC, Funding & Startups in 2026", ev: "B2B HAUS", v: "The RSRV · 3415 E 7th St", sp: ["Sarah Romanko — Geek VC","Andrew Abraham","Arturo Piña"], g: ["fundraising","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 106,day: "Monday",   t: "2:30 PM",  e2: "4:00 PM",  title: "Non-Obvious Agentic AI Panel Discussion", ev: "Non-Obvious House", v: "Secret Location · Near ACC, Austin", sp: ["Rohit Bhargava — Non-Obvious Company"], g: ["ai","thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 107,day: "Monday",   t: "3:00 PM",  e2: "4:00 PM",  title: "Wolf Connect — E-Commerce & Growth Panel: Turning Attention into Revenue", ev: "Wolf Connect", v: "Umlauf Sculpture Garden · Wolf Garden Stage", sp: ["Eva Wolf — Founder & CEO, ASK WOLF (host)","Kim — Chief Brand Officer, Bobbie"], g: ["brand","creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 108,day: "Monday",   t: "3:00 PM",  e2: "4:00 PM",  title: "Copywriting That Converts: Storytelling to Walk Your Customer to the Sale", ev: "B2B HAUS", v: "The RSRV · 3415 E 7th St", sp: ["Amy Lohr"], g: ["brand","creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 109,day: "Monday",   t: "3:00 PM",  e2: "4:00 PM",  title: "Chief Suite: The Human Leader in the Age of AI", ev: "Chief Suite", v: "Bayberry Room @ Thompson Austin", sp: ["Jo McKinney — Chief Member"], g: ["women","ai","thought_leadership"], cat: "sessions", food: false, free: false, badge: false },
  { id: 110,day: "Monday",   t: "3:45 PM",  e2: "4:30 PM",  title: "Wolf Connect — Culture & Market Trends Panel: What Drives Attention & Loyalty", ev: "Wolf Connect", v: "Umlauf Sculpture Garden · Wolf Garden Stage", sp: ["Emily — Creator, Texas Grocery Finds","Kevin — Founder, Foliepop's (Top Chef France & USA)"], g: ["brand","community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 111,day: "Monday",   t: "4:00 PM",  e2: "5:00 PM",  title: "Chief Suite: Marketing, Rewired — Leading Through the Next Era", ev: "Chief Suite", v: "Bayberry Room @ Thompson Austin", sp: ["Sabrina Caluori — CMO, Chief (mod)"], g: ["women","brand","thought_leadership"], cat: "sessions", food: false, free: false, badge: false },
  { id: 112,day: "Monday",   t: "4:30 PM",  e2: "5:30 PM",  title: "B2B HAUS Startup Showcase (MagenTrust, Hey Synth, Orivfy, FoodBridge)", ev: "B2B HAUS", v: "The RSRV · 3415 E 7th St", sp: ["Jacqueline Sutton — Founder, MagenTrust","Llyod Membere — Founder, Hey Synth","Kevin Lyons — FoodBridge"], g: ["fundraising","networking"], cat: "sessions", food: false, free: true, badge: false },
  { id: 113,day: "Monday",   t: "4:30 PM",  e2: "6:00 PM",  title: "Populous House Welcome Reception & Happy Hour", ev: "Populous House", v: "3Ten Austin City Limits", sp: [], g: ["networking","fun","food"], cat: "social", food: true, free: false, badge: false },
  { id: 114,day: "Monday",   t: "4:30 PM",  e2: "5:30 PM",  title: "Wolf Connect — Marketing Technology Panel", ev: "Wolf Connect", v: "Umlauf Sculpture Garden · Wolf Garden Stage", sp: [], g: ["ai","brand"], cat: "sessions", food: false, free: true, badge: false },
  { id: 115,day: "Monday",   t: "5:00 PM",  e2: "7:00 PM",  title: "Wolf Circle Networking Happy Hour (Private — $40 Ticket)", ev: "Wolf Connect", v: "Umlauf Sculpture Garden", sp: [], g: ["networking","fun","food"], cat: "social", food: true, free: false, badge: false },
  { id: 116,day: "Monday",   t: "5:00 PM",  e2: "6:00 PM",  title: "Non-Obvious Event Planner Meetup (Apply Required)", ev: "Non-Obvious House", v: "Secret Location · Near ACC, Austin", sp: ["Rohit Bhargava — Non-Obvious Company"], g: ["networking"], cat: "social", food: false, free: true, badge: false },
  { id: 117,day: "Monday",   t: "5:30 PM",  e2: "7:00 PM",  title: "B2B HAUS VIP Cocktail Hour", ev: "B2B HAUS", v: "The RSRV · 3415 E 7th St", sp: [], g: ["networking","fun","food"], cat: "social", food: true, free: true, badge: false },
  { id: 118,day: "Monday",   t: "6:00 PM",  e2: "6:30 PM",  title: "Chief Suite Member Reception (Members Only — DJ, High-Energy Celebration)", ev: "Chief Suite", v: "Bayberry Room @ Thompson Austin", sp: [], g: ["women","networking","fun"], cat: "social", food: true, free: false, badge: false },
  { id: 119,day: "Monday",   t: "6:00 PM",  e2: "9:15 PM",  title: "Populous House Live Music Showcase", ev: "Populous House", v: "3Ten Austin City Limits", sp: [], g: ["fun","community","creators"], cat: "social", food: false, free: false, badge: false },
  { id: 120,day: "Monday",   t: "9:00 PM",  e2: "11:00 PM", title: "Non-Obvious Afterparty", ev: "Non-Obvious House", v: "Secret Location · Near ACC, Austin", sp: [], g: ["fun","networking"], cat: "social", food: false, free: true, badge: false },
  { id: 121,day: "Monday",   t: "9:30 PM",  e2: "11:30 PM", title: "Populous House Late Night DJ", ev: "Populous House", v: "3Ten Austin City Limits", sp: [], g: ["fun"], cat: "social", food: false, free: false, badge: false },
];

const LOADING_MSGS = [
  "analyzing your intentions…", "scanning 120+ sessions…",
  "matching to your goals…", "adding free food stops…",
  "scheduling recovery time…", "curating your perfect week…"
];

// ─── Canvas story drawing ─────────────────────────────────────────────
function wt(ctx, text, x, y, maxW, lineH) {
  const words = text.split(" "), lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  return lines.length;
}

async function drawDayStory(dayName, entries) {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  const W = 1080, H = 1920;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#BFD4AB";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  for (let x = 0; x < W; x += 38) for (let y = 0; y < H; y += 38) {
    ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
  }

  let y = 48;

  // Header
  ctx.fillStyle = "#F8F6F0";
  ctx.beginPath(); ctx.roundRect(40, y, W - 80, 200, 18); ctx.fill();
  ctx.strokeStyle = "#1A1A1A"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(40, y, W - 80, 200, 18); ctx.stroke();
  ctx.fillStyle = "#8BA87A"; ctx.font = "500 26px 'DM Sans', sans-serif";
  ctx.fillText(`AUSTIN, TX  ·  ${DD[dayName]?.toUpperCase() || dayName.toUpperCase()}, 2026`, 68, y + 44);
  ctx.fillStyle = "#1A1A1A"; ctx.font = "italic 900 80px 'Playfair Display', serif";
  ctx.fillText(`my ${dayName.toLowerCase()}`, 68, y + 116);
  ctx.fillStyle = "#8BA87A"; ctx.font = "italic 900 80px 'Playfair Display', serif";
  ctx.fillText("schedule.", 68, y + 192);
  y += 224;

  for (const entry of entries) {
    const isSpecial = typeof entry === "string";
    const isRest = isSpecial && entry.startsWith("rest");
    const isFoodBump = isSpecial && entry.startsWith("food");
    const s = isSpecial ? null : DB.find(x => x.id === entry);
    if (!isSpecial && !s) continue;

    const hasSp = s && s.sp.length > 0;
    const cardH = isSpecial ? 90 : (hasSp ? 140 : 110);
    const [c, bg] = isRest ? ["#8BA87A", "#EDF5E8"] : isFoodBump ? ["#C4A24A", "#FBF6E8"] : s ? (EV_C[s.ev] || ["#999", "#F5F5F0"]) : ["#999", "#F5F5F0"];

    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.roundRect(40, y, W - 80, cardH, 12); ctx.fill();
    ctx.fillStyle = c; ctx.fillRect(40, y, 7, cardH);
    // round the left corners
    ctx.fillStyle = bg; ctx.fillRect(40, y, 4, 8); ctx.fillRect(40, y + cardH - 8, 4, 8);

    if (isRest) {
      ctx.fillStyle = "#8BA87A"; ctx.font = "bold 30px 'DM Sans', sans-serif";
      ctx.fillText("🌿  Rest & Recharge Break", 68, y + 52);
      ctx.fillStyle = "#8BA87A"; ctx.font = "22px 'DM Sans', sans-serif";
      ctx.fillText("Take a breath — you're doing great.", 68, y + 78);
    } else if (isFoodBump) {
      ctx.fillStyle = "#C4A24A"; ctx.font = "bold 30px 'DM Sans', sans-serif";
      ctx.fillText("🍽  Free Food Stop", 68, y + 52);
      ctx.fillStyle = "#C4A24A"; ctx.font = "22px 'DM Sans', sans-serif";
      ctx.fillText("Fuel up before the next session.", 68, y + 78);
    } else if (s) {
      ctx.fillStyle = c; ctx.font = "600 22px 'DM Sans', sans-serif";
      ctx.fillText(`${s.ev.toUpperCase()}  ·  ${s.t}`, 66, y + 30);
      ctx.fillStyle = "#2C2C2C"; ctx.font = "bold 29px 'Playfair Display', serif";
      const clean = s.title.replace(" ✦ Umama Speaking", "");
      const lines = wt(ctx, clean, 66, y + 62, W - 160, 36);
      if (hasSp) {
        ctx.fillStyle = "#7A7A7A"; ctx.font = "22px 'DM Sans', sans-serif";
        const spTxt = s.sp.slice(0, 2).map(x => x.split(" — ")[0]).join(", ") + (s.sp.length > 2 ? ` +${s.sp.length - 2}` : "");
        ctx.fillText(spTxt, 66, y + 62 + lines * 36 + 26);
      }
      ctx.fillStyle = "#9A9A9A"; ctx.font = "20px 'DM Sans', sans-serif";
      ctx.fillText(`📍 ${s.v}`, 66, y + cardH - 18);
    }
    y += cardH + 8;
    if (y > H - 110) break;
  }

  // Footer
  ctx.fillStyle = "#1A1A1A";
  ctx.fillRect(0, H - 96, W, 96);
  ctx.fillStyle = "#F8F6F0"; ctx.textAlign = "center";
  ctx.font = "italic bold 34px 'Playfair Display', serif";
  ctx.fillText("Built with PLAY Social Club 🌱", W / 2, H - 52);
  ctx.fillStyle = "#8BA87A"; ctx.font = "24px 'DM Sans', sans-serif";
  ctx.fillText("@umamakibria  ·  playsocialclub.com", W / 2, H - 20);
  ctx.textAlign = "left";

  return canvas;
}

// ─── Pill Component ──────────────────────────────────────────────────
function Pill({ label, active, onClick, color }) {
  return (
    <button onClick={onClick} style={{
      background: active ? (color || T.black) : T.white,
      color: active ? T.white : T.muted,
      border: `1.5px solid ${active ? (color || T.black) : T.border}`,
      borderRadius: 100, fontFamily: "'DM Sans',sans-serif",
      fontSize: 12, fontWeight: 500, padding: "5px 14px",
      cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.13s",
    }}>
      {label}
    </button>
  );
}

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}
// ─── LANDING ─────────────────────────────────────────────────────────
function Landing({ onStart }) {
  return (
    <div style={{ minHeight: "100vh", background: T.bg, backgroundImage: `radial-gradient(circle,#00000012 1px,transparent 1px)`, backgroundSize: "22px 22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} .f1{animation:fadeUp 0.6s both} .f2{animation:fadeUp 0.6s 0.1s both} .f3{animation:fadeUp 0.6s 0.2s both} .f4{animation:fadeUp 0.6s 0.35s both} .cherry{animation:float 3s ease-in-out infinite} .sbtn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.2)!important} .sbtn:active{transform:translateY(0)}`}</style>
      <div className="cherry" style={{ fontSize: 52, marginBottom: 12, userSelect: "none" }}>🍒</div>
      <div className="f1" style={{ background: T.cream, border: `2px solid ${T.black}`, borderRadius: 20, padding: "36px 32px 30px", maxWidth: 460, width: "100%", textAlign: "center", boxShadow: "6px 6px 0 rgba(0,0,0,0.1)" }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.sageDark, marginBottom: 8 }}>Austin, TX · March 12–16, 2026</div>
        <h1 className="f2" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,5vw,38px)", fontWeight: 900, fontStyle: "italic", color: T.black, margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Let's build your ultimate<br /><span style={{ color: T.sageDark }}>SXSW schedule!</span>
        </h1>
        <p className="f3" style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, margin: "0 0 22px" }}>
          These are <strong style={{ color: T.ink }}>free external events</strong> around the main conference — most are free & badge-free. Tell us your goals and we'll build a personalized itinerary.
        </p>
        <div className="f3" style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
          {[["120+", "sessions"], ["10", "venues"], ["5", "days"], ["Mostly", "FREE"]].map(([n, l]) => (
            <div key={l} style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 10, padding: "7px 13px" }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 900, color: T.black, lineHeight: 1 }}>{n}</div>
              <div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <button className="sbtn f4" onClick={onStart} style={{ background: T.black, color: T.cream, border: "none", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, padding: "14px 40px", cursor: "pointer", width: "100%", transition: "all 0.2s", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
          Build My Schedule →
        </button>
        <div style={{ marginTop: 14, fontSize: 11, color: T.muted }}>AI-powered · 2 min · share as Instagram Story per day</div>
        <a href="https://instagram.com/playsocialclub" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 10, fontSize: 12, fontWeight: 600, color: T.sageDark, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
          @playsocialclub
        </a>
      </div>
      <div className="f4" style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 16, maxWidth: 480 }}>
        {CATS.slice(1).map(c => <span key={c.id} style={{ background: T.cream, border: `1px solid ${T.border}`, borderRadius: 100, fontSize: 11, fontWeight: 600, padding: "4px 12px", color: T.ink }}>{c.e} {c.label}</span>)}
      </div>
    </div>
  );
}

// ─── ONBOARDING ────────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [intention, setIntention] = useState("");
  const [selGoals, setSelGoals] = useState([]);
  const [people, setPeople] = useState("");
  const [tags, setTags] = useState([]);
  const [incFood, setIncFood] = useState(true);
  const [incRest, setIncRest] = useState(true);

  const canNext = [intention.trim().length > 5, selGoals.length > 0, true][step];

  function addTag(e) {
    if ((e.key === "Enter" || e.key === ",") && people.trim()) {
      e.preventDefault(); setTags(t => [...t, people.trim()]); setPeople("");
    }
  }

  function next() {
    if (step < 2) setStep(s => s + 1);
    else onComplete({ intention, goals: selGoals, people: tags, includeFood: incFood, includeRest: incRest });
  }

  const dots = `radial-gradient(circle,#00000012 1px,transparent 1px)`;
  return (
    <div style={{ minHeight: "100vh", background: T.bg, backgroundImage: dots, backgroundSize: "22px 22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@keyframes sIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}} .sld{animation:sIn 0.3s ease both} textarea:focus,input:focus{outline:none;border-color:#1A1A1A!important}`}</style>

      {/* Progress */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, alignItems: "center" }}>
        {["Your Intention", "Your Goals", "Who to Meet"].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 26, height: 26, borderRadius: 100, border: `2px solid ${i <= step ? T.black : T.border}`, background: i < step ? T.black : (i === step ? T.black : "transparent"), color: i <= step ? T.cream : T.muted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{i < step ? "✓" : i + 1}</div>
            {i < 2 && <div style={{ width: 24, height: 2, background: i < step ? T.black : T.border, borderRadius: 1 }} />}
          </div>
        ))}
      </div>

      <div className="sld" key={step} style={{ background: T.cream, border: `2px solid ${T.black}`, borderRadius: 20, padding: "32px 28px", maxWidth: 500, width: "100%", boxShadow: "6px 6px 0 rgba(0,0,0,0.08)" }}>
        {step === 0 && <>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.sageDark, marginBottom: 6 }}>Step 1 of 3</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, fontStyle: "italic", color: T.black, margin: "0 0 8px", lineHeight: 1.2 }}>What's your intention<br />for this week?</h2>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 16, lineHeight: 1.5 }}>What does a successful SXSW look like for you? The more specific, the better.</p>
          <textarea value={intention} onChange={e => setIntention(e.target.value)} placeholder="e.g. I want to connect with IRL creators, find brand partnerships for PLAY Social Club, and leave inspired with 3 new collaborators…" rows={4} style={{ width: "100%", boxSizing: "border-box", background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 12, fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.ink, padding: "12px 14px", resize: "none", lineHeight: 1.6, transition: "border 0.15s" }} />
          <div style={{ textAlign: "right", fontSize: 11, color: T.muted, marginTop: 4 }}>{intention.length} chars</div>
        </>}

        {step === 1 && <>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.sageDark, marginBottom: 6 }}>Step 2 of 3</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, fontStyle: "italic", color: T.black, margin: "0 0 8px", lineHeight: 1.2 }}>What are your goals?</h2>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 14 }}>Select 2–5 goals for best results.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 16 }}>
            {GOALS.map(g => {
              const active = selGoals.includes(g.id);
              return <button key={g.id} onClick={() => setSelGoals(prev => active ? prev.filter(x => x !== g.id) : [...prev, g.id])} style={{ background: active ? T.black : T.white, color: active ? T.white : T.ink, border: `1.5px solid ${active ? T.black : T.border}`, borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 500, padding: "6px 14px", cursor: "pointer", transition: "all 0.13s" }}>{g.e} {g.label}</button>;
            })}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ key: "food", label: "🍽 Include free food stops", val: incFood, set: setIncFood }, { key: "rest", label: "🌿 Schedule rest breaks", val: incRest, set: setIncRest }].map(({ key, label, val, set }) => (
              <div key={key} onClick={() => set(v => !v)} style={{ flex: 1, background: val ? T.pinkSoft : T.white, border: `1.5px solid ${val ? T.pinkDark : T.border}`, borderRadius: 10, padding: "10px 12px", cursor: "pointer", fontSize: 12, fontWeight: 500, color: val ? T.pinkDark : T.muted, textAlign: "center", transition: "all 0.15s" }}>{label}</div>
            ))}
          </div>
        </>}

        {step === 2 && <>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.sageDark, marginBottom: 6 }}>Step 3 of 3</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 900, fontStyle: "italic", color: T.black, margin: "0 0 8px", lineHeight: 1.2 }}>Speakers or people<br />you want to meet?</h2>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 14 }}>Type a name and press Enter. Or skip — the AI will use your goals.</p>
          <div style={{ background: T.white, border: `1.5px solid ${T.border}`, borderRadius: 12, padding: "10px 12px", minHeight: 70, cursor: "text" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: tags.length ? 6 : 0 }}>
              {tags.map((p, i) => <span key={i} style={{ background: T.black, color: T.cream, borderRadius: 100, fontSize: 11, fontWeight: 500, padding: "3px 10px", display: "flex", alignItems: "center", gap: 4 }}>{p}<span onClick={() => setTags(t => t.filter((_, j) => j !== i))} style={{ cursor: "pointer", opacity: 0.6, fontSize: 13 }}>×</span></span>)}
            </div>
            <input value={people} onChange={e => setPeople(e.target.value)} onKeyDown={addTag} placeholder={tags.length ? "Add more…" : "e.g. Mark Cuban, Emma Grede, Hayley Williams…"} style={{ border: "none", background: "transparent", fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: T.ink, width: "100%", padding: 0 }} />
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>Press Enter after each name</div>
          <div style={{ background: "#F0F8EB", border: "1.5px solid #C8DFB8", borderRadius: 10, padding: "10px 14px", marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.sageDark, marginBottom: 3 }}>🌱 PLAY Social Club tip</div>
            <div style={{ fontSize: 12, color: "#5A7A4A", lineHeight: 1.5 }}>SXSW is a marathon. We'll build in recovery time and free food stops so you actually enjoy the week — not just survive it.</div>
          </div>
        </>}

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22 }}>
          {step > 0 ? <button onClick={() => setStep(s => s - 1)} style={{ background: "transparent", border: "none", color: T.muted, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>← Back</button> : <span />}
          <button onClick={next} disabled={!canNext} style={{ background: canNext ? T.black : "#ccc", color: T.cream, border: "none", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, padding: "11px 28px", cursor: canNext ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
            {step < 2 ? "Continue →" : "Generate My Schedule ✦"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LOADING ───────────────────────────────────────────────────────────
function Loading({ prefs, onDone }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => { setMsgIdx(i => (i + 1) % LOADING_MSGS.length); setProgress(p => Math.min(p + 14, 90)); }, 900);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    async function gen() {
      try {
        const summary = DB.map(s => ({ id: s.id, day: s.day, time: s.t, title: s.title.replace(" ✦ Umama Speaking", ""), event: s.ev, goals: s.g, cat: s.cat, food: s.food, free: s.free, speakers: s.sp.slice(0, 2).join("; ") }));
        const res = await fetch("/api/generate", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514", max_tokens: 1000,
            system: `You are a SXSW schedule curator. Return ONLY valid JSON. Format exactly:
{"schedule":{"Thursday":[ids],"Friday":[ids],"Saturday":[ids],"Sunday":[ids],"Monday":[ids]},"tip":"one short encouraging sentence"}
Rules: 2-4 sessions per day max. Include at least 1 food/meal session per day if available. If includeRest is true, add the string "rest_[day]" (e.g., "rest_Friday") once per day that has 3+ sessions. Prioritize matching user goals. If people names are mentioned, prioritize sessions featuring those speakers. Never include conflicting same-time sessions.`,
            messages: [{ role: "user", content: `User intention: "${prefs.intention}"\nGoals: ${prefs.goals.join(", ")}\nPeople to meet: ${prefs.people.join(", ") || "none"}\nInclude food: ${prefs.includeFood}\nInclude rest: ${prefs.includeRest}\n\nAll sessions:\n${JSON.stringify(summary)}` }]
          })
        });
        const data = await res.json();
        const text = data.content?.find(b => b.type === "text")?.text || "";
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        setProgress(100);
        setTimeout(() => onDone(parsed.schedule, parsed.tip || "Go build something unforgettable this week."), 400);
      } catch {
        const fallback = {};
        DAYS.forEach(d => {
          const ds = DB.filter(s => s.day === d);
          const matched = ds.filter(s => s.g.some(g => prefs.goals.includes(g)));
          const foods = ds.filter(s => s.food);
          const picks = [...new Set([...(foods[0] ? [foods[0].id] : []), ...matched.slice(0, 3).map(s => s.id)])];
          if (prefs.includeRest && picks.length >= 2) picks.splice(1, 0, `rest_${d}`);
          if (picks.length > 0) fallback[d] = picks;
        });
        setProgress(100);
        setTimeout(() => onDone(fallback, "Your schedule is ready — go make it happen!"), 400);
      }
    }
    gen();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, backgroundImage: `radial-gradient(circle,#00000012 1px,transparent 1px)`, backgroundSize: "22px 22px", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      <div style={{ background: T.cream, border: `2px solid ${T.black}`, borderRadius: 20, padding: "44px 36px", maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "6px 6px 0 rgba(0,0,0,0.1)" }}>
        <div style={{ fontSize: 48, marginBottom: 18, animation: "pulse 1.5s ease-in-out infinite" }}>✦</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: T.black, margin: "0 0 8px" }}>Building your schedule…</h2>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 22, height: 20 }}>{LOADING_MSGS[msgIdx]}</p>
        <div style={{ background: T.border, borderRadius: 100, height: 8, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: T.black, borderRadius: 100, transition: "width 0.6s ease" }} />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
          {prefs.goals.map(g => { const gd = GOALS.find(x => x.id === g); return gd ? <span key={g} style={{ fontSize: 11, background: T.border, borderRadius: 100, padding: "3px 10px", opacity: 0.7 }}>{gd.e} {gd.label}</span> : null; })}
        </div>
      </div>
    </div>
  );
}

// ─── EventCard for Explore panel ─────────────────────────────────────
function EventCard({ s, inPlan, onAdd }) {
  const [exp, setExp] = useState(false);
  const [c, bg] = EV_C[s.ev] || [T.muted, T.cream];
  const isYou = s.title.includes("Umama");
  const url = SESSION_URL[s.id] || EV_URL[s.ev];
  const topicList = getTopics(s);
  return (
    <div onClick={() => setExp(e => !e)} style={{
      background: isYou ? "#FDF5FF" : T.white,
      border: `1px solid ${isYou ? "#D8B4FE" : T.border}`,
      borderLeft: `3px solid ${isYou ? "#A855F7" : c}`,
      borderRadius: 10, padding: "10px 12px", cursor: "pointer",
      boxShadow: exp ? "0 4px 16px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.15s",
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        {/* Time column */}
        <div style={{ minWidth: 54, flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: c }}>{s.t}</div>
          {s.e2 && <div style={{ fontSize: 9, color: T.muted }}>{s.e2}</div>}
          <div style={{ fontSize: 9, color: T.muted, fontWeight: 600, textTransform: "uppercase", marginTop: 1 }}>{s.day.slice(0,3)} {DD[s.day]?.replace("Mar ","")}</div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 3, alignItems: "center" }}>
            <span style={{ background: bg, color: c, border: `1px solid ${c}33`, borderRadius: 4, fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", padding: "1px 5px", whiteSpace: "nowrap" }}>{s.ev}</span>
            {isYou && <span style={{ background: "#FAF5FF", color: "#9333EA", fontSize: 8, fontWeight: 800, padding: "1px 5px", borderRadius: 4, border: "1px solid #D8B4FE" }}>✦ YOU</span>}
            {s.free && <span style={{ background: "#EDF5E8", color: "#5AAF7A", fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4 }}>FREE</span>}
            {s.food && <span style={{ background: "#FBF6E8", color: "#C4A24A", fontSize: 8, fontWeight: 700, padding: "1px 5px", borderRadius: 4 }}>🍽</span>}
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 700, color: T.ink, lineHeight: 1.3 }}>{s.title.replace(" ✦ Umama Speaking","")}</div>
          {s.sp.length > 0 && <div style={{ fontSize: 10, color: T.muted, marginTop: 2 }}>{s.sp.slice(0,2).map(x => x.split(" — ")[0]).join(", ")}{s.sp.length > 2 ? ` +${s.sp.length-2}` : ""}</div>}
          {exp && (
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
              {s.sp.length > 0 && <div style={{ marginBottom: 6 }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>Speakers</div>
                {s.sp.map((p, i) => <div key={i} style={{ fontSize: 11, color: T.ink, lineHeight: 1.6 }}>· {p}</div>)}
              </div>}
              <div style={{ fontSize: 10, color: T.muted, marginBottom: 6 }}>📍 {s.v}</div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {topicList.map(tid => { const td = TOPICS.find(x => x.id === tid); return td ? <span key={tid} style={{ background: td.color + "18", color: td.color, border: `1px solid ${td.color}33`, borderRadius: 4, fontSize: 9, padding: "1px 6px", fontWeight: 600 }}>{td.e} {td.label}</span> : null; })}
              </div>
              {url && <a href={url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                style={{ display: "inline-flex", alignItems: "center", gap: 4, background: T.black, color: T.cream, borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, padding: "6px 14px", textDecoration: "none" }}>
                RSVP / Register ↗
              </a>}
            </div>
          )}
        </div>
        {/* Actions column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
          <button onClick={e => { e.stopPropagation(); if (!inPlan) onAdd(s.day, s.id); }} style={{
            background: inPlan ? T.sage : T.black, color: T.cream, border: "none",
            borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700,
            padding: "5px 10px", cursor: inPlan ? "default" : "pointer", whiteSpace: "nowrap",
            opacity: inPlan ? 0.7 : 1, transition: "all 0.12s",
          }}>{inPlan ? "✓" : "+ Add"}</button>
          {url && !exp && <a href={url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            style={{ fontSize: 9, fontWeight: 700, color: T.pinkDark, textDecoration: "none" }}>RSVP ↗</a>}
          <span style={{ fontSize: 9, color: T.muted }}>{exp ? "▲" : "▼"}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Mini schedule panel (left column) ───────────────────────────────
function MiniSchedule({ plan, activeDay, setActiveDay, onDelete, onAdd }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const planIds = Object.values(plan).flat().filter(x => typeof x === "number");
  const currentList = plan[activeDay] || [];

  function handleDrop(dropIdx) {
    if (dragIdx === null || dragIdx === dropIdx) { setDragIdx(null); setDragOver(null); return; }
    const arr = [...currentList];
    const [rm] = arr.splice(dragIdx, 1);
    arr.splice(dropIdx, 0, rm);
    onDelete.__setPlan(p => ({ ...p, [activeDay]: arr }));
    setDragIdx(null); setDragOver(null);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Day tabs */}
      <div style={{ display: "flex", gap: 3, overflowX: "auto", padding: "8px 12px 0", flexShrink: 0 }}>
        {DAYS.map(d => {
          const cnt = (plan[d] || []).length;
          const isA = activeDay === d;
          return (
            <button key={d} onClick={() => setActiveDay(d)} style={{
              background: isA ? T.black : "transparent",
              color: isA ? T.cream : T.muted,
              border: `1px solid ${isA ? T.black : T.border}`,
              borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 10,
              fontWeight: 600, padding: "3px 8px", cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.1s", flexShrink: 0,
            }}>
              {d.slice(0,3)}
              {cnt > 0 && <span style={{ marginLeft: 3, background: isA ? "rgba(255,255,255,0.3)" : T.border, borderRadius: 100, fontSize: 8, padding: "0 4px" }}>{cnt}</span>}
            </button>
          );
        })}
      </div>

      {/* Day label */}
      <div style={{ padding: "6px 12px 4px", flexShrink: 0, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 12, fontStyle: "italic", color: T.ink }}>{activeDay} <span style={{ color: T.muted, fontFamily: "'DM Sans',sans-serif", fontStyle: "normal", fontSize: 10 }}>{DD[activeDay]}</span></div>
        <div style={{ fontSize: 9, color: T.muted }}>drag to reorder · {planIds.length} total</div>
      </div>

      {/* Sessions list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
        {currentList.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 8px", color: T.muted, fontSize: 11, lineHeight: 1.5 }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>📅</div>
            Add sessions from the explore panel →
          </div>
        ) : currentList.map((e, i) => {
          const isSpecial = typeof e === "string";
          const isRest = isSpecial && e.startsWith("rest");
          const isFoodBump = isSpecial && e.startsWith("food");
          const s = isSpecial ? null : DB.find(x => x.id === e);
          if (!isSpecial && !s) return null;
          const [c] = isRest ? ["#8BA87A"] : isFoodBump ? ["#C4A24A"] : s ? (EV_C[s.ev] || [T.muted]) : [T.muted];
          const isYou = s?.title?.includes("Umama");
          const isDrg = dragIdx === i;
          const isDrop = dragOver === i && dragIdx !== i;
          return (
            <div key={`${e}-${i}`} draggable
              onDragStart={() => { setDragIdx(i); setDragOver(null); }}
              onDragOver={ev => { ev.preventDefault(); setDragOver(i); }}
              onDrop={() => handleDrop(i)}
              style={{
                background: isYou ? "#FDF5FF" : "#FAFAF8",
                border: `1px solid ${isDrop ? c : (isYou ? "#D8B4FE" : T.border)}`,
                borderLeft: `3px solid ${isYou ? "#A855F7" : c}`,
                borderRadius: 6, padding: "5px 7px", cursor: "grab",
                opacity: isDrg ? 0.3 : 1, transition: "all 0.1s",
                display: "flex", gap: 5, alignItems: "center",
                boxShadow: isDrop ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
              }}>
              <div style={{ color: "#ddd", fontSize: 10, flexShrink: 0 }}>⠿</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                {isRest && <div style={{ fontSize: 10, fontWeight: 600, color: "#8BA87A" }}>🌿 Rest break</div>}
                {isFoodBump && <div style={{ fontSize: 10, fontWeight: 600, color: "#C4A24A" }}>🍽 Food stop</div>}
                {s && <>
                  <div style={{ fontSize: 9, color: c, fontWeight: 700, textTransform: "uppercase" }}>{s.t}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: T.ink, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title.replace(" ✦ Umama Speaking","")}</div>
                  {(SESSION_URL[s.id] || EV_URL[s.ev]) && (
                    <a href={SESSION_URL[s.id] || EV_URL[s.ev]} target="_blank" rel="noopener noreferrer"
                      onClick={ev => ev.stopPropagation()} style={{ fontSize: 9, color: T.pinkDark, fontWeight: 700, textDecoration: "none" }}>RSVP ↗</a>
                  )}
                </>}
              </div>
              <button onClick={() => onDelete(i)} style={{ background: "none", border: "none", color: "#ccc", fontSize: 13, cursor: "pointer", padding: "0 1px", flexShrink: 0, lineHeight: 1 }}>×</button>
            </div>
          );
        })}
        {currentList.length > 0 && (
          <div onDragOver={e => e.preventDefault()} onDrop={() => handleDrop(currentList.length)}
            style={{ height: 28, border: `1.5px dashed ${T.border}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: T.muted }}>
            drop here
          </div>
        )}
      </div>

      {/* Footer quick-add */}
      <div style={{ padding: "6px 10px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 4, flexShrink: 0 }}>
        <button onClick={() => onAdd(activeDay, "rest")} style={{ flex: 1, background: "#EDF5E8", color: T.sageDark, border: `1px solid ${T.sageDark}33`, borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600, padding: "5px 0", cursor: "pointer" }}>🌿 Rest</button>
        <button onClick={() => onAdd(activeDay, "food")} style={{ flex: 1, background: "#FBF6E8", color: "#C4A24A", border: "1px solid #C4A24A33", borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600, padding: "5px 0", cursor: "pointer" }}>🍽 Food</button>
      </div>
    </div>
  );
}

// ─── MAIN BUILDER ─────────────────────────────────────────────────────
function Builder({ plan, setPlan, tip, onExport }) {
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 860;
  const isMobile = windowWidth < 600;

  const [activeDay, setActiveDay] = useState("Saturday");
  const [mobileTab, setMobileTab] = useState("explore"); // "schedule" | "explore"
  const [topicFilter, setTopicFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("All");
  const [venueFilter, setVenueFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const specialCnt = useRef(0);

  const planIds = Object.values(plan).flat().filter(x => typeof x === "number");
  const totalS = planIds.length;

  function deleteEntry(idx) { setPlan(p => ({ ...p, [activeDay]: p[activeDay].filter((_,i) => i !== idx) })); }
  function addEntry(day, idOrStr) {
    const val = (idOrStr === "rest" || idOrStr === "food") ? `${idOrStr}_${++specialCnt.current}` : idOrStr;
    setPlan(p => ({ ...p, [day]: [...(p[day] || []), val] }));
  }
  // attach setPlan to deleteEntry so MiniSchedule can reorder
  deleteEntry.__setPlan = setPlan;

  const venues = useMemo(() => ["All", ...new Set(DB.map(s => s.ev))], []);

  const activeFilters = [topicFilter !== "all", dayFilter !== "All", venueFilter !== "All", search.trim() !== ""].filter(Boolean).length;

  const exploreResults = useMemo(() => {
    let s = DB;
    if (topicFilter !== "all") s = s.filter(x => getTopics(x).includes(topicFilter));
    if (dayFilter !== "All") s = s.filter(x => x.day === dayFilter);
    if (venueFilter !== "All") s = s.filter(x => x.ev === venueFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      s = s.filter(x => x.title.toLowerCase().includes(q) || x.sp.some(p => p.toLowerCase().includes(q)) || x.ev.toLowerCase().includes(q) || getTopics(x).some(t => TOPICS.find(tp => tp.id === t)?.label.toLowerCase().includes(q)));
    }
    return s.sort((a,b) => { const di = DAYS.indexOf(a.day) - DAYS.indexOf(b.day); return di !== 0 ? di : tm(a.t) - tm(b.t); });
  }, [topicFilter, dayFilter, venueFilter, search]);

  // Group results by day for section headers
  const grouped = useMemo(() => {
    const g = {};
    for (const s of exploreResults) {
      if (!g[s.day]) g[s.day] = [];
      g[s.day].push(s);
    }
    return g;
  }, [exploreResults]);

  const clearFilters = () => { setTopicFilter("all"); setDayFilter("All"); setVenueFilter("All"); setSearch(""); };

  const daysWithContent = DAYS.filter(d => (plan[d] || []).length > 0);
  const schedulePanel = (
    <MiniSchedule
      plan={plan}
      activeDay={activeDay}
      setActiveDay={setActiveDay}
      onDelete={deleteEntry}
      onAdd={addEntry}
    />
  );

  const explorePanel = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Search bar */}
      <div style={{ padding: "10px 12px 6px", flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: T.muted, pointerEvents: "none" }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search events, speakers, topics…"
            style={{ width: "100%", boxSizing: "border-box", background: T.white, border: `1.5px solid ${search ? T.black : T.border}`, borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: T.ink, padding: "7px 36px 7px 32px", outline: "none", transition: "border 0.15s" }} />
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: T.muted }}>×</button>}
        </div>
      </div>

      {/* Topic category pills - scrollable */}
      <div style={{ padding: "0 12px 6px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }}>
          {TOPICS.map(tp => {
            const isA = topicFilter === tp.id;
            const cnt = tp.id === "all" ? DB.length : DB.filter(s => getTopics(s).includes(tp.id)).length;
            return (
              <button key={tp.id} onClick={() => setTopicFilter(isA && tp.id !== "all" ? "all" : tp.id)} style={{
                background: isA ? tp.color : T.white,
                color: isA ? "#fff" : T.ink,
                border: `1.5px solid ${isA ? tp.color : T.border}`,
                borderRadius: 100, fontFamily: "'DM Sans',sans-serif",
                fontSize: 11, fontWeight: isA ? 700 : 500,
                padding: "5px 11px", cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.12s", display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
              }}>
                <span>{tp.e}</span>
                <span>{tp.label}</span>
                <span style={{ fontSize: 9, opacity: 0.7, background: isA ? "rgba(255,255,255,0.2)" : T.border, borderRadius: 100, padding: "0 4px" }}>{cnt}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day filter pills - always visible */}
      <div style={{ padding: "0 12px 6px", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }}>
          <button onClick={() => setDayFilter("All")} style={{
            background: dayFilter === "All" ? T.black : T.white,
            color: dayFilter === "All" ? T.cream : T.muted,
            border: `1.5px solid ${dayFilter === "All" ? T.black : T.border}`,
            borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600,
            padding: "4px 11px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.12s", flexShrink: 0,
          }}>All Days</button>
          {DAYS.map(d => (
            <button key={d} onClick={() => setDayFilter(dayFilter === d ? "All" : d)} style={{
              background: dayFilter === d ? T.ink : T.white,
              color: dayFilter === d ? T.cream : T.muted,
              border: `1.5px solid ${dayFilter === d ? T.ink : T.border}`,
              borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600,
              padding: "4px 11px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.12s", flexShrink: 0,
            }}>{d.slice(0,3)} <span style={{ opacity: 0.65, fontSize: 10 }}>{DD[d]}</span></button>
          ))}
        </div>
      </div>

      {/* Secondary filters row - venue only */}
      <div style={{ padding: "0 12px 6px", flexShrink: 0 }}>
        <button onClick={() => setShowFilters(f => !f)} style={{
          background: (venueFilter !== "All" || search.trim()) ? T.black : T.white,
          color: (venueFilter !== "All" || search.trim()) ? T.cream : T.muted,
          border: `1px solid ${(venueFilter !== "All" || search.trim()) ? T.black : T.border}`, borderRadius: 6,
          fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600,
          padding: "4px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 5,
        }}>
          ⚙ Venue filter {venueFilter !== "All" ? `(${venueFilter})` : ""} {showFilters ? "▲" : "▼"}
        </button>
        {showFilters && (
          <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
            <select value={venueFilter} onChange={e => setVenueFilter(e.target.value)} style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 11, padding: "4px 7px", color: T.ink, cursor: "pointer", maxWidth: 200 }}>
              <option value="All">All Venues</option>
              {venues.slice(1).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            {activeFilters > 0 && <button onClick={clearFilters} style={{ background: "none", border: "none", color: T.pinkDark, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>✕ Clear all</button>}
          </div>
        )}
      </div>

      {/* Results count */}
      <div style={{ padding: "0 12px 6px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 11, color: T.muted }}>
          <strong style={{ color: T.ink }}>{exploreResults.length}</strong> events
          {topicFilter !== "all" && <span style={{ color: TOPICS.find(t => t.id === topicFilter)?.color || T.ink }}> · {TOPICS.find(t => t.id === topicFilter)?.label}</span>}
        </div>
        <div style={{ fontSize: 11, color: T.pinkDark, fontWeight: 600 }}>♥ {totalS} saved</div>
      </div>

      {/* Events list grouped by day */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 20px" }}>
        {exploreResults.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontStyle: "italic", color: T.muted, marginBottom: 8 }}>no events found</div>
            <button onClick={clearFilters} style={{ background: T.black, color: T.cream, border: "none", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, padding: "8px 20px", cursor: "pointer" }}>Clear filters</button>
          </div>
        ) : (
          // if filtering by single day, no day headers needed
          dayFilter !== "All" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {exploreResults.map(s => <EventCard key={s.id} s={s} inPlan={planIds.includes(s.id)} onAdd={(day, id) => { addEntry(day, id); setActiveDay(day); }} />)}
            </div>
          ) : (
            DAYS.filter(d => grouped[d]?.length > 0).map(d => (
              <div key={d}>
                <div style={{ position: "sticky", top: 0, background: T.black, color: T.cream, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, padding: "5px 10px", margin: "8px -12px 5px", letterSpacing: "0.06em", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>{d.toUpperCase()} · {DD[d]}</span>
                  <span style={{ opacity: 0.6, fontWeight: 500 }}>{grouped[d].length} events</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {grouped[d].map(s => <EventCard key={s.id} s={s} inPlan={planIds.includes(s.id)} onAdd={(day, id) => { addEntry(day, id); setActiveDay(day); }} />)}
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: T.bg, fontFamily: "'DM Sans',sans-serif", overflow: "hidden" }}>
      <style>{`
        ::-webkit-scrollbar{width:4px;height:4px} ::-webkit-scrollbar-track{background:transparent} ::-webkit-scrollbar-thumb{background:#D0CEC8;border-radius:4px}
        @keyframes sxIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .ev-in{animation:sxIn 0.2s both}
      `}</style>

      {/* ── TOP HEADER ── */}
      <div style={{ background: T.cream, borderBottom: `2px solid ${T.black}`, padding: "10px 16px", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.sageDark }}>SXSW 2026 · Austin TX</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: isMobile ? 15 : 18, fontWeight: 900, fontStyle: "italic", color: T.black, lineHeight: 1.1 }}>
              {totalS > 0 ? `${totalS} session${totalS !== 1 ? "s" : ""} saved` : "Build your schedule"}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
            {tip && !isMobile && <div style={{ fontSize: 11, color: T.pinkDark, fontStyle: "italic", maxWidth: 180 }}>✦ {tip}</div>}
            <a href="https://pienelope.com/" target="_blank" rel="noopener noreferrer" style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              background: T.pink, color: T.black, border: `1.5px solid ${T.pinkDark}`,
              borderRadius: 10, fontFamily: "'DM Sans',sans-serif",
              padding: "5px 11px", textDecoration: "none", cursor: "pointer",
              boxShadow: "2px 2px 0 rgba(0,0,0,0.08)", transition: "transform 0.12s, box-shadow 0.12s",
              whiteSpace: "nowrap", flexShrink: 0,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "3px 4px 0 rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "2px 2px 0 rgba(0,0,0,0.08)"; }}
            >
              <div style={{ fontSize: isMobile ? 10 : 11, fontWeight: 800, letterSpacing: "0.01em" }}>💬 Text Pienelope</div>
              <div style={{ fontSize: 9, color: T.pinkDark, fontWeight: 500, lineHeight: 1.2, textAlign: "center" }}>on-the-go event & food recs</div>
            </a>
            <button onClick={onExport} style={{ background: T.black, color: T.cream, border: "none", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 700, padding: "7px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>📸 Export</button>
          </div>
        </div>
        {/* Quick day stats */}
        <div style={{ display: "flex", gap: 5, marginTop: 7, overflowX: "auto" }}>
          {DAYS.map(d => {
            const cnt = (plan[d] || []).length;
            return (
              <button key={d} onClick={() => { setActiveDay(d); if (!isDesktop) setMobileTab("schedule"); }} style={{
                background: activeDay === d ? T.black : cnt > 0 ? T.cream : "transparent",
                color: activeDay === d ? T.cream : cnt > 0 ? T.ink : T.muted,
                border: `1px solid ${activeDay === d ? T.black : cnt > 0 ? T.border : T.border}`,
                borderRadius: 6, fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600,
                padding: "3px 8px", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.1s",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <span>{d.slice(0,3)}</span>
                {cnt > 0 && <span style={{ background: activeDay === d ? "rgba(255,255,255,0.25)" : "#E0DDD6", borderRadius: 100, fontSize: 9, padding: "0 4px" }}>{cnt}</span>}
              </button>
            );
          })}
          <div style={{ flexShrink: 0, marginLeft: 4, fontSize: 10, color: T.muted, display: "flex", alignItems: "center" }}>
            {daysWithContent.length} days · {planIds.filter(id => DB.find(s => s.id === id && s.free)).length} free events
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      {isDesktop ? (
        // DESKTOP: side-by-side
        <div style={{ flex: 1, display: "flex", overflow: "hidden", gap: 0 }}>
          {/* Left: Schedule panel */}
          <div style={{ width: 280, minWidth: 240, borderRight: `2px solid ${T.black}`, background: T.cream, display: "flex", flexDirection: "column", overflow: "hidden", flexShrink: 0 }}>
            <div style={{ padding: "8px 12px 4px", borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: T.ink }}>My Schedule</div>
            </div>
            {schedulePanel}
          </div>
          {/* Right: Explore panel */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#F4F2EC" }}>
            <div style={{ padding: "8px 12px 4px", borderBottom: `1px solid ${T.border}`, flexShrink: 0, background: T.cream }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: T.ink }}>Explore All Events</div>
            </div>
            {explorePanel}
          </div>
        </div>
      ) : (
        // MOBILE: tabbed
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", background: T.cream, borderBottom: `2px solid ${T.black}`, flexShrink: 0 }}>
            {[{ k: "explore", l: "🔍 Explore", sub: `${DB.length} events` }, { k: "schedule", l: "📋 My Schedule", sub: `${totalS} saved` }].map(({ k, l, sub }) => (
              <button key={k} onClick={() => setMobileTab(k)} style={{
                flex: 1, background: mobileTab === k ? T.black : "transparent",
                color: mobileTab === k ? T.cream : T.muted, border: "none",
                fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 700,
                padding: "10px 0", cursor: "pointer", transition: "all 0.12s",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
              }}>
                <span>{l}</span>
                <span style={{ fontSize: 9, opacity: 0.7 }}>{sub}</span>
              </button>
            ))}
          </div>
          {/* Panel */}
          <div style={{ flex: 1, overflow: "hidden", background: mobileTab === "explore" ? "#F4F2EC" : T.cream }}>
            {mobileTab === "explore" ? explorePanel : schedulePanel}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EXPORT VIEW ──────────────────────────────────────────────────────
function ExportView({ plan, onBack }) {
  const [dayCanvases, setDayCanvases] = useState({});
  const [rendering, setRendering] = useState(true);
  const [activePreview, setActivePreview] = useState(null);

  const daysWithData = DAYS.filter(d => (plan[d] || []).length > 0);

  useEffect(() => {
    async function renderAll() {
      const canvases = {};
      for (const d of daysWithData) {
        try {
          canvases[d] = await drawDayStory(d, plan[d] || []);
        } catch (e) { console.error(e); }
      }
      setDayCanvases(canvases);
      setActivePreview(daysWithData[0] || null);
      setRendering(false);
    }
    renderAll();
  }, []);

  function downloadDay(day) {
    const canvas = dayCanvases[day];
    if (!canvas) return;
    try {
      const url = canvas.toDataURL("image/png");
      const a = Object.assign(document.createElement("a"), { href: url, download: `sxsw-2026-${day.toLowerCase()}-schedule.png` });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } catch { alert("Right-click the image → Save As to download!"); }
  }

  function downloadAll() { daysWithData.forEach(d => { if (dayCanvases[d]) setTimeout(() => downloadDay(d), 200); }); }

  return (
    <div style={{ minHeight: "100vh", background: T.bg, backgroundImage: `radial-gradient(circle,#00000012 1px,transparent 1px)`, backgroundSize: "22px 22px", fontFamily: "'DM Sans',sans-serif", padding: 20 }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <button onClick={onBack} style={{ background: "transparent", border: "none", color: T.ink, fontSize: 13, cursor: "pointer", marginBottom: 14, fontFamily: "'DM Sans',sans-serif" }}>← Back to schedule</button>

        {/* Header card */}
        <div style={{ background: T.cream, border: `2px solid ${T.black}`, borderRadius: 16, padding: "20px 22px", marginBottom: 16, boxShadow: "4px 4px 0 rgba(0,0,0,0.08)" }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: T.black, margin: "0 0 6px" }}>Save as Instagram Stories</h2>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.5, margin: "0 0 16px" }}>
            Each day is its own <strong style={{ color: T.ink }}>9×16 story image</strong> — perfect for your IG story or phone wallpaper.
          </p>
          {rendering ? (
            <div style={{ background: T.border, borderRadius: 8, padding: "12px", textAlign: "center", fontSize: 12, color: T.muted }}>⏳ Rendering {daysWithData.length} story images…</div>
          ) : (
            <>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {daysWithData.map(d => (
                  <button key={d} onClick={() => setActivePreview(d)} style={{ background: activePreview === d ? T.black : T.white, color: activePreview === d ? T.cream : T.muted, border: `1.5px solid ${activePreview === d ? T.black : T.border}`, borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 12, fontWeight: 600, padding: "6px 14px", cursor: "pointer" }}>
                    {d.slice(0, 3)} {DD[d]}
                  </button>
                ))}
              </div>
              {activePreview && (
                <button onClick={() => downloadDay(activePreview)} style={{ width: "100%", background: T.black, color: T.cream, border: "none", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 600, padding: "12px 0", cursor: "pointer", marginBottom: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
                  ⬇ Download {activePreview} Story
                </button>
              )}
              {daysWithData.length > 1 && (
                <button onClick={downloadAll} style={{ width: "100%", background: T.sage, color: T.black, border: "none", borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 600, padding: "10px 0", cursor: "pointer" }}>
                  ⬇ Download All {daysWithData.length} Stories
                </button>
              )}
            </>
          )}
          <div style={{ marginTop: 10, fontSize: 11, color: T.muted, lineHeight: 1.5 }}>
            Mobile: press & hold image → Save to Photos<br />
            Desktop: right-click image → Save Image As
          </div>
        </div>

        {/* Day preview canvases */}
        {!rendering && activePreview && dayCanvases[activePreview] && (
          <div style={{ borderRadius: 16, overflow: "hidden", border: `2px solid ${T.black}`, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
            <img src={dayCanvases[activePreview].toDataURL("image/png")} alt={`${activePreview} story`} style={{ width: "100%", display: "block" }} />
          </div>
        )}

        {rendering && (
          <div style={{ background: T.cream, border: `1.5px solid ${T.border}`, borderRadius: 16, padding: "60px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontStyle: "italic", color: T.muted }}>rendering stories…</div>
          </div>
        )}

        {/* All day previews as thumbnails */}
        {!rendering && daysWithData.length > 1 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: T.muted, marginBottom: 8 }}>All Days</div>
            <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
              {daysWithData.map(d => dayCanvases[d] && (
                <div key={d} onClick={() => setActivePreview(d)} style={{ flexShrink: 0, cursor: "pointer", border: `2px solid ${activePreview === d ? T.black : T.border}`, borderRadius: 10, overflow: "hidden", width: 80, boxShadow: activePreview === d ? "0 4px 12px rgba(0,0,0,0.15)" : "none", transition: "all 0.15s" }}>
                  <img src={dayCanvases[d].toDataURL("image/png")} alt={d} style={{ width: "100%", display: "block" }} />
                  <div style={{ background: activePreview === d ? T.black : T.cream, color: activePreview === d ? T.cream : T.muted, fontFamily: "'DM Sans',sans-serif", fontSize: 10, fontWeight: 600, textAlign: "center", padding: "4px 0" }}>{d.slice(0, 3)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [prefs, setPrefs] = useState(null);
  const [plan, setPlan] = useState({ Thursday: [], Friday: [], Saturday: [], Sunday: [], Monday: [] });
  const [tip, setTip] = useState("");

  function handleOnboardDone(p) { setPrefs(p); setPage("loading"); }

  function handleGenDone(schedule, tipText) {
    const clean = {};
    DAYS.forEach(d => { clean[d] = (schedule[d] || []); });
    setPlan(clean);
    setTip(tipText);
    setPage("builder");
  }

  return (
    <>
      {page === "landing" && <Landing onStart={() => setPage("onboarding")} />}
      {page === "onboarding" && <Onboarding onComplete={handleOnboardDone} />}
      {page === "loading" && <Loading prefs={prefs} onDone={handleGenDone} />}
      {page === "builder" && <Builder plan={plan} setPlan={setPlan} tip={tip} onExport={() => setPage("export")} />}
      {page === "export" && <ExportView plan={plan} onBack={() => setPage("builder")} />}
    </>
  );
}
