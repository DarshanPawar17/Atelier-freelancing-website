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
};

const taskImages = {
  architectural: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
  ],
  brandStrategy: [
    "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80",
  ],
  digitalEngineering: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1556155092-8707de31f9c4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  ],
  studioProduction: [
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  ],
};

async function main() {
  console.log("🚀 Starting Premium Studio Seeding...");

  // Drop current database for fresh state
  await prisma.$runCommandRaw({ dropDatabase: 1 });

  const password = await hash(DEMO_PASSWORD, 10);

  // 1. Create Professional Users
  const [sellerOne, sellerTwo, sellerThree, buyerOne, buyerTwo, buyerThree] =
    await Promise.all([
      prisma.user.create({
        data: {
          email: "ayaan.studio@atelier.x",
          password,
          username: "ayaanstudio",
          fullName: "Ayaan Architectural Studio",
          description: "Premier architectural visualization and state-of-the-art studio briefing.",
          profileImage: profileImages.ayaan,
          isProfileInfoSet: true,
        },
      }),
      prisma.user.create({
        data: {
          email: "sara.strategy@atelier.x",
          password,
          username: "sarastrategy",
          fullName: "Sara Strategy Lab",
          description: "Digital brand strategy and conversion-focused growth marketing.",
          profileImage: profileImages.sara,
          isProfileInfoSet: true,
        },
      }),
      prisma.user.create({
        data: {
          email: "daniel.labs@atelier.x",
          password,
          username: "daniellabs",
          fullName: "Daniel Digital Labs",
          description: "Custom software engineering and scalable technical architecture.",
          profileImage: profileImages.daniel,
          isProfileInfoSet: true,
        },
      }),
      prisma.user.create({
        data: {
          email: "meera.ventures@atelier.x",
          password,
          username: "meera_v",
          fullName: "Meera Ventures",
          description: "Venture capitalist looking for premium design and engineering talent.",
          profileImage: profileImages.meera,
          isProfileInfoSet: true,
        },
      }),
      prisma.user.create({
        data: {
          email: "kabir.ops@atelier.x",
          password,
          username: "kabir_ops",
          fullName: "Kabir Global Operations",
          description: "Operations lead focusing on scalable studio production and workforce.",
          profileImage: profileImages.kabir,
          isProfileInfoSet: true,
        },
      }),
      prisma.user.create({
        data: {
          email: "nisha.creative@atelier.x",
          password,
          username: "nisha_c",
          fullName: "Nisha Creative Agency",
          description: "Agency manager sourcing premium assets for high-budget campaigns.",
          profileImage: profileImages.nisha,
          isProfileInfoSet: true,
        },
      }),
    ]);

  // 2. Create Premium Tasks (Synchronized with Homepage Keywords and Categories)
  const tasks = await Promise.all([
    prisma.gig.create({
      data: {
        title: "I will provide professional Logo Design and Visual Identity",
        description: "Full-scale Logo Design visualization of minimalist creative studios with ultra-realistic cinematic lighting.",
        category: "Graphic Design",
        deliveryTime: 7,
        revisions: 5,
        features: ["4k Cinematic Renders", "Day/Night Lighting", "Source Logo Files", "popular", "architectural"],
        price: 599,
        shortDesc: "Premium Logo Design & Visual Identity - popular choice",
        images: taskImages.architectural,
        createdBy: { connect: { id: sellerOne.id } },
      },
    }),
    prisma.gig.create({
      data: {
        title: "I will build a Social Media and Digital Marketing Strategy",
        description: "Deep-dive Social Media brand identity board including core values, visual direction, and market positioning.",
        category: "Digital Marketing",
        deliveryTime: 10,
        revisions: 3,
        features: ["Social Media Strategy", "Market Analysis", "Visual Direction Board", "popular", "branding"],
        price: 849,
        shortDesc: "Elite Digital Marketing & Social Media - popular choice",
        images: taskImages.brandStrategy,
        createdBy: { connect: { id: sellerTwo.id } },
      },
    }),
    prisma.gig.create({
      data: {
        title: "I will develop enterprise Wordress and Web Architecture",
        description: "Scalable, high-performance Wordpress dashboards and design systems built with React and Next.js.",
        category: "Programming & Tech",
        deliveryTime: 14,
        revisions: 5,
        features: ["Wordpress Clean Architecture", "Unit Testing", "Figma to Code", "popular", "engineering"],
        price: 1599,
        shortDesc: "Custom Wordpress Software Engineering - popular choice",
        images: taskImages.digitalEngineering,
        createdBy: { connect: { id: sellerThree.id } },
      },
    }),
    prisma.gig.create({
      data: {
        title: "I will coordinate Ai Artists and Creative Studio Production",
        description: "Professional Ai Artists project management for collaborative digital campaigns and studio workflows.",
        category: "Business",
        deliveryTime: 5,
        revisions: 2,
        features: ["Ai Artists Milestone Planning", "Asset Tracking", "Collaborative Management", "popular", "production"],
        price: 399,
        shortDesc: "Creative Ai Artists Studio Production - popular choice",
        images: taskImages.studioProduction,
        createdBy: { connect: { id: sellerOne.id } },
      },
    }),
    prisma.gig.create({
        data: {
          title: "I will provide professional SEO and Search Logic strategy",
          description: "Comprehensive SEO search logic for modern studio projects and digital legacies.",
          category: "Digital Marketing",
          deliveryTime: 5,
          revisions: 2,
          features: ["SEO Strategy", "Keyword Analysis", "popular", "marketing"],
          price: 299,
          shortDesc: "Premium SEO & Search Logic strategy - popular choice",
          images: taskImages.brandStrategy,
          createdBy: { connect: { id: sellerTwo.id } },
        },
      }),
  ]);

  // 3. Create Orders (Collaborations)
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        paymentIntent: "pi_seed_atelier_101",
        isCompleted: true,
        price: Math.round(tasks[0].price),
        buyer: { connect: { id: buyerOne.id } },
        gig: { connect: { id: tasks[0].id } },
      },
    }),
    prisma.order.create({
      data: {
        paymentIntent: "pi_seed_atelier_102",
        isCompleted: true,
        price: Math.round(tasks[1].price),
        buyer: { connect: { id: buyerTwo.id } },
        gig: { connect: { id: tasks[1].id } },
      },
    }),
  ]);

  // 4. Create Professional Reviews
  await prisma.reviews.createMany({
    data: [
      {
        rating: 5,
        comment: "Absolutely stunning visualization. The 4K renders are beyond exceptional. A true мастер of the atelier.",
        gigId: tasks[0].id,
        reviewerId: buyerOne.id,
      },
      {
        rating: 5,
        comment: "The brand strategy was incredibly deep and insightful. Our positioning has never been clearer.",
        gigId: tasks[1].id,
        reviewerId: buyerTwo.id,
      },
    ],
  });

  // 5. Create Threaded Messages
  await prisma.messages.createMany({
    data: [
      {
        text: "The first architectural draft is ready. Please review the workspace lighting.",
        senderId: sellerOne.id,
        receiverId: buyerOne.id,
        orderId: orders[0].id,
        isRead: true,
      },
      {
        text: "This lighting matches our studio vision perfectly. Proceed with the final 4K renders.",
        senderId: buyerOne.id,
        receiverId: sellerOne.id,
        orderId: orders[0].id,
        isRead: true,
      },
    ],
  });

  console.log("✅ Atelier Seeding Complete.");
  console.log(`Users: 6 | Tasks: ${tasks.length} | Collaborations: ${orders.length}`);
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
