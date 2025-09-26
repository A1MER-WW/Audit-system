"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import { SnippetsOutlined, WechatOutlined } from '@ant-design/icons'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { motion } from "framer-motion"
import { easeInOut } from "framer-motion";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeInOut } },
}

const container = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 },
    },
};

const child = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
};

const lineContainer = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.8 }, // delay between lines
    },
};

export default function HomeLayout() {
    return (
        <motion.div
            className="flex flex-1 flex-col gap-4 p-2 md:p-4 pt-0 min-h-screen"
            initial="hidden"
            animate="visible"
        >
            {/* Navbar */}
            <motion.div
                className='flex flex-col md:flex-row items-center justify-between mb-4 mt-4 gap-4'
                variants={fadeInUp}
            >
                <div className='flex items-center justify-start gap-4'>
                    <Image
                        src="/logo.svg"
                        width={40}
                        height={100}
                        alt="logo"
                    />
                    <span className='text-[#3E52B9] text-sm md:text-base'>สำนักงานเศรษฐกิจการเกษตร</span>
                </div>
                <div className='flex items-center justify-end gap-2 md:gap-4 text-sm md:text-base'>
                    <Link href="/">
                        <span className="hover:text-[#3E52B9] transition-colors">ปฏิบัติงานตรวจสอบ</span>
                    </Link>
                    <Link href="/">
                        <span className="hover:text-[#3E52B9] transition-colors">บริการให้คำปรึกษา</span>
                    </Link>
                    <Link href="/login">
                      <Button className='bg-[#3E52B9] text-white rounded-[125px] px-4 py-2 text-sm md:text-base'>
                        เข้าสู่ระบบ
                    </Button>
                    </Link>
                  
                </div>
            </motion.div>

            {/* Hero Section */}
            <motion.div
                className='flex flex-col lg:flex-row justify-center mt-10 md:mt-20 items-center gap-6 lg:gap-10 px-4'
                variants={fadeInUp}
            >
                <div className="text-center lg:text-left max-w-xl">
                    <motion.span className="flex flex-col" variants={lineContainer}>
                        {/* Typing Effect */}
                        <motion.span className="inline-block text-xl md:text-2xl lg:text-3xl" variants={container}>
                            {"โครงการพัฒนาระบบสารสนเทศ".split("").map((c, i) => (
                                <motion.span key={i} variants={child} className="inline-block">{c}</motion.span>
                            ))}
                        </motion.span>
                        <motion.span className="inline-block text-xl md:text-2xl lg:text-3xl" variants={container}>
                            {"เพื่อเพิ่มประสิทธิภาพงาน".split("").map((c, i) => (
                                <motion.span key={i} variants={child} className="inline-block">{c}</motion.span>
                            ))}
                        </motion.span>
                        <motion.span className="inline-block text-xl md:text-2xl lg:text-3xl" variants={container}>
                            {"ด้านการตรวจสอบภายใน".split("").map((c, i) => (
                                <motion.span key={i} variants={child} className="inline-block">{c}</motion.span>
                            ))}
                        </motion.span>

                        <motion.span className="inline-block text-lg md:text-xl lg:text-2xl mt-2" variants={container} >
                        {"ระบบสนับสนุนการตรวจสอบภายใน".split("").map((c, i) => (
                            <motion.span key={i} variants={child} className="inline-block">{c}</motion.span>
                        ))}
                    </motion.span>
                    </motion.span>

                    <br />
                    <motion.div
                        className="w-full mt-4 flex justify-center lg:justify-start"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                       <Link href="/login">
                           <Button className="w-auto px-6 py-3 bg-[#3E52B9] text-white rounded-[125px] text-sm md:text-base">
                               เข้าสู่ระบบ
                           </Button>
                       </Link>
                    </motion.div>
                </div>

                <motion.div variants={fadeInUp} className="flex-shrink-0">
                    <Image
                        src="/images/logopage.svg"
                        alt="Hero Image"
                        width={500}
                        height={350}
                        className="w-full max-w-md md:max-w-lg lg:max-w-xl"
                    />
                </motion.div>
            </motion.div>

            {/* Cards Section */}
            <motion.div
                className="flex flex-col md:flex-row justify-center md:justify-around gap-6 mt-10 md:mt-20 px-4"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.2 }
                    }
                }}
            >
                {/* Card 1 */}
                <motion.div
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-full max-w-sm mx-auto"
                >
                    <Link href="/login">
                    <Card className="w-full transition-colors duration-300 hover:bg-[#3E52B9] hover:text-white cursor-pointer group h-full">
                        <CardHeader className="flex justify-center">
                            <CardTitle>
                                <SnippetsOutlined className="text-5xl md:text-7xl text-gray-700 group-hover:text-white transition-colors duration-300" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <CardTitle className="group-hover:text-white text-lg md:text-xl mb-2">
                                ปฏิบัติงานตรวจสอบ
                            </CardTitle>
                            <p className="group-hover:text-gray-200 text-sm md:text-base">
                                สำหรับเข้าใช้งานระบบปฏิบัติงานตรวจสอบ
                            </p>
                        </CardContent>
                    </Card>
                    </Link>
                </motion.div>

                {/* Card 2 */}
                <motion.div
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-full max-w-sm mx-auto"
                >
                    <Link href="/consult-system">
                    <Card className="w-full transition-colors duration-300 bg-[#E6EFFF] hover:bg-[#3E52B9] hover:text-white cursor-pointer group h-full">
                        <CardHeader className="flex justify-center">
                            <CardTitle>
                                <WechatOutlined className="text-5xl md:text-7xl text-[#3E52B9] group-hover:text-white transition-colors duration-300" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <CardTitle className="group-hover:text-white text-lg md:text-xl mb-2">
                                บริการให้คำปรึกษา
                            </CardTitle>
                            <p className="group-hover:text-gray-200 text-sm md:text-base">
                                การให้คำปรึกษาให้กับหน่วยรับตรวจ และแหล่งคลังข้อมูล
                            </p>
                        </CardContent>
                    </Card>
                    </Link>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
