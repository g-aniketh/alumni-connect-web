import { Globe } from "lucide-react";
import { useEffect } from "react";

const LanguageBar = () => {
    useEffect(() => {
        const addScript = () => {
            if (!document.getElementById("google-translate-script")) {
                const script = document.createElement("script");
                script.id = "google-translate-script";
                script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
                script.async = true;
                document.body.appendChild(script);
            }
        };

        (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "en,es,fr,de,hi,zh-CN,ar,pt,ja,ko,ru,it,nl,tr,pl,vi,th,id,ms,bn,ta,te,mr,gu,kn,ml,pa",
                    layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
                },
                "google_translate_element"
            );
        };

        addScript();
    }, []);

    return (
        <div className="w-full bg-gray-900 text-white py-2.5 px-4 relative z-[60]">
            <div className="container mx-auto flex items-center justify-between max-w-7xl">
                {/* Welcome Message */}
                <div className="flex items-center gap-2 text-sm font-medium">
                    <span>Welcome to Alumni Connect</span>
                </div>

                {/* Language Selector with Button Style */}
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium hidden sm:inline">Language:</span>
                    <div id="google_translate_element"></div>
                </div>
            </div>

            <style>{`
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        
        body {
          top: 0px !important;
        }
        
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 0px !important;
        }
        
        .goog-te-gadget .goog-te-combo {
          margin: 0px !important;
          padding: 6px 12px !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          border-radius: 6px !important;
          background-color: rgba(255, 255, 255, 0.1) !important;
          color: white !important;
          font-size: 14px !important;
          font-family: inherit !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
        }
        
        .goog-te-gadget .goog-te-combo:hover {
          background-color: rgba(255, 255, 255, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
        }
        
        .goog-te-gadget .goog-te-combo:focus {
          border-color: white !important;
          background-color: rgba(255, 255, 255, 0.15) !important;
          outline: none !important;
        }
        
        .goog-te-gadget .goog-te-combo option {
          background-color: #1f2937 !important;
          color: white !important;
        }
        
        .goog-te-gadget span {
          display: none !important;
        }
        
        @media (max-width: 640px) {
          .goog-te-gadget .goog-te-combo {
            font-size: 13px !important;
            padding: 5px 10px !important;
          }
        }
      `}</style>
        </div>
    );
};

export default LanguageBar;
