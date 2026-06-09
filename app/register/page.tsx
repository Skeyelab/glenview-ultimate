'use client';

import React, { useEffect } from "react";
import { RegistrationForm } from "@/components/register/registration-form";

export default function RegisterPage(): React.JSX.Element {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const track = window.umami?.track;
    if (typeof track === "function") {
      track("registration_form_view");
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Registration</h1>
        <p className="text-white/70 text-lg">Tell us about your family. You can add up to three kids.</p>
      </div>
      <RegistrationForm />
    </div>
  );
}
