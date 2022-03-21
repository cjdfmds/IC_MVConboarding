
import React, { useEffect, useState } from 'react';
import axios from 'axios';      //for LINKING with backend
import { Dropdown,Table, Container, Button, Header, Modal, Icon, Form } from 'semantic-ui-react'  //added


const Sales = () => {

    const [SelectedCurrentElement, setSelectedCurrentElement] = useState(null)
    const [open, setOpen] = React.useState(false)
    const [CreateModalOpen, setCreateModalOpen] = React.useState(false)
    const [DeleteModalOpen, setDeleteModalOpen] = React.useState(false)

    const [CustomerEntries, setCustomerEntries] = useState([]);
    const [StoreEntries, setStoreEntries] = useState([]);
    const [ProductEntries, setProductEntries] = useState([]);
    //const [SalesEntries, setSalesEntries] = useState([]);


    const expandModal = (CurrentElement) => {
        //essentially is the iterator passed in pointing to the current element
        setSelectedCurrentElement(CurrentElement);  //hook takes in the current element
        setOpen(true);          //this hook is set to true
    }

    const closeModal = () => {
        setSelectedCurrentElement(null);
        setOpen(false);
    }

    const expandDeleteModal = (CurrentElement) => {
        //essentially is the iterator passed in pointing to the current element
        setSelectedCurrentElement(CurrentElement);
        setDeleteModalOpen(true);
    }

    const closeDeleteModal = () => {
        setSelectedCurrentElement(null);
        setDeleteModalOpen(false);
    }


    const [SaleEntry, setSaleEntry] = useState([]);
    const [CombinedEntry, setCombinedEntry] = useState({ customerId: '', storeId: '', productId: '' });


    const searchItems = () => {      
        
       axios.get('https://onboardingcrud.azurewebsites.net/api/Customers/').then(response => {

        setCustomerEntries(response.data)
          

       });
       axios.get('https://onboardingcrud.azurewebsites.net/api/Stores/').then(response => {

        setStoreEntries(response.data)

       });
       axios.get('https://onboardingcrud.azurewebsites.net/api/Products/').then(response => {

        setProductEntries(response.data)

       });

       axios.get('https://onboardingcrud.azurewebsites.net/api/Sales/').then(response => {

           setSaleEntry(response.data)     //<-- has the entire array in salesentry
           //console.log([SaleEntry])
       });


    }

    
    useEffect(() => searchItems(), []  );

    const customerList = [...CustomerEntries]
    const storeList = [...StoreEntries]
    const productList = [...ProductEntries]

    



    return (
        <div >
            <p></p>
            <Modal
                onClose={() => setCreateModalOpen(false)}
                onOpen={() => setCreateModalOpen(true)}
                open={CreateModalOpen}
                trigger={<Button primary >New Sale</Button>}
                size={'tiny'}>
                <Header content='Create Sales' />
                <Modal.Content>
                    <Form >
                        <Form.Field>
                            <Container textAlign='justified'><div>Date </div></Container>
                            <Form.Input placeholder='dd-mm-yyyy' width={6} fluid name="dateSold" value={SaleEntry.dateSold}
                                /*onChange={(e) => handleAddName({ "id": '', "productId": '', "customerId": '', "storeId": '', "dateSold": '' }, e)}*/ />

                        </Form.Field>
                        <Form.Field>
                            <Container textAlign='justified'><p>Customer </p></Container>                            
                            <Dropdown
                            placeholder='John'
                            fluid
                            width={12}
                            search
                            selection
                            options = {customerList.map(cl => {
                                return{
                                    key: cl.customerId,
                                    text: cl.name,
                                    value: cl.name
                                }})} />
                        </Form.Field>
                        <Form.Field>
                            <Container textAlign='justified'><p>Product </p></Container>
                            <Dropdown
                                placeholder='Pear'
                                fluid
                                width={12}
                                selection
                                options = {storeList.map(cl => {
                                    return{
                                        key: cl.storeId,
                                        text: cl.name,
                                        value: cl.name
                                    }})} />
                        </Form.Field>
                        <Form.Field>
                            <Container textAlign='justified'><p>Store </p></Container>
                            <Dropdown
                                placeholder='CountDown'
                                fluid
                                width={12}
                                selection
                                options = {productList.map(cl => {
                                    return{
                                        key: cl.productId,
                                        text: cl.name,
                                        value: cl.name
                                    }})} />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => setCreateModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button icon labelPosition='right' color='green' /*onClick={(e) => handleinputAdd()}*/>
                        create
                        <Icon name='checkmark' /></Button>
                </Modal.Actions>
            </Modal>

            <Table celled fixed singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Customer</Table.HeaderCell>
                        <Table.HeaderCell>Product</Table.HeaderCell>
                        <Table.HeaderCell>Store</Table.HeaderCell>
                        <Table.HeaderCell>Date Sold</Table.HeaderCell>
                        
                    </Table.Row>
                </Table.Header>
                
               

            </Table>

        </div>
    );







}


export default Sales;


