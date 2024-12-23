import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BrainCircuit, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <BrainCircuit className="w-16 h-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">NelsonBot AI</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Empowering medical professionals and students with AI-powered access to
            pediatric knowledge from Nelson's Textbook of Pediatrics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-6">
            <BookOpen className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">For Medical Students</h2>
            <p className="text-muted-foreground mb-4">
              Access verified pediatric knowledge, study materials, and interactive
              learning resources to enhance your medical education.
            </p>
            <Link href="/chat">
              <Button>Start Learning</Button>
            </Link>
          </Card>

          <Card className="p-6">
            <Users className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">For Doctors</h2>
            <p className="text-muted-foreground mb-4">
              Quick access to reference materials, latest updates, and
              comprehensive pediatric information to support your practice.
            </p>
            <Link href="/chat">
              <Button>Access Resources</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}