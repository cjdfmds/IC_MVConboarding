
import React, { useEffect, useState } from 'react';
import axios from 'axios';      //for LINKING with backend
import { Table, Container, Button, Header, Modal,Icon,  Form } from 'semantic-ui-react'  //added
import _ from "lodash";

const pageSize = 5;
const Customer = () => {
    // NEW ADD CHRIS
    const [SelectedCurrentElement, setSelectedCurrentElement] = useState(null)   
    const [open, setOpen] = React.useState(false)
    const [CreateModalOpen, setCreateModalOpen] = React.useState(false)
    const [DeleteModalOpen, setDeleteModalOpen] = React.useState(false)

    // PAGINATION
    const [customerList, setCustomerList] = useState([]);
    const [paginatedPosts, setPaginatedPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
 

    const [newCustomerName, setNewCustomerName] = useState([]);
    const [newCustomerAddress, setNewCustomerAddress] = useState([]);
    const apiUrl = 'https://onboardingcrud.azurewebsites.net/api/Customers/';
    //const [loading, setLoading] = useState(false);



    useEffect(() => {
        axios.get(apiUrl).then(response => {
         
            setCustomerList(response.data);
            //slicd(0) = first record
            
        setPaginatedPosts(_(response.data).slice(0).take(pageSize).value());
   
      });
    }, []);

    
    const pageCount = customerList? Math.ceil(customerList.length/pageSize) :0;

    if (customerList.length > 5 && pageCount === 1 )
    {
        return null;
    }

    const pages = _.range(1, pageCount + 1);
    
    const pagination = ( pageNo ) => 
    {   
        setCurrentPage (pageNo);

        axios.get(apiUrl).then(response => {
         
            setCustomerList(response.data);})

        const startIndex = ( pageNo - 1) * pageSize;
        const paginatedPost = _(customerList).slice(startIndex).take(pageSize).value();
        setPaginatedPosts(paginatedPost);
     
        console.log(customerList);
        console.log(paginatedPosts);
        console.log (pageNo);
        console.log (currentPage);
        
        
      
    }
 
 //  const onChange = (e, pageInfo) => {
 //      setActivePage(pageInfo.activePage);
 //    setApiUrl('http://localhost:5298/api/Customers/?page=' + pageInfo.activePage.toString());
 //  };
    


    // MODAL WINDOW
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
     


    const handleChangeName = (CustomerName, CurrentIteratorDataValue) => {
        let NameRef = [...paginatedPosts]; 
        const index = NameRef.findIndex((item) => item.customerId === CustomerName.customerId);
        const { name, value } = CurrentIteratorDataValue.target;
        NameRef[index] = { ...CustomerName ,[name]: value  };
        setPaginatedPosts(NameRef);
        setSelectedCurrentElement(NameRef[index]);        
    }

    const handleChangeAddress = (CustomerAddress, CurrentIteratorDataValue) => {
        let NameRef = [...paginatedPosts];
        // finds the index and compares 
        const index = NameRef.findIndex((item) => item.customerId === CustomerAddress.customerId);
        const { name, value } = CurrentIteratorDataValue.target; 
        NameRef[index] = { ...CustomerAddress, [name]: value };
        setPaginatedPosts(NameRef);
        // NEW ADD CHRIS
        setSelectedCurrentElement(NameRef[index]);       
    }

    const handleinput = (CustomerEntry) => {
        
        if (CustomerEntry.name === null || CustomerEntry.name.match(/^ *$/) !== null || CustomerEntry.address === null || CustomerEntry.address.match(/^ *$/) !== null) {
            console.log("ERROR!")
        }
        else {
            console.log("SUCCESS", CustomerEntry)
            axios.put(apiUrl + CustomerEntry.customerId, CustomerEntry);
            
        }
        
      
    }

    const handleinputDelete = (CustomerEntry) => {
        const NameRef = [...paginatedPosts];
        const index = NameRef.findIndex((item) => item.customerId === CustomerEntry.customerId);
        NameRef.splice(index, 1);
        setPaginatedPosts(NameRef);
        axios.delete(apiUrl + CustomerEntry.customerId);
        console.log("deleted", CustomerEntry)
    }

   
    const handleinputAdd = () => {
        let NameRef = [...newCustomerName];
        let addressRef = [...newCustomerAddress]
        if (addressRef.length !== 0 && NameRef.length !== 0) {
            NameRef[NameRef.length - 1].address = addressRef[addressRef.length - 1].address
            let CustomerEntry = { "name": NameRef[NameRef.length - 1].name, "address": NameRef[NameRef.length - 1].address }
            
            axios.post(apiUrl, CustomerEntry).then(response => {
                CustomerEntry = { "customerId": response.data.customerId, "name": NameRef[NameRef.length - 1].name, "address": NameRef[NameRef.length - 1].address }               
                 NameRef[NameRef.length - 1].customerId = response.data.customerId;
                 setPaginatedPosts(NameRef);           
            });
            
                setCreateModalOpen(false);
        }
        
    }

    const handleAddAddress = (CustomerAddress, CurrentIteratorDataValue) => {
        const NameRef = [...paginatedPosts];
        const { name, value } = CurrentIteratorDataValue.target;
        var NewArrayEntry = { ...CustomerAddress, [name]: value };
        NameRef.push(NewArrayEntry);
        setNewCustomerAddress(NameRef);

    }

    const handleAddName = (CustomerName, CurrentIteratorDataValue) => {
        const NameRef = [...paginatedPosts];
        const { name, value } = CurrentIteratorDataValue.target;
        var NewArrayEntry = { ...CustomerName,  [name]: value };
        NameRef.push(NewArrayEntry);
        setNewCustomerName(NameRef)
              
    }

      
  


    return (
        <div >
            <p></p>           
            <Modal 
                onClose={() => setCreateModalOpen(false)}
                onOpen={() => setCreateModalOpen(true)}
                open={CreateModalOpen}
                trigger={<Button primary >New Customer</Button>}
                size={'tiny'}>
                <Header content='Create Customer' />
                <Modal.Content>
                    <Form >
                        <Form.Field>
                            <Container textAlign='justified'><div>Name </div></Container>
                            <Form.Input placeholder='Name' width={12} fluid name="name" value={paginatedPosts.name}
                                onChange={(e) => handleAddName({ "customerId": '', "name": '', "address": ''}, e)} />

                        </Form.Field>
                        <Form.Field>
                            <Container textAlign='justified'><p>address </p></Container>
                            <Form.Input placeholder='address' width={12} fluid name="address" value={paginatedPosts.name}
                                onChange={(e) => handleAddAddress({ "customerId": '', "name": '', "address": ''}, e)} />
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
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Address</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body >   
                    {paginatedPosts.map((Customerz) => (                       
                        <tr key={Customerz.customerId}> 
                            <Table.Cell >{Customerz.name}</Table.Cell>
                            <Table.Cell >{Customerz.address}</Table.Cell>
                            <Table.Cell>
                                <Button color='yellow' onClick={() => expandModal(Customerz)} ><Icon name='calendar check' /> Edit</Button>
                                <Modal
                                    open={open} 
                                    onClose={() => setOpen(false)}  
                                    onOpen={() => setOpen(true)}   
                                size={'tiny'}>
                                <Header content='Edit Customer' />
                                <Modal.Content>
                                    {
                                        <Form >
                                            <Form.Field>
                                                <Container textAlign='justified'><div>Name </div></Container>
                                                    <Form.Input placeholder='Name' width={12} value={SelectedCurrentElement && SelectedCurrentElement.name}
                                                        name="name" onChange={handleChangeName.bind(this, SelectedCurrentElement)} />
                                            </Form.Field>
                                            <Form.Field>
                                                <Container textAlign='justified'><p>Address </p></Container>
                                                    <Form.Input placeholder='address' width={12} value={SelectedCurrentElement && SelectedCurrentElement.address} name="address" onChange={handleChangeAddress.bind(this, SelectedCurrentElement)} />
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
                                <Button color='red' onClick={() => expandDeleteModal(Customerz)}><Icon name='trash alternate' />Delete</Button>
                                <Modal open={DeleteModalOpen}
                                    onClose={() => setDeleteModalOpen(false)}
                                    onOpen={() => setDeleteModalOpen(true)}>
                                <Header content='Delete Customer' />
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


            <nav className="d-flex justify-content-center">
                <ul className="pagination">
                    {
                        pages.map((page, index) => (
                         
                        <li key={index}
                        className={
                            page === currentPage ? "page-item active":"page-item" }
                           
                            >

                            <p className="page-link"
                            onClick={() => {pagination(page); setCurrentPage(page)}}>
                            {page}</p>          
                  
                        </li>
                    ))}
                </ul>
            </nav>

        </div>
    );

}

export default Customer;
