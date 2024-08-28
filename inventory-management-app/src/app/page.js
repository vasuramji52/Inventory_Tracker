'use client'

import {Box, Stack, Typography, Button, Modal, TextField} from '@mui/material'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#F2DFF7',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

  export default function Home() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState('')
    const [searchItemName, setSearchItemName] = useState('')
    const [searchResult, setSearchResult] = useState('')

    const updateInventory = async () => {
      const snapshot = query(collection(firestore, 'Pantry'))
      const docs = await getDocs(snapshot)
      const inventoryList = []
      docs.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() })
      })
      console.log(inventoryList)
      setInventory(inventoryList)
    }

    useEffect(() => {
      updateInventory()
    }, [])

    
    const addItem = async (item) => {
      const docRef = doc(collection(firestore, 'Pantry'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + 1 })
      } else {
        await setDoc(docRef, { quantity: 1 })
      }
      await updateInventory()
    }
    
    const removeItem = async (item) => {
      const docRef = doc(collection(firestore, 'Pantry'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        if (quantity === 1) {
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, { quantity: quantity - 1 })
        }
      }
      await updateInventory()
    }

    const searchItem = async () => {
      const item = searchItemName
      const docRef = doc(collection(firestore, 'Pantry'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        //logic for if item found
        console.log("Item Found")
        setSearchResult("Item Found")

      } else {
        //logic for if item not found
        console.log("Item Not Found!")
        setSearchResult("Item Not Found")
      }
    }
    
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    
  
    return ( <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <TextField id="outlined-search" label="Search" type="search" 
        value={searchItemName}
        onChange={(e) => setSearchItemName(e.target.value)}>
        Search
      </TextField>

      <Button variant="outlined" onClick={searchItem} >
        Search
      </Button>

      <Typography>
        {searchResult}
      </Typography>

      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#E6B5F7'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Items
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={2} overflow={'auto'}>
          {inventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={5}
            >
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h3'} color={'#333'} textAlign={'center'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
    )
  }
