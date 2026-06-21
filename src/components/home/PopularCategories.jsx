import Link from "next/link";

export default function PopularCategories() {
  const categories = ["Design", "Writing", "Development", "Marketing", "Other"];
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-[rgba(44,26,14,0.1)]">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#2C1A0E]">
        Popular Categories
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/tasks?category=${cat}`}
            className="px-8 py-4 bg-white border border-[rgba(44,26,14,0.1)] rounded-2xl hover:border-[#C8845A] hover:text-[#C8845A] transition-colors font-medium text-[#2C1A0E] shadow-sm hover:shadow-md"
          >
            {cat}
          </Link>
        ))}
      </div>
    </section>
  );
}
