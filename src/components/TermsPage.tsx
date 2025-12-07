import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  ChevronDown,
  Mail,
  FileText,
  Printer,
  Clipboard,
} from "lucide-react";

type SectionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

const lastUpdated = "November 2025";
const supportEmail = "takeover@takeovermobile.com";

// motion variant
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03 },
  }),
};

// TERMS OF SERVICE SECTIONS
const termsSections: SectionItem[] = [
  {
    id: "tos-overview",
    title: "TAKEOVER ‒ TERMS OF SERVICE",
    content: (
      <>
        <p className="mb-3 text-sm text-slate-400">Last Updated: {lastUpdated}</p>
        <p className="mb-2">
          Welcome to <strong>Takeover</strong> (“Takeover,” “we,” “our,” “us”).
          These Terms of Service (“Terms”) govern your access to and use of the
          Takeover website, mobile site, and related services (collectively, the
          “Platform”).
        </p>
        <p className="mb-2">
          By accessing or using Takeover, you agree to these Terms. If you do
          not agree, you may not use the Platform.
        </p>
      </>
    ),
  },
  {
    id: "tos-description",
    title: "1. Description of the Service",
    content: (
      <>
        <p>Takeover is a digital marketplace that allows users to:</p>
        <ul className="list-disc ml-6 mt-2">
          <li>Post and discover apartment lease transfers</li>
          <li>Post and discover car lease transfers</li>
          <li>Communicate with other users to facilitate lease takeovers</li>
        </ul>
        <p className="mt-3 text-sm text-slate-500">
          Takeover is not a real estate company, dealership, landlord, property
          manager, lender, broker, insurance provider, or legal representative
          and does not own or manage listed properties or vehicles.
        </p>
      </>
    ),
  },
  {
    id: "tos-background-checks",
    title: "2. No Background Checks",
    content: (
      <p>
        Takeover does not conduct identity verification, background checks,
        credit checks, or inspections. Users must perform their own due
        diligence.
      </p>
    ),
  },
  { id: "tos-eligibility", title: "3. Eligibility", content: <p>You must be 18+ and use the Platform lawfully.</p> },
  { id: "tos-accounts", title: "4. User Accounts", content: <p>You are responsible for your account security.</p> },
  { id: "tos-responsibilities", title: "5. User Responsibilities", content: <p>You agree to post accurate information and comply with all laws.</p> },
  { id: "tos-not-party", title: "6. Takeover Is Not a Party to Any Agreement", content: <p>Takeover does not enter lease agreements. All agreements are solely between users and landlords/dealerships.</p> },
  { id: "tos-fees", title: "7. Fees and Payments", content: <p>Platform fees may apply and are non-refundable unless required by law.</p> },
  { id: "tos-communications", title: "8. Communications", content: <p>You agree not to harass, spam, or scam other users.</p> },
  { id: "tos-prohibited", title: "9. Prohibited Conduct", content: <p>You may not post illegal, offensive, or fraudulent content.</p> },
  { id: "tos-ip", title: "10. Intellectual Property", content: <p>All Takeover branding and platform content belong to Takeover LLC.</p> },
  { id: "tos-disclaimers", title: "11. Disclaimers", content: <p>The Platform is provided “as-is.” Takeover does not guarantee listing accuracy, lease approval, or user reliability.</p> },
  { id: "tos-liability", title: "12. Limitation of Liability", content: <p>Takeover is not liable for financial losses, fraud, disputes, or damages of any kind.</p> },
  { id: "tos-indemnification", title: "13. Indemnification", content: <p>You agree to indemnify Takeover for claims arising from your use of the Platform.</p> },
  { id: "tos-termination", title: "14. Termination", content: <p>We may suspend accounts that violate policies.</p> },
  { id: "tos-law", title: "15. Governing Law", content: <p>These Terms follow Minnesota law.</p> },
  { id: "tos-changes", title: "16. Changes", content: <p>Using the Platform after updates means you accept updated Terms.</p> },
];

