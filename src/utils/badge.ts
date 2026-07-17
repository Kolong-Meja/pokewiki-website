const BADGE_BASE_CLASS =
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset transition-colors duration-300 ease-in-out";

const DEFAULT_BADGE_COLOR =
  "bg-gray-50 text-gray-700 dark:bg-gray-50 dark:text-gray-700 ring-gray-600/10";

const TYPE_BADGE_COLORS: Record<string, string> = {
  fire: "bg-red-100 text-red-600 dark:bg-red-50 dark:text-red-700 ring-red-600/10",
  grass:
    "bg-green-100 text-green-700 dark:bg-green-50 dark:text-green-700 ring-green-600/10",
  water:
    "bg-blue-100 text-blue-600 dark:bg-blue-50 dark:text-blue-700 ring-blue-600/10",
  electric:
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-50 dark:text-yellow-600 ring-yellow-600/10",
  normal:
    "bg-gray-100 text-gray-700 dark:bg-gray-50 dark:text-gray-600 ring-gray-600/10",
  flying:
    "bg-sky-100 text-sky-700 dark:bg-sky-50 dark:text-sky-600 ring-sky-500/10",
  poison:
    "bg-purple-100 text-purple-600 dark:bg-purple-50 dark:text-purple-700 ring-purple-600/10",
  bug: "bg-lime-100 text-lime-700 dark:bg-lime-50 dark:text-lime-700 ring-lime-600/10",
  steel:
    "bg-slate-100 text-slate-600 dark:bg-slate-50 dark:text-slate-700 ring-slate-600/10",
  fighting:
    "bg-amber-100 text-amber-800 dark:bg-amber-50 dark:text-amber-900 ring-amber-600/10",
  ground:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-50 dark:text-yellow-700 ring-yellow-600/10",
  fairy:
    "bg-fuchsia-100 text-fuchsia-400 dark:bg-fuchsia-50 dark:text-fuchsia-400 ring-fuchsia-600/10",
  psychic:
    "bg-pink-100 text-pink-600 dark:bg-pink-50 dark:text-pink-500 ring-pink-600/10",
  ice: "bg-cyan-100 text-cyan-700 dark:bg-cyan-50 dark:text-cyan-600 ring-cyan-600/10",
  rock: "bg-orange-100 text-orange-800 dark:bg-orange-50 dark:text-orange-900 ring-orange-600/10",
  dragon:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-50 dark:text-indigo-600 ring-indigo-600/10",
  ghost:
    "bg-violet-100 text-violet-700 dark:bg-violet-50 dark:text-violet-600 ring-violet-600/10",
  dark: "bg-neutral-200 text-neutral-800 dark:bg-neutral-100 dark:text-neutral-700 ring-neutral-600/10",
};

/** Colors for the 5 Berry flavors (spicy / dry / sweet / bitter / sour). */
const FLAVOR_BADGE_COLORS: Record<string, string> = {
  spicy:
    "bg-red-100 text-red-600 dark:bg-red-50 dark:text-red-700 ring-red-600/10",
  dry: "bg-amber-100 text-amber-700 dark:bg-amber-50 dark:text-amber-800 ring-amber-600/10",
  sweet:
    "bg-pink-100 text-pink-600 dark:bg-pink-50 dark:text-pink-600 ring-pink-600/10",
  bitter:
    "bg-green-100 text-green-700 dark:bg-green-50 dark:text-green-700 ring-green-600/10",
  sour: "bg-sky-100 text-sky-700 dark:bg-sky-50 dark:text-sky-700 ring-sky-500/10",
};

export function getBadgeBaseClass(): string {
  return BADGE_BASE_CLASS;
}

export function getTypeBadgeColor(typeName: string): string {
  return TYPE_BADGE_COLORS[typeName] ?? DEFAULT_BADGE_COLOR;
}

export function getFlavorBadgeColor(flavorName: string): string {
  return FLAVOR_BADGE_COLORS[flavorName] ?? DEFAULT_BADGE_COLOR;
}
