
import React, { useEffect, useState } from 'react';
import axios from 'axios';      //for LINKING with backend
import { Dropdown,Table, Container, Button, Header, Modal, Icon, Form } from 'semantic-ui-react'  //added


const Sales = () => {

    const [SelectedCurrentElement, setSelectedCurrentElement] = useState(null)
    const [open, setOpen] = React.useState(false)
    const [CreateModalOpen, setCreateModalOpen] = React.useState(false)
    const [DeleteModalOpen, setDeleteModalOpen] = React.useState(false)

    const [SaleEntry, setSaleEntry] = useState([]);
    const [Customer, setCustomer] = useState([])
    const [Product, setProduct] = useState([])
    const [Store, setStore] = useState([])
   
    const expandModal = (CurrentElement) => {
        setSelectedCurrentElement(CurrentElement); 
        setOpen(true);        
    }

    const closeModal = () => {
        setSelectedCurrentElement(null);
        setOpen(false);
    }

    const expandDeleteModal = (CurrentElement) => {
        setSelectedCurrentElement(CurrentElement);
        setDeleteModalOpen(true);
    }

    const closeDeleteModal = () => {
        setSelectedCurrentElement(null);
        setDeleteModalOpen(false);
    }


    const searchItems = () => {
       
        
        axios.get("https://onboardingcrud.azurewebsites.net/api/Customers").then(response => {
            for (var i = 0; i < response.data.length; i++) {
                Customer.push({ key: response.data[i].customerId, text: response.data[i].name, value: response.data[i].name });
            }            
           
        });
        axios.get("https://onboardingcrud.azurewebsites.net/api/Stores").then(response => {

            for (var i = 0; i < response.data.length; i++) {
                Store.push({ key: response.data[i].storeId, text: response.data[i].name, value: response.data[i].name });

            }
           
        });
        axios.get("https://onboardingcrud.azurewebsites.net/api/Products").then(response => {
            for (var i = 0; i < response.data.length; i++) {
                Product.push({ key: response.data[i].productId, text: response.data[i].name, value: response.data[i].name });

            }
           
        });

        axios.get("https://onboardingcrud.azurewebsites.net/api/Sales").then(response => {
            setSaleEntry(response.data)      
        });

    }

    
    useEffect(() => searchItems(), []  );

    const [NewSoldDate, setNewSoldDate] = useState([]);
    const [NewCustomer, setNewCustomer] = useState([]);
    const [NewProduct, setNewProduct] = useState([]);
    const [NewStore, setNewStore] = useState([]);

    const handleChangeDateSold = (CurrentElement, CurrentIteratorDataValue) => {

        let NameRef = [...SaleEntry];

        const index = NameRef.findIndex((item) => item.id === CurrentElement.id);
        
        NameRef[index] = { ...CurrentElement, 'dateSold': CurrentIteratorDataValue.target.value };
        setSaleEntry(NameRef);      
        setSelectedCurrentElement(NameRef[index]);
       // console.log(SaleEntry)
    }

   
    const handleChangeProduct = (CurrentElement, CurrentIteratorDataValue) => {
      
        let NameRef = [...SaleEntry];
    
        const index = NameRef.findIndex((item) => item.id === CurrentElement.id);
     
        NameRef[index] = { ...CurrentElement, 'productId': CurrentIteratorDataValue.target.outerText };
        setSaleEntry(NameRef);        
        setSelectedCurrentElement(NameRef[index]);

    }
    
    const handleChangeCustomer = (CurrentElement, CurrentIteratorDataValue) => {
        let NameRef = [...SaleEntry];
        const index = NameRef.findIndex((item) => item.id === CurrentElement.id);
        NameRef[index] = { ...CurrentElement, 'customerId': CurrentIteratorDataValue.target.outerText };
        setSaleEntry(NameRef);       
        setSelectedCurrentElement(NameRef[index]);
    }

    const handleChangeStore = (CurrentElement, CurrentIteratorDataValue) => {
        let NameRef = [...SaleEntry];
        const index = NameRef.findIndex((item) => item.id === CurrentElement.id);
        NameRef[index] = { ...CurrentElement, 'storeId': CurrentIteratorDataValue.target.outerText };
        setSaleEntry(NameRef);
 
        setSelectedCurrentElement(NameRef[index]);
    }



    const handleinput = (SalesEntry) => {
       
        if (SalesEntry.productId === null || SalesEntry.productId.match(/^ *$/) !== null || SalesEntry.customerId === null || SalesEntry.customerId.match(/^ *$/) !== null || SalesEntry.storeId === null || SalesEntry.storeId.match(/^ *$/) !== null || SalesEntry.dateSold === null || SalesEntry.dateSold.toString().match(/^ *$/) !== null) {
         
            console.log("ERROR!!!!!! EMPTY ENTRY!!!!!!!!")
        }
        else {
            console.log("SUCCESS ITS NOT AN EMPTY ENTRY, current array = ", SalesEntry)
            axios.put('https://onboardingcrud.azurewebsites.net/api/Sales/' + SalesEntry.id, SalesEntry);
           
        }
    }

    const handleinputDelete = (CurrentEntry) => {      
        const NameRef = [...SaleEntry];
        const index = NameRef.findIndex((item) => item.id === CurrentEntry.id);
        NameRef.splice(index, 1);       
        setSaleEntry(NameRef);
        axios.delete('https://onboardingcrud.azurewebsites.net/api/Sales/' + CurrentEntry.id);
        console.log("You have deleted this entry ->", CurrentEntry)
    }


    const handleinputAdd = () => {

        let ProductArray = [...NewProduct]
        let CustomerArray = [...NewCustomer]
        let StoreArray = [...NewStore]
        let DateSoldArray = [...NewSoldDate];       
              

        if (StoreArray.length != 0 && DateSoldArray.length != 0 && CustomerArray.length != 0 && ProductArray.length!=0) {
         
            ProductArray[ProductArray.length - 1].customerId = CustomerArray[CustomerArray.length - 1].customerId
            ProductArray[ProductArray.length - 1].storeId = StoreArray[StoreArray.length - 1].storeId
            ProductArray[ProductArray.length - 1].dateSold = DateSoldArray[DateSoldArray.length - 1].dateSold
           
            console.log("THIS IS THE PENDING ENTRY WAITING TO BE PUSHED!!!!!!", ProductArray)
        
            let CurrentEntry = {
                "productId": ProductArray[ProductArray.length - 1].productId, "customerId": ProductArray[ProductArray.length - 1].customerId,
                "storeId": ProductArray[ProductArray.length - 1].storeId, "dateSold": ProductArray[ProductArray.length - 1].dateSold
            }

            console.log("YOU MUST ENTER INPUTS IN BOTH FIELDS, OTHERWISE THE CODE BREAKS, CURRENT ENTRY THAT WAS INPUTTED", CurrentEntry)

            axios.post("https://onboardingcrud.azurewebsites.net/api/Sales", CurrentEntry).then(response => {
             
                CurrentEntry = {
                    "id": response.data.id, "productId": ProductArray[ProductArray.length - 1].productId, "customerId": ProductArray[ProductArray.length - 1].customerId,
                    "storeId": ProductArray[ProductArray.length - 1].storeId, "dateSold": ProductArray[ProductArray.length - 1].dateSold }
               
                ProductArray[ProductArray.length - 1].id = response.data.id;               
                setSaleEntry(ProductArray);
            });           

            //CLOSE THE MODAL
            setCreateModalOpen(false);
        }
    }



    const handleAddDateSold = (DateEntry, CurrentIteratorDataValue) => {     
        
        let NameRef = [...SaleEntry];
        const { name, value } = CurrentIteratorDataValue.target;
        var NewArrayEntry = { ...DateEntry, [name]: value };       
        NameRef.push(NewArrayEntry);
        setNewSoldDate(NameRef)
        console.log("date entry", value)
    }
    
    const handleAddCustomer = (CustomerEntry, CurrentIteratorDataValue) => {
       
        let NameRef = [...SaleEntry];
       
        var NewArrayEntry = { ...CustomerEntry, "customerId": CurrentIteratorDataValue.target.outerText };       
        NameRef.push(NewArrayEntry);
        setNewCustomer(NameRef)
        console.log("customers entry",NameRef)
    }
    
    const handleAddProduct = (ProductEntry, CurrentIteratorDataValue) => {     
        let NameRef = [...SaleEntry];
        var NewArrayEntry = { ...ProductEntry, "productId": CurrentIteratorDataValue.target.outerText };
        NameRef.push(NewArrayEntry);
        setNewProduct(NameRef)
        console.log("products entry", NameRef)
    }
    
    const handleAddStore = (StoreEntry, CurrentIteratorDataValue) => {     
        let NameRef = [...SaleEntry];
        var NewArrayEntry = { ...StoreEntry, "storeId": CurrentIteratorDataValue.target.outerText };      
        NameRef.push(NewArrayEntry);
        setNewStore(NameRef)
        console.log("stores entry", NameRef)
    }



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
                            <Container textAlign='justified'><div>Date Sold </div></Container>
                            <Form.Input placeholder='dd-mm-yyyy' width={6} fluid name="dateSold" value={SaleEntry.dateSold} type="date" data-date-format="DD MMMM YYYY"
                                onChange={(e) => handleAddDateSold({ "dateSold": '' }, e)} />

                        </Form.Field>
                        <Form.Field>                           
                            <Container textAlign='justified'><p>Customer </p></Container>                        
                            <Dropdown
                            placeholder='John'
                            fluid
                            width={12}
                            search
                            selection                                
                            options={Customer}
                            onChange={(e) => handleAddCustomer({ "customerId": '' }, e)}
                              
                            />
                        </Form.Field>
                        <Form.Field>
                            <Container textAlign='justified'><p>Product </p></Container>
                            <Dropdown
                                placeholder='Pear'
                                fluid
                                width={12}
                                selection
                                options={Product}
                                onChange={(e) => handleAddProduct({  "productId": '' }, e)}
                               />
                        </Form.Field>
                        <Form.Field>
                            <Container textAlign='justified'><p>Store </p></Container>
                            <Dropdown
                                placeholder='CountDown'
                                fluid
                                width={12}
                                selection
                                options={Store}
                                onChange={(e) => handleAddStore({  "storeId": '' }, e)}
                            />
                        </Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => setCreateModalOpen(false)}>
                        Cancel
                    </Button>
                    <Button icon labelPosition='right' color='green' onClick={(e) => handleinputAdd()}>
                        create
                        <Icon name='checkmark' /></Button>
                </Modal.Actions>
            </Modal>

            <Table celled fixed singleLine>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell col>Customer</Table.HeaderCell>
                        <Table.HeaderCell>Product</Table.HeaderCell>
                        <Table.HeaderCell>Store</Table.HeaderCell>
                        <Table.HeaderCell>Date Sold</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        
                    </Table.Row>
                </Table.Header>

                <Table.Body >
                    {SaleEntry.map(Salez => (
                        <tr key={Salez.id}>
                            <Table.Cell >{Salez.customerId}</Table.Cell>
                            <Table.Cell >{Salez.productId}</Table.Cell>
                            <Table.Cell >{Salez.storeId}</Table.Cell>
                            <Table.Cell >{Salez.dateSold}</Table.Cell>
                            <Table.Cell>
                                <Button color='yellow' onClick={() => expandModal(Salez)} ><Icon name='calendar check' /> Edit</Button>
                                <Modal
                                    open={open} //open attribute is set to the 'open' variable in the hook
                                    onClose={() => setOpen(false)}  //onClose attribute is called when a close event happens, & the hook is set to false 
                                    onOpen={() => setOpen(true)}    //onOpen attribute is called when a open event happens, & the hook is set to true
                                    size={'tiny'}>
                                    <Header content='Edit Sales' />
                                    <Modal.Content>
                                        {
                                            <Form >
                                                <Form.Field>
                                                    <Container textAlign='justified'><div>Date Sold </div></Container>                                                  
                                                    <Form.Input placeholder='dd-mm-yyyy' width={6} fluid name="dateSold" value={SelectedCurrentElement && SelectedCurrentElement.dateSold} type="date" data-date-format="DD MMMM YYYY"
                                                        onChange={handleChangeDateSold.bind(this, SelectedCurrentElement)} />

                                                </Form.Field>


                                                <Form.Field>
                                                    <Container textAlign='justified'><p>Customer </p></Container>
                                                    <Dropdown
                                                        placeholder='John'
                                                        fluid
                                                        width={12}
                                                        search
                                                        selection
                                                        options={Customer}
                                                        onChange={handleChangeCustomer.bind(this, SelectedCurrentElement)}/>
                                                </Form.Field>

                                                <Form.Field>
                                                    <Container textAlign='justified'><p>Product </p></Container>
                                                    <Dropdown
                                                        placeholder='Pear'
                                                        fluid
                                                        width={12}
                                                        selection
                                                        options={Product}
                                                        onChange={handleChangeProduct.bind(this, SelectedCurrentElement)}
                                                          />
                                                </Form.Field>

                                                <Form.Field>
                                                    <Container textAlign='justified'><p>Store </p></Container>
                                                    <Dropdown
                                                        placeholder='CountDown'
                                                        fluid
                                                        width={12}
                                                        selection
                                                        options={Store}
                                                        onChange={handleChangeStore.bind(this, SelectedCurrentElement)}                                                    />
                                                </Form.Field>


                                            </Form>
                                        }
                                    </Modal.Content>

                                    <Modal.Actions>
                                        <Button color='black' onClick={closeModal}>
                                            Cancel
                                        </Button>
                                        <Button icon labelPosition='right' color='green' onClick={() => {
                                            handleinput(SelectedCurrentElement);
                                            closeModal();
                                        }} >
                                            edit
                                            <Icon name='checkmark' /></Button>
                                    </Modal.Actions>
                                </Modal>
                            </Table.Cell>
                            


                            <Table.Cell>
                                <Button color='red' onClick={() => expandDeleteModal(Salez)}><Icon name='trash alternate' />Delete</Button>
                                <Modal open={DeleteModalOpen}
                                    onClose={() => setDeleteModalOpen(false)}
                                    onOpen={() => setDeleteModalOpen(true)}>
                                    <Header content='Delete Sales' />
                                    <Modal.Content>
                                        <b>Are you Sure?</b>
                                    </Modal.Content>
                                    <Modal.Actions>
                                        <Button color='black' onClick={closeDeleteModal}>
                                            Cancel
                                        </Button>
                                        <Button color='red' onClick={(e) => { handleinputDelete(SelectedCurrentElement); closeDeleteModal() }}>
                                            <Icon name='close' /> delete
                                        </Button>
                                    </Modal.Actions>
                                </Modal>
                            </Table.Cell>
                        </tr>
                    ))}

                </Table.Body>



                


               
               

            </Table>

        </div>
    );







}


export default Sales;
