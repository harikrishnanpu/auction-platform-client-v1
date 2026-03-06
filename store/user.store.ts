import { UserInfo } from '@/types/user.type';
import { create } from 'zustand';

interface UserState {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
}

const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export default useUserStore;
