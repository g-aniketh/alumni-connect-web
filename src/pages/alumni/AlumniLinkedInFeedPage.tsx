import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const ELFSIGHT_SCRIPT_ID = "elfsight-platform-script";
const ELFSIGHT_APP_CLASS = "elfsight-app-9976dddf-b5d2-4251-bce5-efae76dd5b3b";

const AlumniLinkedInFeedPage = () => {
  useEffect(() => {
    // Load elfsight script once
    const existingScript = document.getElementById(ELFSIGHT_SCRIPT_ID);
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      script.id = ELFSIGHT_SCRIPT_ID;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto py-8 space-y-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Alumni LinkedIn Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`${ELFSIGHT_APP_CLASS}`}
              data-elfsight-app-lazy
              aria-label="LinkedIn Feed"
            ></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlumniLinkedInFeedPage;

