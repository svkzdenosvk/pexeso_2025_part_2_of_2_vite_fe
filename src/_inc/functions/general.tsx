/**
 * ============================================================================
 * GENERAL UTILITIES
 * ============================================================================
 *
 * This module contains small, reusable helper functions and type guards
 * that are not tied to any specific feature (auth, game logic, etc.).
 *
 * Responsibilities:
 * - Generic algorithms (e.g., shuffle, format time)
 * - DOM utilities (e.g., CSS class toggling)
 * - Type guards for string/number unions and supported languages
 *
 *
 * ============================================================================
 */

import { LANGUAGE_CONFIG } from "@pexeso/lib/i18n/i18n_MySettings";
import type {
 My_Type_Lang
} from "../my_types";
/**
 * Shuffle array using the Fisher–Yates algorithm
 *
 * @param arrayIn - input array
 * @returns a new array with elements randomly shuffled
 */
export function _shuffleArray<T>(arrayIn: T[]): T[] {
  const array = [...arrayIn];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/**
 * Format seconds into string "Xm Ys"
 *
 * @example
 * _myFormatSeconds(125) → "2m 5s"
 */
export function _myFormatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minPart = minutes > 0 ? `${minutes}m ` : "";
  const secPart = `${remainingSeconds}s`;

  return minPart + secPart;
}

/**
 * Toggle between two CSS classes on a given element
 */
export function _myToggle(
  elm: HTMLElement,
  removedClass: string,
  addedClass: string
) {
  elm.classList.add(addedClass);
  elm.classList.remove(removedClass);
}

// -------------------- Type Guards --------------------

/**
 * Type guard for string union types
 */
export function my_Type_Guard_function<My_Type extends string>(
  value: string,
  arr: readonly My_Type[]
): value is My_Type {
  return arr.includes(value as My_Type);
}

/**
 * Type guard for number union types
 */
export function my_Type_Guard_function_number<My_Type extends number>(
  value: number,
  arr: readonly My_Type[]
): value is My_Type {
  return arr.includes(value as My_Type);
}

/**
 * Type guard for validating supported languages
 */
export const my_Type_Guard_function_isValidLang = (
  lang: unknown
): lang is My_Type_Lang => {
  return LANGUAGE_CONFIG.languages.includes(lang as My_Type_Lang);
};

/*-------------------------------------------------------------------------- */
/**
 * Type guard to check if an object matches the shape of `My_Type_User`
 *
 * Validates that the object has the required properties with correct types:
 * - `id` as number
 * - `email` as string
 * - `name` as string
 *
 * Useful for runtime validation of objects coming from external sources
 * (e.g., backend API responses) before storing them in Redux or using them
 * in the UI.
 *
 * @param obj - unknown object to validate
 * @returns boolean indicating if `obj` is a valid `My_Type_User`
 */
import type { My_Type_User } from '@pexeso/_inc/my_types';

export function isLike_My_Type_User(obj: unknown): obj is My_Type_User {
  if (typeof obj !== 'object' || obj === null) return false;

  const maybe = obj as Record<string, unknown>;
  return (
    typeof maybe.id === 'number' &&
    typeof maybe.email === 'string' &&
    typeof maybe.name === 'string'
  );
}