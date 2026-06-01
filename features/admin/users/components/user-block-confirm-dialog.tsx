import { ShieldAlert, X } from 'lucide-react';

type UserBlockConfirmDialogProps = {
  name: string;
  block: boolean;
  blocking: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function UserBlockConfirmDialog({
  name,
  block,
  blocking,
  onCancel,
  onConfirm,
}: UserBlockConfirmDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border max-w-md w-full mx-4 p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${block ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}
          >
            <ShieldAlert size={24} />
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">
          {block ? 'Block User?' : 'Unblock User?'}
        </h3>
        <p className="text-muted-foreground mb-6 text-sm">
          Are you sure you want to {block ? 'block' : 'unblock'}{' '}
          <span className="font-bold text-foreground">{name}</span>?
          {block && ' They will lose access to the platform.'}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={blocking}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border text-foreground font-medium hover:bg-accent transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={blocking}
            className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors disabled:opacity-70 ${block ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {blocking
              ? 'Please wait…'
              : block
                ? 'Confirm Block'
                : 'Confirm Unblock'}
          </button>
        </div>
      </div>
    </div>
  );
}
