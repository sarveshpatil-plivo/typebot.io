import { createBlock } from "@typebot.io/forge";
import { sendSms } from "./actions/sendSms";
import { auth } from "./auth";
import { PlivoLogo } from "./logo";

export const plivoBlock = createBlock({
  id: "plivo",
  name: "Plivo",
  tags: ["sms", "messaging"],
  LightLogo: PlivoLogo,
  auth,
  actions: [sendSms],
  docsUrl: "https://docs.typebot.com/editor/blocks/integrations/plivo",
});
