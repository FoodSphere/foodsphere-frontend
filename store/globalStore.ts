import { create } from "zustand";

type GlobalStore = {
  loading: { value: boolean; count: number };
  setLoading: (loading: boolean) => void;

  currentStep: number;
  setCurrentStep: (step: number) => void;
  handleNextStep: () => void;
  handleBackStep: () => void;
};

export const useGlobalStore = create<GlobalStore>((set, get) => ({
  loading: { value: false, count: 0 },
  setLoading: (loading: boolean) => {
    const loadingData = get().loading;
    const { count } = loadingData;
    const countCal = loading ? count + 1 : count - 1;
    const valueCal = countCal > 0 ? true : false;
    set({ loading: { value: valueCal, count: countCal } });
  },

  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
  handleNextStep: () =>
    set((state) => ({ currentStep: state.currentStep + 1 })),
  handleBackStep: () =>
    set((state) => ({ currentStep: state.currentStep - 1 })),
}));
