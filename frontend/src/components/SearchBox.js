import React, { useState } from 'react'
import { Form,Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'




function SearchBox() {

    const[keyword ,SetKeyword] = useState('')
    let history = useNavigate()
    const submitHandler= (e)=>{
        e.preventDefault()
        if (keyword) {
            history(
                `/?keyword=${keyword}&page=1`
                )
        } else {
            window.location.reload()
        }
    }
    return (
        <Form onSubmit={submitHandler} className='d-flex '>
            <Form.Control
                type='text'
                name='q'
                onChange={(e) => SetKeyword(e.target.value)}
                className='mr-sm-2 ml-sm-3'
            ></Form.Control>

            <Button
                type='submit'
                variant='outline-success'
                className='p-2 mx-2'

            >
                Submit
            </Button>
        </Form>
    )
}
export default SearchBox