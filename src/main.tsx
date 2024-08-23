import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import React, { useState, useEffect, createContext, useContext } from 'react';
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
  cursor: pointer;
`;

const StyledSVG = styled.svg`
  width: 24px;
  height: 24px;
`;

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

type ObjectType = {
  [key: string]: any;
};

// эти элементы не числятся как потомки ни в одном другом обьекте в массиве child
function filterFirstLevelRows(rows: any) {
  const childValues = new Set(rows.flatMap((row: any) => row.child));
  return rows.filter((row: ObjectType) => !childValues.has(row.id));
}

function filterInitialState(initialState: ObjectType[] | null, future: any[]) {
  return initialState?.filter((item: any) => future.includes(item.id));
}

function generateRandomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type DataType = Array<object> | number;

interface CustomFeedIconProps {
  parentId: number | undefined;
  onClick: (parentId: number | undefined) => void;
}

const CustomFeedIcon: React.FC<CustomFeedIconProps> = ({ parentId, onClick }) => {
  return (
    <StyledCenterWrapper onClick={() => onClick(parentId)}>
      <StyledSVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="#7890b2" d="M16 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8zM7 7h5v2H7zm10 10H7v-2h10zm0-4H7v-2h10zm-2-4V5l4 4z"></path>
      </StyledSVG>
    </StyledCenterWrapper>
  );
};

const Rows: React.FC<{ data: DataType }> = ({ data }) => {
  const items = useContext(RowContext);

  const [addChildItem] = useAddChildItemMutation();

  const handleDoubleEdit = (parentId: number) => {
    console.log('Button double-clicked!', parentId);
  };

  const handleAddChild = (parentId: number) => {
    console.log('Добавил потомка элементу ', parentId);
    const newItem = {
      child: [],
      equipmentCosts: 0,
      estimatedProfit: 0,
      id: generateRandomInteger(50, 200),
      machineOperatorSalary: 0,
      mainCosts: 0,
      materials: 0,
      mimExploitation: 0,
      overheads: 0,
      rowName: 'none',
      salary: 0,
      supportCosts: 0,
      total: 0,
    };

    addChildItem(newItem)
      .then((response) => {
        console.log('Child item added successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error adding child item:', error);
      });

    // Обновить кэш локально
    // refetch();
  };

  // Рендерим список всех комментов первого уровня - то есть без родителя
  if (Array.isArray(data)) {
    const firstLevelObjects: ObjectType[] = filterFirstLevelRows(data);
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
            {firstLevelObjects.map(({ id, rowName }) => (
              <React.Fragment key={id}>
                <StyledTableRow onDoubleClick={() => handleDoubleEdit(id)}>
                  <StyledTableCellIconHeader style={{ padding: '0px' }}>
                    <CustomFeedIcon parentId={id} onClick={() => handleAddChild(id)} />
                  </StyledTableCellIconHeader>
                  <StyledTableCell style={{ minWidth: '400px' }}>{rowName}</StyledTableCell>
                  <StyledTableCellRight>{id}</StyledTableCellRight>
                  <StyledTableCellRight>{id}</StyledTableCellRight>
                  <StyledTableCellRight>{id}</StyledTableCellRight>
                  <StyledTableCellRight>{id}</StyledTableCellRight>
                </StyledTableRow>
                <Rows data={id} />
              </React.Fragment>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    );
  }

  const findChild = (data: number, items?: ObjectType[] | null | undefined): ObjectType | null => {
    return items?.find((item: ObjectType) => data === item.id) ?? null;
  };

  let found = findChild(data, items);

  const filteredInitialState = filterInitialState(items, found?.child);

  // Вычислить левый паддинг прогрессивно на основе depth
  const getLeftPadding = (depth: number) => `${depth * 16}px`;

  // 2-ой 3-ий вложенный коммент итд
  return (
    <>
      {filteredInitialState?.map(({ child, id, rowName, ...other }, index) => (
        <React.Fragment key={id}>
          <StyledTableRow onDoubleClick={() => handleDoubleEdit(id)}>
            <StyledTableCellIconHeader style={{ padding: '0px', paddingLeft: getLeftPadding(index + 1) }}>
              <CustomFeedIcon parentId={id} onClick={() => handleAddChild(id)} />
            </StyledTableCellIconHeader>
            <StyledTableCell style={{ minWidth: '400px' }}>{rowName}</StyledTableCell>
            <StyledTableCellRight>{id}</StyledTableCellRight>
            <StyledTableCellRight>{id}</StyledTableCellRight>
            <StyledTableCellRight>{id}</StyledTableCellRight>
            <StyledTableCellRight>{id}</StyledTableCellRight>
          </StyledTableRow>
          <Rows data={id} {...other} />
        </React.Fragment>
      ))}
    </>
  );
};

export const constructionApi = createApi({
  reducerPath: 'constructionApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://185.244.172.108:8081/' }),
  // baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:5000/' }),  // локальный сервер
  endpoints: (builder) => ({
    getConstruction: builder.query({
      query: (name) => name,
      keepUnusedDataFor: Infinity, // Кэшируем данные бесконечно
    }),
    addChildItem: builder.mutation({
      query: (newItem) => ({
        url: 'v1/outlay-rows/entity/140037/row/create',
        method: 'POST',
        body: newItem,
      }),
    }),
    updateRow: builder.mutation({
      query: (updatePayload) => ({
        url: `v1/outlay-rows/entity/140037/row/${`0`}/update`,
        method: 'PUT',
        body: updatePayload.data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log('Update successful:', result, args);
          dispatch(constructionApi.util.resetApiState());
        } catch (error) {
          console.error('Update failed:', error);
        }
      },
    }),
  }),
});

export const { useGetConstructionQuery, useAddChildItemMutation, useUpdateRowMutation } = constructionApi;

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
      <RowContext.Provider value={data && data.length > 0 ? data : mock}>
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
              {isLoading ? <p>Loading data...</p> : error ? <Rows data={mock} /> : data && data.length > 0 ? <Rows data={data} /> : <Rows data={mock} />}
            </Grid>
          </Grid>
        </AppContainer>
      </RowContext.Provider>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
);

const mock: ObjectType[] = [
  {
    child: [1],
    equipmentCosts: 0,
    estimatedProfit: 0,
    id: 0,
    machineOperatorSalary: 0,
    mainCosts: 0,
    materials: 0,
    mimExploitation: 0,
    overheads: 0,
    rowName: 'Южная строительная площадка',
    salary: 0,
    supportCosts: 0,
    total: 0,
  },
  {
    child: [2, 3],
    equipmentCosts: 1,
    estimatedProfit: 1,
    id: 1,
    machineOperatorSalary: 1,
    mainCosts: 1,
    materials: 1,
    mimExploitation: 1,
    overheads: 1,
    rowName: 'Фундаментальные работы',
    salary: 1,
    supportCosts: 1,
    total: 1,
  },
  {
    child: [],
    equipmentCosts: 2,
    estimatedProfit: 2,
    id: 2,
    machineOperatorSalary: 2,
    mainCosts: 2,
    materials: 2,
    mimExploitation: 2,
    overheads: 2,
    rowName: 'Статья работы №1',
    salary: 2,
    supportCosts: 2,
    total: 2,
  },
  {
    child: [],
    equipmentCosts: 3,
    estimatedProfit: 3,
    id: 3,
    machineOperatorSalary: 3,
    mainCosts: 3,
    materials: 3,
    mimExploitation: 3,
    overheads: 3,
    rowName: 'Статья работы №2',
    salary: 3,
    supportCosts: 3,
    total: 3,
  },
  {
    child: [],
    equipmentCosts: 4,
    estimatedProfit: 4,
    id: 4,
    machineOperatorSalary: 4,
    mainCosts: 4,
    materials: 4,
    mimExploitation: 4,
    overheads: 4,
    rowName: 'Отчеты',
    salary: 4,
    supportCosts: 4,
    total: 4,
  },
];
