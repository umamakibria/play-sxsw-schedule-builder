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

// Dynamic venue color based on venue name hash
function getVenueColor(venue) {
  let hash = 0;
  for (let i = 0; i < venue.length; i++) hash = venue.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return [`hsl(${h}, 45%, 45%)`, `hsl(${h}, 30%, 95%)`];
}

// Per-session RSVP/registration URLs
const EV_URL = {};

const SESSION_URL = {
  1: "https://www.fairmont-austin.com/events/wellness-mornings-at-sxsw/",
  2: "https://event.onepeloton.com/pelotoninaustinoutdoor",
  3: "https://luma.com/bcv3b3cl",
  4: "https://luma.com/v4xwa416",
  5: "https://kutx.org/live-events/sxsw/kutx-sxsw-2026/",
  6: "https://luma.com/jv402h03",
  7: "https://www.eventbrite.com/e/ryze-coffee-shop-sxsw-popup-tickets-1982984236231",
  8: "https://house.capitalfactory.com/",
  9: "https://schedule.sxsw.com/2026/events/OE46487",
  10: "https://evolutions.podcastmovement.com/",
  11: "https://luma.com/u4q9akh7",
  12: "https://www.eventbrite.com/e/jvn-hair-masterclass-w-founder-jonathan-van-ness-ulta-austin-tickets-1983976382768",
  13: "https://www.eventbrite.com/e/2026-swift-fit-recovery-lounge-tickets-1983392926635",
  14: "https://brand-innovators.com/events/leadership-in-brand-marketing-summit-sxsw-in-austin-2026/",
  15: "https://shemedia.swoogo.com/smcolab26",
  16: "https://www.eventbrite.com/e/ryze-shine-yoga-flow-at-sxsw-popup-tickets-1983039327009",
  17: "https://www.thelatinafoundation.org/event-details-registration/house-of-chingonas-nuestra-casa-is-tu-casa",
  18: "https://events.rivian.com/sxswr2electricjoyride",
  19: "https://schedule.sxsw.com/2026/events/OE46462",
  20: "https://luma.com/g4n7m36g",
  21: "https://events.rivian.com/riviansxswroadhouse2026",
  22: "https://kssxsw26.splashthat.com/",
  23: "https://www.eventbrite.com/e/hot-girl-walk-austin-march-14-tickets-1983654265306",
  24: "https://events.thefemalequotient.com/sxsw26/invite",
  25: "https://x.com/zoox/status/2029242861661938019?s=20",
  26: "https://event.onepeloton.com/pelotoninaustinclasses",
  27: "https://saopaulohouse.com/",
  28: "https://www.fairmont-austin.com/events/wellness-mornings-at-sxsw/",
  29: "https://event.onepeloton.com/pelotoninaustinoutdoor",
  30: "https://luma.com/bcv3b3cl",
  31: "https://luma.com/v4xwa416",
  32: "https://kutx.org/live-events/sxsw/kutx-sxsw-2026/",
  33: "https://luma.com/jv402h03",
  34: "https://www.eventbrite.com/e/ryze-coffee-shop-sxsw-popup-tickets-1982984236231",
  35: "https://house.capitalfactory.com/",
  36: "https://schedule.sxsw.com/2026/events/OE46487",
  37: "https://evolutions.podcastmovement.com/",
  38: "https://luma.com/u4q9akh7",
  39: "https://www.eventbrite.com/e/jvn-hair-masterclass-w-founder-jonathan-van-ness-ulta-austin-tickets-1983976382768",
  40: "https://www.eventbrite.com/e/2026-swift-fit-recovery-lounge-tickets-1983392926635",
  41: "https://brand-innovators.com/events/leadership-in-brand-marketing-summit-sxsw-in-austin-2026/",
  42: "https://shemedia.swoogo.com/smcolab26",
  43: "https://www.eventbrite.com/e/ryze-shine-yoga-flow-at-sxsw-popup-tickets-1983039327009",
  44: "https://www.thelatinafoundation.org/event-details-registration/house-of-chingonas-nuestra-casa-is-tu-casa",
  45: "https://events.rivian.com/sxswr2electricjoyride",
  46: "https://schedule.sxsw.com/2026/events/OE46462",
  47: "https://luma.com/g4n7m36g",
  48: "https://events.rivian.com/riviansxswroadhouse2026",
  49: "https://kssxsw26.splashthat.com/",
  50: "https://www.eventbrite.com/e/hot-girl-walk-austin-march-14-tickets-1983654265306",
  51: "https://events.thefemalequotient.com/sxsw26/invite",
  52: "https://x.com/zoox/status/2029242861661938019?s=20",
  53: "https://event.onepeloton.com/pelotoninaustinclasses",
  54: "https://saopaulohouse.com/",
  55: "https://schedule.sxsw.com/2026/events/PP1162417",
  56: "https://luma.com/oow4jh38",
  57: "https://www.claconnect.com/en/events/2026/from-chaos-to-clarity-insight-driven-growth-in-a-noisy-tech-world",
  58: "https://www.eventbrite.com/e/space-house-sxsw-2026-tickets-1983032882734",
  59: "https://schedule.sxsw.com/2026/events/OE46457",
  60: "https://plainsightevents.com/sportstechandventure",
  61: "https://www.eventbrite.com/e/the-public-house-for-the-future-at-sxsw-innovation-tickets-1983964769031",
  62: "https://events.humanitix.com/festival-week-austin-texas",
  63: "https://events.fastcompany.com/grill_2026/",
  64: "https://schedule.sxsw.com/2026/events/OE46653",
  65: "https://events.voxmedia.com/podcast-stage-sxsw",
  66: "https://events.superhuman.com/sxsw-2026/",
  67: "https://luma.com/tn.house.saturday",
  68: "https://web.cvent.com/event/d93ab4bc-c257-405c-8137-c366c37c30e6/summary",
  69: "https://schedule.sxsw.com/2026/events/OE46574",
  70: "https://www.theblprnt.com/getpie.at/w3Wy6MRf",
  71: "https://gatsby.events/capital-factory/rsvp/register?e=vc-brunch-2026",
  72: "https://events.inc.com/inc-founders-house-2026-austin",
  73: "https://schedule.sxsw.com/2026/events/OE46414",
  75: "https://luma.com/Mercury_SXSW_2026",
  76: "https://partiful.com/e/JmfM33WoEx8OdHgmj3OC?",
  77: "https://www.eventbrite.com/e/the-desk-that-moves-with-you-tickets-1984571690349",
  78: "https://luma.com/fp9zcvmr",
  79: "https://secure.everyaction.com/5iftoIH-QUihROr6CVh2nw2",
  80: "https://www.bmi.com/stages/sxsw2026",
  81: "https://realtor-open-house.vfairs.com//",
  82: "https://luma.com/z28pqdjv?tk=tl1WJv",
  83: "https://luma.com/vght0n78",
  84: "https://luma.com/gqhs0akm",
  85: "https://luma.com/founder-fest",
  86: "https://partiful.com/e/r5u3vOGb6o7YZYIi0UfZ",
  87: "https://luma.com/l44wgyyy",
  88: "https://austinfilmsociety.my.salesforce-sites.com/ticket/?acode=72f218ee3765e2ec2cb19895d8299d1b&utm_source=Austin+Film+Society+Email+List",
  89: "https://www.themushroomcowboy.com/event-details/the-morning-spin-cosmic-saltillo",
  90: "https://posh.vip/e/do-it-in-the-morning-rnb-party",
  91: "https://luma.com/futurepod",
  92: "https://openwav.ai/events/vision8291-sxsw-four-day-cultural-experience/2d2ee6ef-f892-44a2-a947-c63f6507841e",
  93: "https://luma.com/3kyr8lif",
  94: "https://luma.com/qt1zbrf8",
  95: "https://evenements.bpifrance.fr/e/french-touch-rendez-vous-2026",
  96: "https://luma.com/6cp3wq7o",
  97: "https://www.instagram.com/p/DUWjqMFEWDm/",
  98: "https://www.instagram.com/p/DVel3r4ji77/",
  99: "https://www.digitalvoices.com/events/sxsw-2026/turning-trends-into-commercial-impact",
  100: "https://texashotelvegas.com/event/lone-star-honky-tonk-hangover-brunch-ft-texas-string-assembly-chasen-wayne-and-line-dance-lessons-with-country-fried-dance-ed-west/",
  101: "https://event.onepeloton.com/pelotoninaustinclasses",
  102: "https://www.eventbrite.com/e/blumhouses-sxsw-horror-trivia-meet-up-tickets-1984582101489",
  103: "https://schedule.sxsw.com/search?q=Congress+Avenue+Block+Party",
  104: "https://posh.vip/e/nike-air-max-95-og-bandana-release-party",
  105: "https://www.eventbrite.com/e/the-lunch-break-that-works-for-you-tickets-1984572550923",
  106: "https://schedule.sxsw.com/events/OE47108",
  107: "https://luma.com/t6h663yb",
  108: "https://docs.google.com/forms/d/e/1FAIpQLScbu0VVte63Ko1qj2hKwgFd-sn87qNYBKlQrJd0WVvbg0Kq6Q/viewform?pli=1",
  109: "https://austin.stilesswitchbbq.com/-special-events",
  110: "https://luma.com/3vhdpj2i",
  111: "https://partiful.com/e/2FdS1dFUIWztpx5KOno8",
  112: "https://www.german-haus.com/program/",
  113: "https://schedule.sxsw.com/2026/events/OE46524",
  114: "https://luma.com/xhan8gh7",
  115: "https://schedule.sxsw.com/2026/venues/V2481",
  116: "https://luma.com/kwesfcnr",
  117: "https://www.eventbrite.com/e/free-st-elmo-x-st-elmo-music-festival-tickets-1984395656828",
  118: "https://schedule.sxsw.com/2026/events/OE46700",
  119: "https://luma.com/SlovakHouse",
  120: "https://schedule.sxsw.com/2026/venues/V0305",
  121: "https://www.jbl.com/sxsw.html",
  122: "https://2026.do512.com/events/2026/3/12/meanwhile-colton-house-w-rattlesnake-milk-emily-nenni-more-tickets",
  123: "https://app.viralsweep.com/sweeps/full/fd480e-222307?framed=1",
  124: "https://www.instagram.com/p/DUtCupyjjVE/",
  125: "https://axioshouseatsxsw2026.splashthat.com/",
  126: "https://www.eventbrite.com/e/music-art-life-tickets-1980315960346",
  127: "https://schedule.sxsw.com/2026/venues/V2459",
  128: "https://www.shokworks.io/sxsw-26",
  129: "https://www.eventbrite.com/e/5th-annual-austin-rhythm-revival-americana-music-showcase-austin-tx-tickets-1982908394386",
  130: "https://schedule.sxsw.com/2026/events/OE46577",
  131: "https://luma.com/60jxtyi9",
  132: "https://luma.com/SXSWsalon",
  133: "https://www.instagram.com/p/DVbptb9lpYw/",
  134: "https://paste.freshtix.com/events/paste26",
  135: "https://www.instagram.com/p/DVkQ9nDjqvr",
  136: "https://www.instagram.com/p/DVJtKY2Cc54",
  137: "https://later.com/events/sxsw",
  138: "https://www.instagram.com/p/DVjV8RnDv6a/",
  139: "https://www.instagram.com/p/DVRZGZJDyj-",
  140: "https://schedule.sxsw.com/2026/venues/V2391",
  141: "https://www.instagram.com/p/DVw70cNDeIW/",
  142: "https://schedule.sxsw.com/events/OE47022",
  143: "https://schedule.sxsw.com/events/OE46797",
  144: "https://www.eventbrite.com/e/unwell-x-sxsw-tickets-1983895769652",
  145: "https://www.instagram.com/p/DVeNQzdD0Ey/",
  146: "https://luma.com/ne0cji71",
  147: "https://gamma.app/docs/SXSW-Austin--54ug4wxh6jeotxy?mode=doc",
  148: "https://luma.com/texashouse.sxsw26",
  149: "https://www.instagram.com/p/DVbv6j8kXuR/",
  150: "https://www.regen.house/sxsw",
  151: "https://www.eventbrite.com/e/free-st-elmo-x-st-elmo-music-festival-tickets-1984395656828",
  152: "https://texashotelvegas.com/event/swamp-presents-js-24th-anniversary-of-devil-music-n-drinkin-at-fiesta-destructo/",
  153: "https://schedule.sxsw.com/2026/events/OE46610",
  154: "https://www.instagram.com/reels/DVen8hGDGQd/",
  155: "https://winspear.biz/rsvp",
  156: "https://www.eventbrite.com/e/balanced-breakfest-2026-austin-showcase-day-2-during-sxsw-tickets-1983232864886",
  157: "https://www.instagram.com/p/DVeFnCXjntu",
  158: "https://luma.com/5yo4wovy",
  159: "https://www.eventbrite.com/e/tipify-b-side-austin-at-magic-isle-tickets-1984410187289",
  160: "https://luma.com/dj7iwuis",
  161: "https://www.instagram.com/p/DVOomxMFqc0",
  162: "https://winspear.biz/rsvp",
  163: "https://luma.com/n1u2sou3",
  164: "https://thetechwewant.com/our-events/the-light-house/",
  165: "https://posh.vip/e/house-of-yes-nyc-good-company-bathe",
  166: "https://www.tickettailor.com/events/hybrdstudios/2061763",
  167: "https://schedule.sxsw.com/events/OE46601",
  168: "https://www.instagram.com/p/DVRtL9GDswy",
  169: "https://partiful.com/e/DU1qfX0OYBDWzIVOf6F9",
  170: "https://kutx.org/live-events/sxsw/kutx-sxsw-2026/",
  171: "https://www.sipssoundsfest.com/",
  172: "https://www.instagram.com/p/DUW6EO6D6Iw/",
  173: "https://www.eventbrite.com/e/beyond-the-west-exhibition-artist-talk-tickets-1984408120106",
  174: "https://luma.com/gkbcz7te",
  175: "https://www.foxsports.com/stories/presspass/worlds-game-our-stage-fox-sports-previews-fifa-world-cup-2026-sxsw",
  176: "https://luma.com/4ya80z7n",
  177: "https://www.eventbrite.com/e/dreamfest-at-tickets-1980317124829",
  178: "https://www.eventbrite.com/e/luck-on-the-lawn-tickets-1983795048392",
  179: "https://2026.do512.com/events/2026/3/14/the-big-one-2026",
  180: "https://luma.com/knoulsj1",
  181: "https://get.manychat.com/events/sxsw",
  182: "https://basiscorsadigitalhappyhour.splashthat.com/",
  183: "https://posh.vip/e/tardezinha-do-twins-brazilian-day-party",
  184: "https://www.eventbrite.com/e/payday-la-invades-austin-2-tickets-1984192134086",
  185: "https://posh.vip/e/freaknik-austin-day-party",
  186: "https://schedule.sxsw.com/2026/events/CE00530",
  187: "https://www.instagram.com/p/DVeIV3Mjr1O",
  188: "https://luma.com/orq8kk3a",
  189: "https://luma.com/dl4us3n8",
  190: "https://luma.com/t1_monsterchildren",
  191: "https://schedule.sxsw.com/events/OE47126",
  192: "https://luma.com/hwcj45u4",
  193: "https://luma.com/ufkpm3ft",
  194: "https://forms.office.com/pages/responsepage.aspx?id=T-Syi1aESE6Tx6nG-VAlIOFFEPGphF5Pn7clgw9eiR5UN0FFWFA0SjMySTJWMldBS085V1JCUlMzSS4u&route=shorturl",
  195: "https://luma.com/681qr8ro",
  196: "https://luma.com/pf4dxzg8",
  197: "https://luma.com/mrx7m3q5",
  198: "https://luma.com/podersuave",
  199: "https://www.instagram.com/p/DVWu66bEpdq",
  200: "https://www.axs.com/series/30937/future-of-music-2026-at-acl-tickets",
  201: "https://luma.com/angggski?tk=bWo8jp",
  202: "https://dice.fm/event/av3lyx-experience-incendia-austin-tx-13th-mar-carson-creek-ranch-austin-tickets",
  203: "https://luma.com/secretaustinparty",
  204: "https://www.eventbrite.com/e/south-by-south-emo-fast-friends-registration-1981533826015",
  205: "https://posh.vip/e/buggg-launch-event",
  206: "https://luma.com/hzcgiy1v",
  207: "https://www.casaminasbr.com/",
  208: "https://events.rivian.com/rivianpresentsorvillepeck",
  209: "https://anormalfuckingparty.splashthat.com/",
  210: "https://luma.com/f9rcy7xu",
  211: "https://www.eventbrite.com/e/unwell-x-sxsw-tickets-1983895769652",
  212: "https://kutx.org/live-events/sxsw/kutx-sxsw-2026/",
  213: "https://www.ticketmaster.com/billboard-presents-the-stage-at-sxsw-tickets/artist/2860552",
  214: "https://posh.vip/e/finest-cuts-presents-sxsw-after-party",
  215: "https://www.eventbrite.com/e/callen-2026-sxsw-party-tickets-1983786553985",
  216: "https://partiful.com/e/Fw7J1kdWRaIqFv54DbqT",
  217: "https://www.instagram.com/p/DUlvK77iW03/",
  218: "https://www.redbreastwhiskey.com/en-us/redbreast-unhidden-bar-2026/",
  219: "https://www.instagram.com/p/DVZPL0EgU4K/",
  220: "https://www.revolt.house/p/1",
  221: "https://www.instagram.com/p/DU0VNGeDNNg/",
  222: "https://luma.com/unr114mi",
  223: "https://posh.vip/e/dream-con-music-showcase-sxsw-2026presented-by-front-row-live-x-warm-audio",
  224: "https://www.instagram.com/p/DVtlcBIFoJK",
  225: "https://schedule.sxsw.com/venues/V2392",
  226: "https://form.typeform.com/to/wcYW6n6S",
  227: "https://partiful.com/e/HnEArQedzrEXL7XTPZLV",
  228: "https://meetups.twitch.tv/events/details/twitch-austin-presents-stream-austin-march-sxsw-meetup-2026/",
  229: "https://www.thebritishmusicembassy.com/",
  230: "https://luma.com/k816qrjd",
  231: "https://partiful.com/e/HnEArQedzrEXL7XTPZLV",
  232: "https://www.german-haus.com/program/",
  233: "https://posh.vip/e/late-shift-music",
  234: "https://posh.vip/e/tunnel-rave-8",
  235: "https://www.eventbrite.ca/e/m-for-mothland-project-nowhere-official-showcases-tickets-1982033707173",
  236: "https://www.yahooinc.com/sxsw?utm_source=TheDirtyTeam&utm_medium=StaffPickonBluePrint&utm_campaign=SXSW2026",
  237: "https://www.instagram.com/p/DVo02FcCZw_",
  238: "https://www.eventbrite.com/e/late-shift-musicfree-sxsw-unofficial-show-j-graves-grocery-bagflash-tats-tickets-1984704511621",
  239: "https://www.instagram.com/p/DVtSqeUDmwt",
  240: "https://www.instagram.com/p/DVuJMC2koWs",
  241: "https://events.superhuman.com/sxsw-2026/",
  242: "https://evenements.bpifrance.fr/e/french-touch-rendez-vous-2026",
  243: "https://posh.vip/e/sxio-invite-only-goes-country",
  244: "https://schedule.sxsw.com/2026/events/OE46638",
  245: "https://posh.vip/e/house-of-yes-presents-bathhouse-brunch-day-party",
  246: "https://thetechwewant.com/our-events/the-light-house/",
  247: "https://posh.vip/e/all-the-vibes-party-ft-special-guest-cool-cobi-remix-1",
  248: "https://kydlabs.com/e/EV7e4cd512-215b-4319-97d6-3504137f6425",
  249: "https://www.instagram.com/p/DVrGCprDoSf/",
  250: "https://luma.com/scs-austin",
  251: "https://www.eventbrite.com/e/alexis-texas-in-the-flesh-special-live-performance-tickets-1985021837752",
  252: "https://begenuin.com/events",
  253: "https://www.mayfairaustin.com/upcomingevents/foster-the-people-dj-set",
  254: "https://www.instagram.com/p/DVeNQzdD0Ey/",
  255: "https://posh.vip/e/hot-liquid-1",
  256: "https://variety.com/2026/biz/news/next-generation-entertainment-podcast-brunch-sxsw-1236678939/",
  257: "https://info.logitech.com/sxsw-2026",
  258: "https://www.instagram.com/p/DU3f16iEYGP/",
  259: "https://www.instagram.com/p/DVOkXxiDQL7/",
  260: "https://www.instagram.com/p/DVRMnhugI0y",
  261: "https://www.instagram.com/p/DVjSi1Ekbsw",
  262: "https://luma.com/t1_coffee",
  263: "https://www.fairmont-austin.com/events/wellness-mornings-at-sxsw/",
  264: "https://event.onepeloton.com/pelotoninaustinoutdoor",
  265: "https://house.capitalfactory.com/",
  266: "https://web.cvent.com/event/d93ab4bc-c257-405c-8137-c366c37c30e6/summary",
  267: "https://events.rivian.com/sxswr2electricjoyride",
  268: "https://www.tickettailor.com/events/luminary/2052874",
  269: "https://shemedia.swoogo.com/smcolab26",
  270: "https://luma.com/u4q9akh7",
  271: "https://luma.com/4b9x0ct2",
  272: "https://evolutions.podcastmovement.com/",
  273: "https://event.adweek.com/awh-austin-2026",
  274: "https://luma.com/86o3ky8y",
  275: "https://schedule.sxsw.com/2026/events/OE46488",
  276: "https://brand-innovators.com/events/leadership-in-brand-marketing-summit-sxsw-in-austin-2026/",
  277: "https://events.rivian.com/riviansxswroadhouse2026",
  278: "https://kssxsw26.splashthat.com/",
  279: "https://x.com/zoox/status/2029242861661938019?s=20",
  280: "https://www.universe.com/events/country-connections-music-industry-speed-meetings-sxsw-2026-tickets-V8RLZK",
  281: "https://events.thefemalequotient.com/sxsw26/invite",
  282: "https://event.onepeloton.com/pelotoninaustinclasses",
  283: "https://saopaulohouse.com/",
  284: "https://events.superhuman.com/sxsw-2026/",
  285: "https://events.fastcompany.com/grill_2026/",
  286: "https://events.voxmedia.com/podcast-stage-sxsw",
  287: "https://posh.vip/e/ampm-house",
  288: "https://partiful.com/e/5Ofr1YyWmveeH1lYctmM",
  289: "https://schedule.sxsw.com/2026/events/OE46575",
  290: "https://www.eventbrite.com/e/space-house-sxsw-2026-tickets-1983032882734",
  291: "https://www.createcultivate.com/futuresummit",
  292: "https://luma.com/tn.house.sunday",
  293: "https://schedule.sxsw.com/2026/events/OE46415",
  294: "https://events.inc.com/inc-founders-house-2026-austin",
  295: "https://docs.google.com/forms/d/e/1FAIpQLSdB9QN59Xdz74kf-fatRuO-k1YRRmwiDMXRrCHjtaBl6QchZg/viewform",
  296: "https://www.eventbrite.com/e/house-of-wellness-unofficial-sxsw-event-tickets-1982455181815",
  297: "https://schedule.sxsw.com/2026/events/OE46654",
  298: "https://luma.com/Mercury_SXSW_2026",
  299: "https://www.casaminasbr.com/",
  300: "https://partiful.com/e/JmfM33WoEx8OdHgmj3OC?",
  301: "https://www.german-haus.com/program/",
  302: "https://americanaustralian.org/events/australia-house-sxsw-2026",
  303: "https://luma.com/fp9zcvmr",
  304: "https://luma.com/aisimulation",
  305: "https://luma.com/yph60mql?tk=X1BYlT",
  306: "https://schedule.sxsw.com/2026/events/OE46410",
  307: "https://luma.com/iq52h2tg",
  308: "https://www.eventbrite.com/e/scenarios-brunch-tickets-1981458941032",
  309: "https://schedule.sxsw.com/2026/events/OE46411",
  310: "https://www.eventbrite.co/e/bogota-region-house-at-sxsw-2026-official-meet-up-creative-market-tickets-1984418817101",
  311: "https://openwav.ai/events/vision8291-sxsw-four-day-cultural-experience/2d2ee6ef-f892-44a2-a947-c63f6507841e",
  312: "https://schedule.sxsw.com/2026/events/OE46412",
  313: "https://luma.com/gqhs0akm",
  314: "https://secure.everyaction.com/vAs8NcaIq0q2kHk4u-KcwQ2",
  315: "https://faithtechevent.lovable.app/",
  316: "https://www.eventbrite.com/e/sun-sweat-social-sxsw-outdoor-workout-with-sweat440-tickets-1984377668023",
  317: "https://partiful.com/e/leAgdL8FRISeZls8K6ly",
  318: "https://event.onepeloton.com/pelotoninaustinclasses",
  319: "https://schedule.sxsw.com/search?q=Congress+Avenue+Block+Party",
  320: "https://www.eventbrite.com/e/mid-day-refresh-lounge-with-city-stars-and-mackenzie-childs-tickets-1984678112661",
  321: "https://schedule.sxsw.com/events/OE47108",
  322: "https://partiful.com/e/MJJGaXJPYjtBwNW0jvdS",
  323: "https://partiful.com/e/r5u3vOGb6o7YZYIi0UfZ",
  324: "https://www.instagram.com/p/DU9eO81jt0Y",
  325: "https://2026.do512.com/events/2026/3/12/meanwhile-colton-house-w-rattlesnake-milk-emily-nenni-more-tickets",
  326: "https://www.eventbrite.com/e/5th-annual-austin-rhythm-revival-americana-music-showcase-austin-tx-tickets-1982908394386",
  327: "https://axioshouseatsxsw2026.splashthat.com/",
  328: "https://schedule.sxsw.com/2026/venues/V0305",
  329: "https://www.yahooinc.com/sxsw?utm_source=TheDirtyTeam&utm_medium=StaffPickonBluePrint&utm_campaign=SXSW2026",
  330: "https://justworks.swoogo.com/aroundtheworldwithjw/10965320",
  331: "https://schedule.sxsw.com/2026/venues/V2481",
  332: "https://www.eventbrite.com/e/2026-koop-radio-day-party-tickets-1982997704515",
  333: "https://schedule.sxsw.com/2026/events/OE46578",
  334: "https://partiful.com/e/D6QdnEcMsBJ1KDy1Dnuf",
  335: "https://schedule.sxsw.com/2026/venues/V2459",
  336: "https://www.instagram.com/p/DVbptb9lpYw/",
  337: "https://www.instagram.com/p/DVGuZYSkWfU/",
  338: "https://luma.com/euktoi6u",
  339: "https://www.eventbrite.com/e/tacos-tiaras-drag-lunch-tickets-1984324231192",
  340: "https://luma.com/renfaire",
  341: "https://www.eventbrite.com/e/mimosa-takeover-morning-after-mixer-tickets-1982401099052",
  342: "https://paste.freshtix.com/events/paste26",
  343: "https://partiful.com/e/5mlTXUPEET98slCvVpxi",
  344: "https://schedule.sxsw.com/events/OE47023",
  345: "https://www.instagram.com/p/DVw70cNDeIW/",
  346: "https://schedule.sxsw.com/2026/venues/V2391",
  347: "https://www.instagram.com/p/DVeNQzdD0Ey/",
  348: "https://www.eventbrite.com/e/austin-tx-congress-afternoon-delight-music-showcase-punch-bowl-social-tickets-1983973053811",
  349: "https://www.universe.com/events/northern-sound-tickets-78HLRY",
  350: "https://eventbrite.com/e/the-music-industry-meetup-2026-by-balanced-breakfast-during-tickets-1982910721346",
  351: "https://www.eventbrite.com/e/beats-x-beers-tickets-1979892628148",
  352: "https://posh.vip/e/starfire-fest-day-2",
  353: "https://www.eventbrite.com/e/poland-at-sxsw-innovation-showcase-tickets-1984139549805",
  354: "https://texashotelvegas.com/event/grillos-pickles-presents-st-pickles-day-pickle-party-ft-the-spits-sheer-mag-slash-need-fleshripper-and-more/",
  355: "https://partiful.com/e/necWPNdp0ZY6CIlQ32K8?",
  356: "https://www.designhouseatx.com/",
  357: "https://luma.com/1wt6rieo",
  358: "https://luma.com/465aakzv",
  359: "https://www.instagram.com/p/DVOomxMFqc0",
  360: "https://www.instagram.com/p/DVw47CoDpZq",
  361: "https://schedule.sxsw.com/2026/events/OE46568",
  362: "https://www.instagram.com/reels/DVen8hGDGQd/",
  363: "https://kutx.org/live-events/sxsw/kutx-sxsw-2026/",
  364: "https://2026.do512.com/events/2026/3/15/the-do512-lounge-sessions-2026",
  365: "https://www.instagram.com/p/DVRtL9GDswy",
  366: "https://www.eventbrite.com/e/harvard-sxsw-tickets-1981887399563",
  367: "https://posh.vip/e/outlaw-pride-sxsw",
  368: "https://laylo.com/dirtybirdrecords/4vHBob",
  369: "https://luma.com/avnqhbvp",
  370: "https://www.prekindle.com/event/16117-todo-records-showcase-feat-surfbort-austin",
  371: "https://luma.com/jtfbpc6s",
  372: "https://posh.vip/e/aunties-house-sxsw-2026",
  373: "https://www.instagram.com/p/DVl9nNrkapb",
  374: "https://luma.com/i4nsz3gx",
  375: "https://luma.com/glbmqm6u",
  376: "https://luma.com/rd044u94",
  377: "https://luma.com/56acre42",
  378: "https://www.instagram.com/p/DVbyjUPj0E1",
  379: "https://luma.com/wddaow8l",
  380: "https://www.instagram.com/p/DVcugm1jpFH/",
  381: "https://events.thefemalequotient.com/sxswpowerplay/invite",
  382: "https://schedule.sxsw.com/2026/events/OE46473",
  383: "https://sxsw.com/festivals/music/community-concerts/",
  384: "https://luma.com/3w7l2bw2",
  385: "https://luma.com/njj07v0h",
  386: "https://luma.com/h1hb0ob0",
  387: "https://events.eventnoire.com/e/carefreeblackgirl-sxsw-4",
  388: "https://dice.fm/event/av3lyx-experience-incendia-austin-tx-13th-mar-carson-creek-ranch-austin-tickets",
  389: "https://www.eventbrite.com/e/women-beyond-the-mic-tickets-1984307094937",
  390: "https://www.theblprnt.com/imax.com/stormboundsxsw",
  391: "https://luma.com/5rco2shh",
  392: "https://events.voxmedia.com/Eater-dinnerparty-Austin",
  393: "https://luma.com/5r8qycf5",
  394: "https://luma.com/ceodinneraustin3",
  395: "https://luma.com/znuxkvmw",
  396: "https://www.instagram.com/p/DVrDM97D99o",
  397: "https://kutx.org/live-events/sxsw/kutx-sxsw-2026/",
  398: "https://www.instagram.com/p/DU8nS5XgIGV/",
  399: "https://partiful.com/e/1raMiKtSxQ9dlGx9G4aH",
  400: "https://www.ticketmaster.com/billboard-presents-the-stage-at-sxsw-tickets/artist/2860552",
  401: "https://app.viralsweep.com/sweeps/full/fd480e-222307?framed=1",
  402: "https://www.instagram.com/p/DUndvdZCE11/",
  403: "https://www.instagram.com/p/DVJmiu4CepP/",
  404: "https://luma.com/ohk51ec9",
  405: "https://schedule.sxsw.com/venues/V2392",
  406: "https://schedule.sxsw.com/2026/events/CE00520",
  407: "https://www.instagram.com/p/DU0aYgWCC07",
  408: "https://www.thebritishmusicembassy.com/",
  409: "https://www.eventbrite.co.uk/e/focus-wales-at-sxsw-2026-tickets-1982835145296",
  410: "https://events.superhuman.com/sxsw-2026/",
  411: "https://www.instagram.com/p/DVg64mMEd4f/",
  412: "https://www.german-haus.com/program/",
  413: "https://www.instagram.com/p/DVJoV1Bjr7z",
  414: "https://www.instagram.com/p/DVwzPswEbRH",
  415: "https://www.instagram.com/p/DVtSqeUDmwt",
  416: "https://schedule.sxsw.com/2026/events/OE46435",
  417: "https://www.instagram.com/p/DVeNQzdD0Ey/",
  418: "https://www.culturehouseofficial.com/",
  419: "https://www.instagram.com/p/DVOkXxiDQL7/",
  420: "https://www.instagram.com/p/DU3f16iEYGP/",
  421: "https://www.instagram.com/p/DVOPIDuCE2m/",
  422: "https://www.instagram.com/p/DVRMnhugI0y",
  423: "https://luma.com/t1_coffee",
  424: "https://connectingtheamericas.com/",
  425: "https://offers.hubspot.com/-tx-hubspothouse-mar2026",
  426: "https://partiful.com/e/JMleewxYqUesC1hrYxgI",
  427: "https://www.eventbrite.com/e/the-non-obvious-house-during-sxsw-week-in-austin-tickets-1761827586739",
  428: "https://house.capitalfactory.com/",
  429: "https://schedule.sxsw.com/2026/events/OE46405",
  430: "https://www.eventbrite.com/e/precision-camera-video-and-fujifilm-presents-free-professional-headshots-tickets-1981960185267",
  431: "https://events.rivian.com/sxswr2electricjoyride",
  432: "https://luma.com/z3yrwrey",
  433: "https://kutx.org/live-events/sxsw/kutx-sxsw-2026/",
  434: "https://brand-innovators.com/events/leadership-in-brand-marketing-summit-sxsw-in-austin-2026/",
  435: "https://partiful.com/e/9g9kYfgMhSuf2wuJjRFM?",
  436: "https://chief.com/chief-suite-sxsw-2026",
  437: "https://b2bhaus.com/",
  438: "https://luma.com/u4q9akh7",
  439: "https://dwtevents.com/foundedintexas/",
  440: "https://events.rivian.com/riviansxswroadhouse2026",
  441: "https://luma.com/wtrz4mle",
  442: "https://luma.com/hh-ai-journalism-day-2026-austin",
  443: "https://web.cvent.com/event/d93ab4bc-c257-405c-8137-c366c37c30e6/summary",
  444: "https://docs.google.com/forms/d/e/1FAIpQLSdB9QN59Xdz74kf-fatRuO-k1YRRmwiDMXRrCHjtaBl6QchZg/viewform",
  445: "https://events.glean.com/glean-at-sxsw2026/",
  446: "https://luma.com/xmlicmts",
  447: "https://events.superhuman.com/sxsw-2026/",
  448: "https://luma.com/79uagf6k",
  449: "https://saopaulohouse.com/",
  450: "https://luma.com/2xxl9pke",
  451: "https://www.eventbrite.com/e/river-walk-music-tech-meetup-tickets-1984299205339",
  452: "https://www.casaminasbr.com/",
  453: "https://americanaustralian.org/events/australia-house-sxsw-2026",
  454: "https://www.eventbrite.com/e/new-mexico-house-sxsw-2026-tickets-1982827468334",
  455: "https://luma.com/nashville-loves-austin",
  456: "https://openwav.ai/events/vision8291-sxsw-four-day-cultural-experience/2d2ee6ef-f892-44a2-a947-c63f6507841e",
  457: "https://membership.austinlgbtchamber.com/events/Details/sxsw-2026-the-power-of-the-lgbtq-economy-with-the-nglcc-1666192?sourceTypeId=Website",
  458: "https://luma.com/gqhs0akm",
  459: "https://schedule.sxsw.com/search?q=Congress+Avenue+Block+Party",
  460: "https://schedule.sxsw.com/events/OE47108",
  461: "https://events.fastcompany.com/grill_2026/",
  462: "https://www.artistforartist.com/sxsw",
  463: "https://luma.com/pen760p6",
  464: "https://luma.com/pen760p6",
  465: "https://www.german-haus.com/program/",
  466: "https://schedule.sxsw.com/2026/venues/V2481",
  467: "https://www.etix.com/ticket/p/33246312/marshall-day-party-austin-resound-presents",
  468: "https://www.eventbrite.com/e/5th-annual-austin-rhythm-revival-americana-music-showcase-austin-tx-tickets-1982908394386",
  469: "https://www.instagram.com/p/DVbo3wFES7P",
  470: "https://schedule.sxsw.com/2026/venues/V0305",
  471: "https://schedule.sxsw.com/2026/venues/V2459",
  472: "https://www.instagram.com/p/DVbptb9lpYw/",
  473: "https://paste.freshtix.com/events/paste26",
  474: "https://www.instagram.com/p/DVw70cNDeIW/",
  475: "https://schedule.sxsw.com/2026/venues/V2391",
  476: "https://schedule.sxsw.com/events/OE47024",
  477: "https://www.instagram.com/p/DVbv6j8kXuR/",
  478: "https://luma.com/hbu8k62y",
  479: "https://www.universe.com/events/northern-sound-x-dbt-wales-tickets-H12PJD",
  480: "https://luma.com/7cv8plqi",
  481: "https://luma.com/wolf-connect-sxsw-2026",
  482: "https://schedule.sxsw.com/2026/events/OE46569",
  483: "https://www.sodaspeaks.com/soda-austin-2026",
  484: "https://www.instagram.com/p/DVREV-gjvMn/",
  485: "https://luma.com/f3ch1cru",
  486: "https://luma.com/f3prlsly",
  487: "https://luma.com/f3prlsly",
  488: "https://luma.com/kmtg9hwd",
  489: "https://membership.austinlgbtchamber.com/events/Details/sxsw-2026-funding-power-and-the-future-of-queer-storytelling-1658207?sourceTypeId=Website",
  490: "https://membership.austinlgbtchamber.com/events/Details/sxsw-2026-funding-power-and-the-future-of-queer-storytelling-1658207",
  491: "https://www.eventbrite.com/e/real-estate-forum-proptech-construction-ai-showcase-tickets-1981495734081",
  492: "https://luma.com/4b1xy177",
  493: "https://luma.com/supasxsw",
  494: "https://luma.com/9rrc7f1z",
  495: "https://luma.com/torq2khk",
  496: "https://luma.com/wk9qacdm",
  497: "https://luma.com/ig3nyeww",
  498: "https://www.eventbrite.com/e/sauna-like-a-finn-authentic-finnish-sauna-evening-a-reset-at-sxsw-tickets-1980592648929?keep_tld=true",
  499: "https://schedule.sxsw.com/2026/events/OE46474",
  500: "https://www.meetup.com/bitcoin-park-austin/events/312410911/",
  501: "https://luma.com/xxdiqmj6",
  502: "https://www.eventbrite.com/e/the-rendezvous-in-atx-2026-tickets-1980316365558",
  503: "https://www.eventbrite.co.uk/e/disguise-community-meetup-the-sxsw-austin-edition-tickets-1983816473475",
  504: "https://www.tickettailor.com/events/madeincookware/2078858",
  505: "https://luma.com/pj70xjkb",
  506: "https://events.rivian.com/rivianpresentsthelumineers",
  507: "https://luma.com/mcu47zkz",
  508: "https://luma.com/9n5lq3wd",
  509: "https://neonrainbowstx.com/sxsw-26",
  510: "https://schedule.sxsw.com/2026/events/OE46399",
  511: "https://icelandmusic.is/events/iceland-musics-official-showcase-at-sxsw",
  512: "https://luma.com/8i8y202a",
  513: "https://www.instagram.com/reels/DVen8hGDGQd/",
  514: "https://www.shespeaksceo.com/events-1/she-speaks-ceo-sxsw-week-powerhouse-women-unite-austin-tx",
  515: "https://www.instagram.com/p/DUjAzOdDybO/",
  516: "https://kutx.org/live-events/sxsw/kutx-sxsw-2026/",
  517: "https://luma.com/qnkvjgm3",
  518: "https://luma.com/n405nvbu",
  519: "https://events.glean.com/sxsw2026-attendee-reception",
  520: "https://www.iheart.com/podcast-awards/",
  521: "https://www.artistforartist.com/sxsw",
  522: "https://www.instagram.com/p/DVmrmtyAMs0/",
  523: "https://schedule.sxsw.com/venues/V2392",
  524: "https://events.superhuman.com/sxsw-2026/",
  525: "https://www.thebritishmusicembassy.com/",
  526: "https://www.instagram.com/p/DVL9KikDLGg/",
  527: "https://www.tickettailor.com/events/musicisonthemenu/2096941",
  528: "https://www.german-haus.com/program/",
  529: "https://natlawreview.com/press-releases/detroit-hip-hop-takes-center-stage-official-sxsw-showcase",
  530: "https://partiful.com/e/d3cnBH2jop4L1gCpMCqH",
  531: "https://cultureelixir.com/2026/03/06/sony-music-latin-announces-the-new-sounds-of-musica-mexicana-for-sxsw/",
  532: "https://socialclub.messinatouring.com/sxsw-2026",
  533: "https://schedule.sxsw.com/events/MS64711",
  534: "https://www.instagram.com/p/DU3f16iEYGP/",
  535: "https://www.instagram.com/p/DVcAoXkkiWo/",
  536: "https://www.instagram.com/p/DVOPIDuCE2m/",
  537: "https://luma.com/ltbndst9",
  538: "https://luma.com/torq2khk",
  539: "https://schedule.sxsw.com/2026/events/OE46406",
  540: "https://chief.com/chief-suite-sxsw-2026",
  541: "https://events.rivian.com/sxswr2electricjoyride",
  542: "https://www.eventbrite.com/e/precision-camera-video-and-fujifilm-presents-free-professional-headshots-tickets-1981960185267",
  543: "https://events.rivian.com/riviansxswroadhouse2026",
  544: "https://events.glean.com/glean-at-sxsw2026/",
  545: "https://web.cvent.com/event/d93ab4bc-c257-405c-8137-c366c37c30e6/summary",
  546: "https://www.eventbrite.com/e/spark-your-flow-fest-an-unofficial-sxsw-mini-fest-at-maggie-maes-tickets-1984437312421",
  547: "https://americanaustralian.org/events/australia-house-sxsw-2026",
  548: "https://luma.com/gqhs0akm",
  549: "https://docs.google.com/forms/d/e/1FAIpQLSfpU4NO31Z-geL-1U6-xaar7lF8tetrHfGx9XHIRMdhO4enoQ/viewform",
  550: "https://schedule.sxsw.com/search?q=Congress+Avenue+Block+Party",
  551: "https://www.artistforartist.com/sxsw",
  552: "https://www.instagram.com/p/DVbptb9lpYw/",
  553: "https://schedule.sxsw.com/2026/venues/V2459",
  554: "https://www.eventbrite.com/e/5th-annual-austin-rhythm-revival-americana-music-showcase-austin-tx-tickets-1982908394386",
  555: "https://www.eventbrite.com/e/2026-asia-x-austin-summit-tickets-1977413167013",
  556: "https://schedule.sxsw.com/2026/venues/V2481",
  557: "https://schedule.sxsw.com/2026/venues/V0305",
  558: "https://www.instagram.com/p/DVbo3wFES7P",
  559: "https://paste.freshtix.com/events/paste26",
  560: "https://www.instagram.com/p/DVgqY8VCcI4/",
  561: "https://www.instagram.com/p/DVw70cNDeIW/",
  562: "https://schedule.sxsw.com/2026/venues/V2391",
  563: "https://schedule.sxsw.com/events/OE47025",
  564: "https://www.instagram.com/p/DVeFnCXjntu",
  565: "https://www.instagram.com/p/DVbv6j8kXuR/",
  566: "https://luma.com/l2u8lvm3",
  567: "https://schedule.sxsw.com/2026/events/OE46570",
  568: "https://www.prekindle.com/event/44414-howdy-podner-a-live-music-event-austin",
  569: "https://www.thebritishmusicembassy.com/",
  570: "https://www.instagram.com/p/DUqmvrMidxW/",
  571: "https://luma.com/coy5x7os",
  572: "https://schedule.sxsw.com/2026/events/OE46398",
  573: "https://luma.com/hq3xz20z",
  574: "https://partiful.com/e/EPxV94P2CQL5uBi8OYzI?",
  575: "https://posh.vip/e/allocators-anonymous-skunkworks",
  576: "https://luma.com/qmzwhj5v",
  577: "https://cemapopupsxsw2026.splashthat.com/",
  578: "https://schedule.sxsw.com/2026/events/OE46706",
  579: "https://www.eventbrite.com/e/sound-patterns-art-exhibition-sxsw-edition-tickets-1983319512050",
  580: "https://www.etix.com/ticket/p/86649255/potluck-2026-spicewood-luck-ranch",
  581: "https://www.eventbrite.com/e/sound-patterns-art-exhibition-sxsw-edition-tickets-1983319512050",
  582: "https://luma.com/WCKxSwayable",
  583: "https://schedule.sxsw.com/2026/events/OE46400",
  584: "https://luma.com/iypnnttn",
  585: "https://www.instagram.com/p/DUoUDndEQfQ/",
  586: "https://www.eventbrite.com/e/a-fat-a-rap-show-part-2-official-sxsw-showcase-tickets-1983873839057",
  587: "https://luma.com/ovrwcq5j",
  588: "https://lp.constantcontactpages.com/ev/reg/62s42gu",
  589: "https://openwav.ai/events/vision8291-sxsw-four-day-cultural-experience/2d2ee6ef-f892-44a2-a947-c63f6507841e",
  590: "https://events.glean.com/sxsw2026-attendee-reception",
  591: "https://partiful.com/e/esWt1aHEFYCkqFEQ47ZM",
  592: "https://schedule.sxsw.com/2026/events/OE46485",
  593: "https://www.artistforartist.com/sxsw",
  594: "https://partiful.com/e/jwl4LaTKmniDAZS8cXE1",
  595: "https://www.instagram.com/p/DUl4FiNjztT",
  596: "https://www.acllive.com/event/2026-03-17-dropout-improv-at-7-30-pm",
  597: "https://kutx.org/live-events/sxsw/kutx-sxsw-2026/",
  598: "https://partiful.com/e/rG1L78GA7w3DBV02GbV0",
  599: "https://www.thecoloragent.com/tcasxsw",
  600: "https://www.instagram.com/p/DVeofDNEUkl",
  601: "https://www.instagram.com/p/DVZFqLJD1I9/",
  602: "https://luma.com/igmlu8sl",
  603: "https://schedule.sxsw.com/venues/V2392",
  604: "https://www.instagram.com/p/DVwOj70gDmR",
  605: "https://www.thebritishmusicembassy.com/",
  606: "https://athensinaustin.com/",
  607: "https://www.instagram.com/p/DVO9egUldZq",
  608: "https://www.instagram.com/p/DU3dz6FDjFA/",
  609: "https://www.instagram.com/p/DVcAoXkkiWo/",
  610: "https://schedule.sxsw.com/events/MS63297",
  611: "https://www.instagram.com/p/DU3f16iEYGP/",
  612: "https://www.instagram.com/p/DVOPIDuCE2m/",
  613: "https://www.eventbrite.com/e/precision-camera-video-and-fujifilm-presents-free-professional-headshots-tickets-1981960185267",
  614: "https://events.rivian.com/sxswr2electricjoyride",
  615: "https://schedule.sxsw.com/2026/events/OE46407",
  616: "https://events.rivian.com/riviansxswroadhouse2026",
  617: "https://events.dropbox.com/events/hope-lounge-presented-by-dropbox",
  618: "https://luma.com/gqhs0akm",
  619: "https://www.eventbrite.com/e/austin-blues-fest-antones-forever-sxsw-2026-day-party-tickets-1983874169044",
  620: "https://wl.eventim.us/event/day-off-austin-free-day-showcase/680021?afflky=ThirdStringEntertainment",
  621: "https://schedule.sxsw.com/search?q=Congress+Avenue+Block+Party",
  622: "https://www.instagram.com/p/DVbptb9lpYw/",
  623: "https://schedule.sxsw.com/2026/venues/V2481",
  624: "https://schedule.sxsw.com/2026/venues/V2459",
  625: "https://www.eventbrite.com/e/5th-annual-austin-rhythm-revival-americana-music-showcase-austin-tx-tickets-1982908394386",
  626: "https://schedule.sxsw.com/2026/venues/V0305",
  627: "https://www.instagram.com/p/DVw70cNDeIW/",
  628: "https://schedule.sxsw.com/2026/venues/V2391",
  629: "https://schedule.sxsw.com/events/OE47026",
  630: "https://www.eventim.us/event/alex-maas/683570",
  631: "https://www.instagram.com/p/DVeFnCXjntu",
  632: "https://www.eventbrite.com/e/record-play-one-hit-wonders-sxsw-edition-tickets-1983663185988",
  633: "https://partiful.com/e/RkzZabLayB23PWbmsSxW",
  634: "https://luma.com/69s86orw",
  635: "https://www.eventbrite.com/e/psyxsw-social-hour-tickets-1983484835537",
  636: "https://calendar.google.com/calendar/u/0/share?slt=1ATMtfpj_gLzoVR1BZz5AL0Rii8E_x9nkMvrj8C0uQ7hk86rGs0PNNWOHbOoV0dTCtX2NVsX_xdKhoQ",
  637: "https://www.instagram.com/p/DVbv6j8kXuR/",
  638: "https://schedule.sxsw.com/2026/events/OE46803",
  639: "https://luma.com/7dfeprc1",
  640: "https://schedule.sxsw.com/2026/events/OE46401",
  641: "https://schedule.sxsw.com/2026/events/OE46493",
  642: "https://www.eventbrite.com/e/speak-your-truth-transformational-storytelling-sxsw-tickets-1984494537583",
  643: "https://www.instagram.com/p/DVRkH4lkUgZ",
  644: "https://2026.do512.com/events/2026/3/18/musica-no-borders-w-danny-felix-la-coreanera-more-official-tickets",
  645: "https://www.instagram.com/p/DUl_zvHkiWp/",
  646: "https://luma.com/iunnsx9l",
  647: "https://www.eventbrite.com/e/very-necessary-presents-the-world-is-yours-official-sxsw-showcase-tickets-1983808368232",
  648: "https://kutx.org/live-events/sxsw/kutx-sxsw-2026/",
  649: "https://2026.do512.com/events/2026/3/18/lafayette-sheaukaze-and-crawfish-boil-tickets",
  650: "https://www.luckpresents.com/ramjam",
  651: "https://schedule.sxsw.com/venues/V2392",
  652: "https://schedule.sxsw.com/2026/events/OE46621",
  653: "https://www.thebritishmusicembassy.com/",
  654: "https://schedule.sxsw.com/2026/events/OE46555",
  655: "https://www.instagram.com/p/DU3f16iEYGP/",
  656: "https://www.instagram.com/p/DVcAoXkkiWo/",
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

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"];
const DD = { Saturday: "Mar 14", Sunday: "Mar 15", Monday: "Mar 16", Tuesday: "Mar 17", Wednesday: "Mar 18" };

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
  // ══ SATURDAY ══
  { id: 1, day: "Saturday", t: "7:00 AM", e2: "12:00 PM", title: "Fairmont Wellness Mornings: Day Three", ev: "Fairmont Austin (Pool Deck)", v: "Fairmont Austin (Pool Deck)", sp: [], g: ["fitness"], cat: "fitness", food: false, free: true, badge: false },
  { id: 2, day: "Saturday", t: "7:00 AM", e2: "8:30 AM", title: "Peloton x SHE Media: 5K Run Club Day One", ev: "La Zona Rosa", v: "La Zona Rosa", sp: [], g: ["fitness", "women"], cat: "fitness", food: false, free: true, badge: false },
  { id: 3, day: "Saturday", t: "7:30 AM", e2: "10:30 AM", title: "Coffee Talk", ev: "Jo's (W. 2nd)", v: "Jo's (W. 2nd)", sp: [], g: ["food", "thought_leadership"], cat: "food", food: false, free: true, badge: false },
  { id: 4, day: "Saturday", t: "8:00 AM", e2: "10:00 AM", title: "5K with The Hustle x Founders Running Club", ev: "Estacionamiento Edward Rendon Park", v: "Estacionamiento Edward Rendon Park", sp: [], g: ["fitness", "food", "fundraising"], cat: "fitness", food: true, free: true, badge: false },
  { id: 5, day: "Saturday", t: "8:00 AM", e2: "12:00 PM", title: "KUTX Live: Day Three", ev: "Scholz Garten", v: "Scholz Garten", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 6, day: "Saturday", t: "8:00 AM", e2: "10:30 AM", title: "Minnesota Nice Meetup", ev: "Cenote", v: "Cenote", sp: [], g: ["networking"], cat: "sessions", food: false, free: true, badge: false },
  { id: 7, day: "Saturday", t: "8:00 AM", e2: "5:00 PM", title: "RYZE Coffee Shop Popup: Day Three", ev: "301 Congress (Porch)", v: "301 Congress (Porch)", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 8, day: "Saturday", t: "8:30 AM", e2: "5:30 PM", title: "Capital Factory House: Day Three", ev: "Captial Factory", v: "Captial Factory", sp: [], g: ["fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 9, day: "Saturday", t: "9:00 AM", e2: "5:00 PM", title: "The Odoo Lounge with Vox Media: Day Two", ev: "Hilton Downtown (Level 4)", v: "Hilton Downtown (Level 4)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 10, day: "Saturday", t: "9:00 AM", e2: "10:00 PM", title: "Podcast Movement: Day Two", ev: "Skybox On 6th", v: "Skybox On 6th", sp: [], g: ["food", "creators"], cat: "sessions", food: true, free: true, badge: false },
  { id: 11, day: "Saturday", t: "9:00 AM", e2: "5:00 PM", title: "RedThreadX House: Day One", ev: "The LINE Austin", v: "The LINE Austin", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 12, day: "Saturday", t: "9:00 AM", e2: "10:00 AM", title: "Jonathan Van Ness Hair Masterclass ($)", ev: "Ulta Beauty", v: "Ulta Beauty", sp: [], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 13, day: "Saturday", t: "9:00 AM", e2: "2:00 PM", title: "2026 Swift Fit Recovery Lounge", ev: "916 Congress", v: "916 Congress", sp: [], g: ["fitness"], cat: "fitness", food: false, free: true, badge: false },
  { id: 14, day: "Saturday", t: "9:00 AM", e2: "5:00 PM", title: "Brand innovators Marketing Summit: Day Two", ev: "Lambert's BBQ", v: "Lambert's BBQ", sp: [], g: ["food", "brand", "thought_leadership"], cat: "sessions", food: true, free: true, badge: false },
  { id: 15, day: "Saturday", t: "9:00 AM", e2: "5:00 PM", title: "SHE Media Co-Lab: Day One", ev: "LZR (La Zona Rosa)", v: "LZR (La Zona Rosa)", sp: [], g: ["food", "women"], cat: "sessions", food: true, free: true, badge: false },
  { id: 16, day: "Saturday", t: "9:00 AM", e2: "10:00 AM", title: "RYZE & Shine Yoga Flow Popup", ev: "301 Congress (Porch)", v: "301 Congress (Porch)", sp: [], g: ["fitness"], cat: "fitness", food: false, free: true, badge: false },
  { id: 17, day: "Saturday", t: "9:00 AM", e2: "5:00 PM", title: "House Of Chingonas", ev: "KMFA Classical 89.5", v: "KMFA Classical 89.5", sp: [], g: ["women"], cat: "sessions", food: false, free: true, badge: false },
  { id: 18, day: "Saturday", t: "9:00 AM", e2: "5:00 PM", title: "Rivian's Electric Joyride: Day Two", ev: "800 Congress (Road Closure)", v: "800 Congress (Road Closure)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 19, day: "Saturday", t: "9:00 AM", e2: "9:00 PM", title: "Ireland House: Day Two", ev: "Marlow", v: "Marlow", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 20, day: "Saturday", t: "9:00 AM", e2: "12:00 PM", title: "Webwurst & Watch Party: Bavarian Breakfast", ev: "German-Texan Heritage Society", v: "German-Texan Heritage Society", sp: [], g: ["food", "fun"], cat: "food", food: false, free: true, badge: false },
  { id: 21, day: "Saturday", t: "9:00 AM", e2: "7:00 PM", title: "Rivian Electric Roadhouse: Day Two", ev: "Rivian HQ", v: "Rivian HQ", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 22, day: "Saturday", t: "9:00 AM", e2: "2:00 PM", title: "Kendra Scott x Beam: Day Three", ev: "Kendra Scott Flagship", v: "Kendra Scott Flagship", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 23, day: "Saturday", t: "9:30 AM", e2: "11:30 AM", title: "Hot Girl Walk (Official): Austin", ev: "9307 Ann & Roy Butler Hike & Bike", v: "9307 Ann & Roy Butler Hike & Bike", sp: [], g: ["women"], cat: "sessions", food: false, free: true, badge: false },
  { id: 24, day: "Saturday", t: "9:30 AM", e2: "6:00 PM", title: "The Female Quotient FQ Lounge: Day One", ev: "Waller Creek Boathouse", v: "Waller Creek Boathouse", sp: [], g: ["women"], cat: "sessions", food: false, free: true, badge: false },
  { id: 25, day: "Saturday", t: "9:30 AM", e2: "4:30 PM", title: "Zoox Robotaxi Pop-Up: Day Two", ev: "The LINE Austin", v: "The LINE Austin", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 26, day: "Saturday", t: "09:30:00", e2: "", title: "Peloton x SHE Media: 20 Min Workout 1", ev: "La Zona Rosa", v: "La Zona Rosa", sp: [], g: ["fitness", "women"], cat: "fitness", food: false, free: true, badge: false },
  { id: 27, day: "Saturday", t: "10:00 AM", e2: "10:00 PM", title: "Sao Paolo House: Day Two", ev: "3rd & Congress", v: "3rd & Congress", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 28, day: "Saturday", t: "7:00 AM", e2: "12:00 PM", title: "Fairmont Wellness Mornings: Day Three", ev: "Fairmont Austin (Pool Deck)", v: "Fairmont Austin (Pool Deck)", sp: [], g: ["fitness"], cat: "fitness", food: false, free: true, badge: false },
  { id: 29, day: "Saturday", t: "7:00 AM", e2: "8:30 AM", title: "Peloton x SHE Media: 5K Run Club Day One", ev: "La Zona Rosa", v: "La Zona Rosa", sp: [], g: ["fitness", "women"], cat: "fitness", food: false, free: true, badge: false },
  { id: 30, day: "Saturday", t: "7:30 AM", e2: "10:30 AM", title: "Coffee Talk", ev: "Jo's (W. 2nd)", v: "Jo's (W. 2nd)", sp: [], g: ["food", "thought_leadership"], cat: "food", food: false, free: true, badge: false },
  { id: 31, day: "Saturday", t: "8:00 AM", e2: "10:00 AM", title: "5K with The Hustle x Founders Running Club", ev: "Estacionamiento Edward Rendon Park", v: "Estacionamiento Edward Rendon Park", sp: [], g: ["fitness", "food", "fundraising"], cat: "fitness", food: true, free: true, badge: false },
  { id: 32, day: "Saturday", t: "8:00 AM", e2: "12:00 PM", title: "KUTX Live: Day Three", ev: "Scholz Garten", v: "Scholz Garten", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 33, day: "Saturday", t: "8:00 AM", e2: "10:30 AM", title: "Minnesota Nice Meetup", ev: "Cenote", v: "Cenote", sp: [], g: ["networking"], cat: "sessions", food: false, free: true, badge: false },
  { id: 34, day: "Saturday", t: "8:00 AM", e2: "5:00 PM", title: "RYZE Coffee Shop Popup: Day Three", ev: "301 Congress (Porch)", v: "301 Congress (Porch)", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 35, day: "Saturday", t: "8:30 AM", e2: "5:30 PM", title: "Capital Factory House: Day Three", ev: "Captial Factory", v: "Captial Factory", sp: [], g: ["fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 36, day: "Saturday", t: "9:00 AM", e2: "5:00 PM", title: "The Odoo Lounge with Vox Media: Day Two", ev: "Hilton Downtown (Level 4)", v: "Hilton Downtown (Level 4)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 37, day: "Saturday", t: "9:00 AM", e2: "10:00 PM", title: "Podcast Movement: Day Two", ev: "Skybox On 6th", v: "Skybox On 6th", sp: [], g: ["food", "creators"], cat: "sessions", food: true, free: true, badge: false },
  { id: 38, day: "Saturday", t: "9:00 AM", e2: "5:00 PM", title: "RedThreadX House: Day One", ev: "The LINE Austin", v: "The LINE Austin", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 39, day: "Saturday", t: "9:00 AM", e2: "10:00 AM", title: "Jonathan Van Ness Hair Masterclass ($)", ev: "Ulta Beauty", v: "Ulta Beauty", sp: [], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 40, day: "Saturday", t: "9:00 AM", e2: "2:00 PM", title: "2026 Swift Fit Recovery Lounge", ev: "916 Congress", v: "916 Congress", sp: [], g: ["fitness"], cat: "fitness", food: false, free: true, badge: false },
  { id: 41, day: "Saturday", t: "9:00 AM", e2: "5:00 PM", title: "Brand innovators Marketing Summit: Day Two", ev: "Lambert's BBQ", v: "Lambert's BBQ", sp: [], g: ["food", "brand", "thought_leadership"], cat: "sessions", food: true, free: true, badge: false },
  { id: 42, day: "Saturday", t: "9:00 AM", e2: "5:00 PM", title: "SHE Media Co-Lab: Day One", ev: "LZR (La Zona Rosa)", v: "LZR (La Zona Rosa)", sp: [], g: ["food", "women"], cat: "sessions", food: true, free: true, badge: false },
  { id: 43, day: "Saturday", t: "9:00 AM", e2: "10:00 AM", title: "RYZE & Shine Yoga Flow Popup", ev: "301 Congress (Porch)", v: "301 Congress (Porch)", sp: [], g: ["fitness"], cat: "fitness", food: false, free: true, badge: false },
  { id: 44, day: "Saturday", t: "9:00 AM", e2: "5:00 PM", title: "House Of Chingonas", ev: "KMFA Classical 89.5", v: "KMFA Classical 89.5", sp: [], g: ["women"], cat: "sessions", food: false, free: true, badge: false },
  { id: 45, day: "Saturday", t: "9:00 AM", e2: "5:00 PM", title: "Rivian's Electric Joyride: Day Two", ev: "800 Congress (Road Closure)", v: "800 Congress (Road Closure)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 46, day: "Saturday", t: "9:00 AM", e2: "9:00 PM", title: "Ireland House: Day Two", ev: "Marlow", v: "Marlow", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 47, day: "Saturday", t: "9:00 AM", e2: "12:00 PM", title: "Webwurst & Watch Party: Bavarian Breakfast", ev: "German-Texan Heritage Society", v: "German-Texan Heritage Society", sp: [], g: ["food", "fun"], cat: "food", food: false, free: true, badge: false },
  { id: 48, day: "Saturday", t: "9:00 AM", e2: "7:00 PM", title: "Rivian Electric Roadhouse: Day Two", ev: "Rivian HQ", v: "Rivian HQ", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 49, day: "Saturday", t: "9:00 AM", e2: "2:00 PM", title: "Kendra Scott x Beam: Day Three", ev: "Kendra Scott Flagship", v: "Kendra Scott Flagship", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 50, day: "Saturday", t: "9:30 AM", e2: "11:30 AM", title: "Hot Girl Walk (Official): Austin", ev: "9307 Ann & Roy Butler Hike & Bike", v: "9307 Ann & Roy Butler Hike & Bike", sp: [], g: ["women"], cat: "sessions", food: false, free: true, badge: false },
  { id: 51, day: "Saturday", t: "9:30 AM", e2: "6:00 PM", title: "The Female Quotient FQ Lounge: Day One", ev: "Waller Creek Boathouse", v: "Waller Creek Boathouse", sp: [], g: ["women"], cat: "sessions", food: false, free: true, badge: false },
  { id: 52, day: "Saturday", t: "9:30 AM", e2: "4:30 PM", title: "Zoox Robotaxi Pop-Up: Day Two", ev: "The LINE Austin", v: "The LINE Austin", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 53, day: "Saturday", t: "09:30:00", e2: "", title: "Peloton x SHE Media: 20 Min Workout 1", ev: "La Zona Rosa", v: "La Zona Rosa", sp: [], g: ["fitness", "women"], cat: "fitness", food: false, free: true, badge: false },
  { id: 54, day: "Saturday", t: "10:00 AM", e2: "10:00 PM", title: "Sao Paolo House: Day Two", ev: "3rd & Congress", v: "3rd & Congress", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 55, day: "Saturday", t: "10:00 AM", e2: "11:00 PM", title: "Spotify For Artists Masterclass", ev: "Downright Austin (Ballroom E)", v: "Downright Austin (Ballroom E)", sp: [], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 56, day: "Saturday", t: "10:00 AM", e2: "6:00 PM", title: "Creator House by Aura Rewards", ev: "Paseo on Rainey (48th floor)", v: "Paseo on Rainey (48th floor)", sp: [], g: ["creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 57, day: "Saturday", t: "10:00 AM", e2: "1:00 PM", title: "From Chaos To Clarity with CLA", ev: "Moonshine Grill", v: "Moonshine Grill", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 58, day: "Saturday", t: "10:00 AM", e2: "10:00 PM", title: "Space House: Day One", ev: "201 E. 5th", v: "201 E. 5th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 59, day: "Saturday", t: "10:00 AM", e2: "6:00 PM", title: "Valeo Tech Drive-In: Day Three", ev: "Fairmont Austin (5th Floor)", v: "Fairmont Austin (5th Floor)", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 60, day: "Saturday", t: "10:00 AM", e2: "1:00 PM", title: "The Sports, Tech & Venture Brunch with Plain Sight", ev: "TBA", v: "TBA", sp: [], g: ["food", "ai"], cat: "food", food: false, free: true, badge: false },
  { id: 61, day: "Saturday", t: "10:00 AM", e2: "7:00 PM", title: "The Public House For The Future", ev: "Thompson Austin (Red River Ballroom)", v: "Thompson Austin (Red River Ballroom)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 62, day: "Saturday", t: "10:00 AM", e2: "3:15 PM", title: "The Impact Lounge: Day One", ev: "The LINE Hotel", v: "The LINE Hotel", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 63, day: "Saturday", t: "10:00 AM", e2: "6:30 PM", title: "Fast Company Grill: Day Two", ev: "Cedar Door", v: "Cedar Door", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 64, day: "Saturday", t: "10:00 AM", e2: "7:00 PM", title: "Experience The Future Of Flight with Cirrus: Day Two", ev: "510 E. 5th", v: "510 E. 5th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 65, day: "Saturday", t: "10:00 AM", e2: "6:00 PM", title: "Vox Media Podcast Stage: Day Two", ev: "Hilton Downtown (Salon C)", v: "Hilton Downtown (Salon C)", sp: [], g: ["creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 66, day: "Saturday", t: "10:00 AM", e2: "10:00 PM", title: "Superhuman: Day One", ev: "Antone's", v: "Antone's", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 67, day: "Saturday", t: "10:00 AM", e2: "11:00 PM", title: "Tennessee House Day Two: Nooga In The Morning, Nash At Night", ev: "Electric Shuffle", v: "Electric Shuffle", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 68, day: "Saturday", t: "10:00 AM", e2: "4:30 PM", title: "Accenture: Day Two", ev: "Accenture Office", v: "Accenture Office", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 69, day: "Saturday", t: "10:00 AM", e2: "5:00 PM", title: "Yamaha Creator Pass Studio: Day Two", ev: "Marriott Downtown (Waller Ballroom B)", v: "Marriott Downtown (Waller Ballroom B)", sp: [], g: ["creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 70, day: "Saturday", t: "10:00:00", e2: "", title: "Cafe Con Ron: SXSW Edition", ev: "Lefty's Brick Bar", v: "Lefty's Brick Bar", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 71, day: "Saturday", t: "10:00 AM", e2: "1:00 PM", title: "VC Brunch at Cap Factory", ev: "Capital Factory", v: "Capital Factory", sp: [], g: ["food", "fundraising"], cat: "food", food: true, free: true, badge: false },
  { id: 72, day: "Saturday", t: "10:00 AM", e2: "5:30 PM", title: "Inc. Founders House: Day Two", ev: "Foxy's Proper Pub", v: "Foxy's Proper Pub", sp: [], g: ["food", "fundraising"], cat: "sessions", food: true, free: true, badge: false },
  { id: 73, day: "Saturday", t: "10:00 AM", e2: "5:00 PM", title: "Flatstock: Day Two", ev: "Marriott Downtown (Moontower Hall)", v: "Marriott Downtown (Moontower Hall)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 74, day: "Saturday", t: "10:00 AM", e2: "12:00 PM", title: "Feed The City SXSW Edition (make sandwiches for those in need)", ev: "Bouldin Acres S. Lamar", v: "Bouldin Acres S. Lamar", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 75, day: "Saturday", t: "10:00 AM", e2: "6:00 PM", title: "Mercury Pop-Up: Day Two", ev: "2nd & Brazos", v: "2nd & Brazos", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 76, day: "Saturday", t: "10:00 AM", e2: "5:00 PM", title: "Unlocking Creativity & Culture with Yamaha: Day Two", ev: "Marriott Downtown", v: "Marriott Downtown", sp: [], g: ["community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 77, day: "Saturday", t: "10:00 AM", e2: "5:00 PM", title: "Logitech Pedal Pub: Day Two", ev: "Margaret Moser Plaza", v: "Margaret Moser Plaza", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 78, day: "Saturday", t: "10:30 AM", e2: "11:00 PM", title: "Halo+ Haus: Day Three", ev: "4th St. (between Congress/Colorado)", v: "4th St. (between Congress/Colorado)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 79, day: "Saturday", t: "10:30 AM", e2: "11:30 AM", title: "Dolphin Tank", ev: "Waller Creek Boathouse", v: "Waller Creek Boathouse", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 80, day: "Saturday", t: "10:30:00", e2: "", title: "BMI Brunch", ev: "South Congress Hotel", v: "South Congress Hotel", sp: [], g: ["food"], cat: "food", food: true, free: true, badge: false },
  { id: 81, day: "Saturday", t: "10:30 AM", e2: "5:00 PM", title: "Realtor dot com Open House: Day Two", ev: "901 E. 6th St.", v: "901 E. 6th St.", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 82, day: "Saturday", t: "10:30 AM", e2: "4:00 PM", title: "Luma presents SXAI with Robert Rodriguez & AWS", ev: "Troublemaker Studios", v: "Troublemaker Studios", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 83, day: "Saturday", t: "11:00 AM", e2: "9:00 PM", title: "Midwest House: Day Three", ev: "Texas Bankers Association", v: "Texas Bankers Association", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 84, day: "Saturday", t: "11:00 AM", e2: "7:00 PM", title: "Funded House Investor Lounge: Day Three", ev: "Texas Bankers Association", v: "Texas Bankers Association", sp: [], g: ["fundraising", "fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 85, day: "Saturday", t: "11:00 AM", e2: "5:00 PM", title: "Founder Fest: SXSW Edition", ev: "Cabana Club", v: "Cabana Club", sp: [], g: ["fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 86, day: "Saturday", t: "11:00 AM", e2: "10:00 PM", title: "Impact Arcade: Day Two", ev: "Sapien Center", v: "Sapien Center", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 87, day: "Saturday", t: "11:00 AM", e2: "1:00 PM", title: "Female Founders & Investors Breakfast Club", ev: "TBA", v: "TBA", sp: [], g: ["food", "fundraising", "women"], cat: "food", food: false, free: true, badge: false },
  { id: 88, day: "Saturday", t: "11:00 AM", e2: "2:00 PM", title: "Austin Film Society SXSW 2026 Party", ev: "AFS Cinema", v: "AFS Cinema", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 89, day: "Saturday", t: "11:00 AM", e2: "2:00 PM", title: "Mushroom Cowboy presents: The Morning Spin", ev: "Cosmic Saltillo", v: "Cosmic Saltillo", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 90, day: "Saturday", t: "11:00 AM", e2: "4:00 PM", title: "Do It In The Morning RNB Party ($)", ev: "Victory East", v: "Victory East", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 91, day: "Saturday", t: "11:00 AM", e2: "7:00 PM", title: "Future POD During SXSW", ev: "Lighthouse Solar", v: "Lighthouse Solar", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 92, day: "Saturday", t: "11:00 AM", e2: "12:00 AM", title: "Vision:8291: Day One", ev: "Canopy", v: "Canopy", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 93, day: "Saturday", t: "11:00 AM", e2: "6:00 PM", title: "Munich Haus", ev: "German-Texas Heritage Society", v: "German-Texas Heritage Society", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 94, day: "Saturday", t: "11:00 AM", e2: "1:00 PM", title: "The Founders & Funders Breakfast", ev: "TBA", v: "TBA", sp: [], g: ["food", "fundraising", "fun"], cat: "food", food: false, free: true, badge: false },
  { id: 95, day: "Saturday", t: "11:00 AM", e2: "5:00 PM", title: "La French Touch Rendez-vous (Day)", ev: "Venue 6 (516 E. 6th)", v: "Venue 6 (516 E. 6th)", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 96, day: "Saturday", t: "11:00 AM", e2: "5:30 PM", title: "Americana First, Part Two", ev: "Arlyn Studios", v: "Arlyn Studios", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 97, day: "Saturday", t: "11:00 AM", e2: "5:00 PM", title: "Los Primos Pop-Up", ev: "4609 Alf Ave (a house)", v: "4609 Alf Ave (a house)", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 98, day: "Saturday", t: "11:00 AM", e2: "7:00 PM", title: "Kevin Morby's Sandlot All-Stars", ev: "The Long Time (sandlot field)", v: "The Long Time (sandlot field)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 99, day: "Saturday", t: "11:00 AM", e2: "2:00 PM", title: "Digital Voices: Turning Trends Into Commercial Impact", ev: "Soho House", v: "Soho House", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 100, day: "Saturday", t: "11:00 AM", e2: "2:00 PM", title: "Lone Star Honky Tonk Hangover Brunch", ev: "Hotel Vegas", v: "Hotel Vegas", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 101, day: "Saturday", t: "11:00:00", e2: "", title: "Peloton x SHE Media: 20 Min Workout 2", ev: "La Zona Rosa", v: "La Zona Rosa", sp: [], g: ["fitness", "women"], cat: "fitness", food: false, free: true, badge: false },
  { id: 102, day: "Saturday", t: "11:00 AM", e2: "12:30 PM", title: "Blumhouse SXSW Horror Trivia Meet-Up", ev: "Swift's Attic", v: "Swift's Attic", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 103, day: "Saturday", t: "11:00 AM", e2: "7:00 PM", title: "Congress Avenue Block Party: Day Three", ev: "900 Congress Ave. (Street)", v: "900 Congress Ave. (Street)", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 104, day: "Saturday", t: "11:00 AM", e2: "3:00 PM", title: "Nike Air Max 95 OG 'Bandana' Release Party", ev: "Sneaker Politics", v: "Sneaker Politics", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 105, day: "Saturday", t: "11:00 AM", e2: "4:00 PM", title: "Logitech Lunch Break: Day Two", ev: "The Picnic Food Park", v: "The Picnic Food Park", sp: [], g: ["food", "ai"], cat: "food", food: true, free: true, badge: false },
  { id: 106, day: "Saturday", t: "11:00 AM", e2: "7:00 PM", title: "Canival Cruises LOL Booth: Day Three", ev: "Three locations (see details)", v: "Three locations (see details)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 107, day: "Saturday", t: "11:00 AM", e2: "1:00 PM", title: "Fireside Chat with Michael Seckler, Justworks CEO", ev: "Antler VC", v: "Antler VC", sp: [], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 108, day: "Saturday", t: "11:00 AM", e2: "9:00 PM", title: "Keystone House with Amplify Philly", ev: "Half Step on Rainey", v: "Half Step on Rainey", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 109, day: "Saturday", t: "11:00 AM", e2: "8:30 PM", title: "Smoke, Sounds & Suds Showcase: Day Two", ev: "Stiles Switch BBQ", v: "Stiles Switch BBQ", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 110, day: "Saturday", t: "11:00 AM", e2: "9:30 PM", title: "Casa Argentina: Day Two", ev: "Inn Cahoots", v: "Inn Cahoots", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 111, day: "Saturday", t: "11:30 AM", e2: "7:00 PM", title: "Behind The Camera House", ev: "The Graeber House", v: "The Graeber House", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 112, day: "Saturday", t: "12:00 PM", e2: "7:00 PM", title: "German Haus: Day Three (Berlin House)", ev: "Speakeasy", v: "Speakeasy", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 113, day: "Saturday", t: "12:00 PM", e2: "8:00 PM", title: "Invincible Vs. Arcade Pop Up: Day Three", ev: "4th & Brazos (street)", v: "4th & Brazos (street)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 114, day: "Saturday", t: "12:00 PM", e2: "3:00 PM", title: "Converge at Soho House", ev: "Soho House", v: "Soho House", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 115, day: "Saturday", t: "12:00 PM", e2: "10:00 PM", title: "SXSW Film & TV Clubhouse: Day Three", ev: "800 Congress", v: "800 Congress", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 116, day: "Saturday", t: "12:00 PM", e2: "7:30 PM", title: "Capital For The Culture Innovation Hub", ev: "The Cathedral", v: "The Cathedral", sp: [], g: ["fundraising", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 117, day: "Saturday", t: "12:00 PM", e2: "9:00 PM", title: "St. Elmo x St. Elmo Music Festival: Day Three (South)", ev: "St. Elmo South (St. Elmo)", v: "St. Elmo South (St. Elmo)", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 118, day: "Saturday", t: "12:00 PM", e2: "8:00 PM", title: "Peaky Blinders: The Immortal Man (THE GARRISON) by Netflix Day Three", ev: "The Fox Den", v: "The Fox Den", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 119, day: "Saturday", t: "12:00 PM", e2: "8:00 PM", title: "Slovak House: Going BIG In Texas", ev: "Q-Branch", v: "Q-Branch", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 120, day: "Saturday", t: "12:00 PM", e2: "10:00 PM", title: "SXSW Innovation Clubhouse: Day Three", ev: "Brazos Hall", v: "Brazos Hall", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 121, day: "Saturday", t: "12:00:00", e2: "", title: "JBL Livebrary: Day Three", ev: "3TEN at ACL Live", v: "3TEN at ACL Live", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 122, day: "Saturday", t: "12:00 PM", e2: "10:00 PM", title: "Meanwhile @ Colton House: Day Three", ev: "Colton House Hotel", v: "Colton House Hotel", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 123, day: "Saturday", t: "12:00 PM", e2: "2:00 PM", title: "PUFFCO Sesh at Power Smoke Dispensary", ev: "Power Smoke Dispensary", v: "Power Smoke Dispensary", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 124, day: "Saturday", t: "12:00:00", e2: "", title: "Kerrville Folk Festival Showcase", ev: "Radio South", v: "Radio South", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 125, day: "Saturday", t: "12:00 PM", e2: "7:00 PM", title: "Axios House: Day Two", ev: "Inn Cahoots", v: "Inn Cahoots", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 126, day: "Saturday", t: "12:00 PM", e2: "10:00 PM", title: "Music, Art, Life", ev: "Kenny Dorham's Backyard", v: "Kenny Dorham's Backyard", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 127, day: "Saturday", t: "12:00 PM", e2: "8:00 PM", title: "SXSW Music Clubhouse: Day Two", ev: "Downright Austin", v: "Downright Austin", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 128, day: "Saturday", t: "12:00 PM", e2: "5:00 PM", title: "Shokworks: Day Three", ev: "Bohn House", v: "Bohn House", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 129, day: "Saturday", t: "12:00 PM", e2: "2:00 AM", title: "Austin Rhythm Revival Americana Showcase: Day Three", ev: "San Jac Saloon", v: "San Jac Saloon", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 130, day: "Saturday", t: "12:00 PM", e2: "11:00 PM", title: "Paramount+ The Lodge: Day Three", ev: "Clive Bar on Rainey", v: "Clive Bar on Rainey", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 131, day: "Saturday", t: "12:00 PM", e2: "8:00 PM", title: "Frontiers Of Innovation Day at Canada House", ev: "Central District Brewing", v: "Central District Brewing", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 132, day: "Saturday", t: "12:00 PM", e2: "3:00 PM", title: "Capital & Innovation Salon w/ 1Philadelphia & Morgan Stanley", ev: "TBA", v: "TBA", sp: [], g: ["fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 133, day: "Saturday", t: "12:00 PM", e2: "6:00 PM", title: "Copeland Haus Designer Vintage Pop-Up Shop: Day Three", ev: "Hotel Van Zandt", v: "Hotel Van Zandt", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 134, day: "Saturday", t: "12:00 PM", e2: "7:00 PM", title: "The Best Paste Party Ever: Day One", ev: "High Noon", v: "High Noon", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 135, day: "Saturday", t: "12:00 PM", e2: "7:00 PM", title: "Happen Twice presents: Webbervillage Day Three", ev: "2505 Webberville Rd.", v: "2505 Webberville Rd.", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 136, day: "Saturday", t: "12:00 PM", e2: "6:00 PM", title: "The 4th Annual Club X Showcase", ev: "The 13th Floor", v: "The 13th Floor", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 137, day: "Saturday", t: "12:00 PM", e2: "3:00 PM", title: "Later Ice Cream Truck: Day Two", ev: "415 E. 7th", v: "415 E. 7th", sp: [], g: ["food"], cat: "food", food: true, free: true, badge: false },
  { id: 138, day: "Saturday", t: "12:00 PM", e2: "5:00 PM", title: "Vinyl Ranch & Kennimer: The Best Little Pool Party in TX", ev: "Kitty Cohen's", v: "Kitty Cohen's", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 139, day: "Saturday", t: "12:00:00", e2: "", title: "South By San Jose 2026: Day Three", ev: "Hotel San Jose", v: "Hotel San Jose", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 140, day: "Saturday", t: "12:00 PM", e2: "8:00 PM", title: "Radio Day Stage at Downright: Day Two", ev: "Downright Austin (backyard)", v: "Downright Austin (backyard)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 141, day: "Saturday", t: "12:00 PM", e2: "9:00 PM", title: "Kill Tony Pop-Up Shop: Day Three", ev: "325 E. 6th", v: "325 E. 6th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 142, day: "Saturday", t: "12:00 PM", e2: "8:00 PM", title: "Ledger x Spurs Hoops: Day Three", ev: "4th & Brazos", v: "4th & Brazos", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 143, day: "Saturday", t: "12:00 PM", e2: "8:00 PM", title: "Burger Mart from the show Invincible, with Prime Video & Brisk: Day Three", ev: "201 E. 4th St.", v: "201 E. 4th St.", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 144, day: "Saturday", t: "12:00 PM", e2: "4:00 PM", title: "UNWELL COUNTY FAIR: DAY TWO", ev: "Lustre Pearl East", v: "Lustre Pearl East", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 145, day: "Saturday", t: "12:00 PM", e2: "9:00 PM", title: "Billboard HOUSE: Day Two", ev: "Mohawk", v: "Mohawk", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 146, day: "Saturday", t: "12:30 PM", e2: "1:30 PM", title: "AI Without Borders at Ireland House", ev: "Marlow", v: "Marlow", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 147, day: "Saturday", t: "12:30 PM", e2: "4:30 PM", title: "The Social Fabric Austin Icons Taco Tour", ev: "Downtown (tour of spots)", v: "Downtown (tour of spots)", sp: [], g: ["food"], cat: "food", food: true, free: true, badge: false },
  { id: 148, day: "Saturday", t: "12:30 PM", e2: "10:30 PM", title: "Texas House: Day Two", ev: "304 E. 3rd St.", v: "304 E. 3rd St.", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 149, day: "Saturday", t: "1:00 PM", e2: "8:00 PM", title: "Waterloo Records Day Parties: Day Three", ev: "Waterloo Records", v: "Waterloo Records", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 150, day: "Saturday", t: "1:00 PM", e2: "7:30 PM", title: "Regen House", ev: "Parkside", v: "Parkside", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 151, day: "Saturday", t: "1:00 PM", e2: "9:00 PM", title: "St. Elmo x St. Elmo Music Festival: Day Three (East)", ev: "St. Elmo Springdale (East)", v: "St. Elmo Springdale (East)", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 152, day: "Saturday", t: "1:00 PM", e2: "7:00 PM", title: "Fiesta Destructo", ev: "Hotel Vegas", v: "Hotel Vegas", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 153, day: "Saturday", t: "1:00 PM", e2: "6:00 PM", title: "Redbreast Unhidden Box Office: Day Three", ev: "The Contemporary", v: "The Contemporary", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 154, day: "Saturday", t: "1:00 PM", e2: "9:00 PM", title: "ZeroZero Music Takeover", ev: "East End Ballroom", v: "East End Ballroom", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 155, day: "Saturday", t: "1:00 PM", e2: "7:00 PM", title: "Winspear & Vertigo Vinyl 2026 SXSW Day Party", ev: "Cheer Up Charlies", v: "Cheer Up Charlies", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 156, day: "Saturday", t: "1:00 PM", e2: "10:00 PM", title: "Balanced Breakfest: Day Two", ev: "Woody's Bar", v: "Woody's Bar", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 157, day: "Saturday", t: "1:00 PM", e2: "6:00 PM", title: "Free 4 Y'all Day Party Showcase: Day Two", ev: "Swan Dive", v: "Swan Dive", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 158, day: "Saturday", t: "1:00 PM", e2: "4:00 PM", title: "Camp Outlander BBQ", ev: "TBA", v: "TBA", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 159, day: "Saturday", t: "1:00 PM", e2: "4:00 PM", title: "Tipify B-Side Sessions", ev: "Magic Isle Record Shop", v: "Magic Isle Record Shop", sp: [], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 160, day: "Saturday", t: "1:00 PM", e2: "4:00 PM", title: "Agency Owner Mixer", ev: "TBA", v: "TBA", sp: [], g: ["networking", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 161, day: "Saturday", t: "1:00 PM", e2: "6:00 PM", title: "101X Day Party: Day Three", ev: "Inn Cahoots", v: "Inn Cahoots", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 162, day: "Saturday", t: "1:00 PM", e2: "7:00 PM", title: "Winspear x Vertigo Vinyl Day Party & Record Signing", ev: "Cheer Up Charlies", v: "Cheer Up Charlies", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 163, day: "Saturday", t: "1:30 PM", e2: "5:00 PM", title: "Wellness Day Party", ev: "TBA", v: "TBA", sp: [], g: ["fitness", "fun"], cat: "fitness", food: false, free: true, badge: false },
  { id: 164, day: "Saturday", t: "1:30 PM", e2: "6:30 PM", title: "The Light House: Day Two", ev: "The Belmont", v: "The Belmont", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 165, day: "Saturday", t: "2:00 PM", e2: "3:00 AM", title: "House Of Yes: Day Two", ev: "Bathe Austin", v: "Bathe Austin", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 166, day: "Saturday", t: "2:00 PM", e2: "9:30 PM", title: "The HYBRD Effect with Minted Greens ($)", ev: "Butler Pitch & Putt", v: "Butler Pitch & Putt", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 167, day: "Saturday", t: "2:00 PM", e2: "6:00 PM", title: "Connecty Ice Cream + Coffee Social", ev: "Cenote", v: "Cenote", sp: [], g: ["food", "networking"], cat: "food", food: true, free: true, badge: false },
  { id: 168, day: "Saturday", t: "2:00 PM", e2: "8:00 PM", title: "Lone Star Roadhouse: Day Two", ev: "East End Ballroom", v: "East End Ballroom", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 169, day: "Saturday", t: "2:00 PM", e2: "5:00 PM", title: "inKind House", ev: "The Stay Put on Rainey", v: "The Stay Put on Rainey", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 170, day: "Saturday", t: "2:00 PM", e2: "5:00 PM", title: "KUTX Day Party at Rivian: Day Two", ev: "Rivian Showroom", v: "Rivian Showroom", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 171, day: "Saturday", t: "2:00 PM", e2: "10:00 PM", title: "Sips & Sounds Fest with Coca-Cola: Day Two ($)", ev: "Auditorium Shores", v: "Auditorium Shores", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 172, day: "Saturday", t: "2:00 PM", e2: "10:00 PM", title: "Slime Fest 2026", ev: "Cherrywood Coffeehouse", v: "Cherrywood Coffeehouse", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 173, day: "Saturday", t: "2:00 PM", e2: "4:00 PM", title: "Beyond The West: Exhibition & Artist Talk", ev: "West Chelsea Contemporary", v: "West Chelsea Contemporary", sp: [], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 174, day: "Saturday", t: "2:00 PM", e2: "6:00 PM", title: "Brass Knuckle Film Party with Robert Rodriguez", ev: "Troublemaker Studios", v: "Troublemaker Studios", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 175, day: "Saturday", t: "2:30 PM", e2: "3:30 PM", title: "The World's Game, Our Stage: FOX Sports FIFA World Cup 2026 Panel", ev: "Marriott Downtown (Ballroom D)", v: "Marriott Downtown (Ballroom D)", sp: [], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 176, day: "Saturday", t: "3:00 PM", e2: "6:00 PM", title: "Founder Happy Hour", ev: "TBA", v: "TBA", sp: [], g: ["fundraising", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 177, day: "Saturday", t: "3:00 PM", e2: "9:00 PM", title: "DreamFest ($)", ev: "Factory On 5th", v: "Factory On 5th", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 178, day: "Saturday", t: "3:00 PM", e2: "6:00 PM", title: "Luck On The Lawn at Hotel Magdalena", ev: "Hotel Magdalena", v: "Hotel Magdalena", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 179, day: "Saturday", t: "3:00 PM", e2: "12:00 AM", title: "Do512 presents: The Big One", ev: "Radio/East", v: "Radio/East", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 180, day: "Saturday", t: "3:00 PM", e2: "6:00 PM", title: "Future Of Travel Wellness with Nappr x Bubbl x Flex-N-Fly", ev: "Little Woodrow's (West 6th)", v: "Little Woodrow's (West 6th)", sp: [], g: ["fitness"], cat: "fitness", food: false, free: true, badge: false },
  { id: 181, day: "Saturday", t: "3:00 PM", e2: "9:00 PM", title: "Manychat Creator Hub & Club", ev: "Daydreamer", v: "Daydreamer", sp: [], g: ["food", "creators"], cat: "sessions", food: true, free: true, badge: false },
  { id: 182, day: "Saturday", t: "3:30 PM", e2: "6:30 PM", title: "Basis & Corsa Digital Happy Hour", ev: "Mexta", v: "Mexta", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 183, day: "Saturday", t: "4:00 PM", e2: "10:00 PM", title: "Tardezinha do Twins: Brazilian Day Party ($)", ev: "Twins Nightlcub and Rooftop", v: "Twins Nightlcub and Rooftop", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 184, day: "Saturday", t: "4:00 PM", e2: "9:00 PM", title: "PayDay LA Invades Austin 2", ev: "Oribello's Bar & Kitchen", v: "Oribello's Bar & Kitchen", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 185, day: "Saturday", t: "4:00 PM", e2: "9:00 PM", title: "Freaknik Block Party", ev: "506 West Ave.", v: "506 West Ave.", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 186, day: "Saturday", t: "4:00 PM", e2: "5:30 PM", title: "Audible presents Michael Crus Kayne (What Else... What Else...)", ev: "Esther's Follies", v: "Esther's Follies", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 187, day: "Saturday", t: "4:00 PM", e2: "9:00 PM", title: "Tropicasa Unofficial Showcase", ev: "Coconut Club", v: "Coconut Club", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 188, day: "Saturday", t: "4:00 PM", e2: "6:00 PM", title: "MOCEAN Happy Hour", ev: "North Italia", v: "North Italia", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 189, day: "Saturday", t: "4:00 PM", e2: "6:30 PM", title: "Defense Tech Happy Hour", ev: "Central Machine Works", v: "Central Machine Works", sp: [], g: ["ai", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 190, day: "Saturday", t: "4:00 PM", e2: "8:00 AM", title: "Monster Children Takes Texas", ev: "The Flower Shop", v: "The Flower Shop", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 191, day: "Saturday", t: "4:00 PM", e2: "6:00 PM", title: "EA Sports FC 26 Immersive Gaming Experience", ev: "Palm Door on Sixth", v: "Palm Door on Sixth", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 192, day: "Saturday", t: "4:30 PM", e2: "6:30 PM", title: "Fluffi Inclusivity In Beauty Panel", ev: "Soho House", v: "Soho House", sp: [], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 193, day: "Saturday", t: "4:30 PM", e2: "7:00 PM", title: "OpenClaw: Builders & Beers", ev: "Mort Subite", v: "Mort Subite", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 194, day: "Saturday", t: "5:00 PM", e2: "6:30 PM", title: "Sao Paolo Meets The World", ev: "3rd & Congress", v: "3rd & Congress", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 195, day: "Saturday", t: "5:00 PM", e2: "6:00 PM", title: "Creative Eire with Redbreast at Ireland House", ev: "Marlow", v: "Marlow", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 196, day: "Saturday", t: "5:30 PM", e2: "8:00 PM", title: "Creator Exec Event with RockWater ($)", ev: "The Eleanor", v: "The Eleanor", sp: [], g: ["creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 197, day: "Saturday", t: "5:30 PM", e2: "8:30 PM", title: "Builders After Hours: Austin Happy Hour", ev: "TBA", v: "TBA", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 198, day: "Saturday", t: "6:00 PM", e2: "11:00 PM", title: "Poder Suave 2026 SXSW", ev: "Gensler", v: "Gensler", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 199, day: "Saturday", t: "6:00 PM", e2: "2:00 AM", title: "Fidels + Sluggers Hit Pop-Up: Day Two", ev: "Blindside Lounge", v: "Blindside Lounge", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 200, day: "Saturday", t: "18:00:00", e2: "", title: "Rolling Stone: Future Of Music Day Three (BigXThaPlug)", ev: "ACL Live", v: "ACL Live", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 201, day: "Saturday", t: "6:00 PM", e2: "11:30 PM", title: "Afrobeats Party with Travelbay ($)", ev: "TBA", v: "TBA", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 202, day: "Saturday", t: "18:00:00", e2: "", title: "Incendia: Day Two ($)", ev: "Carson Creek Ranch", v: "Carson Creek Ranch", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 203, day: "Saturday", t: "6:00 PM", e2: "9:00 PM", title: "Secret Austin Garden Party", ev: "Austin Garden at Inn Cahoots", v: "Austin Garden at Inn Cahoots", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 204, day: "Saturday", t: "6:00 PM", e2: "11:00 PM", title: "South By South Emo", ev: "Fast Friends Beer Co.", v: "Fast Friends Beer Co.", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 205, day: "Saturday", t: "6:00 PM", e2: "10:00 PM", title: "Buggg Launch Party", ev: "RichesArt Gallery", v: "RichesArt Gallery", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 206, day: "Saturday", t: "6:00 PM", e2: "8:30 PM", title: "AI Leaders Of SXSW", ev: "TBA", v: "TBA", sp: [], g: ["food", "ai"], cat: "sessions", food: true, free: true, badge: false },
  { id: 207, day: "Saturday", t: "6:00 PM", e2: "11:00 PM", title: "Casa Minas: Day One", ev: "Parlor Room on Rainey", v: "Parlor Room on Rainey", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 208, day: "Saturday", t: "6:00 PM", e2: "8:00 PM", title: "Orville Peck at Rivian Electric Joyride", ev: "800 Congress", v: "800 Congress", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 209, day: "Saturday", t: "6:00 PM", e2: "10:00 PM", title: "The Onion + Bluesky Party", ev: "King Bee", v: "King Bee", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 210, day: "Saturday", t: "6:30 PM", e2: "8:30 PM", title: "Insights Career Network Fundraiser", ev: "Cosmic Pickle", v: "Cosmic Pickle", sp: [], g: ["fundraising", "networking", "fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 211, day: "Saturday", t: "6:30 PM", e2: "10:30 PM", title: "UNWELL COUNTY FAIR: DAY NIGHT TWO", ev: "Lustre Pearl East", v: "Lustre Pearl East", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 212, day: "Saturday", t: "7:00 PM", e2: "11:00 PM", title: "Austin Sounds: Day Three (KAZI FM Showcase)", ev: "Lefty's Brick Bar", v: "Lefty's Brick Bar", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 213, day: "Saturday", t: "19:00:00", e2: "", title: "Billboard: The Stage Day Two (Junior H)", ev: "Moody Amphitheater", v: "Moody Amphitheater", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 214, day: "Saturday", t: "7:00 PM", e2: "2:00 AM", title: "Finest Cuts After Party", ev: "206 Trinity St.", v: "206 Trinity St.", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 215, day: "Saturday", t: "7:00 PM", e2: "11:00 PM", title: "Callen 2026 SXSW Party", ev: "1408 E. 6th", v: "1408 E. 6th", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 216, day: "Saturday", t: "7:00 PM", e2: "11:00 PM", title: "Companion presents: In Good Company", ev: "Skybox on 6th", v: "Skybox on 6th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 217, day: "Saturday", t: "7:00 PM", e2: "12:00 AM", title: "Dean's List Showcase", ev: "Shangri-La", v: "Shangri-La", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 218, day: "Saturday", t: "7:00 PM", e2: "11:00 PM", title: "Redbreast Unhidden Bar: Day Two", ev: "Powder Room", v: "Powder Room", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 219, day: "Saturday", t: "7:00 PM", e2: "1:00 AM", title: "Kaash Paige & Friends Showcase", ev: "Brushy Street Commons", v: "Brushy Street Commons", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 220, day: "Saturday", t: "7:00 PM", e2: "11:00 PM", title: "REVOLT HOUSE AUSTIN", ev: "Vulcan Gas Company", v: "Vulcan Gas Company", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 221, day: "Saturday", t: "7:00 PM", e2: "2:00 AM", title: "End Of The Trail Creative Showcase", ev: "Las Perlas", v: "Las Perlas", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 222, day: "Saturday", t: "7:00 PM", e2: "2:00 AM", title: "Cloudflare + Deepgram Party", ev: "Kitty Cohen's", v: "Kitty Cohen's", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 223, day: "Saturday", t: "7:00 PM", e2: "10:00 PM", title: "Dream Con Music Showcase", ev: "Riviere Austin", v: "Riviere Austin", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 224, day: "Saturday", t: "7:00 PM", e2: "2:00 AM", title: "SoSouth House with Lil Keke", ev: "Mala Fama", v: "Mala Fama", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 225, day: "Saturday", t: "7:00 PM", e2: "12:00 AM", title: "Global Stage at Downright: Day Three", ev: "Downright Austin (backyard)", v: "Downright Austin (backyard)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 226, day: "Saturday", t: "7:00 PM", e2: "11:00 PM", title: "Kollective SXSW Party", ev: "TBA", v: "TBA", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 227, day: "Saturday", t: "19:30:00", e2: "", title: "Austin Cinematography Group Party", ev: "High Noon", v: "High Noon", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 228, day: "Saturday", t: "7:30 PM", e2: "10:00 PM", title: "Twitch SXSW Meetup", ev: "Vigilante Gastropub", v: "Vigilante Gastropub", sp: [], g: ["food", "networking"], cat: "sessions", food: true, free: true, badge: false },
  { id: 229, day: "Saturday", t: "7:30 PM", e2: "1:00 AM", title: "British Music Embassy: BBC Introducing (Night Three)", ev: "Palm Door On Sixth", v: "Palm Door On Sixth", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 230, day: "Saturday", t: "7:30 PM", e2: "10:00 PM", title: "An Evening At Comedor with Framer x COLLINS", ev: "Comedor", v: "Comedor", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 231, day: "Saturday", t: "19:30:00", e2: "", title: "Austin Cinematography Group Meet Up", ev: "High Noon", v: "High Noon", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 232, day: "Saturday", t: "8:00 PM", e2: "2:00 AM", title: "Berlin Music Night at German Haus", ev: "Speakeasy", v: "Speakeasy", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 233, day: "Saturday", t: "8:00 PM", e2: "12:00 AM", title: "Late Shift Music Showcase", ev: "Dadalab", v: "Dadalab", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 234, day: "Saturday", t: "8:00 PM", e2: "1:00 AM", title: "Tunnel Rave", ev: "Austin High Tunnels", v: "Austin High Tunnels", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 235, day: "Saturday", t: "8:00 PM", e2: "2:00 AM", title: "M For Mothland + Project Nowhere Showcases", ev: "Swan Dive", v: "Swan Dive", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 236, day: "Saturday", t: "8:00 PM", e2: "11:00 PM", title: "Yahoo's Scout Inn: Day One (Jessie Murph)", ev: "Scoot Inn", v: "Scoot Inn", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 237, day: "Saturday", t: "8:00 PM", e2: "2:00 AM", title: "Algo Rave with DJ Dave", ev: "Kingdom", v: "Kingdom", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 238, day: "Saturday", t: "8:00 PM", e2: "11:30 PM", title: "Late Shift ATX Showcase", ev: "Dadalab", v: "Dadalab", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 239, day: "Saturday", t: "8:00 PM", e2: "1:00 AM", title: "Armadillo World Headquarters Showcase: Day Two", ev: "Saxon Pub", v: "Saxon Pub", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 240, day: "Saturday", t: "8:00 PM", e2: "2:00 AM", title: "Vic Mensa Found On Nero Showcase", ev: "Flamingo Cantina", v: "Flamingo Cantina", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 241, day: "Saturday", t: "8:30 PM", e2: "9:45 PM", title: "Quinn XCII at Superhuman", ev: "Antone's", v: "Antone's", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 242, day: "Saturday", t: "8:30 PM", e2: "2:00 AM", title: "La French Touch Rendez-vous (Night Showcase)", ev: "Venue 6 (516 E. 6th)", v: "Venue 6 (516 E. 6th)", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 243, day: "Saturday", t: "9:00 PM", e2: "12:00 AM", title: "SXIO: Invite Only at Armadillo Music Fest", ev: "Armadillo Den", v: "Armadillo Den", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 244, day: "Saturday", t: "9:00 PM", e2: "1:00 AM", title: "SPOTIFY 20TH ANNIVERSARY SHOWCASE", ev: "Stubb's", v: "Stubb's", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 245, day: "Saturday", t: "9:00 PM", e2: "3:00 AM", title: "House Of Yes presents: Good Comapany with DJ Minx", ev: "Bathe Austin", v: "Bathe Austin", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 246, day: "Saturday", t: "9:00 PM", e2: "12:30 AM", title: "The Light House: Closing Party", ev: "The Belmont", v: "The Belmont", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 247, day: "Saturday", t: "9:00 PM", e2: "2:00 AM", title: "All The Vibes SXSW Party", ev: "Roma Nightclub", v: "Roma Nightclub", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 248, day: "Saturday", t: "9:00 PM", e2: "3:00 AM", title: "Pangea Sound Austin ($)", ev: "Coconut Club", v: "Coconut Club", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 249, day: "Saturday", t: "9:00 PM", e2: "3:00 AM", title: "Night Ride x SXSW ($)", ev: "Coconut Club", v: "Coconut Club", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 250, day: "Saturday", t: "9:00 PM", e2: "11:00 PM", title: "Superconnectors Austin 2026", ev: "German-Texas Heritage Society", v: "German-Texas Heritage Society", sp: [], g: ["networking"], cat: "sessions", food: false, free: true, badge: false },
  { id: 251, day: "Saturday", t: "9:00 PM", e2: "11:30 PM", title: "Alexis Texas Live at Red Rose ($)", ev: "The Yellow Rose", v: "The Yellow Rose", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 252, day: "Saturday", t: "21:30:00", e2: "", title: "Genuin 5th Annual Secret SXSW Social", ev: "TBA", v: "TBA", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 253, day: "Saturday", t: "22:00:00", e2: "", title: "Foster The People DJ Set at Mayfair ($)", ev: "Mayfair", v: "Mayfair", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 254, day: "Saturday", t: "10:00 PM", e2: "2:00 AM", title: "Billboard HOUSE: Night Two (Los Guitarrazos)", ev: "Mohawk", v: "Mohawk", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 255, day: "Saturday", t: "11:00 PM", e2: "5:00 AM", title: "HOT LIQUID AFTER PARTY ($)", ev: "Warehouse at 620 Canion St.", v: "Warehouse at 620 Canion St.", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 256, day: "Saturday", t: "12:00 PM", e2: "", title: "Variety Next Generation Podcast Brunch pres by Google", ev: "TBA", v: "TBA", sp: [], g: ["food", "creators"], cat: "food", food: false, free: true, badge: false },
  { id: 257, day: "Saturday", t: "12:00 PM", e2: "", title: "Logitech: Logi Work On Wheels Day Three", ev: "4th & Brazos", v: "4th & Brazos", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 258, day: "Saturday", t: "12:00 PM", e2: "", title: "Liberty Nites: Day Three", ev: "The Liberty", v: "The Liberty", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 259, day: "Saturday", t: "12:00 PM", e2: "", title: "Canada House: Day Two", ev: "Central District Brewing", v: "Central District Brewing", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 260, day: "Saturday", t: "12:00 PM", e2: "", title: "Alternative Programming Art Exhibition: Day Three", ev: "809 E. 8th", v: "809 E. 8th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 261, day: "Saturday", t: "12:00 PM", e2: "", title: "SAUCED x Rosie's: Day Two", ev: "Rosie's Wine Bar", v: "Rosie's Wine Bar", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 262, day: "Saturday", t: "12:00 PM", e2: "", title: "Free Coffee with T1: Day Three", ev: "See notes (look for T1 truck)", v: "See notes (look for T1 truck)", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  // ══ SUNDAY ══
  { id: 263, day: "Sunday", t: "7:00 AM", e2: "12:00 PM", title: "Fairmont Wellness Mornings: Day Four", ev: "Fairmont Austin (Pool Deck)", v: "Fairmont Austin (Pool Deck)", sp: [], g: ["fitness"], cat: "fitness", food: false, free: true, badge: false },
  { id: 264, day: "Sunday", t: "7:00 AM", e2: "8:30 AM", title: "Peloton x SHE Media: 5K Run Club Day Two", ev: "La Zona Rosa", v: "La Zona Rosa", sp: [], g: ["fitness", "women"], cat: "fitness", food: false, free: true, badge: false },
  { id: 265, day: "Sunday", t: "8:30 AM", e2: "5:30 PM", title: "Capital Factory House: Day Four", ev: "Captial Factory", v: "Captial Factory", sp: [], g: ["fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 266, day: "Sunday", t: "9:00 AM", e2: "5:00 PM", title: "Accenture: Day Three", ev: "Accenture Office", v: "Accenture Office", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 267, day: "Sunday", t: "9:00 AM", e2: "7:00 PM", title: "Rivian's Electric Joyride: Day Three", ev: "800 Congress (Road Closure)", v: "800 Congress (Road Closure)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 268, day: "Sunday", t: "9:00 AM", e2: "5:30 PM", title: "Luminary Live: Austin", ev: "The Cathedral", v: "The Cathedral", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 269, day: "Sunday", t: "9:00 AM", e2: "5:00 PM", title: "SHE Media Co-Lab: Day Two", ev: "LZR (La Zona Rosa)", v: "LZR (La Zona Rosa)", sp: [], g: ["food", "women"], cat: "sessions", food: true, free: true, badge: false },
  { id: 270, day: "Sunday", t: "9:00 AM", e2: "5:00 PM", title: "RedThreadX House: Day Two", ev: "The LINE Austin", v: "The LINE Austin", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 271, day: "Sunday", t: "9:00 AM", e2: "11:00 AM", title: "Austin Sunday Wake Up Call", ev: "Bathe Austin", v: "Bathe Austin", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 272, day: "Sunday", t: "9:00 AM", e2: "6:00 PM", title: "Podcast Movement: Day Three", ev: "Skybox On 6th", v: "Skybox On 6th", sp: [], g: ["food", "creators"], cat: "sessions", food: true, free: true, badge: false },
  { id: 273, day: "Sunday", t: "9:00 AM", e2: "5:00 PM", title: "AdWeek House", ev: "Accenture Austin", v: "Accenture Austin", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 274, day: "Sunday", t: "9:00 AM", e2: "11:00 AM", title: "Bloom Breakfast with SuperBloom & more", ev: "TBA", v: "TBA", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 275, day: "Sunday", t: "9:00 AM", e2: "5:00 PM", title: "The Odoo Lounge with Vox Media: Day Three", ev: "Hilton Downtown (Level 4)", v: "Hilton Downtown (Level 4)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 276, day: "Sunday", t: "9:00 AM", e2: "5:00 PM", title: "Brand innovators Marketing Summit: Day Three", ev: "Lambert's BBQ", v: "Lambert's BBQ", sp: [], g: ["food", "brand", "thought_leadership"], cat: "sessions", food: true, free: true, badge: false },
  { id: 277, day: "Sunday", t: "9:00 AM", e2: "7:00 PM", title: "Rivian Electric Roadhouse: Day Three", ev: "Rivian HQ", v: "Rivian HQ", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 278, day: "Sunday", t: "9:00 AM", e2: "11:00 AM", title: "Kendra Scott x Beam: Day Four", ev: "Kendra Scott Flagship", v: "Kendra Scott Flagship", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 279, day: "Sunday", t: "9:30 AM", e2: "4:30 PM", title: "Zoox Robotaxi Pop-Up: Day Three", ev: "The LINE Austin", v: "The LINE Austin", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 280, day: "Sunday", t: "9:30 AM", e2: "11:30 AM", title: "Country Connections: Music Industry Speed Meetings at BME", ev: "Palm Door On Sixth", v: "Palm Door On Sixth", sp: [], g: ["networking", "fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 281, day: "Sunday", t: "9:30 AM", e2: "6:30 PM", title: "The Female Quotient FQ Lounge: Day Two", ev: "Waller Creek Boathouse", v: "Waller Creek Boathouse", sp: [], g: ["women"], cat: "sessions", food: false, free: true, badge: false },
  { id: 282, day: "Sunday", t: "09:30:00", e2: "", title: "Peloton x SHE Media: 20 Min Workout 3", ev: "La Zona Rosa", v: "La Zona Rosa", sp: [], g: ["fitness", "women"], cat: "fitness", food: false, free: true, badge: false },
  { id: 283, day: "Sunday", t: "10:00 AM", e2: "10:00 PM", title: "Sao Paolo House: Day Three", ev: "3rd & Congress", v: "3rd & Congress", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 284, day: "Sunday", t: "10:00 AM", e2: "11:00 PM", title: "Superhuman: Day Two", ev: "Antone's", v: "Antone's", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 285, day: "Sunday", t: "10:00 AM", e2: "6:30 PM", title: "Fast Company Grill: Day Three", ev: "Cedar Door", v: "Cedar Door", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 286, day: "Sunday", t: "10:00 AM", e2: "6:00 PM", title: "Vox Media Podcast Stage: Day Three", ev: "Hilton Downtown (Salon C)", v: "Hilton Downtown (Salon C)", sp: [], g: ["creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 287, day: "Sunday", t: "10:00 AM", e2: "5:30 PM", title: "am/pm house", ev: "RSRV", v: "RSRV", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 288, day: "Sunday", t: "10:00 AM", e2: "5:00 PM", title: "The 5th Annual Sunday Sanctuary", ev: "Cabana Club", v: "Cabana Club", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 289, day: "Sunday", t: "10:00 AM", e2: "5:00 PM", title: "Yamaha Creator Pass Studio: Day Three", ev: "Marriott Downtown (Waller Ballroom B)", v: "Marriott Downtown (Waller Ballroom B)", sp: [], g: ["creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 290, day: "Sunday", t: "10:00 AM", e2: "10:00 PM", title: "Space House: Day Two", ev: "201 E. 5th", v: "201 E. 5th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 291, day: "Sunday", t: "10:00 AM", e2: "8:00 PM", title: "Create & Cultivate Future Summit", ev: "Assembly Hall", v: "Assembly Hall", sp: [], g: ["food", "thought_leadership"], cat: "sessions", food: true, free: true, badge: false },
  { id: 292, day: "Sunday", t: "10:00 AM", e2: "10:00 PM", title: "Tennessee House Day Three: Power Up with Knoxville & Oak Ridge, Then Meet Memphis", ev: "Electric Shuffle", v: "Electric Shuffle", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 293, day: "Sunday", t: "10:00 AM", e2: "5:00 PM", title: "Flatstock: Day Three", ev: "Marriott Downtown (Moontower Hall)", v: "Marriott Downtown (Moontower Hall)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 294, day: "Sunday", t: "10:00 AM", e2: "6:30 PM", title: "Inc. Founders House: Day Three", ev: "Foxy's Proper Pub", v: "Foxy's Proper Pub", sp: [], g: ["food", "fundraising"], cat: "sessions", food: true, free: true, badge: false },
  { id: 295, day: "Sunday", t: "10:00 AM", e2: "7:00 PM", title: "The Digilogue x TIDAL Creator Camp: Day One", ev: "TBA", v: "TBA", sp: [], g: ["creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 296, day: "Sunday", t: "10:00 AM", e2: "6:00 PM", title: "House Of Wellness ($)", ev: "AWKN Ranch", v: "AWKN Ranch", sp: [], g: ["fitness"], cat: "fitness", food: false, free: true, badge: false },
  { id: 297, day: "Sunday", t: "10:00 AM", e2: "7:00 PM", title: "Experience The Future Of Flight with Cirrus: Day Three", ev: "510 E. 5th", v: "510 E. 5th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 298, day: "Sunday", t: "10:00 AM", e2: "6:00 PM", title: "Mercury Pop-Up: Day Three", ev: "2nd & Brazos", v: "2nd & Brazos", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 299, day: "Sunday", t: "10:00 AM", e2: "10:00 PM", title: "Casa Minas: Day Two", ev: "Parlor Room on Rainey", v: "Parlor Room on Rainey", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 300, day: "Sunday", t: "10:00 AM", e2: "5:00 PM", title: "Unlocking Creativity & Culture with Yamaha: Day Three", ev: "Marriott Downtown", v: "Marriott Downtown", sp: [], g: ["community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 301, day: "Sunday", t: "10:30 AM", e2: "7:30 PM", title: "German Haus: Day Four", ev: "Speakeasy", v: "Speakeasy", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 302, day: "Sunday", t: "10:30 AM", e2: "5:00 PM", title: "Australia House: Day One", ev: "901 E. 6th", v: "901 E. 6th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 303, day: "Sunday", t: "10:30 AM", e2: "5:00 PM", title: "Halo+ Haus: Day Four", ev: "4th St. (between Congress/Colorado)", v: "4th St. (between Congress/Colorado)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 304, day: "Sunday", t: "10:30 AM", e2: "2:30 PM", title: "AI Market Foresight: Live Simulation", ev: "TBA", v: "TBA", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 305, day: "Sunday", t: "11:00 AM", e2: "1:00 PM", title: "Breakfast Taco Crawl", ev: "TBA", v: "TBA", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 306, day: "Sunday", t: "11:00 AM", e2: "6:00 PM", title: "SXSW Expo: XR Experience: Day One", ev: "Fairmont Austin (Congrssional Ballroom)", v: "Fairmont Austin (Congrssional Ballroom)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 307, day: "Sunday", t: "11:00 AM", e2: "12:30 PM", title: "Designing The Future for Emerging Managers", ev: "TBA", v: "TBA", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 308, day: "Sunday", t: "11:00 AM", e2: "1:00 PM", title: "Scenarios Brunch", ev: "Moonshine Grill", v: "Moonshine Grill", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 309, day: "Sunday", t: "11:00 AM", e2: "6:00 PM", title: "SXSW Expo: XR Experience: Day Two", ev: "Fairmont Austin (Congrssional Ballroom)", v: "Fairmont Austin (Congrssional Ballroom)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 310, day: "Sunday", t: "11:00 AM", e2: "8:00 PM", title: "Bogota Region House: Official Launch & Meet Up", ev: "Mexic-Arte Museum", v: "Mexic-Arte Museum", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 311, day: "Sunday", t: "11:00 AM", e2: "12:00 AM", title: "Vision:8291: Day Two", ev: "Canopy", v: "Canopy", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 312, day: "Sunday", t: "11:00 AM", e2: "6:00 PM", title: "SXSW Expo: XR Experience: Day Three", ev: "Fairmont Austin (Congrssional Ballroom)", v: "Fairmont Austin (Congrssional Ballroom)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 313, day: "Sunday", t: "11:00 AM", e2: "7:00 PM", title: "Funded House Investor Lounge: Day Four", ev: "Texas Bankers Association", v: "Texas Bankers Association", sp: [], g: ["fundraising", "fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 314, day: "Sunday", t: "11:00 AM", e2: "1:00 PM", title: "Springboard Brunch", ev: "Parkside", v: "Parkside", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 315, day: "Sunday", t: "11:00:00", e2: "", title: "The Faith & Tech Social", ev: "Michelada's Cafe Y Cantina", v: "Michelada's Cafe Y Cantina", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 316, day: "Sunday", t: "11:00 AM", e2: "1:00 PM", title: "Sun. Sweat. Social. Outdoor Workout", ev: "2118 S. Congress", v: "2118 S. Congress", sp: [], g: ["fitness"], cat: "fitness", food: false, free: true, badge: false },
  { id: 317, day: "Sunday", t: "11:00 AM", e2: "3:00 PM", title: "Artist + Industry Coffee Mixer with Slingshot", ev: "Radio Rosewood", v: "Radio Rosewood", sp: [], g: ["food", "networking"], cat: "food", food: false, free: true, badge: false },
  { id: 318, day: "Sunday", t: "11:00:00", e2: "", title: "Peloton x SHE Media: 20 Min Workout 4", ev: "La Zona Rosa", v: "La Zona Rosa", sp: [], g: ["fitness", "women"], cat: "fitness", food: false, free: true, badge: false },
  { id: 319, day: "Sunday", t: "11:00 AM", e2: "7:00 PM", title: "Congress Avenue Block Party: Day Four", ev: "900 Congress Ave. (Street)", v: "900 Congress Ave. (Street)", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 320, day: "Sunday", t: "11:00 AM", e2: "3:00 PM", title: "City + Stars Mid-Day Refresh Lounge", ev: "908 W. 12th", v: "908 W. 12th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 321, day: "Sunday", t: "11:00 AM", e2: "7:00 PM", title: "Canival Cruises LOL Booth: Day Four", ev: "Three locations (see details)", v: "Three locations (see details)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 322, day: "Sunday", t: "12:00 PM", e2: "7:00 PM", title: "Analog with The Future Front & Tomo Mags", ev: "Tomo Mags", v: "Tomo Mags", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 323, day: "Sunday", t: "12:00 PM", e2: "3:00 PM", title: "Impact Arcade: Day Three", ev: "Sapien Center", v: "Sapien Center", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 324, day: "Sunday", t: "12:00 PM", e2: "6:00 PM", title: "Peelander-Fest 2026", ev: "Zilker Brewing", v: "Zilker Brewing", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 325, day: "Sunday", t: "12:00 PM", e2: "10:00 PM", title: "Meanwhile @ Colton House: Day Four", ev: "Colton House Hotel", v: "Colton House Hotel", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 326, day: "Sunday", t: "12:00 PM", e2: "2:00 AM", title: "Austin Rhythm Revival Americana Showcase: Day Four", ev: "San Jac Saloon", v: "San Jac Saloon", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 327, day: "Sunday", t: "12:00 PM", e2: "7:00 PM", title: "Axios House: Day Three", ev: "Inn Cahoots", v: "Inn Cahoots", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 328, day: "Sunday", t: "12:00 PM", e2: "10:00 PM", title: "SXSW Innovation Clubhouse: Day Four", ev: "Brazos Hall", v: "Brazos Hall", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 329, day: "Sunday", t: "12:00 PM", e2: "8:00 PM", title: "Yahoo's Scout Inn: Day Two", ev: "Scoot Inn", v: "Scoot Inn", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 330, day: "Sunday", t: "12:00 PM", e2: "5:00 PM", title: "Around The World with Justworks", ev: "3TEN at ACL Live", v: "3TEN at ACL Live", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 331, day: "Sunday", t: "12:00 PM", e2: "10:00 PM", title: "SXSW Film & TV Clubhouse: Day Four", ev: "800 Congress", v: "800 Congress", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 332, day: "Sunday", t: "12:00 PM", e2: "6:00 PM", title: "KOOP Day Party", ev: "Batch Craft Beer & Kolaches", v: "Batch Craft Beer & Kolaches", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 333, day: "Sunday", t: "12:00 PM", e2: "8:00 PM", title: "Paramount+ The Lodge: Day Four", ev: "Clive Bar on Rainey", v: "Clive Bar on Rainey", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 334, day: "Sunday", t: "12:00 PM", e2: "4:00 PM", title: "South X Sunday at The Millbrook Estate", ev: "The Millbrook Estate", v: "The Millbrook Estate", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 335, day: "Sunday", t: "12:00 PM", e2: "8:00 PM", title: "SXSW Music Clubhouse: Day Three", ev: "Downright Austin", v: "Downright Austin", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 336, day: "Sunday", t: "12:00 PM", e2: "6:00 PM", title: "Copeland Haus Designer Vintage Pop-Up Shop: Day Four", ev: "Hotel Van Zandt", v: "Hotel Van Zandt", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 337, day: "Sunday", t: "12:00 PM", e2: "4:00 PM", title: "Cherries Wheels SX Pop Up", ev: "House Park", v: "House Park", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 338, day: "Sunday", t: "12:00 PM", e2: "5:30 PM", title: "Creator Gold Live", ev: "TBA", v: "TBA", sp: [], g: ["food", "creators"], cat: "sessions", food: true, free: true, badge: false },
  { id: 339, day: "Sunday", t: "12:00 PM", e2: "2:00 PM", title: "Tacos & Tiaras Drag Lunch", ev: "The Urban Pour Social at Hotel Indigo", v: "The Urban Pour Social at Hotel Indigo", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 340, day: "Sunday", t: "12:00 PM", e2: "10:00 PM", title: "The Renowned Renaissance Faire ($)", ev: "The Far Out Lounge & Stage", v: "The Far Out Lounge & Stage", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 341, day: "Sunday", t: "12:00 PM", e2: "4:00 PM", title: "Mimosa Takeover: Morning After Mixer", ev: "Limestone Rooftop at Cambria", v: "Limestone Rooftop at Cambria", sp: [], g: ["networking", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 342, day: "Sunday", t: "12:00 PM", e2: "7:00 PM", title: "The Best Paste Party Ever: Day Two", ev: "High Noon", v: "High Noon", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 343, day: "Sunday", t: "12:00:00", e2: "", title: "Music Tech Friends", ev: "Zilker Brewing", v: "Zilker Brewing", sp: [], g: ["ai", "fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 344, day: "Sunday", t: "12:00 PM", e2: "8:00 PM", title: "Ledger x Spurs Hoops: Day Four", ev: "4th & Brazos", v: "4th & Brazos", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 345, day: "Sunday", t: "12:00 PM", e2: "9:00 PM", title: "Kill Tony Pop-Up Shop: Day Four", ev: "325 E. 6th", v: "325 E. 6th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 346, day: "Sunday", t: "12:00 PM", e2: "8:00 PM", title: "Radio Day Stage at Downright: Day Three", ev: "Downright Austin (backyard)", v: "Downright Austin (backyard)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 347, day: "Sunday", t: "12:00 PM", e2: "9:00 PM", title: "Billboard HOUSE: Day Three", ev: "Mohawk", v: "Mohawk", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 348, day: "Sunday", t: "12:30 PM", e2: "4:30 PM", title: "Punch Bowl Social Music Showcase", ev: "Punch Bowl Social (Congress)", v: "Punch Bowl Social (Congress)", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 349, day: "Sunday", t: "12:30 PM", e2: "6:00 PM", title: "British Music Embassy: Northern Sound (Day Four)", ev: "Palm Door On Sixth", v: "Palm Door On Sixth", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 350, day: "Sunday", t: "1:00 PM", e2: "2:00 PM", title: "The Music Industry Meetup with Balanced Breakfast", ev: "Jo's Coffee (W. 2nd)", v: "Jo's Coffee (W. 2nd)", sp: [], g: ["food", "networking", "fun"], cat: "food", food: false, free: true, badge: false },
  { id: 351, day: "Sunday", t: "1:00 PM", e2: "7:00 PM", title: "Beats x Beers ($)", ev: "Emo's Austin", v: "Emo's Austin", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 352, day: "Sunday", t: "1:00 PM", e2: "12:00 AM", title: "Starfire Fest: Day Two", ev: "Kick Butt Coffee", v: "Kick Butt Coffee", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 353, day: "Sunday", t: "1:00 PM", e2: "6:00 PM", title: "POLAND at SXSW: Innovation Showcase", ev: "Q-Branch", v: "Q-Branch", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 354, day: "Sunday", t: "1:00 PM", e2: "10:00 AM", title: "Grillo's Pickles presents: St. Pickle's Day Pickle Party", ev: "Hotel Vegas", v: "Hotel Vegas", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 355, day: "Sunday", t: "1:00 PM", e2: "5:00 PM", title: "Just Southwest Of Official with The Good For Nothings Club", ev: "Better Half Coffee & Cocktails", v: "Better Half Coffee & Cocktails", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 356, day: "Sunday", t: "1:00 PM", e2: "7:00 PM", title: "Design House", ev: "Paseo on Rainey", v: "Paseo on Rainey", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 357, day: "Sunday", t: "1:00 PM", e2: "5:00 PM", title: "2nd Annual Creatorpalooza", ev: "Inn Cahoots (Studio)", v: "Inn Cahoots (Studio)", sp: [], g: ["creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 358, day: "Sunday", t: "1:00 PM", e2: "4:00 PM", title: "Coaches Happy Hour", ev: "TBA", v: "TBA", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 359, day: "Sunday", t: "1:00 PM", e2: "6:00 PM", title: "101X Day Party: Day Four", ev: "Inn Cahoots", v: "Inn Cahoots", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 360, day: "Sunday", t: "13:00:00", e2: "", title: "McConaughey Lookalike Competiton w/ Know Your Meme", ev: "Zilker Park", v: "Zilker Park", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 361, day: "Sunday", t: "1:00 PM", e2: "5:00 PM", title: "McDonald's First Job Confessional: Day One", ev: "700 Congress", v: "700 Congress", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 362, day: "Sunday", t: "2:00 PM", e2: "7:00 PM", title: "Dirtybird Records Sacha Robitti Album Launch", ev: "East End Ballroom", v: "East End Ballroom", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 363, day: "Sunday", t: "2:00 PM", e2: "5:00 PM", title: "KUTX Day Party at Rivian: Day Three", ev: "Rivian Showroom", v: "Rivian Showroom", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 364, day: "Sunday", t: "2:00 PM", e2: "10:00 PM", title: "The Do512 Lounge Sessions", ev: "Do512 HQ", v: "Do512 HQ", sp: [], g: ["food", "thought_leadership"], cat: "sessions", food: true, free: true, badge: false },
  { id: 365, day: "Sunday", t: "2:00 PM", e2: "8:00 PM", title: "Lone Star Roadhouse: Day Three", ev: "East End Ballroom", v: "East End Ballroom", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 366, day: "Sunday", t: "2:00 PM", e2: "5:00 PM", title: "Harvard at SXSW ($)", ev: "Ember Kitchen", v: "Ember Kitchen", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 367, day: "Sunday", t: "2:00 PM", e2: "8:00 PM", title: "OUTlaw Pride", ev: "Dainty Dillo", v: "Dainty Dillo", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 368, day: "Sunday", t: "2:00 PM", e2: "7:00 PM", title: "Dirtybird Records Southern Fried Sunday", ev: "East End Ballroom", v: "East End Ballroom", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 369, day: "Sunday", t: "2:00 PM", e2: "7:00 PM", title: "Lyrical Lemonade TV Launch", ev: "The Stay Put", v: "The Stay Put", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 370, day: "Sunday", t: "15:00:00", e2: "", title: "TODO Records Showcase ($)", ev: "Radio East", v: "Radio East", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 371, day: "Sunday", t: "3:00 PM", e2: "6:00 PM", title: "BOLDCO's Wine & Remind", ev: "House Wine", v: "House Wine", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 372, day: "Sunday", t: "3:00 PM", e2: "10:00 PM", title: "Auntie's House with Where Y'all At Though", ev: "Pershing", v: "Pershing", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 373, day: "Sunday", t: "3:00 PM", e2: "6:00 PM", title: "Trovador: En Masse", ev: "Trovador Gallery", v: "Trovador Gallery", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 374, day: "Sunday", t: "3:30 PM", e2: "9:30 PM", title: "New Dutch Wave @ Preacher", ev: "Preacher", v: "Preacher", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 375, day: "Sunday", t: "4:00 PM", e2: "6:30 PM", title: "From Raise To Reality with HubsSpot for Startups", ev: "Soho House", v: "Soho House", sp: [], g: ["food", "fundraising"], cat: "sessions", food: true, free: true, badge: false },
  { id: 376, day: "Sunday", t: "4:00 PM", e2: "7:00 PM", title: "London Calling", ev: "Hanghart", v: "Hanghart", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 377, day: "Sunday", t: "4:00 PM", e2: "7:00 PM", title: "Crowdstake Meet-Up (Drinks On James)", ev: "Mort Subite", v: "Mort Subite", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 378, day: "Sunday", t: "5:00 PM", e2: "12:00 AM", title: "Big Loud Live at SXSW", ev: "Stubb's", v: "Stubb's", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 379, day: "Sunday", t: "5:00 PM", e2: "8:00 PM", title: "NachoTuesday: Austin Founder + Investor Happy Hour", ev: "TBA", v: "TBA", sp: [], g: ["food", "fundraising", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 380, day: "Sunday", t: "5:00 PM", e2: "7:00 PM", title: "The Pinoy Potluck", ev: "Kenny Dorham's Backyard", v: "Kenny Dorham's Backyard", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 381, day: "Sunday", t: "5:00 PM", e2: "6:30 PM", title: "FQ + Deloitte Power Play", ev: "Waller Creek Boathouse", v: "Waller Creek Boathouse", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 382, day: "Sunday", t: "5:00 PM", e2: "7:00 PM", title: "Film & TV Industry Happy Hour with Aputure", ev: "Stephen F's Bar", v: "Stephen F's Bar", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 383, day: "Sunday", t: "17:30:00", e2: "", title: "Free Community Concert at Lady Bird Lake: Tune-yards", ev: "Auditorium Shores", v: "Auditorium Shores", sp: [], g: ["community", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 384, day: "Sunday", t: "6:00 PM", e2: "8:30 PM", title: "Marketing Leadership Happy Hour + Marg Tasting", ev: "Maie Day on South Congress", v: "Maie Day on South Congress", sp: [], g: ["brand", "thought_leadership", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 385, day: "Sunday", t: "6:00 PM", e2: "9:00 PM", title: "Emerging Managers + Founding GPs Omakase", ev: "TBA", v: "TBA", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 386, day: "Sunday", t: "6:00 PM", e2: "9:00 PM", title: "B&H Creators Rodeo", ev: "OWN HQ", v: "OWN HQ", sp: [], g: ["creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 387, day: "Sunday", t: "6:00 PM", e2: "12:00 AM", title: "#CareFreeBlackGirl SXSW", ev: "Wanderlust Wine Co Downtown", v: "Wanderlust Wine Co Downtown", sp: [], g: ["women"], cat: "sessions", food: false, free: true, badge: false },
  { id: 388, day: "Sunday", t: "18:00:00", e2: "", title: "Incendia: Day Three ($)", ev: "Carson Creek Ranch", v: "Carson Creek Ranch", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 389, day: "Sunday", t: "6:00 PM", e2: "9:00 PM", title: "Women Beyond The Mic", ev: "Captain Quack's Soundspace", v: "Captain Quack's Soundspace", sp: [], g: ["women"], cat: "sessions", food: false, free: true, badge: false },
  { id: 390, day: "Sunday", t: "6:00 PM", e2: "8:00 PM", title: "Free IMAX at SXSW: STORMBOUND Screening & Q&A", ev: "Bullock Museum", v: "Bullock Museum", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 391, day: "Sunday", t: "6:30 PM", e2: "10:30 PM", title: "Capital Of Creators with TL;DR", ev: "TBA", v: "TBA", sp: [], g: ["creators", "fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 392, day: "Sunday", t: "18:30:00", e2: "", title: "Eater Dinner Party with Proudly Wisconsin Cheese ($)", ev: "Paperboy (East)", v: "Paperboy (East)", sp: [], g: ["food", "fun"], cat: "food", food: false, free: true, badge: false },
  { id: 393, day: "Sunday", t: "6:30 PM", e2: "9:00 PM", title: "GenJam", ev: "The LINE Hotel", v: "The LINE Hotel", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 394, day: "Sunday", t: "6:30 PM", e2: "9:30 PM", title: "CEO Dinner at Private Mansion: Day Three", ev: "TBA", v: "TBA", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 395, day: "Sunday", t: "6:30 PM", e2: "9:30 PM", title: "Teachable Sunset Sail", ev: "Hula Hut boat dock", v: "Hula Hut boat dock", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 396, day: "Sunday", t: "6:30 PM", e2: "10:00 PM", title: "iHeartPodcasts Hotel", ev: "TBA", v: "TBA", sp: [], g: ["creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 397, day: "Sunday", t: "7:00 PM", e2: "11:00 PM", title: "Austin Sounds: Day Four", ev: "Lefty's Brick Bar", v: "Lefty's Brick Bar", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 398, day: "Sunday", t: "7:00 PM", e2: "12:00 AM", title: "Vinilious Showcase", ev: "Shangri-La", v: "Shangri-La", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 399, day: "Sunday", t: "7:00 PM", e2: "10:00 PM", title: "After School + Link In Bio Happy Hour", ev: "TBA", v: "TBA", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 400, day: "Sunday", t: "19:00:00", e2: "", title: "Billboard: The Stage Day Three (Mau P)", ev: "Moody Amphitheater", v: "Moody Amphitheater", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 401, day: "Sunday", t: "7:00 PM", e2: "10:00 PM", title: "PUFFCO Smoke Out at Glassmith Airport", ev: "Glassmith Airport", v: "Glassmith Airport", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 402, day: "Sunday", t: "7:00 PM", e2: "2:00 AM", title: "Jazz Re:Freshed Showcase", ev: "Flamingo Cantina", v: "Flamingo Cantina", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 403, day: "Sunday", t: "7:00 PM", e2: "1:00 AM", title: "RnB Forever Showcase", ev: "Marlow", v: "Marlow", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 404, day: "Sunday", t: "7:00 PM", e2: "11:00 PM", title: "Tech Carnival", ev: "TBA", v: "TBA", sp: [], g: ["food", "ai", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 405, day: "Sunday", t: "7:00 PM", e2: "12:00 AM", title: "Global Stage at Downright: Day Four", ev: "Downright Austin (backyard)", v: "Downright Austin (backyard)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 406, day: "Sunday", t: "7:00 PM", e2: "8:30 PM", title: "Facebook Presents Comedy Showcase", ev: "The Creek & The Cave", v: "The Creek & The Cave", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 407, day: "Sunday", t: "7:30 PM", e2: "2:00 AM", title: "Fire Records Showcase", ev: "Hotel Vegas", v: "Hotel Vegas", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 408, day: "Sunday", t: "7:30 PM", e2: "1:00 AM", title: "British Music Embassy: BBC Introducing (Night Four)", ev: "Palm Door On Sixth", v: "Palm Door On Sixth", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 409, day: "Sunday", t: "7:30 PM", e2: "12:00 AM", title: "FOCUS Wales Party + Showcase", ev: "Swan Dive", v: "Swan Dive", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 410, day: "Sunday", t: "7:30 PM", e2: "10:30 PM", title: "Open Management Showcase at Superhuman", ev: "Antone's", v: "Antone's", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 411, day: "Sunday", t: "7:30 PM", e2: "2:00 AM", title: "Take A Break Fest", ev: "Coconut Club", v: "Coconut Club", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 412, day: "Sunday", t: "8:00 PM", e2: "1:00 AM", title: "German Music Export Showcase (Night 1) at German Haus", ev: "Speakeasy", v: "Speakeasy", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 413, day: "Sunday", t: "8:00 PM", e2: "2:00 AM", title: "RnB Block Party", ev: "Venue 6 (516 E. 6th)", v: "Venue 6 (516 E. 6th)", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 414, day: "Sunday", t: "20:00:00", e2: "", title: "Buck Around And Find Out", ev: "Revelry Kitchen & Bar", v: "Revelry Kitchen & Bar", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 415, day: "Sunday", t: "8:00 PM", e2: "1:00 AM", title: "Armadillo World Headquarters Showcase: Day Three", ev: "Valhalla", v: "Valhalla", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 416, day: "Sunday", t: "8:30 PM", e2: "10:00 PM", title: "Audible presents Mexodus: A Musical Journey Across Borders", ev: "Vulcan Gas Company", v: "Vulcan Gas Company", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 417, day: "Sunday", t: "10:00 PM", e2: "2:00 AM", title: "Billboard HOUSE: Night Three (The Offline Sessions, TBA)", ev: "Mohawk", v: "Mohawk", sp: [], g: ["thought_leadership", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 418, day: "Sunday", t: "12:00 PM", e2: "", title: "Culture House", ev: "TBA", v: "TBA", sp: [], g: ["community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 419, day: "Sunday", t: "12:00 PM", e2: "", title: "Canada House: Day Three", ev: "Central District Brewing", v: "Central District Brewing", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 420, day: "Sunday", t: "12:00 PM", e2: "", title: "Liberty Nites: Day Four", ev: "The Liberty", v: "The Liberty", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 421, day: "Sunday", t: "12:00 PM", e2: "", title: "Lost Love Hotline: Day One", ev: "TBA", v: "TBA", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 422, day: "Sunday", t: "12:00 PM", e2: "", title: "Alternative Programming Art Exhibition: Day Four", ev: "809 E. 8th", v: "809 E. 8th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 423, day: "Sunday", t: "12:00 PM", e2: "", title: "Free Coffee with T1: Day Four", ev: "See notes (look for T1 truck)", v: "See notes (look for T1 truck)", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  // ══ MONDAY ══
  { id: 424, day: "Monday", t: "8:00 AM", e2: "10:00 AM", title: "Connecting The Americas: Day Three", ev: "Fogo De Chao", v: "Fogo De Chao", sp: [], g: ["food", "networking"], cat: "sessions", food: true, free: true, badge: false },
  { id: 425, day: "Monday", t: "8:00 AM", e2: "6:30 PM", title: "HubSpot House", ev: "Soho House", v: "Soho House", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 426, day: "Monday", t: "8:00 AM", e2: "11:00 AM", title: "Jesse Itzler Big Ass Run w/ New Balance & more", ev: "1600 S. Congress", v: "1600 S. Congress", sp: [], g: ["fitness"], cat: "fitness", food: false, free: true, badge: false },
  { id: 427, day: "Monday", t: "8:30 AM", e2: "11:00 PM", title: "The Non-Obvious House", ev: "TBA", v: "TBA", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 428, day: "Monday", t: "8:30 AM", e2: "5:30 PM", title: "Capital Factory House: Day Five", ev: "Captial Factory", v: "Captial Factory", sp: [], g: ["fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 429, day: "Monday", t: "9:00 AM", e2: "4:00 PM", title: "SXSW Expo: Emerging Tech Day One", ev: "Fairmont Austin (Manchester Ballroom)", v: "Fairmont Austin (Manchester Ballroom)", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 430, day: "Monday", t: "9:00 AM", e2: "4:00 PM", title: "Free Professional Headshots with Fujifilm & Precision: Day One", ev: "Fairmont Austin (5th Floor)", v: "Fairmont Austin (5th Floor)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 431, day: "Monday", t: "9:00 AM", e2: "7:00 PM", title: "Rivian's Electric Joyride: Day Four", ev: "800 Congress (Road Closure)", v: "800 Congress (Road Closure)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 432, day: "Monday", t: "9:00 AM", e2: "10:00 AM", title: "Fake Forward Coffee Run", ev: "TBA", v: "TBA", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 433, day: "Monday", t: "9:00 AM", e2: "12:00 PM", title: "The Breakfas Bookie Reading Rainbow Tribute", ev: "Radio/East", v: "Radio/East", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 434, day: "Monday", t: "9:00 AM", e2: "2:00 PM", title: "Brand innovators Marketing Summit: Day Four", ev: "Lambert's BBQ", v: "Lambert's BBQ", sp: [], g: ["food", "brand", "thought_leadership"], cat: "sessions", food: true, free: true, badge: false },
  { id: 435, day: "Monday", t: "9:00 AM", e2: "10:30 AM", title: "Comms Pros Breakfast", ev: "TBA", v: "TBA", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 436, day: "Monday", t: "9:00 AM", e2: "7:30 PM", title: "The Chief Suite: Day One", ev: "Thompson Austin (Bayberry Room)", v: "Thompson Austin (Bayberry Room)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 437, day: "Monday", t: "9:00 AM", e2: "9:00 PM", title: "B2B Haus", ev: "RSRV", v: "RSRV", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 438, day: "Monday", t: "9:00 AM", e2: "5:00 PM", title: "RedThreadX House: Day Three", ev: "The LINE Austin", v: "The LINE Austin", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 439, day: "Monday", t: "9:00 AM", e2: "12:30 PM", title: "Founded In Texas (For Women Founders)", ev: "Brown Advisory", v: "Brown Advisory", sp: [], g: ["food", "fundraising", "women"], cat: "sessions", food: true, free: true, badge: false },
  { id: 440, day: "Monday", t: "9:00 AM", e2: "7:00 PM", title: "Rivian Electric Roadhouse: Day Four", ev: "Rivian HQ", v: "Rivian HQ", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 441, day: "Monday", t: "9:30 AM", e2: "12:00 PM", title: "Amplify AI + GTM Roadshow", ev: "Antler VC", v: "Antler VC", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 442, day: "Monday", t: "9:30 AM", e2: "6:00 PM", title: "AI x Journalism Day", ev: "The Texas Tribune", v: "The Texas Tribune", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 443, day: "Monday", t: "10:00 AM", e2: "2:30 PM", title: "Accenture: Day Four", ev: "Accenture Office", v: "Accenture Office", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 444, day: "Monday", t: "10:00 AM", e2: "7:00 PM", title: "The Digilogue x TIDAL Creator Camp: Day Two", ev: "TBA", v: "TBA", sp: [], g: ["creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 445, day: "Monday", t: "10:00 AM", e2: "4:00 PM", title: "Glean Work AI House: Day One", ev: "121 E. 5th", v: "121 E. 5th", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 446, day: "Monday", t: "10:00 AM", e2: "11:00 AM", title: "Beyond The Cloud: A New Architecture For Intelligence", ev: "The LINE Austin", v: "The LINE Austin", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 447, day: "Monday", t: "10:00 AM", e2: "10:00 PM", title: "Superhuman: Day One", ev: "Antone's", v: "Antone's", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 448, day: "Monday", t: "10:00 AM", e2: "6:00 PM", title: "Humble Ventures: The Future Of Health Day ($)", ev: "TBA", v: "TBA", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 449, day: "Monday", t: "10:00 AM", e2: "10:00 PM", title: "Sao Paolo House: Day Four", ev: "3rd & Congress", v: "3rd & Congress", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 450, day: "Monday", t: "10:00 AM", e2: "12:00 PM", title: "Handshake Summit & Awards", ev: "TBA", v: "TBA", sp: [], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 451, day: "Monday", t: "10:00 AM", e2: "12:00 PM", title: "River Walk: Music Tech Meetup", ev: "Daydreamer Coffee (Rainey)", v: "Daydreamer Coffee (Rainey)", sp: [], g: ["ai", "networking", "fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 452, day: "Monday", t: "10:00 AM", e2: "10:00 PM", title: "Casa Minas: Day Three", ev: "Parlor Room on Rainey", v: "Parlor Room on Rainey", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 453, day: "Monday", t: "10:30 AM", e2: "5:00 PM", title: "Australia House: Day Two", ev: "901 E. 6th", v: "901 E. 6th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 454, day: "Monday", t: "11:00 AM", e2: "12:00 AM", title: "New Mexico House", ev: "The Courtyard ATX", v: "The Courtyard ATX", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 455, day: "Monday", t: "11:00 AM", e2: "3:00 PM", title: "Nasville Loves Austin", ev: "Imogene + Willie", v: "Imogene + Willie", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 456, day: "Monday", t: "11:00 AM", e2: "11:00 PM", title: "Vision:8291: Day Three", ev: "Canopy", v: "Canopy", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 457, day: "Monday", t: "11:00 AM", e2: "12:00 PM", title: "The Power of the LGBTQ+ Economy with the NGLCC", ev: "The Urban Pour Social at Hotel Indigo", v: "The Urban Pour Social at Hotel Indigo", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 458, day: "Monday", t: "11:00 AM", e2: "7:00 PM", title: "Funded House Investor Lounge: Day Five", ev: "Texas Bankers Association", v: "Texas Bankers Association", sp: [], g: ["fundraising", "fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 459, day: "Monday", t: "11:00 AM", e2: "7:00 PM", title: "Congress Avenue Block Party: Day Five", ev: "900 Congress Ave. (Street)", v: "900 Congress Ave. (Street)", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 460, day: "Monday", t: "11:00 AM", e2: "7:00 PM", title: "Canival Cruises LOL Booth: Day Five", ev: "Three locations (see details)", v: "Three locations (see details)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 461, day: "Monday", t: "11:30 AM", e2: "6:30 PM", title: "Fast Company Grill: Day Four", ev: "Cedar Door", v: "Cedar Door", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 462, day: "Monday", t: "11:30 AM", e2: "7:00 PM", title: "Take Action x SXSW: Day One", ev: "Inn Cahoots", v: "Inn Cahoots", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 463, day: "Monday", t: "11:30 AM", e2: "3:00 PM", title: "International Mixer at UK House", ev: "Palm Door On Sixth", v: "Palm Door On Sixth", sp: [], g: ["networking", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 464, day: "Monday", t: "11:30 AM", e2: "3:00 PM", title: "International Mixer at UK House with Sister Cities Int'l", ev: "Palm Door On Sixth", v: "Palm Door On Sixth", sp: [], g: ["networking", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 465, day: "Monday", t: "12:00 PM", e2: "7:30 PM", title: "German Haus: Day Five", ev: "Speakeasy", v: "Speakeasy", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 466, day: "Monday", t: "12:00 PM", e2: "10:00 PM", title: "SXSW Film & TV Clubhouse: Day Five", ev: "800 Congress", v: "800 Congress", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 467, day: "Monday", t: "12:00 PM", e2: "6:00 PM", title: "Marshall Day Party at Mohawk", ev: "Mohawk", v: "Mohawk", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 468, day: "Monday", t: "12:00 PM", e2: "2:00 AM", title: "Austin Rhythm Revival Americana Showcase: Day Five", ev: "San Jac Saloon", v: "San Jac Saloon", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 469, day: "Monday", t: "12:00 PM", e2: "6:00 PM", title: "Casamigos House Of Friends: Day One", ev: "Inn Cahoots", v: "Inn Cahoots", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 470, day: "Monday", t: "12:00 PM", e2: "10:00 PM", title: "SXSW Innovation Clubhouse: Day Five", ev: "Brazos Hall", v: "Brazos Hall", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 471, day: "Monday", t: "12:00 PM", e2: "8:00 PM", title: "SXSW Music Clubhouse: Day Four", ev: "Downright Austin", v: "Downright Austin", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 472, day: "Monday", t: "12:00 PM", e2: "6:00 PM", title: "Copeland Haus Designer Vintage Pop-Up Shop: Day Five", ev: "Hotel Van Zandt", v: "Hotel Van Zandt", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 473, day: "Monday", t: "12:00 PM", e2: "7:00 PM", title: "The Best Paste Party Ever: Day Three", ev: "High Noon", v: "High Noon", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 474, day: "Monday", t: "12:00 PM", e2: "9:00 PM", title: "Kill Tony Pop-Up Shop: Day Five", ev: "325 E. 6th", v: "325 E. 6th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 475, day: "Monday", t: "12:00 PM", e2: "8:00 PM", title: "Radio Day Stage at Downright: Day Four", ev: "Downright Austin (backyard)", v: "Downright Austin (backyard)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 476, day: "Monday", t: "12:00 PM", e2: "8:00 PM", title: "Ledger x Spurs Hoops: Day Five", ev: "4th & Brazos", v: "4th & Brazos", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 477, day: "Monday", t: "1:00 PM", e2: "6:00 PM", title: "Waterloo Records Day Parties: Day Four", ev: "Waterloo Records", v: "Waterloo Records", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 478, day: "Monday", t: "1:00 PM", e2: "3:00 PM", title: "VC Arena", ev: "W Austin", v: "W Austin", sp: [], g: ["fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 479, day: "Monday", t: "1:00 PM", e2: "6:00 PM", title: "British Music Embassy: Norhtern Sound x DBT Wales (Day Five)", ev: "Palm Door On Sixth", v: "Palm Door On Sixth", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 480, day: "Monday", t: "1:00 PM", e2: "6:00 PM", title: "Miro x Replit Hackathon", ev: "303 Colorado St.", v: "303 Colorado St.", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 481, day: "Monday", t: "1:00 PM", e2: "5:00 PM", title: "A Day Of Culture, Connection & Growth", ev: "UMLAUF Sculpture Garden", v: "UMLAUF Sculpture Garden", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 482, day: "Monday", t: "1:00 PM", e2: "5:00 PM", title: "McDonald's First Job Confessional: Day Two", ev: "700 Congress", v: "700 Congress", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 483, day: "Monday", t: "2:00 PM", e2: "8:00 PM", title: "SoDA Happy Hour", ev: "Woody's on West 6th", v: "Woody's on West 6th", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 484, day: "Monday", t: "2:00 PM", e2: "7:00 PM", title: "Side One Track One vs. Austin Town Hall Showcase", ev: "Hotel Vegas", v: "Hotel Vegas", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 485, day: "Monday", t: "2:30 PM", e2: "5:00 PM", title: "Our Path Forward: Insights From Austin's Tech Leaders", ev: "Oracle", v: "Oracle", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 486, day: "Monday", t: "3:00 PM", e2: "5:00 PM", title: "AI & SaaS Sauna Battle", ev: "Bathe Austin", v: "Bathe Austin", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 487, day: "Monday", t: "3:00 PM", e2: "5:00 PM", title: "AI & SaAAS Sauna Battle", ev: "Bahte Austin", v: "Bahte Austin", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 488, day: "Monday", t: "3:00 PM", e2: "6:00 PM", title: "The LegalTech AI Boom", ev: "Indeed Tower", v: "Indeed Tower", sp: [], g: ["food", "ai"], cat: "sessions", food: true, free: true, badge: false },
  { id: 489, day: "Monday", t: "3:00 PM", e2: "4:00 PM", title: "Funding, Power, and the Future of Queer Storytelling", ev: "The Urban Pour Social at Hotel Indigo", v: "The Urban Pour Social at Hotel Indigo", sp: [], g: ["brand", "fundraising", "fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 490, day: "Monday", t: "3:00 PM", e2: "4:00 PM", title: "Funding, Power & The Future Of Queer Storytelling", ev: "The Urban Pour Social", v: "The Urban Pour Social", sp: [], g: ["brand", "fundraising", "fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 491, day: "Monday", t: "3:00 PM", e2: "6:00 PM", title: "Real Estate Forum", ev: "2801 I-35", v: "2801 I-35", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 492, day: "Monday", t: "3:00 PM", e2: "8:00 PM", title: "Deep Tech & Hardware Expo", ev: "The American Hosing Corp", v: "The American Hosing Corp", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 493, day: "Monday", t: "4:00 PM", e2: "6:00 PM", title: "Supabase + Dreambase at SXSW", ev: "East End Ballroom", v: "East End Ballroom", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 494, day: "Monday", t: "4:00 PM", e2: "7:00 PM", title: "FloSports Happy Hour", ev: "FloSports (301 Congress)", v: "FloSports (301 Congress)", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 495, day: "Monday", t: "4:30 PM", e2: "11:30 PM", title: "Populous House: Me To We Day One", ev: "3TEN at ACL Live", v: "3TEN at ACL Live", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 496, day: "Monday", t: "5:00 PM", e2: "9:00 PM", title: "SXSW Crypto Mondays", ev: "TBA", v: "TBA", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 497, day: "Monday", t: "5:00 PM", e2: "7:30 PM", title: "Microsoft For Startups: Founder x Funder Dinner", ev: "TBA", v: "TBA", sp: [], g: ["food", "fundraising", "fun"], cat: "food", food: true, free: true, badge: false },
  { id: 498, day: "Monday", t: "5:00 PM", e2: "8:00 PM", title: "Sauna Like A Finn: Authentic Finish Sauna Evening ($)", ev: "Bathe Austin", v: "Bathe Austin", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 499, day: "Monday", t: "5:00 PM", e2: "7:00 PM", title: "Film & TV Industry Happy Hour with SAGindie & SAG-AFTRA", ev: "Stephen F's Bar", v: "Stephen F's Bar", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 500, day: "Monday", t: "5:00 PM", e2: "8:00 PM", title: "Austin Bitcoin Club: Vibe Coding For Freedom", ev: "Bitcoin Park Austin", v: "Bitcoin Park Austin", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 501, day: "Monday", t: "5:00 PM", e2: "8:00 PM", title: "VC Village & Agment: Let's Get Liquid Investor Happy Hour", ev: "Daydreamer", v: "Daydreamer", sp: [], g: ["fundraising", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 502, day: "Monday", t: "5:00 PM", e2: "1:00 AM", title: "The Rendezvous in ATX", ev: "Sahara Lounge", v: "Sahara Lounge", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 503, day: "Monday", t: "5:00 PM", e2: "7:00 PM", title: "Disguise Community Meetup", ev: "Edge Rooftop", v: "Edge Rooftop", sp: [], g: ["food", "networking", "community"], cat: "sessions", food: true, free: true, badge: false },
  { id: 504, day: "Monday", t: "5:00 PM", e2: "8:00 PM", title: "Made In Paella Party with Jose Andres (Ticketed)", ev: "Austin Oyster Co.", v: "Austin Oyster Co.", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 505, day: "Monday", t: "5:30 PM", e2: "9:00 PM", title: "AI Localization Happy Hour", ev: "Hotel Magdalena", v: "Hotel Magdalena", sp: [], g: ["ai", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 506, day: "Monday", t: "5:30 PM", e2: "8:30 PM", title: "The Lumineers with Rivian R2", ev: "Moody Ampitheater", v: "Moody Ampitheater", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 507, day: "Monday", t: "6:00 PM", e2: "8:00 PM", title: "Velric & EUV: The Founder x Investor War Room", ev: "TBA", v: "TBA", sp: [], g: ["fundraising"], cat: "sessions", food: false, free: true, badge: false },
  { id: 508, day: "Monday", t: "6:00 PM", e2: "11:00 PM", title: "Hardware Garage Party ($)", ev: "Garage Bar", v: "Garage Bar", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 509, day: "Monday", t: "6:00 PM", e2: "11:00 PM", title: "Neon Rainbows Texas Queer Country Club", ev: "Sagebrush", v: "Sagebrush", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 510, day: "Monday", t: "6:00 PM", e2: "9:00 PM", title: "Unlocking Her Next Chapter: Fitness With Kayla Barnes", ev: "327 Congress", v: "327 Congress", sp: [], g: ["fitness", "women"], cat: "fitness", food: false, free: true, badge: false },
  { id: 511, day: "Monday", t: "6:00 PM", e2: "12:00 AM", title: "Iceland Music Showcase", ev: "Inn Cahoots", v: "Inn Cahoots", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 512, day: "Monday", t: "6:00 PM", e2: "8:00 PM", title: "Amplify AI + GTM Roadshow Afterparty", ev: "Remedy", v: "Remedy", sp: [], g: ["ai", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 513, day: "Monday", t: "18:00:00", e2: "", title: "Laugh Track Live Standup Comedy", ev: "East End Ballroom", v: "East End Ballroom", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 514, day: "Monday", t: "6:00 PM", e2: "8:00 PM", title: "She Speaks CEO", ev: "Cabana Club", v: "Cabana Club", sp: [], g: ["women"], cat: "sessions", food: false, free: true, badge: false },
  { id: 515, day: "Monday", t: "7:00 PM", e2: "2:00 AM", title: "Digital Twang Showcase", ev: "Las Perlas", v: "Las Perlas", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 516, day: "Monday", t: "7:00 PM", e2: "11:00 PM", title: "Austin Sounds: Day Five", ev: "Lefty's Brick Bar", v: "Lefty's Brick Bar", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 517, day: "Monday", t: "7:00 PM", e2: "9:00 PM", title: "An Evening At Comedor with Panoplai", ev: "Comedor", v: "Comedor", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 518, day: "Monday", t: "7:00 PM", e2: "9:00 PM", title: "USMC x SXSW Mixer", ev: "301 W. 5th St.", v: "301 W. 5th St.", sp: [], g: ["networking", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 519, day: "Monday", t: "7:00 PM", e2: "10:00 PM", title: "Glean Networking Reception: Day One", ev: "121 E. 5th", v: "121 E. 5th", sp: [], g: ["networking", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 520, day: "Monday", t: "7:00 PM", e2: "8:30 PM", title: "iHeartPodcast Awards 2026", ev: "ACL Live", v: "ACL Live", sp: [], g: ["creators"], cat: "sessions", food: false, free: true, badge: false },
  { id: 521, day: "Monday", t: "7:00 PM", e2: "2:00 AM", title: "Take Action x SXSW: Night One (Passion Pit, Five For Fighting)", ev: "Inn Cahoots", v: "Inn Cahoots", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 522, day: "Monday", t: "7:00 PM", e2: "12:00 AM", title: "Ty Dolla $ign Showcase at Stubb's", ev: "Stubb's", v: "Stubb's", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 523, day: "Monday", t: "7:00 PM", e2: "12:00 AM", title: "Global Stage at Downright: Day Five", ev: "Downright Austin (backyard)", v: "Downright Austin (backyard)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 524, day: "Monday", t: "19:30:00", e2: "", title: "TOP DAWG ENTERTAINMENT (TDE) at Superhuman", ev: "Antone's", v: "Antone's", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 525, day: "Monday", t: "7:30 PM", e2: "1:00 AM", title: "British Music Embassy: West LDN Carnival On 6th (Night Five)", ev: "Palm Door On Sixth", v: "Palm Door On Sixth", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 526, day: "Monday", t: "7:30 PM", e2: "2:00 AM", title: "Rockaway Beach Fest Showcase", ev: "Swan Dive", v: "Swan Dive", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 527, day: "Monday", t: "7:30 PM", e2: "10:30 PM", title: "Kemuri Tatsu-ya: High End Affair ($)", ev: "Kemuri Tatsu-ya", v: "Kemuri Tatsu-ya", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 528, day: "Monday", t: "8:00 PM", e2: "1:00 AM", title: "German Music Export Showcase (Night 2) at German Haus", ev: "Speakeasy", v: "Speakeasy", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 529, day: "Monday", t: "8:00 PM", e2: "2:00 AM", title: "The Official Detroit Showcase", ev: "Riviere", v: "Riviere", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 530, day: "Monday", t: "8:00 PM", e2: "2:00 AM", title: "Pudgy Rodeo with Pudgy Penguins", ev: "Mohawk", v: "Mohawk", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 531, day: "Monday", t: "8:00 PM", e2: "2:00 AM", title: "Sony Music Latin presents: The New Sounds Of Musica Mexicana", ev: "Mala Fama", v: "Mala Fama", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 532, day: "Monday", t: "9:00 PM", e2: "12:00 AM", title: "Messina Touring Social Club After Hours Party", ev: "Marfa Lights", v: "Marfa Lights", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 533, day: "Monday", t: "9:30 PM", e2: "2:00 AM", title: "Zhu x He Bled Neon After Party", ev: "Coconut Club (rooftop)", v: "Coconut Club (rooftop)", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 534, day: "Monday", t: "12:00 PM", e2: "", title: "Liberty Nites: Day Five", ev: "The Liberty", v: "The Liberty", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 535, day: "Monday", t: "12:00 PM", e2: "", title: "Lambert's 20th Showcase: Day One", ev: "Lambert's BBQ", v: "Lambert's BBQ", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 536, day: "Monday", t: "12:00 PM", e2: "", title: "Lost Love Hotline: Day Two", ev: "TBA", v: "TBA", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  // ══ TUESDAY ══
  { id: 537, day: "Tuesday", t: "8:30 AM", e2: "12:00 PM", title: "Stuttering & Disability in Film, Tech, Education & Media", ev: "Arthur M Blank Center", v: "Arthur M Blank Center", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 538, day: "Tuesday", t: "9:00 AM", e2: "11:30 PM", title: "Populous House: Me To We Day Two", ev: "3TEN at ACL Live", v: "3TEN at ACL Live", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 539, day: "Tuesday", t: "9:00 AM", e2: "4:00 PM", title: "SXSW Expo: Emerging Tech Day Two", ev: "Fairmont Austin (Manchester Ballroom)", v: "Fairmont Austin (Manchester Ballroom)", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 540, day: "Tuesday", t: "9:00 AM", e2: "7:30 PM", title: "The Chief Suite: Day Two", ev: "Thompson Austin (Bayberry Room)", v: "Thompson Austin (Bayberry Room)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 541, day: "Tuesday", t: "9:00 AM", e2: "7:00 PM", title: "Rivian's Electric Joyride: Day Five", ev: "800 Congress (Road Closure)", v: "800 Congress (Road Closure)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 542, day: "Tuesday", t: "9:00 AM", e2: "4:00 PM", title: "Free Professional Headshots with Fujifilm & Precision: Day Two", ev: "Fairmont Austin (5th Floor)", v: "Fairmont Austin (5th Floor)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 543, day: "Tuesday", t: "9:00 AM", e2: "7:00 PM", title: "Rivian Electric Roadhouse: Day Five", ev: "Rivian HQ", v: "Rivian HQ", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 544, day: "Tuesday", t: "10:00 AM", e2: "4:00 PM", title: "Glean Work AI House: Day Two", ev: "121 E. 5th", v: "121 E. 5th", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 545, day: "Tuesday", t: "10:00 AM", e2: "11:00 AM", title: "Accenture: Day Five", ev: "Accenture Office", v: "Accenture Office", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 546, day: "Tuesday", t: "10:00 AM", e2: "11:30 PM", title: "Spark Your Flow Fest", ev: "Maggie Mae's", v: "Maggie Mae's", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 547, day: "Tuesday", t: "10:30 AM", e2: "5:00 PM", title: "Australia House: Day Three", ev: "901 E. 6th", v: "901 E. 6th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 548, day: "Tuesday", t: "11:00 AM", e2: "7:00 PM", title: "Funded House Investor Lounge: Day Six", ev: "Texas Bankers Association", v: "Texas Bankers Association", sp: [], g: ["fundraising", "fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 549, day: "Tuesday", t: "11:00 AM", e2: "1:00 PM", title: "Annual Managers Brunch", ev: "Perkins Coie LLP (Sky Lobby)", v: "Perkins Coie LLP (Sky Lobby)", sp: [], g: ["food"], cat: "food", food: false, free: true, badge: false },
  { id: 550, day: "Tuesday", t: "11:00 AM", e2: "7:00 PM", title: "Congress Avenue Block Party: Day Six", ev: "900 Congress Ave. (Street)", v: "900 Congress Ave. (Street)", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 551, day: "Tuesday", t: "11:30 AM", e2: "7:00 PM", title: "Take Action x SXSW: Day Two", ev: "Inn Cahoots", v: "Inn Cahoots", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 552, day: "Tuesday", t: "12:00 PM", e2: "6:00 PM", title: "Copeland Haus Designer Vintage Pop-Up Shop: Day Six", ev: "Hotel Van Zandt", v: "Hotel Van Zandt", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 553, day: "Tuesday", t: "12:00 PM", e2: "8:00 PM", title: "SXSW Music Clubhouse: Day Five", ev: "Downright Austin", v: "Downright Austin", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 554, day: "Tuesday", t: "12:00 PM", e2: "2:00 AM", title: "Austin Rhythm Revival Americana Showcase: Day Six", ev: "San Jac Saloon", v: "San Jac Saloon", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 555, day: "Tuesday", t: "12:00 PM", e2: "9:00 PM", title: "Asia x Austin Summit", ev: "The Long Center", v: "The Long Center", sp: [], g: ["thought_leadership"], cat: "sessions", food: false, free: true, badge: false },
  { id: 556, day: "Tuesday", t: "12:00 PM", e2: "10:00 PM", title: "SXSW Film & TV Clubhouse: Day Six", ev: "800 Congress", v: "800 Congress", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 557, day: "Tuesday", t: "12:00 PM", e2: "10:00 PM", title: "SXSW Innovation Clubhouse: Day Six", ev: "Brazos Hall", v: "Brazos Hall", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 558, day: "Tuesday", t: "12:00 PM", e2: "6:00 PM", title: "Casamigos House Of Friends: Day Two", ev: "Inn Cahoots", v: "Inn Cahoots", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 559, day: "Tuesday", t: "12:00 PM", e2: "7:00 PM", title: "The Best Paste Party Ever: Day Four", ev: "High Noon", v: "High Noon", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 560, day: "Tuesday", t: "12:00 PM", e2: "5:00 PM", title: "Tour Peachy Showcase", ev: "Brushy Street Commons", v: "Brushy Street Commons", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 561, day: "Tuesday", t: "12:00 PM", e2: "9:00 PM", title: "Kill Tony Pop-Up Shop: Day Six", ev: "325 E. 6th", v: "325 E. 6th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 562, day: "Tuesday", t: "12:00 PM", e2: "8:00 PM", title: "Radio Day Stage at Downright: Day Five", ev: "Downright Austin (backyard)", v: "Downright Austin (backyard)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 563, day: "Tuesday", t: "12:00 PM", e2: "8:00 PM", title: "Ledger x Spurs Hoops: Day Six", ev: "4th & Brazos", v: "4th & Brazos", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 564, day: "Tuesday", t: "1:00 PM", e2: "6:00 PM", title: "Free 4 Y'all Day Party Showcase: Day Three", ev: "Swan Dive", v: "Swan Dive", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 565, day: "Tuesday", t: "1:00 PM", e2: "6:00 PM", title: "Waterloo Records Day Parties: Day Five", ev: "Waterloo Records", v: "Waterloo Records", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 566, day: "Tuesday", t: "1:00 PM", e2: "3:00 PM", title: "Voltaic Marine on Lake Austin", ev: "TBA", v: "TBA", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 567, day: "Tuesday", t: "1:00 PM", e2: "5:00 PM", title: "McDonald's First Job Confessional: Day Three", ev: "700 Congress", v: "700 Congress", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 568, day: "Tuesday", t: "14:00:00", e2: "", title: "Howdy Podner!", ev: "Imogene + Willie", v: "Imogene + Willie", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 569, day: "Tuesday", t: "2:00 PM", e2: "6:00 PM", title: "British Music Embassy: Future Art & Culture UK XR Takeover (Day Six)", ev: "Palm Door On Sixth", v: "Palm Door On Sixth", sp: [], g: ["community", "fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 570, day: "Tuesday", t: "2:30 PM", e2: "3:30 PM", title: "Fela dot TV Pop-Up", ev: "Omni Austin Downtown", v: "Omni Austin Downtown", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 571, day: "Tuesday", t: "3:00 PM", e2: "6:00 PM", title: "AuremIP x SXSW", ev: "TBA", v: "TBA", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 572, day: "Tuesday", t: "4:00 PM", e2: "6:30 PM", title: "The Moth & The Gates Foundation present: Mothers Of Imvention", ev: "The Contemporary", v: "The Contemporary", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 573, day: "Tuesday", t: "4:00 PM", e2: "8:00 PM", title: "Recover + Recharge Closing Party with Nuropod", ev: "Bathe Austin", v: "Bathe Austin", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 574, day: "Tuesday", t: "16:00:00", e2: "", title: "Jameson St. Patrick's Day Neighborhood Takeover", ev: "East 6th (see notes)", v: "East 6th (see notes)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 575, day: "Tuesday", t: "4:30 PM", e2: "7:30 PM", title: "Allocators Anonymous: Skunkworks", ev: "—", v: "—", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 576, day: "Tuesday", t: "5:00 PM", e2: "7:00 PM", title: "AI Ethics Social Club with Google & The Maiven Collection", ev: "Google Downtown Austin", v: "Google Downtown Austin", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 577, day: "Tuesday", t: "5:00 PM", e2: "7:00 PM", title: "CEMA Pop-Up", ev: "MEXTA Restaurant", v: "MEXTA Restaurant", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 578, day: "Tuesday", t: "5:00 PM", e2: "7:00 PM", title: "Film & TV Industry Happy Hour with Tulsa Office Of Film, NYU & others", ev: "Stephen F's Bar", v: "Stephen F's Bar", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 579, day: "Tuesday", t: "5:00 PM", e2: "9:00 PM", title: "Sound Patterns Art Exhibition: Day One", ev: "DASA (506 Congress)", v: "DASA (506 Congress)", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 580, day: "Tuesday", t: "17:00:00", e2: "", title: "Luck presents: Potluck ($)", ev: "Luck, Texas", v: "Luck, Texas", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 581, day: "Tuesday", t: "5:00 PM", e2: "9:00 PM", title: "Sound Patterns Art Exhibition: Day Two", ev: "DASA (506 Congress)", v: "DASA (506 Congress)", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 582, day: "Tuesday", t: "5:00 PM", e2: "8:00 PM", title: "Swayable x World Central Kitchen Happy Hour", ev: "Sour Duck Market", v: "Sour Duck Market", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 583, day: "Tuesday", t: "6:00 PM", e2: "9:00 PM", title: "Unlocking Her Next Chapter: Fertility With Dr. Molly Maloof", ev: "327 Congress", v: "327 Congress", sp: [], g: ["women"], cat: "sessions", food: false, free: true, badge: false },
  { id: 584, day: "Tuesday", t: "6:00 PM", e2: "8:00 PM", title: "Duckpin Bowling & Drinks with Scalafai", ev: "Pins Mechanical Co.", v: "Pins Mechanical Co.", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 585, day: "Tuesday", t: "18:00:00", e2: "", title: "MexCena Showcase", ev: "Las Perlas", v: "Las Perlas", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 586, day: "Tuesday", t: "6:00 PM", e2: "2:00 AM", title: "A Fat A$$ Rap Showcase", ev: "Venue 6 (516 E. 6th)", v: "Venue 6 (516 E. 6th)", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 587, day: "Tuesday", t: "6:00 PM", e2: "9:00 PM", title: "Tech Leaders with Thoughtbot", ev: "TBA", v: "TBA", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 588, day: "Tuesday", t: "6:00 PM", e2: "9:00 PM", title: "Myngly Goes SXSW", ev: "Dadalab", v: "Dadalab", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 589, day: "Tuesday", t: "7:00 PM", e2: "1:00 AM", title: "Vision:8291: Day Four (UNITY Showcase)", ev: "Canopy", v: "Canopy", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 590, day: "Tuesday", t: "7:00 PM", e2: "10:00 PM", title: "Glean Networking Reception: Day Two", ev: "121 E. 5th", v: "121 E. 5th", sp: [], g: ["networking", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 591, day: "Tuesday", t: "19:00:00", e2: "", title: "Penny Loafer PR Showcase", ev: "Zilker Brewing", v: "Zilker Brewing", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 592, day: "Tuesday", t: "7:00 PM", e2: "9:30 PM", title: "Tokyo Joshi Pro Wrestling: Texas Stampede with Day One", ev: "Palmer Events Center", v: "Palmer Events Center", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 593, day: "Tuesday", t: "7:00 PM", e2: "2:00 AM", title: "Take Action x SXSW: Night Two (John Popper of Blues Traveler)", ev: "Inn Cahoots", v: "Inn Cahoots", sp: [], g: ["food", "fun"], cat: "social", food: true, free: true, badge: false },
  { id: 594, day: "Tuesday", t: "7:00 PM", e2: "2:00 AM", title: "Digidecade Showcase with The Digilogue (DJ Chose)", ev: "The Creek & The Cave", v: "The Creek & The Cave", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 595, day: "Tuesday", t: "7:00 PM", e2: "12:00 AM", title: "Nourishing The Soul Showcase", ev: "The Historic Victory Grill", v: "The Historic Victory Grill", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 596, day: "Tuesday", t: "19:00:00", e2: "", title: "Dropout Improv ($)", ev: "ACL Live", v: "ACL Live", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 597, day: "Tuesday", t: "7:00 PM", e2: "11:00 PM", title: "Austin Sounds: Day Six", ev: "Lefty's Brick Bar", v: "Lefty's Brick Bar", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 598, day: "Tuesday", t: "19:00:00", e2: "", title: "BLCKJEANS MGMT Showcase", ev: "Elysium", v: "Elysium", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 599, day: "Tuesday", t: "7:00 PM", e2: "2:00 AM", title: "The Color Agent 10th Anniversary Showcase", ev: "Swan Dive", v: "Swan Dive", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 600, day: "Tuesday", t: "7:00 PM", e2: "1:00 AM", title: "Monster Children Showcase", ev: "Mohawk", v: "Mohawk", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 601, day: "Tuesday", t: "7:00 PM", e2: "12:30 PM", title: "Mint Talent Group Showcase 2", ev: "Brushy Street Commons", v: "Brushy Street Commons", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 602, day: "Tuesday", t: "7:00 PM", e2: "10:00 PM", title: "BCV x Banner VC: What's Next?", ev: "TBA", v: "TBA", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 603, day: "Tuesday", t: "7:00 PM", e2: "12:00 AM", title: "Global Stage at Downright: Day Six", ev: "Downright Austin (backyard)", v: "Downright Austin (backyard)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 604, day: "Tuesday", t: "19:00:00", e2: "", title: "Lainey Wilson & Netflix: Keepin Country Cool Showcase", ev: "Stubb's", v: "Stubb's", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 605, day: "Tuesday", t: "7:30 PM", e2: "1:00 AM", title: "British Music Embassy: SXSW London (Night Six)", ev: "Palm Door On Sixth", v: "Palm Door On Sixth", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 606, day: "Tuesday", t: "7:30 PM", e2: "2:00 AM", title: "Athens In Austin Showcase", ev: "The Continental Club", v: "The Continental Club", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 607, day: "Tuesday", t: "8:00 PM", e2: "2:00 AM", title: "Interscope & UPS present: More Than Corridos Showcase", ev: "Mala Fama", v: "Mala Fama", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 608, day: "Tuesday", t: "12:00 PM", e2: "", title: "Smartpunk House", ev: "Hotel Vegas", v: "Hotel Vegas", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 609, day: "Tuesday", t: "12:00 PM", e2: "", title: "Lambert's 20th Showcase: Day Two", ev: "Lambert's BBQ", v: "Lambert's BBQ", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 610, day: "Tuesday", t: "12:00 PM", e2: "", title: "Good Coughee Showcase with Devin The Dude", ev: "Shangri-La", v: "Shangri-La", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 611, day: "Tuesday", t: "12:00 PM", e2: "", title: "Liberty Nites: Day Six", ev: "The Liberty", v: "The Liberty", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 612, day: "Tuesday", t: "12:00 PM", e2: "", title: "Lost Love Hotline: Day Three", ev: "TBA", v: "TBA", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  // ══ WEDNESDAY ══
  { id: 613, day: "Wednesday", t: "9:00 AM", e2: "4:00 PM", title: "Free Professional Headshots with Fujifilm & Precision: Day Three", ev: "Fairmont Austin (5th Floor)", v: "Fairmont Austin (5th Floor)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 614, day: "Wednesday", t: "9:00 AM", e2: "6:00 PM", title: "Rivian's Electric Joyride: Day Six", ev: "800 Congress (Road Closure)", v: "800 Congress (Road Closure)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 615, day: "Wednesday", t: "9:00 AM", e2: "4:00 PM", title: "SXSW Expo: Emerging Tech FREE DAY (PUBLIC)", ev: "Fairmont Austin (Manchester Ballroom)", v: "Fairmont Austin (Manchester Ballroom)", sp: [], g: ["ai"], cat: "sessions", food: false, free: true, badge: false },
  { id: 616, day: "Wednesday", t: "9:00 AM", e2: "7:00 PM", title: "Rivian Electric Roadhouse: Day Six", ev: "Rivian HQ", v: "Rivian HQ", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 617, day: "Wednesday", t: "10:00 AM", e2: "4:00 PM", title: "HOPE Lounge with Dropbox", ev: "Hope Outdoor Gallery", v: "Hope Outdoor Gallery", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 618, day: "Wednesday", t: "11:00 AM", e2: "7:00 PM", title: "Funded House Investor Lounge: Day Seven", ev: "Texas Bankers Association", v: "Texas Bankers Association", sp: [], g: ["fundraising", "fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 619, day: "Wednesday", t: "11:00 AM", e2: "6:00 PM", title: "Austin Blues Fest & Antone's Forever Day Party", ev: "Antone's", v: "Antone's", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 620, day: "Wednesday", t: "11:00 AM", e2: "6:00 PM", title: "Day Off Austin Daytime Showcase", ev: "Vulcan Gas Company", v: "Vulcan Gas Company", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 621, day: "Wednesday", t: "11:00 AM", e2: "7:00 PM", title: "Congress Avenue Block Party: Day Seven", ev: "900 Congress Ave. (Street)", v: "900 Congress Ave. (Street)", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 622, day: "Wednesday", t: "12:00 PM", e2: "6:00 PM", title: "Copeland Haus Designer Vintage Pop-Up Shop: Day Seven", ev: "Hotel Van Zandt", v: "Hotel Van Zandt", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 623, day: "Wednesday", t: "12:00 PM", e2: "10:00 PM", title: "SXSW Film & TV Clubhouse: Day Seven", ev: "800 Congress", v: "800 Congress", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 624, day: "Wednesday", t: "12:00 PM", e2: "8:00 PM", title: "SXSW Music Clubhouse: Day Six", ev: "Downright Austin", v: "Downright Austin", sp: [], g: ["fun"], cat: "sessions", food: false, free: true, badge: false },
  { id: 625, day: "Wednesday", t: "12:00 PM", e2: "2:00 AM", title: "Austin Rhythm Revival Americana Showcase: Day Seven", ev: "San Jac Saloon", v: "San Jac Saloon", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 626, day: "Wednesday", t: "12:00 PM", e2: "10:00 PM", title: "SXSW Innovation Clubhouse: Day Seven", ev: "Brazos Hall", v: "Brazos Hall", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 627, day: "Wednesday", t: "12:00 PM", e2: "9:00 PM", title: "Kill Tony Pop-Up Shop: Day Seven", ev: "325 E. 6th", v: "325 E. 6th", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 628, day: "Wednesday", t: "12:00 PM", e2: "8:00 PM", title: "Radio Day Stage at Downright: Day Six", ev: "Downright Austin (backyard)", v: "Downright Austin (backyard)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 629, day: "Wednesday", t: "12:00 PM", e2: "8:00 PM", title: "Ledger x Spurs Hoops: Day Seven", ev: "4th & Brazos", v: "4th & Brazos", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 630, day: "Wednesday", t: "12:00 PM", e2: "5:00 PM", title: "Brushy Day Party with Alex Maas of Black Angels", ev: "Brushy Street Commons", v: "Brushy Street Commons", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 631, day: "Wednesday", t: "1:00 PM", e2: "6:00 PM", title: "Free 4 Y'all Day Party Showcase: Day Four", ev: "Swan Dive", v: "Swan Dive", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 632, day: "Wednesday", t: "2:30 PM", e2: "5:00 PM", title: "Record Play: One-Hit Wonders SXSW Edition", ev: "Pershing", v: "Pershing", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 633, day: "Wednesday", t: "4:30 PM", e2: "7:30 PM", title: "SXSW Gaming Industry Mixer", ev: "Lazarus Brewing (6th)", v: "Lazarus Brewing (6th)", sp: [], g: ["networking", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 634, day: "Wednesday", t: "5:00 PM", e2: "7:00 PM", title: "ATX Marketing Innovators Happy Hour", ev: "TBA", v: "TBA", sp: [], g: ["brand", "fun"], cat: "social", food: false, free: true, badge: false },
  { id: 635, day: "Wednesday", t: "5:00 PM", e2: "7:00 PM", title: "PsyXSW Social Hour", ev: "Banger's on Rainey", v: "Banger's on Rainey", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 636, day: "Wednesday", t: "5:00 PM", e2: "7:00 PM", title: "Austin Shapers Happy Hour", ev: "Industry", v: "Industry", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 637, day: "Wednesday", t: "5:00 PM", e2: "8:00 PM", title: "Waterloo Records Day Parties: Day Six (White Claw Fresh Set)", ev: "Waterloo Records", v: "Waterloo Records", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 638, day: "Wednesday", t: "5:00 PM", e2: "7:00 PM", title: "Film & TV Industry Happy Hour with Louisville Film Office", ev: "Stephen F's Bar", v: "Stephen F's Bar", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 639, day: "Wednesday", t: "5:30 PM", e2: "8:30 PM", title: "Vinyls And Viddles", ev: "Equipment Room", v: "Equipment Room", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 640, day: "Wednesday", t: "6:00 PM", e2: "8:00 PM", title: "Unlocking Her Next Chapter: Food & Nutrition With Dr. Poonam Desai", ev: "327 Congress", v: "327 Congress", sp: [], g: ["food", "women"], cat: "food", food: false, free: true, badge: false },
  { id: 641, day: "Wednesday", t: "6:00 PM", e2: "8:30 PM", title: "Tokyo Joshi Pro Wrestling: Texas Stampede with Day Two", ev: "Palmer Events Center", v: "Palmer Events Center", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 642, day: "Wednesday", t: "6:30 PM", e2: "9:00 PM", title: "Speak Your Truth Transformational Storytelling", ev: "Virtigo Pictures", v: "Virtigo Pictures", sp: [], g: ["brand"], cat: "sessions", food: false, free: true, badge: false },
  { id: 643, day: "Wednesday", t: "7:00 PM", e2: "12:00 AM", title: "Sounds Of Austin Showcase presented by GRAV", ev: "Swan Dive", v: "Swan Dive", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 644, day: "Wednesday", t: "19:00:00", e2: "", title: "Musica No Borders Showcase with Universal Music Mexico & FONO", ev: "Mala Fama (Rooftop)", v: "Mala Fama (Rooftop)", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 645, day: "Wednesday", t: "7:00 PM", e2: "11:00 PM", title: "The Loyalty Firm Showcase", ev: "Zilker Brewing", v: "Zilker Brewing", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 646, day: "Wednesday", t: "7:00 PM", e2: "11:00 PM", title: "SideHustle LIVE in Austin ($)", ev: "Pershing", v: "Pershing", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 647, day: "Wednesday", t: "7:00 PM", e2: "2:00 AM", title: "Very Necessary presents The World Is Yours Showcase", ev: "Mohawk", v: "Mohawk", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 648, day: "Wednesday", t: "7:00 PM", e2: "11:00 PM", title: "Austin Sounds: Day Seven", ev: "Lefty's Brick Bar", v: "Lefty's Brick Bar", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 649, day: "Wednesday", t: "7:00 PM", e2: "2:00 AM", title: "Lafayette Sheakaze & Crawfish Boil", ev: "Antone's", v: "Antone's", sp: [], g: ["food"], cat: "sessions", food: true, free: true, badge: false },
  { id: 650, day: "Wednesday", t: "7:00 PM", e2: "12:30 AM", title: "Charley Crockett's RAMJAM by Luck Reunion", ev: "Stubb's", v: "Stubb's", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 651, day: "Wednesday", t: "7:00 PM", e2: "12:00 AM", title: "Global Stage at Downright: Day Seven", ev: "Downright Austin (backyard)", v: "Downright Austin (backyard)", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 652, day: "Wednesday", t: "7:30 PM", e2: "9:00 PM", title: "2026 Film & TV Awards", ev: "Paramount Theatre", v: "Paramount Theatre", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 653, day: "Wednesday", t: "7:30 PM", e2: "1:00 AM", title: "British Music Embassy: Chris Hawkins / LIIFT Presents (Night Seven)", ev: "Palm Door On Sixth", v: "Palm Door On Sixth", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 654, day: "Wednesday", t: "10:00 PM", e2: "1:00 AM", title: "2026 Film & TV Wrap Party", ev: "Zach Theatre", v: "Zach Theatre", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
  { id: 655, day: "Wednesday", t: "12:00 PM", e2: "", title: "Liberty Nites: Day Seven", ev: "The Liberty", v: "The Liberty", sp: [], g: ["networking", "community"], cat: "sessions", food: false, free: true, badge: false },
  { id: 656, day: "Wednesday", t: "12:00 PM", e2: "", title: "Lambert's 20th Showcase: Day Three", ev: "Lambert's BBQ", v: "Lambert's BBQ", sp: [], g: ["fun"], cat: "social", food: false, free: true, badge: false },
];

const LOADING_MSGS = [
  "analyzing your intentions…", "scanning 650+ sessions…",
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
    const [c, bg] = isRest ? ["#8BA87A", "#EDF5E8"] : isFoodBump ? ["#C4A24A", "#FBF6E8"] : s ? getVenueColor(s.ev) : ["#999", "#F5F5F0"];

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
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: T.sageDark, marginBottom: 8 }}>Austin, TX · March 14–18, 2026</div>
        <h1 className="f2" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px,5vw,38px)", fontWeight: 900, fontStyle: "italic", color: T.black, margin: "0 0 12px", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
          Let's build your ultimate<br /><span style={{ color: T.sageDark }}>SXSW schedule!</span>
        </h1>
        <p className="f3" style={{ fontSize: 14, color: T.muted, lineHeight: 1.6, margin: "0 0 22px" }}>
          These are <strong style={{ color: T.ink }}>free external events</strong> around the main conference — most are free & badge-free. Tell us your goals and we'll build a personalized itinerary.
        </p>
        <div className="f3" style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
          {[["650+", "sessions"], ["290+", "venues"], ["5", "days"], ["Mostly", "FREE"]].map(([n, l]) => (
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
{"schedule":{"Saturday":[ids],"Sunday":[ids],"Monday":[ids],"Tuesday":[ids],"Wednesday":[ids]},"tip":"one short encouraging sentence"}
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
  const [c, bg] = getVenueColor(s.ev);
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
          const [c] = isRest ? ["#8BA87A"] : isFoodBump ? ["#C4A24A"] : s ? getVenueColor(s.ev) : [T.muted];
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
function Builder({ plan, setPlan, tip, onExport, onStartOver }) {
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 860;
  const isMobile = windowWidth < 600;

  const [activeDay, setActiveDayRaw] = useState(() => {
    try { const s = localStorage.getItem("sxsw_activeDay"); return DAYS.includes(s) ? s : "Saturday"; } catch { return "Saturday"; }
  });
  const setActiveDay = useCallback(d => { setActiveDayRaw(d); try { localStorage.setItem("sxsw_activeDay", d); } catch {} }, []);
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
            <button onClick={onStartOver} style={{ background: "transparent", color: T.muted, border: `1.5px solid ${T.border}`, borderRadius: 100, fontFamily: "'DM Sans',sans-serif", fontSize: 11, fontWeight: 600, padding: "7px 14px", cursor: "pointer", whiteSpace: "nowrap" }}>↺ Start Over</button>
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
  const saved = useMemo(() => {
    try { const s = localStorage.getItem("sxsw_state"); return s ? JSON.parse(s) : null; } catch { return null; }
  }, []);

  const initPage = saved?.page === "builder" || saved?.page === "export" ? saved.page : "landing";
  const [page, setPage] = useState(initPage);
  const [prefs, setPrefs] = useState(saved?.prefs || null);
  const [plan, setPlan] = useState(saved?.plan || { Saturday: [], Sunday: [], Monday: [], Tuesday: [], Wednesday: [] });
  const [tip, setTip] = useState(saved?.tip || "");

  useEffect(() => {
    if (page === "builder" || page === "export") {
      try { localStorage.setItem("sxsw_state", JSON.stringify({ page, prefs, plan, tip })); } catch {}
    }
  }, [page, prefs, plan, tip]);

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
      {page === "builder" && <Builder plan={plan} setPlan={setPlan} tip={tip} onExport={() => setPage("export")} onStartOver={() => { try { localStorage.removeItem("sxsw_state"); localStorage.removeItem("sxsw_activeDay"); } catch {} setPrefs(null); setPlan({ Saturday: [], Sunday: [], Monday: [], Tuesday: [], Wednesday: [] }); setTip(""); setPage("landing"); }} />}
      {page === "export" && <ExportView plan={plan} onBack={() => setPage("builder")} />}
    </>
  );
}
