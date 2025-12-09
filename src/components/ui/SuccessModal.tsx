import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export const SuccessModal = ({
    isOpen,
    onClose,
    title = "Success!",
    message = "Your action was completed successfully.",
}: SuccessModalProps) => {
    const [showCheck, setShowCheck] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // Delay the check animation slightly for better effect
            const timer = setTimeout(() => setShowCheck(true), 100);
            return () => clearTimeout(timer);
        } else {
            setShowCheck(false);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex flex-col items-center justify-center space-y-4 py-4">
                        {/* Animated Success Icon */}
                        <div
                            className={`transform transition-all duration-500 ${showCheck
                                    ? "scale-100 opacity-100 rotate-0"
                                    : "scale-0 opacity-0 rotate-180"
                                }`}
                        >
                            <div className="relative">
                                {/* Pulsing background circle */}
                                <div className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-75" />

                                {/* Main icon */}
                                <CheckCircle2 className="relative h-20 w-20 text-green-600 dark:text-green-400" />
                            </div>
                        </div>

                        {/* Title with slide-in animation */}
                        <DialogTitle
                            className={`text-2xl font-bold text-center transform transition-all duration-500 delay-100 ${showCheck
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-4 opacity-0"
                                }`}
                        >
                            {title}
                        </DialogTitle>

                        {/* Message with slide-in animation */}
                        <DialogDescription
                            className={`text-center text-base transform transition-all duration-500 delay-200 ${showCheck
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-4 opacity-0"
                                }`}
                        >
                            {message}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {/* Action button with slide-in animation */}
                <div
                    className={`flex justify-center transform transition-all duration-500 delay-300 ${showCheck ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                        }`}
                >
                    <Button
                        onClick={onClose}
                        className="w-full sm:w-auto px-8 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                    >
                        Continue
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
