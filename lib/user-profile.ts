import {db} from "@/lib/db";
import {auth, currentUser} from "@clerk/nextjs/server";
import {Profile} from "@prisma/client";


export const currentUserProfile = async (redirect?: boolean) => {
    const user = await currentUser();
    if (!user) {
        if (redirect) {
            await auth();
            return null;
        }
        return null;
    }

    const profile: Profile = await db.profile.findUnique({
        where: {
            clerk_id: user.id,
        }
    });

    if (profile) {
        if (profile.name != `${user.firstName} ${user.lastName}`) {
            profile.name = `${user.firstName} ${user.lastName}`;
            await db.profile.update({
                where: {
                    clerk_id: user.id,
                },
                data: {
                    name: `${user.firstName} ${user.lastName}`,
                }
            });
        }
        return profile;
    }

    try {
        return await db.profile.create({
            data: {
                clerk_id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                imageUrl: user.imageUrl,
            }
        }) as Profile;
    } catch (e) {
        console.error(e);
        return (await db.profile.findUnique({
            where: {
                clerk_id: user.id,
            }
        })) as Profile;
    }
}