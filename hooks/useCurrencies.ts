import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api-client';

export interface Currency {
  id: string;
  name: string;
  flag: string;
  code: string;
}

interface CurrenciesResponse {
  currencies: Currency[];
}

export const useCurrencies = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<CurrenciesResponse>('/v1/currencies');
      setCurrencies(response.data.currencies);
    } catch (err) {
      console.error('Error fetching currencies:', err);
      setError('Failed to load currencies');
      setCurrencies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrencyByCode = (code: string): Currency | undefined => {
    return currencies.find((currency) => currency.code === code);
  };

  return {
    currencies,
    isLoading,
    error,
    getCurrencyByCode,
    refetch: fetchCurrencies,
  };
};
