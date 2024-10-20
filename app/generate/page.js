'use client'

import {useState} from 'react'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  CardContent,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";



export default function Generate(){
        const [text, setText] = useState('')
        const [flashcards, setFlashcards] = useState([])
        const [setName, setSetName] = useState('')
        const [dialogOpen, setDialogOpen] = useState(false)



        const handleOpenDialog = () => setDialogOpen(true)
        const handleCloseDialog = () => setDialogOpen(false)

        const saveFlashCards = async () => {
            if (!setName.trim()) {
                alert('Please enter a name for your flashcard set.')
                return
            }
            try{
                const userDocRef = doc(collection(db, 'users'), user.id)
                const userDocSnap = await getDialogContentTextUtilityClass(userDocRef)

                const batch = writeBatch(db)

                if(userDocSnap.exists()) {
                    const userData = userDocSnap.data()
                    const updatedSets = [...(userData.flashcardSets || []), {name: setName }]
                    batch.update(userDocRef, { flashcardSets: updatedSets})
                } else {
                    batch.set(userDocRef, { flashcardSets: [{name: setName}] })
                }

                const setDocRef = doc(collection(userDocRef, 'flashcardets'), setName)
                batch.set(setDocRef, { flashcards })

                await batch.commit()
                

                alert('Flashcards saved successfully!')
                    handleCloseDialog()
                    setSetName('')
                } catch (error) {
                    console.error('Error saving flashcards:', error)
                    alert('An error occurred while saving flashcards. Please try again.')

            }
        }

        const handleSubmit = async () => {
            if(!text.trim()){
                alert('Please enter some text to generate flashcards.')
                return
            }

            try {
                const response = await fetch ('/api/generate',{
                    method: 'POST',
                    body: text,
                })

                if (!response.ok) {
                    throw new Error('Failed to generate flashcards')
                }

                const data = await response.json()
                setFlashcards(data)

            }catch(error) {
                console.error('Error generating flashcards:', error)
                if (process.env.OPENAI_API_KEY){
                  console.log(process.env.OPENAI_API_KEY);
                }else{
                  console.log("nothin")
                }
                alert('An error occured while generating flashcards. Please try again.')
                
            }

        } 

        return (
          <Container>
            <Box sx={{ my: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Generate Flashcards
              </Typography>
              <TextField
                value={text}
                onChange={(e) => setText(e.target.value)}
                label="Enter text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullwidth
              >
                Generate Flashcards
              </Button>

              {flashcards.length > 0 && (
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    Generated Flashcards
                  </Typography>
                  <Grid container spacing={2}>
                    {flashcards.map((flashcard, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6">Front:</Typography>
                            <Typography>{flashcard.front}</Typography>
                            <Typography variant="h6">Back:</Typography>
                            <Typography>{flashcard.back}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog}
                  >
                    Save Flashcards
                  </Button>
                </Box>
              )}
            </Box>

            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
              <DialogTitle>Save Flashcard Set</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please enter a name for your flashcard set.
                </DialogContentText>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Set Name"
                  type="text"
                  fullWidth
                  value={setName}
                  onChange={(e) => setSetName(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={saveFlashCards} color="primary">
                  Save
                </Button>
              </DialogActions>
            </Dialog>
            {/* We'll add falshcard display here*/}
          </Container>
        );

}
