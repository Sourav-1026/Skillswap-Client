import { BsPencilSquare } from "react-icons/bs";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { MdOutlinePayments } from "react-icons/md";

const steps = [
  {
    icon: BsPencilSquare,
    step: "01",
    title: "Post a Task",
    description:
      "Describe what you need done, set your budget, and publish it to our skilled freelancers.",
  },
  {
    icon: HiOutlineClipboardDocumentList,
    step: "02",
    title: "Get Proposals",
    description:
      "Review bids from qualified freelancers, check their profiles, and select the best fit.",
  },
  {
    icon: MdOutlinePayments,
    step: "03",
    title: "Hire and Pay",
    description:
      "Accept the proposal, watch the magic happen, and pay securely once the task is complete.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-10 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        {/* <span className="text-xs font-semibold tracking-widest uppercase text-[#C8845A] mb-3 block">
          Simple Process
        </span> */}
        <h2 className="text-3xl font-bold text-[#F5E6D3]">How It Works</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map(({ icon: Icon, step, title, description }, i) => (
          <div
            key={i}
            className="relative flex flex-col gap-5 rounded-2xl bg-surface border border-[rgba(255,220,180,0.12)] p-7 hover:border-[#C8845A] transition-colors duration-300 group"
          >
            {/* Step number — top right */}
            <span className="absolute top-5 right-5 text-xs font-mono font-bold text-[rgba(200,132,90,0.35)] group-hover:text-[#C8845A] transition-colors">
              {step}
            </span>

            {/* Icon */}
            <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#4A2E1C] border border-[rgba(255,220,180,0.12)] text-[#C8845A] group-hover:bg-[#C8845A] group-hover:text-[#2C1A0E] transition-all duration-300">
              <Icon className="size-6" />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-[#F5E6D3]">{title}</h3>
              <p className="text-sm leading-relaxed text-[rgba(245,230,211,0.65)]">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
