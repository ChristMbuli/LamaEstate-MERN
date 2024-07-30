import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest.get("/houses/" + params.id);
  return res.data;
};

export const ListPageLoader = async ({ request, params }) => {
  //console.log(request);
  const query = request.url.split("?")[1];
  const housePromise = apiRequest("/houses?" + query);
  return defer({
    houseResponse: housePromise,
  });
};
