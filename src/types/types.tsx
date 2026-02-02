export type Page =
  | "about"
  | "contact"
  | "enter"
  | "history"
  | "home"
  | "projects"
  | "skills";

export interface AppStore {
  currentPage: Page;
  firstVisit: boolean;
  disableStrobeEffects: boolean;
}
