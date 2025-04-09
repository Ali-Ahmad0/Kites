import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

export let sidebar_collapsed: Writable<Boolean> = writable(false);