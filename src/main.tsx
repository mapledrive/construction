import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import FeedIcon from '@mui/icons-material/Feed';
import IconButton from '@mui/material/IconButton';
import AppsIcon from '@mui/icons-material/Apps';
import ReplyIcon from '@mui/icons-material/Reply';
import { Grid, AppBar, Toolbar, Typography, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import styled from 'styled-components';
import ListItem from '@mui/material/ListItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const AppContainer = styled.div`
  background-color: rgb(32, 33, 36);
  height: 100vh;
`;

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [createData('Eclair', 262, 16.0, 24, 6.0), createData('Cupcake', 305, 3.7, 67, 4.3), createData('Gingerbread', 356, 16.0, 49, 3.9)];

function BasicTable() {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: '0px' }}>
      <Table sx={{ minWidth: 650, backgroundColor: 'rgb(32, 33, 36)' }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ color: '#a1a1aa !important', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }}>Уровень</TableCell>
            <TableCell sx={{ color: '#a1a1aa !important', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }}>Наименование работ</TableCell>
            <TableCell sx={{ color: '#a1a1aa !important', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }} align="right">
              Основная з/п
            </TableCell>
            <TableCell sx={{ color: '#a1a1aa !important', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }} align="right">
              Оборудование
            </TableCell>
            <TableCell sx={{ color: '#a1a1aa !important', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }} align="right">
              Накладные расходы
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" sx={{ color: '#7890b2 !important', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }}>
                <FeedIcon />
              </TableCell>
              <TableCell sx={{ color: '#a1a1aa !important', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }}>
                {row.name} {row.calories}
              </TableCell>
              <TableCell align="right" sx={{ color: '#a1a1aa !important', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }}>
                {row.fat}
              </TableCell>
              <TableCell align="right" sx={{ color: '#a1a1aa !important', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }}>
                {row.carbs}
              </TableCell>
              <TableCell align="right" sx={{ color: '#a1a1aa !important', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }}>
                {row.protein}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

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

function Layout() {
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

  const theme = createTheme({
    palette: {
      primary: {
        main: '#a1aaa6',
      },
    },
    typography: {
      fontSize: 14,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <CssBaseline />
        <Grid container spacing={0}>
          {/* Header */}
          <Grid item xs={12}>
            <AppBar position="static" sx={{ backgroundColor: 'rgb(32, 33, 36)', borderTop: '1px solid rgba(161, 161, 170, 0.2)' }}>
              <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, color: '#a1a1aa' }}>
                  <AppsIcon />
                </IconButton>
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2, color: '#a1a1aa' }}>
                  <ReplyIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" component="div" sx={{ mr: 2, color: '#a1a1aa', fontSize: 14, fontWeight: 'bold' }}>
                  Просмотр
                </Typography>
                <Typography variant="h6" color="inherit" component="div" sx={{ mr: 2, color: '#a1a1aa', fontSize: 14, fontWeight: 'bold' }}>
                  Управление
                </Typography>
              </Toolbar>
            </AppBar>
            <AppBar
              position="static"
              sx={{ backgroundColor: 'rgb(32, 33, 36)', borderTop: '1px solid rgba(161, 161, 170, 0.2)', borderBottom: '1px solid rgba(161, 161, 170, 0.2)' }}
            >
              <Toolbar variant="dense">
                <Typography variant="h6" color="inherit" component="div" sx={{ mr: 2, color: '#a1a1aa', fontSize: 14, fontWeight: 'bold' }}>
                  Название проекта
                </Typography>
              </Toolbar>
            </AppBar>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={1.5} sx={{ color: '#a1a1aa', borderRight: '1px solid rgba(161, 161, 170, 0.2)', height: 'calc(100vh - 99px)', paddingTop: '10px !important' }}>
            {/* Sidebar content */}
            <List sx={{ padding: 0 }}>
              {[
                'По проекту',
                'Обьекты',
                'РД',
                'МТО',
                'СМР',
                'График',
                'МиМ',
                'Рабочие',
                'Капвложения',
                'Бюджет',
                'Финансирование',
                'Панорамы',
                'Камеры',
                'Поручения',
                'Контрагенты',
              ].map((text) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton key={text} sx={{ py: 0, minHeight: 32, color: 'rgba(255,255,255,.8)', paddingRight: '9px', paddingLeft: '22px' }}>
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      <DeveloperBoardIcon />
                    </ListItemIcon>
                    <ListItemText primary={text} primaryTypographyProps={{ fontSize: 14, fontWeight: 'bold' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Grid>
          {/* Main content */}
          <Grid item xs={10.5}>
            <BasicTable />
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
          </Grid>
        </Grid>
      </AppContainer>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Layout />
  </Provider>
);
