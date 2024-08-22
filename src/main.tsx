import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import IconButton from '@mui/material/IconButton';
import AppsIcon from '@mui/icons-material/Apps';
import ReplyIcon from '@mui/icons-material/Reply';
import { Grid, AppBar, Toolbar, Typography, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import styled from 'styled-components';
import ListItem from '@mui/material/ListItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const AppContainer = styled.div`
  background-color: rgb(32, 33, 36);
  height: 100vh;
`;

// TABLE
const StyledTableContainer = styled(Paper)`
  border-radius: 0px;
`;

const StyledTable = styled(Table)`
  min-width: 650px;
  background-color: rgb(32, 33, 36);
  width: 100%;
`;

const StyledTableHead = styled(TableHead)``;

// it selects the last cell and header cell within the table row.
const StyledTableRow = styled(TableRow)`
  &:last-child td,
  &:last-child th {
    border: 0;
  }
`;

const StyledTableCell = styled(TableCell)`
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: bold !important;
  border-bottom: 1px solid rgba(161, 161, 170, 0.2) !important;
`;

const StyledTableCellRight = styled(TableCell)`
  color: rgba(255, 255, 255, 0.8) !important;
  border-bottom: 1px solid rgba(161, 161, 170, 0.2) !important;
  font-weight: bold !important;
  text-align: right;
  width: 200px;
`;

const StyledTableFirstCellHeader = styled(StyledTableCell)`
  color: #a1a1aa !important;
  width: 100px;
`;

const StyledTableCellHeader = styled(StyledTableCell)`
  color: #a1a1aa !important;
  width: 200px;
`;

const StyledCell = styled(TableCell)`
  color: #a1a1aa !important;
  font-weight: bold !important;
  border-bottom: 1px solid rgba(161, 161, 170, 0.2) !important;
`;

const StyledTableCellIconHeader = styled(StyledTableCell)`
  color: #7890b2 !important;
  width: 100px;
`;

const StyledCenterWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledSVG = styled.svg`
  width: 24px;
  height: 24px;
`;

const CustomFeedIcon = () => {
  return (
    <StyledCenterWrapper>
      <StyledSVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#7890b2" d="M16 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8zM7 7h5v2H7zm10 10H7v-2h10zm0-4H7v-2h10zm-2-4V5l4 4z"></path>
      </StyledSVG>
    </StyledCenterWrapper>
  );
};

let sidebar_titles: string[] = [
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
];

const RowContext = createContext(null);

type DynamicObject = {
  [key: string]: string | number | boolean | object | any;
};

interface TableProps {
  rows: DynamicObject[];
}

// эти элементы не числятся как дети ни в одном другом обьекте в массиве child
function filterFirstLevelRows(rows: DynamicObject[]) {
  const childValues = new Set(rows.flatMap((row) => row.child));
  return rows.filter((row) => !childValues.has(row.id));
}

function filterInitialState(initialState: any[], future: any[]) {
  return initialState.filter((item) => future.includes(item.id));
}

type DataType = Array<object> | number;

const Rows: React.FC<{ data: DataType }> = ({ data }) => {
  const items = useContext(RowContext);

  // Рендерим список всех комментов первого уровня - то есть без родителя
  if (Array.isArray(data)) {
    const firstLevelObjects = filterFirstLevelRows(data);
    return (
      <StyledTableContainer>
        <StyledTable aria-label="simple table">
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableFirstCellHeader>Уровень</StyledTableFirstCellHeader>
              <StyledCell>Наименование работ</StyledCell>
              <StyledTableCellHeader>Основная з/п</StyledTableCellHeader>
              <StyledTableCellHeader>Оборудование</StyledTableCellHeader>
              <StyledTableCellHeader>Накладные расходы</StyledTableCellHeader>
              <StyledTableCellHeader>Сметная прибыль</StyledTableCellHeader>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {firstLevelObjects.map(({ child, id, ...other }) => (
              <Row key={id} {...other}>
                <Rows data={id} />
              </Row>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    );
  }

  const findChild = (data: number) => items?.find((item: DynamicObject[]) => data === item.id);

  let found = findChild(data);

  const filteredInitialState = filterInitialState(items, found?.child);

  // Calculate progressive left padding based on depth
  const getLeftPadding = (depth: number) => {
    console.log(`${depth * 16}px`);
    return `${depth * 16}px`; // Adjust multiplier as needed
  };

  // 2-ой 3-ий вложенный коммент итд
  return (
    <>
      {filteredInitialState.map(({ child, id, ...other }, index) => (
        <React.Fragment key={id}>
          <StyledTableRow key={id}>
            <StyledTableCellIconHeader style={{ padding: '0px', paddingLeft: getLeftPadding(index + 1) }}>
              <CustomFeedIcon />
            </StyledTableCellIconHeader>
            <StyledTableCell style={{ minWidth: '400px' }}>{id}</StyledTableCell>
            <StyledTableCellRight>{id}</StyledTableCellRight>
            <StyledTableCellRight>{id}</StyledTableCellRight>
            <StyledTableCellRight>{id}</StyledTableCellRight>
            <StyledTableCellRight>{id}</StyledTableCellRight>
          </StyledTableRow>
          <Rows data={id} />
        </React.Fragment>
      ))}
    </>
  );
};

interface RowProps {
  children: React.ReactNode;
  equipmentCosts: number;
  id: number;
}

const Row: React.FC<RowProps> = ({ children, equipmentCosts, id }) => {
  return (
    <React.Fragment key={id}>
      <StyledTableRow key={id}>
        <StyledTableCellIconHeader style={{ padding: '0px' }}>
          <CustomFeedIcon />
        </StyledTableCellIconHeader>
        <StyledTableCell style={{ width: '400px' }}>{equipmentCosts}</StyledTableCell>
        <StyledTableCellRight>{equipmentCosts}</StyledTableCellRight>
        <StyledTableCellRight>{equipmentCosts}</StyledTableCellRight>
        <StyledTableCellRight>{equipmentCosts}</StyledTableCellRight>
        <StyledTableCellRight>{equipmentCosts}</StyledTableCellRight>
      </StyledTableRow>
      {children}
    </React.Fragment>
  );
};

function BasicTable({ rows }: TableProps) {
  console.log(rows, 'rows');
  const firstLevelObjects = filterFirstLevelRows(rows);
  console.log(firstLevelObjects, 'firstLevelObjects');
  return (
    <RowContext.Provider value={rows}>
      <Rows data={rows} />
    </RowContext.Provider>
  );
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

export const store = configureStore({
  reducer: {
    [constructionApi.reducerPath]: constructionApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(constructionApi.middleware),
});

setupListeners(store.dispatch);

function App() {
  const { data, error, isLoading } = useGetConstructionQuery('v1/outlay-rows/entity/140037/row/list');
  const [customError, setCustomError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      setCustomError('error');
    } else {
      setCustomError(null);
    }
  }, [error]);

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
              {sidebar_titles.map((text) => (
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
            {isLoading ? <p>Loading data...</p> : error ? <p>Error: {'error'}</p> : data ? <BasicTable rows={data} /> : <p>No data available</p>}
            {customError && <p>Error: {customError}</p>}
          </Grid>
        </Grid>
      </AppContainer>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
