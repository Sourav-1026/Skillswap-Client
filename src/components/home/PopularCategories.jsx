import Link from "next/link";

export default function PopularCategories() {
  const categories = ["Design", "Writing", "Development", "Marketing", "Other"];
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto border-t border-border">
      <h2 className="text-3xl font-bold text-center mb-12 text-primary">
        Popular Categories
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/tasks?category=${cat}`}
            className="px-8 py-4 bg-surface border border-border rounded-2xl hover:border-accent hover:text-accent transition-colors font-medium text-primary shadow-sm hover:shadow-md"
          >
            {cat}
          </Link>
        ))}
      </div>
    </section>
  );
}
