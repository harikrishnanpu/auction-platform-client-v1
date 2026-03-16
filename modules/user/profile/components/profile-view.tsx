'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';
import useUserStore from '@/store/user.store';
import { InfoGroup } from '@/components/ui/info-group/InfoGroup';
import { Button } from '@/components/ui/button';
import { useProfileModalStore } from '@/store/profile-modal.store';

export function ProfileView() {
  const storeUser = useUserStore((state) => state.user);
  const user = storeUser;

  const { openEdit, openPassword } = useProfileModalStore();

  if (!user) {
    return (
      <div className="flex justify-center items-center p-20 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Card className="w-full backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden fade-in relative z-10">
          <CardContent className="w-full p-6  border-border">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 border-b pb-4">
              <Shield className="text-primary h-5 w-5" />
              Personal Information
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="grid gap-y-8 gap-x-6 ">
                  <InfoGroup
                    icon={<Mail className="h-4 w-4" />}
                    label="Email Address"
                    value={user.email}
                  />
                  <InfoGroup
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone Number"
                    value={user.phone || 'Not provided'}
                  />
                  <InfoGroup
                    icon={<MapPin className="h-4 w-4" />}
                    label="Shipping Address"
                    value={user.address || 'Not provided'}
                    fullWidth
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-1">
                  <Button
                    onClick={openEdit}
                    variant="default"
                    className="w-full cursor-pointer"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    onClick={openPassword}
                    variant="default"
                    className="w-full cursor-pointer"
                  >
                    Change Password
                  </Button>
                </div>

                <div className="text-center">
                  <p>Wallet</p>
                  <p>₹ 0.000</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
