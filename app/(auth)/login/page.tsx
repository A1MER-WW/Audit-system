"use client"
import { LoginForm } from "@/components/login-form"
import { motion } from "framer-motion"

export default function LoginPage() {
  return (
    <motion.div 
      className="grid min-h-svh lg:grid-cols-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Side - Background Image */}
      <motion.div 
        className="relative hidden lg:block bg-[#3E52B9] overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.img
          src="/images/page.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full p-14 object-center dark:brightness-[0.2] dark:grayscale"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div 
        className="flex flex-col gap-4 p-6 md:p-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="flex justify-center gap-2 md:justify-start"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          
        </motion.div>
        
        <motion.div 
          className="flex flex-1 items-center justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div 
            className="w-full max-w-xs"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LoginForm />
          </motion.div>
        </motion.div>
      </motion.div>
      
    </motion.div>
  )
}
