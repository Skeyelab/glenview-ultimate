'use client';

import { useState, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement | string, options: {
        sitekey: string;
        callback?: (token: string) => void;
        'error-callback'?: () => void;
        'expired-callback'?: () => void;
      }) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

interface Child {
  full_name: string;
  age?: string;
  experience?: "beginner" | "intermediate" | "advanced";
  availability?: string[];
}

interface Parent {
  name: string;
  email: string;
  phone: string;
}

export default function RegisterPage() {
  const [parents, setParents] = useState<Parent[]>([{ name: "", email: "", phone: "" }]);
  const [children, setChildren] = useState<Child[]>([{ full_name: "", availability: [] }]);
  const [notes, setNotes] = useState("");
  const [marketing_opt_in, setOptIn] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [errorField, setErrorField] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  const weekdays = ["Mon","Tue","Wed","Thu","Fri"];

  function updateChild(i: number, patch: Partial<Child>) {
    setChildren(prev => prev.map((c, idx) => idx === i ? { ...c, ...patch } : c));
  }

  function addChild() {
    if (children.length >= 3) return;
    setChildren(prev => [...prev, { full_name: "", availability: [] }]);
  }

  function removeChild(i: number) {
    setChildren(prev => prev.filter((_, idx) => idx !== i));
  }

  function updateParent(i: number, patch: Partial<Parent>) {
    setParents(prev => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p));
    // Clear error field if editing the parent that had an error
    if (errorField && patch.email !== undefined) {
      const fieldName = i === 0 ? "parent1_email" : "parent2_email";
      if (errorField === fieldName) {
        setErrorField(null);
      }
    }
  }

  function addParent() {
    if (parents.length >= 2) return;
    setParents(prev => [...prev, { name: "", email: "", phone: "" }]);
  }

  function removeParent(i: number) {
    if (parents.length <= 1) return; // Require at least one parent
    // Clear error field if removing the parent that had an error
    const fieldName = i === 0 ? "parent1_email" : "parent2_email";
    if (errorField === fieldName) {
      setErrorField(null);
    }
    setParents(prev => prev.filter((_, idx) => idx !== i));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    // Only require token if Turnstile is configured
    if (siteKey && !turnstileToken) {
      setStatus("❌ Please complete the verification");
      return;
    }
    setStatus("Submitting...");
    setErrorField(null);
    try {
      // Map parents array to parent1_* and parent2_* fields
      const payload: Record<string, unknown> = {
        children, notes, marketing_opt_in,
        turnstile_token: turnstileToken,
      };

      // Always include parent1 fields (at least one parent required)
      if (parents[0]) {
        payload.parent1_name = parents[0].name;
        payload.parent1_email = parents[0].email;
        payload.parent1_phone = parents[0].phone;
      }

      // Include parent2 fields if second parent exists
      if (parents[1]) {
        payload.parent2_name = parents[1].name;
        payload.parent2_email = parents[1].email;
        payload.parent2_phone = parents[1].phone;
      }

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) {
        // Handle duplicate email error
        if (body?.code === "DUPLICATE_EMAIL" && body?.field) {
          setErrorField(body.field);
        }
        throw new Error(body?.error || "Failed");
      }
      setStatus("✅ Thanks! Your registration was received.");
      setErrorField(null);
      setTurnstileToken(null);
      // Reset Turnstile widget
      if (window.turnstile) {
        window.turnstile.reset();
      }
    } catch (err:any) {
      setStatus("❌ " + err.message);
      // Reset Turnstile on error
      if (window.turnstile) {
        window.turnstile.reset();
        setTurnstileToken(null);
      }
    }
  }

  return (
    <div className="space-y-6">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={() => {
          const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
          if (window.turnstile && turnstileRef.current && siteKey) {
            window.turnstile.render(turnstileRef.current, {
              sitekey: siteKey,
              callback: (token: string) => {
                setTurnstileToken(token);
              },
              'error-callback': () => {
                setTurnstileToken(null);
              },
              'expired-callback': () => {
                setTurnstileToken(null);
              },
            });
          }
        }}
      />
      <h1 className="text-3xl font-bold text-white">Registration</h1>
      <p className="text-white/90">Tell us about your family. You can add up to three kids.</p>

      <form onSubmit={(e) => { e.preventDefault(); void submit(e); }} className="grid gap-6">
        <div className="card grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Parents / Guardians</h2>
            {parents.length < 2 && <button type="button" className="button secondary" onClick={addParent}>+ Add second parent / guardian</button>}
          </div>
          {parents.map((parent, i) => (
            <div key={i} className="border border-white/20 rounded p-3 grid gap-3">
              <div className="grid grid-2">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    className="input"
                    value={parent.name}
                    onChange={e=>{ updateParent(i, { name: e.target.value }); }}
                    required
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    className={`input ${errorField === (i === 0 ? "parent1_email" : "parent2_email") ? "border-red-500" : ""}`}
                    type="email"
                    value={parent.email}
                    onChange={e=>{
                      updateParent(i, { email: e.target.value });
                      const fieldName = i === 0 ? "parent1_email" : "parent2_email";
                      if (errorField === fieldName) setErrorField(null);
                    }}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="label">Cell</label>
                <input
                  className="input"
                  value={parent.phone}
                  onChange={e=>{ updateParent(i, { phone: e.target.value }); }}
                />
              </div>
              {parents.length > 1 && <button type="button" className="button secondary" onClick={()=>{ removeParent(i); }}>Remove</button>}
            </div>
          ))}
        </div>

        <div className="card grid gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Kids</h2>
            {children.length < 3 && <button type="button" className="button secondary" onClick={addChild}>+ Add a child</button>}
          </div>
          {children.map((child, i) => (
            <div key={i} className="border border-white/20 rounded p-3 grid gap-3">
              <div className="grid grid-2">
                <div>
                  <label className="label">Child Full Name</label>
                  <input className="input" value={child.full_name} onChange={e=>{ updateChild(i, { full_name: e.target.value }); }} required />
                </div>
                <div>
                  <label className="label">Age</label>
                  <input className="input" value={child.age||""} onChange={e=>{ updateChild(i, { age: e.target.value }); }} />
                </div>
              </div>
              <div className="grid grid-2">
                <div>
                  <label className="label">Experience</label>
                  <select className="select" value={child.experience||""} onChange={e=>{
                    const {value} = e.target;
                    updateChild(i, { experience: (value === "beginner" || value === "intermediate" || value === "advanced") ? value : undefined });
                  }}>
                    <option value="">Select…</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="label">Availability (check all that apply)</label>
                  <div className="flex gap-3 flex-wrap">
                    {weekdays.map(day => (
                      <label key={day} className="text-sm text-white/90">
                        <input
                          type="checkbox"
                          checked={child.availability?.includes(day) || false}
                          onChange={(e)=>{
                            const current = new Set(child.availability || []);
                            if (e.target.checked) current.add(day); else current.delete(day);
                            updateChild(i, { availability: Array.from(current) });
                          }}
                        />{" "}{day}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              {children.length > 1 && <button type="button" className="button secondary" onClick={()=>{ removeChild(i); }}>Remove</button>}
            </div>
          ))}
        </div>

        <div className="card grid gap-3">
          <label className="label">Notes (optional)</label>
          <textarea className="textarea" rows={4} value={notes} onChange={e=>{ setNotes(e.target.value); }} />
          <label htmlFor="marketing-opt-in" className="text-sm text-white/90 flex items-center gap-2 cursor-pointer">
            <input
              id="marketing-opt-in"
              type="checkbox"
              checked={marketing_opt_in}
              onChange={e=>{ setOptIn(e.target.checked); }}
            />
            I agree to receive updates about the club.
          </label>
        </div>

        <div className="card">
          <label className="label mb-2">Verification</label>
          <div ref={turnstileRef}></div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="button">Submit Registration</button>
          {status && <span className="text-sm text-white/90">{status}</span>}
        </div>
      </form>
    </div>
  );
}
