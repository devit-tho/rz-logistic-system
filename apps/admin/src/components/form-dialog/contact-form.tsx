import { RHFTextField } from "../hook-form";

function ContactForm() {
  return (
    <>
      <div className="flex flex-col gap-y-2">
        <h2 className="font-semibold">Contact Details</h2>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          <RHFTextField
            name="contact.name"
            label="Name"
            placeholder="Enter contact name"
            autoComplete="off"
          />

          <RHFTextField
            name="contact.position"
            label="Position"
            placeholder="Enter contact position"
            autoComplete="off"
          />

          <RHFTextField
            name="contact.email"
            label="Email"
            placeholder="Enter contact email"
            autoComplete="off"
          />

          <RHFTextField
            name="contact.mobile"
            label="Mobile"
            placeholder="Enter contact mobile"
            autoComplete="off"
          />

          <RHFTextField
            name="contact.fax"
            label="Fax"
            placeholder="Enter contact fax"
            autoComplete="off"
          />

          <RHFTextField
            name="contact.skype"
            label="Skype"
            placeholder="Enter contact skype"
            autoComplete="off"
          />

          <RHFTextField
            name="contact.wechat"
            label="Wechat"
            placeholder="Enter contact wechat"
            autoComplete="off"
          />

          <RHFTextField
            name="contact.whatsapp"
            label="Whatsapp"
            placeholder="Enter contact whatsapp"
            autoComplete="off"
          />

          <RHFTextField
            name="contact.telegram"
            label="Telegram"
            placeholder="Enter contact telegram"
            autoComplete="off"
          />
        </div>
      </div>
    </>
  );
}

export default ContactForm;
