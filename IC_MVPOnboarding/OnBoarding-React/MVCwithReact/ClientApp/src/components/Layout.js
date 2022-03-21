import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { Menu, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import './NavMenu.css';



export class Layout extends Component {
    static displayName = Layout.name;

    state = { activeItem: 'Home' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  

    //In the render we are using the 'to=' tag  which is a react attribute, enables us to and load the data in any file specified 
    render() {

        const { activeItem } = this.state
        
        return (
            <div>                
                <Segment inverted>
                        <Menu inverted secondary>
                        <Menu.Item
                                as={Link } to="/Home"
                                name='React'
                                active={activeItem === 'React'}
                                onClick={this.handleItemClick}
                                
                            />

                            <Menu.Item
                                as={Link } to="/Customer"
                                name='Customers'
                                active={activeItem === 'Customers'}
                                onClick={this.handleItemClick}
                                
                            />
                            <Menu.Item
                                as={Link }to="/Product"
                                name='Products'
                                active={activeItem === 'Products'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                            as={Link} to="/Store"
                                name='Stores'
                                active={activeItem === 'Stores'}
                                onClick={this.handleItemClick}
                            
                            />
                            <Menu.Item
                                as={Link} to="/Sale"
                                name='Sales'
                                active={activeItem === 'Sales'}
                                onClick={this.handleItemClick}

                            />
                        </Menu>
                    </Segment>               
                <Container>
                    {this.props.children}
                </Container>
            </div>
        );
    }
}

//{this.props.children} part translates the data into what we see.
















