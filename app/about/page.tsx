import React from "react";
import { getAboutPage, getPeople, getDirectusAssetUrl } from "@/lib/directus";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export default async function AboutPage(): Promise<React.JSX.Element> {
  const aboutPage = await getAboutPage();
  const allPeople = await getPeople();
  
  // Filter people by role
  const boysCaptain = allPeople.find(p => p.role === "Boys Team Captain");
  const girlsCaptain = allPeople.find(p => p.role === "Girls Team Captain");
  const headCoach = allPeople.find(p => p.role === "Head Coach");
  
  const teamMembers = [boysCaptain, girlsCaptain, headCoach].filter(Boolean);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">About Glenview Ultimate</h1>
      
      {aboutPage?.club_description && (
        <p className="text-white/90 whitespace-pre-line">
          {aboutPage.club_description}
        </p>
      )}
      
      {aboutPage?.what_kids_learn && aboutPage.what_kids_learn.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-white">What Kids Learn</h2>
          <ul className="list-disc list-inside space-y-2 text-white/90">
            {aboutPage.what_kids_learn.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {teamMembers.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Team Leadership</h2>
          <div className="grid-2">
            {teamMembers.map((person) => {
              if (!person) return null;
              const photoUrl = getDirectusAssetUrl(person.photo);
              
              return (
                <Card 
                  key={person.id} 
                  className={`bg-white/5 border-white/20 ${person.role === "Head Coach" ? "md:col-span-2" : ""}`}
                >
                  <div className="mb-4 h-48 w-full rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={person.name}
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <p className="text-white/60 text-sm">Photo coming soon</p>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{person.role}</h3>
                  <p className="text-white font-medium mb-1">{person.name}</p>
                  {person.email && (
                    <p className="text-white/90 mb-3">
                      <a href={`mailto:${person.email}`} className="text-white hover:underline">
                        {person.email}
                      </a>
                    </p>
                  )}
                  {person.bio && (
                    <p className="text-white/90 whitespace-pre-line">
                      {person.bio}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
