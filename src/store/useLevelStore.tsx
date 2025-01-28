import { create } from "zustand";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios.config";
import { isAxiosError } from "axios";
import { LevelSetFunction, LevelState } from "@/types/level.types";

const actions = (set: LevelSetFunction) => ({
  addLevel: async (data: Record<string, any>, onSuccess?: () => void) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.post(`/level`, data);
      const level = response?.data?.data;

      console.log("Level Added:", level);

      set((state: LevelState) => ({
        ...state,
        isSubmitting: false,
      }));

      toast.success("Level Added Successfully");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to add level");
      } else {
        toast.error("Failed to add level");
      }
    }
  },

  getLevels: async (params?: Record<string, any>) => {
    set({ isFetching: true });
    try {
      const response = await axiosInstance.get(`/level`, { params });
      const levels = response?.data?.data?.levels;

      console.log("Fetched Levels:", levels);

      set((state: LevelState) => ({
        ...state,
        levels,
        isFetching: false,
      }));
    } catch (error: unknown) {
      console.log(error);
      set({ isFetching: false });
      toast.error("Failed to fetch levels");
    }
  },

  editLevel: async (
    levelId: string,
    data: Record<string, any>,
    onSuccess?: () => void
  ) => {
    set({ isSubmitting: true });
    try {
      const response = await axiosInstance.put(`/level/${levelId}`, data);

      const level = response?.data?.data?.level;

      console.log("Level updated", level);

      set((state: LevelState) => ({
        ...state,
        isSubmitting: false,
      }));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      toast.error("Failed to update level");
    }
  },

  deleteLevel: async (levelId: string, onSuccess?: () => void) => {
    set({ isSubmitting: true });
    try {
      await axiosInstance.delete(`/level/${levelId}`);

      console.log("Level deleted:", levelId);

      set((state: LevelState) => ({
        ...state,
        isSubmitting: false,
      }));

      toast.success("Level deleted successfully.");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      console.log(error);
      set({ isSubmitting: false });
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete level");
      } else {
        toast.error("Failed to delete level");
      }
    }
  },
});

// Create Zustand Store with type checking for state
export const useLevelStore = create<LevelState>((set) => ({
  levels: [],
  isFetching: false,
  isSubmitting: false,
  actions: actions(set),
}));

// Custom hook to access actions from the store
export const useLevelActions = () => useLevelStore((state) => state.actions);
