import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';
import axios from 'axios';
import { connect } from "react-redux";

const FormA = (props) => {
    const {
        firstPostRoute,
        secondPostRoute,
        data,
        buttonLabel,
        firstField,
        secondField,
        formHeader,
        action
    } = props;

    const [modal, setModal] = useState(false);
    const [unmountOnClose, setUnmountOnClose] = useState(true);

    const toggle = () => setModal(!modal);

    var firstInput
    var secondInput

    const onChangeOne = e => {
       firstInput = e.target.value
    }

    const onChangeTwo = e => {
        secondInput = e.target.value
     }

    const handleSubmit = () => {
        data['uname'] = props.user.username
        data['puname'] = props.user.username
        data['thread_title'] = firstInput
        data['title'] = firstInput
        data['suname'] = firstInput
        data['content'] = secondInput
        data['max_mark'] = secondInput
        data['score'] = secondInput
        data['tutorial_group'] = secondInput
        axios.post(firstPostRoute, data)
        .then(res => {
            if (secondPostRoute) {
                data['post_content'] = secondInput
                axios.post(secondPostRoute, data)
                .then(res => {
                    alert('new thread and post started!')
                })
                .catch(err => {
                    console.log(err)
                })
            }
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
                    <h5 className='mb-4'>{firstField}</h5>
                    <Input id='firstInput' type="textarea" placeholder={"Enter the " + firstField} onChange={onChangeOne} rows={2} />
                </ModalBody>
                <ModalBody>
                    <h5 className='mb-4'>{secondField}</h5>
                    <Input id='secondInput' type="textarea" placeholder={"Enter the " + secondField} onChange={onChangeTwo} rows={5} />
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

export default connect(mapStateToProps)(FormA);