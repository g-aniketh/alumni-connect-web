import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle } from "lucide-react";
import loginIllustration from "../../assets/login-illustration.png";

interface EyeAnimationProps {
  isSad?: boolean;
  isSuccess?: boolean;
}

export const EyeAnimation: React.FC<EyeAnimationProps> = ({ isSuccess = false }) => {
  return (
    <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative flex flex-col items-center justify-center p-8">
      <img 
        src={loginIllustration}
        alt="Verification Status"
        className={`w-full h-full object-contain transition-opacity duration-500 ${isSuccess ? 'opacity-20 blur-sm' : 'opacity-100'}`}
      />
      
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10"
          >
            <div className="bg-green-100 p-6 rounded-full mb-4">
              <CheckCircle className="w-24 h-24 text-green-600" />
            </div>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-green-700"
            >
              Login Successful!
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
