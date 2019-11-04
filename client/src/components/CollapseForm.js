import React, { useState, Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';


const CollapseForm = (props) => {
    const {
      buttonLabel,
      className
    } = props;
  
    const [modal, setModal] = useState(true);
    
    const toggle = () => {
        return setModal(!modal);
    };
    
    return (
        <div className = "CollapseForm">
            <Modal isOpen={modal} toggle={toggle} className={CollapseForm}>
                <ModalHeader toggle={toggle}>Title</ModalHeader>
                <ModalBody>
                    <Input type="textarea" placeholder="Start typing" rows={5} />
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={toggle}>Create</Button>{' '}
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>     
        </div>
    );
}

export default CollapseForm;
