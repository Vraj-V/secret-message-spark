
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { createSecretMessage, SecretMessage } from '@/utils/storage';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MessageLink from './MessageLink';
import { toast } from 'sonner';

interface MessageFormProps {
  className?: string;
}

export const MessageForm = ({ className }: MessageFormProps) => {
  const [content, setContent] = useState('');
  const [expiry, setExpiry] = useState('24');
  const [createdMessage, setCreatedMessage] = useState<SecretMessage | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Create a new secret message
      const message = createSecretMessage(content, parseInt(expiry));
      setCreatedMessage(message);
      setContent('');
      toast.success('Secret message created!');
    } catch (error) {
      toast.error('Failed to create message');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
    setCreatedMessage(null);
    setContent('');
  };

  // If a message was created, show the link sharing UI
  if (createdMessage) {
    return (
      <div className={cn('w-full max-w-md mx-auto space-y-6 animate-fade-in', className)}>
        <div className="rounded-lg glass-card p-6 space-y-4">
          <h2 className="text-lg font-medium">Share Your Secret Link</h2>
          <p className="text-sm text-muted-foreground">
            Your message will be available for {expiry} hours or until someone views it.
          </p>
          
          <MessageLink messageId={createdMessage.id} />
          
          <Separator className="my-4" />
          
          <Button 
            onClick={resetForm} 
            variant="outline" 
            className="w-full"
          >
            Create Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('w-full max-w-md mx-auto space-y-6', className)}>
      <div className="rounded-lg glass-card p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="message">Your Secret Message</Label>
          <Textarea
            id="message"
            placeholder="Type your secret message here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[150px] resize-none bg-white/50 dark:bg-gray-900/50 backdrop-blur border-white/20 dark:border-gray-800/30"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expiry">Message Expires After</Label>
          <Select value={expiry} onValueChange={setExpiry}>
            <SelectTrigger id="expiry" className="bg-white/50 dark:bg-gray-900/50 backdrop-blur border-white/20 dark:border-gray-800/30">
              <SelectValue placeholder="Select expiry time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="6">6 hours</SelectItem>
                <SelectItem value="12">12 hours</SelectItem>
                <SelectItem value="24">24 hours</SelectItem>
                <SelectItem value="48">48 hours</SelectItem>
                <SelectItem value="168">7 days</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          type="submit" 
          className="w-full transition-all"
          disabled={isCreating || !content.trim()}
        >
          {isCreating ? 'Creating...' : 'Create Secret Message'}
        </Button>
      </div>
    </form>
  );
};

export default MessageForm;
