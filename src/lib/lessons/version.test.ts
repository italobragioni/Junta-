import { describe, expect, it } from "vitest";

import { versionToGrade } from "./version";

describe("versionToGrade", () => {
  it("always uses the session's pinned version, even after a content bump", () => {
    const session = { lessonVersion: 1 };
    expect(versionToGrade(session, { version: 1 })).toBe(1);
    // Admin edits the lesson and bumps it to v2 mid-session:
    expect(versionToGrade(session, { version: 2 })).toBe(1);
  });
});
