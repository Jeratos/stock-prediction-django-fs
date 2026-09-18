// import axiosInstance from "../axiosInstance";
// import axios from "axios";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

interface headerData {
  message: string;
  user: object;
  data: string;
}

export default function Main() {

  // const getData = () => {
  //   axiosInstance.get("/protected-view/")
  //     .then((response) => {
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }
  const [headerData, setHeaderData] = useState<headerData | null>(null);

  useEffect(()=>{
    
    const getDataWithToken = async() => {
      try{
          const response = await axiosInstance.get(`/protected-view/`)
          console.log(response.data);
          setHeaderData(response.data);
    }catch(error){
      console.log(error);
    }
  }
  getDataWithToken();
},[])

  return (
    <section className="m-5 p-5">
      <div className="bg-gray-500 h-96 w-250 flex justify-center items-center flex-col rounded-lg  container mx-auto px-20 py-10 shadow-2xl/40 shadow-gray-900">
        <h1 className="text-5xl font-bold text-center mb-5">
          Stock Market Prediction
        </h1>

        <div className="text-center text-md mt-5">
          {headerData?.data}
        </div>
      </div>
    </section>
  );
}
