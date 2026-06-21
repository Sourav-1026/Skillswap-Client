import Banner from "@/components/Banner";
import LatestTasks from "@/components/home/LatestTasks";
import TopFreelancers from "@/components/home/TopFreelancers";
import HowItWorks from "@/components/home/HowItWorks";
import PopularCategories from "@/components/home/PopularCategories";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <Banner />
      <LatestTasks />
      <HowItWorks />
      <TopFreelancers />
      <PopularCategories />
    </>
  );
}
