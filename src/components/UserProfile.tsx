import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@supabase/supabase-js';

interface UserProfileProps {
  user: User;
}

export const UserProfile = ({ user }: UserProfileProps) => {
  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  console.log(user.user_metadata);

  return (
    <div className='flex items-center gap-3'>
      <Avatar className='h-10 w-10 border-2 border-primary/20'>
        <AvatarImage
          src={user.user_metadata?.avatar_url}
          alt={getDisplayName()}
        />
        <AvatarFallback className='bg-primary text-primary-foreground font-semibold'>
          {getInitials(user.email || 'US')}
        </AvatarFallback>
      </Avatar>
      <div className='hidden sm:block text-left'>
        <p className='text-sm font-medium text-foreground'>
          {getDisplayName()}
        </p>
        <p className='text-xs text-muted-foreground'>{user.email}</p>
      </div>
    </div>
  );
};
