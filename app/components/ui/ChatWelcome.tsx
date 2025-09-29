'use client';

import { Scale, MessageSquare, FileText, HelpCircle, Sparkles, Users, Heart } from 'lucide-react';
import { Button } from './Button';

interface ChatWelcomeProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

const SUGGESTED_QUESTIONS = [
  {
    icon: Scale,
    title: "Child Support Rights",
    question: "What are my rights regarding child support in Australia?"
  },
  {
    icon: FileText,
    title: "Property Division",
    question: "How is property divided in an Australian divorce?"
  },
  {
    icon: MessageSquare,
    title: "Parenting Arrangements",
    question: "What should I know about parenting arrangements after divorce?"
  },
  {
    icon: HelpCircle,
    title: "Legal Process",
    question: "What are the steps involved in filing for divorce in Australia?"
  }
];

export function ChatWelcome({ onSendMessage, isLoading }: ChatWelcomeProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-slide-in-up">
      {/* Enhanced Welcome Header */}
      <div className="max-w-lg mb-12">
        {/* Animated Logo */}
        <div className="relative mx-auto mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[rgb(var(--primary))] to-purple-600 rounded-full flex items-center justify-center shadow-xl animate-glow">
            <Scale className="h-10 w-10 text-white animate-float" />
          </div>
          {/* Floating Elements */}
          <Sparkles className="h-4 w-4 text-[rgb(var(--primary))] absolute -top-2 -right-2 animate-pulse" />
          <Users className="h-3 w-3 text-purple-500 absolute -bottom-1 -left-2 animate-pulse" style={{animationDelay: '0.5s'}} />
          <Heart className="h-3 w-3 text-emerald-500 absolute top-2 -left-3 animate-pulse" style={{animationDelay: '1s'}} />
        </div>
        
        <h2 className="text-3xl font-bold mb-4 gradient-text">
          Family Law Assistant
        </h2>
        
        <p className="text-[rgb(var(--muted-foreground))] leading-relaxed text-lg">
          I&apos;m here to help you navigate Australian family law with expertise and compassion. 
          Ask me about divorce proceedings, child support, property division, parenting arrangements, and more.
        </p>
        
        {/* Stats */}
        <div className="flex justify-center gap-8 mt-6 text-sm text-[rgb(var(--muted-foreground))]">
          <div className="text-center">
            <div className="font-semibold text-[rgb(var(--primary))] text-lg">24/7</div>
            <div>Available</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-[rgb(var(--primary))] text-lg">AU</div>
            <div>Law Expert</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-[rgb(var(--primary))] text-lg">Free</div>
            <div>Consultation</div>
          </div>
        </div>
      </div>

      {/* Enhanced Suggested Questions */}
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="h-4 w-4 text-[rgb(var(--primary))] animate-pulse" />
          <p className="text-base font-medium text-[rgb(var(--card-foreground))]">
            Popular Questions
          </p>
          <Sparkles className="h-4 w-4 text-[rgb(var(--primary))] animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SUGGESTED_QUESTIONS.map((suggestion, index) => {
            const Icon = suggestion.icon;
            
            return (
              <Button
                key={index}
                variant="outline"
                onClick={() => onSendMessage(suggestion.question)}
                disabled={isLoading}
                className={`
                  h-auto p-5 text-left justify-start group glass
                  hover:bg-gradient-to-br hover:from-[rgb(var(--primary))]/5 hover:to-purple-600/5
                  hover:border-[rgb(var(--primary))]/50 hover:shadow-lg
                  transition-all duration-300 ease-out
                  hover:scale-105 hover:-translate-y-1
                  animate-slide-in-up
                `}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex items-start gap-4 w-full">
                  <div className={`
                    p-2 rounded-full bg-gradient-to-br shadow-sm
                    transition-all duration-300 group-hover:scale-110
                    ${index === 0 ? 'from-blue-500 to-blue-600' :
                      index === 1 ? 'from-emerald-500 to-emerald-600' :
                      index === 2 ? 'from-purple-500 to-purple-600' :
                      'from-orange-500 to-orange-600'}
                  `}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm mb-2 text-[rgb(var(--card-foreground))] group-hover:text-[rgb(var(--primary))] transition-colors">
                      {suggestion.title}
                    </div>
                    <div className="text-xs text-[rgb(var(--muted-foreground))] leading-relaxed">
                      {suggestion.question}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Enhanced Disclaimer */}
      <div className="mt-12 max-w-2xl">
        <div className="glass rounded-2xl p-6 border border-[rgb(var(--border))]/50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/10 rounded-full">
              <HelpCircle className="h-4 w-4 text-amber-600" />
            </div>
            <div className="text-left">
              <p className="text-xs text-[rgb(var(--muted-foreground))] leading-relaxed">
                <strong className="text-[rgb(var(--card-foreground))]">Legal Disclaimer:</strong> This assistant provides general information about Australian family law and should not be considered as legal advice. 
                For advice specific to your situation, always consult with a qualified family law solicitor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}