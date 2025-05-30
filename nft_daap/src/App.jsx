import { useState, useRef, useEffect } from 'react'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Button, InputLabel, TextField, Box, Typography, Modal, Snackbar, Alert, CircularProgress, Fade } from '@mui/material';
import theme from './assets/theme.jsx'

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

import { connectWallet, getCurrentWallet, mintNFT } from './contract/interact.js';

import { uploadToNFTStorage } from './assets/uploadToNFTStorage.js';

function App() {
  const [account, setAccount] = useState(null);
  const [nftName, setNftName] = useState('');
  const [description, setDescription] = useState('')

  const [imageFile, setImageFile] = useState(null); // for uploading
  const [image, setImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const [NFTState, setNFTState] = useState({ NFTCreated: false, NFTlink: '' });
  const { NFTCreated, NFTlink } = NFTState;
  const [loading, setLoading] = useState(false);
  const [toastState, setToastState] = useState({ toastOpen: false, toastMsg: '', toastSeverity: '' });
  const { toastOpen, toastMsg, toastSeverity } = toastState;

  const handleImage = (fileList) => {
    const file = fileList[0];
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleConnect = async () => {
    const selectedAccount = await connectWallet();

    setAccount(selectedAccount)
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  
  if (!account) {
    return setToastState({ toastOpen: true, toastMsg: 'Connect Wallet!', toastSeverity: 'warning' });
  }
  if (!(nftName && description && imageFile)) {
    return setToastState({ toastOpen: true, toastMsg: 'Complete all fields!', toastSeverity: 'warning' });
  }

  
  setNFTState({ NFTCreated: false, NFTlink: '' });
  setLoading(true);

  try {
    const metadataUrl = await uploadToNFTStorage(nftName, description, imageFile);
    const link = await mintNFT(account, metadataUrl);

    if(link) {
      setNFTState({
        NFTCreated: true,
        NFTlink: link
      });

      setToastState({
        toastOpen: true,
        toastMsg: 'NFT Created!',
        toastSeverity: 'success'
      });
    }
    

  } catch (err) {
    setToastState({
      toastOpen: true,
      toastMsg: err.message,
      toastSeverity: 'error'
    });
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {

  }, [loading]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const currentAccount = await getCurrentWallet();
        setAccount(currentAccount);
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };

    fetchWallet();
  }, [setAccount]);

  return (
    <ThemeProvider theme={theme}>
      <div className='min-h-screen flex flex-col bg-navy'>
        {/* Top Nav */}
        <div className="flex justify-between items-center p-5 sm:px-24 ">

          <Box display="flex" alignItems="center" gap={1}>
            <AutoAwesomeIcon sx={{ color: theme.palette.primary.main }} />

            <Typography variant="h6" component='h1' color="primary"
              sx={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: {
                  xs: '0.85rem',
                  sm: '0.95rem',
                  md: '1.2rem',
                },
              }}>
              NFT-Gen
            </Typography>
          </Box>

          <Button variant='contained'
            onClick={handleConnect}
          >
            {account ? `Connected: ${account.slice(0, 5)}...${account.slice(-4)}` : "Connect Wallet"}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className='flex-1 flex items-center justify-center'>
          <Box
            sx={{
              width: '25rem',
              p: 2,
              border: '1px solid',
              borderColor: theme.palette.primary.main,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Button
              onDragEnter={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setDragOver(false);
              }}
              onDrop={e => {
                e.preventDefault();
                handleImage(e.dataTransfer.files);
                setDragOver(false);
              }}
              className='p-5'
              sx={{
                width: '100%',
                aspectRatio: '1/1',
                background: image ? `url(${image}) center/contain no-repeat` : 'rgba(0, 0, 0, 0.36)',
                position: 'relative',
                overflow: 'hidden',
                color: image && 'transparent',
                boxShadow: 'none',
                '&:hover': { boxShadow: 'none', backgroundColor: 'rgba(0, 0, 0, 0.47)' },
                '&:focus': { boxShadow: 'none' },
              }}
              variant='contained'
              autoComplete="off"
              startIcon={!image && <CloudUploadIcon />} >

              {!image ? 'Upload Image' : ''}
              <input
                type="file"
                accept="image/*"
                onChange={e => handleImage(e.target.files)}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: '2px',
                  opacity: 0,
                  zIndex: 1,
                  cursor: 'pointer',
                }}
              />

              {/* Overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.26)',
                  opacity: dragOver ? 1 : 0,
                  pointerEvents: 'none',
                  zIndex: 1,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              />
            </Button>
            <TextField variant="outlined" size='small' label='Name' sx={{ borderColor: theme.palette.primary.main }}
              value={nftName}
              onChange={e => setNftName(e.target.value)}
            />
            <TextField variant="outlined" size='small' label='Description' sx={{ borderColor: theme.palette.primary.main }}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <Button fullWidth type='submit' variant='contained' className='tracking-wider' >Create NFT</Button>
          </Box>
        </form>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={toastOpen}
        autoHideDuration={5000}
        onClose={(state) => setToastState({ ...state, open: false })}
      >
        <Alert
          onClose={(state) => setToastState({ ...state, open: false })}
          severity={toastSeverity}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {toastMsg}
        </Alert>
      </Snackbar>

      <Modal
        open={NFTCreated}
        onClose={() => setNFTState(state => ({ ...state, NFTCreated: false }))}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Fade
          in={NFTCreated}
        >
          <Box
            sx={{
              p: 1,
              border: '1px solid',
              borderColor: theme.palette.primary.main,
            }}

          >
            <Box
              sx={{
                backgroundColor: theme.palette.secondary.main,
              }}
              className='w-full sm:w-[40rem] break-all flex flex-col items-center justify-center gap-5 p-10'
            >
              <p className='text-white'>View NFT on Blockscout:</p>
              <a href={`https://${NFTlink}`}
                target="_blank" rel="noopener noreferrer"
                className='font-normal text-sm text-orange-400 tracking-widest hover:underline underline-offset-4'
              >
                {NFTlink ? `${NFTlink.slice(0, 40)}...` : ''}
              </a>
              <div className='w-full flex items-center justify-end '>
                <Button variant='contained' size='small' onClick={() => setNFTState(state => ({ ...state, NFTCreated: false }))}>Close</Button>
              </div>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Modal open={loading}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </Modal>

    </ThemeProvider>
  )
}

export default App
