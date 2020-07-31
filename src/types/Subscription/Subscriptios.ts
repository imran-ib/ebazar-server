// import { Context } from "./../../context";
// import { subscriptionField, stringArg } from "@nexus/schema";
// import { withFilter } from "graphql-yoga";
// import { MESSAGE_CHANNEL } from "../../Utils/CONSTANTS";

// export const Subscriptions = subscriptionField("NewMessage", {
//   type: "Message",
//   description: "New Message Subscriptions",
//   args: { ROOMID: stringArg({ required: true }) },
//   subscribe: withFilter(
//     (_, ___, ctx: Context, __) => ctx.pubsub.asyncIterator(MESSAGE_CHANNEL),
//     async (payload, variables) => {
//       return payload.newMessage.ROOMID === variables.ROOMID;
//     }
//   ),
//   resolve: payload => payload.newMessage
// });
