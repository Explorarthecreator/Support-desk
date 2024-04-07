import {useSelector, useDispatch} from 'react-redux'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {toast} from 'react-toastify'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import { getTicket,closeTicket } from '../features/tickets/ticketSlice'
import { getNotes, createNote, reset as notesReset } from '../features/notes/noteSlice'
import BackButton from '../components/BackButton'
import NoteItem from '../components/NoteItem'
import Spinner from '../components/Spinner'
import { FaPlus } from 'react-icons/fa'

const customStyles = {
    content: {
        width:'600px',
        top:'50%',
        left:'50%',
        right:'auto',
        bottom:'auto',
        marginRight: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'relative',
    },
}

Modal.setAppElement('#root')

function SingleTicket() {
    const {ticket, isLoading, isSuccess, isError, message} = useSelector((state)=> state.ticket)
    const {notes , isLoading: notesIsLoading} = useSelector((state)=> state.notes)

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [noteText, setNoteText] = useState('')
    const params = useParams()

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {ticketId} = useParams()
    useEffect(()=>{
        if(isError){
            toast.error(message)
        }

        dispatch(getTicket(ticketId))
        dispatch(getNotes(ticketId))
        // eslint-disable-next-line
    },[isError,message,ticketId])

    const onTicketClose =(e)=>{
        dispatch(closeTicket(ticketId))

        toast.success('Ticket Closed')
        navigate('/tickets')
    }

    const onNoteSubmit = (e)=>{
        e.preventDefault()
        const  yourData = {
            noteText,
            ticketId
        }
        dispatch(createNote(yourData))
        dispatch(getNotes(ticketId))
        // console.log( ticketId);
        closeModal()
    }
    const openModal = ()=>{
        setModalIsOpen(true)
    }
    const closeModal = ()=>{
        setModalIsOpen(false)
    }

    if(isLoading || notesIsLoading){
        return <Spinner/>
    }

    if(isError){
        return <h3>Something went wrong</h3>
    }
  return (
    <div className='ticket-page'>
        <header className="ticket-header">
            <BackButton url={'/tickets'}/>
            <h2>
                Ticlet ID: {ticket._id}
                <span className={`status status-${ticket.status}`}>
                    {
                        ticket.status
                    }
                </span>
            </h2>
            <h3>
                Date Submitted: {
                    new Date(ticket.createdAt).toLocaleString('en-US')
                }
            </h3>
            <h3> 
                Product: {ticket.product}
            </h3>
            <hr />
            <div className="ticket-desc">
                <h3>
                    Description of Issue
                </h3>
                <p>
                    {
                        ticket.description
                    }
                </p>
            </div>
            <h2>
                Notes
            </h2>
        </header>

        {
            ticket.status !== 'close' &&
            <button className="btn" onClick={openModal}>
                <FaPlus/>Add Note
            </button>
        }

        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={customStyles} contentLabel='Add Note'>
            <h2>
                Add Note 
            </h2>
            <button className="btn-close" onClick={closeModal}>X</button>

            <form onSubmit={onNoteSubmit}>
                <div className="form-group">
                    <textarea name="noteText" id="noteText" className='form-control' placeholder='Note Text' value={noteText} onChange={(e)=>setNoteText(e.target.value)}></textarea>
                </div>
                <div className="form-group">
                    <button className="btn" type='submit'>
                        Submit
                    </button>
                </div>
            </form>
        </Modal>

        {
            notes.map((note)=>(
                <NoteItem key={note._id} note={note} />
            ))
        }
        {
            ticket.status !=='closed'&& (
                <button className="btn btn-block btn-danger" onClick={onTicketClose}>
                    Close Tiket
                </button>
            )
        }
    </div>
  )
}

export default SingleTicket