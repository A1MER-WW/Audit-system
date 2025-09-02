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

export default function HomeLayout() {
    return (
        <motion.div
            className="flex flex-1 flex-col gap-4 p-4 pt-0"
            initial="hidden"
            animate="visible"
        >
            {/* Navbar */}
            <motion.div
                className='flex items-center justify-between mb-4 mt-4'
                variants={fadeInUp}
            >
                <div className='flex items-center justify-start gap-4'>
                    <Image
                        src="/logo.svg"
                        width={40}
                        height={100}
                        alt="logo"
                    />
                    <span className='text-[#3E52B9]'>สำนักงานเศรษฐกิจการเกษตร</span>
                </div>
                <div className='flex items-center justify-end gap-4 '>
                    <Link href="/">
                        <span>ปฏิบัติงานตรวจสอบ</span>
                    </Link>
                    <Link href="/">
                        <span>บริการให้คำปรึกษา</span>
                    </Link>
                    <Button className=' bg-[#3E52B9] text-white rounded-[125px]'>
                        เข้าสู่ระบบ
                    </Button>
                </div>
            </motion.div>

            {/* Hero Section */}
            <motion.div
                className='flex justify-center mt-20 items-center gap-10'
                variants={fadeInUp}
            >
                <div>
                    <span className="text-2xl flex flex-col">
                        {/* Typing Effect */}
                        <motion.span className="inline-block" variants={container}>
                            {"โครงการพัฒนาระบบสารสนเทศ".split("").map((c, i) => (
                                <motion.span key={i} variants={child} className="inline-block">{c}</motion.span>
                            ))}
                        </motion.span>
                        <motion.span className="inline-block" variants={container}>
                            {"เพื่อเพิ่มประสิทธิภาพงาน".split("").map((c, i) => (
                                <motion.span key={i} variants={child} className="inline-block">{c}</motion.span>
                            ))}
                        </motion.span>
                        <motion.span className="inline-block" variants={container}>
                            {"ด้านการตรวจสอบภายใน".split("").map((c, i) => (
                                <motion.span key={i} variants={child} className="inline-block">{c}</motion.span>
                            ))}
                        </motion.span>
                    </span>

                    <motion.span className="mt-2 block" variants={container}>
                        {"ระบบสนับสนุนการตรวจสอบภายใน".split("").map((c, i) => (
                            <motion.span key={i} variants={child} className="inline-block">{c}</motion.span>
                        ))}
                    </motion.span>

                    <br />
                    <motion.div
                        className="w-full mt-4"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button className="w-42 h-full p-4 bg-[#3E52B9] text-white rounded-[125px]">
                            เข้าสู่ระบบ
                        </Button>
                    </motion.div>
                </div>

                <motion.div variants={fadeInUp}>
                    <Image
                        src="/images/logopage.svg"
                        alt="Hero Image"
                        width={700}
                        height={500}
                    />
                </motion.div>
            </motion.div>

            {/* Cards Section */}
            <motion.div
                className="flex justify-around gap-6 mt-20"
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
                >
                    <Card className="w-full max-w-sm transition-colors duration-300 hover:bg-[#3E52B9] hover:text-white cursor-pointer group">
                        <CardHeader className="flex justify-center">
                            <CardTitle>
                                <SnippetsOutlined className="text-7xl text-gray-700 group-hover:text-white transition-colors duration-300" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <CardTitle className="group-hover:text-white">
                                ปฏิบัติงานตรวจสอบ
                            </CardTitle>
                            <p className="group-hover:text-gray-200">
                                สำหรับเข้าใช้งานระบบปฏิบัติงานตรวจสอบ
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Card 2 */}
                <motion.div
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <Card className="w-full max-w-sm transition-colors duration-300 bg-[#3E52B9] hover:bg-[#3E52B9] hover:text-white cursor-pointer group">
                        <CardHeader className="flex justify-center">
                            <CardTitle>
                                <WechatOutlined className="text-7xl text-[#3E52B9] group-hover:text-white transition-colors duration-300" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <CardTitle className="group-hover:text-white">
                                บริการให้คำปรึกษา
                            </CardTitle>
                            <p className="group-hover:text-gray-200">
                                การให้คำปรึกษาให้กับหน่วยรับตรวจ และแหล่งคลังข้อมูล
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
