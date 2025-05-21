"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db, analytics } from "@/firebase";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { getAllTests } from "@/data/tests";
import { logEvent } from "firebase/analytics";

export default function Home() {
  const TESTS: unknown[] = getAllTests();

  const [stats, setStats] = useState<{ [code: string]: { views: number; likes: number; scraps: number } }>({});
  const [likeClicked, setLikeClicked] = useState<{ [code: string]: boolean }>({});
  const [scrapClicked, setScrapClicked] = useState<{ [code: string]: boolean }>({});

  useEffect(() => {
    async function fetchStats() {
      const updates: { [code: string]: { views: number; likes: number; scraps: number } } = {};
      await Promise.all(
        TESTS.map(async (t) => {
          const test = t as any;
          const ref = doc(db, "testStats", test.docId);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            updates[test.code] = {
              views: data.views ?? test.views,
              likes: data.likes ?? test.likes,
              scraps: data.scraps ?? test.scraps,
            };
          } else {
            updates[test.code] = {
              views: test.views,
              likes: test.likes,
              scraps: test.scraps,
            };
          }
        })
      );
      setStats(updates);
    }
    fetchStats();
  }, [TESTS]);

  const handleLike = async (e: React.MouseEvent, t: any) => {
    e.preventDefault();
    if (likeClicked[t.code]) return;
    setLikeClicked((prev) => ({ ...prev, [t.code]: true }));
    const ref = doc(db, "testStats", t.docId);
    await updateDoc(ref, { likes: increment(1) });
    setStats((prev) => ({ ...prev, [t.code]: { ...prev[t.code], likes: prev[t.code].likes + 1 } }));
  };

  const handleScrap = async (e: React.MouseEvent, t: any) => {
    e.preventDefault();
    if (scrapClicked[t.code]) return;
    setScrapClicked((prev) => ({ ...prev, [t.code]: true }));
    const ref = doc(db, "testStats", t.docId);
    await updateDoc(ref, { scraps: increment(1) });
    setStats((prev) => ({ ...prev, [t.code]: { ...prev[t.code], scraps: prev[t.code].scraps + 1 } }));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">테스트밈</h1>
      <p className="text-gray-600 mb-6">테스트들의 집합소! 다양한 심리테스트와 재미있는 테스트를 한 곳에서 즐겨보세요.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {TESTS.map((t) => {
          const test = t as any;
          return (
            <Link
              key={test.code}
              href={`/detail/${test.code}`}
              onClick={() => {
                if (analytics) logEvent(analytics, "test_enter", { test_code: test.code });
              }}
              className="group block rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="flex flex-col h-full">
                <div className="w-full h-44 bg-pink-100 flex items-center justify-center">
                  <span className="text-5xl">{typeof test.icon === "string" ? test.icon : "🧩"}</span>
                </div>
                <div className="flex-1 flex flex-col p-4">
                  <div className="font-semibold text-base mb-1 group-hover:text-blue-600 transition">{test.title}</div>
                  <div className="text-xs text-gray-500 mb-2 line-clamp-2">{test.description}</div>
                  <div className="flex flex-wrap gap-1 mt-2 mb-2">
                    {test.tags.map((tag: string) => (
                      <span key={tag} className="bg-gray-100 text-gray-500 text-[11px] px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1">
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/></svg>
                      {stats[test.code]?.views?.toLocaleString() ?? test.views}
                    </span>
                    <button className="flex items-center gap-1 hover:text-pink-500" onClick={(e) => handleLike(e, test)} disabled={likeClicked[test.code]}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      좋아요 {stats[test.code]?.likes ?? test.likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500" onClick={(e) => handleScrap(e, test)} disabled={scrapClicked[test.code]}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M6 4a2 2 0 0 0-2 2v14l8-4 8 4V6a2 2 0 0 0-2-2H6Z"/></svg>
                      저장 {stats[test.code]?.scraps ?? test.scraps}
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
