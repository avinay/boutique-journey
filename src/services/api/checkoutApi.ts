
import { API_URL, getHeaders, handleApiError } from "./utils";

export const checkoutApi = {
  createOrder: async (orderData: any): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
};
