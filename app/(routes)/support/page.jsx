"use client";

import Image from "next/image";
import puzzle from "@/public/puzzle.png";
import { useSession } from "next-auth/react";
import React from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Contact = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const form = event.target;
    const formData = {
      name: form.name.value,
      email: form.email.value,
      details: form.details.value,
      _cc: form._cc.value,

      _honey: form._honey.value,
      _captcha: form._captcha.value,
      _template: form._template.value,
      _subject: form._subject.value,
    };

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/08d1e19a425b12e98a324c64805a676d",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.info("We have received your message. We will get back to you.");
        setLoading(false);
        form.reset();
      } else {
        toast.error("Form submission failed.");
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <section className="md:py-20 py-10 dark:bg-dark lg:py-[120px] flex items-center w-full sm:w-auto">
        <div className="container mx-auto px-4">
          <div className="-mx-4 flex flex-wrap lg:justify-between">
            <div className="w-full px-3 md:w-[43%] md:max-w-[550px]">
              <h2 className="md:mb-5 mb-3 text-[28px] font-bold uppercase text-dark dark:text-white sm:text-[30px] lg:text-[34px] xl:text-[40px]">
                GET IN TOUCH
              </h2>
              <p className="mb-9 text-base leading-relaxed text-body-color dark:text-dark-6">
                Here are some commonly asked questions about our product. Check
                this out and if you still have any questions, feel free to
                contact us by submitting the form alongside.
              </p>
            </div>
            <div className="w-full sm:px-4 px-[14px] md:w-[55%]">
              <div className="relative rounded-lg bg-white p-6 shadow-lg dark:bg-dark-2 sm:p-12">
                <form onSubmit={handleSubmit} method="POST">
                  <input
                    type="hidden"
                    name="_cc"
                    value="imankushroy@gmail.com,jyotiradityamishra06@gmail.com"
                  />

                  <input type="hidden" name="_honey" className="hidden" />
                  <input type="hidden" name="_captcha" value="false" />
                  <input type="hidden" name="_template" value="table" />
                  <input
                    type="hidden"
                    name="_subject"
                    value="New Support Request"
                  />
                  <ContactInputBox
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    disabled={false}
                    defaultValue={session?.user?.name}
                  />
                  <ContactInputBox
                    type="email"
                    name="email"
                    disabled={true}
                    placeholder="Your Email"
                    defaultValue={session?.user?.email}
                  />
                  <ContactTextArea
                    row="6"
                    placeholder="Your Message"
                    name="details"
                    defaultValue=""
                  />
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded border border-primary bg-primary p-3 text-white transition hover:bg-opacity-90"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>

                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                  className="absolute -right-12 -top-12 z-[-1]"
                >
                  <Image
                    src={puzzle}
                    alt="Puzzle"
                    className="w-12 hidden sm:block h-12 md:w-24 md:h-24 opacity-30 -rotate-45"
                  />
                </motion.div>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                  className="absolute -left-12 -bottom-9 z-[-1]"
                >
                  <Image
                    src={puzzle}
                    alt="Puzzle"
                    className="w-12 hidden sm:block h-12 md:w-24 md:h-24 opacity-30 -rotate-30"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

const ContactTextArea = ({
  row,
  placeholder,
  name,
  defaultValue,
  disabled,
}) => {
  return (
    <div className="mb-6">
      <textarea
        rows={row}
        placeholder={placeholder}
        name={name}
        disabled={disabled}
        className="w-full resize-none rounded border border-stroke px-[14px] py-3 text-base text-body-color outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6 relative z-10"
        defaultValue={defaultValue}
      />
    </div>
  );
};

const ContactInputBox = ({
  type,
  placeholder,
  name,
  defaultValue,
  disabled,
}) => {
  return (
    <div className="mb-6">
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        className="w-full rounded border border-stroke px-[14px] py-3 text-base text-body-color outline-none focus:border-primary dark:border-dark-3 dark:bg-dark dark:text-dark-6 relative z-10"
      />
    </div>
  );
};
