import axios from 'axios'

const API_URL ='/api/tickets'

const getNotes = async(ticketId,token)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(`${API_URL}/${ticketId}/notes`,config)
    // console.log(ticketId);
    // console.log(`${API_URL}/${ticketId}/notes`);

    return response.data
}

const createNote = async(yourData,token)=>{
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    // console.log(`${API_URL}/${yourData.ticketId}/notes`);
    // console.log(noteText);

    const response = await axios.post(`${API_URL}/${yourData.ticketId}/notes`,{
        text: yourData.noteText,
    },config)

    return response.data
}
const noteService = {
    getNotes,
    createNote
}

export default noteService