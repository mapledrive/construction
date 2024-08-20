import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useState, useEffect } from 'react';

interface OutlayRow {
  child: string[];
  equipmentCosts: number;
  estimatedProfit: number;
  id: number;
  machineOperatorSalary: number;
  mainCosts: number;
  materials: number;
  mimExploitation: number;
  overheads: number;
  rowName: string;
  salary: number;
  supportCosts: number;
  total: number;
}

// {
//   "id": 140037,
//   "rowName": "8de3c6c5-ff9a-4463-9b7f-26c708268f78"
// }
// с этого ендпоинта приходит весь список
// http://185.244.172.108:8081/v1/outlay-rows/entity/140037/row/list

export const constructionApi = createApi({
  reducerPath: 'constructionApi',
  // baseQuery: fetchBaseQuery({ baseUrl: 'http://185.244.172.108:8081/' }),
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:5000/' }),

  endpoints: (builder) => ({
    getConstruction: builder.query({
      query: (name) => name,
      // Кэшируем данные бесконечно
      keepUnusedDataFor: Infinity,
    }),
  }),
});

export const { useGetConstructionQuery } = constructionApi;

export default function App() {
  const { data, error, isLoading } = useGetConstructionQuery('v1/outlay-rows/entity/140037/row/list');
  const [customError, setCustomError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setCustomError('error');
    } else {
      setCustomError(null);
    }
  }, [error]);

  if (data) console.log(data);

  return (
    <>
      {isLoading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>Error: {'error'}</p>
      ) : data ? (
        data.map((i: OutlayRow) => <div key={i.equipmentCosts}>{i.equipmentCosts}</div>)
      ) : (
        <p>No data available</p>
      )}
      {customError && <p>Error: {customError}</p>}
    </>
  );
}

export const store = configureStore({
  reducer: {
    [constructionApi.reducerPath]: constructionApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(constructionApi.middleware),
});

setupListeners(store.dispatch);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
