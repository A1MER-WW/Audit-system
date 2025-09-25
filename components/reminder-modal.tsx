"use client";

import React, { useState } from "react";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentName: string;
  onSubmit?: (data: { date: string; file?: File }) => void;
}

export default function ReminderModal({ 
  isOpen, 
  onClose, 
  departmentName, 
  onSubmit 
}: ReminderModalProps) {
  const [selectedDate, setSelectedDate] = useState("7 พฤษภาคม 2568");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ 
        date: selectedDate, 
        file: selectedFile || undefined 
      });
    }
    onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            ขยายเวลาการแสดงความเห็นเจ้าบอยและเกณฑ์พิจารณาความเสี่ยง ปีงบประมาณ 2568
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            ขยายเวลาเพื่อให้หน่วยงานได้ส่งเจ้าบอยในการตรวจสอบและแสดงความคิดเห็นได้เพิ่มเติม
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              หน่วยงาน: {departmentName}
            </label>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ขยายเวลาการส่งความเห็นวันที่
            </label>
            <div className="relative">
              <input
                type="text"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              แนบเอกสารหรือหนังสือการยายเวลา
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex space-x-2">
                  <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">XLS</span>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">PDF</span>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">DOC</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-2">อัปโหลดเอกสารสำคัญ</p>
              <p className="text-xs text-gray-400 mb-4">
                คลิกที่นี่เลือกไฟล์เอกสารเพื่อแจ้งไฟล์ที่มีข้อมูลการยิ่นใหลา
              </p>
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
                <button className="px-4 py-2 border border-indigo-300 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors text-sm">
                  เลือกไฟล์เอกสาร
                </button>
              </div>
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-600">
                  ไฟล์ที่เลือก: {selectedFile.name}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}