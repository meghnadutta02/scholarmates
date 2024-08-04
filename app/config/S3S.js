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

export const SendMail = async (name, request_message, recept_email,message) => {
    const params = {
        Destination: {
            ToAddresses: [recept_email]
        },
        Source:process.env.SENDER_EMAIL,
        Template: "My_Template",
        TemplateData: JSON.stringify({
            name: name,
            message: message,
            help_request:request_message
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
            TemplateName: "My_Template",
            SubjectPart: "Support Team ScholarMates",
            HtmlPart: `
        <span class="font" style="font-family: verdana; font-weight:bold;">
        Dear ,{{name}}
    </span>
    
    <br/>
    <br/>
     <span class="font" style="font-family: verdana; font-weight:bold;">
       we've receive your help request:
    </span>
     <span class="font" style="font-family: verdana;">
      {{help_request}}
    </span>
    <br/>
    <br/>
     <span class="font" style="font-family: verdana;">
       {{message}}
    </span>
    <br/>
    <br/>
        <div>
    <span class="font" style="font-family: verdana;">
        Best regards,
    </span>
    <span class="font" style="font-family: verdana;">
        <br>
    </span>
</div>
<div>
    <span class="font" style="font-family: verdana;">
        Team ScholarMates
    </span>
    <br>
</div>
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
<div>
    <br>
</div>
        `,
            TextPart: " Support ScholarMates"
        }
    };
    try {
        const data = await sesClient.send(new CreateTemplateCommand(params));
        console.log("Template created successfully", data);
    } catch (error) {
        console.error("Error creating template", error);
    }
}

