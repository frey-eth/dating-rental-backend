/**
 * Event names and payload types for email-related message queue events.
 * Used by auth-service (publisher) and email-service (consumer).
 */

export const EmailEventPatterns = {
  USER_REGISTERED: 'user.registered',
} as const;

export interface UserRegisteredPayload {
  email: string;
  name: string;
  activationToken: string;
}
