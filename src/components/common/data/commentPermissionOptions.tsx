import { COMMENTPERMISSIONS } from "@prisma/client";
import FollowedIcon from "~/components/icons/FollowedIcon";
import GlobalIcon from "~/components/icons/GlobalIcon";
import MentionIcon from "~/components/icons/MentionIcon";
import VerifiedIcon from "~/components/icons/VerifiedIcon";

export const commentPermissionOptions = [
  {
    icon: <GlobalIcon className="h-4 w-4" />,
    title: "Everyone",
    description: "Everyone can reply",
    value: COMMENTPERMISSIONS.EVERYONE,
  },
  {
    icon: <FollowedIcon className="h-4 w-4" />,
    title: "Accounts you follow",
    description: "Accounts you follow can reply",
    value: COMMENTPERMISSIONS.FOLLOW,
  },
  {
    icon: <VerifiedIcon className="h-4 w-4" />,
    title: "Verified accounts",
    description: "Only Verified accounts can reply",
    value: COMMENTPERMISSIONS.VERIFIED,
  },
  {
    icon: <MentionIcon className="h-4 w-4" />,
    title: "Only accounts you mention",
    description: "Only accounts you mention can reply",
    value: COMMENTPERMISSIONS.MENTIONED,
  },
];
