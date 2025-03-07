
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SecretMessage, getSecretMessage, viewAndDeleteMessage, cleanupExpiredMessages } from '@/utils/storage';
import CountdownTimer from '@/components/CountdownTimer';
import Navbar from '@/components/Navbar';
import FloatingGradients from '@/components/FloatingGradients';
import { ArrowLeft, Clock, Eye, Lock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const View = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState<SecretMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clean up expired messages
    cleanupExpiredMessages();
    
    if (!id) {
      setError('Invalid message link');
      setIsLoading(false);
      return;
    }
    
    // Small delay to show loading state and prevent race conditions
    const timer = setTimeout(() => {
      try {
        // IMPORTANT: Just check if the message exists first, don't view it yet
        const secretMessage = getSecretMessage(id);
        
        if (!secretMessage) {
          setError('This message has expired or has already been viewed');
          setIsLoading(false);
        } else {
          // Message exists, set it in state but don't mark as viewed yet
          setMessage(secretMessage);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error viewing message:', err);
        setError('Failed to load the message');
        setIsLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleReveal = () => {
    if (!id || !message) return;
    
    // Only now we actually view and delete the message
    try {
      const viewedMessage = viewAndDeleteMessage(id);
      
      if (viewedMessage) {
        setMessage(viewedMessage);
        setIsRevealed(true);
        toast.success('Message revealed! It will now be deleted permanently.');
      } else {
        setError('Message could not be retrieved. It may have expired.');
      }
    } catch (err) {
      console.error('Error revealing message:', err);
      setError('Failed to reveal the message');
    }
  };

  const renderMessageState = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary/50" />
          </div>
          <p className="text-muted-foreground">Retrieving your secret message...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Message Not Available</h2>
          <p className="text-muted-foreground text-center max-w-md">{error}</p>
          <Button onClick={() => navigate('/')} variant="outline" className="mt-4">
            Return Home
          </Button>
        </div>
      );
    }
    
    if (message && !isRevealed) {
      return (
        <div className="flex flex-col items-center space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Someone sent you a secret message</h2>
            <p className="text-muted-foreground">
              This message will disappear forever once you read it.
            </p>
          </div>
          
          <div className="bg-primary/10 rounded-full py-2 px-4 inline-flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">One-time view only</span>
          </div>
          
          <Button 
            onClick={handleReveal} 
            className="mt-4 w-full sm:w-auto animated-border"
            size="lg"
          >
            Reveal Secret Message
          </Button>
          
          <div className="inline-flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <CountdownTimer 
              expiryTimestamp={message.expiresAt} 
              onExpire={() => setError('This message has expired')} 
            />
          </div>
        </div>
      );
    }
    
    if (message && isRevealed) {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-primary/10 rounded-full py-2 px-4 inline-flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Message revealed</span>
          </div>
          
          <div className="glass-card rounded-xl p-6 border-white/20 dark:border-gray-800/30">
            <p className="text-lg leading-relaxed whitespace-pre-wrap">{message.content}</p>
          </div>
          
          <div className="text-center space-y-2 mt-8">
            <p className="text-muted-foreground text-sm">
              This message has been permanently deleted.
            </p>
            <Button 
              onClick={() => navigate('/create')} 
              variant="outline" 
              className="mt-4"
            >
              Create Your Own Secret Message
            </Button>
          </div>
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen pt-16 pb-12">
      <FloatingGradients />
      <Navbar />
      
      <main className="container px-4 mx-auto max-w-2xl">
        <Button 
          variant="ghost" 
          className="mb-8 -ml-2 inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Button>
        
        <div className="py-8 flex flex-col items-center justify-center min-h-[50vh]">
          {renderMessageState()}
        </div>
      </main>
    </div>
  );
};

export default View;
