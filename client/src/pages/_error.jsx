import Link from "next/link";

function CustomError({ statusCode }) {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-[#404145]">{statusCode || "Error"}</h1>
      <p className="mt-3 text-[#62646a]">
        {statusCode
          ? `A server error (${statusCode}) occurred.`
          : "A client-side error occurred."}
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-[#1DBF73] px-5 py-2.5 text-white font-semibold"
      >
        Back to Home
      </Link>
    </main>
  );
}

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default CustomError;
