import { ISubscribedUser } from '@/types/subscription.type';

export function SubscribedUsersView({
  subscriptions,
}: {
  subscriptions: ISubscribedUser[];
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h1 className="text-xl font-semibold">Subscribed users</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Users with their current subscription plans.
      </p>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-3">User</th>
              <th className="py-2 pr-3">Email</th>
              <th className="py-2 pr-3">Plan</th>
              <th className="py-2 pr-3">Status</th>
              <th className="py-2 pr-3">Start</th>
              <th className="py-2 pr-3">End</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((item) => (
              <tr
                key={`${item.userId}-${item.planId}-${item.startDate}`}
                className="border-b"
              >
                <td className="py-2 pr-3">{item.name}</td>
                <td className="py-2 pr-3">{item.email}</td>
                <td className="py-2 pr-3">{item.planName}</td>
                <td className="py-2 pr-3">{item.status}</td>
                <td className="py-2 pr-3">
                  {new Date(item.startDate).toLocaleDateString()}
                </td>
                <td className="py-2 pr-3">
                  {new Date(item.endDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {subscriptions.length === 0 && (
          <p className="text-sm text-muted-foreground py-4">
            No subscribed users found.
          </p>
        )}
      </div>
    </div>
  );
}
