import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const UserAvtar = ({
    user,
    size,
}: {
    user: {
        first_name: string;
        last_name: string;
        email: string;
    };
    size?: number;
}) => {
    return (
        <Avatar className="">
            <AvatarImage
                alt={user.first_name}
                src={""}
                width={size || 30}
                height={size || 30}
                className="object-cover rounded-full"
            />
            <AvatarFallback className="">
                <div
                    className={`flex items-center justify-center rounded-full border border-muted`}
                    style={{
                        width: size || 30,
                        height: size || 30,
                    }}
                >
                    {user.first_name.charAt(0) + user.last_name.charAt(0)}
                </div>
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvtar;
