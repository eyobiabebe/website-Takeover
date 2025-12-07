// import { CheckCircle, Users, Search, Shield } from "lucide-react";
// import { Link } from "react-router-dom";
// import createAccount from "../assets/create-account.jpg";
// import postOrBrowse from "../assets/post-lease.svg";
// import connectAndTransfer from "../assets/connect2.jpg";


// const HowItWorks = () => {
//   const steps = [
//     {
//       step: "01",
//       title: "Create Account",
//       description: "Sign up for free and complete your profile with verified information. Our secure process ensures trust from day one.",
//       icon: CheckCircle,
//       features: ["Free registration", "Identity verification", "Secure profile setup", "Trust building"],
//       imageUrl: createAccount
//     },
//     {
//       step: "02", 
//       title: "Post or Browse",
//       description: "List your lease for transfer or browse available apartments. Our smart algorithm matches you with compatible options.",
//       icon: Search,
//       features: ["Smart matching", "Easy listing", "Advanced filters", "Real-time updates"],
//       imageUrl: postOrBrowse
//     },
//     {
//       step: "03",
//       title: "Connect & Transfer", 
//       description: "Message verified users, complete background checks, and finalize your lease transfer with confidence.",
//       icon: Shield,
//       features: ["Secure messaging", "Background checks", "Legal support", "Confident transfers"],
//       imageUrl: connectAndTransfer
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-subtle">

//       {/* Hero Section */}
//       <section className=" text-center">
//         <div className="container mx-auto px-4 pt-40">
//           <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-l from-[#3182ed] to-[#56d28e] bg-clip-text text-transparent">
//             How It Works
//           </h1>
//           <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
//             Transfer your lease safely and efficiently in just three simple steps. 
//             Our platform connects verified tenants with trusted lease transfer opportunities.
//           </p>
//           <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
//             <div className="flex items-center gap-2">
//               <Users className="w-4 h-4 text-secondary" />
//               <span>10,000+ verified users</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Shield className="w-4 h-4 text-secondary" />
//               <span>100% secure transfers</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Steps Section */}
//       <section className="py-10 mx-28">
//         <div className="container mx-auto px-4">
//           <div className="grid gap-12 md:gap-16">
//             {steps.map((step, index) => (
//               <div key={index} className="grid md:grid-cols-2 gap-8 items-center">
//                 {/* Content */}
//                 <div className={`space-y-6 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
//                   <div className="flex items-center gap-4">
//                     <div className="w-16 h-16 rounded-full bg-gradient-to-l from-[#3182ed] to-[#56d28e] flex items-center justify-center text-primary-foreground font-bold text-xl">
//                       {step.step}
//                     </div>
//                     <step.icon className="w-8 h-8 text-[#3182ed]" />
//                   </div>
                  
