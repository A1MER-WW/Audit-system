import { EngagementPlanProgram } from "./mock-engagement-plan-programs";

const STORAGE_KEY = "engagement_plan_programs";
const AUTO_ID_KEY = "engagement_plan_auto_id";

/**
 * Local Storage utility for Engagement Plan Programs
 */
export class EngagementPlanStorage {
  private static instance: EngagementPlanStorage;

  private constructor() {}

  public static getInstance(): EngagementPlanStorage {
    if (!EngagementPlanStorage.instance) {
      EngagementPlanStorage.instance = new EngagementPlanStorage();
    }
    return EngagementPlanStorage.instance;
  }

  /**
   * Check if we're running in browser environment
   */
  private isClient(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  /**
   * Get all programs from localStorage
   */
  getPrograms(): EngagementPlanProgram[] {
    if (!this.isClient()) return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error reading programs from localStorage:", error);
      return [];
    }
  }

  /**
   * Save programs to localStorage
   */
  savePrograms(programs: EngagementPlanProgram[]): void {
    if (!this.isClient()) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
    } catch (error) {
      console.error("Error saving programs to localStorage:", error);
    }
  }

  /**
   * Get programs filtered by fiscal year
   */
  getProgramsByFiscalYear(fiscalYear: number): EngagementPlanProgram[] {
    const allPrograms = this.getPrograms();
    return allPrograms.filter(program => program.fiscalYear === fiscalYear);
  }

  /**
   * Get a specific program by ID
   */
  getProgram(id: number): EngagementPlanProgram | undefined {
    const programs = this.getPrograms();
    return programs.find(program => program.id === id);
  }

  /**
   * Add a new program
   */
  addProgram(program: Omit<EngagementPlanProgram, "id">): EngagementPlanProgram {
    const programs = this.getPrograms();
    const autoId = this.getNextId();
    
    const newProgram: EngagementPlanProgram = {
      ...program,
      id: autoId
    };

    programs.push(newProgram);
    this.savePrograms(programs);
    this.setNextId(autoId + 1);

    return newProgram;
  }

  /**
   * Update an existing program
   */
  updateProgram(id: number, updates: Partial<Omit<EngagementPlanProgram, "id">>): EngagementPlanProgram | null {
    const programs = this.getPrograms();
    const index = programs.findIndex(program => program.id === id);

    if (index === -1) return null;

    programs[index] = { ...programs[index], ...updates };
    this.savePrograms(programs);

    return programs[index];
  }

  /**
   * Delete a program by ID
   */
  removeProgram(id: number): boolean {
    const programs = this.getPrograms();
    const index = programs.findIndex(program => program.id === id);

    if (index === -1) return false;

    programs.splice(index, 1);
    this.savePrograms(programs);

    return true;
  }

  /**
   * Get the next auto-increment ID
   */
  private getNextId(): number {
    if (!this.isClient()) return Date.now();

    try {
      const stored = localStorage.getItem(AUTO_ID_KEY);
      if (!stored) {
        // Initialize with the highest existing ID + 1
        const programs = this.getPrograms();
        const maxId = programs.length > 0 ? Math.max(...programs.map(p => p.id)) : 0;
        const nextId = maxId + 1;
        this.setNextId(nextId);
        return nextId;
      }
      return parseInt(stored, 10);
    } catch (error) {
      console.error("Error reading auto ID from localStorage:", error);
      return Date.now();
    }
  }

  /**
   * Set the next auto-increment ID
   */
  private setNextId(id: number): void {
    if (!this.isClient()) return;

    try {
      localStorage.setItem(AUTO_ID_KEY, id.toString());
    } catch (error) {
      console.error("Error saving auto ID to localStorage:", error);
    }
  }

  /**
   * Initialize localStorage with default data if empty
   */
  initializeDefaultData(defaultData: EngagementPlanProgram[]): void {
    if (!this.isClient()) return;

    const existingPrograms = this.getPrograms();
    if (existingPrograms.length === 0) {
      this.savePrograms(defaultData);
      const maxId = defaultData.length > 0 ? Math.max(...defaultData.map(p => p.id)) : 0;
      this.setNextId(maxId + 1);
    }
  }

  /**
   * Clear all data (useful for testing or reset functionality)
   */
  clearAll(): void {
    if (!this.isClient()) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(AUTO_ID_KEY);
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }

  /**
   * Export all data (useful for backup)
   */
  exportData(): { programs: EngagementPlanProgram[]; autoId: number } {
    return {
      programs: this.getPrograms(),
      autoId: this.getNextId()
    };
  }

  /**
   * Import data (useful for restore from backup)
   */
  importData(data: { programs: EngagementPlanProgram[]; autoId: number }): void {
    if (!this.isClient()) return;

    this.savePrograms(data.programs);
    this.setNextId(data.autoId);
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): { used: number; available: number; percentage: number } {
    if (!this.isClient()) {
      return { used: 0, available: 0, percentage: 0 };
    }

    try {
      const data = JSON.stringify(this.getPrograms());
      const used = new Blob([data]).size;
      const available = 5 * 1024 * 1024; // Assume 5MB localStorage limit
      const percentage = (used / available) * 100;

      return { used, available, percentage };
    } catch (error) {
      console.error("Error calculating storage stats:", error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

// Export singleton instance
export const engagementPlanStorage = EngagementPlanStorage.getInstance();