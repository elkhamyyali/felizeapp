import Pagination from "@/components/molecules/Pagination";
import Laptop from "@/components/templates/laptop/Laptop";
import Mobile from "@/components/templates/mobile/Mobile";
import fetchData from "@/helper/FetchData";
import { ToursData } from "@/types/tour";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface HomeProps {
  toursData: ToursData;
  currentPage: number;
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

export default function Home({
  toursData,
  currentPage,
  categories,
}: HomeProps) {
  const router = useRouter();
  const toursPerPage = 6;
  const pageCount = Math.ceil(toursData.data.length / toursPerPage);

  const handlePageChange = (selectedItem: { selected: number }) => {
    const selectedPage = selectedItem.selected;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: selectedPage + 1 },
    });
  };

  return (
    <div className="md:p-6 p-0 bg-[#FAFAFA] lg:px-16">
      <div className="block lg:hidden">
        <Mobile toursData={toursData} categories={categories} />
      </div>
      <div className="hidden lg:block">
        <Laptop toursData={toursData} categories={categories} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { query } = context;
  const currentPage = query.page ? parseInt(query.page) : 1;
  let endpoint = "tours?type=tour_package";
  if (Object.keys(query).length > 0) {
    const queryParams = new URLSearchParams(query).toString();
    endpoint += `&${queryParams}`;
  }
  const data: ToursData = await fetchData(endpoint);
  const categoriesData = await fetchData("categories");

  return {
    props: {
      toursData: data,
      categories: categoriesData.data,
      currentPage,
    },
  };
}
