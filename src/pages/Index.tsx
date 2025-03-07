
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Confession, addConfession, getConfessions, cleanupExpiredMessages } from '@/utils/storage';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import ConfessionCard from '@/components/ConfessionCard';
import FloatingGradients from '@/components/FloatingGradients';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [confession, setConfession] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load confessions from storage on mount
  useEffect(() => {
    setConfessions(getConfessions());
    
    // Clean up expired messages
    cleanupExpiredMessages();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confession.trim()) {
      toast.error('Please enter your confession');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add the new confession
      const newConfession = addConfession(confession);
      
      // Update the state with the new confession
      setConfessions(prevConfessions => [newConfession, ...prevConfessions]);
      
      // Reset the input
      setConfession('');
      
      toast.success('Confession added successfully');
    } catch (error) {
      toast.error('Failed to add confession');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-12">
      <FloatingGradients />
      <Navbar />
      
      <main className="container px-4 mx-auto max-w-5xl animate-fade-in">
        <section className="py-12 text-center space-y-4">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            Anonymous confessions
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Whisper Your <span className="gradient-text">Secrets</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your thoughts anonymously or send a private message that disappears after being viewed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
            <Button asChild variant="outline" className="w-full sm:w-auto border-white/20 dark:border-gray-800/30">
              <a href="#confess">Share a Confession</a>
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/create" className="inline-flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Create Secret Message
              </Link>
            </Button>
          </div>
        </section>
        
        <Separator className="my-8" />
        
        <section id="confess" className="py-8 grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="sticky top-24 space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">Share Your Confession</h2>
                <p className="text-muted-foreground text-sm">
                  Your confession will be posted anonymously for everyone to see.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea 
                  placeholder="Type your confession here..."
                  value={confession}
                  onChange={(e) => setConfession(e.target.value)}
                  className="min-h-[120px] resize-none bg-white/50 dark:bg-gray-900/50 backdrop-blur border-white/20 dark:border-gray-800/30"
                  required
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting || !confession.trim()}
                >
                  {isSubmitting ? 'Posting...' : 'Post Anonymously'}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="md:col-span-3 space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">Recent Confessions</h2>
              <p className="text-muted-foreground text-sm">
                Read what others have been whispering about.
              </p>
            </div>
            
            {confessions.length > 0 ? (
              <div className="space-y-4">
                {confessions.map((confession) => (
                  <ConfessionCard key={confession.id} confession={confession} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No confessions yet. Be the first to share!</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
