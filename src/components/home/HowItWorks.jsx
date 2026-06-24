export default function HowItWorks() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12 text-primary">
        How It Works
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div>
          <div className="w-16 h-16 mx-auto bg-surface border border-border rounded-2xl flex items-center justify-center mb-6 text-accent text-2xl font-bold">
            1
          </div>
          <h3 className="text-xl font-bold text-primary mb-3">Post a Task</h3>
          <p className="text-secondary">
            Describe what you need done, set your budget, and publish it to our
            skilled freelancers.
          </p>
        </div>
        <div>
          <div className="w-16 h-16 mx-auto bg-surface border border-border rounded-2xl flex items-center justify-center mb-6 text-accent text-2xl font-bold">
            2
          </div>
          <h3 className="text-xl font-bold text-primary mb-3">Get Proposals</h3>
          <p className="text-secondary">
            Review bids from qualified freelancers, check their profiles, and
            select the best fit.
          </p>
        </div>
        <div>
          <div className="w-16 h-16 mx-auto bg-surface border border-border rounded-2xl flex items-center justify-center mb-6 text-accent text-2xl font-bold">
            3
          </div>
          <h3 className="text-xl font-bold text-primary mb-3">Hire and Pay</h3>
          <p className="text-secondary">
            Accept the proposal, watch the magic happen, and pay securely once
            the task is complete.
          </p>
        </div>
      </div>
    </section>
  );
}
