'use client';

import React from "react";
import { RegistrationForm } from "@/components/register/registration-form";

export default function RegisterPage(): React.JSX.Element {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Registration</h1>
      <p className="text-white/90">Tell us about your family. You can add up to three kids.</p>
      <RegistrationForm />
    </div>
  );
}
