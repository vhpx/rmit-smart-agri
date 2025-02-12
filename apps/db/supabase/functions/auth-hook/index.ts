import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { SendEmailCommand, SESClient } from "npm:@aws-sdk/client-ses@3.716.0";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import React from "npm:react@18.3.1";
import { MagicLinkEmail } from "./_templates/magic-link.tsx";
import { SignUpEmail } from "./_templates/sign-up.tsx";

const sesClient = new SESClient({
  region: Deno.env.get("AWS_REGION") as string,
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID") as string,
    secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY") as string,
  },
});

const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") as string;

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("not allowed", { status: 400 });
  }

  const rawPayload = await req.text();
  const payload = JSON.parse(rawPayload);
  const headers = Object.fromEntries(req.headers);
  const wh = new Webhook(hookSecret);

  try {
    const verified = wh.verify(JSON.stringify(payload), headers) as {
      user: {
        email: string;
        user_metadata: {
          username: string;
          locale: string;
          origin: string;
        };
      };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
        site_url: string;
        token_new: string;
        token_hash_new: string;
      };
    };

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = verified;

    let html: string;
    let subject: string;

    if (email_action_type === "signup") {
      html = await renderAsync(
        React.createElement(SignUpEmail, {
          origin: user["user_metadata"].origin,
          username: user["user_metadata"].username,
          locale: user["user_metadata"].locale,
          supabase_url: Deno.env.get("SUPABASE_URL") ?? "",
          token,
          token_hash,
          redirect_to,
          email_action_type,
        }),
      );
      subject = user["user_metadata"].locale?.includes("vi")
        ? "Mã xác minh RMIT Smart Agri"
        : "RMIT Smart Agri Verification Code";
    } else {
      html = await renderAsync(
        React.createElement(MagicLinkEmail, {
          origin: user["user_metadata"].origin,
          locale: user["user_metadata"].locale,
          supabase_url: Deno.env.get("SUPABASE_URL") ?? "",
          token,
          token_hash,
          redirect_to,
          email_action_type,
        }),
      );
      subject = user["user_metadata"].locale?.includes("vi")
        ? "Mã xác minh RMIT Smart Agri"
        : "RMIT Smart Agri Verification Code";
    }

    const params = {
      Source: `${Deno.env.get("SOURCE_NAME")} <${
        Deno.env.get("SOURCE_EMAIL")
      }>`,
      Destination: {
        ToAddresses: [user.email],
      },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: { Data: html },
        },
      },
    };

    const command = new SendEmailCommand(params);
    await sesClient.send(command);
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: {
          http_code: error.code,
          message: error.message,
        },
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", "application/json");
  return new Response(JSON.stringify({}), {
    status: 200,
    headers: responseHeaders,
  });
});
