import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function(url, uploadData = undefined){
  try{
    const fetchPro = uploadData ? fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(uploadData), 
    }) : fetch(url);

      const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
      const data = await res.json();            
      if(!res.ok) throw new Error(`${data.message} (${res.status})`);
      return data;
  }catch(err) {
      throw err; 
  }
}
/*
export const getJSON = async function(url) {
    try{
        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
        const data = await res.json();            
        if(!res.ok) throw new Error(`${data.message} (${res.status})`);
        return data;
    }catch(err) {
        throw err; //the promise that returns getJSON will indeed be rejected, pasing the error from an async to 
    }              //another async function
}

export const sendJSON = async function(url, uploadData) {
  try{
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: { //headers are information about the information itself
        'Content-Type': 'application/json', //information in the json format instructed to the API
      },
      body: JSON.stringify(uploadData), //The data that is wanted to be sent
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();            
    if(!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  }catch(err) {
      throw err; //the promise that returns getJSON will indeed be rejected, pasing the error from an async to 
  }              //another async function
}
*/