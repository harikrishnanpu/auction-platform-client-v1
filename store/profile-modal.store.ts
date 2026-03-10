import { create } from 'zustand';

type ProfileModalState = {
  editOpen: boolean;
  passwordOpen: boolean;
  openEdit: () => void;
  closeEdit: () => void;
  openPassword: () => void;
  closePassword: () => void;
};

export const useProfileModalStore = create<ProfileModalState>((set) => ({
  editOpen: false,
  passwordOpen: false,

  openEdit: () => set({ editOpen: true }),
  closeEdit: () => set({ editOpen: false }),

  openPassword: () => set({ passwordOpen: true }),
  closePassword: () => set({ passwordOpen: false }),
}));
