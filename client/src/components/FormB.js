import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';
import axios from 'axios';
import { connect } from "react-redux";

const FormB = (props) => {
    const {
        postRoute,
        data,
        buttonLabel,
        field,
        formHeader,
        action
    } = props;

    const [modal, setModal] = useState(false);
    const [unmountOnClose, setUnmountOnClose] = useState(true);

    const toggle = () => setModal(!modal);

    var input

    const onChange = e => {
       input = e.target.value
    }

    const handleSubmit = () => {
        data['uname'] = props.user.username
        data['puname'] = props.user.username
        data['post_content'] = input
        data['category'] = input
        axios.post(postRoute, data)
        .then(res => {
            window.location.reload()
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <div>
            <Form inline onSubmit={(e) => e.preventDefault()}>
                <Button color="info" onClick={toggle}>{buttonLabel}</Button>
            </Form>
            <Modal isOpen={modal} toggle={toggle} unmountOnClose={unmountOnClose}>
                <ModalHeader toggle={toggle}>{formHeader}</ModalHeader>
                <ModalBody>
                    <h5 className='mb-4'>{field}</h5>
                    <Input id='input' type="textarea" placeholder={"Enter the " + field} onChange={onChange} rows={4} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={handleSubmit}>{action}</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(FormB);