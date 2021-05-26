import { useState, useEffect } from "react";
import { utils } from "ethers";
import {Modal, Row, Col, Button, Form } from 'react-bootstrap';

import styles from '../styles/PriceEditorModal.module.css';

const PriceEditorModal = (props) => {
    console.log("PROPPI>>", props)
    const {setEditPriceModalOpen, editPriceModalOpen, productDataForModal, contract} = props;

    const [newPrice, setNewPrice] = useState(null);
    const [theTransaction, setTheTransaction] = useState(null);

    useEffect( () => {

        console.log("TRANSACTION UPDATE --> ", theTransaction)

    }, [theTransaction])

    //functions
    const _handleChangePrice = async () => {

        let overrides = {
            gasLimit: 1000000
        };

        const newPriceInt = parseInt(newPrice)
        if (newPrice === NaN) {return}

        // console.log(utils.parseEther(newPrice))

		const transaction = await contract.modifyOperaPrice({operaId: productDataForModal.mappingContractId, newprice: utils.parseUnits(newPrice, 18)}, overrides);
		await transaction.wait();

        setTheTransaction(transaction);

        console.log("TX", transaction)
	};



    return (
        <Modal
            show={editPriceModalOpen}
            onHide={() => setEditPriceModalOpen(false)}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Change NFT Price</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className={styles.currentPriceTitle}><strong>Current Price:</strong></p>
                <p className={styles.currentPriceText}>23</p>
                <p><strong>New Price:</strong></p>
                <Form>
                    <Form.Group >
                        <Form.Control onChange={(e) => setNewPrice(e.target.value)} type="email" placeholder="" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditPriceModalOpen(false)}>
                Close
            </Button>
            <Button onClick={() => _handleChangePrice()} variant="primary">Save New Price</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PriceEditorModal;