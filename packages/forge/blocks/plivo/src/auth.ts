import { createAuth, option } from "@typebot.io/forge";

export const auth = createAuth({
  type: "encryptedCredentials",
  name: "Plivo account",
  schema: option.object({
    authId: option.string.meta({
      layout: {
        label: "Auth ID",
        isRequired: true,
        withVariableButton: false,
        isDebounceDisabled: true,
        helperText:
          "Find your Auth ID and Auth Token on the [Plivo console](https://cx.plivo.com/dashboard/).",
      },
    }),
    authToken: option.string.meta({
      layout: {
        label: "Auth Token",
        isRequired: true,
        inputType: "password",
        withVariableButton: false,
        isDebounceDisabled: true,
      },
    }),
  }),
});
