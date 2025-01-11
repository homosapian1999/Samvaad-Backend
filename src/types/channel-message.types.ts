import { User } from "src/entity/user.entity";

export type ChannelMessageType = {
  channelId: number;
  sender: User;
  content: string;
  messageType: string;
  fileUrl: string;
};
