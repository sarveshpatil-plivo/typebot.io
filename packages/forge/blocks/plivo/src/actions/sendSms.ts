import { createAction, option } from "@typebot.io/forge";
import { isDefined } from "@typebot.io/lib/utils";
import { auth } from "../auth";

export const sendSms = createAction({
  auth,
  name: "Send SMS",
  options: option.object({
    from: option.string.meta({
      layout: {
        label: "From",
        isRequired: true,
        helperText:
          "A Plivo phone number in E.164 format (e.g. +14155551234), a short code, or an approved sender ID.",
      },
    }),
    to: option.string.meta({
      layout: {
        label: "To",
        isRequired: true,
        helperText: "Recipient phone number in E.164 format.",
      },
    }),
    body: option.string.meta({
      layout: {
        label: "Message",
        isRequired: true,
        inputType: "textarea",
      },
    }),
    responseMapping: option
      .saveResponseArray(["Message UUID"])
      .optional()
      .meta({
        layout: {
          accordion: "Save in variables",
        },
      }),
  }),
  getSetVariableIds: (o) =>
    o.responseMapping?.map((v) => v.variableId).filter(isDefined) ?? [],
});
