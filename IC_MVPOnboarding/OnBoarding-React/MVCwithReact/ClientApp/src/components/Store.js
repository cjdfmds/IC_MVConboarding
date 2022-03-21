
import React, { useEffect, useState } from 'react';
import axios from 'axios';     
import { Table, Container, Button, Header, Modal, Icon, Form } from 'semantic-ui-react'  //added
import _ from "lodash";


const pageSize = 5;
const Store = () => {
    // NEW ADD CHRIS
    const [SelectedCurrentElement, setSelectedCurrentElement] = useState(null)   
    const [open, setOpen] = React.useState(false)
    const [CreateModalOpen, setCreateModalOpen] = React.useState(false)
    const [DeleteModalOpen, setDeleteModalOpen] = React.useState(false)

    // PAGINATION
    const [storeList, setStoreList] = useState([]);
    const [paginatedPosts, setPaginatedPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
 

    const [newStoreName, setNewStoreName] = useState([]);
    const [newStoreAddress, setNewStoreAddress] = useState([]);
    const apiUrl = 'https://onboardingcrud.azurewebsites.net/api/Stores/';
    //const [loading, setLoading] = useState(false);



    useEffect(() => {
        axios.get(apiUrl).then(response => {
         
            setStoreList(response.data);
            //slicd(0) = first record
            
        setPaginatedPosts(_(response.data).slice(0).take(pageSize).value());
   
      });
    }, []);

    
    const pageCount = storeList? Math.ceil(storeList.length/pageSize) :0;

    if (storeList.length > 5 && pageCount === 1 )
    {
        return null;
    }

    const pages = _.range(1, pageCount + 1);
    
    const pagination = ( pageNo ) => 
    {   
        setCurrentPage (pageNo);

        axios.get(apiUrl).then(response => {
         
            setStoreList(response.data);})

        const startIndex = ( pageNo - 1) * pageSize;
        const paginatedPost = _(storeList).slice(startIndex).take(pageSize).value();
        setPaginatedPosts(paginatedPost);
     
        console.log(storeList);
        console.log(paginatedPosts);
        console.log (pageNo);
        console.log (currentPage);
        
        
      
    }
 
 //  const onChange = (e, pageInfo) => {
 //      setActivePage(pageInfo.activePage);
 //    setApiUrl('http://localhost:5298/api/Stores/?page=' + pageInfo.activePage.toString());
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
     


    const handleChangeName = (StoreName, CurrentIteratorDataValue) => {
        let NameRef = [...paginatedPosts]; 
        const index = NameRef.findIndex((item) => item.storeId === StoreName.storeId);
        const { name, value } = CurrentIteratorDataValue.target;
        NameRef[index] = { ...StoreName ,[name]: value  };
        setPaginatedPosts(NameRef);
        setSelectedCurrentElement(NameRef[index]);        
    }

    const handleChangeAddress = (StoreAddress, CurrentIteratorDataValue) => {
        let NameRef = [...paginatedPosts];
        // finds the index and compares 
        const index = NameRef.findIndex((item) => item.storeId === StoreAddress.storeId);
        const { name, value } = CurrentIteratorDataValue.target; 
        NameRef[index] = { ...StoreAddress, [name]: value };
        setPaginatedPosts(NameRef);
        // NEW ADD CHRIS
        setSelectedCurrentElement(NameRef[index]);       
    }

    const handleinput = (StoreEntry) => {
        
        if (StoreEntry.name === null || StoreEntry.name.match(/^ *$/) !== null || StoreEntry.address === null || StoreEntry.address.match(/^ *$/) !== null) {
            console.log("ERROR!")
        }
        else {
            console.log("SUCCESS", StoreEntry)
            axios.put(apiUrl + StoreEntry.storeId, StoreEntry);
            
        }
        
      
    }

    const handleinputDelete = (StoreEntry) => {
        const NameRef = [...paginatedPosts];
        const index = NameRef.findIndex((item) => item.storeId === StoreEntry.storeId);
        NameRef.splice(index, 1);
        setPaginatedPosts(NameRef);
        axios.delete(apiUrl + StoreEntry.storeId);
        console.log("deleted", StoreEntry)
    }

   
    const handleinputAdd = () => {
        let NameRef = [...newStoreName];
        let addressRef = [...newStoreAddress]
        if (addressRef.length !== 0 && NameRef.length !== 0) {
            NameRef[NameRef.length - 1].address = addressRef[addressRef.length - 1].address
            let StoreEntry = { "name": NameRef[NameRef.length - 1].name, "address": NameRef[NameRef.length - 1].address }
            
            axios.post(apiUrl, StoreEntry).then(response => {
                 StoreEntry = { "storeId": response.data.storeId, "name": NameRef[NameRef.length - 1].name, "address": NameRef[NameRef.length - 1].address }               
                 NameRef[NameRef.length - 1].storeId = response.data.storeId;
                 setPaginatedPosts(NameRef);           
            });
            
                setCreateModalOpen(false);
        }
        
    }

    const handleAddAddress = (StoreAddress, CurrentIteratorDataValue) => {
        const NameRef = [...paginatedPosts];
        const { name, value } = CurrentIteratorDataValue.target;
        var NewArrayEntry = { ...StoreAddress, [name]: value };
        NameRef.push(NewArrayEntry);
        setNewStoreAddress(NameRef);

    }

    const handleAddName = (StoreName, CurrentIteratorDataValue) => {
        const NameRef = [...paginatedPosts];
        const { name, value } = CurrentIteratorDataValue.target;
        var NewArrayEntry = { ...StoreName,  [name]: value };
        NameRef.push(NewArrayEntry);
        setNewStoreName(NameRef)
              
    }

      
  


    return (
        <div >
            <p></p>           
            <Modal 
                onClose={() => setCreateModalOpen(false)}
                onOpen={() => setCreateModalOpen(true)}
                open={CreateModalOpen}
                trigger={<Button primary >New Store</Button>}
                size={'tiny'}>
                <Header content='Create Store' />
                <Modal.Content>
                    <Form >
                        <Form.Field>
                            <Container textAlign='justified'><div>Name </div></Container>
                            <Form.Input placeholder='Name' width={12} fluid name="name" value={paginatedPosts.name}
                                onChange={(e) => handleAddName({ "storeId": '', "name": '', "address": ''}, e)} />

                        </Form.Field>
                        <Form.Field>
                            <Container textAlign='justified'><p>address </p></Container>
                            <Form.Input placeholder='address' width={12} fluid name="address" value={paginatedPosts.name}
                                onChange={(e) => handleAddAddress({ "storeId": '', "name": '', "address": ''}, e)} />
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
                    {paginatedPosts.map((Storez) => (                       
                        <tr key={Storez.storeId}> 
                            <Table.Cell >{Storez.name}</Table.Cell>
                            <Table.Cell >{Storez.address}</Table.Cell>
                            <Table.Cell>
                                <Button color='yellow' onClick={() => expandModal(Storez)} ><Icon name='calendar check' /> Edit</Button>
                                <Modal
                                    open={open} 
                                    onClose={() => setOpen(false)}  
                                    onOpen={() => setOpen(true)}   
                                size={'tiny'}>
                                <Header content='Edit Store' />
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
                                <Button color='red' onClick={() => expandDeleteModal(Storez)}><Icon name='trash alternate' />Delete</Button>
                                <Modal open={DeleteModalOpen}
                                    onClose={() => setDeleteModalOpen(false)}
                                    onOpen={() => setDeleteModalOpen(true)}>
                                <Header content='Delete Store' />
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

export default Store;
