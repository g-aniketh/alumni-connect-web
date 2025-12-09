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
    <div className="bg-[#E3F2FD] min-h-screen">
      <style>{`
        /* Custom overrides for Elfsight LinkedIn Feed to match dashboard theme */
        div[class*="eapps-linkedin-feed-posts-item"] {
          transition: transform 0.3s ease, box-shadow 0.3s ease !important;
          border: 1px solid rgba(30, 136, 229, 0.2) !important;
          background-color: #ffffff !important;
          border-radius: 0.5rem !important;
        }
        div[class*="eapps-linkedin-feed-posts-item"]:hover {
          transform: scale(1.02) !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
          z-index: 10;
        }
        div[class*="eapps-linkedin-feed-posts-item-content-text"],
        p[class*="eapps-linkedin-feed-posts-item-content-text"] {
          color: #333333 !important;
          font-family: inherit !important;
        }
        a[class*="eapps-linkedin-feed"] {
          color: #1E88E5 !important;
        }
        div[class*="eapps-linkedin-feed-posts-item-author-name"] {
          color: #1565C0 !important;
        }
      `}</style>
      <div className="container mx-auto py-8 space-y-6">
        <Card className="shadow-sm border-[#1E88E5]/30 bg-white">
          <CardHeader>
            <CardTitle className="text-[#1565C0]">Alumni LinkedIn Feed</CardTitle>
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