// PRIVACY POLICY SECTIONS
const privacySections: SectionItem[] = [
  {
    id: "pp-overview",
    title: "PRIVACY POLICY",
    content: (
      <>
        <p className="mb-3 text-sm text-slate-400">Last Updated: {lastUpdated}</p>
        <p>
          This Privacy Policy describes how Takeover collects, uses, and shares
          information.
        </p>
      </>
    ),
  },
  { id: "pp-collect", title: "1. Information We Collect", content: <p>We may collect personal information you provide (name, email, listings), and device analytics. We do not collect SSNs, government IDs, or credit information.</p> },
  { id: "pp-use", title: "2. How We Use Your Information", content: <p>We operate the Platform, display listings, connect users, prevent fraud, and comply with law. We do not sell your data.</p> },
  { id: "pp-sharing", title: "3. Information Sharing", content: <p>We share data only with service providers, user interactions, or legal requests.</p> },
  { id: "pp-communications", title: "4. User Communications", content: <p>Messages may be stored or monitored for safety.</p> },
  { id: "pp-cookies", title: "5. Cookies", content: <p>We use cookies for functionality and analytics.</p> },
  { id: "pp-security", title: "6. Data Security", content: <p>We use reasonable safeguards.</p> },
  { id: "pp-children", title: "7. Children’s Privacy", content: <p>We do not collect data from individuals under 18.</p> },
  { id: "pp-links", title: "8. Third-Party Links", content: <p>We are not responsible for third-party privacy practices.</p> },
  { id: "pp-retention", title: "9. Data Retention", content: <p>We keep data as long as needed to operate the Platform.</p> },
  {
    id: "pp-rights",
    title: "10. Your Rights",
    content: (
      <p>
        You may access, update, or delete your data by contacting{" "}
        <button
          onClick={() => navigator.clipboard.writeText(supportEmail)}
          className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700"
        >
          <Mail size={16} />
          {supportEmail}
          <Clipboard size={14} />
        </button>
        .
      </p>
    ),
  },
  { id: "pp-changes", title: "11. Changes", content: <p>Continued use means acceptance of changes.</p> },
];

export const TermsPage: React.FC = () => {
  const [open, setOpen] = useState<string | null>("tos-overview");

  const toggle = (id: string) => {
    setOpen((prev) => (prev === id ? null : id));
  };

  const renderSection = (items: SectionItem[]) => (
    <AnimatePresence initial={false}>
      {items.map((s, index) => {
        let isOpen = open === s.id;
        if (s.id === "tos-overview" || s.id === "pp-overview") { isOpen = true; }
        return (
          <motion.div
            key={s.id}
            variants={fadeInUp}
            custom={index}
            initial="hidden"
            animate="visible"
            className="border-b py-3"
          >
            {s.id === "tos-overview" || s.id === "pp-overview" ? (
             null 
            ) : (
              <button
                onClick={() => toggle(s.id)}
                className="w-full text-left flex items-center justify-between"
              >

                <h2 className="text-sm font-semibold">{s.title}</h2>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <ChevronDown />
                </motion.div>
              </button>
            )}

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-3 text-slate-700 prose max-w-none text-sm"
                >
                  {s.content}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-8">
      <div className="max-w-5xl mx-auto px-6 py-14">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 shadow-md">
              <Menu className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Legal</h1>
              <p className="text-sm text-slate-500">
                Terms of Service & Privacy Policy
              </p>
            </div>
          </div>

          {/* <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-white shadow hover:shadow-md border"
          >
            <Printer size={16} />
            Print
          </button> */}
        </motion.header>

        {/* TERMS SECTION */}
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4 text-sky-700">
            Terms of Service
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-xl border text-">
            {renderSection(termsSections)}
          </div>
        </div>

        {/* PRIVACY SECTION */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-indigo-700">
            Privacy Policy
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-xl border text-sm">
            {renderSection(privacySections)}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="text-center text-sm mt-12 text-slate-500">
          Last Updated: {lastUpdated}
        </footer>
      </div>
    </div>
  );
};

export default TermsPage;
