import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const UserAvtar = ({
    user,
    size,
}: {
    user: {
        given_name: string;
        family_name: string;
        picture: string;
        name: string;
    };
    size?: number;
}) => {
    return (
        <Avatar className="aspect-square object-cover">
            <AvatarImage
                alt={user.given_name}
                src={user.picture}
                width={size || 30}
                height={size || 30}
                className="object-cover rounded-full border border-muted"
            />
            <AvatarFallback>
                <div className="size-[75px] flex items-center justify-center rounded-full border border-muted text-3xl">
                    {user.given_name.charAt(0) + user.family_name.charAt(0)}
                </div>
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvtar;
