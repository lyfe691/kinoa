export const CONTACT_TOPICS = {
  general: {
    label: "General Inquiry",
    description: "Questions about Kinoa or general feedback",
  },
  dmca: {
    label: "DMCA / Copyright Notice",
    description: "Report copyright infringement or submit a counter-notice",
  },
  privacy: {
    label: "Privacy & Data Rights",
    description: "Data access, deletion, or other privacy-related requests",
  },
  security: {
    label: "Security Vulnerability",
    description: "Report a security issue or vulnerability",
  },
  account: {
    label: "Account Issue",
    description: "Problems with your account or login",
  },
  feedback: {
    label: "Feedback & Suggestions",
    description: "Share ideas or suggestions for improvement",
  },
} as const;

export type ContactTopic = keyof typeof CONTACT_TOPICS;

export function isValidTopic(
  topic: string | null | undefined,
): topic is ContactTopic {
  return topic != null && topic in CONTACT_TOPICS;
}
