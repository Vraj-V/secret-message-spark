
export interface Confession {
  id: string;
  content: string;
  createdAt: number;
  expiresAt: number; // For confessions expiration
}

export interface SecretMessage {
  id: string;
  content: string;
  createdAt: number;
  expiresAt: number;
  viewed: boolean;
}

const CONFESSIONS_KEY = 'confessions';
const MESSAGES_KEY = 'secret_messages';

// Helper to generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get all confessions
export const getConfessions = (): Confession[] => {
  const storedConfessions = localStorage.getItem(CONFESSIONS_KEY);
  if (!storedConfessions) return [];
  
  const confessions = JSON.parse(storedConfessions);
  
  // Filter out expired confessions
  const now = Date.now();
  const validConfessions = confessions.filter((confession: Confession) => 
    !confession.expiresAt || confession.expiresAt > now
  );
  
  // Update storage if we filtered out any expired confessions
  if (validConfessions.length !== confessions.length) {
    localStorage.setItem(CONFESSIONS_KEY, JSON.stringify(validConfessions));
  }
  
  return validConfessions;
};

// Add a new confession
export const addConfession = (content: string): Confession => {
  const confessions = getConfessions();
  const newConfession: Confession = {
    id: generateId(),
    content,
    createdAt: Date.now(),
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours expiration
  };
  
  const updatedConfessions = [newConfession, ...confessions];
  localStorage.setItem(CONFESSIONS_KEY, JSON.stringify(updatedConfessions));
  
  return newConfession;
};

// Get all secret messages
export const getSecretMessages = (): SecretMessage[] => {
  const storedMessages = localStorage.getItem(MESSAGES_KEY);
  if (!storedMessages) return [];
  
  // Parse and filter expired messages
  const messages = JSON.parse(storedMessages);
  const now = Date.now();
  const validMessages = messages.filter((message: SecretMessage) => message.expiresAt > now);
  
  // Update storage if we filtered out any expired messages
  if (validMessages.length !== messages.length) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(validMessages));
  }
  
  return validMessages;
};

// Get a single secret message by ID without marking it as viewed
export const getSecretMessage = (id: string): SecretMessage | null => {
  const messages = getSecretMessages();
  const message = messages.find(msg => msg.id === id);
  
  // Check if message exists and is not expired
  if (message && message.expiresAt < Date.now()) {
    // If expired, remove it
    deleteMessage(id);
    return null;
  }
  
  return message || null;
};

// Helper function to delete a message without viewing it
export const deleteMessage = (id: string): void => {
  const messages = getSecretMessages();
  const filteredMessages = messages.filter(msg => msg.id !== id);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(filteredMessages));
};

// Create a new secret message
export const createSecretMessage = (content: string, expiryHours = 24): SecretMessage => {
  const messages = getSecretMessages();
  const newMessage: SecretMessage = {
    id: generateId(),
    content,
    createdAt: Date.now(),
    expiresAt: Date.now() + (expiryHours * 60 * 60 * 1000),
    viewed: false
  };
  
  const updatedMessages = [newMessage, ...messages];
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
  
  return newMessage;
};

// Mark a message as viewed and delete it - only called when explicitly requested
export const viewAndDeleteMessage = (id: string): SecretMessage | null => {
  const messages = getSecretMessages();
  const messageIndex = messages.findIndex(msg => msg.id === id);
  
  if (messageIndex === -1) return null;
  
  const message = messages[messageIndex];
  
  // Check if message is expired
  if (message.expiresAt < Date.now()) {
    // Remove expired message
    messages.splice(messageIndex, 1);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    return null;
  }
  
  // Message exists and is not expired
  const viewedMessage = { ...message, viewed: true };
  
  // Remove the message from storage
  messages.splice(messageIndex, 1);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  
  return viewedMessage;
};

// Clean up expired messages and confessions (call this function periodically)
export const cleanupExpiredMessages = (): void => {
  // Clean up expired messages
  const messages = getSecretMessages();
  const now = Date.now();
  
  const validMessages = messages.filter(msg => msg.expiresAt > now);
  
  if (validMessages.length !== messages.length) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(validMessages));
  }
  
  // Clean up expired confessions
  const confessions = JSON.parse(localStorage.getItem(CONFESSIONS_KEY) || '[]');
  const validConfessions = confessions.filter((confession: Confession) => 
    !confession.expiresAt || confession.expiresAt > now
  );
  
  if (validConfessions.length !== confessions.length) {
    localStorage.setItem(CONFESSIONS_KEY, JSON.stringify(validConfessions));
  }
};
