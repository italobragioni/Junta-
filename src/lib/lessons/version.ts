/**
 * Version pinning. A lesson session is pinned to the lesson version it began
 * on. Even if an administrator edits and bumps the lesson afterwards, the
 * in-progress session is always graded and rendered against its pinned
 * version (stored on the session and snapshotted in lesson_versions /
 * question_versions).
 */

export interface PinnedSession {
  lessonVersion: number;
}

export interface VersionedLesson {
  version: number;
}

/** The version a started session must be graded against — always the pinned one. */
export function versionToGrade(
  session: PinnedSession,
  _currentLesson: VersionedLesson,
): number {
  return session.lessonVersion;
}
