import React from "react";

export default function WhatIsUltimatePage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">What is Ultimate?</h1>
      
      <section className="space-y-4">
        <p className="text-white/90">
          Ultimate, also known as Ultimate Frisbee, is a non-contact team sport played with a flying disc (frisbee). 
          It combines elements of soccer, basketball, and football, emphasizing sportsmanship and fair play through 
          the "Spirit of the Game" philosophy.
        </p>
        
        <p className="text-white/90">
          The sport is played on a field similar to a football field, with end zones at each end. 
          Teams score by catching the disc in the opposing team's end zone. Players cannot run with the disc 
          and must pass it to teammates to advance down the field.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Learn More Through Videos</h2>
        <p className="text-white/90">
          Check out these videos to learn more about Ultimate Frisbee:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Video Placeholder 1 */}
          <div className="card">
            <div className="aspect-video bg-white/10 rounded-lg flex items-center justify-center mb-3">
              <div className="text-center">
                <p className="text-white/60 text-sm">YouTube Video Embed</p>
                <p className="text-white/40 text-xs mt-1">Coming Soon</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Introduction to Ultimate</h3>
            <p className="text-white/80 text-sm">
              A comprehensive introduction to the basics of Ultimate Frisbee
            </p>
          </div>

          {/* Video Placeholder 2 */}
          <div className="card">
            <div className="aspect-video bg-white/10 rounded-lg flex items-center justify-center mb-3">
              <div className="text-center">
                <p className="text-white/60 text-sm">YouTube Video Embed</p>
                <p className="text-white/40 text-xs mt-1">Coming Soon</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Rules of the Game</h3>
            <p className="text-white/80 text-sm">
              Learn the fundamental rules and how the game is played
            </p>
          </div>

          {/* Video Placeholder 3 */}
          <div className="card">
            <div className="aspect-video bg-white/10 rounded-lg flex items-center justify-center mb-3">
              <div className="text-center">
                <p className="text-white/60 text-sm">YouTube Video Embed</p>
                <p className="text-white/40 text-xs mt-1">Coming Soon</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Basic Throwing Techniques</h3>
            <p className="text-white/80 text-sm">
              Master the backhand and forehand throws
            </p>
          </div>

          {/* Video Placeholder 4 */}
          <div className="card">
            <div className="aspect-video bg-white/10 rounded-lg flex items-center justify-center mb-3">
              <div className="text-center">
                <p className="text-white/60 text-sm">YouTube Video Embed</p>
                <p className="text-white/40 text-xs mt-1">Coming Soon</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Spirit of the Game</h3>
            <p className="text-white/80 text-sm">
              Understanding the core values and sportsmanship in Ultimate
            </p>
          </div>
        </div>
      </section>

      <section className="notice">
        <p className="text-white/90 text-sm">
          <strong>Note:</strong> Video content will be added soon. This page is ready to embed YouTube videos 
          using iframe embeds when the video links are available.
        </p>
      </section>
    </div>
  );
}
