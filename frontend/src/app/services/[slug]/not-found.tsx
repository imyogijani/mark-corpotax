import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-2xl font-bold mb-4">Service Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The service you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white rounded-full px-6 py-2 font-medium transition-colors">
        <Link href="/services">
          Return to Services
        </Link>
      </Button>
    </div>
  );
}