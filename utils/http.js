import axios from "axios";

export const normalizeUrl= (url)=>{
    if(!url || typeof url !== "string"){
        return url
    }

    if(url.startsWith("http://") || url.startsWith("https://")){
        return url
    }
    return `https://jsonplaceholder.typicode.com${url}`
}

export const executeRequest = async ({
  method = "GET",
  url,
  headers = {},
  body,
}) => {
  const response = await axios({
    method: method.toLowerCase(),
    url: normalizeUrl(url),
    headers,
    data: body,
  });

  return {
    status: response.status,
    data: response.data,
    headers: response.headers,
  }
}

export const formatRequestError = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      message: `${error.response.status} - ${error.response.statusText}`,
    }
  }
  return{
      message: error.message
    }
}
  
