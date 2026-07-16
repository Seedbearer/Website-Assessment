"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SEED_TYPE_INFO, type SeedType } from "@/lib/assessment-data";

const SEED_TYPES = Object.keys(SEED_TYPE_INFO) as SeedType[];
const SEASONS = ["winter", "thaw", "spring", "summer"];

export default function SubmissionFilterSelects() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <select
        defaultValue={searchParams.get("seedType") || ""}
        onChange={(e) => updateParam("seedType", e.target.value)}
        className="rounded border border-mid-gray bg-off-white px-3 py-1.5 text-sm text-dark-gray"
      >
        <option value="">By seed type</option>
        {SEED_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        defaultValue={searchParams.get("season") || ""}
        onChange={(e) => updateParam("season", e.target.value)}
        className="rounded border border-mid-gray bg-off-white px-3 py-1.5 text-sm capitalize text-dark-gray"
      >
        <option value="">By season</option>
        {SEASONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </>
  );
}
