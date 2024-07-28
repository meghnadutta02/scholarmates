// components/FAQ.js
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccordionHeader } from "@radix-ui/react-accordion";

const FAQ = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="mt-16 mx-auto md:w-[900px] sm:w-[600px] w-full font-sans"
    >
      <p className="mb-2 font-bold text-lg md:text-2xl text-center">
        Frequently asked questions
      </p>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          My college is not listed in the college selection dropdown. What
          should I do?
        </AccordionTrigger>
        <AccordionContent>
          If your college is not listed, please send us a support request. We
          are continually growing our database and will work to add your college
          as soon as possible.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          The interest/discussion category I am looking for is not in the
          dropdown. How can I add it?
        </AccordionTrigger>
        <AccordionContent>
          If you cannot find the interest or discussion category you&apos;re
          looking for, please send us a support request. We are constantly
          updating our categories to better serve our users.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          I am facing technical issues with the platform. How can I get help?
        </AccordionTrigger>
        <AccordionContent>
          If you&apos;re experiencing technical issues, please reach out to our
          support team through the support request form on our website. We will
          assist you as soon as possible.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-4" id="faq">
        <AccordionTrigger>
          How can I delete my account permanently?
        </AccordionTrigger>
        <AccordionContent>
          If you wish to delete your account, please contact our support team
          through the support request form. We will process your request and
          confirm once your account has been deleted.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>
          I cannot access the &apos;Find Match&apos; page. What should I do?
        </AccordionTrigger>
        <AccordionContent>
          This is probably because you haven&apos;t updated your profile to
          include your interests. Please make sure your profile is complete to
          access the &apos;Find Match&apos; page.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-6">
        <AccordionTrigger>
          I cannot filter by college in discussions. How can I fix this?
        </AccordionTrigger>
        <AccordionContent>
          This is likely because you haven&apos;t added your college name to
          your profile. Please update your profile with your college name to
          access all filtering features in discussions.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-7">
        <AccordionTrigger>
          I cannot find the group I had previously joined. What could be the
          issue?
        </AccordionTrigger>
        <AccordionContent>
          This is probably because you were removed from the group. If you
          believe this is a mistake, please contact the group admin for more
          information.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-8">
        <AccordionTrigger>
          I cannot text someone whom I previously talked with. What could be the
          issue?
        </AccordionTrigger>
        <AccordionContent>
          This is probably because you were removed as a connection. In order to
          text someone, both users have to be connected.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FAQ;
