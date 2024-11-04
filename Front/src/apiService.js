// services/apiService.js

// import { API_URL } from './config';

// class ApiService {
//   async fetchData(endpoint) {
//     const url = `${API_URL}/${endpoint}`;
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       throw error;
//     }
//   }

//   async postData(endpoint, body) {
//     const url = `${API_URL}/${endpoint}`;
//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//       });
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error posting data:', error);
//       throw error;
//     }
//   }

//   async putData(endpoint, body) {
//     const url = `${API_URL}/${endpoint}`;
//     try {
//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(body),
//       });
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error putting data:', error);
//       throw error;
//     }
//   }

//   // Other methods for handling data operations
// }

// export default new ApiService();
