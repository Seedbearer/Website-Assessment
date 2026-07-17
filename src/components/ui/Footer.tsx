export default function Footer() {
  return (
    <footer className="border-t border-mid-gray bg-off-white">
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="font-lora text-lg text-soil">Seedbearer Family</span>
          {/* TODO: Instagram is still a placeholder — replace once the client provides it */}
          <div className="flex gap-6 text-sm text-bark">
            <a href="https://www.youtube.com/@SeedBearerFamily" className="hover:text-soil transition">
              YouTube
            </a>
            <a href="https://instagram.com" className="hover:text-soil transition">
              Instagram
            </a>
          </div>
          {/* TODO: confirm exact disclaimer wording — no reference doc supplied one */}
          <p className="max-w-2xl text-xs text-dark-gray">
            Seedbearer Family offers coaching and educational content. It is not a substitute for
            medical, psychological, or clinical care. If you or a family member is in crisis, please
            contact a licensed professional or emergency services.
          </p>
          <p className="text-xs text-dark-gray">
            &copy; {new Date().getFullYear()} Seedbearer Family. All rights reserved.
          </p>
          <a href="/login" className="text-xs text-bark underline hover:text-soil transition">
            Family / Personal Dashboard Sign In
          </a>
        </div>
      </div>
    </footer>
  );
}
