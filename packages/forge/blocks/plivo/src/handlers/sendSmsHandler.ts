import { createActionHandler } from "@typebot.io/forge";
import { ky } from "@typebot.io/lib/ky";
import { parseUnknownError } from "@typebot.io/lib/parseUnknownError";
import { isDefined } from "@typebot.io/lib/utils";
import { HTTPError } from "ky";
import { sendSms } from "../actions/sendSms";

export const sendSmsHandler = createActionHandler(sendSms, {
  server: async ({
    credentials: { authId, authToken },
    options,
    variables,
    logs,
  }) => {
    if (!authId || !authToken)
      return logs.add("Missing Plivo Auth ID or Auth Token.");
    if (!options.from) return logs.add("Missing sender number (From).");
    if (!options.to) return logs.add("Missing recipient number (To).");
    if (!options.body) return logs.add("Missing message text.");

    try {
      const { message_uuid } = await ky
        .post(`https://api.plivo.com/v1/Account/${authId}/Message/`, {
          headers: {
            Authorization: `Basic ${Buffer.from(`${authId}:${authToken}`).toString("base64")}`,
          },
          json: {
            src: options.from,
            dst: options.to,
            text: options.body,
            type: "sms",
          },
        })
        .json<{ message_uuid: string[] }>();

      const uuid = message_uuid?.[0];
      if (uuid)
        options.responseMapping
          ?.filter((m) => isDefined(m.variableId))
          .forEach((m) =>
            variables.set([{ id: m.variableId as string, value: uuid }]),
          );
    } catch (err) {
      if (err instanceof HTTPError) {
        logs.add(
          await parseUnknownError({
            err,
            context: "While sending Plivo SMS",
          }),
        );
      } else {
        console.error(err);
        logs.add(
          "Unexpected error while sending Plivo SMS. Check function logs for details.",
        );
      }
    }
  },
});
