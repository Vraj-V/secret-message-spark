
export interface Confession {
  id: string;
  content: string;
  createdAt: number;
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
  return JSON.parse(storedConfessions);
};

// Add a new confession
export const addConfession = (content: string): Confession => {
  const confessions = getConfessions();
  const newConfession: Confession = {
    id: generateId(),
    content,
    createdAt: Date.now()
  };
  
  const updatedConfessions = [newConfession, ...confessions];
  localStorage.setItem(CONFESSIONS_KEY, JSON.stringify(updatedConfessions));
  
  return newConfession;
};

// Get all secret messages
export const getSecretMessages = (): SecretMessage[] => {
  const storedMessages = localStorage.getItem(MESSAGES_KEY);
  if (!storedMessages) return [];
  return JSON.parse(storedMessages);
};

// Get a single secret message by ID
export const getSecretMessage = (id: string): SecretMessage | null => {
  const messages = getSecretMessages();
  const message = messages.find(msg => msg.id === id);
  return message || null;
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

// Mark a message as viewed and delete it
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

// Clean up expired messages (call this function periodically)
export const cleanupExpiredMessages = (): void => {
  const messages = getSecretMessages();
  const now = Date.now();
  
  const validMessages = messages.filter(msg => msg.expiresAt > now);
  
  if (validMessages.length !== messages.length) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(validMessages));
  }
};
