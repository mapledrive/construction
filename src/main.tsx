import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

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
  if (data && data) console.log(data);
  return <>{data ? data.map((i) => <div key={i.equipmentCosts}>{i.equipmentCosts}</div>) : <p>no data</p>}</>;
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
