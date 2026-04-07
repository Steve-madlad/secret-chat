import { LoaderCircle, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import BombIcon from '../BombIcon';

export function DestryRoomDialog({
  onDestroyRoom,
  disabled,
  isLoading,
}: {
  onDestroyRoom: () => void;
  disabled: boolean;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setOpen(false);
    }
  }, [isLoading]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger disabled={disabled} asChild>
        <Button className="group align-center disabled:opacty-50 gap-2 rounded bg-[#312226] px-3 py-1 text-xs font-bold text-[#f56565] transition-all hover:bg-red-600 focus-visible:bg-red-600">
          <span className="flex gap-3 text-red-400 duration-150 group-hover:text-white group-focus-visible:text-white">
            <BombIcon className="group-hover:animate-scale-pulse group-focus-visible:animate-scale-pulse -translate-y-px group-hover:fill-black group-focus-visible:fill-black" />{' '}
            Destroy Room
          </span>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border border-zinc-800 bg-zinc-900/50" size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-white">Destroy Conversation?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this chat conversation and the room.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onDestroyRoom();
            }}
            disabled={isLoading}
            className="align-center gap-3"
            variant="destructive"
          >
            Delete {isLoading && <LoaderCircle className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
