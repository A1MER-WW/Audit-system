import { useState, useEffect } from "react";
import { engagementPlanStorage } from "@/lib/engagement-plan-storage";
import { EngagementPlanProgram } from "@/lib/mock-engagement-plan-programs";

export interface StorageStats {
  used: number;
  available: number;
  percentage: number;
  formattedUsed: string;
  formattedAvailable: string;
}

export interface EngagementPlanStorageData {
  programs: EngagementPlanProgram[];
  autoId: number;
}

/**
 * Hook for managing localStorage operations for Engagement Plan
 */
export function useEngagementPlanStorage() {
  const [storageStats, setStorageStats] = useState<StorageStats>({
    used: 0,
    available: 0,
    percentage: 0,
    formattedUsed: "0 B",
    formattedAvailable: "0 B",
  });

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const updateStorageStats = () => {
    const stats = engagementPlanStorage.getStorageStats();
    setStorageStats({
      ...stats,
      formattedUsed: formatBytes(stats.used),
      formattedAvailable: formatBytes(stats.available),
    });
  };

  useEffect(() => {
    updateStorageStats();
  }, []);

  const clearAllData = async (): Promise<void> => {
    try {
      engagementPlanStorage.clearAll();
      updateStorageStats();
    } catch (error) {
      console.error("Error clearing storage:", error);
      throw error;
    }
  };

  const exportData = async (): Promise<EngagementPlanStorageData> => {
    try {
      return engagementPlanStorage.exportData();
    } catch (error) {
      console.error("Error exporting data:", error);
      throw error;
    }
  };

  const importData = async (data: EngagementPlanStorageData): Promise<void> => {
    try {
      engagementPlanStorage.importData(data);
      updateStorageStats();
    } catch (error) {
      console.error("Error importing data:", error);
      throw error;
    }
  };

  const downloadBackup = () => {
    try {
      const data = engagementPlanStorage.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `engagement-plan-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading backup:", error);
      throw error;
    }
  };

  const restoreFromFile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as EngagementPlanStorageData;
          
          // Validate data structure
          if (!data.programs || !Array.isArray(data.programs)) {
            throw new Error("Invalid backup file format");
          }
          
          await importData(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const resetToDefaults = async (): Promise<void> => {
    try {
      engagementPlanStorage.clearAll();
      // The hook will reinitialize with default data on next fetch
      updateStorageStats();
    } catch (error) {
      console.error("Error resetting to defaults:", error);
      throw error;
    }
  };

  return {
    storageStats,
    updateStorageStats,
    clearAllData,
    exportData,
    importData,
    downloadBackup,
    restoreFromFile,
    resetToDefaults,
  };
}

/**
 * Hook for real-time monitoring of localStorage changes
 */
export function useEngagementPlanStorageMonitor() {
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    const checkStorageAvailability = () => {
      try {
        const testKey = "__storage_test__";
        localStorage.setItem(testKey, "test");
        localStorage.removeItem(testKey);
        setIsStorageAvailable(true);
        setLastError(null);
      } catch (error) {
        setIsStorageAvailable(false);
        setLastError(error instanceof Error ? error.message : "Storage not available");
      }
    };

    // Check initially
    checkStorageAvailability();

    // Check periodically
    const interval = setInterval(checkStorageAvailability, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    isStorageAvailable,
    lastError,
  };
}