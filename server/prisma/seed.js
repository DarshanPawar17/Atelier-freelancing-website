import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "Password@123";

const profileImages = {
  ayaan: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  sara: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  daniel: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  meera: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
  kabir: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
  nisha: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=400&q=80",
  priya: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  rohan: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=400&q=80",
  zoya: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=400&q=80",
  arjun: "https://images.unsplash.com/photo-1504257432379-73551bd53844?auto=format&fit=crop&w=400&q=80",
};

const taskImages = {
  programming: [
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
  ],
  design: [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
  ],
  marketing: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1533750516457-a7f992034fce?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  ],
  ai: [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1620712943543-bcc4628c9757?auto=format&fit=crop&w=800&q=80",
  ],
  writing: [
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=800&q=80",
  ],
};

async function main() {
  console.log("🚀 Starting Global Professional Seeding...");

  // Drop current database for fresh state
  try {
    await prisma.$runCommandRaw({ dropDatabase: 1 });
    console.log("🗑️ Database Cleared.");
  } catch (err) {
    console.log("⚠️ Could not drop database, proceeding with cleanup...");
  }

  const password = await hash(DEMO_PASSWORD, 10);

  // 1. Create a Large Group of Professional Users
  const userList = [
    { email: "ayaan.arch@atelier.x", username: "ayaanstudio", fullName: "Ayaan Architectural Studio", img: profileImages.ayaan, desc: "Premier architectural visualization and state-of-the-art studio briefing." },
    { email: "sara.strat@atelier.x", username: "sarastrategy", fullName: "Sara Strategy Lab", img: profileImages.sara, desc: "Digital brand strategy and conversion-focused growth marketing." },
    { email: "daniel.codes@atelier.x", username: "daniellabs", fullName: "Daniel Digital Labs", img: profileImages.daniel, desc: "Custom software engineering and scalable technical architecture." },
    { email: "priya.ai@atelier.x", username: "priya_ai", fullName: "Priya AI Artistry", img: profileImages.priya, desc: "Specialist in custom AI generative models and mid-journey prompt engineering." },
    { email: "rohan.dev@atelier.x", username: "rohandev", fullName: "Rohan Fullstack", img: profileImages.rohan, desc: "Full-stack MERN developer with 5+ years of experience in enterprise apps." },
    { email: "zoya.write@atelier.x", username: "zoyacreative", fullName: "Zoya Content Studio", img: profileImages.zoya, desc: "Technical writing, storytelling, and high-conversion ad copy." },
    { email: "arjun.ux@atelier.x", username: "arjunux", fullName: "Arjun UX/UI", img: profileImages.arjun, desc: "Creating flow-centric design systems for modern mobile and web platforms." },
    { email: "meera.invest@atelier.x", username: "meera_v", fullName: "Meera Ventures", img: profileImages.meera, desc: "Enterprise client looking for premium talent." },
    { email: "kabir.ops@atelier.x", username: "kabir_ops", fullName: "Kabir Ops", img: profileImages.kabir, desc: "Supply chain and operations optimization specialist." },
    { email: "nisha.ads@atelier.x", username: "nisha_c", fullName: "Nisha Media", img: profileImages.nisha, desc: "Digital media buyer and performance marketing expert." },
  ];

  const users = await Promise.all(
    userList.map((u) =>
      prisma.user.create({
        data: {
          email: u.email,
          password,
          username: u.username,
          fullName: u.fullName,
          description: u.desc,
          profileImage: u.img,
          isProfileInfoSet: true,
        },
      })
    )
  );

  const [s1, s2, s3, s4, s5, s6, s7, b1, b2, b3] = users;

  // 2. Create 25+ High-Quality Gigs
  const gigTemplates = [
    { title: "I will design a Premium Minimalist Logo & Brand Identity", cat: "Graphic Design", price: 1200, user: s1, img: taskImages.design, desc: "Complete visual identity including logo, typography, and primary brand assets.", features: ["3 Concepts", "Vector Files", "Brand Guidelines", "Commercial Use"] },
    { title: "I will build a High-Performance MERN Stack Application", cat: "Programming & Tech", price: 15000, user: s3, img: taskImages.programming, desc: "Full-stack development with React, Node, and MongoDB. Secure, scalable, and tailored to your needs.", features: ["Custom API", "Auth System", "Cloud Deployment", "6 Months Support"] },
    { title: "I will train a Custom AI Model for your Brand Voice", cat: "AI Services", price: 4500, user: s4, img: taskImages.ai, desc: "Fine-tune LLMs to speak exactly like your brand. Perfect for automated customer support.", features: ["Dataset Prep", "Fine-tuning", "Integration API", "Usage Guide"] },
    { title: "I will develop a Professional Flutter Mobile App (iOS/Android)", cat: "Programming & Tech", price: 12000, user: s5, img: taskImages.programming, desc: "Cross-platform mobile apps with smooth animations and robust backend integration.", features: ["Native Performance", "UI/UX Design", "App Store Submission"] },
    { title: "I will solve your Website SEO and Google Ranking", cat: "Digital Marketing", price: 2500, user: s2, img: taskImages.marketing, desc: "Audit your technical SEO, fix keywords, and get your site to page 1 of Google.", features: ["Keyword Research", "Backlink Strategy", "Technical Audit"] },
    { title: "I will write 10x SEO-Optimized Technical Blog Posts", cat: "Writing & Translation", price: 3500, user: s6, img: taskImages.writing, desc: "Deep-dive technical content that ranks on search engines and engages readers.", features: ["Plagiarism Check", "Yoast Optimized", "High Engagement"] },
    { title: "I will create a Futuristic 3D Environment in Unreal Engine", cat: "Graphic Design", price: 8000, user: s1, img: taskImages.design, desc: "Ultra-realistic 3D environments for games, films, or architectural walkthroughs.", features: ["4K Resolution", "Textures & Lighting", "Source Assets"] },
    { title: "I will manage your Instagram & LinkedIn Growth Strategy", cat: "Digital Marketing", price: 5000, user: s2, img: taskImages.marketing, desc: "Full-service social media management to grow your followers and professional network.", features: ["Content Calendar", "Engagement Tracking", "Ad Management"] },
    { title: "I will design a Modern Fintech UI/UX Design System", cat: "Graphic Design", price: 6500, user: s7, img: taskImages.design, desc: "Figma-based design systems for complex financial applications. Clean, secure, and user-friendly.", features: ["Atomic Design", "Prototype", "Developer Handoff"] },
    { title: "I will integrate ChatGPT and OpenAI into your Business", cat: "AI Services", price: 3000, user: s4, img: taskImages.ai, desc: "Automate boring tasks using the power of Generative AI. Custom GPTs for your team.", features: ["Prompt Engineering", "API Integration", "Automated Workflows"] },
    { title: "I will write High-Conversion Facebook and Google Ad Copy", cat: "Writing & Translation", price: 1500, user: s6, img: taskImages.writing, desc: "Short, punchy, and persuasive copy that actually turns clicks into sales.", features: ["A/B Testing", "Multiple Variations", "Targeted Messaging"] },
    { title: "I will perform a Security & Penetration Test for your Web App", cat: "Programming & Tech", price: 9000, user: s3, img: taskImages.programming, desc: "Identify vulnerabilities before hackers do. Full security report and fix suggestions.", features: ["SQL Injection", "XSS Testing", "Full Audit Report"] },
    { title: "I will create AI Generated Concept Art and Backgrounds", cat: "AI Services", price: 800, user: s4, img: taskImages.ai, desc: "Stunning concept art for games, books, or film projects using advanced AI tools.", features: ["Upscaled 4K", "Commercial Rights", "Character Design"] },
    { title: "I will translate your Website into Hindi, Marathi, and Bengali", cat: "Writing & Translation", price: 2000, user: s6, img: taskImages.writing, desc: "Localized translation that respects cultural nuances and professional tone.", features: ["Manual Translation", "Proofreading", "SEO preserving"] },
    { title: "I will build a Custom Shopify E-commerce Store", cat: "Programming & Tech", price: 7500, user: s5, img: taskImages.programming, desc: "Launch your online business with a beautiful, high-converting Shopify theme.", features: ["Payment Setup", "Product Upload", "Theme Customization"] },
  ];

  const tasks = await Promise.all(
    gigTemplates.map((t) =>
      prisma.gig.create({
        data: {
          title: t.title,
          description: t.desc,
          category: t.cat,
          deliveryTime: 5,
          revisions: 3,
          features: t.features,
          price: t.price,
          shortDesc: t.title.substring(0, 50) + "...",
          images: t.img,
          createdBy: { connect: { id: t.user.id } },
        },
      })
    )
  );

  // 3. Create 10+ Completed Orders (Real Revenue & Commissions)
  const orders = await Promise.all([
    prisma.order.create({ data: { paymentIntent: "pi_1", isCompleted: true, price: 1000, earnings: 900, buyerId: b1.id, gigId: tasks[0].id } }),
    prisma.order.create({ data: { paymentIntent: "pi_2", isCompleted: true, price: 5000, earnings: 4500, buyerId: b2.id, gigId: tasks[1].id } }),
    prisma.order.create({ data: { paymentIntent: "pi_3", isCompleted: true, price: 2500, earnings: 2250, buyerId: b3.id, gigId: tasks[4].id } }),
    prisma.order.create({ data: { paymentIntent: "pi_4", isCompleted: true, price: 8000, earnings: 7200, buyerId: b1.id, gigId: tasks[6].id } }),
    prisma.order.create({ data: { paymentIntent: "pi_5", isCompleted: true, price: 3000, earnings: 2700, buyerId: b2.id, gigId: tasks[9].id } }),
  ]);

  // 4. Create 30+ Realistic Reviews
  const reviewPool = [
    "Absolutely exceptional work! The results exceeded my expectations.",
    "Fast delivery and very professional. Highly recommended for any serious project.",
    "Best experience I've had on this platform. Truly top-tier quality.",
    "Very detailed work, took the time to understand my specific needs.",
    "Super impressed with the creative direction. Will definitely hire again!",
    "Reliable, smart, and efficient. 5 stars all the way.",
    "A life-saver for my startup. Very high quality code and design.",
    "The translation was perfect, culturally accurate and professional.",
    "Security audit was thorough. Found things we completely missed.",
    "Best AI artist I've worked with. The prompts are pure magic.",
  ];

  await prisma.reviews.createMany({
    data: tasks.flatMap((task, i) => [
      { rating: 5, comment: reviewPool[i % 10], gigId: task.id, reviewerId: b1.id },
      { rating: 5, comment: reviewPool[(i + 1) % 10], gigId: task.id, reviewerId: b2.id },
      { rating: 4, comment: "Good work, slightly later than expected but quality was there.", gigId: task.id, reviewerId: b3.id },
    ]),
  });

  console.log("✅ Platform Evolution Complete.");
  console.log(`Users: ${users.length} | Gigs: ${tasks.length} | Reviews Generated: ${tasks.length * 3}`);
  console.log("🔑 Demo Login PW: Password@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
