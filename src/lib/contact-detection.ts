// Contact Information Detection Utility
// Protects premium membership by detecting phone numbers and contact info in messages

/**
 * Detects various formats of phone numbers in text
 * Patterns covered:
 * - 10 digits: 9876543210
 * - With country code: +919876543210, 919876543210
 * - With separators: 987-654-3210, 987.654.3210, 987 654 3210
 * - Formatted: (987) 654-3210
 */
export function detectPhoneNumber(text: string): boolean {
  if (!text) return false;

  const phonePatterns = [
    // Indian mobile numbers (10 digits starting with 6-9)
    /\b[6-9]\d{9}\b/,

    // With +91 country code
    /\+91[\s-]?[6-9]\d{9}\b/,

    // With 91 country code (without +)
    /\b91[\s-]?[6-9]\d{9}\b/,

    // With various separators
    /\b[6-9]\d{2}[\s.-]\d{3}[\s.-]\d{4}\b/,

    // Formatted with parentheses
    /\(\d{3}\)[\s.-]?\d{3}[\s.-]?\d{4}\b/,

    // Multiple digits in sequence (10 or more)
    /\b\d{10,}\b/,
  ];

  return phonePatterns.some(pattern => pattern.test(text));
}

/**
 * Detects email addresses in text
 */
export function detectEmail(text: string): boolean {
  if (!text) return false;

  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  return emailPattern.test(text);
}

/**
 * Detects WhatsApp mentions
 */
export function detectWhatsApp(text: string): boolean {
  if (!text) return false;

  const whatsappPatterns = [
    /whatsapp/i,
    /\bwa\b/i,
    /\bwapp\b/i,
    /what'?s?app/i,
  ];

  return whatsappPatterns.some(pattern => pattern.test(text));
}

/**
 * Detects social media handles
 */
export function detectSocialMedia(text: string): boolean {
  if (!text) return false;

  const socialPatterns = [
    /instagram/i,
    /facebook/i,
    /\btelegram\b/i,
    /\btwitter\b/i,
    /\blinkedin\b/i,
    /@\w+/,  // @handles
  ];

  return socialPatterns.some(pattern => pattern.test(text));
}

/**
 * Detects any contact information in text
 * Returns detailed information about what was detected
 */
export function detectContactInfo(text: string): {
  hasContact: boolean;
  types: string[];
  severity: 'low' | 'medium' | 'high';
} {
  const detections: string[] = [];

  if (detectPhoneNumber(text)) {
    detections.push('phone number');
  }

  if (detectEmail(text)) {
    detections.push('email address');
  }

  if (detectWhatsApp(text)) {
    detections.push('WhatsApp');
  }

  if (detectSocialMedia(text)) {
    detections.push('social media');
  }

  let severity: 'low' | 'medium' | 'high' = 'low';

  if (detections.length === 0) {
    severity = 'low';
  } else if (detections.includes('phone number') || detections.includes('email address')) {
    severity = 'high';
  } else {
    severity = 'medium';
  }

  return {
    hasContact: detections.length > 0,
    types: detections,
    severity,
  };
}

/**
 * Get warning message based on detected contact types
 */
export function getContactWarningMessage(types: string[]): string {
  if (types.length === 0) return '';

  const typeList = types.join(', ');

  return `⚠️ Detected ${typeList} in your message. For your safety and to maintain platform integrity, please use our chat system for communication. Direct contact sharing may violate our terms of service.`;
}

/**
 * Get blocking message (stricter warning)
 */
export function getContactBlockMessage(types: string[]): string {
  if (types.length === 0) return '';

  return `🚫 This message contains contact information (${types.join(', ')}) and cannot be sent. Please use our secure chat system for all communication. Our premium members get verified seller contacts.`;
}
