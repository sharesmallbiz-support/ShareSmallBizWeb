import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Rss } from "lucide-react";

// Social Media Integration — coming soon.
// The ShareSmallBiz API does not currently expose social media feed endpoints.
// This component is a placeholder preserved for future implementation.
export default function SocialMediaIntegration() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Social Media Hub
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect and showcase your Facebook and YouTube content alongside
            your ShareSmallBiz posts.
          </p>
        </div>

        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Rss className="mr-2 h-5 w-5 text-primary" />
              Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Social media integrations (Facebook, YouTube) will be available
              in a future release. Check back soon!
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
