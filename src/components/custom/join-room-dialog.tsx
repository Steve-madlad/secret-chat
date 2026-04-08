import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export function JoinRoomDialog() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRoomId(value);
    if (value.length > 0 && value.length !== 21) {
      setError('Room ID must be exactly 21 characters long.');
    } else {
      setError('');
    }
  };

  const handleJoin = () => {
    if (roomId.length !== 21) {
      setError('Please enter a valid Room ID.');
      return;
    }
    setError('');
    setOpen(false);
    router.push(`/room/${roomId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="mt-2 w-full gap-3 bg-zinc-800 p-3 py-5 text-sm font-bold text-zinc-100 transition-colors hover:bg-zinc-700 hover:text-zinc-100"
        >
          Join Existing Room
        </Button>
      </DialogTrigger>
      <DialogContent className="border border-zinc-800 bg-zinc-900 p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-white">Join Private Room</DialogTitle>
          <DialogDescription>Enter the room ID to join an existing room.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 px-4">
          <Field data-invalid={!!error}>
            <FieldLabel className={error ? 'text-red-500' : 'text-white'} htmlFor="room-id">
              Room ID
            </FieldLabel>
            <Input
              id="room-id"
              value={roomId}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleJoin();
                }
              }}
              placeholder="room ID"
              className="border-zinc-700 bg-zinc-800 text-zinc-100"
              aria-invalid={!!error}
            />
            <FieldDescription>{error || 'Enter the room ID.'}</FieldDescription>
          </Field>
        </div>
        <DialogFooter className="border-border border-t bg-zinc-950/40 p-4">
          <Button
            disabled={!!error}
            onClick={handleJoin}
            className="bg-zinc-100 text-black hover:bg-zinc-300"
          >
            Join Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
