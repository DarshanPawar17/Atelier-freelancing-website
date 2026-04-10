import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

// Force load the specific .env file from the server directory
// (In case the process is running from root)
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function checkCloudinary() {
  console.log("🔍 Checking Cloudinary Credentials for:", process.env.CLOUDINARY_CLOUD_NAME);
  try {
    // 1. Ping the API
    const ping = await cloudinary.api.ping();
    
    // 2. Fetch basic usage info to ensure Full Access
    const usage = await cloudinary.api.usage();
    
    console.log("\n✅ SUCCESS: Cloudinary is working perfectly!");
    console.log("📊 Status:", ping.status);
    console.log("☁️  Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
    console.log("✅ Your keys are REAL and ACTIVE.");
  } catch (error) {
    console.log("\n❌ ERROR: Cloudinary credentials failed.");
    console.log("Message:", error.message);
    console.log("Check if your Cloud Name, API Key, and Secret are correct in .env");
  }
}

checkCloudinary();
