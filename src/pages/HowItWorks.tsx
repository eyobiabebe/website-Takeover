
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
  DollarSign
} from "lucide-react";

// Step props type
interface StepProps {
  index: number;
  Icon: React.ComponentType<{ size?: number }>;
  title: string;
  summary: string;
  details: string;
}

// Simple Step component
const Step: React.FC<StepProps> = ({ index, Icon, title, summary, details }) => (
  <li className="border-b border-gray-300 py-3 flex items-start gap-3">
    <div className="flex-none">
      <Icon size={20} />
    </div>
    <div>
      <h3 className="font-semibold">{index + 1}. {title} <span className="text-sm text-gray-500">({summary})</span></h3>
      <p className="text-sm text-gray-700">{details}</p>
    </div>
  </li>
);

export default function HowItWorks() {
  const getInSteps: StepProps[] = [
    { index: 0, Icon: UserPlus, title: "Create your account", summary: "Sign up & verify", details: "Register with email or SSO, verify your contact info." },
    { index: 1, Icon: User, title: "Complete your profile", summary: "Add details & docs", details: "Fill personal info, preferences, and upload required documents." },
    { index: 2, Icon: LayoutList, title: "Browse & filter listings", summary: "Filter by type, date, location", details: "Use filters and sorting. Save searches and favorite listings for quick access." },
    { index: 3, Icon: FileText, title: "View lease details", summary: "Inspect terms & docs", details: "Check full lease, costs, photos, and PDF documents." },
    { index: 4, Icon: MessageSquare, title: "Chat with the tenant", summary: "Ask clarifying questions", details: "Ask about parking, utilities, or move-out timelines." },
    { index: 5, Icon: Tag, title: "Apply to takeover", summary: "Submit application & docs", details: "Attach verification docs, desired move-in date, and optional references." },
    { index: 6, Icon: CheckCircle, title: "Tenant accepts & complete paperwork", summary: "Agree terms & e-sign", details: "Receive confirmation and instructions. E-sign documents." },
    { index: 7, Icon: DownloadCloud, title: "Finalization & confirmation", summary: "Mark complete & download PDF", details: "Both parties get a completion notification and PDF record." }
  ];

  const getOutSteps: StepProps[] = [
    { index: 0, Icon: UserPlus, title: "Start by signing up", summary: "Create & verify profile", details: "Create an account and verify your contact info." },
    { index: 1, Icon: FileText, title: "Create a listing", summary: "Add lease information", details: "Add listing and fill all lease fields." },
    { index: 2, Icon: CreditCard, title: "Save draft or continue", summary: "Save progress", details: "Save a draft or continue to payment stage if needed." },
    { index: 3, Icon: DollarSign, title: "Pay listing fee & publish", summary: "Secure listing slot", details: "Pay securely to feature your listing." },
    { index: 4, Icon: Users, title: "Manage applicants", summary: "Dashboard & chat", details: "View applicants, open chats, request info, and shortlist candidates." },
    { index: 5, Icon: CheckCircle, title: "Accept applicant", summary: "Choose the best candidate", details: "Accept the applicant that best matches criteria." },
    { index: 6, Icon: ChartPie, title: "Complete paperwork & checks", summary: "Meet & verify", details: "Finalize documents and complete any verification." },
    { index: 7, Icon: DownloadCloud, title: "Mark listing complete", summary: "Notify the system", details: "Mark the listing complete and generate PDF confirmation." }
  ];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-xl font-bold mb-6">How it works — Lease Takeover</h1>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">To get in</h2>
        <ul className="space-y-2">
          {getInSteps.map(step => <Step key={step.index} {...step} />)}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">To get out</h2>
        <ul className="space-y-2">
          {getOutSteps.map(step => <Step key={step.index} {...step} />)}
        </ul>
      </section>
    </div>
  );
}
