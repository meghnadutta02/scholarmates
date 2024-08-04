import {
    SESClient,
    CreateTemplateCommand,
    SendTemplatedEmailCommand,

} from "@aws-sdk/client-ses";
import dotenv from "dotenv";
dotenv.config();

const SES_CONFIG = {
    region: process.env.S3_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY_ID,
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
    },
}

//   CREAT SES SERVICES OBJECT
const sesClient = new SESClient(SES_CONFIG);

export const SendMail = async (name, Issue, recept_email, Response) => {
    const params = {
        Destination: {
            ToAddresses: [recept_email]
        },
        Source: process.env.SENDER_EMAIL,
        Template: process.env.SES_TEMPLET_USE,
        TemplateData: JSON.stringify({
            Name: name,
            Response: Response,
            Issue: Issue
        })
    };
    try {
        const data = await sesClient.send(new SendTemplatedEmailCommand(params));
        console.log("Email sent successfully", data);
    } catch (error) {
        console.error("Error sending email", error);
    }
};


// CREATE TEMPLETE
// ONCE TIME
export const CreateTemplate = async () => {
    const params = {
        Template: {
            TemplateName: process.env.SES_TEMPLET_USE,
            SubjectPart: "Support Team ScholarMates",
            HtmlPart: `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Help Reply Email Template</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border: 1px solid #dddddd;">
       
        <div style="padding: 20px;">
            <h3 style="color: #333333;">Dear {{Name}},</h3>
            <p style="color: #666666; line-height: 1.6;">Thank you for contacting us. We have reviewed your support request and here is the solution to your issue:</p>
            <p style="color: #666666; line-height: 1.6; font-weight: bold;"><strong>Request:{{Issue}}</strong> </p>
            <p style="color: #666666; line-height: 1.6;">{{Response}}</p>
            <p style="color: #666666; line-height: 1.6;">We hope this resolves your issue. If you need further assistance, please do not hesitate to reach out to us.</p>
            <span style="display: block; color: #666666;">Best Regards,</span>
            <span style="display: block; color: #666666;">Support Team </span>
            <span style="display: block; color: #666666;">Scholarmates</span>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #999999;">
          <div style="text-align:center;margin-top:10px">
    <div>
        <br>
    </div>
    <div>
        <img src="https://res.cloudinary.com/dsjmm6114/image/upload/v1722604013/logo_tfo3tj.png" width="82" height="82">
        <br>
    </div>
    <div>
        <i>
            <b>
                <span class="size" style="font-size:15px">
                    <span class="font" style="font-family: verdana;">
                        ScholarMates
                    </span>
                </span>
                <span class="font" style="font-family: verdana;">
                </span>
                <span class="size" style="font-size:16px">
                    <span class="font" style="font-family: verdana;">
                    </span>
                    <span class="font" style="font-family: verdana;">
                        <br>
                    </span>
                    <span class="font" style="font-family: verdana;">
                    </span>
                </span>
                <span class="font" style="font-family: verdana;">
                </span>
            </b>
            <span class="font" style="font-family: verdana;">
            </span>
        </i>
        <span class="font" style="font-family: verdana;">
        </span>
        <i>
            <span class="font" style="font-family: verdana;">
            </span>
            <i>
                <span class="font" style="font-family: verdana;">
                    Checkmate your goals. Together.
                </span>
            </i>
        </i>
    </div>
</div>
            <p>&copy; 2024 ScholarMates. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

            `,
            TextPart: " Support Team ScholarMates"
        }
    };
    try {
        const data = await sesClient.send(new CreateTemplateCommand(params));
        console.log("Template created successfully", data);
    } catch (error) {
        console.error("Error creating template", error);
    }
}

