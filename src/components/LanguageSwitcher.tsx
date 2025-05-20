"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LanguageSwitcher() {
  const t = useTranslations("LanguageSwitcher");
  const router = useRouter();
  const { locale, locales, route } = router;

  useEffect(() => {
    if (locale) {
      localStorage.setItem("locale", locale);
      document.cookie = `locale=${locale}; path=/; max-age=7200`;
    }
  }, [locale]);

  const changeLanguageHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLocale = event.target.value;

    localStorage.setItem("locale", selectedLocale);
    document.cookie = `locale=${selectedLocale}; path=/; max-age=7200`;

    router.replace(route, route, { locale: selectedLocale });
  };

  return (
    <select
      defaultValue={locale}
      onChange={changeLanguageHandler}
      id="languages"
      className="bg-soft-black dark:bg-soft-dark rounded-lg border border-gray-800 p-2.5 text-sm text-white focus:border-2 focus:border-yellow-300 focus:ring-yellow-300 focus:outline-none dark:border-gray-700 dark:text-white dark:focus:border-yellow-300 dark:focus:ring-yellow-300"
    >
      <option disabled value="">
        Select Language
      </option>
      {locales?.map((l) => (
        <option key={l} value={l}>
          {t("language", { locale: l })}
        </option>
      ))}
    </select>
  );
}