//                   <div>
//                     <h3 className="text-3xl font-bold mb-4 text-foreground">
//                       {step.title}
//                     </h3>
//                     <p className="text-lg text-muted-foreground leading-relaxed">
//                       {step.description}
//                     </p>
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     {step.features.map((feature, featureIndex) => (
//                       <div key={featureIndex} className="flex items-center gap-2">
//                         <CheckCircle className="w-4 h-4 text-green-500" />
//                         <span className="text-sm text-foreground">{feature}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Visual */}
//                 <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
//                   <div className="shadow- hover:shadow- transition-all duration-300 border-0 bg-background/50 backdrop-blur-sm">
//                     <div className="">
//                       <div className="aspect-square bg-gradient-subtle rounded-xl flex items-center justify-center">
//                         {/* <step.icon className="w-24 h-24 text-primary/30" /> */}
//                         <img src={step.imageUrl} alt={step.title} className="absolute inset-0 w-full h-full object-fill rounded-xl" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-background border-t">
//         <div className="container mx-auto px-4 text-center">
//           <h2 className="text-xl md:text-2xl font-bold mb-6 bg-gradient-to-l from-[#3182ed] to-[#56d28e] bg-clip-text text-transparent">
//             Ready to Get Started?
//           </h2>
//           <p className="text-sm text-muted-foreground mb-8 max-w-2xl mx-auto">
//             Join thousands of users who have successfully transferred their leases. 
//             Start your journey today with complete confidence and security.
//           </p>
//           <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm font-semibold">
//             <button  className="px-2 py-2 hover:scale-105 border border-green-500 shadow shadow-green-500 hover:shadow-xl hover:shadow-green-700  bg-gradient-to-l from-[#3182ed] to-[#56d28e] text-white transition-colors duration-300 rounded">
//               Create Free Account
//             </button>
//             <button className="border-2 text px-2 py-2 border-[#3182ed] shadow-[#56d28e] rounded-lg hover:scale-105">
//               Browse Listings
//             </button>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default HowItWorks;
import React from "react";
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
  ActivityIcon
} from "lucide-react";

/**
 * HowItWorks.jsx
 * Drop into your pages directory. Uses Tailwind classes & framer-motion.
 */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  hover: { scale: 1.02, transition: { type: "spring", stiffness: 400 } }
};

const Step = ({ index, Icon, title, summary, details }: any) => (
  <motion.li
    variants={item}
    whileHover="hover"
    className="relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-shadow"
    aria-label={`${index + 1}. ${title}`}
  >
    <div className="flex items-start gap-4">
      <div className="flex-none w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center">
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
  const getInSteps = [
    {
      title: "Create your account",
      summary: "Sign up & verify",
      Icon: UserPlus,
      details:
        "Register with email or SSO, verify your contact (email/phone). Use a clear photo for your profile — it increases trust and response rate."
    },
    {
      title: "Complete your profile",
      summary: "Add details & docs",
      Icon: User,
      details:
        "Fill in personal info, move-in preferences, and upload required documents (ID, driver's license, proof of income). Profiles with completed verification show higher acceptance."
    },
    {
      title: "Browse & filter listings",
      summary: "Filter by type, date, location",
      Icon: LayoutList,
      details:
        "Use filters (lease type, start date, price range, location, pet policy) and sort by newest or quickest takeover. Save searches and favorite listings for quick access."
    },
    {
      title: "View lease details",
      summary: "Inspect terms & docs",
      Icon: FileText,
      details:
        "Open the listing to read the full lease summary, required move-in costs, photos, and uploaded PDF of the original lease. Check utilities, length remaining, and special conditions before applying."
    },
    {
      title: "Chat with the tenant",
      summary: "Ask clarifying questions",
      Icon: MessageSquare,
      details:
        "Use the in-app chat to ask about parking, utilities, exact move-out timelines, or to request more photos. Keep messages concise and polite — good communication increases chance of acceptance."
    },
    {
      title: "Apply to takeover",
      summary: "Submit application & docs",
      Icon: Tag,
      details:
        "Complete the takeover application, attach verification docs, provide desired move-in date and short intro. Optional: include references. Applications with complete info are reviewed faster."
    },
    {
      title: "Tenant accepts & complete paperwork",
      summary: "Agree terms & e-sign",
      Icon: CheckCircle,
      details:
        "If accepted, you'll receive the tenant's confirmation and step-by-step instructions to finish paperwork. This includes e-signing a takeover addendum, sharing contact info, and scheduling a handover."
    },
    {
      title: "Finalization & confirmation",
      summary: "Mark complete & download PDF",
      Icon: DownloadCloud,
      details:
        "When paperwork is done and the tenant marks the lease complete, both parties get a completion notification plus a PDF record (signed docs and summary). Store it for your records."
    }
  ];

  const getOutSteps = [
    {
      title: "Start by signing up",
      summary: "Create & verify profile",
      Icon: UserPlus,
      details:
        "If you're leaving a lease, create an account and verify your contact info. Completed profiles attract more qualified takers."
    },
    {
      title: "Create a listing",
      summary: "Add lease information",
      Icon: FileText,
      details:
        "Add listing and choose lease type (car or apartment). At step one enter all lease fields: start/end dates, monthly cost, security deposit, utilities, parking, and any special clauses."
    },
    {
      title: "Save draft or continue",
      summary: "Save progress",
      Icon: CreditCard,
      details:
        "You can save a draft if you need more time. When ready, proceed to the listing fee stage (if your marketplace requires a fee) or publish free if applicable."
    },
    {
      title: "Pay listing fee & publish",
      summary: "Secure listing slot",
      Icon: DollarSign,
      details:
        "Pay securely to promote or feature your listing. After payment your listing goes live with a public URL and appears in search results."
    },
    {
      title: "Manage applicants",
      summary: "Dashboard & chat",
      Icon: Users,
      details:
        "From Dashboard → My Listings you can view applicants, open chats, request more information, and shortlist candidates. Use templates for replies to save time."
    },
    {
      title: "Accept applicant",
      summary: "Choose the best candidate",
      Icon: CheckCircle,
      details:
        "Review profiles, references, and chat history. Accept the applicant that best matches criteria and confirm an in-person or virtual meeting to verify identity and documents."
    },
    {
      title: "Complete paperwork & checks",
      summary: "Meet & verify",
      Icon: ActivityIcon, // replaced below in mapping with ChartPie if needed
      details:
        "Finalize the takeover addendum, coordinate with your property manager if needed, and complete any background or payment setup. Keep records of IDs and receipts."
    },
    {
      title: "Mark listing complete",
      summary: "Notify the system",
      Icon: DownloadCloud,
      details:
        "Once the handover and paperwork are done, mark the listing complete in your dashboard. A final completion message and signed PDF will be sent automatically to both parties."
    }
  ];

  // small fix: replace placeholder icon with ChartPie in mapping below
  getOutSteps[6].Icon = ChartPie;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 py-20 px-6 pt">
      <div className="max-w-6xl mx-auto">
        <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            How it works — Lease Takeover
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Step-by-step flows for tenants looking to take over a lease ("Get in") and for outgoing tenants listing their lease ("Get out").
            Each step includes tips, expected documents, and actions to make the process faster and safer.
          </p>
        </motion.header>

        <motion.main
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* GET IN */}
          <section aria-labelledby="get-in" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
                <ChartPie size={22} />
              </div>
              <div>
                <h2 id="get-in" className="text-lg font-semibold">To get in</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Everything a prospective taker should know.</p>
              </div>
            </div>

            <motion.ul className="space-y-4">
              {getInSteps.map((s, i) => (
                <Step
                  key={i}
                  index={i}
                  Icon={s.Icon}
                  title={s.title}
                  summary={s.summary}
                  details={s.details}
                />
              ))}
            </motion.ul>

            <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              <strong>Pro tips:</strong>
              <ul className="list-disc ml-5 mt-2">
                <li>Always verify payment expectations (first month, security deposit) before taking possession.</li>
                <li>Request a copy of the original lease and any landlord approvals required for a takeover.</li>
                <li>Use the chat timestamps and message history as part of your record in case of disputes.</li>
              </ul>
            </div>
          </section>

          {/* GET OUT */}
          <section aria-labelledby="get-out" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                <Users size={22} />
              </div>
              <div>
                <h2 id="get-out" className="text-lg font-semibold">To get out</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">List your lease and manage handover confidently.</p>
              </div>
            </div>

            <motion.ul className="space-y-4">
              {getOutSteps.map((s, i) => (
                <Step
                  key={i}
                  index={i}
                  Icon={s.Icon}
                  title={s.title}
                  summary={s.summary}
                  details={s.details}
                />
              ))}
            </motion.ul>

            <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              <strong>Pro tips:</strong>
              <ul className="list-disc ml-5 mt-2">
                <li>Include clear photos (meter readings, condition) and a photo of the signed lease page to increase credibility.</li>
                <li>Consider offering a short video walkthrough — it reduces questions and helps applicants self-qualify.</li>
                <li>Keep a checklist for in-person handover (keys, parking pass, remote controls, receipts).</li>
              </ul>
            </div>
          </section>
        </motion.main>

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
          <div className="max-w-3xl mx-auto">
            <p>
              Note: This guide provides general steps and tips for lease takeovers. Always refer to your local laws and your specific lease agreement for detailed requirements and obligations. Our platform facilitates connections and communication but does not replace legal advice or landlord approvals.
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
