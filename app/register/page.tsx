import React from "react";
import { RegistrationForm } from "@/components/register/registration-form";
import { getWebsiteSettings } from "@/lib/directus";

export default async function RegisterPage(): Promise<React.JSX.Element> {
  const websiteSettings = await getWebsiteSettings();
  const title = websiteSettings.register_heading ?? "Registration";
  const intro =
    websiteSettings.register_intro ?? "Tell us about your family. You can add up to three kids.";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">{title}</h1>
      <p className="text-white/90">{intro}</p>
      <RegistrationForm />
    </div>
  );
}
