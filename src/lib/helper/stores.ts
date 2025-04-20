import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export const sidebar_collapsed: Writable<boolean> = writable(false);