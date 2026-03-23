
import { doc, setDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { db } from "../firebase";

export const bulkServices = [
  // Instagram Followers [Guaranteed♻️]
  { id: 4680, name: "Instagram Followers [Refill - 30Days ♻️] [Speed-50K+ Day]", rate: "$0.58", min: 10, max: 50000, category: "Instagram Followers [Guaranteed♻️]", description: "Start Instant. Speed 50K+ per day. 30 days refill." },
  { id: 3344, name: "Instagram Followers [R30] [Speed - 50K+/Day🚀🔥]", rate: "$0.67", min: 20, max: 1000000, category: "Instagram Followers [Guaranteed♻️]", description: "Refill button working. High speed." },
  { id: 4258, name: "Instagram Followers [Refill - 30Days ♻️ ] [Speed :-10K-30K Day]", rate: "$0.72", min: 2, max: 1000000, category: "Instagram Followers [Guaranteed♻️]", description: "Stable followers with 30 days refill." },
  { id: 4180, name: "Instagram Followers [Speed - 200k+/Day] [Refill - 90Days]", rate: "$0.91", min: 3, max: 1000000, category: "Instagram Followers [Guaranteed♻️]", description: "Good quality, 90 days refill. Ultra fast." },
  { id: 4761, name: "Instagram Followers [Refill - 365Days ♻️ ] [Speed :-30K-50K Day]", rate: "$0.98", min: 3, max: 1000000, category: "Instagram Followers [Guaranteed♻️]", description: "1 year refill guarantee." },
  { id: 3346, name: "Instagram Followers [R30♻️] [100% 𝑵𝒐𝒏 - 𝑫𝒓𝒐𝒑 & Stable]", rate: "$1.02", min: 20, max: 1000000, category: "Instagram Followers [Guaranteed♻️]", description: "Non-drop stable followers." },
  { id: 3343, name: "Instagram Followers [R365♻️] [Speed - 100K+/Day🚀🔥]", rate: "$1.14", min: 20, max: 1000000, category: "Instagram Followers [Guaranteed♻️]", description: "Good quality, refill button working." },
  { id: 6054, name: "Instagram Followers [Refill - 45Days] [Speed50K+/Day🚀🔥]", rate: "$1.17", min: 20, max: 1000000, category: "Instagram Followers [Guaranteed♻️]", description: "Fast delivery, 45 days refill." },
  { id: 2983, name: "Instagram Followers [Refill - 365 Days] [100% 𝑵𝒐𝒏 - 𝑫𝒓𝒐𝒑]", rate: "$1.36", min: 10, max: 1000000, category: "Instagram Followers [Guaranteed♻️]", description: "Stable non-drop, 1 year refill." },
  { id: 4675, name: "Instagram Followers [Speed - 500K/Day] [Lifetime Refill ♻️ ]", rate: "$1.66", min: 10, max: 50000000, category: "Instagram Followers [Guaranteed♻️]", description: "Lifetime refill, instant start." },

  // Instagram Likes [NON DROP]
  { id: 27, name: "♥️Instagram Likes - [ Speed: 40000/Hour ] [ MQ ] [Non Drop]", rate: "$0.14", min: 10, max: 100000, category: "Instagram Likes [NON DROP]", description: "Superfast instant likes." },
  { id: 26, name: "♥️Instagram Likes - Speed:- 100K/Day (NON DROP)", rate: "$0.19", min: 50, max: 2000000, category: "Instagram Likes [NON DROP]", description: "Start 0-10 minutes." },
  { id: 3927, name: "♥️ Instagram Likes [Speed - 5K+/h] [Max - 200K]", rate: "$0.20", min: 10, max: 100000, category: "Instagram Likes [NON DROP]", description: "Instant start." },
  { id: 1266, name: "♥️Instagram Likes [Refill: Lifetime ] [Bullet Speed ⚡️]", rate: "$0.28", min: 10, max: 100000, category: "Instagram Likes [NON DROP]", description: "Bullet speed, lifetime refill." },
  { id: 1339, name: "♥️Instagram Likes - Speed:- 50K/day - Refill:- Non Drop", rate: "$0.28", min: 50, max: 200000, category: "Instagram Likes [NON DROP]", description: "Instant start, non-drop." },

  // YouTube Views
  { id: 6061, name: "⭕️YouTube Views - [ Lifetime Non Drop ] [ Recommended ]", rate: "$1.28", min: 500, max: 1000000, category: "Real Ads YouTube Views ❤️‍🔥🔥", description: "Delivered within 12H-48H. Lifetime non-drop." },
  { id: 6060, name: "⭕️YouTube Views - [ Minimum - 1K ] [ Lifetime Non Drop ]", rate: "$1.22", min: 1000, max: 1000000, category: "Real Ads YouTube Views ❤️‍🔥🔥", description: "Recommended service." },
  { id: 4544, name: "⭐️Youtube AdWord Views [0-48Hour Complete🚀]", rate: "$0.55", min: 50000, max: 1000000, category: "YouTube ADWORD VIEWS [CHEAPEST]", description: "Cheapest AdWord views." },

  // YouTube Subscribers
  { id: 230, name: "YouTube Subscribers - [ Max - 500K ] [🛑 No Refill 🛑]", rate: "$0.18", min: 10, max: 1000000, category: "YouTube Subscribers", description: "Fast start, no refill." },
  { id: 229, name: "♦️YouTube Subscribers [ Speed: 250-500/Day ] [ Refill: 30 Days ]", rate: "$26.18", min: 100, max: 50000, category: "YouTube Subscribers", description: "High quality subscribers with refill." },

  // Telegram Members
  { id: 4216, name: "Telegram Real Members [Super Instant] - 30 Days Refill", rate: "$0.91", min: 100, max: 200000, category: "TELEGRAM MEMBERS [NON DROP]✅", description: "One tap complete, 30 days refill." },
  { id: 4090, name: "Telegram Members - Instant - Speed : 50K/D", rate: "$0.31", min: 500, max: 5000, category: "TELEGRAM MEMBERS [NON DROP]✅", description: "30 days refill guarantee." },
  { id: 4219, name: "Telegram Non Drop Member [ 50K+/Day ]", rate: "$0.28", min: 500, max: 100000, category: "TELEGRAM MEMBERS [NON DROP]✅", description: "30 days non-drop." },

  // TikTok Views
  { id: 3066, name: "TikTok Views [Max: 100M] [Start Time: Instant ]", rate: "$0.01", min: 500, max: 1000000, category: "Tiktok Views", description: "Instant start, high speed." },
  { id: 3063, name: "TikTok Views [Max: 1M] [Speed: SUPER FAST]", rate: "$0.012", min: 50, max: 217545811, category: "Tiktok Views", description: "Super fast delivery." },

  // TikTok Followers
  { id: 3139, name: "TikTok Followers [Refill: 7D] [Speed: 50K/Day]", rate: "$0.91", min: 100, max: 100000, category: "Tiktok Followers", description: "7 days refill guarantee." },
  { id: 4191, name: "TikTok Followers [Speed 100k/Day] [Guarantee : 30Days]", rate: "$3.23", min: 10, max: 400000, category: "Tiktok Followers", description: "Cancel enabled, 30 days guarantee." },

  // Spotify Plays
  { id: 4551, name: "🌎 Spotify Plays [Global] [Lifetime Guaranteed]", rate: "$0.12", min: 500, max: 20000000, category: "Spotify Cheapest Server", description: "Global plays, lifetime guaranteed." },
  { id: 4552, name: "🇺🇸 Spotify Plays [USA] [Lifetime Guaranteed]", rate: "$0.12", min: 500, max: 20000000, category: "Spotify Cheapest Server", description: "USA targeted plays." },

  // Instagram Followers [Auto Refill♻️]
  { id: 6219, name: "Instagram Followers [Real Mixed] [Auto Refill 7D]", rate: "$0.84", min: 100, max: 100000, category: "Instagram Followers [Auto Refill♻️]", description: "No drop, auto refill + button." },
  { id: 6222, name: "Instagram Followers [Real Mixed] [Auto Refill Lifetime]", rate: "$1.03", min: 100, max: 100000, category: "Instagram Followers [Auto Refill♻️]", description: "Lifetime auto refill." },

  // Instagram Followers [Indian🇮🇳]
  { id: 649, name: "🇮🇳 Instagram Followers [INDIAN] - 365Days Refill", rate: "$1.45", min: 100, max: 50000, category: "Instagram Followers [Indian🇮🇳]", description: "Start instant, 10K/day speed." },
  { id: 1475, name: "🇮🇳 Instagram Followers [100% INDIAN] - 30Days Refill", rate: "$4.34", min: 10, max: 50000, category: "Instagram Followers [Indian🇮🇳]", description: "High quality 100% Indian." },

  // Instagram Likes [Indian🇮🇳]
  { id: 647, name: "🇮🇳 Instagram Likes [INDIAN] - Super Instant", rate: "$0.18", min: 10, max: 1000000, category: "Instagram Likes [Indian🇮🇳]", description: "100K/day speed." },

  // Instagram USA Services 🇺🇸
  { id: 6165, name: "Instagram USA 🇺🇸 Followers - 30-Day Refill", rate: "$4.30", min: 10, max: 100000, category: "Instagram USA Services 🇺🇸", description: "Targeted USA followers." },
  { id: 6166, name: "Instagram USA 🇺🇸 Real and Active Likes", rate: "$0.77", min: 10, max: 100000, category: "Instagram USA Services 🇺🇸", description: "Non-drop, instant start." },

  // Instagram Views/Reel👀
  { id: 1348, name: "👀 INSTAGRAM VIEWS [CHEAPEST]", rate: "$0.001", min: 100, max: 20000, category: "Instagram Views/Reel👀", description: "Cheapest views in market." },
  { id: 621, name: "👀 INSTAGRAM VIEWS [SUPER-FAST]", rate: "$0.034", min: 100, max: 100000000, category: "Instagram Views/Reel👀", description: "Super-fast working." },

  // YouTube Shorts🤩
  { id: 3470, name: "👍 Youtube Short Likes - 30 Days Refill", rate: "$0.91", min: 10, max: 100000, category: "YouTube Shorts🤩", description: "100K/day speed." },

  // YouTube Watchtime
  { id: 6208, name: "⏱️ YouTube Watchtime - 30 Days Refill (5 Min Video)", rate: "$14.39", min: 100, max: 100000, category: "YouTube Watchtime", description: "300/day speed." },

  // Facebook Page Likes+Followers
  { id: 682, name: "🔺 Facebook Page Likes + Followers [Cheapest]", rate: "$0.41", min: 10, max: 1000000, category: "Facebook Page Likes+Followers", description: "365 days refill button." },

  // Telegram Non Drop Members For Search Ranking 📈
  { id: 6223, name: "Telegram Non Drop Member [Join From Search]", rate: "$1.08", min: 100, max: 100000, category: "Telegram Non Drop Members For Search Ranking 📈", description: "Good for search ranking." },

  // Twitter Followers
  { id: 4006, name: "🐥 Twitter Followers [Refill: 30D]", rate: "$9.37", min: 10, max: 100000, category: "🐥Twitter Follower", description: "10K-30K/day speed." },

  // LinkedIn [Premium]
  { id: 4811, name: "Linkedin Profile Followers [Non Drop]", rate: "$21.45", min: 100, max: 10000, category: "LINKEDIN [Premium]", description: "30 days refill guarantee." },
  
  // Instagram Story
  { id: 1155, name: "🤳 Instagram Story Views {FASTEST}🔥", rate: "$0.005", min: 100, max: 1000000, category: "Instagram Story", description: "Fastest story views." },
  { id: 2919, name: "Instagram Story Likes [100K]", rate: "$0.34", min: 100, max: 100000, category: "Instagram Story", description: "50K/day speed." },

  // Instagram Saves
  { id: 2903, name: "⏺️ Instagram Saves [Max: 50K]", rate: "$0.085", min: 10, max: 1000000, category: "Instagram Saves", description: "Start 0-1 hour." },

  // Instagram Impressions
  { id: 1866, name: "🧨 Instagram Reach + Impressions", rate: "$0.068", min: 10, max: 1000000, category: "Instagram Impressions", description: "250K/day speed." },

  // YouTube Live Stream
  { id: 2492, name: "🔴 YouTube Livestream Viewers [15 Min]", rate: "$0.076", min: 10, max: 400000, category: "YouTube Live Stream [ Server 1 ]", description: "100% concurrent, instant." },
  { id: 2493, name: "🔴 YouTube Livestream Viewers [60 Min]", rate: "$0.317", min: 50, max: 400000, category: "YouTube Live Stream [ Server 1 ]", description: "100% concurrent, instant." },

  // YouTube Comments
  { id: 242, name: "🗯️ YouTube Comments [RANDOM]", rate: "$6.32", min: 20, max: 11000, category: "YouTube Comments", description: "With profile pictures." },

  // Facebook Group Members
  { id: 3477, name: "💚 Facebook Group Members [MQ]", rate: "$0.32", min: 10, max: 100000, category: "Facebook Group Members", description: "30 days refill." },

  // Facebook Post Reaction
  { id: 4507, name: "Facebook Post Reaction [ 👍 ]", rate: "$0.118", min: 10, max: 5000000, category: "Facebook Post Reaction", description: "30 days refill, instant." },
  { id: 4508, name: "Facebook Post Reaction [ ❤️ ]", rate: "$0.118", min: 10, max: 5000000, category: "Facebook Post Reaction", description: "30 days refill, instant." },

  // Telegram Post Views
  { id: 344, name: "❤️ Telegram Post View [ CHEAPEST ]", rate: "$0.0015", min: 50, max: 20000, category: "Telegram Post Views 👀", description: "Cheapest post views." },

  // Telegram Reactions
  { id: 3960, name: "🔷 Telegram mix positive Reaction + Views", rate: "$0.095", min: 10, max: 200000, category: "Telegram : Post Reaction + Views", description: "Fastest reactions." },

  // TikTok Comments
  { id: 3979, name: "💬 TikTok - Comment [ EMOJI ]", rate: "$1.84", min: 10, max: 10000, category: "TikTok - Comments", description: "Lifetime refill, instant." },

  // TikTok Shares
  { id: 3270, name: "TikTok Shares [Max: 100K]", rate: "$0.049", min: 10, max: 10000000, category: "TikTok Shares", description: "100K/day speed." },

  // Spotify Followers
  { id: 4562, name: "🌎 Spotify Followers [Global]", rate: "$0.168", min: 100, max: 1000000, category: "Spotify Cheapest Server", description: "Artist - Playlist - User. No refill." },
  { id: 4565, name: "🌎 Spotify Followers [Lifetime Guaranteed]", rate: "$0.283", min: 100, max: 100000000, category: "Spotify Cheapest Server", description: "Lifetime guarantee." },

  // Twitter Retweets
  { id: 4768, name: "♻️ Twitter Retweet | 30 Days Refill", rate: "$5.62", min: 100, max: 2000, category: "🐥Twitter Retweets", description: "Instant start." },

  // Twitter Poll Votes
  { id: 1412, name: "🐥 Twitter Poll Votes [Refill: No]", rate: "$0.142", min: 100, max: 20000, category: "🐥Twitter Poll Votes 🗳", description: "Start 1 hour." },

  // Facebook Views
  { id: 4772, name: "💿 Facebook Video/Reels views", rate: "$0.123", min: 100, max: 1000000000, category: "Facebook Views", description: "Non drop, instant start." },

  // Telegram Boost
  { id: 4596, name: "Telegram Boost Channel [1 Day]", rate: "$29.80", min: 1, max: 10000, category: "Telegram Boost Channel ⭐️", description: "Channel story activate." },

  // Instagram Channel Members
  { id: 4266, name: "Instagram Channel Member [WW]", rate: "$0.977", min: 10, max: 1000000, category: "Instagram Channel Members", description: "Start 0-1 hour. Speed 500K/day." },
  { id: 4272, name: "Instagram Channel Member [INDIA 🇮🇳]", rate: "$0.995", min: 10, max: 1000000, category: "Instagram Channel Members", description: "Targeted Indian members." },

  // YouTube Community Posts
  { id: 2344, name: "🌐 Youtube Community Post Like [MQ]", rate: "$0.155", min: 10, max: 50000, category: "YouTube Community Posts", description: "Medium quality likes." },
  { id: 2343, name: "🌐 Youtube Community Post Likes [HQ]", rate: "$2.572", min: 50, max: 1500, category: "YouTube Community Posts", description: "High quality, 15 days refill." },

  // Facebook Organic Services
  { id: 4413, name: "Facebook Organic Page Like + Followers", rate: "$10.71", min: 100, max: 10000, category: "Facebook Organic Services", description: "Low drop, no refill. 1K/day speed." },
  { id: 4416, name: "Facebook Organic Post Share", rate: "$30.61", min: 50, max: 10000, category: "Facebook Organic Services", description: "Organic post shares." },

  // Telegram Premium Members
  { id: 6224, name: "💎 Telegram Premium Members [30 Day]", rate: "$9.15", min: 100, max: 50000, category: "Telegram Premium Members – AI Keyword Search 🤖", description: "AI smart keyword finder & auto join." },
  { id: 4711, name: "💎 Telegram Premium Members [30Days Non Drop]", rate: "$12.77", min: 10, max: 20000, category: "💎TELEGRAM PREMIUM MEMBERS [RUSSIAN SERVER ]", description: "High quality Russian server." },

  // Telegram Premium Reactions
  { id: 2031, name: "♦️ Telegram Premium Mix Positive Reaction", rate: "$0.098", min: 10, max: 1000000, category: "Telegram Premium Reactions [ 🐳 🤡 ❤️‍🔥 🕊 🐳]", description: "Includes free views." },
  { id: 2033, name: "♦️ Telegram Premium Mix Negative Reaction", rate: "$0.011", min: 10, max: 200000, category: "Telegram Premium Reactions [ 🐳 🤡 ❤️‍🔥 🕊 🐳]", description: "Includes free views." },

  // Twitter Organic Services
  { id: 4419, name: "🐣 X Organic Likes", rate: "$4.51", min: 10, max: 3000, category: "🐥Twitter(X) Organic Services", description: "Low drop, 1K/day speed." },
  { id: 4422, name: "🐣 X Organic Special Likes", rate: "$4.44", min: 10, max: 10000, category: "🐥Twitter(X) Organic Services", description: "Non-drop, real accounts." },

  // Spotify Mobile Plays (Royalties Eligible)
  { id: 4819, name: "🌎 Spotify Mobile Plays [Royalties Eligible]", rate: "$1.38", min: 500, max: 200000, category: "[Elite] Spotify %100 Premium Mobile Plays [Royalties Eligible]", description: "100% premium accounts. Lifetime guarantee." },
  { id: 4824, name: "🇮🇳 Spotify Mobile Plays [INDIA] [Royalties]", rate: "$1.53", min: 500, max: 200000, category: "[Elite] Spotify %100 Premium Mobile Plays [Royalties Eligible]", description: "Targeted Indian mobile plays." },

  // Twitch Services
  { id: 5001, name: "🎮 Twitch Channel Followers [Instant]", rate: "$0.45", min: 100, max: 50000, category: "Twitch Services", description: "Instant start, high quality followers." },
  { id: 5002, name: "🎮 Twitch Live Viewers [15 Min]", rate: "$0.12", min: 10, max: 10000, category: "Twitch Services", description: "Stable concurrent viewers." },

  // Discord Services
  { id: 5101, name: "💬 Discord Server Members [Offline]", rate: "$1.20", min: 100, max: 10000, category: "Discord Services", description: "Offline members for server growth." },
  { id: 5102, name: "💬 Discord Server Members [Online]", rate: "$3.50", min: 50, max: 5000, category: "Discord Services", description: "Online members with high quality profiles." },

  // Instagram Specialized
  { id: 4280, name: "📸 Instagram Profile Visits + Reach", rate: "$0.05", min: 100, max: 1000000, category: "Instagram Specialized", description: "Boost your profile visibility." },
  { id: 4281, name: "📸 Instagram Comment Likes [Verified Accounts]", rate: "$12.50", min: 10, max: 1000, category: "Instagram Specialized", description: "Likes from verified blue-tick accounts." },

  // YouTube Specialized
  { id: 2350, name: "🎥 YouTube Dislikes [Stable]", rate: "$5.80", min: 10, max: 5000, category: "YouTube Specialized", description: "Stable dislikes for competitive analysis." },
  { id: 2351, name: "🎥 YouTube Video Shares [Social Media]", rate: "$0.25", min: 100, max: 100000, category: "YouTube Specialized", description: "Shares to various social platforms." },

  // Threads Services
  { id: 5201, name: "🧵 Threads Followers [Instant]", rate: "$0.85", min: 100, max: 50000, category: "Threads Services", description: "Instant delivery for Threads." },
  { id: 5202, name: "🧵 Threads Likes [Real]", rate: "$0.40", min: 50, max: 20000, category: "Threads Services", description: "Real account likes for Threads posts." }
];

export const seedServices = async () => {
  console.log("Starting seedServices with batch...");
  let count = 0;
  
  try {
    const batch = writeBatch(db);
    
    for (const service of bulkServices) {
      const serviceId = service.id.toString();
      const serviceRef = doc(db, 'services', serviceId);
      batch.set(serviceRef, {
        ...service,
        createdAt: serverTimestamp()
      });
      count++;
    }
    
    await batch.commit();
    console.log(`Successfully seeded ${count} services in a single batch!`);
    return { success: true, count };
  } catch (error) {
    console.error("Error seeding services with batch:", error);
    return { success: false, count, error: error instanceof Error ? error.message : String(error) };
  }
};
