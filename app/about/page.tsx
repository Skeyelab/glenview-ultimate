import React from "react";

export default function AboutPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">About Glenview Ultimate</h1>
      <p className="text-white/90">
        The Glenview Ultimate Frisbee Club is a community based & parent run youth sports program in Glenview Illinois. Started in 2026 by Colin Carrigan, his sister, and his father. We teach the basics of Ultimate Frisbee with a heavy emphasis on 'Spirit of The Game'.
      </p>
      
      <section className="space-y-3">
        <h2 className="text-2xl font-bold text-white">What Kids Learn</h2>
        <ul className="list-disc list-inside space-y-2 text-white/90">
          <li>Rules of Ultimate</li>
          <li>Proper way to throw a backhand & forehand</li>
          <li>How to run multiple types of offense & defense</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Team Leadership</h2>
        <div className="grid-2">
          <div className="card">
            <div className="mb-4 h-48 w-full rounded-lg bg-white/10 flex items-center justify-center">
              <p className="text-white/60 text-sm">Photo coming soon</p>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Boys Team Captain</h3>
            <p className="text-white font-medium mb-1">Colin Carrigan</p>
            <p className="text-white/90 mb-3">
              <a href="mailto:Colin@glenview-ultimate.org" className="text-white hover:underline">
                Colin@glenview-ultimate.org
              </a>
            </p>
            <p className="text-white/90">
              Colin Carrigan is a 6th grader at Springman Middle School. Colin is a multi-sport athlete and currently plays AYSO Soccer, Flag Football, Basketball, and Ultimate with The Chicago Union's Elite Frisbee Academy.
            </p>
          </div>

          <div className="card">
            <div className="mb-4 h-48 w-full rounded-lg bg-white/10 flex items-center justify-center">
              <p className="text-white/60 text-sm">Photo coming soon</p>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Girls Team Captain</h3>
            <p className="text-white font-medium mb-1">Riley Carrigan</p>
            <p className="text-white/90 mb-3">
              <a href="mailto:Riley@glenview-ultimate.org" className="text-white hover:underline">
                Riley@glenview-ultimate.org
              </a>
            </p>
            <p className="text-white/90">
              Riley Carrigan is a 5th Grader at Hoffman Elementary School. Riley currently plays Basketball and competes in Silks with the Dance Academy.
            </p>
          </div>

          <div className="card md:col-span-2">
            <div className="mb-4 h-48 w-full rounded-lg bg-white/10 flex items-center justify-center">
              <p className="text-white/60 text-sm">Photo coming soon</p>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Head Coach</h3>
            <p className="text-white font-medium mb-1">Brian Carrigan</p>
            <p className="text-white/90 mb-3">
              <a href="mailto:Brian@glenview-ultimate.org" className="text-white hover:underline">
                Brian@glenview-ultimate.org
              </a>
            </p>
            <p className="text-white/90">
              Brian Carrigan has played ultimate most his life including in college at both The University of Notre Dame and Northwestern. After four seasons of coaching youth soccer with AYSO he discovered a deep passion for coaching youth athletics. Brian loves being out on the field and being part of the team. He loves coaching soccer, but he'd rather be coaching frisbee. So when Colin wanted to start a team, Brian knew he wanted nothing more than to coach it.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
