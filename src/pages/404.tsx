import Link from "next/link";

export default function Custom404() {
  return (
    <section className="min-h-screen w-full bg-black dark:bg-soft-black text-white transition-colors duration-300 ease-in-out flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center py-16 sm:py-20 md:py-24">
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-5xl md:text-6xl font-extrabold text-gray-50 dark:text-white">
              404 | Page Not Found
            </h2>
            <p className="text-base sm:text-lg md:text-xl font-light text-gray-300 dark:text-gray-200">
              Sorry, we couldn’t find that page.
            </p>
          </div>
          <Link
            href={"/"}
            className="text-blue-400 hover:text-blue-500 font-medium text-base underline underline-offset-4 transition-colors duration-300"
          >
            Go Back
          </Link>
        </div>
      </div>
    </section>
  );
}
