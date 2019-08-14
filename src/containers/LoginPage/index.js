import React from 'react'
import {Button, Form, Grid, Header, Message, Segment} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import {isLoggedIn, Login} from '../../services/LoginService';
import {Redirect} from "react-router-dom";

export class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            isLoading: false,
            isError: false,
            isLoggedIn: false
        };
    }

    /**
     * Login to app
     * @private
     */
    _login = () => {
        this.setState({isError: false});

        if (!this.state.username || !this.state.password) return; // login only if user entered username and password
        Login(this.state.username, this.state.password).then(() => {
            this.setState({isLoading: false, isError: false});
            this.props.history.push('/'); // goto import page
        }).catch((error) => {
            this.setState({isLoading: false, isError: true});
        });
    };

    render() {
        if (isLoggedIn()) {
            return (<Redirect to={{pathname: '/', state: {from: this.props.location}}}/>);
        }

        return (
            <Grid textAlign='center' style={{height: '100vh'}} verticalAlign='middle'>
                <Grid.Column style={{maxWidth: 450}}>
                    <Header as='h2' color='teal' textAlign='center'>
                        Log-in to your account
                    </Header>
                    <Form size='large'>
                        <Segment loading={this.state.isLoading}>
                            <Form.Input
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='E-mail address'
                                onChange={(e, data) => {
                                    this.setState({username: data.value.trim()});
                                }}/>
                            <Form.Input
                                fluid
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                type='password'
                                onChange={(e, data) => {
                                    this.setState({password: data.value.trim()});
                                }}
                            />

                            <Button color='teal' fluid size='huge' onClick={this._login}
                                    disabled={this.state.isLoading}>
                                Login
                            </Button>
                        </Segment>
                    </Form>
                    <Message
                        negative
                        icon='exclamation'
                        content={!this.state.isError ? 'Must be signed in' : 'Login error'}
                    />
                </Grid.Column>
            </Grid>
        )
    }
}

export default LoginPage;
