export default function HowItWorks() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#2C1A0E]">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div>
          <div className="w-16 h-16 mx-auto bg-[#F5E6D3] rounded-2xl flex items-center justify-center mb-6 text-[#C8845A] text-2xl font-bold">
            1
          </div>
          <h3 className="text-xl font-bold text-[#2C1A0E] mb-3">Post a Task</h3>
          <p className="text-gray-600">
            Describe what you need done, set your budget, and publish it to our
            skilled freelancers.
          </p>
        </div>
        <div>
          <div className="w-16 h-16 mx-auto bg-[#F5E6D3] rounded-2xl flex items-center justify-center mb-6 text-[#C8845A] text-2xl font-bold">
            2
          </div>
          <h3 className="text-xl font-bold text-[#2C1A0E] mb-3">
            Get Proposals
          </h3>
          <p className="text-gray-600">
            Review bids from qualified freelancers, check their profiles, and
            select the best fit.
          </p>
        </div>
        <div>
          <div className="w-16 h-16 mx-auto bg-[#F5E6D3] rounded-2xl flex items-center justify-center mb-6 text-[#C8845A] text-2xl font-bold">
            3
          </div>
          <h3 className="text-xl font-bold text-[#2C1A0E] mb-3">
            Hire and Pay
          </h3>
          <p className="text-gray-600">
            Accept the proposal, watch the magic happen, and pay securely once
            the task is complete.
          </p>
        </div>
      </div>
    </section>
  );
}
