import React, { useEffect, useState } from 'react';
import axios from 'axios';     
import { Table, Container, Button, Header, Modal, Icon, Form } from 'semantic-ui-react'  //added
import _ from "lodash";

const pageSize = 5;
const Product = () => {
    // NEW ADD CHRIS
    const [SelectedCurrentElement, setSelectedCurrentElement] = useState(null)   
    const [open, setOpen] = React.useState(false)
    const [CreateModalOpen, setCreateModalOpen] = React.useState(false)
    const [DeleteModalOpen, setDeleteModalOpen] = React.useState(false)

    // PAGINATION
    const [productList, setProductList] = useState([]);
    const [paginatedPosts, setPaginatedPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
 

    const [NewProductName, setNewProductName] = useState([]);
    const [NewProductPrice, setNewProductPrice] = useState([]);
    const apiUrl = 'https://onboardingcrud.azurewebsites.net/api/Products/';
    //const [loading, setLoading] = useState(false);



    useEffect(() => {
        axios.get(apiUrl).then(response => {
         
            setProductList(response.data);
            //slicd(0) = first record
            
        setPaginatedPosts(_(response.data).slice(0).take(pageSize).value());
   
      });
    }, []);

    
    const pageCount = productList? Math.ceil(productList.length/pageSize) :0;

    if (productList.length > 5 && pageCount === 1 )
    {
        return null;
    }

    const pages = _.range(1, pageCount + 1);
    
    const pagination = ( pageNo ) => 
    {   
        setCurrentPage (pageNo);

        axios.get(apiUrl).then(response => {
         
            setProductList(response.data);})

        const startIndex = ( pageNo - 1) * pageSize;
        const paginatedPost = _(productList).slice(startIndex).take(pageSize).value();
        setPaginatedPosts(paginatedPost);
     
        console.log(productList);
        console.log(paginatedPosts);
        console.log (pageNo);
        console.log (currentPage);
        
        
      
    }
 
 //  const onChange = (e, pageInfo) => {
 //      setActivePage(pageInfo.activePage);
 //    setApiUrl('http://localhost:5298/api/Products/?page=' + pageInfo.activePage.toString());
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
     


    const handleChangeName = (ProductName, CurrentIteratorDataValue) => {
        let NameRef = [...paginatedPosts]; 
        const index = NameRef.findIndex((item) => item.productId === ProductName.productId);
        const { name, value } = CurrentIteratorDataValue.target;
        NameRef[index] = { ...ProductName ,[name]: value  };
        setPaginatedPosts(NameRef);
        setSelectedCurrentElement(NameRef[index]);        
    }

    const handleChangePrice = (ProductPrice, CurrentIteratorDataValue) => {
        let NameRef = [...paginatedPosts];
        // finds the index and compares 
        const index = NameRef.findIndex((item) => item.productId === ProductPrice.productId);
        const { name, value } = CurrentIteratorDataValue.target; 
        NameRef[index] = { ...ProductPrice, [name]: value };
        setPaginatedPosts(NameRef);
        // NEW ADD CHRIS
        setSelectedCurrentElement(NameRef[index]);       
    }

    const handleinput = (ProductEntry) => {
        
        if (ProductEntry.name === null || ProductEntry.name.match(/^ *$/) !== null || ProductEntry.price === null || String(ProductEntry.price).match(/^ *$/) !== null) {
            console.log("ERROR!")
        }
        else {
            console.log("SUCCESS", ProductEntry)
            axios.put(apiUrl + ProductEntry.productId, ProductEntry);
            
        }
        
      
    }

    const handleinputDelete = (ProductEntry) => {
        const NameRef = [...paginatedPosts];
        const index = NameRef.findIndex((item) => item.productId === ProductEntry.productId);
        NameRef.splice(index, 1);
        setPaginatedPosts(NameRef);
        axios.delete(apiUrl + ProductEntry.productId);
        console.log("deleted", ProductEntry)
    }

   
    const handleinputAdd = () => {
        let NameRef = [...NewProductName];
        let priceRef = [...NewProductPrice]
        if (priceRef.length !== 0 && NameRef.length !== 0) {
            NameRef[NameRef.length - 1].price = priceRef[priceRef.length - 1].price
            let ProductEntry = { "name": NameRef[NameRef.length - 1].name, "price": NameRef[NameRef.length - 1].price }
            
            axios.post(apiUrl, ProductEntry).then(response => {
                 ProductEntry = { "productId": response.data.productId, "name": NameRef[NameRef.length - 1].name, "price": NameRef[NameRef.length - 1].price }               
                 NameRef[NameRef.length - 1].productId = response.data.productId;
                 setPaginatedPosts(NameRef);           
            });
            
                setCreateModalOpen(false);
        }
        
    }

    const handleAddPrice = (ProductPrice, CurrentIteratorDataValue) => {
        const NameRef = [...paginatedPosts];
        const { name, value } = CurrentIteratorDataValue.target;
        var NewArrayEntry = { ...ProductPrice, [name]: value };
        NameRef.push(NewArrayEntry);
        setNewProductPrice(NameRef);

    }

    const handleAddName = (ProductName, CurrentIteratorDataValue) => {
        const NameRef = [...paginatedPosts];
        const { name, value } = CurrentIteratorDataValue.target;
        var NewArrayEntry = { ...ProductName,  [name]: value };
        NameRef.push(NewArrayEntry);
        setNewProductName(NameRef)
              
    }

      
  


    return (
        <div >
            <p></p>           
            <Modal 
                onClose={() => setCreateModalOpen(false)}
                onOpen={() => setCreateModalOpen(true)}
                open={CreateModalOpen}
                trigger={<Button primary >New Product</Button>}
                size={'tiny'}>
                <Header content='Create Product' />
                <Modal.Content>
                    <Form >
                        <Form.Field>
                            <Container textAlign='justified'><div>Name </div></Container>
                            <Form.Input placeholder='Name' width={12} fluid name="name" value={paginatedPosts.name}
                                onChange={(e) => handleAddName({ "productId": '', "name": '', "price": ''}, e)} />

                        </Form.Field>
                        <Form.Field>
                            <Container textAlign='justified'><p>price </p></Container>
                            <Form.Input placeholder='price' width={12} fluid name="price" value={paginatedPosts.name}
                                onChange={(e) => handleAddPrice({ "productId": '', "name": '', "price": ''}, e)} />
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
                        <Table.HeaderCell>Price</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body >   
                    {paginatedPosts.map((Productz) => (                       
                        <tr key={Productz.productId}> 
                            <Table.Cell >{Productz.name}</Table.Cell>
                            <Table.Cell >{Productz.price}</Table.Cell>
                            <Table.Cell>
                                <Button color='yellow' onClick={() => expandModal(Productz)} ><Icon name='calendar check' /> Edit</Button>
                                <Modal
                                    open={open} 
                                    onClose={() => setOpen(false)}  
                                    onOpen={() => setOpen(true)}   
                                size={'tiny'}>
                                <Header content='Edit Product' />
                                <Modal.Content>
                                    {
                                        <Form >
                                            <Form.Field>
                                                <Container textAlign='justified'><div>Name </div></Container>
                                                    <Form.Input placeholder='Name' width={12} value={SelectedCurrentElement && SelectedCurrentElement.name}
                                                        name="name" onChange={handleChangeName.bind(this, SelectedCurrentElement)} />
                                            </Form.Field>
                                            <Form.Field>
                                                <Container textAlign='justified'><p>price </p></Container>
                                                    <Form.Input placeholder='price' width={12} value={SelectedCurrentElement && SelectedCurrentElement.price} name="price" onChange={handleChangePrice.bind(this, SelectedCurrentElement)} />
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
                                <Button color='red' onClick={() => expandDeleteModal(Productz)}><Icon name='trash alternate' />Delete</Button>
                                <Modal open={DeleteModalOpen}
                                    onClose={() => setDeleteModalOpen(false)}
                                    onOpen={() => setDeleteModalOpen(true)}>
                                <Header content='Delete Product' />
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

export default Product;
