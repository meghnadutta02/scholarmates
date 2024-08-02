import { SendEmailCommand } from "@aws-sdk/client-ses";
import { SESClient } from "@aws-sdk/client-ses";

const sesClient = new SESClient({ region: "us-east-1" });

const createSendEmailCommand = (toAddress, fromAddress, message) => {
  return new SendEmailCommand({
    Destination: {
      BccAddresses: [
        // "imankushroy@gmail.com",
        // "meghnadutta02@gmail.com",
        // "jyotiradityamishra06@gmail.com",
      ],
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: "<h1>Reply to Support Request </h1>",
        },
        Text: {
          Charset: "UTF-8",
          Data: message,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Re: Support Request",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [],
  });
};

const sendEmail = async (userEmail, adminEmail, message) => {
  const sendEmailCommand = createSendEmailCommand(
    userEmail,
    adminEmail,
    message
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

export { sendEmail };
