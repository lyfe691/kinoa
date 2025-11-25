export type ProfileRow = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
};

export type AccountProfile = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  email: string;
  initials: string;
};

export function mapRowToProfile(
  row: ProfileRow | null,
  email: string,
  fallbackId: string,
  metadata?: Record<string, unknown>,
): AccountProfile {
  const displayNameFromMetadataCandidates = [
    metadata?.display_name,
    metadata?.full_name,
    metadata?.name,
    metadata?.username,
    metadata?.preferred_username,
    metadata?.nickname,
  ];

  const displayNameFromMetadata =
    displayNameFromMetadataCandidates
      .map((value) => (typeof value === "string" ? value.trim() : ""))
      .find((value) => value.length > 0) ?? null;

  const avatarFromMetadata =
    typeof metadata?.avatar_url === "string" ? metadata.avatar_url : null;

  const displayName =
    row?.display_name ?? displayNameFromMetadata ?? email.split("@")[0];

  // Calculate initials
  const normalizedName = displayName.replace(/\s+/g, " ");
  const initials =
    normalizedName
      .split(/[\s._-]+/)
      .filter(Boolean)
      .map((part) => part[0].toUpperCase())
      .slice(0, 2)
      .join("") ||
    normalizedName.slice(0, 2).toUpperCase() ||
    "U";

  return {
    id: row?.id ?? fallbackId,
    email,
    displayName,
    avatarUrl: row?.avatar_url ?? avatarFromMetadata,
    initials,
  };
}
