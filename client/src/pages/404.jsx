import Link from "next/link";

export default function Custom404() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-[#404145]">404</h1>
      <p className="mt-3 text-[#62646a]">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-[#1DBF73] px-5 py-2.5 text-white font-semibold"
      >
        Go to Home
      </Link>
    </main>
  );
}
