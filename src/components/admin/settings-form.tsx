"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { saveSettingsAction } from "@/app/admin-actions";
import { Field, Input } from "@/components/ui/form";
import {
  Mail,
  MapPin,
  Phone,
  Building,
  User,
  CreditCard,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import type { SiteSettings } from "@/lib/data/content";
import type { FormState } from "@/lib/validation";

const initialState: FormState = { ok: false };

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState(
    saveSettingsAction,
    initialState,
  );

  return (
    <form action={action} className="space-y-7">
      {state.ok && state.message ? (
        <p className="rounded-lg bg-mint px-4 py-3 text-[12px] font-medium text-moss">
          {state.message}
        </p>
      ) : null}
      {!state.ok && state.message ? (
        <p className="rounded-lg bg-coral/10 px-4 py-3 text-[12px] font-medium text-coral">
          {state.message}
        </p>
      ) : null}

      <section>
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
          Contact details
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Public email" icon={Mail} htmlFor="settingsEmail">
            <Input id="settingsEmail" name="email" type="email" defaultValue={settings.email} />
          </Field>
          <Field label="Head office address" icon={MapPin} htmlFor="settingsAddress">
            <Input id="settingsAddress" name="address" defaultValue={settings.address} />
          </Field>
          <Field label="Primary phone" icon={Phone} htmlFor="settingsPhonePrimary">
            <Input id="settingsPhonePrimary" name="phonePrimary" defaultValue={settings.phonePrimary} />
          </Field>
          <Field label="Secondary phone" icon={Phone} htmlFor="settingsPhoneSecondary">
            <Input id="settingsPhoneSecondary" name="phoneSecondary" defaultValue={settings.phoneSecondary} />
          </Field>
        </div>
      </section>

      <section className="border-t border-line pt-6">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
          Bank &amp; mobile money
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Bank name" icon={Building} htmlFor="settingsBankName">
            <Input id="settingsBankName" name="bankName" defaultValue={settings.bankName} />
          </Field>
          <Field label="Account name" icon={User} htmlFor="settingsBankAccountName">
            <Input id="settingsBankAccountName" name="bankAccountName" defaultValue={settings.bankAccountName} />
          </Field>
          <Field label="Account number" icon={CreditCard} htmlFor="settingsBankAccountNumber">
            <Input id="settingsBankAccountNumber" name="bankAccountNumber" defaultValue={settings.bankAccountNumber} />
          </Field>
          <Field label="MoMo number" icon={Smartphone} htmlFor="settingsMomoNumber">
            <Input id="settingsMomoNumber" name="momoNumber" defaultValue={settings.momoNumber} />
          </Field>
          <Field label="MoMo account name" icon={User} htmlFor="settingsMomoName" className="sm:col-span-2">
            <Input id="settingsMomoName" name="momoName" defaultValue={settings.momoName} />
          </Field>
        </div>
      </section>

      <section className="border-t border-line pt-6">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
          Social links
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Facebook" icon={Mail} htmlFor="settingsFacebook">
            <Input id="settingsFacebook" name="facebook" defaultValue={settings.facebook} />
          </Field>
          <Field label="Instagram" icon={ExternalLink} htmlFor="settingsInstagram">
            <Input id="settingsInstagram" name="instagram" defaultValue={settings.instagram} />
          </Field>
          <Field label="LinkedIn" icon={ExternalLink} htmlFor="settingsLinkedin">
            <Input id="settingsLinkedin" name="linkedin" defaultValue={settings.linkedin} />
          </Field>
          <Field label="WhatsApp link" icon={Phone} htmlFor="settingsWhatsapp">
            <Input id="settingsWhatsapp" name="whatsapp" defaultValue={settings.whatsapp} />
          </Field>
        </div>
      </section>

      <section className="border-t border-line pt-6">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
          SEO &amp; search visibility
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Site title"
            icon={ExternalLink}
            htmlFor="settingsSeoTitle"
            hint="Shown in browser tabs and Google results"
            className="sm:col-span-2"
          >
            <Input
              id="settingsSeoTitle"
              name="seoTitle"
              defaultValue={settings.seoTitle}
            />
          </Field>
          <Field
            label="Site description"
            icon={ExternalLink}
            htmlFor="settingsSeoDescription"
            hint="Shown in Google snippets and social previews"
            className="sm:col-span-2"
          >
            <Input
              id="settingsSeoDescription"
              name="seoDescription"
              defaultValue={settings.seoDescription}
            />
          </Field>
          <Field
            label="Open Graph image path"
            icon={ExternalLink}
            htmlFor="settingsOgImage"
            hint="Relative path like /images/hero-community.jpg"
          >
            <Input
              id="settingsOgImage"
              name="ogImage"
              defaultValue={settings.ogImage}
            />
          </Field>
          <Field
            label="Google site verification"
            icon={ExternalLink}
            htmlFor="settingsGoogleSiteVerification"
            hint="Paste the content value from Google Search Console"
          >
            <Input
              id="settingsGoogleSiteVerification"
              name="googleSiteVerification"
              defaultValue={settings.googleSiteVerification}
            />
          </Field>
        </div>
      </section>

      <section className="border-t border-line pt-6">
        <h2 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
          Notifications
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Admin notification email"
            icon={Mail}
            htmlFor="settingsAdminEmail"
            hint="New form submissions are emailed here when Resend is configured"
          >
            <Input id="settingsAdminEmail" name="adminEmail" type="email" defaultValue={settings.adminEmail} />
          </Field>
        </div>
      </section>

      <div className="flex items-center justify-end border-t border-line pt-5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-emblem px-5 text-[12.5px] font-semibold text-white hover:bg-forest-800 disabled:opacity-60"
        >
          {pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          {pending ? "Saving…" : "Save settings"}
        </button>
      </div>
    </form>
  );
}
