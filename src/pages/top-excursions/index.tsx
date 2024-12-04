import React, { useState } from "react";
import Excursions from "@/components/molecules/Excursions/Excursions";
import fetchData from "@/helper/FetchData";
import { TourPackage } from "@/types/tour";
import SearchExcursions from "@/components/atoms/SearchExcursions/SearchExcursios";
import Explore from "@/components/molecules/ExploreExcursios";
import Drops from "@/components/atoms/drops";
import { useRouter } from "next/router";

interface HomeProps {
  toursData: TourPackage[];
  categories: Category[];
}

interface Category {
  id: number;
  name: string;
  name_ar: string;
  name_en: string;
  description: string | null;
  is_active: number;
  created_at: string;
  images: any[];
  panar_image: {
    id: number;
    url: string;
    name: string;
  };
}

const Home: React.FC<HomeProps> = ({ toursData, categories }) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  return (
    <div className="lg:px-16 p-2">
      <div className="mt-28">
        <SearchExcursions />
      </div>
      <div className="">
        <Explore
          categories={categories}
          setSelectedCategory={setSelectedCategory}
          router={router}
        />
      </div>
      <div className="lg:my-6 my-0">
        <Drops />
      </div>
      <div>
        <h2 className="md:text-3xl text-xl font-segoe mb-4 text-start">
          Tours and Tickets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:p-0 p-2">
          {toursData.map((tour) => (
            <Excursions
              key={tour.id}
              id={tour.id}
              category={tour.category}
              title={tour.title}
              location={tour.location}
              price={tour.min_price}
              image={tour.main_image.url}
              rating={2}
              destination={tour.destination}
              duration={tour.duration}
              ageRange={tour.age_range}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
  const data = await fetchData("tours?type=excursion");
  const categoriesData = await fetchData("categories");

  return {
    props: {
      toursData: data.data as TourPackage[],
      categories: categoriesData.data || [],
    },
  };
}
