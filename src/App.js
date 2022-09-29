import { useEffect, useState } from 'react';

import './App.css'

import { ThemeProvider, createTheme } from '@mui/material/styles';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal'

import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';

function App() {
  const endpoint = 'https://myttc.ca/finch_station.json'

  const [data, setData] = useState()
  const [search, setSearch] = useState()

  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState()
  const handleClose = () => setOpen(false);

  const fetchApi = async () => {
    const response = await fetch(endpoint)
    const responseJSON = await response.json()
    setData(responseJSON.stops)
  }

  const filteredData = (data) => {
    if (!search) {
      return data
    } else {
      const filtered = data.filter(registro =>
        registro.name.toLowerCase().trim().includes(search)
      )
      return filtered
    }
  }

  const searchData = string => setSearch(string.toLowerCase().trim())

  const handleOpen = (data) => {
    setModalData(data)
    setOpen(true)
  };

  useEffect(() => {
    fetchApi()
  }, [])

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  const modalBoxContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const clickAbleRowStyle = {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#282c34',
      opacity: [0.9, 0.8, 0.7],
    }
  }

  const searchBoxStyle = { display: 'flex', alignItems: 'flex-end', marginBottom: '1em' }

  return (
    <>
      <div className="App">
        <ThemeProvider theme={darkTheme}>
          {/* Título App*/}
          <Typography variant='h4' sx={{ margin: '1rem' }}>Finch Station List</Typography>

          {/* SearchBox */}
          <Box sx={searchBoxStyle}>
            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
            <TextField
              label="Filtrar Búsqueda por Nombre"
              variant="standard"
              sx={{ width: '100%' }}
              onChange={(evento) => searchData(evento.target.value)} />
          </Box>

          {
            // Si la información no se ha cargado, mostrar bloque de texto 
            !data ?
              <Typography variant='h2' sx={{ margin: '1em' }}>Cargando...</Typography>
              //  Sino, cargar tabla
              :
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} >
                  <TableHead>
                    <TableRow>

                      <TableCell>Name</TableCell>
                      <TableCell>Agency</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredData(data).map(({ name, agency, routes }, index) => {
                      let html =
                        <TableRow
                          key={index}
                          sx={clickAbleRowStyle}
                          onClick={() => handleOpen({name, agency, routes})}
                        >
                          <TableCell>{name}</TableCell>
                          <TableCell>{agency}</TableCell>
                        </TableRow>

                      return html
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
          }
        </ThemeProvider>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >

          <Box sx={modalBoxContainerStyle}>
            <IconButton onClick={handleClose} color="error" sx={{position: 'absolute', right: '1em', top: '1em'}}>
              <CloseIcon/>
            </IconButton>
          { modalData ?
          <>
            <Typography variant="h6" component="h2">{modalData.name}</Typography>
            <Typography sx={{ mt: 2, fontWeight: '600'}}>{modalData.agency}</Typography>
            <ul>
              {modalData.routes.map((route, index) => <li key={index}>{route.name}</li>)}
            </ul>
          </>
          : null }
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default App;
