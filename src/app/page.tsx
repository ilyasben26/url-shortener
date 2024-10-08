import { SignedOut } from "@clerk/nextjs";
import UrlShortenerContainer from "~/components/url-shortener-container";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-xl py-12 md:py-24 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-bold">URL Shortener</h1>
        <p className="md:text-lg">Shorten your URLs and share them easily</p>
      </div>

      <UrlShortenerContainer />
      <SignedOut>
        <p className="text-center">Please sign up or sign in to shorten URLs</p>
      </SignedOut>
    </main>
  );
}
