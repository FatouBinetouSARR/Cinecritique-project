// src/components/user/UserCard.tsx
interface UserCardProps {
  id: number;
  name: string;
  avatar: string;
  followers: string;
  bio?: string;
}

export const UserCard: React.FC<UserCardProps> = ({
  name,
  avatar,
  followers,
  bio,
}) => {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer transition">
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full border border-yellow-400"
      />
      <div>
        <h4 className="text-sm font-semibold text-white">{name}</h4>
        <p className="text-xs text-white/60">{followers}</p>
        {bio && <p className="text-xs text-gray-400 mt-1">{bio}</p>}
      </div>
    </div>
  );
};
