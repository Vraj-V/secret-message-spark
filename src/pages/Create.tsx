
import React from 'react';
import Navbar from '@/components/Navbar';
import MessageForm from '@/components/MessageForm';
import FloatingGradients from '@/components/FloatingGradients';
import { Shield } from 'lucide-react';
import { cleanupExpiredMessages } from '@/utils/storage';

const Create = () => {
  // Clean up expired messages when this page loads
  React.useEffect(() => {
    cleanupExpiredMessages();
  }, []);

  return (
    <div className="min-h-screen pt-16 pb-12">
      <FloatingGradients />
      <Navbar />
      
      <main className="container px-4 mx-auto animate-fade-in">
        <section className="py-12 text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            One-time view only
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Create a <span className="gradient-text">Secret Message</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Write a message that can only be viewed once before it disappears forever.
          </p>
        </section>
        
        <section className="py-8">
          <MessageForm />
          
          <div className="mt-12 max-w-lg mx-auto space-y-6 rounded-xl glass-card p-6">
            <div className="flex items-center gap-3">
              <Shield className="text-primary h-5 w-5" />
              <h3 className="text-lg font-medium">How Secret Messages Work</h3>
            </div>
            
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">•</span>
                <span>Each message can only be viewed once before it's permanently deleted.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">•</span>
                <span>Messages automatically expire after the selected time period if not viewed.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">•</span>
                <span>Share the unique link with anyone you want to receive your message.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">•</span>
                <span>For enhanced privacy, messages are stored only on your device for this demo.</span>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Create;
