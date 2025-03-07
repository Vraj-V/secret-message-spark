
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface MessageLinkProps {
  messageId: string;
  className?: string;
}

export const MessageLink = ({ messageId, className }: MessageLinkProps) => {
  const [copied, setCopied] = useState(false);
  
  // Construct the link to view the message
  const baseUrl = window.location.origin;
  const messageUrl = `${baseUrl}/view/${messageId}`;
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(messageUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
      console.error('Failed to copy: ', err);
    }
  };
  
  return (
    <div className={cn('space-y-3', className)}>
      <p className="text-sm text-muted-foreground">
        Copy this link and share it with someone. The message will be viewable only once.
      </p>
      
      <div className="flex gap-2">
        <Input 
          value={messageUrl}
          readOnly
          className="font-mono text-sm bg-white/50 dark:bg-gray-900/50 backdrop-blur border-white/20 dark:border-gray-800/30"
        />
        
        <Button 
          type="button" 
          size="icon" 
          variant="outline" 
          onClick={copyToClipboard}
          className="shrink-0 border-white/20 dark:border-gray-800/30 hover:bg-primary/10"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageLink;
