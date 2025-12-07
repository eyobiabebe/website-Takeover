
import { motion } from "framer-motion";
import {
  UserPlus,
  User,
  LayoutList,
  FileText,
  MessageSquare,
  CheckCircle,
  DownloadCloud,
  CreditCard,
  Tag,
  Users,
  ChartPie,
  DollarSign,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  hover: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 400 },
  },
};

const Step = ({ index, Icon, title, summary, details }) => (
  <motion.li
    variants={item}
    whileHover="hover"
    className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-md 
      border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm 
      hover:shadow-lg transition-shadow"
    aria-label={`${index + 1}. ${title}`}
  >
    <div className="flex items-start gap-4">
      <div className="flex-none w-12 h-12 rounded-xl bg-gradient-to-br 
        from-indigo-500 to-purple-500 text-white flex items-center justify-center">
        <Icon size={20} />
      </div>

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {index + 1}. {title}
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">{summary}</span>
        </div>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {details}
        </p>
      </div>
    </div>
  </motion.li>
);

export default function HowItWorks() {
  // ---------------- GET IN ----------------
  const getInSteps = [
    {
      title: "Create your account",
      summary: "Sign up & verify",
      Icon: UserPlus,
      details:
        "Register with email or SSO, verify your contact. A clear profile photo increases trust and response rate.",
    },
    {
      title: "Complete your profile",
      summary: "Add details & docs",
      Icon: User,
      details:
        "Fill personal info, preferences, and upload required documents like ID or proof of income.",
    },
    {
      title: "Browse & filter listings",
      summary: "Filter by type, date, location",
      Icon: LayoutList,
      details:
        "Use filters (lease type, start date, price, pet policy). Save searches and favorite listings.",
    },
    {
      title: "View lease details",
      summary: "Inspect terms & docs",
      Icon: FileText,
      details:
        "Read full lease summary, costs, photos, and uploaded lease PDF before applying.",
    },
    {
      title: "Chat with the tenant",
      summary: "Ask clarifying questions",
      Icon: MessageSquare,
      details:
        "Use the chat to clarify move-out timeline, utilities, parking, or request extra photos.",
    },
    {
      title: "Apply to takeover",
      summary: "Submit application",
      Icon: Tag,
      details:
        "Submit takeover application, attach verification docs, provide intro + move-in date.",
    },
    {
      title: "Tenant accepts & paperwork",
      summary: "Agree terms & e-sign",
      Icon: CheckCircle,
      details:
        "If accepted, follow instructions to finish paperwork and complete takeover agreement.",
    },
    {
      title: "Finalization & confirmation",
      summary: "Download PDF",
      Icon: DownloadCloud,
      details:
        "Once done, you'll receive a completion notification and downloadable PDF summary.",
    },
  ];

  // ---------------- GET OUT ----------------
  const getOutSteps = [
    {
      title: "Start by signing up",
      summary: "Create & verify",
      Icon: UserPlus,
      details:
        "Outgoing tenants must create and verify their profile. Verified profiles attract more applicants.",
    },
    {
      title: "Create a listing",
      summary: "Add lease information",
      Icon: FileText,
      details:
        "Add all lease info: dates, price, utilities, deposit, parking, and any special clauses.",
    },
    {
      title: "Save draft or continue",
      summary: "Save progress",
      Icon: CreditCard,
      details:
        "Save your draft and resume later. Continue to the listing fee (if applicable).",
    },
    {
      title: "Pay listing fee & publish",
      summary: "Make listing live",
      Icon: DollarSign,
      details:
        "Pay securely (if required). Your listing goes live with a public URL.",
    },
    {
      title: "Manage applicants",
      summary: "Dashboard & chat",
      Icon: Users,
      details:
        "View applicants, open chats, request more info, and shortlist candidates.",
    },
    {
      title: "Accept applicant",
      summary: "Choose best match",
      Icon: CheckCircle,
      details:
        "Review profiles and references. Accept the best candidate and schedule a meeting.",
    },
    {
      title: "Complete paperwork & checks",
      summary: "Verify identity",
      Icon: ChartPie,
      details:
        "Finalize takeover agreement and complete verification with property manager if needed.",
    },
    {
      title: "Mark listing complete",
      summary: "Notify system",
      Icon: DownloadCloud,
      details:
        "Once handover is done, mark listing complete. Both parties receive a final PDF confirmation.",
    },
  ];

  // ---------------- COMPONENT RETURN ----------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white 
      dark:from-slate-900 dark:to-slate-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-xl sm:text-2xl font-extrabold bg-clip-text 
            text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            How it works — Lease Takeover
          </h1>

          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Step-by-step flows for tenants looking to take over a lease ("Get in") 
            and outgoing tenants listing their lease ("Get out").
          </p>
        </motion.header>

        {/* CONTENT */}
        <motion.main
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* ---------------- GET IN ---------------- */}
          <section aria-labelledby="get-in" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                <ChartPie size={22} />
              </div>
              <div>
                <h2 id="get-in" className="text-lg font-semibold">
                  To get in
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Everything a prospective taker should know.
                </p>
              </div>
            </div>

            <motion.ul className="space-y-4">
              {getInSteps.map((s, i) => (
                <Step key={i} index={i} {...s} />
              ))}
            </motion.ul>

            <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              <strong>Pro tips:</strong>
              <ul className="list-disc ml-5 mt-2">
                <li>Verify payment expectations before moving in.</li>
                <li>Request the original lease and landlord approvals.</li>
                <li>Save chat records in case of disputes.</li>
              </ul>
            </div>
          </section>

          {/* ---------------- GET OUT ---------------- */}
          <section aria-labelledby="get-out" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                <Users size={22} />
              </div>
              <div>
                <h2 id="get-out" className="text-lg font-semibold">
                  To get out
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  List your lease and manage handover confidently.
                </p>
              </div>
            </div>

            <motion.ul className="space-y-4">
              {getOutSteps.map((s, i) => (
                <Step key={i} index={i} {...s} />
              ))}
            </motion.ul>

            <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              <strong>Pro tips:</strong>
              <ul className="list-disc ml-5 mt-2">
                <li>Add clear photos + signed lease pages.</li>
                <li>Offer a short video walkthrough.</li>
                <li>Keep a checklist for handover items.</li>
              </ul>
            </div>
          </section>
        </motion.main>

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400"
        >
          <div className="max-w-3xl mx-auto">
            <p>
              Note: This guide provides general assistance. Always check your lease 
              agreement and local laws for specific requirements.
            </p>
          </div>
        </motion.footer>

      </div>
    </div>
  );
}
